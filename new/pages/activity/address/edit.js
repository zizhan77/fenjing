// pages/mine/address/edit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: null,
    mobile: null,
    region: ['','',''],
    detailAddress: null,
    isDefault: false,
    id: null,
    action: 'add'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id=options.id
   this.data.prizeId=options.pid;
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

  //提交表单
  submitForm: function() {
    if (!this.data.userName) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
      return false;
    }

    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    }

    if (this.data.region.indexOf('') >= 0){
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false;
    }

    if (!this.data.detailAddress){
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false;
    }

    let data = {
      receiverName: this.data.userName,
      receiverMobile: this.data.mobile,
      destOneAddress: this.data.region[0],
      destTwoAddress: this.data.region[1],
      destThreeAddress: this.data.region[2],
      address: this.data.detailAddress,
      isDefault:1
    }    
    console.log(data);
    app.apiRequest({
      url: this.data.action == 'add' ? '/user/address/add' : '/user/address/updateById',
      data: data,
      success: res => {
        if (res.data.code == 0){
          this.makeSurePrize(data)
        }
      }
    })
  },
makeSurePrize:function(data){
  var id = this.data.id,
    prizeId = this.data.prizeId,
    _this = this;
  var datas = {}
  datas.prizeId = parseInt(id);//长的  177695//
  datas.id = parseInt(prizeId);//短的1698 //
  datas.contactName = data.receiverName;
  datas.contactPhone = data.receiverMobile;
  datas.contactProvince = data.destOneAddress;
  datas.contactAddress = data.destOneAddress + data.destTwoAddress + data.destThreeAddress + (data.destFourAddress || '') + data.address;

  app.apiRequest({
    url:"/reward/update",
    data:datas,
    success:function(res){
      wx.showToast({ title: "已确认", icon: "none" });
      setTimeout(()=>{
        wx.redirectTo({ url: '../index/index?id=' + app.globalData.selfActiveId})
      },1000);
    }
  });
},
  //更改省市区
  RegionChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  editName: function(e){
    this.setData({
      userName: e.detail.value
    })
  },

  editMobile: function(e){
    this.setData({
      mobile: e.detail.value
    })
  },

  editDetailAddress: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },

  bindChoose: function(e){
    this.setData({
      isDefault: !this.data.isDefault
    })
  },

  bindGetLocation: function(){
    wx.showLoading({
      title: '正在获取位置信息',
    })
    wx.getLocation({
      success: res => {
        console.log(res)
        wx.request({
          url: 'http://apis.map.qq.com/ws/geocoder/v1/',
          method: 'GET',
          data: {
            location: res.latitude+','+res.longitude,
            key: app.qqMapKey
          },
          success: res => {
            console.log(res);
            if(res.data.status == 0){
              this.setData({
                region: [res.data.result.ad_info.province, res.data.result.ad_info.city, res.data.result.ad_info.district]
              });
              wx.hideLoading();
            }else{
              wx.hideLoading();
              wx.showToast({
                title: '获取位置信息失败',
                icon: 'none'
              })
            }
          },
          fail: res => {
            wx.hideLoading();
            wx.showToast({
              title: '获取位置信息失败',
              icon: 'none'
            })
          }
        })
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
            title: '获取位置信息失败',
            icon: 'none'
        })
      }
    })
  }

})