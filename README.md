# ylgy20230501
由于羊的大世界更新了可变砖块 算法回溯逻辑重构 并把现有工具整理一下

# 一 模块介绍
```bash
project 
├── ylgy2023SAT
│   ├── 3Ddisplay # 3D显示插件
│   ├── cache # 一些地图缓存 
│   ├── core # 核心算法 
│   ├── demo # 一些测试demo 
│   ├── docs # 存放必要说明文档 
│   ├── experiments # 存放配置文件（公用的和特殊的）
│   │   ├── world.proto # 地图相关
│   │   ├── yang.proto # 答案相关
│   │   └── tokens.json # 批量配置token配置
│   ├── main # 主要功能
│   │   ├── challenge.js # 日常入口
│   │   └── world.js # 大世界主入口 
│   ├── services # 一些网络服务接口
│   ├── sockets # 网页端交互
│   ├── tools # 额外的工具 支持扩展
│   │   ├── autoWorld.js # 自动随机找羊并完成大世界
│   │   ├── autoWorldofactivityPlus.js # 自动随机找缺失的活动羊并完成大世界
│   │   ├── autoWorldofselectedPlusPlus.js # 自动随机找指定羊并完成大世界（限定，太耗资源
│   │   ├── autoWorldofTopic.js # 自动随机找话题羊并完成大世界
│   │   ├── autoWorldofTopicPlus.js # 自动随机找缺失的话题羊并完成大世界
│   │   ├── batchWorks.js # 批量
│   │   ├── cnmsb.js # 小黑屋
│   │   ├── ding.js # 自动全图打卡
│   │   ├── getResources.js # 获取官方资源文件
│   │   ├── getPersonInfo.js # 获取个人详细信息 
│   │   ├── getRewardGift.js # 获取平台赠送皮肤 （qq | wx | ks | app)
│   │   ├── inviteJoin.js # 邀请功能
│   │   ├── itemsInc.js # 道具增加
│   │   ├── playInfoDecode.js # 答案格式解码
│   │   ├── run2position.js # 去一个地点
│   │   ├── seckill.js # 抢榜（支持批量）
│   │   ├── skin.js # 皮肤查询接口
│   │   ├── updateSkins.js # 更新最新皮肤（需要提供一些参数）
│   │   └── 获取T值.exe # win上一键获取t值
│   ├── run.js # 全局一键双关入口
│   └── 使用说明及注意事项.txt
└── README.md 
```