// pages/mine/userinfo/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    genderList: ['待完善', '男', '女'],
    genderIndex: 0,
    birthday: null,
    mobile: '',
    integral: 0,
    address:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    //@Todo: 接口获取用户信息
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    this.getInfo();
    this.getAddress()
  },
  getAddress(){
    app.apiRequest({
      url: '/user/address/findByUser',
      success: res => {
        console.log(res)
        if (res.data.code == 0) {
          if (!res.data.data.length == 0) {
            this.setData({
              address: res.data.data[0].destOneAddress + ' ' + res.data.data[0].destTwoAddress
            })
          }
        }
      }
    })
  },
  editAddress(){
    wx.navigateTo({
      url: '../address/list',
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
  //性别改变时触发
  bindGenderChange:function(e){
    app.apiRequest({
      url: '/my/updateUserByToken',
      data: {
        gender: e.detail.value,
        isaddress:this.data.address ? 1:0
      },
      success: res => {        
        if (res.data.code == 0){
          this.setData({
            genderIndex: e.detail.value
          })
        }else{
          wx.showToast({
            title: '更新失败',
            icon: 'none'
          })
        }
      }
    });
  },
  //生日改变时触发
  bindBirthdayChange: function (e) {
    app.apiRequest({
      url: '/my/updateUserByToken',
      data: {
        birthday: e.detail.value + ' 12:00:00',
        isaddress: this.data.address ? 1 : 0
      },
      success: res => {
        if (res.data.code == 0){
          this.setData({
            birthday: e.detail.value,            
          })
        }else{
          wx.showToast({
            title: '更新失败',
            icon: 'none'
          })
        }
      }
    })
    this.setData({
      birthday: e.detail.value
    })
  },
  getInfo: function(e){
    app.apiRequest({
      url: '/my/findUserByToken',
      success: res => {
        console.log("所有用户信息：",res)
        if (res.data.code == 0){
          let birthday = '';
          if (res.data.data.birthday){
            birthday = res.data.data.birthday.substring(0, 10);
          }
          this.setData({
            genderIndex: res.data.data.gender,
            mobile: res.data.data.phoneNumber,
            birthday: birthday,
            integral: res.data.data.integral
          })
        }
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  }
})