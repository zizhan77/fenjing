// pages/index/performance/detail.js
const app = getApp();
var util = require("../../../utils/util.js")
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fold: true,
    showBuyModal: false,
    chooseList: {

    },
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    plusStatus: 'normal',
    performanceInfo: {},
    placeInfo: {},
    ticketGearList: {},
    showTimeList: {},
    choosedShowTimeId: 0,
    choosedTicketGearId: 0,
    choosedPrice: 0,
    totalPrice: 0,
    foldHeight: 500,
    content: '',
    ticketStore: [],
    curStoreNum: 1,
    isLike: 0,
    countDownTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    wx.createSelectorQuery().select('#detail-content').boundingClientRect((rect) => {
      this.setData({
        foldHeight: wx.getSystemInfoSync().windowHeight - rect.top - 100
      })
    }).exec()
    this.getPerformanceDetail(options.id);
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
    return {
      title: '一起来拿免费门票吧',
      imageUrl: 'http://resource.jiyilive.com/img2/share/2.jpg'
    }
  },
  // 展开更多
  unfold: function (e) {
    this.setData({
      foldHeight: null
    })
  },

  //购买按钮
  bindBuy: function () {
    if (this.data.placeInfo.chooseSeat == 1){
      wx.navigateTo({
        url: 'chooseSite?id=' + this.data.performanceInfo.id + 
        '&showTimeList=' + JSON.stringify(this.data.showTimeList) + 
        '&ticketGearList=' + JSON.stringify(this.data.ticketGearList) +
        '&limitNumber=' + this.data.performanceInfo.limitNumber
      })
    }else{
      //获取库存
      this.getTicketStore();
      this.setData({
        showBuyModal: true
      })
    }
  },

  //送我按钮绑定事件
  bindFree: function(){

  },

  //隐藏底部弹框
  hideModal: function () {
    this.setData({
      showBuyModal: false
    })
  },

  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    if (this.data.choosedShowTimeId == 0) {
      wx.showToast({
        title: '请先选择时间',
        icon: 'none'
      })
      return false;
    }
    if (this.data.choosedTicketGearId == 0) {
      wx.showToast({
        title: '请先选择票档',
        icon: 'none'
      })
      return false;
    }
    // 不能超过剩余库存
    if (num < this.data.curStoreNum && num < this.data.performanceInfo.limitNumber){
      num++;
    }
   
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    var plusStatus = (num >= this.data.curStoreNum || num >= this.data.performanceInfo.limitNumber)? 'disabled':'normal';

    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      plusStatus: plusStatus,
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    if (this.data.choosedShowTimeId == 0) {
      wx.showToast({
        title: '请先选择时间',
        icon: 'none'
      })
      return false;
    }
    if (this.data.choosedTicketGearId == 0) {
      wx.showToast({
        title: '请先选择票档',
        icon: 'none'
      })
      return false;
    }
    if (num > this.data.curStoreNum){
      num = this.data.curStoreNum;
      wx.showToast({
        title: '仅剩'+ this.data.curStoreNum + '份',
        icon: 'none'
      })
    }
    if (num > this.data.performanceInfo.limitNumber) {
      num = this.data.performanceInfo.limitNumber;
      wx.showToast({
        title: '每人限购' + this.data.performanceInfo.limitNumber + '份',
        icon: 'none'
      })
    }
    console.log(num)
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    var plusStatus = (num >= this.data.curStoreNum || num >= this.data.performanceInfo.limitNumber) ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      plusStatus: plusStatus,
    });
  },

  bindnotice: function(e) {
    wx.showModal({
      title: this.data.performanceInfo.buyNotes,
    })
  },

  //获取演出详情信息
  getPerformanceDetail(performanceId){
    wx.showLoading({
      title: '加载中',
    })
    app.apiRequest({
      url: '/performance/getDetail',
      data: {
        id: performanceId
      },
      success: res=>{
        if(res.data.code === 0 ){
          this.isLike(res.data.data.performanceVo.id);
          for (var i = 0; i < res.data.data.performanceVo.showList.length; i++){
            res.data.data.performanceVo.showList[i].showTime = util.getDates(res.data.data.performanceVo.showList[i].startTimeStr.replace(/-/g, '/'))
          }
         // console.log( res.data.data.performanceVo.ticketGearList)
          this.setData({
            performanceInfo: res.data.data.performanceVo,
            placeInfo: res.data.data.placeInfo,
            ticketGearList: res.data.data.performanceVo.ticketGearList,
            showTimeList: res.data.data.performanceVo.showList,
          })
          //如果是预售已知时间状态，开始倒计时
          if (res.data.data.performanceVo.status == 2){
            this.countDown();
          }
          WxParse.wxParse('content', 'html', res.data.data.performanceVo.detail, this, 5);
          wx.setStorage({
            key: "placeId",
            data: res.data.data.performanceVo.placeId
          })
        }else{
          wx.redirectTo({
            url: '/pages/errors/404?message='+ res.data.message,
          })
        }
      },
      complete: res=>{
        wx.hideLoading();
      }
    })
  },

  getTicketStore: function(e){
    app.apiRequest({
      url: '/ticketStore/queryListById',
      data: {
        'performanceId': this.data.performanceInfo.id,
        'page': 1,
        'limit': 100,
      },
      success: res => {
        if (res.data.code === 0) {
          console.log(res.data.data);
          let list = res.data.data.list;
          let ticketStore = new Array();
          for(var i=0; i < list.length; i++){
            if (!ticketStore[list[i].showId]){
              ticketStore[list[i].showId] = new Array() 
            }
            ticketStore[list[i].showId][list[i].ticketGearId] = list[i].storeNum
            
          }
          this.setData({
            ticketStore: ticketStore
          })
        }
      }
    })
  },

  bindAttention: function(e){
    app.apiRequest({
      url: '/user/like/insert',
      data: {
        performanceId: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.code == 0){
          wx.showToast({
            title: '关注成功',
          })
          this.setData({
            isLike: 1
          })
        }
      }
    })
  },

  bindDisattention: function(e){
    app.apiRequest({
      url: '/user/like/delete',
      data: {
        performanceId: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '已取消',
            icon: 'none'
          })
          this.setData({
            isLike: 0
          })
        }
      }
    })
  },

  chooseShowTime: function(e){
    this.setData({
      choosedShowTimeId: e.currentTarget.dataset.id,
    })
    console.log(this.data.choosedShowTimeId)
  },

  chooseTicketGear: function(e) {
    if (this.data.choosedShowTimeId == 0){
      wx.showToast({
        title: '请先选择时间',
        icon: 'none'
      })
      return false;
    }
    let ticketStore = this.data.ticketStore;
    this.setData({
      choosedTicketGearId: e.currentTarget.dataset.id,
      choosedPrice: e.currentTarget.dataset.price,
      curStoreNum: ticketStore[this.data.choosedShowTimeId][parseInt(e.currentTarget.dataset.id)]
    })
  },

  bindConfirmOrder: function(e) {
    if (this.data.choosedShowTimeId == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      })
      return false;
    }
    if (this.data.choosedTicketGearId == 0){
      wx.showToast({
        title: '请选择票档',
        icon: 'none'
      })
      return false;
    }
    if (this.data.num == 0) {
      wx.showToast({
        title: '请选择数量',
        icon: 'none'
      })
      return false;
    }

    if (this.data.num > this.data.curStoreNum) {
      wx.showToast({
        title: '仅剩' + this.data.curStoreNum + '份',
        icon: 'none'
      })
      return false;
    }
    if (this.data.num > this.data.performanceInfo.limitNumber) {
      wx.showToast({
        title: '每人限购' + this.data.performanceInfo.limitNumber + '份',
        icon: 'none'
      })
      return false;
    }

    let time = '';
    for (var i = 0; i < this.data.showTimeList.length; i++) {
      if (this.data.choosedShowTimeId == this.data.showTimeList[i].id) {
        time = this.data.showTimeList[i].showTime;
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/order/payment/confirm?id=' + this.data.performanceInfo.id +
        '&totalPrice=' + this.data.choosedPrice * this.data.num +
        '&choosedShowTime=' + time.date + ' ' + time.time +
        '&price=' + this.data.choosedPrice +
        '&num=' + this.data.num +
        '&showId=' + this.data.choosedShowTimeId +
        '&ticketGearId=' + this.data.choosedTicketGearId
    })
  },

  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
  
    // 对结束时间进行处理渲染到页面
    let startTime = new Date(this.data.performanceInfo.startSaleDateStr.replace(/-/g, '/')).getTime();
    // let startTime = new Date('2019-07-06 16:38:00').getTime();
    let obj = null;
    // 如果活动未开始，对时间进行处理
    if (startTime - newTime > 0) {
      let time = (startTime - newTime) / 1000;
      // 获取时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600) + day * 24;
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
      // 渲染，然后每隔一秒执行一次倒计时函数
      this.setData({
        countDownTime: obj
      })
      setTimeout(this.countDown, 1000);

    } else {//活动已结束，更改状态，开启购买按钮
      let performanceInfo = this.data.performanceInfo;
      performanceInfo.status = 3;
      this.setData({
        performanceInfo: performanceInfo
      })
    }
  },

  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },

  bindGoIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  isLike: function (performanceId){
    app.apiRequest({
      url: '/user/like/isLike',
      data: {
        performanceId: performanceId
      },
      success: res => {
        if (res.data.code == 0){
          this.setData({
            isLike: res.data.data
          })
        }
      }
    })
  }
})