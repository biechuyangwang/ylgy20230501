const axios = require("axios");
const fs = require("fs");


// 使用方法
// 每次只要抓包获取这两个链接即可（地址后五位是版本号会变-可以不抓包，看你自己分析源码找到这个规律） 46 62 10 16
// 运行 node update_skin.js
// 结果会在skin_orig.json文件中
var gd_language = "https://cat-match-static.easygame2021.com/catMatch/sheep_wx/remote/resources/import/46/46b0c95d-d055-444c-b4ae-936b24d1725e.6fab2.json";
var gd_skin_list = "https://cat-match-static.easygame2021.com/catMatch/sheep_wx/remote/resources/import/62/62e2f78f-fa22-4fee-8294-d16593f17957.fff52.json";
var gd_game_topic_list = "https://cat-match-static.easygame2021.com/catMatch/sheep_wx/remote/resources/import/10/10b93ebb-0229-4c5b-b28c-19f37ebe8bb8.7c049.json";
var gd_block_topic_slot_data = "https://cat-match-static.easygame2021.com/catMatch/sheep_wx/remote/resources/import/16/16c7f440-2f64-40e1-b7e7-51d257e38e2e.52558.json";
const getJsonFromURL = async(url) => {
    let config = {
        "method": "get",
        "url": url,
		// "responseType": "arraybuffer",
    };

    try {
        const response = await axios(config);

        return response.data;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};

const update_skin= async() =>{
    let json_gd_language = await getJsonFromURL(gd_language);
    let json_gd_skin_list = await getJsonFromURL(gd_skin_list);
    let json_gd_game_topic_list = await getJsonFromURL(gd_game_topic_list);
    let json_gd_block_topic_slot_data = await getJsonFromURL(gd_block_topic_slot_data);
    // fs.writeFileSync('gd_language.json', JSON.stringify(json_gd_language));
    // fs.writeFileSync('gd_skin_list.json', JSON.stringify(json_gd_skin_list));
    // fs.writeFileSync('gd_game_topic_list.json', JSON.stringify(json_gd_game_topic_list));
    // fs.writeFileSync('gd_block_topic_slot_data.json', JSON.stringify(json_gd_block_topic_slot_data));

    json_gd_skin_list = json_gd_skin_list[5][0][2]; // 提取有用的
    let new_json_gd_skin_list = json_gd_skin_list.filter((item) => item.platform === 1); 

    json_gd_game_topic_list = json_gd_game_topic_list[5][0][2]; // 提取有用的
    let new_json_gd_game_topic_list = json_gd_game_topic_list.filter((item) => item.platform === 1); 

    json_gd_block_topic_slot_data = json_gd_block_topic_slot_data[5][0][2]; // 提取有用的
    let new_json_gd_block_topic_slot_data = json_gd_block_topic_slot_data.filter((item) => item.slot === 15); 

    /*json_gd_game_topic_list
    {
        "blockId": 2,
        "id": 2,
        "leftId": 10,
        "platform": 1,
        "rightId": 11,
        "topicId": 2
    },
     */
    /* json_gd_block_topic_slot_data
    {
        "access": "系统默认砖块",
        "blockAllrandom": 0,
        "blockDefault": 1,
        "blockId": 30001,
        "id": 1,
        "order": 1,
        "slot": 0,
        "slotLimit": 0,
        "topicName": "默认主题",
        "topicType": 0
    },
   {
        "access": "1，参与羊羊竞赛结算排名前3可随机获得。2，在羊羊大世界中挑战该话题羊并通关后获得。",
        "blockAllrandom": 0,
        "blockDefault": 0,
        "blockId": 30025,
        "id": 25,
        "order": 25,
        "slot": 8,
        "slotLimit": 0,
        "topicName": "潮流循环",
        "topicType": 12
    },
   */

    var skin_last_idx = 0; // 用来计算话题起点
    var diff = 691; // 常规皮肤起点 可以通过过滤json_gd_language中羊了个羊字样的第二个来定位diff的值

    // 日常皮肤
    for(let i of new_json_gd_skin_list){
        if(i.spSkin.split('_').length === 2){ // 
            if(parseInt(i.spSkin.split('_')[1] )>=80)  // 80 那里跳过4个
                diff = 695; // 682
            else diff = 691; // 678
            let skin_idx = diff + parseInt(i.spSkin.split('_')[1]);
            skin_last_idx = skin_idx;
            i.name = json_gd_language[5][0][2][skin_idx]['zh'];
            // console.log(json_gd_language[5][0][2][skin_idx]['zh']);
        }
    }
    // console.log( diff, skin_last_idx);

    // 话题皮肤
    for(let i of new_json_gd_skin_list){
        if(i.spSkin.split('_').length === 2){ // 

        }else{
            let skin_idx = skin_last_idx + 1 + parseInt(i.spSkin.slice(3,5))*2 + (i.spSkin.slice(5)[0] == 'A'? 0 : 1);
            // console.log(skin_idx);
            i.isTopic = 1;
            i.name = json_gd_language[5][0][2][skin_idx]['zh'];
            // console.log(json_gd_language[5][0][2][skin_idx]['zh']);
        }
        console.log(i);
        
    }
    fs.writeFileSync('skins_orig.json', JSON.stringify(new_json_gd_skin_list)); // 写入文件

    console.log("话题个数:",new_json_gd_game_topic_list.length);
    console.log("开放主题个数:",new_json_gd_block_topic_slot_data.length);
    let open_topic_list = [];
    for(let i of new_json_gd_game_topic_list){
        let cur_topic = new_json_gd_block_topic_slot_data.filter(item => item.topicType == i.blockId);
        let cur_topic_left_name = new_json_gd_skin_list.filter(item => item.id == i.leftId);
        let cur_topic_right_name = new_json_gd_skin_list.filter(item => item.id == i.rightId);
        if(cur_topic.length){
            i.topicName = cur_topic[0].topicName;
            i.firstblockId = cur_topic[0].blockId-15;
            i.lastblockId = cur_topic[0].blockId;
            open_topic_list.push(i);
        }
        if(cur_topic_left_name.length){
            i.leftName = cur_topic_left_name[0].name;
        }
        if(cur_topic_right_name.length){
            i.rightName = cur_topic_right_name[0].name;
        }
    }
    console.log(open_topic_list);
    let world_open_topic_list = [];
    for(let i of open_topic_list){
        world_open_topic_list.push(i.leftId);
        world_open_topic_list.push(i.rightId);
    }
    console.log(world_open_topic_list);
    for(let i of new_json_gd_block_topic_slot_data){
        // let cur_topic = new_json_gd_block_topic_slot_data.filter(item => item.topicType == i.topicId)[0];
        console.log(i);
        // i.topicName = cur_topic.topicName;
        // i.lastblockId = cur_topic.blockId;
    }
    console.log(JSON.stringify(new_json_gd_game_topic_list));

}
update_skin();