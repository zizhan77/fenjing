// pages/mine/attention/list.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLikeList();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getLikeList: function() {
    app.apiRequest({
      url: '/user/like/queryList',
      success: res => {
        console.log(res);
        for (var i = 0; i < res.data.data.length; i++){
          if(res.data.data[i].status == null){
            // 获取当前时间，同时得到活动结束时间数组
            let newTime = new Date().getTime();
            let startTime = new Date(res.data.data[i].startSaleDate).getTime();
            let timeStr;
            // 如果活动未开始，对时间进行处理
            if (startTime - newTime > 0) {
              let time = (startTime - newTime) / 1000;
              // 获取时、分、秒
              let day = parseInt(time / (60 * 60 * 24));
              let hou = parseInt(time % (60 * 60 * 24) / 3600) + day * 24;
              let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
              let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
              timeStr = hou != 0? hou+'小时': min !=0? min+'分钟': sec !=0? sec+'秒': '售卖中';
              timeStr+= '距发售'
            } else {//活动已结束，更改状态，开启购买按钮
              timeStr = '售卖中';
            }
            res.data.data[i].timeStr = timeStr
          }
        }
        if (res.data.code == 0){
          this.setData({
            likeList: res.data.data
          })
        }
      }
    })
  },

  //演出详情
  showDetail(e) {
    wx.navigateTo({
      url: '/pages/index/performance/detail?id=' + e.currentTarget.dataset.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})