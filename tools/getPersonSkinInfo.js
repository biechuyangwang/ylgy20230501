const { getSkinInfo } = require("../services/services");
const { getSkinName,is_activity_skin,is_topic_skin,getSkinTotalNum } = require("./skins");
const axios = require("axios");
const readline = require("readline");

// 直接运行 node getPersonSkinInfo.js即可 后续会要求你在命令行输入t值查询
var args = process.argv.splice(2); // 服务器上要删掉
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Nzc5NDYxNzksInVpZCI6MTIyOTQ2NjU4LCJ2ZXIiOiIxIiwiZXh0IjoiMzYzMzMyNjMzMzY0MzgzODMxNjMzNjM5MzIzMjM1MzczOTMxNjQ2MzM4MzQzOTY2IiwiY29kZSI6IjQ5ZDdlNjE0MzZlOGMxMWMyZDU4YjY0OGU1ODY3Mzc0IiwiZW5kIjoxNjc3OTQ2MTc5MTkxLCJwbGEiOjF9.gp5vvWAwiKISYi4BD35hIX_BjhmZanTIqmjYPMLHOMU";
token = args[0]; // 服务器上要删掉
var total_skin_num = getSkinTotalNum();
var all_topic_skin_list = [];
var has_topic_skin_list = [];
var hasnot_topic_skin_list = [];
var all_skin_list = [];
var all_activity_skin_list = [];
var has_skin_list = [];
var has_activity_skin_list = [];
var hasnot_skin_list = [];
var hasnot_activity_skin_list = [];
var has_other_skin_list = [];
var hasnot_other_skin_list = [];

var all_topic_in_world = [
    8,   9,  10,  11,  43,  44,  65,  66,  69,  70,  71,
   72,  73,  74,  75,  76,  93,  94,  95,  96,  97,  98,
   99, 100, 101, 102, 118, 119, 120, 121, 122, 123, 124,
  125, 126, 127, 128, 129, 140, 141, 142, 143, 144, 145,
  146, 147, 148, 149, 161, 162, 163, 164, 187, 188, 189,
  190, 191, 192, 193, 194, 203, 204, 205, 206, 207, 208,
  209, 210, 211, 212, 422, 423, 424, 425
];
var hasnot_topic_in_world = [];

var fee_hash_table = {
    "1": 100,
    "2": 160,
    "3": 220,
    "4": 260,
    "5": 300,
    "6": 340,
    "7": 360,
    "8": 380,
    "9": 400,
    "10": 410,
    "11": 420,
    "12": 430
};

var star_skin_hash_table = {
    "290":"白羊座","291":"金牛座","292":"双子座","293":"巨蟹座","294":"狮子座","295":"室女座",
    "296":"天秤座","297":"天蝎座","298":"射手座","299":"摩羯座","300":"水瓶座","301":"双鱼座",
    "302":"太阳神-被帮","303":"智慧女神-5","304":"神使-1","305":"天神-12"

};

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

const skin_info = async () => {
    token = await prompt("请输入token: ");
    const skins = (await getSkinInfo(token)).data.skin_list;


    for (let i=1;i<=total_skin_num;++i) {
        all_skin_list.push(i);
        if(is_topic_skin(i)){
            all_topic_skin_list.push(i);
        }
        if(is_activity_skin(i)){
            all_activity_skin_list.push(i);
        }

    }

    for (const skin of skins) {
        has_skin_list.push(skin.id);
        if(is_topic_skin(skin.id)){
            has_topic_skin_list.push(skin.id);
        }
        if(is_activity_skin(skin.id)){
            has_activity_skin_list.push(skin.id);
        }
        // console.log(skin);
        // var date = new Date(parseInt( skin.created_at) * 1000);
        // console.log("" + date);
    }
    console.log("皮肤总数量:", total_skin_num );
    console.log("获得皮肤数量:", skins.length );

    console.log("获得大世界活动皮肤数量:", has_activity_skin_list.length );

    hasnot_skin_list = all_skin_list.concat(has_skin_list).filter(item => !has_skin_list.includes(item));
    // console.log("未获得皮肤：",hasnot_skin_list.length);
    // console.log(hasnot_skin_list.map((s) => getSkinName(s)).join(", "));

    console.log("所有话题皮肤数量：", all_topic_skin_list.length);
    // console.log(all_topic_skin_list.map((s) => getSkinName(s)).join(", "));

    console.log("已获得话题皮肤：",has_topic_skin_list.length);
    // console.log(has_topic_skin_list.map((s) => getSkinName(s)).join(", "));

    hasnot_topic_skin_list = all_topic_skin_list.concat(has_topic_skin_list).filter(item => !has_topic_skin_list.includes(item));
    // console.log("未获得话题皮肤：",hasnot_topic_skin_list.length);
    // console.log(hasnot_topic_skin_list.map((s) => getSkinName(s)).join(", "));

    console.log("大世界所有话题皮肤：", all_topic_in_world.length);
    console.log(all_topic_in_world.map((s) => getSkinName(s)).join(", "));
    console.log("大世界所有活动皮肤：", all_activity_skin_list.length);
    console.log(all_activity_skin_list.map((s) => getSkinName(s)).join(", "));

    hasnot_topic_in_world = all_topic_in_world.filter(item => !has_topic_skin_list.includes(item));
    console.log("大世界未获得话题皮肤：", hasnot_topic_in_world.length);
    console.log(hasnot_topic_in_world);
    console.log(hasnot_topic_in_world.map((s) => getSkinName(s)).join(", "));

    hasnot_activity_skin_list = all_activity_skin_list.filter(item => !has_activity_skin_list.includes(item));
    console.log("大世界未获得活动皮肤：", hasnot_activity_skin_list.length);
    console.log(hasnot_activity_skin_list);
    console.log(hasnot_activity_skin_list.map((s) => getSkinName(s)).join(", "));

    // console.log("大世界话题还能冲几天：",Math.ceil((hasnot_topic_in_world.length)));

    hasnot_other_skin_list = hasnot_skin_list.concat(hasnot_topic_skin_list).filter(item => !hasnot_topic_skin_list.includes(item)).filter(item => !hasnot_activity_skin_list.includes(item));
    console.log("其他未获得皮肤：", hasnot_other_skin_list.length);
    console.log(hasnot_other_skin_list);
    console.log(hasnot_other_skin_list.map((s) => getSkinName(s)).join(", "));

}
skin_info();