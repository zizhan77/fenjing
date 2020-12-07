// pages/activity/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    if (JSON.stringify(option) !== "{}") {
      if (option.shareId) {
        //传值给后台
        app.globalData.activId = "";
        wx.request({
          url: "http://www.jiyilive.com/activityShare/updateShareQty",
          method: "post",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            "token": app.globalData.apiToken
          },
          data: {
            shareId: user.openid,
            type: "1"
          },
          success:function(res){
            wx.showToast({
              title: "make success"
            });
            console.log(res);
          }
        });
      }     
    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  }
})