// pages/mine/index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoimg:"http://resource.jiyilive.com/img2/index/newlogo.png",
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mine:{},//我的信息
    isGetAddr:false,//是否有地址了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option){
   

    if (!app.globalData.currentPage || app.globalData.currentPage == '') {
      var pages = getCurrentPages(); 				//获取加载的页面
      var currentPage = pages[pages.length - 1]   //获取当前页面的对象
      var url = currentPage.route 				//获取页面url
      var can = false, tmpc = '', tmpurl;
      for (let to in option) {
        can = true;
        if (tmpc != '') { tmpc += "&" }
        tmpc += to + "=" + option[to]
      }
      if (can) { tmpurl = url + "?" + tmpc; } else { tmpurl = url; }
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
      console.log(option)
      if (option.u) { app.makeHelp(option.u); }   
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: app.globalData.hasUserInfo,
      });     
      // this.getAllRice();
     
    // });
  },
// zt
  nojump(){
    wx.showToast({
      title: '请先登录授权',
      icon:"none"
    })
  },
  // 确认授权
  haveGetUser(e) {
    if (e.detail.userInfo) {
      wx.setStorageSync("userLogin", e.detail.userInfo);
      this.getAllRice();
      this.setData({
        userInfo: e.detail.userInfo,
        userLoginNo:false
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
                app.globalData.isNew = 0;
                console.log(app.globalData.apiDomain)
                console.log(app.globalData.apiToken)

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
  onPullDownRefresh: function () {    
    this.getAllRice();
    wx.stopPullDownRefresh();
  },
  getAllRice: function (e) {//获取饭团总数
    // if(e && e.target){wx.showLoading()}
    // wx.showLoading();

    var _this = this;
    app.apiRequest({
      url: '/user/phone/queryUserIdAndActvitity',
      success: res => {
         console.log("获取饭团数：", res)
        console.log(res.data.data)
        _this.setData({
          mine: res.data.data,
          isGetAddr: !!res.data.data.address
        });
        wx.hideLoading()        
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync("userLogin")) {
      this.setData({
        userLoginNo: true,
        mine: {
          whocount: 0,
          actcount: 0,
          integral: 0
        }
      })
    } else {
      this.getAllRice();
      this.setData({
        userInfo: wx.getStorageSync("userLogin")
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  bindShowOrderList: function(e){
   
    wx.navigateTo({
      url: '../order/list?status=' + e.currentTarget.dataset.status,
    });
  },
  onShareAppMessage: function () {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/mine/index?u="+app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  },
});