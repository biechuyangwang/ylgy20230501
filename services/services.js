const axios = require("axios");
const { getRandom } = require("../utils/helpers");

const BASE_URL = "https://cat-match.easygame2021.com/sheep/v1/game";
const STATIC_ASSETS_URL = "https://cat-match-static.easygame2021.com";

// https://cat-match.easygame2021.com/sheep/v1/game/world/game_start?matchType=6&req_id=-1&use_item=0

const getMapInfo = async(token, gameType=3) => {
    if(gameType==3){
        url = `${BASE_URL}/map_info_ex?matchType=3&req_id=-1&use_item=0`
    }else if(gameType==4){
        url = `${BASE_URL}/topic/game_start?matchType=4&req_id=-1&use_item=0`
    }else if(gameType==5){
        url = `${BASE_URL}/tag/game/start?matchType=5&req_id=-1&use_item=0`
    }else if (gameType==6){
        url = `${BASE_URL}/world/game_start?matchType=6&req_id=-1&use_item=0`
    }
    const config = {
        "method": "get",
        "url": url,

        "headers": {
            "Connection": "keep-alive",
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
    };

    try {
        const response = await axios(config);
        return response.data;
		
    } catch (err) {
        console.log(err);
    }
};



async function sendMatchdata(token, data, gameType = 3) {
    if(gameType==3){
        url = `${BASE_URL}/game_over_ex?`
    }else if(gameType==4){
        url = `${BASE_URL}/topic/game_over?`
    }else if (gameType==5){
        url = `${BASE_URL}/tag/game/over?`
    }else if (gameType==6){
        url = `${BASE_URL}/world/game_over?`
    }
    var config = {
        "method": "post",
        "url": url,
        "headers": {
            "Connection": "keep-alive",
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
        data,
    };
    const response = await axios(config);
    return response.data;
}

async function sendMatchInfo(token, mapSeed2, matchPlayInfo, gameType = 3) {
    const data = gameType > 3 ?
        JSON.stringify({
            rank_state: 1,
            rank_time: 463,
            play_info: matchPlayInfo,
            map_seed_2: mapSeed2,
            version: "268", 
        }) :
        JSON.stringify({
            rank_score: 1,
            rank_state: 1,
            rank_time: 463, // 这里需要大于deltaTime之和
            rank_role: 2,
            skin: 354,
            play_info: matchPlayInfo,
            map_seed_2: mapSeed2,
            version: "268",
        });
    if(gameType==3){
        url = `${BASE_URL}/game_over_ex?`
    }else if(gameType==4){
        url = `${BASE_URL}/topic/game_over?`
    }else if (gameType==5){
        url = `${BASE_URL}/tag/game/over?`
    }else if (gameType==6){
        url = `${BASE_URL}/world/game_over?`
    }
    var config = {
        "method": "post",
        "url": url,
        "headers": {
            "Connection": "keep-alive",
            // "b":208,
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            "referer": "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
        data,
    };

    const response = await axios(config);

    return response.data;
}

const getTopicInfo = async(token) => {
    const config = {
        method: "get",
        url: `${BASE_URL}/topic/info?`,
        headers: {
            Connection: "keep-alive",
            t: token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
    };

    try {
        const response = await axios(config);

        return response.data;
    } catch (err) {
        console.log(err);
    }
};

async function topicJoinSide(token, side) {
    var data = JSON.stringify({
        type: side,
    });

    var config = {
        method: "post",
        url: `${BASE_URL}/topic/game_join?`,
        headers: {
            Connection: "keep-alive",
            t: token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
        data,
    };

    const response = await axios(config);

    return response.data;
}

const getMapFromMD5 = async(md5) => {
    let config = {
        method: "get",
        url: `${STATIC_ASSETS_URL}/maps/${md5}.map`,
		responseType: "arraybuffer",
    };

    try {
        const response = await axios(config);

        return response.data;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};

const getSkinInfo = async(token) => {
    const config = {
        method: "get",
        url: `${BASE_URL}/skin/info?`,
        headers: {
            Connection: "keep-alive",
            t: token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
    };

    try {
        const response = await axios(config);

        return response.data;
    } catch (err) {
        console.log(err);
    }
};

const getUserTagListInfo = async(token) => {
    const config = {
        method: "get",
        url: `${BASE_URL}/tag/user/list?`,
        headers: {
            Connection: "keep-alive",
            t: token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
    };

    try {
        const response = await axios(config);

        return response.data;
        // Response
        // {
        //     "data": {
        //         "list": [
        //             {
        //                 "created_at": "2022-12-10T03:34:19.941Z",
        //                 "id": "6393fe3b1a0f641db1cf5187",
        //                 "name": "深圳",
        //                 "robot": 1,
        //                 "status": 2,
        //                 "today_count": 1
        //             },
        //             {
        //                 "created_at": "2022-12-10T03:33:23.457Z",
        //                 "id": "6393fe0397ff2b06aa6fe5eb",
        //                 "name": "只因",
        //                 "robot": 1,
        //                 "status": 3,
        //                 "today_count": 0
        //             },
        //             {
        //                 "created_at": "2022-12-10T03:32:20.335Z",
        //                 "id": "6393fdc4b763ea848cb89b80",
        //                 "name": "程序员",
        //                 "robot": 1,
        //                 "status": 2,
        //                 "today_count": 0
        //             }
        //         ],
        //         "page_no": 0,
        //         "page_size": 0,
        //         "total": 0
        //     },
        //     "err_code": 0,
        //     "err_msg": ""
        // }
    } catch (err) {
        console.log(err);
    }
};
const updateSkin = async(token, skin) => {
    const config = {
        method: "get",
        url: `${BASE_URL}/update_user_skin?skin=${skin}`,
        headers: {
            Connection: "keep-alive",
            t: token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
    };

    try {
        const response = await axios(config);

        return response.data;
    } catch (err) {
        console.log(err);
    }
};
const getTagInfo = async(token,str="深圳") => {
    const config = {
        method: "get",
        url: `${BASE_URL}/tag/info/search?content=${str}`,
        headers: {
            Connection: "keep-alive",
            t: token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            Referer: "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
    };

    try {
        const response = await axios(config);

        return response.data;
        // Response
        // {
        //     "data": [
        //         {
        //             "author_admin": 0,
        //             "author_avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJjXoulzj8OasNn5xYZlP3Ijc7rG2nqwpR8MqmOc2PEQjtnjVhVPI0q1o5WKVOMepVbVxlOrA2whw/132",
        //             "author_name": "星期六的故事",
        //             "created_at": "2022-12-10T03:34:19.941Z",
        //             "id": "6393fe3b1a0f641db1cf5187",
        //             "list": null,
        //             "name": "深圳",
        //             "today_count": 0,
        //             "total_count": 0
        //         }
        //     ],
        //     "err_code": 0,
        //     "err_msg": ""
        // }
    } catch (err) {
        console.log(err);
    }
};

async function joinTag(token, id) {
    const data = JSON.stringify({"id": id,})
    url = `${BASE_URL}/tag/join?`
    var config = {
        "method": "post",
        "url": url,
        "headers": {
            "Connection": "keep-alive",
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
        data,
    };

    const response = await axios(config);

    return response.data;
    // Response
    // {
    //     "data": {
    //         "score": 1
    //     },
    //     "err_code": 0,
    //     "err_msg": ""
    // }
}

const getUserInfo = async(token) => {
    url = `${BASE_URL}/personal_info?`;
    // TODO

    const config = {
        "method": "get",
        "url": url,

        "headers": {
            "Connection": "keep-alive",
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
    };

    try {
        const response = await axios(config);

        return response.data;
    } catch (err) {
        console.log(err);
    }
};

const share_inc = async(token, item_id) => {
    const data = 
        JSON.stringify({
            "item_id": item_id
        })
    var config = {
        "method": "post",
        "url": 'https://cat-match.easygame2021.com/sheep/v1/game/item/share/incr?',
        "headers": {
            "Connection": "keep-alive",
            // "b":208,
            "t": token,
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d2c) NetType/WIFI Language/zh_CN",
            "referer": "https://servicewechat.com/wx141bfb9b73c970a9/66/page-frame.html",
        },
        data,
    };

    const response = await axios(config);

    return response.data;
}

module.exports = {
    getMapFromMD5,
    sendMatchdata,
    sendMatchInfo,
    getMapInfo,
    getTopicInfo,
    topicJoinSide,
    getSkinInfo,
    updateSkin,
    joinTag,
    getTagInfo,
    getUserTagListInfo,
	getUserInfo,
    share_inc,
};