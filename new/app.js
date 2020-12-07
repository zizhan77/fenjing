//app.js
var mta = require("/pages/activity/mta/mta_analysis.js");
App({
  qqMapKey: 'THOBZ-C64CP-3OTDK-VIUZE-6Q5HF-Y2FM2',
  globalData: {
    apiDomain: "https://www.jiyilive.com",//线上
    // apiDomain: "http://192.168.31.47:8084", //本地
    // apiDomain: "http://47.92.115.105:8088/",//临时
    //'https://www.jiyilive.com',
    // http://192.168.31.47:8080 http://47.92.115.105
    userInfo: null,
    hasUserInfo: false,
    jsCode: null,
    apiToken: '',
    isAuth: true,
    isGetPhone: false,
    hasUserPhone: false,
    isgetToken: false,
    isGoGetPhone: true, //是否去请求手机号了
    checkLogin: false
  },
  onLaunch: function() {
    //自动更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    mta.App.init({
      "appID": "500699022",
      "eventID": "500699024",
      "autoReport": false,
      "statParam": true,
      "ignoreParams": [],
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
    var _this = this;


    // 获取token和是否为新用户
    wx.login({
      success: res => {
        this.apiRequest({
          url: '/login/minoPro/getUser',
          data: {
            'jscode': res.code
          },
          success: res => {
            console.log(res)
            // 两个参数是老用户 否则一个用户 
            if (res.data.data.length == 2) {
              wx.setStorageSync("newPeople", "no");
              _this.globalData.apiToken = res.data.data[1];
              _this.globalData.isNew = 0;
              wx.setStorageSync("tokenZt", res.data.data[1])
            } else {
              // 新人1
              wx.setStorageSync("newPeople", "yes");
              _this.globalData.isNew = 1;
            }
            // 控制onlaunch必须先执行
            if (this.employIdCallback) {
              this.employIdCallback(_this.globalData.isNew)
            }
          }
        })
      }
    })

    // 超哥code:::orSQa4_xTfHbnCDjAz9TYOceVHQs
    //     周涛 :::orSQa41zzvn4kIbk8LoSnpUGMwro
    //     琳琳code ：：orSQa4-Gy5SBXKDKvpWHpgbLU1jI
    // wx.login({
    //   success: res => {
    //     console.log(res.code)
    //     this.globalData.jsCode = res.code;
    //     this.globalData.checkLogin = true;
    //     this.apiRequest({
    //       url: '/login/minoPro/getToken',
    //       data: {
    //         'jscode': this.globalData.jsCode
    //       },
    //       success: (res) => {
    //         console.log(res.data);
    //         console.log (this.globalData.apiDomain)
    //         // if (this.checkLoginReadyCallback) {
    //         //   this.checkLoginReadyCallback();
    //           if (res.data.code === 0) {
    //             console.log(res.data.data.length)
    //             this.globalData.isgetToken = true;
    //             this.globalData.apiToken = res.data.data[0];
    //             wx.setStorageSync("token", res.data.data[0]);
    //             this.globalData.userId = res.data.data[1]
    //              // 新用户返两个参数 老用户返三个
    //             if (res.data.data.length==3){
    //               wx.setStorageSync("phoneNum",true);
    //               this.globalData.hasUserPhone = !!res.data.data[2];
    //             }else{
    //               wx.setStorageSync("phoneNum", false);
    //             }
    //             // zt
    //             wx.redirectTo({
    //               url: '/pages/index/index',
    //             })
    //             // end
    //           }
    //         // }
    //       }
    //     })
    //   }
    // })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {

    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId                  
    //           this.globalData.userInfo = res.userInfo
    //           this.globalData.hasUserInfo = true
    //           //调后端接口获取token
    //           if (this.globalData.isGetToken) {
    //             this.sureHavePhone(1)//存头像
    //           }
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       });
    //     } else {//没有授权，跳转登陆页          
    //       _this.sureHavePhone(0)
    //     }
    //   }
    // })

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        var model = e.model;
        if (model.search('iPhone X') != -1 || model.search('Max') != -1) {
          this.globalData.isIpx = true;
        } else {
          this.globalData.isIpx = false;
        }
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        //console.log(custom.top - e.statusBarHeight);
        if (custom.top - e.statusBarHeight < 0) {
          this.globalData.CustomBar = custom.bottom + e.statusBarHeight;
        } else {
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      }
    })
  },
  sureHavePhone: function(getinfo) {
    if (getinfo == 1) {
      saveUser(this.globalData.userInfo);
      return;
    }
    // wx.showToast({
    //   title: getinfo==2 ? "请先授权手机号":"请先登录",
    //   icon: "none"
    // });
    // setTimeout(() => {
    //   wx.redirectTo({
    //     url: "/pages/mine/login/login?getinfo="+getinfo
    //   })
    // }, 1000);

    function saveUser(obj) {
      let app = getApp();
      let data = {}
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl
      app.apiRequest({
        url: '/user/updateUserName',
        data,
        success: (res) => {}
      })
    }
  },
  checkOver: function(arg, call) {
    // console.log(1);
    if (this.globalData.isgetToken && this.globalData.hasUserInfo && this.globalData.hasUserPhone) {
      call(arg)
    } else if (this.globalData.isgetToken && this.globalData.hasUserInfo) {
      if (this.globalData.isGoGetPhone) {
        this.sureHavePhone(2);
        this.globalData.isGoGetPhone = false;
      }
      setTimeout(() => {
        this.checkOver(arg, call)
      }, 200);
    } else {
      setTimeout(() => {
        this.checkOver(arg, call)
      }, 200);
    }
  },
  makeHelp(tid) { //拉新逻辑
    console.log("是分享的：", tid)
    let inew = this.globalData.isNew || 0;
    this.globalData.isNew = 0;
    if (inew == 0) {
      return
    }
    this.apiRequest({
      url: "/activityShare/shareForUserAndSign",
      data: {
        userId: tid,
        type: 0,
        shareFrom: 1,
        isNew: inew
      },
      success: res => {
        console.log(res)
      }
    })
  },
  //全局统一调用接口的方法
  apiRequest: function(options) {
    // return;
    wx.request({
      url: this.globalData.apiDomain + options.url,
      method: 'POST',
      header: {
        'token': this.globalData.apiToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: options.data,
      success: function(e) {
        if (e.data.code == 1) {
          options.success(e) //全部返回
          return;
          if (e.data.message == "用户通关记录为空" || e.data.message == "查询为空") { //为活动专门添加的判断
            options.success(e);
          } else { //屏蔽空信息
            return;
            wx.showToast({
              title: e.data.message,
              icon: 'none'
            });
          }
          return false;
        }
        // if (e.data.code == 3){//token失效          
        //   wx.login({
        //     success: res => {
        //       wx.request({
        //         url: getApp().globalData.apiDomain + '/login/minoPro/getToken',
        //         method: 'POST',
        //         header: {
        //           'Content-Type': 'application/x-www-form-urlencoded'
        //         },
        //         data: {
        //           'jscode': res.code
        //         },
        //         success: (res) => {
        //           if (res.data.code === 0) {
        //             getApp().globalData.apiToken = res.data.data[0]
        //           }
        //         }
        //       })
        //     }
        //   })
        //   return true;          
        // }
        if (e.data.code == 5) { //没有手机号
          if (!getApp().globalData.hasUserInfo) {
            options.success(e);
            return;
          }
          if (options.code5) {
            options.success(e);
          } else {
            getApp().sureHavePhone(2)
          }
          return false;
        }
        options.success(e);
      },
      fail: res => {
        if (options.fail) {
          options.fail(res);
        }
      },
      complete: res => {
        if (options.complete) {
          options.complete(res);
        }
      }
    });
  }
})