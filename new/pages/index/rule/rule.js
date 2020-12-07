// pages/index/rule/rule.js
const app = getApp();
const WxParse = require("../../../wxParse/wxParse.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backColor: "#fff", //背景色
    isNotShare: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
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
      if (option.u) {
        app.makeHelp(option.u);
        this.setData({
          isNotShare: false
        });
      }

      app.apiRequest({
        url: "/activity/ruleUrl/query",
        data: {},
        success: res => {
          console.log(res)
          this.initRule(res.data.data[0].url)
        }
      })
    // })
  },
  initRule: function(datas) {
    console.log(datas)
    WxParse.wxParse('content', 'html', datas, this, 5);
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
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/rule/rule?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  },
  showActList: function() {
    wx.switchTab({
      url: "../../discover/index"
    })
  }
})