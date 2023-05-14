const WebSocket = require('ws');
const ProtoBufJs = require("protobufjs");
var root = ProtoBufJs.loadSync("../experiments/world.proto");

const Minx = 13600;  
const Miny = 15600;  
const speed_delay = 0.5;

// 修改对应t值和终点坐标（如果是全图打卡不需要修改终点坐标，如果需要单点传送请看第43行注释部分）
let token = "";
var wsURL = `wss://cat-match.easygame2021.com/gateway/ws?token=${token}&login_type=0`;

const fs = require('fs');
var position_data = {}
var checkin_num = 0;

// const position_data = require('./position_coord_shortest.json')
try {
    const data = fs.readFileSync('../experiments/position_coord_shortest.json', 'utf8');
    // position_data = data.replace("{","(").replace("}",")");
    position_data = JSON.parse(data);
} catch (err) {
    console.log(`Error reading file from disk: ${err}`);
}

var position_index = []; // 索引
var position_list = [];
// { name: '湖南1', location: [ 7100, 3300 ] },
for(var item in position_data) {
    position_index.push(position_data[item].name);
    position_list.push(position_data[item].location);
}

var target_pos = {
    x:position_list[0][0], 
    y:position_list[0][1]
};  // 这里修改坐标

// var target_pos = {
//     1111, 
//     2222
// };  // 如果需要去单点打卡 或者 去某个地方 把35-38行注释掉 把40-43行放开 并修改目标地点

console.log(target_pos);
var totalposition_num = position_index.length;
// console.log(position_index)
// console.log(position_list)

let socket = null;
let tt = null;

function createWebSocket() {
    try {
        socket = new WebSocket(wsURL);
        init();
    } catch(e) {
        console.log('catch');
        reconnect(wsURL);
    }
}

var lockReconnect = false;//避免重复连接
function reconnect(url) {
    if(lockReconnect) {
        return;
    };
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt);
    tt = setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
    }, 5000);
}

function delay(sec) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, sec * 1000);
    });
  }

const onHeartBeatAckInfo = (buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        console.log(buff);
        console.log("onHeartBeatAckInfo");
    }
}

const onUserLoginNtfInfo = async(buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        // decode 
        var buff_reader = root.lookupType("world.UserLoginNtfInfo");
        var buff_str = buff_reader.decode(buff);
        console.log(JSON.stringify(buff_str));

        var cur_Coord = buff_str.userData.curCoord
        await delay(speed_delay);  // 延时
        var direction = Math.round( Math.random()*7);
        await sendMove(cur_Coord.x, cur_Coord.y, direction) // 找个方向掉头
        // {"reConnectToken":"5a7b6cbd-8253-42b5-a132-fe230a7d2195","mapInfo":[{"nodeCoord":{"x":6101,"y":12787},"province":20},{"nodeCoord":{"x":6101,"y":12786},"province":20},{"nodeCoord":{"x":6102,"y":12786},"province":20},{"nodeCoord":{"x":6100,"y":12787},"province":20},{"nodeCoord":{"x":6100,"y":12786},"province":20},{"nodeCoord":{"x":6102,"y":12787},"province":20},{"nodeCoord":{"x":6100,"y":12788},"province":20},{"nodeCoord":{"x":6101,"y":12788},"province":20},{"nodeCoord":{"x":6102,"y":12788},"province":20}],"userData":{"uid":"632c3d881c69225791dc849f","icon":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJjXoulzj8OasNn5xYZlP3Ijc7rG2nqwpR8MqmOc2PEQjtnjVhVPI0q1o5WKVOMepVbVxlOrA2whw/132","title":17,"skin":187,"friendly":20,"curCoord":{"x":6101,"y":12787},"areaId":232,"nikeName":"星期六的故事"},"mapMaxX":13600,"mapMaxY":15600}
        console.log("onUserLoginNtfInfo");
        heartCheck.PingStart();

        // console.log(buff);
    }
}
const onUserMoveReqInfo = (buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        // 00 04 4c 0a 06 08 b4 40 10 c0 4c
        var buff_reader = root.lookupType("world.UserMoveReqInfo");
        var buff_str = buff_reader.decode(buff);
        // console.log(JSON.stringify(buff_str));
        // let hb_buffer = new Buffer.from([1, 1, 1 , 2]);
        // socket.send(hb_buffer);
        console.log("onUserMoveReqInfo");
    }
}

const onUserMoveAckInfo = (buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        var buff_reader = root.lookupType("world.UserMoveAckInfo");
        var buff_str = buff_reader.decode(buff);
        // console.log(JSON.stringify(buff_str));
        console.log(`终点坐标(${target_pos.x},${target_pos.y})，已到达=> (${buff_str.targetCoord.x},${Miny - buff_str.targetCoord.y})`)
        // console.log("onUserMoveAckInfo");
    }
}

