//index.js
const app = getApp();
const can = wx.createCanvasContext("haibao");
var timerZt;
function makeHaib(obj, call) {
  if (obj.type == 1) {
    var ty = 24 / 1334 * obj.height, tx = 568 / 750 * obj.width;
    var ex = 178 / 750 * obj.width, ey = 1146 / 1334 * obj.height;
    can.drawImage("/images/haibao/hb1.jpg", 0, 0, 700, 1245, 0, 0, obj.width, obj.height)
  } else {
    var ty = 40 / 1334 * obj.height, tx = 59 / 750 * obj.width;
    var ex = tx, ey = 1162 / 1334 * obj.height;
    var wx = 149 / 750 * obj.width, wy = 100 / 1334 * obj.height;
    can.drawImage("/images/haibao/hb.jpg", 0, 0, 700, 1245, 0, 0, obj.width, obj.height)
  }
  can.save();
  can.beginPath()
  if (obj.type == 1) {
    can.arc(tx + 45 * obj.bili, ty + 45 * obj.bili, 45 * obj.bili, 0, Math.PI * 2, false);
    can.clip()
    can.drawImage(obj.toux, tx, ty, 90 * obj.bili, 90 * obj.bili);
    can.restore();
  } else {
    can.arc(tx + 40 * obj.bili, ty + 40 * obj.bili, 40 * obj.bili, 0, Math.PI * 2, false);
    can.clip()
    can.drawImage(obj.toux, tx, ty, 80 * obj.bili, 80 * obj.bili);
    can.restore();
    can.fillStyle = "#666666"
    can.fontSize = "26rpx";
    can.fillText(obj.name, wx, wy);
  }
  can.drawImage(obj.xcxm, ex, ey, 120 * obj.bili, 120 * obj.bili)
  can.draw(true, call);
  //绘制完毕开始保存
}
Page({
  data: {
    allimg: [
      "http://resource.jiyilive.com/img/chouj/back.jpg",
      "http://resource.jiyilive.com/img/new/yes.png",
      "http://resource.jiyilive.com/img/new/faild.png",
      "http://resource.jiyilive.com/img/new/success.png",
      "http://resource.jiyilive.com/img/new/wrong.png",
      "http://resource.jiyilive.com/img/new/right.png",
      "http://resource.jiyilive.com/img/laohj/newback.jpg",
      "http://resource.jiyilive.com/img/index/minelogo2.png"
    ],
    allimgi: 0,
    activeTitle: "粉鲸饭团送票活动",
    activeImage: "http://resource.jiyilive.com/img/index/minelogo1.png",
    allimgload: "0",
    loadOver: "block",
    zhezhao: 'block',//加载框的显示与否，以上都是加载框的数据
    atime: 3000,
    numi: 1,
    aimg: 20,
    imgt: 20,
    isTou: true,
    showShaizi: "none",//以上是色子的逻辑数据
    isHuodShow: "none",//显示活动规则
    setWidthH: "",//初始化设置宽高
    touchjh: "",//进入按钮交互
    isShowEnter: "block",//点击进入按钮显示
    isShowChouj: "none",//主页开始老虎机抽奖按钮显示
    isNotimesShow: "none",//没有抽奖次数
    musicCtrl: "musicac",//音乐控制
    isMusicPlay: true,//音乐当前是否在播放
    tishiShow: "none",//显示抽中提示框显示与否
    tishiRenwu: "阅读任务",//要显示的任务内容
    isGuoGK: "none",//是否通关
    nowGuanKa: undefined,//当前通过的关卡数
    choujTimes: 0,//抽奖次数
    isLaohjShow: "none",//【老虎机】是否显示
    laohjButAc: "",//老虎机按键是否激活状态管理
    laohjImage: {},//logo图片信息
    laohjtops: ['0', '0', '0'],//老虎机三张图的top值
    animation1: {},//老虎机动画1.2.3
    animation2: {},
    animation3: {},
    isLaohjZhj: "none",//老虎机摇中
    isLaohjJP: "",//老虎机中奖的奖品名    
    isLaohjLJ: "",//老虎机中奖的领奖方式
    guoguan: ['', '', '', '', '', '', '', '', '', '', '', ''],
    userInfo: {},
    hasUserInfo: false,
    laohjRuning: true,//老虎机正在转与否
    wishStart: "none",//许愿按钮显示与否，
    paopaoEnd: "block",//许愿开始，隐藏冒泡
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    musicUrl: "",
    musics: [],
    allGuank: 3,
    chanlinge: 3,
    isShowPage: true,
    haveChanl: 0,//当前要显示的已通过的关卡数
    haveShare: 0,//当前已经分享的次数
    isShowRule: false,//显示活动规则
    getBoodRule: "",//实物领奖规则    
    isGoodDesc: false,//可以放弃的窗口
    getGoodDesc: "",//放弃规则
    addressList: [],//地址列表
    addrempty: false,//是否没有地址，true是没地址    
    isGoodAddr: false,//显示获取地址的弹窗 loadOver
    navdh: ['nav_dhdac', '', ''],//老虎机下方菜单选中控制
    navList: [],
    navReward: [],
    navFriend: [],
    pageInit: {
      1: { number: 1, size: 20 },
      2: { number: 1, size: 20 },
      3: { number: 1, size: 20 }
    },
    isLoadMore: false,//是否正在加载
    isGetCard: false,//中门票
    isGetReward: false,//中奖
    isHaveNoTimes: false,//没有次数了
    isSaved: false,//海报框是否显示
    sysWidth: 0,//海报宽
    sysHeight: 0,//海报高
    getCardImg: 'http://resource.jiyilive.com/img2/active/tan/getcard.png',

    lucky:"立即抽奖GO",
    lightC: [
      { url: "http://resource.jiyilive.com/run1.png",display:"none"},
      { url: "http://resource.jiyilive.com/run2.png", display: "none" },
      { url: "http://resource.jiyilive.com/run3.png", display: "none" },
      { url: "http://resource.jiyilive.com/run4.png", display: "none" },
      { url: "http://resource.jiyilive.com/run5.png", display: "none" },
      { url: "http://resource.jiyilive.com/run6.png", display: "none" },
      { url: "http://resource.jiyilive.com/run7.png", display: "none" },
      { url: "http://resource.jiyilive.com/run8.png", display: "none" },
      { url: "http://resource.jiyilive.com/run9.png", display: "none" },
      { url: "http://resource.jiyilive.com/run10.png", display: "none" },
      ],
    isShow:"none",
  },

  // 动画按钮
  ztanimat(){
    // clearInterval(timerZt);
    if (this.data.animatBtn){
      wx.showToast({
        title: '抽奖中 请稍后点击...',
      })
    }else{
      this.setData({
        animatBtn: true
      })
      var imgIndex = 0;
      var speend = 300;//1s 变换一次
      let obj = {}
      timerZt = setInterval(() => {
        if (imgIndex >= 10) {
          imgIndex = 0;
        }
        for (let i = 0; i < this.data.lightC.length; i++) {
          // document.getElementsByClassName('img')[i].style.display = "none";
          this.data.lightC[i].display = "none";
        }
        // document.getElementsByClassName('img')[imgIndex].style.display = 'block';
        this.data.lightC[imgIndex].display = "block";
        imgIndex++;
        this.setData({
          lightC: this.data.lightC
        })
      }, speend)
    }
  },
  // 关闭定时器
  closezt(){
    clearInterval(timerZt);
    this.setData({
      animatBtn:false
    })
  },
  onLoad: function (option) {
    clearInterval(timerZt);
    this.data.thistime = new Date().getTime();
    this.resetF(option);
    //新增，获取地址列表
    this.getYourAddr()    
    // 获取userId
    app.apiRequest({
      url: '/user/queryUserId',
      success: res => {
        app.globalData.userNumId = res.data.data;
      },
      fail: function (res) {
        console.log("失败了：", res)
      }
    })
    if(app.globalData.selfActiveId=='162'){
      this.setData({ getCardImg:'http://resource.jiyilive.com/img2%2Factive%2Ftan%2Fgetcardkz5.png'})
    }
  },
  onShow: function () {
    this.setData({
      isShowPage: true
    })
    clearInterval(timerZt);
  },
  onHide: function () {
  },
  resetF: function (option) {
    this.getCJTimes();
    this.data.sys = wx.getSystemInfoSync();
    var syst = this.data.sys;
    var th = syst.screenWidth * 1136 / 640;
    this.setData({
      sysWidth: syst.screenWidth,
      sysHeight: th
    });
    var _this = this;
    //更新【【闯关】】次数
    var tcl = wx.getStorageSync("chanlinget" + app.globalData.selfActiveId),//剩余闯关次数
      dtg = wx.getStorageSync("haveChanl" + app.globalData.selfActiveId),//已经通关的关卡数
      isS = wx.getStorageSync("haveShared" + app.globalData.selfActiveId);//已经分享的次数
    this.setData({
      chanlinge: parseInt(tcl),
      haveChanl: parseInt(dtg),
      haveShare: parseInt(isS),
      nowGuanKa: parseInt(dtg),
    });
    //新增请求活动名称及主页图片 activeTitle activeImage
    this.checkIsPass();//这里判断是否通关
    this.getRewardList(1);
  },
  getRewardList(key) {//获取奖品列表    
    if (this.data.isLoadMore) { return; }
    this.data.isLoadMore = true;
    let keys = ['navList', 'navReward', 'navFriend'];
    let tarr = this.data[keys[key - 1]]
    app.apiRequest({
      url: '/activityUser/phone/queryRewardByUser/' + key,
      data: {
        pageNo: this.data.pageInit[key].number,
        pageSize: this.data.pageInit[key].size,
        activityId: app.globalData.selfActiveId
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        // console.log(key,res);
        this.data.isLoadMore = false;
        if (res.data.data.lists.length) {
          this.data.pageInit[key].number++;
          this.setData({
            [keys[key - 1]]: tarr.concat(res.data.data.lists)
          })
          console.log("新数组：", this.data[keys[key - 1]])
        }
      }
    })
  },
  onReady: function () {

  },
  getCJTimes: function () {//获取抽奖次数    
    var that = this;
    app.apiRequest({
      url: "/activityShare/queryLotteryQty",
      data: { "activityId": app.globalData.selfActiveId },
      success: res=>{
        if (res.data.data==0){
          this.setData({
            lucky: '获取更多抽奖次数'
          })
        }else{
          that.setData({
            choujTimes: res.data.data,
          })
        }
      }
    })
  },
  checkIsPass: function () {
    let that = this;
    if (parseInt(that.data.haveChanl) < that.data.allGuank) {
      // 没有通关，需要重新挑战
      wx.redirectTo({
        url: '../index/index?id=' + app.globalData.selfActiveId
      })
    }
  },
  showLaohj: function () {//初始化并显示老虎机
    const query = wx.createSelectorQuery();
    query.select(".laohj_cimg1").boundingClientRect();
    //imageQuery.selectViewport().scrollOffset();    
    query.exec(res => {
      var imgInfo = { h: res[0].height, w: res[0].width }
      this.setData({
        laohjImage: imgInfo,
        laohjRuning: false
      })
    })
  },
  laohujGo: function () {
    this.setData({
      laohjButAc: "ac"
    })
  },
  // 点击立即抽奖
  laohujGot: function (e) {
    //如果正在抽奖，则不进行操作
    // wx.showLoading({
    //   title: '加载中。。',
    // })
    if (this.data.laohjRuning) { return; }
    this.ztanimat();//执行动画zt
    // setTimeout(() => { this.getCJTimes(); }, 2500);
    //判断有没有次数    
    if (this.data.choujTimes == 0) {
      // this.getCJTimes();
      this.showZhongj("isHaveNoTimes");
      return;
    }
    // wx.showLoading();
    this.setData({
      choujTimes: this.data.choujTimes - 1
    })
    if (this.data.choujTimes==0){
      this.setData({
        lucky:"获取更多抽奖次数"
      })
    }
    this.data.laohjRuning = true;//劫持按钮，在执行完之前不允许再次操作
    //老虎机开始转，可以在请求之后获得中奖与否之后再执行
    var that = this;
    app.apiRequest({
      url: "/prize/lottery",
      data: { "activityId": app.globalData.selfActiveId },
      success: res=> {//请求中奖结果
      console.log(res)
        wx.hideLoading();
        this.closezt();//停掉定时器
        var tprizeType = res.data.data.prizeType;
        if (tprizeType > 3) { tprizeType = 3; }
        var zhongj = 2 - tprizeType;//Math.round(Math.random()) - Math.round(Math.random());//目前中奖是随机的
        that.laohujRun(zhongj);//
        that.data.zhongj = zhongj;
        that.data.zjDatas = res.data.data;
      }
    })
  },
  laohujRun: function (bo) {
    // console.log("老虎机转动控制函数",bo)
    var count = 17;//logo数量
    var yaotimes = 5;
    var that = this;
    var tops;
    setZhongj(bo);
    var all = this.data.laohjImage.h;
    var one = all / count;
    const sto0 = wx.createAnimation({
      duration: 0,
    })
    const sto1 = wx.createAnimation({
      duration: 100,
      timingFunction: "linear"
    });
    const sto2 = wx.createAnimation({
      duration: 200,
      timingFunction: "linear"
    });
    const sto3 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear"
    });
    const sto4 = wx.createAnimation({
      duration: 400,
      timingFunction: "linear"
    });
    const sto5 = wx.createAnimation({
      duration: 500,
      timingFunction: "linear"
    });
    const sto6 = wx.createAnimation({
      duration: 600,
      timingFunction: "linear"
    });
    const sto7 = wx.createAnimation({
      duration: 700,
      timingFunction: "linear"
    });
    const sto8 = wx.createAnimation({
      duration: 800,
      timingFunction: "linear"
    });
    const sto9 = wx.createAnimation({
      duration: 900,
      timingFunction: "linear"
    });
    function getV(str) {
      if (str == "0") { return sto0; }
      if (str == "1") { return sto1; }
      if (str == "2") { return sto2; }
      if (str == "3") { return sto3; }
      if (str == "4") { return sto4; }
      if (str == "5") { return sto5; }
      if (str == "6") { return sto6; }
      if (str == "7") { return sto7; }
      if (str == "8") { return sto8; }
      if (parseInt(str) >= 9) { return sto9; }
    }
    makeRun();
    function makeRun() {
      laohjRun(1, makeStop);
      setTimeout(() => { laohjRun(2, makeStop); }, 300);
      setTimeout(() => { laohjRun(3, makeStop); }, 600);
    }
    function laohjRun(ti, callb) {
      var tstart = 0;
      var tstr = "animation" + ti, ani = getV(5);
      g();
      function g() {
        that.setData({ [tstr]: sto0.top(0).step().export() });
        that.setData({ [tstr]: ani.top(-all).step().export() });
        tstart++; if (tstart >= yaotimes) {//停止动画
          setTimeout(function () { callb(ti); }, 500);
        } else {
          setTimeout(g, 500);
        }
      }
    }
    function makeStop(ti) {
      var tstr = "animation" + ti, ani = getV(tops[ti - 1]);
      that.setData({
        [tstr]: ani.top(-tops[ti - 1] * one).step().export()
      });
      //+one/15
      //【【【当前抽奖结束】】】
      if (ti >= 3) {
        setTimeout(function () {
          var tarobj = { prizeName: '' };
          Object.assign(tarobj, that.data.zjDatas)
          if (tarobj.prizeType == 3) {
            tarobj.prizeName = tarobj.integralQty + "个饭团"
          } else if (!tarobj.prizeName) {
            tarobj.prizeName = tarobj.name
          }
          // that.data.navReward.unshift(tarobj)
          // that.setData({
          //   navReward: that.data.navReward
          // })
          that.data.laohjRuning = false;
          // console.log("当前中的奖：", that.data.zjDatas);
          // prizeType
          switch (that.data.zjDatas.prizeType) {
            case 1: {//门票
              that.showZhongj("isGetCard");
              break;
            }
            // case 2: {//实物
            //   // that.showZhongj("【" + that.data.zjDatas.prizeName + "】", "请在【我的】-【中奖记录】中查看具体信息");
            //   makeShowDetail(that.data.zjDatas.prizeName, that.data.zjDatas.prizeIntro || "请在【我的】-【中奖记录】中查看具体信息")
            //   break;/prize/lottery
            // }
            // case 1: {//门票 平台电子券门票
            //   // var tname = that.data.zjDatas.name.split('/')[0],
            //   //   tc = that.data.zjDatas.name.split('/')[1]
            //   // that.showZhongj("【" + tname + "】" + tc + "张", "请在【我的】-【中奖记录】中查看领取规则");
            //   // break;
            //   makeShowDetail(that.data.zjDatas.prizeName, that.data.zjDatas.prizeIntro || "请在【我的】-【中奖记录】中查看具体信息")
            //   break;
            // }
            // case 4: {//优惠券
            //   that.showZhongj("【" + that.data.zjDatas.prizeName + "】", "请在【我的】-【中奖记录】中查看具体信息");
            //   break;
            // }
            default: {//其他
              that.showZhongj('isGetReward');
              break;
            }
          }
        }, 1000);
      }
    }

    function setZhongj(bo) {//bo为number值，1返回都一样，0；两个一样，-1都不一样    
      tops = [0, 0, 0];
      if (bo == 1) {
        var ti = Math.floor(Math.random() * count);
        tops = [ti, ti, ti];
      } else if (bo == 0) {
        var ti = Math.floor(Math.random() * count);
        tops[0] = tops[1] = ti;
        var ti1 = Math.floor(Math.random() * count);
        while (ti1 == ti) {
          ti1 = Math.floor(Math.random() * count);
        }
        tops[2] = ti1;
      } else {
        for (var i = 0; i < 3; i++) {
          var ti = Math.floor(Math.random() * count);
          while (tops.indexOf(ti) > -1) {
            ti = Math.floor(Math.random() * count);
          }
          tops[i] = ti;
        }
      }
    }
  },
  showZhongj(can) {//中其他
    this.setData({
      [can]: true
    });
    if (can == "isGetCard" || can == "isGetReward") {
      this.data.navReward = []
      this.data.pageInit[2].number = 1
      let obj = {}
      obj.target = {}
      obj.target.dataset = {}
      obj.target.dataset.ind = 1
      this.changeNav(obj);
    }
  },
  closeHuodgz: function () {
    this.setData({
      isHuodShow: "none"
    });
  },
  showHuodgz() {
    this.setData({
      isHuodShow: "block"
    })
  },
  showLingj: function () {//跳转领奖记录页面
    wx.navigateTo({
      url: "../lingj/lingj"
    });
  },
  exithome: function () {
    wx.showModal({
      title: "退出活动",
      content: "您确定要退出任务么？",
      success: function (e) {
        if (e.confirm) {
          wx.reLaunch({
            url: "../../index/index"
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {//设置分享内容  
    let turl = 'http://resource.jiyilive.com/img2/share/3.jpg'
    let ttit = '【我的抽奖机会用光啦，来帮我增加一次！】'
    let url = "/pages/darwShare/darwShare?cu=" + app.globalData.userNumId + "&id=" + app.globalData.selfActiveId
    if (app.globalData.selfActiveId === '162') {
      ttit = '共抗病毒限时领N95口罩';
      turl = 'http://resource.jiyilive.com/img2%2Fshare%2F123456.jpg'
    }
    return {
      title: ttit,
      path: url,
      imageUrl: turl
    }

    // var url = "/pages/activity/performance/detail?cu=" + userid + "&id=" + app.globalData.selfActiveId,
    //   strs = "【" + this.data.activeTitle + "】";
    // var url = "/pages/darwShare/darwShare?cu=" + app.globalData.userNumId + "&id=" + app.globalData.selfActiveId,
    //   strs = "【" + this.data.activeTitle + "】";
    // return {
    //   title: '我的抽奖机会用光啦，来帮我增加一次！',
    //   path: url,
    //   imageUrl: turl,
    //   success: function (res) {
    //     var shareTicket = res.shareTickets[0] || '';
    //     wx.getShareInfo({
    //       shareTicket: shareTicket,
    //       success: function (res) {
    //         console.log(res);
    //         wx.showModel({
    //           title: "text",
    //           text: JSON.stringify(res)
    //         })
    //       }
    //     })
    //   }
    // }
  },
  haveShared: function () {//延时关闭需要分享页面
    console.log("分享成功~")
    var _this = this;
    app.apiRequest({
      url: "/activityUser/shareAndAdd",
      data: { activityId: app.globalData.selfActiveId },
      success: function (res) {
        _this.setData({
          isHaveNoTimes: false,
          isGetCard: false,
          isGetReward: false
        });
        _this.getCJTimes();
      }
    })
  },
  getYourAddr: function () {//获取您的地址
    app.apiRequest({
      url: '/user/address/findByUser',
      success: res => {
        // console.log(res)
        if (res.data.code == 0) {
          if (!res.data.data.length == 0) {
            this.setData({
              addrempty: true
            })
          }
          this.setData({
            addressList: res.data.data
          })
        }
      }
    })
  },
  sureGiveUp: function () {
    var id = this.data.zjDatas.id;
    console.log(id)
    var _this = this;
    app.apiRequest({
      url: "/prizeD/giveUp",
      data: { prizedId: id },
      success: function (res) {
        console.log("放弃奖品结果：", res);
        wx.showToast({ title: "已放弃", icon: "none" });
        setTimeout(() => { _this.setData({ isGoodDesc: false }); }, 1000);
      }
    });
  },
  notgiveUp: function () {
    this.setData({
      isGoodDesc: false,
      isGoodAddr: true
    });
  },
  goAddAddr: function () {
    this.setData({ isGoodAddr: false })
    wx.navigateTo({
      url: "../address/edit?pid=" + this.data.zjDatas.prizeId + "&id=" + this.data.zjDatas.id
    });
  },
  haveSelAddr: function (e) {
    var tind = e.target.dataset.ind;
    console.log(this.data.addressList[tind], this.data.zjDatas);
    var tad = this.data.addressList[tind]
    //发送请求
    var id = this.data.zjDatas.id,
      prizeId = this.data.zjDatas.prizeId,
      _this = this;
    var datas = {}
    datas.prizeId = parseInt(id);//长的  177695//
    datas.id = parseInt(prizeId);//短的1698 //
    datas.contactName = tad.receiverName;
    datas.contactPhone = tad.receiverMobile;
    datas.contactProvince = tad.destOneAddress;
    datas.contactAddress = tad.destOneAddress + tad.destTwoAddress + tad.destThreeAddress + (tad.destFourAddress || '') + tad.address;

    app.apiRequest({
      url: "/reward/update",
      data: datas,
      success: function (res) {
        // console.log("争取奖品结果：", res);
        wx.showToast({ title: "已确认", icon: "none" });
        setTimeout(() => { _this.setData({ isGoodDesc: false, isGoodAddr: false });; }, 1000);
      }
    });
  },
  backIndexHome: function () {
    wx.switchTab({
      url: "../../index/index"
    })
  },
  changeNav(e) {
    if (JSON.stringify(e.target.dataset) == "{}") { return; }
    let tar = ['', '', ''], tind = parseInt(e.target.dataset.ind);
    tar[tind] = 'nav_dhdac';
    this.setData({
      navdh: tar
    });
    this.getRewardList(tind + 1);
  },
  onReachBottom() {//触底加载更多    
    let loadi = 1;
    if (this.data.navdh[1] != '') { loadi = 2; }
    if (this.data.navdh[2] != '') { loadi = 3; }
    this.getRewardList(loadi);
  },
  closeTan() {
    console.log("点击了关闭")
    this.setData({
      isGetCard: false,
      isGetReward: false,
      isHaveNoTimes: false
    })
  },
  makeHaib(e) {//生成海报  
    let maketype = e.target.dataset.type
    var url = '/pages/activity/performance/detail';//这里是活动内不能直接获取当前页面路径，而是固定跳活动信息介绍页
    wx.showLoading({
      title: "正在生成海报"
    })
    this.setData({
      isSaved: true
    })
    //先获取小程序码的base64文件    
    app.apiRequest({
      url: "/smallprogramcode/getSmallProgramCode",
      data: {//传递小程序路径，和路径携带的参数，u代表分享人userid，
        path: url,
        param: "id=" + app.globalData.selfActiveId
      },
      success: res => {
        let avertou = app.globalData.userInfo.avatarUrl.replace("132", '0')
        send_code(res.data, resd => {
          wx.getImageInfo({
            src: avertou,
            success: res => {
              let obj = {}
              obj.name = app.globalData.userInfo.nickName
              obj.width = this.data.sysWidth
              obj.height = this.data.sysHeight
              obj.toux = res.path
              obj.xcxm = resd
              obj.bili = this.data.sysWidth / 750
              obj.type = maketype
              makeHaib(obj, () => {
                wx.hideLoading()
                cutImg()//保存图片
              })
            }
          });
        });
      }
    });
    function send_code(code, call) {
      /*code是指图片base64格式数据*/
      //声明文件系统
      const fs = wx.getFileSystemManager();
      //随机定义路径名称
      var times = new Date().getTime();
      var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
      //将base64图片写入
      fs.writeFile({
        filePath: codeimg,
        data: code,//.slice(22),
        encoding: 'base64',
        success: (res) => {
          //写入成功了的话，新的图片路径就能用了          
          call(codeimg);
        }
      });
    }
    var _this = this;
    function cutImg() {//画布转图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.data.sysWidth,
        height: _this.data.sysHeight,
        destWidth: _this.data.sysWidth * 4,
        destHeight: _this.data.sysHeight * 4,
        canvasId: "haibao",
        success: (res) => {//缓存完图片，转存到本地
          // console.log("缓存文件路径", res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              _this.setData({ isSaved: false, isHaveShare: false })
              wx.showToast({
                title: "保存成功，请在相册选择海报分享吧",
                icon: 'none'
              })
              _this.haveShared();
            }
          });
        }
      });
    }
  },
});
