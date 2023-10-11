const spawn = require("child_process").spawn;
const { exit } = require("process");
const { updateSkin } = require("./services/services");

const spawnSolverProcess = (type, token) => {
    return new Promise((resolve, reject) => {
        const solverProcess = spawn("node", [`${type}_quick.js`, "-t", token]); // 道具算法
        solverProcess.stdout.on("data", (data) => {
            const outputs = data
              .toString()
              .split(/\r?\n/)
              .filter((e) => e);
        
            for (line of outputs) {
              console.log(line);
            }
        });
        solverProcess.on("close", () => {
            return resolve({time: Date.now()});
        })
        solverProcess.on("exit", () => {
            return resolve({time: Date.now()});
        })
        solverProcess.on("error", (err) => {
            return reject(err);
        })
    })
};
async function parallel_challenge_Process(tokens){
    // let data = await Promise.all([spawnSolverProcess("challenge",token), spawnSolverProcess("topic",token)]);
    const promises = [];
    for (id in tokens) {
        promises.push(spawnSolverProcess("challenge",tokens[id]));
        // promises.push(spawnSolverProcess("topic",tokens[id]));
    }
    const solutions = await Promise.all(promises);
}
async function parallel_topic_Process(tokens){
    // let data = await Promise.all([spawnSolverProcess("challenge",token), spawnSolverProcess("topic",token)]);
    const promises = [];
    for (id in tokens) {
        // promises.push(spawnSolverProcess("challenge",tokens[id]));
        promises.push(spawnSolverProcess("topic",tokens[id]));
    }
    const solutions = await Promise.all(promises);
}

async function parallel_world_Process(tokens){
    // let data = await Promise.all([spawnSolverProcess("challenge",token), spawnSolverProcess("topic",token)]);
    const promises = [];
    for (id in tokens) {
        // promises.push(spawnSolverProcess("challenge",tokens[id]));
        promises.push(spawnSolverProcess("world",tokens[id]));
    }
    const solutions = await Promise.all(promises);
}

function delay(sec) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, sec * 1000);
    });
  }
async function update_skin(tokens){
    for(let id in tokens){
        // await updateSkin(tokens[id], 1)
        let res = await updateSkin(tokens[id], 330) // 163 飞机 187 气球 330 幼儿羊
        if(res.err_code !=0){
            console.error("皮肤切换失败");
        }else{
            console.log("皮肤切换成功");
        }
    }
}
console.log("正在读取 tokens.json");
const tokens = require("./tokens.json");

// update_skin(tokens)
// console.log(`开始时间：${new Date().toLocaleString()}`);
// parallel_challenge_Process(tokens);
// parallel_world_Process(tokens);
// parallel_topic_Process(tokens);
// let d = Math.floor(Date.now()/1000);
// console.log(d);
// let strdt = new Date(d*1000);
// console.log(strdt);
// let hour = d.getHours();
// let minute = d.getMinutes();
// let second = d.getSeconds();
// d.getFullYear()
// d.getDate()
// d.getMonth()+1
// console.log(`${hour}:${minute}:${second}.${d%1000}`);

const timeId = setInterval(() => {
    let d = new Date();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    
    if (hour == 0 && minute == 0 && second == 0) {
        console.log(`${hour}:${minute}:${second}.${d%1000}`);
    }else if (hour == 0 && minute == 0 && second == 1 && d%1000 >=0 && d%1000 <120) {
        console.log(`本地时间：${new Date().toLocaleString()}`);
        console.log(`开始时间：${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d%1000}`);
        parallel_challenge_Process(tokens);
        let t = new Date();
        console.log(`结束时间：${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}.${t%1000}`);
        console.log(`时间差:${(t-d)/1000}s`);
    }else if (hour == 0 && minute == 3 && second == 30 && d%1000 >=400 && d%1000 <520) {
        // parallel_topic_Process(tokens);
        // update_skin(tokens)
    }else if (hour == 0 && minute == 4 && second > 0) {
        // update_skin(tokens)
        // exit(0);
    }
},100) // 1000*60*3 3分钟刷新一次 0.1秒刷新一次

// const main = async() => {
//     let t = new Date();
//     console.log(`开始时间：${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}.${t%1000}`);
//     await delay(3)
//     let d = new Date();
//     console.log(`开始时间：${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}.${t%1000}`);
//     console.log(`时间差:${(d-t)/1000}s`);
// }
// main()