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
    this.getInfo()
    
  },
  getInfo: function (e) {
    app.apiRequest({
      url: '/my/findUserByToken',
      success: res => {
        // console.log("所有用户信息：", res)
        if (res.data.code == 0) {
          var isHave=false;
          if (res.data.data.gender != null && res.data.data.birthday != null){
            isHave=true            
          }
          this.setData({
            isHaveInfo:isHave,
            isGender: res.data.data.gender
          })
          this.getAddressList();
        }
      }
    })
  },
  //性别改变时触发
  bindGenderChange: function () {
    let datas={}
    datas.isaddress=1
    if (this.data.isHaveInfo) { datas.gender = this.data.isGender;}else{
      return;
    }
    app.apiRequest({
      url: '/my/updateUserByToken',
      data: datas,
      success: res => {
        // console.log(res)
        if (res.data.code == 0) {
        } else {          
        }
      }
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
    // console.log(e.currentTarget.dataset.id)
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
            this.bindGenderChange()
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
      id:def.id,
      receiverName: def.receiverName,
      receiverMobile: def.receiverMobile,
      destOneAddress: def.destOneAddress,
      destTwoAddress: def.destTwoAddress,
      destThreeAddress: def.destThreeAddress,
      address: def.address,
      isDefault: def.isDefault ? 1:0
    }
    app.apiRequest({
      url:'/user/address/updateById',
      data: data,
      success: res => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '设置成功',
            success: res => {
              setTimeout(()=> {
                this.getAddressList()
              }, 500)
            }
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