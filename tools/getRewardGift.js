const axios = require("axios");

// 输入node getRewardGift.js 即可 会让填对应平台
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

async function get_reward_skins(token, plat) {
    let data = JSON.stringify({
        "plat": plat,
    });

    let config = {
        "method": "post",
        "url": "https://cat-match.easygame2021.com/sheep/v1/game/skin/reward?",
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

const test_main = async() => {
    let token = await prompt("请输入token: ");
    let plat = await prompt("请输入plat: （wx qq ks）");
    let res = await get_reward_skins(token,plat);
    console.log("", res);
}
test_main();