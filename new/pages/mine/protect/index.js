// pages/mine/protect/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    protect:0,
    joind:0,
    sortList:[],
    pageNo:1,
    pageSize:20
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSortList()
  },
  getSortList(){
    var _this = this
    wx.showLoading({ title: "加载中" });
    app.apiRequest({
      url: '/user/phone/myRankingByUser',
      data: {
        pageSize: this.data.pageSize,
        pageNo: this.data.pageNo
      },
      success: res => {
        // console.log("排行列表", res);
        if (res.data.code == 0) {
          var tres = res.data.data.lists
          _this.setData({
            protect: res.data.data.wincount,
            joind:res.data.data.rows
          })
          if (tres.length > 0) {
            _this.data.pageNo++;            
            for(let i in tres){
              tres[i].sday = makeTime(tres[i].endTime);
              tres[i].endTime = tres[i].endTime.substr(0,10)              
            }
            _this.setData({
              sortList: _this.data.sortList.concat(tres)
            })
          }else{//没内容

          }
        }
        wx.hideLoading();
      }
    })
    function makeTime(endTime){
      //日期格式化
      var start_date = new Date();
      var end_date = new Date(endTime.replace(/-/g, "/"));
      //转成毫秒数，两个日期相减
      var days = end_date.getTime() - start_date.getTime();
      //转换成小时数 天数
      // var day = parseInt(days / (1000 * 60 * 60));
      return days;
    }
  },
  showPaih: function (e) {//进入活动函数    
    var tid = e.target.dataset.id
    wx.navigateTo({
      url: "/pages/discover/performance/detail?id=" + tid
    })
  },
  showNot(){
    wx.showToast({
      title:"排行已结束，请参与其他排行吧",
      icon:"none"
    });
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