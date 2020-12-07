// pages/mine/coupon/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前tab
    TabCur: 1,
    couponStatusMap: {
      1: '未使用',
      2: '已使用',
      3: '已过期'
    },
    couponList: 1,
    chooseCoupon: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.chooseCoupon) {
      this.setData({
        chooseAddress: options.chooseCoupon
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //tab切换时触发（请求优惠券信息）
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      couponList: parseInt(e.currentTarget.dataset.id)
    })
  },

  bindChooseCoupon: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      couponId: e.currentTarget.dataset.id,
      coupon: '测试'
    })

    wx.navigateBack();
  },

  bindToUse: function(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})