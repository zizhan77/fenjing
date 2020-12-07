//index.js
const app = getApp();
var mta = require("../mta/mta_analysis.js");
var onGetPhoneNumber = require("../../publicJS/public.js");

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
    zhezhao: 'block', //加载框的显示与否，以上都是加载框的数据
    atime: 3000,
    numi: 1,
    aimg: 20,
    imgt: 20,
    isTou: true,
    showShaizi: "none", //以上是色子的逻辑数据
    isHuodShow: "none", //显示活动规则
    setWidthH: "", //初始化设置宽高
    touchjh: "", //进入按钮交互
    isShowEnter: "block", //点击进入按钮显示
    isShowChouj: "none", //主页开始老虎机抽奖按钮显示
    isNotimesShow: "none", //没有抽奖次数
    musicCtrl: "musicac", //音乐控制
    isMusicPlay: true, //音乐当前是否在播放
    tishiShow: "none", //显示抽中提示框显示与否
    tishiRenwu: "阅读任务", //要显示的任务内容
    isGuoGK: "none", //是否通关
    nowGuanKa: undefined, //当前通过的关卡数
    choujTimes: 0, //抽奖次数
    isLaohjShow: "none", //【老虎机】是否显示
    laohjButAc: "", //老虎机按键是否激活状态管理
    laohjImage: {}, //logo图片信息
    laohjtops: ['0', '0', '0'], //老虎机三张图的top值
    animation1: {}, //老虎机动画1.2.3
    animation2: {},
    animation3: {},
    isLaohjZhj: "none", //老虎机摇中
    isLaohjJP: "", //老虎机中奖的奖品名    
    isLaohjLJ: "", //老虎机中奖的领奖方式
    guoguan: ['', '', '', '', '', '', '', '', '', '', '', ''],
    userInfo: {},
    hasUserInfo: false,
    laohjRuning: false, //老虎机正在转与否
    wishStart: "none", //许愿按钮显示与否，
    paopaoEnd: "block", //许愿开始，隐藏冒泡
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    musicUrl: "",
    musics: [],
    allGuank: 3,
    chanlinge: 3,
    isShowPage: true,
    haveChanl: 0, //当前要显示的已通过的关卡数
    haveShare: 0, //当前已经分享的次数
    isShowRule: false, //显示活动规则
    getBoodRule: "", //实物领奖规则    
    isGoodDesc: false, //可以放弃的窗口
    getGoodDesc: "", //放弃规则
    addressList: [], //地址列表
    addrempty: false, //是否没有地址，true是没地址    
    isGoodAddr: false, //显示获取地址的弹窗 loadOver    
    thisActId:0,

    // zt
    listAll: [
      // "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578644736563&di=e14affdd5c0f4dc6d379c2362e690413&imgtype=0&src=http%3A%2F%2Fmt6.haibao.cn%2Fimg%2F600_0_100_1%2F1432650547.3787%2Fb14ff9c5e074cd3e95f0abd1d01c3adb.jpg",
      // "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3297356484,455635018&fm=26&gp=0.jpg",
      // "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3297356484,455635018&fm=26&gp=0.jpg",
      // "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3297356484,455635018&fm=26&gp=0.jpg",
      // "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578644736563&di=e14affdd5c0f4dc6d379c2362e690413&imgtype=0&src=http%3A%2F%2Fmt6.haibao.cn%2Fimg%2F600_0_100_1%2F1432650547.3787%2Fb14ff9c5e074cd3e95f0abd1d01c3adb.jpg",
      // "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3297356484,455635018&fm=26&gp=0.jpg",
      // "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3297356484,455635018&fm=26&gp=0.jpg",
      // "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3297356484,455635018&fm=26&gp=0.jpg",
      // "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3297356484,455635018&fm=26&gp=0.jpg",
    ]
    // end
  },
  onLoad: function(option) {
    // option.id = 110;
    app.apiRequest({
      url:"/sponsor/phone/queryAllSponorByPhone",
      data: {
        "activityid": option.id,
      },
      success: res=> {
        this.setData({
          listAll:res.data.data
        })
      }
    })
    if (!wx.getStorageSync("phoneNum")) {
      this.setData({
        phoneNum: true
      })
    }
    app.globalData.selfActiveId = option.id;    
    this.data.thistime = new Date().getTime();
    //新添加，自定义获取具体事件函数
    app.apiRequest({
      url: "/activityCount/add",
      data: {
        "activityId": option.id,
      },
      success: function(res) {
        console.log(res)
      }
    });
    mta.Page.init() //mta统计信息
    this.resetF(option);
    //获取背景图
    var _this = this
    app.apiRequest({
      url: "/activity/queryAll",
      data: {
        "id": option.id,
      },
      success: function(res) {
        console.log(res)
        _this.setData({
          activeTitle: res.data.data.data[0].activityTitle,
          activeImage: res.data.data.data[0].bgUrl
        })
      }
    });
    // activityUser / insert  每次进入活动初始化
    app.apiRequest({
      url: "/activityUser/inset",
      data: {
        "activityId": app.globalData.selfActiveId,
        // "token":""
      },
      success: function(res) {
        console.log("初始化数据：", res)
      }
    });
    //新增，获取地址列表
    this.getYourAddr()
  },
  // zt获取电话号
  onGetPhoneNumber: function(e) {
    // onGetPhoneNumber.onGetPhoneNumber(e);
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.apiRequest({
        url: '/minoPro/bind/phone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          userInfo: JSON.stringify(wx.getStorageSync("userLogin"))
        },
        success: res => {
          if (res.data.code == 0) {
            // console.log(res)
            wx.setStorageSync("phoneNum", true);
            app.globalData.hasUserPhone = true;
            app.globalData.isLoged = true;
            app.globalData.isNew = 1;
            this.setData({phoneNum:false})
            
            if (this.data.chanlinge <= 0 && this.data.haveShare <= 0) { //没有挑战次数了
              wx.showToast({
                "title": "您的挑战次数用光了，请明天再来吧",
                "icon": "none"
              });
              return;
            }
            //拦截，直接跳转
            var tround = Math.random() > 0.5;
            if (tround) {
              wx.redirectTo({
                url: "../mess/mess?gk=" + this.data.nowGuanKa + "&times=" + this.data.chanlinge
              })
            } else {
              wx.redirectTo({
                url: "../pict/pict?gk=" + this.data.nowGuanKa + "&times=" + this.data.chanlinge
              })
            }
            return;

          }
        }
      })
    } else { //拒绝授权手机号
      wx.showToast({
        title: "请您先授权手机号",
        icon: 'none'
      });
    }
  },
  // end
  onShow: function() {
    this.setData({
      isShowPage: true
    })
  },
  onHide: function() {
    this.setData({
      isShowPage: false
    });
  },
  bindBackUp: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  resetF: function(option) {
    this.data.sys = wx.getSystemInfoSync();

    //更新【【闯关】】次数
    var tcl = wx.getStorageSync("chanlinget" + app.globalData.selfActiveId), //剩余闯关次数
      dtg = wx.getStorageSync("haveChanl" + app.globalData.selfActiveId), //已经通关的关卡数
      isS = wx.getStorageSync("haveShared" + app.globalData.selfActiveId); //已经分享的次数

    if (tcl === undefined || tcl === "") {
      tcl = 3;
      dtg = 0;
      isS = 3;
    }
    var tdate = new Date();
    var today = tdate.getFullYear() + "" + tdate.getMonth() + tdate.getDate();
    var stoday = wx.getStorageSync("renwday" + app.globalData.selfActiveId) || "";
    if (stoday !== today) {
      wx.setStorageSync("renwday" + app.globalData.selfActiveId, today);
      tcl = 3;
      dtg = 0;
      isS = 3;
    }

    this.setData({
      chanlinge: parseInt(tcl),
      haveChanl: parseInt(dtg),
      haveShare: parseInt(isS),
      nowGuanKa: parseInt(dtg),
    });
    wx.setStorageSync("haveChanl" + app.globalData.selfActiveId, dtg);
    wx.setStorageSync("chanlinget" + app.globalData.selfActiveId, tcl);
    wx.setStorageSync("haveShared" + app.globalData.selfActiveId, isS);

    //新增请求活动名称及主页图片 activeTitle activeImage
    this.checkIsPass(); //这里判断是否通关
  },
  onReady: function() {

  },
  getCJTimes: function() { //获取抽奖次数    
    var that = this;
    app.apiRequest({
      url: "/activityShare/queryLotteryQty",
      data: {
        "activityId": app.globalData.selfActiveId
      },
      success: function(res) {
        // console.log("抽奖次数信息：",res.data.data);
        that.setData({
          choujTimes: res.data.data,
        });
      }
    });
  },
  checkIsPass: function() {
    let that = this;
    if (that.data.haveChanl >= that.data.allGuank) {
      // 通关之后要跳老虎机页面
      wx.redirectTo({
        url: '../laohj/index?id=' + app.globalData.selfActiveId
      })
      return;
      //获取抽奖次数
      that.getCJTimes();
    }
  },
  touchEndf: function() {

    if (this.data.chanlinge <= 0 && this.data.haveShare <= 0) { //没有挑战次数了
      wx.showToast({
        "title": "您的挑战次数用光了，请明天再来吧",
        "icon": "none"
      });
      return;
    }
    //拦截，直接跳转
    var tround = Math.random() > 0.5;
    if (tround) {
      wx.redirectTo({
        url: "../mess/mess?gk=" + this.data.nowGuanKa + "&times=" + this.data.chanlinge
      })
    } else {
      wx.redirectTo({
        url: "../pict/pict?gk=" + this.data.nowGuanKa + "&times=" + this.data.chanlinge
      })
    }
    return;
  },
  showLaohj: function() { //初始化并显示老虎机

    //判断有没有次数
    this.setData({
      isGuoGK: "none",
    });
    if (this.data.choujTimes == 0) {
      this.showNoTimes();
      return;
    }
    this.setData({
      isLaohjShow: "block",
    });
    var that = this;
    const query = wx.createSelectorQuery();
    query.select(".laohj_cimg1").boundingClientRect();
    //imageQuery.selectViewport().scrollOffset();    
    query.exec(function(res) {
      var imgInfo = {
        h: res[0].width,
        w: res[0].height
      }
      that.setData({
        laohjImage: imgInfo,
      });
    });
  },
  closeLaohuj: function() { //关闭老虎机
    this.setData({
      isLaohjShow: "none"
    });
  },
  laohujGo: function() {
    this.setData({
      laohjButAc: "ac"
    });
  },
  laohujGot: function() {
    // this.data.zjDatas={prizeType:2}
    // this.laohujRun(1);
    // return;
    // this.setData({
    //   laohjButAc: ""
    // });
    //如果正在抽奖，则不进行操作
    if (this.data.laohjRuning) {
      return;
    }
    setTimeout(() => {
      this.getCJTimes();
    }, 2500);
    //判断有没有次数    
    if (this.data.choujTimes == 0) {
      // this.getCJTimes();
      this.showNoTimes();
      return;
    }
    wx.showLoading();
    this.setData({
      choujTimes: this.data.choujTimes - 1
    });
    this.data.laohjRuning = true; //劫持按钮，在执行完之前不允许再次操作
    //老虎机开始转，可以在请求之后获得中奖与否之后再执行
    var that = this;
    app.apiRequest({
      url: "/prize/lottery",
      data: {
        "activityId": app.globalData.selfActiveId
      },
      success: function(res) {
        // console.log("请求抽奖回来了",res);   
        // res.data.data.prizeType = 2;//修改中奖类型  
        wx.hideLoading();
        var tprizeType = res.data.data.prizeType;

        if (tprizeType > 3) {
          tprizeType = 3;
        }
        var zhongj = 2 - tprizeType; //Math.round(Math.random()) - Math.round(Math.random());//目前中奖是随机的
        that.laohujRun(zhongj);
        that.data.zhongj = zhongj;
        that.data.zjDatas = res.data.data;
        console.log("中奖信息：", that.data.zjDatas);
      }
    });

  },
  laohujRun: function(bo) {
    // console.log("老虎机转动控制函数")
    var count = 14; //logo数量
    var yaotimes = 5;
    var that = this;
    var tops;
    setZhongj(bo);
    var all = this.data.laohjImage.h;
    var one = all / count;
    const sto0 = wx.createAnimation({
      duration: 0,
    });
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
      if (str == "0") {
        return sto0;
      }
      if (str == "1") {
        return sto1;
      }
      if (str == "2") {
        return sto2;
      }
      if (str == "3") {
        return sto3;
      }
      if (str == "4") {
        return sto4;
      }
      if (str == "5") {
        return sto5;
      }
      if (str == "6") {
        return sto6;
      }
      if (str == "7") {
        return sto7;
      }
      if (str == "8") {
        return sto8;
      }
      if (parseInt(str) >= 9) {
        return sto9;
      }
    }
    makeRun();

    function makeRun() {
      laohjRun(1, makeStop);
      setTimeout(() => {
        laohjRun(2, makeStop);
      }, 300);
      setTimeout(() => {
        laohjRun(3, makeStop);
      }, 600);
    }

    function laohjRun(ti, callb) {
      var tstart = 0;
      var tstr = "animation" + ti,
        ani = getV(5);
      g();

      function g() {
        that.setData({
          [tstr]: sto0.top(0).step().export()
        });
        that.setData({
          [tstr]: ani.top(-all).step().export()
        });
        tstart++;
        if (tstart >= yaotimes) { //停止动画
          setTimeout(function() {
            callb(ti);
          }, 500);
        } else {
          setTimeout(g, 500);
        }
      }
    }

    function makeStop(ti) {
      var tstr = "animation" + ti,
        ani = getV(tops[ti - 1]);
      that.setData({
        [tstr]: ani.top(-tops[ti - 1] * one).step().export()
      });
      //+one/15
      //【【【当前抽奖结束】】】
      if (ti >= 3) {
        setTimeout(function() {
          that.data.laohjRuning = false;
          // console.log("当前中的奖：", that.data.zjDatas);
          // prizeType
          switch (that.data.zjDatas.prizeType) {
            case 3:
              { //饭团
                that.showZhongj("【" + that.data.zjDatas.integralQty + "饭团】", "所有饭团请在【我的】页面查看");
                break;
              }
            case 2:
              { //实物
                // that.showZhongj("【" + that.data.zjDatas.prizeName + "】", "请在【我的】-【中奖记录】中查看具体信息");
                makeShowDetail(that.data.zjDatas.prizeName, that.data.zjDatas.prizeIntro || "请在【我的】-【中奖记录】中查看具体信息")
                break;
              }
            case 1:
              { //门票 平台电子券门票
                // var tname = that.data.zjDatas.name.split('/')[0],
                //   tc = that.data.zjDatas.name.split('/')[1]
                // that.showZhongj("【" + tname + "】" + tc + "张", "请在【我的】-【中奖记录】中查看领取规则");
                // break;
                makeShowDetail(that.data.zjDatas.prizeName, that.data.zjDatas.prizeIntro || "请在【我的】-【中奖记录】中查看具体信息")
                break;
              }
            case 4:
              { //优惠券
                that.showZhongj("【" + that.data.zjDatas.prizeName + "】", "请在【我的】-【中奖记录】中查看具体信息");
                break;
              }
            default:
              { //其他
                that.showZhongj("【" + that.data.zjDatas.prizeName + "】", "请在【我的】-【中奖记录】中查看具体信息");
                that.setData({
                  isShowRule: true,
                  getBoodRule: that.data.zjDatas.prizeIntro
                });
                break;
              }
          }
        }, 1000);
      }
    }

    function makeShowDetail(name, str) {
      that.setData({
        isGoodDesc: true,
        isLaohjJP: name,
        getGoodDesc: str,
      });
    }

    function setZhongj(bo) { //bo为number值，1返回都一样，0；两个一样，-1都不一样    
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
  closeHuodgz: function() {
    this.setData({
      isHuodShow: "none"
    });
  },
  showHuodgz() {
    this.setData({
      isHuodShow: "block"
    })
  },
  showLingj: function() { //跳转领奖记录页面
    wx.navigateTo({
      url: "../lingj/lingj"
    });
  },
  showNoTimes: function() {
    this.setData({
      isNotimesShow: "block"
    });
  },
  hideNoTimes: function() {
    this.setData({
      isNotimesShow: "none",
      isLaohjShow: "none"
    });
  },
  showZhongj: function(a, c) {
    this.setData({
      isLaohjZhj: "block",
      isLaohjJP: a,
      isLaohjLJ: c
    });
  },
  hideZhongj: function() {
    this.setData({
      isLaohjZhj: "none",
      isLaohjJP: '',
      isLaohjLJ: ""
    });
  },
  makeWish: function() { //许愿  
    wx.navigateTo({
      url: "../wish/wish"
    });
  },
  makeMusic: function() {

  },
  exithome: function() {
    wx.showModal({
      title: "退出活动",
      content: "您确定要退出任务么？",
      success: function(e) {
        if (e.confirm) {
          wx.reLaunch({
            url: "../../index/index"
          });
        }
      }
    })
  },
  onShareAppMessage: function(res) { //设置分享内容   
    let userid = app.globalData.userId;
    let turl = 'http://resource.jiyilive.com/img2/share/3.jpg'
    let ttit = '【快来助力，为我idol加油，一起拿票看演出！】'
    let url = "/pages/activity/performance/detail?u=" + userid + "&id=" + app.globalData.selfActiveId
    if (app.globalData.selfActiveId === '162') {
      ttit = '共抗病毒限时领N95口罩';
      turl = 'http://resource.jiyilive.com/img2%2Fshare%2F123456.jpg'
    }
    return {
      title: ttit,
      path: url,
      imageUrl: turl
    }
    // var userid = app.globalData.userId;
    // var url = "/pages/activity/performance/detail?u=" + userid + "&id=" + app.globalData.selfActiveId,
    //   strs = "【快来助力，为我idol加油，一起拿票看演出！】";
    // return {
    //   title: '我的答题机会用光啦，来帮我增加一次！',
    //   path: url,
    //   imageUrl: 'http://resource.jiyilive.com/img2/share/3.jpg'
    // }
    
  },
  hideNeedS: function() { //延时关闭需要分享页面
    console.log("分享成功~")
    var _this = this;
    app.apiRequest({
      url: "/activityUser/shareAndAdd",
      data: {
        activityId: app.globalData.selfActiveId
      },
      success: function(res) {
        _this.setData({
          isNotimesShow: "none",
        });
        _this.getCJTimes();
      }
    })
  },
  closeTan: function() {
    this.setData({
      isShowRule: false
    });
  },
  getYourAddr: function() { //获取您的地址
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
  sureGiveUp: function() {
    var id = this.data.zjDatas.id;
    console.log(id)
    var _this = this;
    app.apiRequest({
      url: "/prizeD/giveUp",
      data: {
        prizedId: id
      },
      success: function(res) {
        console.log("放弃奖品结果：", res);
        wx.showToast({
          title: "已放弃",
          icon: "none"
        });
        setTimeout(() => {
          _this.setData({
            isGoodDesc: false
          });
        }, 1000);
      }
    });
  },
  notgiveUp: function() {
    this.setData({
      isGoodDesc: false,
      isGoodAddr: true
    });
  },
  goAddAddr: function() {
    this.setData({
      isGoodAddr: false
    })
    wx.navigateTo({
      url: "../address/edit?pid=" + this.data.zjDatas.prizeId + "&id=" + this.data.zjDatas.id
    });
  },
  haveSelAddr: function(e) {
    var tind = e.target.dataset.ind;
    console.log(this.data.addressList[tind], this.data.zjDatas);
    var tad = this.data.addressList[tind]
    //发送请求
    var id = this.data.zjDatas.id,
      prizeId = this.data.zjDatas.prizeId,
      _this = this;
    var datas = {}
    datas.prizeId = parseInt(id); //长的  177695//
    datas.id = parseInt(prizeId); //短的1698 //
    datas.contactName = tad.receiverName;
    datas.contactPhone = tad.receiverMobile;
    datas.contactProvince = tad.destOneAddress;
    datas.contactAddress = tad.destOneAddress + tad.destTwoAddress + tad.destThreeAddress + (tad.destFourAddress || '') + tad.address;

    app.apiRequest({
      url: "/reward/update",
      data: datas,
      success: function(res) {
        // console.log("争取奖品结果：", res);
        wx.showToast({
          title: "已确认",
          icon: "none"
        });
        setTimeout(() => {
          _this.setData({
            isGoodDesc: false,
            isGoodAddr: false
          });;
        }, 1000);
      }
    });
  },
  backIndexHome: function() {
    wx.switchTab({
      url: "../../index/index"
    })
  }
});