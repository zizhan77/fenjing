// pages/movies/movies.js
const app = getApp();
const seatNormalUrl = 'icon-seatNormal' //'../../../images/site/seatNormal.svg';
const seatChooseUrl = 'icon-seatChoose' //'../../../images/site/seatChoose.svg';
const seatDisabledUrl = 'icon-seatDisabled' //'../../../images/site/seatDisabled.svg';
const seatSpaceUrl = 'icon-seatSpace'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieName: "",
    movieTimes: "",
    //屏幕宽度/2
    left: 1,
    level: 1,
    room: 1,
    seatArr: [],
    imgWidth: 50,
    buy: "请先选座",
    opacity: 0.2,
    seatFinish: [],
    num: 0,
    price: 10,
    modalHidden: true,
    maxLimit: 4,

    ticketGearList: {},
    showTimeList: {},
    choosedShowTimeId: 1,
    choosedTicketGearId: 0,
    choosedPrice: 0,
    totalPrice: 0,
    areaInfo: {},
    performanceId: null,
    placeId: null,
    choosedSeats: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ticketGearList = JSON.parse(options.ticketGearList);
    let areaInfo = {}
    console.log(ticketGearList);
    for(var i=0; i < ticketGearList.length; i++){
      areaInfo[ticketGearList[i].areaId] = {
        price: ticketGearList[i].price,
        color: ''
      }
    }
    let showTimeList = JSON.parse(options.showTimeList);
    this.setData({
      ticketGearList: ticketGearList,
      showTimeList: showTimeList,
      areaInfo: areaInfo,
      performanceId: options.id,
      maxLimit: options.limitNumber,
      choosedShowTimeId: showTimeList[0].id
    })
    console.log('test')
    console.log(this.data.showTimeList)
  
    this.getSeatsList()
  },

  seatChange: function (e) {
    if (this.data.choosedShowTimeId == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      })
      return false;
    }

    var that = this;
    var rowCol = e.currentTarget.dataset.index;
    var row = parseInt(e.currentTarget.dataset.row)
    var col = parseInt(e.currentTarget.dataset.col)
    var price = parseFloat(e.currentTarget.dataset.price)
    var row1 = row;
    var col1 = col + 1;
    var seatNo = parseInt(e.currentTarget.dataset.seatno);
    var seatId = parseInt(e.currentTarget.dataset.seatid);
    var areaId = parseInt(e.currentTarget.dataset.areaid);
    var arr = that.data.seatArr
    var num = 0;
    if (arr[row][col]['img'] == seatChooseUrl) {
      var num = that.data.num;
      var seatFinish = that.data.seatFinish;
      --num;
      if (num <= 0) {
        that.setData({
          opacity: 0.2,
          buy: "请先选座",
        })
      }
      arr[row][col]['img'] = seatNormalUrl
      for(var i=0; i < seatFinish.length; i++){
        console.log(seatFinish[i].id)
        console.log(seatId)
        if (seatFinish[i].id == seatId){
          seatFinish.splice(i, 1);
          break
        }
      }

      console.log(seatFinish)
      that.setData({
        seatArr: arr,
        num: num,
        seatFinish: seatFinish
      })
      console.log("您取消了" + row1 + "排" + seatNo + "座")
      console.log(this.data.seatFinish)
    } else {
      var num = that.data.num;
      var seatFinish = that.data.seatFinish;
      ++num;
      if (num > this.data.maxLimit) {
        that.setData({
          modalHidden: false,
        })
        return false;
      }
      arr[row][col]['img'] = seatChooseUrl
      var seat = {
        id: seatId,
        row: row1,
        col: seatNo,
        price: price,
        areaId: areaId
      }
      seatFinish.push(seat)
      console.log(seatFinish)
      that.setData({
        opacity: 1,
        buy: "点击购买",
        seatArr: arr,
        num: num,
        seatFinish: seatFinish
      })
      console.log("您选择了" + row1 + "排" + seatNo + "座")
      console.log(arr)
    }

    let totalPrice = 0;
    let choosedPrice = '';
    let choosedSeats = '';
    let choosedSeatIds = new Array();
    for(var i = 0; i < seatFinish.length; i++){
      totalPrice += seatFinish[i].price
      choosedPrice = seatFinish[i].price
      choosedSeats += seatFinish[i].row + '排' + seatFinish[i].col + '座 '
      choosedSeatIds.push(seatFinish[i].id);
    }
    if ((choosedPrice * num) != totalPrice){
      choosedPrice = '';
    }

    this.setData({
      totalPrice: totalPrice,
      choosedPrice: choosedPrice,
      choosedSeats: choosedSeats,
      choosedSeatIds: choosedSeatIds
    })
  },

  modalChange: function () {
    var that = this;
    that.setData({
      modalHidden: true,
    })
  },

  getSeatsList: function(){
    wx.showLoading({
      title: '正在获取..',
    })
    app.apiRequest({
      url: '/seats/querySeatListByShowId',
      data: {
        'showId': this.data.choosedShowTimeId,
        'placeId': wx.getStorageSync('placeId')
      },
      success: res => {
        console.log(res)
        let arr = res.data.data;
        let curLineNo = 1;
        let list = new Array();
        let areaInfo = this.data.areaInfo;
        console.log(areaInfo)
        for (var i = 0; i < arr.length; i++){
          //area颜色属性补全
          areaInfo[arr[i].areaVo.id].color = arr[i].areaVo.areaColor;
          //是否换行
          if (arr[i].lineNo != curLineNo){
            curLineNo = arr[i].lineNo;
          }
          if (!list[curLineNo]){
            list[curLineNo] = new Array();
          }
          // 0：间隔；1：已开启的座位；2：已关闭的座位；3：已售出的座位
          let imgUrl = '';
          let disabled = false;
          switch (arr[i].status){
            case 0: 
              imgUrl = seatSpaceUrl;
              disabled = true;
              break;

            case 1:
              imgUrl = seatNormalUrl;
              break;

            case 2:
              imgUrl = seatDisabledUrl;
              disabled = true;
              break;

            case 3:
              imgUrl = seatDisabledUrl;
              disabled = true;
          }

          list[curLineNo].push({
            'id': arr[i].id,
            'color': arr[i].areaVo.areaColor,
            'seatNo': arr[i].seatNo,
            'img': imgUrl,
            'disabled': disabled,
            'price': this.data.areaInfo[arr[i].areaVo.id].price,
            'areaId': arr[i].areaVo.id
          });
        }
        this.setData({
          seatArr: list,
          // imgWidth: 100/(list[1].length),
          areaInfo: areaInfo,
          seatFinish: new Array(),
          num: 0,
          totalPrice: 0
        })
        console.log(this.data.areaInfo)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },

  confirmOrder: function(){
    let time = '';
    for (var i = 0; i < this.data.showTimeList.length; i++){
      if (this.data.choosedShowTimeId == this.data.showTimeList[i].id){
        time = this.data.showTimeList[i].showTime;
        break;
      }
    }

    wx.navigateTo({
      url: '/pages/order/payment/confirm?id='+this.data.performanceId +
      '&totalPrice=' + this.data.totalPrice +
      '&choosedShowTime=' + time.date + ' ' + time.time +
      '&price=' + this.data.choosedPrice +
      '&num=' + this.data.num + 
      '&choosedSeats=' + JSON.stringify(this.data.seatFinish) + 
      '&showId=' + this.data.choosedShowTimeId
    })
  },

  chooseShowTime: function (e) {
    this.setData({
      choosedShowTimeId: e.currentTarget.dataset.id
    })
    console.log(this.data.choosedShowTimeId)
    console.log(wx.getStorageSync('placeId'))
    this.getSeatsList()
  },

  // chooseTicketGear: function (e) {
  //   this.setData({
  //     choosedTicketGearId: e.currentTarget.dataset.id,
  //     choosedPrice: e.currentTarget.dataset.price,
  //   })
  // },

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

  }
})