const onCheckInAckInfo = async(buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        checkin_num ++;
        if(checkin_num == totalposition_num){
            console.log("所有卡已经打完");
            process.exit(0);
        }
        var buff_reader = root.lookupType("world.CheckInAckInfo");
        var buff_str = buff_reader.decode(buff);
        console.log(JSON.stringify(buff_str));
        console.log("打卡成功");
        target_pos = {
            x:position_list[checkin_num][0], 
            y:position_list[checkin_num][1]
        };
        console.log(`赶往下一个地点：${position_index[checkin_num]}`);
    }
}


const onUserOccupyGiftReqInfo = (buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        var buff_reader = root.lookupType("world.UserOccupyGiftReqInfo");
        var buff_str = buff_reader.decode(buff);
        console.log(JSON.stringify(buff_str));
        console.log("onUserOccupyGiftReqInfo");
    }
}

const onAllGiftNearByNtfInfo = async(buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        var buff_reader = root.lookupType("world.AllGiftNearByNtfInfo");
        var buff_str = buff_reader.decode(buff);
        // console.log(JSON.stringify(buff_str));
        // console.log("onAllGiftNearByNtfInfo");
        await delay(speed_delay);  // 延时
        // 
        // target_pos
        var cur_direction = 1;
        console.log(`还差(${target_pos.x - buff_str.gifts[0].curCoord.x}, ${Miny - target_pos.y - buff_str.gifts[0].curCoord.y})`);
        if(buff_str.gifts[0].curCoord.x < target_pos.x && buff_str.gifts[0].curCoord.y > Miny - target_pos.y ){
            cur_direction = 1;
        }else if(buff_str.gifts[0].curCoord.x > target_pos.x && buff_str.gifts[0].curCoord.y > Miny - target_pos.y ){
            cur_direction = 3;
        }else if(buff_str.gifts[0].curCoord.x > target_pos.x && buff_str.gifts[0].curCoord.y < Miny - target_pos.y ){
            cur_direction = 5;
        }else if(buff_str.gifts[0].curCoord.x < target_pos.x && buff_str.gifts[0].curCoord.y < Miny - target_pos.y ){
            cur_direction = 7;
        }else if(buff_str.gifts[0].curCoord.x < target_pos.x && buff_str.gifts[0].curCoord.y == Miny - target_pos.y ){
            cur_direction = 0;
        }else if(buff_str.gifts[0].curCoord.x == target_pos.x && buff_str.gifts[0].curCoord.y > Miny - target_pos.y ){
            cur_direction = 2;
        }else if(buff_str.gifts[0].curCoord.x > target_pos.x && buff_str.gifts[0].curCoord.y == Miny - target_pos.y ){
            cur_direction = 4;
        }else if(buff_str.gifts[0].curCoord.x == target_pos.x && buff_str.gifts[0].curCoord.y < Miny - target_pos.y ){
            cur_direction = 6;
        }else if(buff_str.gifts[0].curCoord.x == target_pos.x && buff_str.gifts[0].curCoord.y == Miny - target_pos.y ){
            console.log(`到达目的地:(${buff_str.gifts[0].curCoord.x},${Miny - buff_str.gifts[0].curCoord.x})`);
            return;
        }else{
            console.log("什么情况");
        }
        await sendMove(buff_str.gifts[0].curCoord.x, buff_str.gifts[0].curCoord.y, cur_direction)
    }
}
const onAllUserNearByNtfInfo = (buff) => {
    if (buff.length === 0){
        console.log("没有信息");
    }else{
        var buff_reader = root.lookupType("world.AllUserNearByNtfInfo");
        var buff_str = buff_reader.decode(buff);
        // console.log(JSON.stringify(buff_str));
        // console.log("onAllUserNearByNtfInfo");
        // sendMove(buff_str.showData[0].nodeCoord.x, buff_str.showData[0].nodeCoord.y, 1)
    }
}

