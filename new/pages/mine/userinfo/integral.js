// pages/mine/userinfo/integral.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralList: [],
    empty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIntegral()
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

  getIntegral: function(e){
    app.apiRequest({
      url: '/my/findIntegralListByToken',
      success: res => {
        if (res.data.code == 0){
          console.log(res)
          this.setData({
            integralList: res.data.data,
            empty: res.data.data.length == 0? true:false
          })
        }
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img/index/share3.jpg"
    }
  }
})