const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

// 查询道具卡数量 以及不知道啥用
const get_item_share_infomap = async(token) => {
  const config = {
    method: "get",
    url: `https://cat-match.easygame2021.com/sheep/v1/game/item/share/info_map?`,
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

const get_item_list = async(token) => {
  const config = {
    method: "get",
    url: `https://cat-match.easygame2021.com/sheep/v1/game/item_list?`,
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

const share_inc = async(token,item_id) => {
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
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI MiniGame WindowsWechat",
            "Referer": "https://servicewechat.com/wx141bfb9b73c970a9/103/page-frame.html",
        },
        data,
    };

    const response = await axios(config);

    return response.data;
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

const main = async () => {
  let res = "";
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzkxMzIxNTksInVpZCI6MTIyOTQ2NjU4LCJ2ZXIiOiIxIiwiZXh0IjoiMzYzMzMyNjMzMzY0MzgzODMxNjMzNjM5MzIzMjM1MzczOTMxNjQ2MzM4MzQzOTY2IiwiY29kZSI6ImU1NDQyZjNmYzcyYzEyZTZlOTdmZWVjMmZhYTY4MmUwIiwiZW5kIjoxNjc5MTMyMTU5MTIzLCJwbGEiOjF9.4CsHx4QAyAIPLkAlziba2pXd5q6SDxb-ccjxgKmkKEE";
    token = await prompt("请输入token: ");
    res = await get_item_list(token);
    if(res.err_code==0)
      console.log("剩余道具卡：\n", JSON.stringify(res.data));
    else
      console.log("没有道具");

    res = await get_item_share_infomap(token);
    console.log("增加前：\n", JSON.stringify(res));
    let inc_num = 1;
    for(let i = 0;i< inc_num;++i){
      let res1 = await share_inc(token,1);
      let res2 = await share_inc(token,2);
      let res3 = await share_inc(token,3);

      // console.log(res1);
      // console.log(res2);
      // console.log(res3);
    }
    res = await get_item_share_infomap(token)
    console.log("增加后：\n",JSON.stringify(res));
};
// {
//     "data": {
//         "count": 2
//     },
//     "err_code": 0,
//     "err_msg": ""
// }
  
main();