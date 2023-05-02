# ylgy20230501
由于羊的大世界更新了可变砖块 算法回溯逻辑重构 并把现有工具整理一下

# 一 模块介绍
```bash
project 
├── ylgy2023SAT
│   ├── 3Ddisplay # 3D显示插件 【完成】
│   ├── cache # 一些地图缓存 【完成】
│   ├── core # 核心算法 
│   ├── demo # 一些测试demo 
│   ├── docs # 存放必要说明文档 
│   ├── experiments # 存放配置文件（公用的和特殊的） 【完成】
│   │   ├── world.proto # 地图相关 【完成】
│   │   ├── yang.proto # 答案相关 【完成】
│   │   └── tokens.json # 批量配置token配置 【完成】
│   ├── main # 主要功能
│   │   ├── challenge.js # 日常入口
│   │   └── world.js # 大世界主入口 
│   ├── services # 一些网络服务接口 【完成】
│   ├── sockets # 网页端交互
│   ├── tools # 额外的工具 支持扩展
│   │   ├── autoWorld.js # 自动随机找羊并完成大世界 【半完成】 只完成了自动找羊 缺自动过关
│   │   ├── autoWorldofactivityPlus.js # 自动随机找缺失的活动羊并完成大世界 【半完成】
│   │   ├── autoWorldofselectedPlusPlus.js # 自动随机找指定羊并完成大世界（限定，太耗资源） 【半完成】
│   │   ├── autoWorldofTopic.js # 自动随机找话题羊并完成大世界 【半完成】
│   │   ├── autoWorldofTopicPlus.js # 自动随机找缺失的话题羊并完成大世界 【半完成】
│   │   ├── batchWorks.js # 批量
│   │   ├── cnmsb.js # 小黑屋（日常） 【半完成】 缺大世界小黑屋（自动找羊进小黑屋）
│   │   ├── ding.js # 自动全图打卡（可改为全图游走或者【单点传送】里面有使用说明） 【完成】
│   │   ├── getResources.js # 获取官方资源文件
│   │   ├── getPersonInfo.js # 获取个人皮肤信息 【完成】
│   │   ├── getRewardGift.js # 获取平台赠送皮肤 （qq | wx | ks | app) 【完成】
│   │   ├── inviteJoin.js # 邀请功能 【完成】
│   │   ├── itemsInc.js # 查询道具数量 【完成】
│   │   ├── playInfoDecode.js # 答案格式解码 【完成】
│   │   ├── run2position.js # 去一个地点 【完成】 该功能和打卡重复不单独写一个工具
│   │   ├── seckill.js # 抢榜（支持批量）
│   │   ├── skin.js # 皮肤查询接口 【完成】
│   │   ├── updateSkins.js # 更新最新皮肤（需要提供一些参数） 【完成】
│   │   └── 获取T值.exe # win上一键获取t值 【完成】
│   ├── run.js # 全局一键双关入口
│   └── 使用说明及注意事项.txt
└── README.md 
```