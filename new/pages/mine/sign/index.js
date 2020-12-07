// pages/mine/sign/index.js
const app = getApp();
const WxParse = require("../../../wxParse/wxParse.js");
var getUserInfoFn = require("../../publicJS/public.js");
var onGetPhoneNumber = require("../../publicJS/public.js");
let signTimeZt;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayRice: 0, //今日获得饭团数
    allRice: 0, //所有饭团数
    haveLast: 0, //持续签到几天
    haveSignd: true, //今日是否签到
    signDays: ['', '', '', '', '', '', ''],
    signedDay: 0,
    defaultImage: 'http://resource.jiyilive.com/img2/sign/default.png', //默认用户头像
    showNew: false,
    getnew: [], //已助力的好友信息
    lastDays: 0,
    lastRices: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.getManyFriend();
    this.getAllMess();

    if (wx.getStorageSync("newPeople") != "yes") {
      this.getSign();
      this.getShowRice();
    }
    this.getTheRule();

    // zt
    app.apiRequest({
      url: '/user/queryUserId',
      success: function(res) {
        console.log(res)
        app.globalData.userNumId = res.data.data;
      },
      fail: function(res) {
        console.log("失败了：", res)
      }
    })
    // end
  },
  // zt\邀请新人跳转
  newPeople() {
    wx.navigateTo({
      url: '../../index/share/index',
    })
  },
  // 完善资料
  information() {
    wx.navigateTo({
      url: '../../mine/userinfo/index',
    })
  },
  // 签到获取授权
  haveGetUser(e) {
    if (e.detail.userInfo) {
      wx.setStorageSync("userLogin", e.detail.userInfo);
      let data = {},
        obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl;
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
                app.globalData.isgetToken = true;
                app.globalData.apiToken = res.data.data[0];
                wx.setStorageSync("token", res.data.data[0]);
                app.globalData.userId = res.data.data[1];
                wx.setStorageSync("userId", res.data.data[1])
                app.globalData.isNew = 0;
                console.log(app.globalData.apiDomain)
                console.log(app.globalData.apiToken)


                this.setData({
                  haveSignd: false
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
  // 点击邀请新人
  haveGetUser1(e) {

    if (e.detail.userInfo) {
      wx.setStorageSync("userLogin", e.detail.userInfo);
      let data = {},
        obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl;

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
                app.globalData.userId = res.data.data[1];
                wx.setStorageSync("userId", res.data.data[1])
                app.globalData.isNew = 0;
                console.log(app.globalData.apiDomain)
                console.log(app.globalData.apiToken)
                wx.navigateTo({
                  url: '../../index/share/index',
                })

                // 从首页分享领饭团分享后打开授权
                if (app.globalData.share=="yes") {
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
  haveGetUser2(e) {
    if (e.detail.userInfo) {
      wx.setStorageSync("userLogin", e.detail.userInfo);
      let data = {},
        obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl;

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
                app.globalData.userId = res.data.data[1];
                wx.setStorageSync("userId", res.data.data[1]);
                app.globalData.isNew = 0;
                wx.navigateTo({
                  url: '../../mine/userinfo/index',
                })
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
  // 获取电话号
  onGetPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.apiRequest({
        url: '/minoPro/bind/phone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          userInfo: JSON.stringify(wx.getStorageSync("userLogin"))
        },
        success: res => {
          console.log("保存手机号", res);
          if (res.data.code == 0) {
            app.globalData.hasUserPhone = true;
            app.globalData.isLoged = true;
            wx.setStorageSync("phoneNum", true);
            this.setData({
              phoneNum: true,
              haveSignd: false
            })
          }
        }
      })
    } else { //拒绝授权手机号
      wx.showToast({
        title: "请您先授权手机号",
        icon: 'none'
      })
    }
  },
  // end
  getAllMess() {
    app.apiRequest({
      url: "/reward/pc/integralRoleList",
      success: res => {
        console.log(res)
        let tarr = res.data.data;
        let tastr = tarr[0].otherjson.split("-")[0]
        this.setData({
          lastDays: tastr.split(",")[0],
          lastRices: tastr.split(',')[1],
          signRice: tarr[1].addcount,
          makeMesses: tarr[4].addcount,
          makeNews: tarr[3].addcount
        })
      }
    })
  },
  getManyFriend() {
    app.apiRequest({
      url: '/activityShare/phone/getUserShareForSign',
      success: res => {
        this.setData({
          getnew: res.data.data
        });
      }
    });
  },
  getTheRule() {
    app.apiRequest({
      url: '/activity/ruleUrl/query',
      success: res => {
        console.log(res)
        this.initRule(res.data.data[0].url)
      }
    })
  },
  initRule: function(datas) {
    // console.log(datas)
    WxParse.wxParse('content', 'html', datas, this, 5);
  },
  showShare() {
    signTimeZt = new Date();
    this.getManyFriend();
    this.setData({
      showNew: true
    })
  },
  hideShare() {
    this.setData({
      showNew: false
    })
  },
  makeUserSign() { //点击签到
    app.apiRequest({
      url: '/user/sign/phone/signInAddIntegral',
      success: res => {
        console.log("获取饭团", res)
        if (res.data.code == 0) {
          signTimeZt = new Date();
          this.getSign();
          this.setData({
            haveSignd: true,
            showNew: true
          })
        }
        wx.hideLoading()
      }
    })
  },
  getShowRice() {
    app.apiRequest({
      url: '/user/sign/phone/signIntegral',
      success: res => {
        console.log("饭团数量", res)
        console.log(app.globalData.apiToken)
        this.setData({
          allRice: res.data.data.allIntegral,
          todayRice: res.data.data.todayIntegral,
          // haveSignd: !!res.data.data.isSignToday
        });
        wx.hideLoading()
      }
    })
  },
  getSign() { //获取签到信息展示
    app.apiRequest({
      url: '/user/sign/phone/signShow',
      success: res => {
        console.log("123", res)
        this.setData({
          haveLast: res.data.data.length,
          signedDay: res.data.data.light,
          haveSignd: res.data.data.isSignToday == 1
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(app.globalData.userNumId)
    return {
      title: '帮我助力一下，你也能抽奖拿爱豆演出票哦>>',
      path: "/pages/index/help/index?u=" + app.globalData.userNumId,
      imageUrl: "http://resource.jiyilive.com/img2/share/1.jpg"
    }
  }
})