// pages/mine/address/list.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: {},
    deleteAddressId: 0,
    chooseAddress: 0,
    oneAddressCode: 11,
    empty: true,
    isDefault:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.chooseAddress){
      this.setData({
        chooseAddress: options.chooseAddress
      })
    }
    this.data.id=options.id
    this.getAddressList();
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

  //修改地址
  editAddress: function(e) {
    console.log(e)
    wx.navigateTo({
      url: 'edit?action=edit&addressInfo=' + JSON.stringify(e.currentTarget.dataset.info),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //删除地址
  deleteAddress: function(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      deleteAddressId: e.currentTarget.dataset.id
    })
  },
  //取消删除，隐藏底部弹框
  hideModal: function() {
    this.setData({
      deleteAddressId: 0
    })
  },
  //确认删除
  confirm: function() {
    console.log('删除地址id:'+ this.data.deleteAddressId);
    app.apiRequest({
      url: '/user/address/deleteById',
      data: {
        id: this.data.deleteAddressId,
      },
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.getAddressList();
      }
    })
    this.hideModal();
  },
  //添加地址
  addAddress: function() {
    wx.navigateTo({
      url: 'edit?action=add',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  bindChooseAddress: function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      addressId: e.currentTarget.dataset.id,
      address: e.currentTarget.dataset.address,
      oneChooseAddress: e.currentTarget.dataset.code
    })

    wx.navigateBack();
  },

  getAddressList: function(){
    app.apiRequest({
      url: '/user/address/findByUser',
      success: res => {
        // console.log(res)
        if (res.data.code == 0){
          if(!res.data.data.length == 0){
            this.setData({
              empty: false
            })
          }
          this.setData({
            addressList: res.data.data
          })
        }
      }
    })
  },
  makeDefault(e){
    let def=e.target.dataset.info
    def.isDefault = !def.isDefault

    let data = {
      id: this.data.id,
      contactName: def.receiverName,
      contactPhone: def.receiverMobile,
      contactProvince: def.destOneAddress,      
      contactAddress: def.destOneAddress+def.destTwoAddress+def.destThreeAddress+def.address      
    }
    app.apiRequest({
      url:'/reward//phone/updateRewardFlag',
      data: data,
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '设置成功',
            success: res => {
              setTimeout(()=> {
               wx.navigateTo({url:"../index"})
              }, 500)
            }
          })
        }
      }
    })
  }
})