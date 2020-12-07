const app=getApp();

// 登录授权公共方法
module.exports.getUserInfo = function (e,status) {
  console.log(this)
  let that=this;
  console.log("获取用户登录信息公共方法")
  if (e.detail.userInfo) {
    wx.setStorageSync("userLogin", e.detail.userInfo);
    console.log(status)
    if (status.stutas =="detail"){  //从列表详情页授权
      wx.navigateTo({
        url: '../index/index?id=' + status.id
      })
    } else if (status.stutas == "sign"){
      // console.log(this.data.acitive)
      // this.setData({
        
      // })
    }
  } else {
    wx.showToast({
      title: "请您先登录",
      icon: 'none'
    })
  }
}

// 获取手机号公共方法
module.exports.onGetPhoneNumber= function (e) {
  console.log("手机号公共方法");
  // wx.getStorageSync("userLogin");
  // if (e.detail.errMsg == "getPhoneNumber:ok") {
  //   app.apiRequest({
  //     url: '/minoPro/bind/phone',
  //     data: {
  //       encryptedData: e.detail.encryptedData,
  //       iv: e.detail.iv,
  //       userInfo: JSON.stringify(wx.getStorageSync("userLogin"))
  //     },
  //     success: res => {
  //       console.log("保存手机号", res)
  //       if (res.data.code == 0) {
  //         app.globalData.hasUserPhone = true;
  //         app.globalData.isLoged = true;
  //         app.globalData.isNew = 1
  //         wx.setStorageSync("phoneNum", true);
  //       }
  //     }
  //   })
  // } else {//拒绝授权手机号
  //   wx.showToast({
  //     title: "请您先授权手机号",
  //     icon: 'none'
  //   })
  // }
}