const sendMove = async(x0, y0, direction=0) => {
    // 00 04 4c 0a 06 08 b4 40 10 c0 4c
    var x = parseInt(x0);
    var y = parseInt(y0);
    // console.log(direction===1);
    var coord = root.lookupType("world.Coord");
    coord.create();
    coord.x = x; // 这里要赋初值
    coord.y = y;

    switch (parseInt(direction)){ // y的坐标是cury = Miny-y(所以是相反的)
        case 0:
            coord.x = x + 1;
            console.log("》》右");
            break;
        case 1:
            coord.x = x + 1;
            coord.y = y - 1;
            console.log("》》右上");
            break;
        case 2:
            coord.y = y - 1;
            console.log("》》上");
            break;
        case 3:
            coord.x = x - 1;
            coord.y = y - 1;
            console.log("》》左上");
            break;
        case 4:
            coord.x = x - 1;
            console.log("》》左");
            break;
        case 5:
            coord.x = x - 1;
            coord.y = y + 1;
            console.log("》》左下");
            break;
        case 6:
            coord.y = y + 1;
            console.log("》》下");
            break;
        case 7:
            coord.x = x + 1;
            coord.y = y + 1;
            console.log("》》右下");
            break;
        default:
            console.log("方向错误");
    }
    // coord.x = x;
    // coord.y = y;
    if(coord.x == target_pos.x && coord.y == Miny - target_pos.y) {
        console.log("ding，打卡");
        var checkinreqinfo = root.lookupType("world.CheckInReqInfo");
        checkinreqinfo.create();
        checkinreqinfo.posX = coord.x;  // 传入坐标
        checkinreqinfo.posY = coord.y;
        var sendData = checkinreqinfo.encode(checkinreqinfo).finish(); // 编码

        var sendHead = Buffer.from([0, '0x4', '0x56']); // 数据头
        //拼接数据并发送
        var totalBuffer = new Uint8Array([...sendHead, ...sendData]);
        socket.send(totalBuffer); // 打卡
        await delay(speed_delay);  // 延时
        await sendMove(x, y, 1) // 找个方向掉头
        return;
    }
    // if(coord.x % 100 == 0 && (Miny - target_pos.y) % 100 == 0) {
    //     await sendMove(x, y, 0);
    // }
    var usermovereqinfo = root.lookupType("world.UserMoveReqInfo");
    usermovereqinfo.create();
    usermovereqinfo.targetCoord = coord;  // 传入坐标
    var sendData = usermovereqinfo.encode(usermovereqinfo).finish(); // 编码

    var sendHead = Buffer.from([0, '0x4', '0x4c']); // 数据头
    //拼接数据并发送
    var totalBuffer = new Uint8Array([...sendHead, ...sendData]);
    await socket.send(totalBuffer);
}

const OPCODE_HANDLER = {
    // 1002: onHeartBeatAckInfo,
    1003: onUserLoginNtfInfo,
    1100: onUserMoveReqInfo,
    1101: onUserMoveAckInfo,
    1102: onUserOccupyGiftReqInfo,
    1111: onCheckInAckInfo,
    1120: onAllGiftNearByNtfInfo,
    1121: onAllUserNearByNtfInfo,
}


//心跳检测
var heartCheck = {
    timeout: 3000, //每隔5秒发送心跳
    num: 3, //3次心跳均未响应重连
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
        // clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    PingStart: function(){
        var _this = this;
        var _num = this.num;
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            let hb_buffer = new Buffer.from([0, '0x3' , '0xe9']);
            socket.send(new Uint8Array(hb_buffer)); // 心跳包
            // self.PingStart();// 心跳包
            // socket.send("123456789"); // 心跳包
            _num--;
            //计算答复的超时次数
            if(_num === 0) {
                socket.colse();
            }
        }, this.timeout)
    },
    PongStart: function () {
        var self = this;
        self.serverTimeoutObj = setTimeout(function () { //如果超过一定时间还没重置，说明后端主动断开了
            if (socket != null) {
                console.log("服务器10秒没有响应，关闭连接")
                socket.close();
            }
        }, 5*1000)
    }
}

function init () {
    socket.onopen = () => {
        console.log("连接成功");
        let hb_buffer = new Buffer.from([0, '0x3' , '0xe9']);
        socket.send(new Uint8Array(hb_buffer));
        heartCheck.PingStart();
        // heartCheck.reset().PongStart(); //打开心跳检测
    }
    socket.onmessage = (msg) => {
        if (socket != null) {
            heartCheck.reset().PongStart(); //拿到任何消息都说明当前连接是正常的 心跳检测重置
        }
        const data = msg.data;

        const buffer = new Uint8Array(data);
        // console.log("",buffer);
        // const buffer = new Buffer.from([0, 3]);
        // const opCode = readInt16BE(buffer, 0);
        const opCode = parseInt( buffer[0] << 8 | buffer[1]);
        // console.log( opCode )
        if(opCode === 1002) {
            return;
        }
        if(OPCODE_HANDLER[opCode]) {
            OPCODE_HANDLER[opCode](buffer.slice(2));
        }else{
            console.log("No opcode handler for this type");
        }
        heartCheck.PingStart();
    }
    socket.onclose = (e) => {
        console.log("链接关闭");
        reconnect(wsURL);
    }
    socket.onerror = (e) => {
        console.log("发生异常")
        reconnect(wsURL);
    }
}

createWebSocket()