// pages/index/performance/map.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    routeInfo: {
      startLat: '', //起点经度 选填
      startLng: '', //起点纬度 选填
      startName: "我的位置", // 起点名称 选填
      endLat: 39.94055, // 终点经度必传
      endLng: 116.53207, //终点纬度 必传
      endName: "测试终点", //终点名称 必传
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.endLat)
    console.log(options.endLng)
    this.setData({
      routeInfo: {
        startLat: '', //起点经度 选填
        startLng: '', //起点纬度 选填
        startName: "我的位置", // 起点名称 选填

        endLat: options.endLat, // 终点经度必传
        endLng: options.endLng, //终点纬度 必传
        endName: options.name, //终点名称 必传
        mode: "car" //算路方式 选填
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
  
})