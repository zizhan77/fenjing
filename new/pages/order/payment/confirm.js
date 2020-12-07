// pages/order/payment/confirm.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressId: 0,
    address: '暂无地址',
    couponId: null,
    coupon: '0张可用',
    isAccept: false,
    price: 0,
    num: 0,
    totalPrice: 0,
    couponPrice: 0,
    time: '',
    choosedSeats: [],
    performanceId: 0,
    showId: 0,
    ticketGearId: 0,
    performanceInfo: {},
    placeInfo: {},
    deliverPrice: 0,
    showXieyi: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let choosedSeats = []
    let choosedSeatsStr = ''
    if (options.choosedSeats){
      choosedSeats = JSON.parse(options.choosedSeats);
      console.log(choosedSeats)
      for (var i = 0; i < choosedSeats.length; i++) {
        choosedSeatsStr += choosedSeats[i].row + '排' + choosedSeats[i].col + '座 ';
      }
    }
    
    this.setData({
      num: options.num,
      totalPrice: options.totalPrice,
      price: options.price,
      time: options.choosedShowTime,
      performanceId: options.id,
      choosedSeats: choosedSeats,
      choosedSeatsStr: choosedSeatsStr,
      ticketGearId: options.ticketGearId ? options.ticketGearId : '',
      showId: options.showId,

    })
    console.log(this.data.choosedSeats)
    this.getPerformanceDetail(this.data.performanceId)
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

  bindAccept: function(){
    this.setData({
      'isAccept': !this.data.isAccept
    });
    console.log(this.data.isAccept)
  },

//支付
  makeOrder: function(){

    if (this.data.isAccept){
      wx.showToast({
        title: '正在调起支付...',
        icon: 'none'
      })
      let postData = {
        'performanceId': this.data.performanceId,
        'showId': this.data.showId,
        'ticketNum': this.data.num,
        'price': parseFloat(this.data.totalPrice) + parseFloat(this.data.deliverPrice),
      };
      //取票方式：快递
      if (this.data.performanceInfo.ticketDeliverType == 10) {
        if (this.data.addressId == 0) {
          wx.showToast({
            title: '请选择地址',
            icon: 'none'
          });
          return false;
        }
        postData.userAddressId = this.data.addressId;
      }

      if (this.data.placeInfo.chooseSeat == 1){
        postData.seatsIdsNumVoList = JSON.stringify(this.data.choosedSeats)
      }else{
        postData.ticketGearId = this.data.ticketGearId
      }

      
      console.log(postData);
      // wx.request({
      //   url: 'https://testzhiqu.utools.club/api/test/miniProgramTest',
      //   data: postData,
      //   success: res => {
      //     console.log(res)
      //     if (res.data.code == 0) {
      //       let data = res.data.data;
      //       data.success = res => {
      //         console.log(res)
      //       };
      //       data.fail = res => {
      //         console.log(res)
      //         wx.navigateTo({
      //           url: '/pages/order/list',
      //         })
      //       }
      //       console.log(data)
      //       wx.requestPayment(data)
      //     }
      //   }
      // })
      
      app.apiRequest({
        url: '/order/createOrder',
        data: postData,
        success: res => {
          console.log(res)
          if (res.data.code == 0){
            let data = {
              'timeStamp': res.data.data.timeStamp.toString(),
              'nonceStr': res.data.data.nonce_str,
              'package': 'prepay_id=' + res.data.data.a_package,
              'signType': res.data.data.signType,
              'paySign': res.data.data.sign,
            }
            console.log(data);
            data.success = res => {
              console.log(res)
              wx.redirectTo({
                url: '/pages/order/payment/finish',
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
    }else{
      wx.showToast({
        title: '您必须同意用户协议',
        icon: 'none'
      })
    }
  },

  //获取演出详情信息
  getPerformanceDetail(performanceId) {
    wx.showLoading({
      title: '加载中',
    })
    app.apiRequest({
      url: '/performance/getDetail',
      data: {
        id: performanceId
      },
      success: res => {
        if (res.data.code === 0) {
          //快递则获取默认地址
          if (res.data.data.performanceVo.ticketDeliverType == 10){
            this.getDefaultAddress();
          }
          this.setData({
            performanceInfo: res.data.data.performanceVo,
            placeInfo: res.data.data.placeInfo
          })
        } else {
          wx.redirectTo({
            url: '/pages/errors/404?message=' + res.data.message,
          })
        }
      },
      complete: res => {
        wx.hideLoading();
      }
    })
  },

  bindRule: function(){
    wx.showModal({
      title: '退赔规则',
      content: '该演出不支持7天内无理由退换，购买后无法退换，请知悉!',
    })
  },

  getDefaultAddress: function(){
    app.apiRequest({
      url: '/user/address/findDefaultAddress',
      success: res => {
        console.log(res);
        if (res.data.code == 0){
          if (res.data.data != null){
            this.setData({
              addressId: res.data.data.id,
              address: res.data.data.destOneAddress + ' ' + res.data.data.destTwoAddress + ' ' + res.data.data.destThreeAddress + '\n' + res.data.data.address
            })
          } 
        }
      }
    })
  },

  hideXieyi: function(){
    this.setData({
      showXieyi: false
    })
  },

  showXieyi: function(){
    this.setData({
      showXieyi: true
    })
  }
})