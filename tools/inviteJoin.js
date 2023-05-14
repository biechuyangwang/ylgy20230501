const ProtoBufJs = require("protobufjs");
const root = ProtoBufJs.loadSync("./experiments/yang.proto");
const axios = require("axios");
const readline = require("readline");


// 注意替换下面的tokens
// 输入 node inviteJoin.js 即可

function base64_encode(e) {
    for (var t, o, i, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, s = e.length, c = ""; a < s; ) {
        if (t = 255 & e.charCodeAt(a++), a == s) {
            c += n.charAt(t >> 2), c += n.charAt((3 & t) << 4), c += "==";
            break;
        }
        if (o = e.charCodeAt(a++), a == s) {
            c += n.charAt(t >> 2), c += n.charAt((3 & t) << 4 | (240 & o) >> 4), c += n.charAt((15 & o) << 2), 
            c += "=";
            break;
        }
        i = e.charCodeAt(a++), c += n.charAt(t >> 2), c += n.charAt((3 & t) << 4 | (240 & o) >> 4), 
        c += n.charAt((15 & o) << 2 | (192 & i) >> 6), c += n.charAt(63 & i);
    }
    return c;
};
function encodePb(e) {
    // create a buffer
    const buff = Buffer.from(e, 'utf-8');

    // encode buffer as Base64
    const base64 = buff.toString('base64');
    return base64;
};

function deencodePb(e) {
    // create a buffer
    const buff = Buffer.from(e, 'base64');

    // decode buffer as UTF-8
    const str = buff.toString('utf-8');
    return str;
};

const getInviteInfo = async(token) => {
    let config = {
        "method": "get",
        "url": "https://cat-match.easygame2021.com/sheep/v1/game/invite/info?isByte=true",
        "responseType": "arraybuffer",
        "headers": {
            "Connection": "keep-alive",
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI MiniGame WindowsWechat",
            "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/98/page-frame.html",
        },
    };

    try {
        const response = await axios(config);
        // console.log(response.data);
        return response.data;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};

async function inviteJoin(token, info) {
    let data = JSON.stringify({
        "info": info,
    });

    let config = {
        "method": "post",
        "url": "https://cat-match.easygame2021.com/sheep/v1/game/invite/join?",
        "headers": {
            "Connection": "keep-alive",
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI MiniGame WindowsWechat",
            "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/98/page-frame.html",
        },
        data,
    };

    const response = await axios(config);

    return response.data;
}

const get_invite_uid = async (token) => {
    let invite_info = await getInviteInfo(token);
    // console.log(invite_info);
    const buffer = new Uint8Array(invite_info);

    let buff_reader = root.lookupType("yang.InviteInfo");
    var buff_str = buff_reader.decode(buffer);
    // console.log(JSON.stringify(buff_str));
    const inviteUid = buff_str.inviteUid;
    // console.log(inviteUid);
    const inviteNum = buff_str.awardInfo.length;
    return inviteUid;
    // return [inviteUid, inviteNum];
}

const post_invite_join = async (token, inviteUid) => {
    let invite_join = root.lookupType("yang.InviteJoin");
    invite_join.inviteUid = inviteUid // 
    let sendData = invite_join.encode(invite_join).finish(); // 编码
    
    let info = encodePb(sendData);
    let response = await inviteJoin(token, info);
    return response;
}

function prompt(userPrompt) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(userPrompt, (token) => {
            resolve(token);
            rl.close();
        });
    });
}

const main = async() => {
    let token = "";
    token = await prompt("请输入token: ");
    let inviteUid = "";

    inviteUid = await get_invite_uid(token);
    console.log("你的邀请码: ",inviteUid);

    let response = "";
    let invite_num = 0;
    for (id in tokens) {
        response = await post_invite_join(tokens[id], inviteUid);
        console.log("",response);
        if (response.error === 0) {
            invite_num ++;
        }
    }
    if(invite_num > 0) {
        console.log("完成邀请任务！");
    }
};
var tokens = {
    "name1": "token1",
    "name2": "token2"
}
main();
