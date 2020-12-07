
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isNotShare: true,
    isShowT: "展开",
    isShowF: "收起",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    app.apiRequest({
      url: '/sponsor/phone/getSponsorOne',
      data: {
        'id': option.id
      },
      success:res=>{
        this.setData({
          listAll:res.data.data
        })
      }
    })
  },
  // 展开收起效果
  tigger() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  onShow: function () {
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

})