// pages/order/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单状态码映射关系
    orderStatusMap: {
      0: "待支付",
      10: "待发货",
      20: "已发货",
      30: "已完成"
    },
    performanceInfo: {},
    placeInfo: {},
    orderInfo: {},
    deliverInfo: {},
    qrCode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetail(options.id);
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

  //查看快递
  showExpress(e){
    wx.navigateTo({
      url: 'express/detail',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        deliverExpress: function (data) {
          console.log(data)
        },
      },
      success: function(res) {
        res.eventChannel.emit('deliverExpress', {
          express: this.data.orderInfo.express
        })
      },
    })
  },

  getOrderDetail: function(id){
    app.apiRequest({
      url: '/my/findOrderDetailById',
      data: {
        orderId: id
      },
      success: res => {
        console.log(res);
        if (res.data.code == 0){
          this.setData({
            performanceInfo: res.data.data.performance,
            placeInfo: res.data.data.basicPlace,
            orderInfo: res.data.data.order,
            deliverInfo: res.data.data.deliverInfo,
            qrCode: res.data.data.qrCode
          })
        }
      }
    })
  }
})