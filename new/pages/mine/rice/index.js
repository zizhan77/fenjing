// pages/mine/rice/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myrice:0,
    pageNo: 1,
    pageSize: 20,
    sortList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.getSortList()
  },
  getSortList(){
    var _this = this
    wx.showLoading({title: "加载中"});
    app.apiRequest({
      url: '/user/phone/integralRecordByUser',
      data: {
        pageSize: this.data.pageSize,
        pageNo: this.data.pageNo
      },
      success: res => {
        // console.log("排行列表", res);
        if (res.data.code == 0) {
          var tres = res.data.data.lists
          _this.setData({
            myrice:res.data.data.wincount
          })
          if(tres.length > 0){
            _this.data.pageNo++;
            _this.setData({
              sortList:_this.data.sortList.concat(tres),
            })
          }
        }
        wx.hideLoading();
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
    this.getSortList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  }
})