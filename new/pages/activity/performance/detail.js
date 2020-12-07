// pages/index/performance/detail.js
const app = getApp();
var util = require("../../../utils/util.js")
var WxParse = require('../../../wxParse/wxParse.js');
var getUserInfoFn = require("../../publicJS/public.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fold: true,
    showBuyModal: false,
    chooseList: {},
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    plusStatus: 'normal',
    performanceInfo: {},
    placeInfo: {},
    ticketGearList: {},
    showTimeList: {},
    choosedShowTimeId: 0,
    choosedTicketGearId: 0,
    choosedPrice: 0,
    totalPrice: 0,
    foldHeight: "291rpx",
    content: '',
    ticketStore: [],
    curStoreNum: 1,
    isLike: 0,
    countDownTime: 0,
    showEnter: true,
    showMess: false,
    sday: 0,
    lastTime: '0小时0分',
    isExtend: true,
    sponsors: [], //所有赞助商
    activityId: 0,
    isNotShare: true,
    acitive:false,
    thisid:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    console.log('参数查看：',option)
    if (!app.globalData.currentPage || app.globalData.currentPage == '') {
      this.setData({
        isNotShare: true
      });
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var url = currentPage.route //获取页面url
      var can = false,
        tmpc = '',
        tmpurl;
      for (let to in option) {
        can = true;
        if (tmpc != '') {
          tmpc += "&"
        }
        tmpc += to + "=" + option[to]
      }
      if (can) {
        tmpurl = url + "?" + tmpc;
      } else {
        tmpurl = url;
      }
      app.globalData.currentOption = JSON.stringify(option);
      app.globalData.currentPage = '/' + tmpurl;
    }
    // app.checkOver(option, (option) => {
      if (JSON.stringify(option) == "{}") {
        if (app.globalData.currentOption != '') {
          if (app.globalData.currentOption) {
            option = JSON.parse(app.globalData.currentOption);
            app.globalData.currentOption = ''
          }
        }
      }
      // if (option.cu) {
      //   this.setData({
      //     isNotShare: false
      //   });
      //   this.makeChoujAdd(option);
      // }
      // if (option.u) {
      //   app.makeHelp(option.u);
      //   this.setData({
      //     isNotShare: false
      //   })
      // }
      // this.data.activityId = option.id
      // this.getPerformanceDetail(option.id); 
      // this.getSponsors(option.id);
      // this.data.activityId = 131;
      // this.getPerformanceDetail(131);
      // this.getSponsors(131);
    // })

    // zt
    this.data.thisid=option.id
    this.getPerformanceDetail(option.id);
    this.data.activityId = option.id
    this.getSponsors(option.id);
    // cu是从抽奖页进来的
    if (option.cu) {
      this.setData({
        isNotShare: false
      });
      this.makeChoujAdd(option);
    }
    // u是从其他也分享进来的
    if (option.u) {
      app.makeHelp(option.u);
      this.setData({
        isNotShare: false
      })
    }
    // 后台返回是否有手机号\

    // this.getPerformanceDetail(131);
    // this.data.activityId = 131;
    // end
  },

  //zt 授权登录按钮、
  onShow:function(){
    // zt
    if (wx.getStorageSync("userLogin")) {
      this.setData({
        userLogin: true
      })
    }
    if (wx.getStorageSync("phoneNum")) {
      this.setData({
        phoneNum: true
      })
    }
  },
  // 获取授权
  haveGetUser: function (e) {
    
    wx.showLoading({
      title: '加载中',
    })
    if (e.detail.userInfo) {
      wx.hideLoading()
      wx.setStorageSync("userLogin", e.detail.userInfo);
      wx.navigateTo({
        url: '../index/index?id=' + this.data.activityId
      })
      let data = {}, obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl
      // 获取token
      wx.login({
        success: res => {
          console.log(res.code)
          app.globalData.jsCode = res.code;
          app.globalData.checkLogin = true;
          app.apiRequest({
            url: '/login/minoPro/getToken',
            data: {
              'jscode': app.globalData.jsCode
            },
            success: (res) => {
              console.log(res.data);
              if (res.data.code === 0) {

                console.log(res.data.data.length)
                app.globalData.isgetToken = true;
                app.globalData.apiToken = res.data.data[0];
                wx.setStorageSync("token", res.data.data[0]);
                app.globalData.userId = res.data.data[1]
                app.globalData.isNew =0;
                console.log(app.globalData.apiDomain)
                console.log(app.globalData.apiToken)
                // 获取是否有电话号
                app.apiRequest({
                  url: '/user/phone/queryUserIdAndActvitity',
                  success: res => {
                    console.log("获取饭团数：", res.data.data.phoneNumber)
                    if (!res.data.data.phoneNumber) {
                      wx.setStorageSync("phoneNum", false);
                    } else {
                      wx.setStorageSync("phoneNum", true);
                    }
                    wx.hideLoading()
                  }
                })

                // 更新微信名称
                app.apiRequest({
                  url: '/user/updateUserName',
                  data,
                  success: (res) => {
                    console.log(app.globalData.apiToken)
                    console.log(res)
                    if (res.data.code == 0) {
                      this.setData({
                        userLogin: true,
                      })
                    }
                  },
                  code5: 1
                })


                // 从首页分享领饭团分享后打开授权
                if (app.globalData.share == "yes") {
                  app.apiRequest({
                    url: "/activityShare/shareForUserAndSign",
                    data: {
                      userId: app.globalData.tid,
                      type: 0,
                      shareFrom: 1,
                      isNew: 1
                    },
                    success: res => {
                      console.log(res)
                    }
                  })
                }
                // 新用户返两个参数 老用户返三个
                // if (res.data.data.length == 3) {
                //   wx.setStorageSync("newPeople", false);
                //   app.globalData.hasUserPhone = !!res.data.data[2];
                // } else {
                //   wx.setStorageSync("newPeople", true);
                // }
              }
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: "请您先登录",
        icon: 'none'
      });
    }
  },
  // 获取手机号
  onGetPhoneNumber: function (e) {
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
            console.log(res.data)
            wx.navigateTo({
              url: '../index/index?id=' + this.data.activityId
            })
            console.log(res)
            wx.setStorageSync("phoneNum", true);
            app.globalData.hasUserPhone = true;
            app.globalData.isLoged = true;
          }
        }
      })
    } else {//拒绝授权手机号
      wx.showToast({
        title: "请您先授权手机号",
        icon: 'none'
      });
    }
  },
  // end
  makeChoujAdd: function(opt) { //点击被分享的小程序并注册完成了    
    if (!app.globalData.isNew) {
      return;
    }
    app.apiRequest({
      data: {
        userId: opt.cu,
        type: 1,
        activityId: opt.id
      },
      url: "/activityShare/updateShareQty",
      success: res => {
        console.log("增加抽奖次数结束：", res)
        //临时显示下返回信息
        // wx.showToast({ "text": JSON.stringify(res.data) })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let turl = 'http://resource.jiyilive.com/img2/share/2.jpg'
    let ttit = '一起来拿免费门票吧'
    if(this.data.thisid === '162'){
      ttit ='共抗病毒限时领N95口罩';
      turl ='http://resource.jiyilive.com/img2%2Fshare%2F123456.jpg'
    }
    return {
      title: ttit,
      path: "/pages/activity/performance/detail?id=" + this.data.activityId + "&u=" + app.globalData.userId,
      imageUrl: turl
    }
  },
  // 展开更多
  unfold: function(e) {
    this.setData({
      foldHeight: 'auto',
      isExtend: false
    })
  },
  //获取演出详情信息
  getPerformanceDetail(performanceId) {
    wx.showLoading({
      title: '加载中',
    })
    app.apiRequest({
      url: '/activity/phone/queryActivityDetail',
      data: {
        id: performanceId
      },
      success: res => {
        if (res.data.code === 0) {
          res.data.data.endDate = res.data.data.endDate.substr(0, 16);
          this.setData({
            performanceInfo: res.data.data,
          })
          // console.log(this.data.performanceInfo)
          WxParse.wxParse('content', 'html', res.data.data.activityIntro, this, 5);
          this.makeEndTime(res.data.data.endDate)
        }
      },
      complete: res => {
        wx.hideLoading();
      }
    })
  },
  getSponsors(tid) {
    app.apiRequest({
      url: "/sponsor/phone/queryAllSponorByPhone",
      data: {
        "activityid": tid
      },
      success: res => {
        console.log(res)
        this.setData({
          sponsors: res.data.data
        })
      }
    });
  },
  sponsor(e){
    wx.navigateTo({
      url: 'sponsor?id=' + e.currentTarget.dataset.spid,
    })
  },
  bindBuy() { //进入活动
    wx.navigateTo({
      url: '../index/index?id=' + this.data.activityId
    })
  },
  makeEndTime(endt) {
    let nowt = new Date().getTime();
    let endd = new Date(endt.replace(/\-/g, '/')).getTime();
    if ((endd - nowt) < 0) {
      wx.showToast({
        title: "活动已结束",
        icon: "none"
      })
      wx.switchTab({
        url: "/pages/index/index"
      })
    } else {
      let tdelta = endd - nowt;
      let td = Math.floor(tdelta / (60 * 60 * 1000 * 24)),
        tmpde = tdelta - (td * 60 * 60 * 1000 * 24),
        th = Math.floor(tmpde / (60 * 60 * 1000)),
        tm = Math.floor((tmpde % (60 * 60 * 1000)) / 60000),
        ts = Math.floor((tmpde % (60 * 60 * 1000)) % 60000 / 1000)
      var tst = "";
      if (td > 0) {
        tst += td + "天"
        tst += th + '小时'
        tst += tm + "分"
        tst += ts + "秒";
      } else {
        if (th > 0) {
          tst += th + '小时';
        }
        tst += tm + "分";
        tst += ts + "秒";
      }
      this.setData({
        lastTime: tst
      })
      setTimeout(() => {
        this.makeEndTime(endt);
      }, 1000);
    }
  },
  getTicketStore: function(e) {
    app.apiRequest({
      url: '/ticketStore/queryListById',
      data: {
        'performanceId': this.data.performanceInfo.id,
        'page': 1,
        'limit': 100,
      },
      success: res => {
        if (res.data.code === 0) {
          // console.log(res.data.data);
          let list = res.data.data.list;
          let ticketStore = new Array();
          for (var i = 0; i < list.length; i++) {
            if (!ticketStore[list[i].showId]) {
              ticketStore[list[i].showId] = new Array()
            }
            ticketStore[list[i].showId][list[i].ticketGearId] = list[i].storeNum

          }
          this.setData({
            ticketStore: ticketStore
          })
        }
      }
    })
  },

  bindAttention: function(e) {
    app.apiRequest({
      url: '/user/like/insert',
      data: {
        performanceId: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '关注成功',
          })
          this.setData({
            isLike: 1
          })
        }
      }
    })
  },

  bindDisattention: function(e) {
    app.apiRequest({
      url: '/user/like/delete',
      data: {
        performanceId: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '已取消',
            icon: 'none'
          })
          this.setData({
            isLike: 0
          })
        }
      }
    })
  },

  chooseShowTime: function(e) {
    this.setData({
      choosedShowTimeId: e.currentTarget.dataset.id,
    })
    console.log(this.data.choosedShowTimeId)
  },

  chooseTicketGear: function(e) {
    if (this.data.choosedShowTimeId == 0) {
      wx.showToast({
        title: '请先选择时间',
        icon: 'none'
      })
      return false;
    }
    let ticketStore = this.data.ticketStore;
    this.setData({
      choosedTicketGearId: e.currentTarget.dataset.id,
      choosedPrice: e.currentTarget.dataset.price,
      curStoreNum: ticketStore[this.data.choosedShowTimeId][parseInt(e.currentTarget.dataset.id)]
    })
  },

  bindConfirmOrder: function(e) {
    if (this.data.choosedShowTimeId == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      })
      return false;
    }
    if (this.data.choosedTicketGearId == 0) {
      wx.showToast({
        title: '请选择票档',
        icon: 'none'
      })
      return false;
    }
    if (this.data.num == 0) {
      wx.showToast({
        title: '请选择数量',
        icon: 'none'
      })
      return false;
    }

    if (this.data.num > this.data.curStoreNum) {
      wx.showToast({
        title: '仅剩' + this.data.curStoreNum + '份',
        icon: 'none'
      })
      return false;
    }
    if (this.data.num > this.data.performanceInfo.limitNumber) {
      wx.showToast({
        title: '每人限购' + this.data.performanceInfo.limitNumber + '份',
        icon: 'none'
      })
      return false;
    }

    let time = '';
    for (var i = 0; i < this.data.showTimeList.length; i++) {
      if (this.data.choosedShowTimeId == this.data.showTimeList[i].id) {
        time = this.data.showTimeList[i].showTime;
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/order/payment/confirm?id=' + this.data.performanceInfo.id +
        '&totalPrice=' + this.data.choosedPrice * this.data.num +
        '&choosedShowTime=' + time.date + ' ' + time.time +
        '&price=' + this.data.choosedPrice +
        '&num=' + this.data.num +
        '&showId=' + this.data.choosedShowTimeId +
        '&ticketGearId=' + this.data.choosedTicketGearId
    })
  },

  countDown() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();

    // 对结束时间进行处理渲染到页面
    let startTime = new Date(this.data.performanceInfo.startSaleDateStr.replace(/-/g, '/')).getTime();
    // let startTime = new Date('2019-07-06 16:38:00').getTime();
    let obj = null;
    // 如果活动未开始，对时间进行处理
    if (startTime - newTime > 0) {
      let time = (startTime - newTime) / 1000;
      // 获取时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600) + day * 24;
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
      // 渲染，然后每隔一秒执行一次倒计时函数
      this.setData({
        countDownTime: obj
      })
      setTimeout(this.countDown, 1000);

    } else { //活动已结束，更改状态，开启购买按钮
      let performanceInfo = this.data.performanceInfo;
      performanceInfo.status = 3;
      this.setData({
        performanceInfo: performanceInfo
      })
    }
  },

  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },

  isLike: function(performanceId) {
    app.apiRequest({
      url: '/user/like/isLike',
      data: {
        performanceId: performanceId
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            isLike: res.data.data
          })
        }
      }
    })
  },
  backDetail: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})