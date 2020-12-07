// pages/order/list.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前tab
    TabCur: 0,

    //订单状态码映射关系
    orderStatusMap: {
      0: "待支付",
      10: "待发货",
      20: "已发货",
      30: "已完成"
    },

    //订单列表
    orderList: [],
    //待支付时间
    countDownList: 0, 
    finishStatus: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status){
      this.setData({
        TabCur: options.status
      })
    }
    this.getOrderList();
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

  //tab切换时触发（请求订单信息）
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
    this.getOrderList();
    empty: false;
  },

  //展示订单详情
  showDetail(e){
    wx.navigateTo({
      url: 'detail?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  getOrderList: function(){
    app.apiRequest({
      url: '/my/findOrderListByToken',
      data: {
        status: this.data.TabCur
      },
      success: res => {
        if (res.data.code == 0){
          this.setData({
            orderList: res.data.data,
            empty: res.data.data == null ? true : false
          })
          if (this.data.TabCur == 0){
            this.countDown();
          }
        }
      }
    })
  },

  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let countDownList = this.data.orderList;
    let countDownArr = new Array();
    for(var i=0; i<countDownList.length; i++){

      let endTime = (new Date(countDownList[i].payTime)).getTime() + 60 * 15 * 1000;
      let timeStr;

      // 如果活动未开始，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取时、分、秒
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        timeStr = this.timeFormat(min) + ":" + this.timeFormat(sec)

      } else {//活动已结束，更改状态，开启购买按钮
        timeStr = '已取消';
      }
      countDownArr[countDownList[i].id] = timeStr;
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({
      countDownList: countDownArr
    })
    setTimeout(this.countDown, 1000);
  },

  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },

  bindPayNow: function(e){
    this.setData({
      finishStatus: e.currentTarget.dataset.after
    })
    console.log(this.data.finishStatus);
    app.apiRequest({
      url: '/order/wxPayOrderAgain',
      data:{
        orderNumber: e.currentTarget.dataset.orderno
      },
      success: res => {
        if (res.data.code == 0) {
          let data = {
            'timeStamp': res.data.data.timeStamp.toString(),
            'nonceStr': res.data.data.nonce_str,
            'package': 'prepay_id=' + res.data.data.a_package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.sign,
          }
          console.log(data);
          console.log(this.data.finishStatus)
          data.success = res => {
            console.log(res)
            console.log(this.data.finishStatus)
            wx.redirectTo({
              url: '/pages/order/payment/finish?status='+this.data.finishStatus,
            })
          };
          data.fail = res => {
            console.log(res)
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
          wx.requestPayment(data)
        }
      }
    })
  }
})