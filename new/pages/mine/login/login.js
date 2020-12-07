// pages/mine/login/login.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveNoUser:true,
    haveUserPhone:false,//是否有手机号
    isRegister:false,//是否注册
    isGetCount:false,//是否领取88饭团
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.getinfo==2){
      this.setData({
        haveNoUser:false,
        haveUserPhone:true
      })
    }
  },
  haveGetUser:function(e){
    var _this = this;
    if (e.detail.userInfo) {    
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.isGoGetPhone=false;
      app.globalData.hasUserInfo = true;
      //存储用户昵称头像等信息
      let data = {}, obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl
      if(!app.globalData.hasUserPhone){        
        this.setData({
          haveNoUser: false,
          haveUserPhone: true
        });
        return;}
      app.apiRequest({
        url: '/user/updateUserName',
        data,
        success: (res) => {
          if(res.data.code==0){
            wx.showToast({
              title:"登录成功"
            })
            setTimeout(()=>{
              this.giveUpCount()
              return;
              console.log(app.globalData.currentPage)
              if (app.globalData.currentPage!==''){
                  wx.redirectTo({
                    url: app.globalData.currentPage
                  })
                  wx.switchTab({
                    url: app.globalData.currentPage
                  })
                 app.globalData.currentPage = ''
              } else {
                wx.switchTab({
                  url: "/pages/index/index"
                })
              }
            },500)
          }
        },
        code5: 1
      });
    } else {//拒绝了
      wx.showToast({
        title:"请您先登录",
        icon:'none'
      });
    }
  },
  onGetPhoneNumber: function (e) {
    console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.apiRequest({
        url: '/minoPro/bind/phone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          userInfo: JSON.stringify(app.globalData.userInfo)
        },
        success: res => {
          console.log("保存手机号",res)
          if (res.data.code == 0) {
            app.globalData.hasUserPhone = true;            
            app.globalData.isLoged = true;
            wx.switchTab({
              url:'/pages/index/index'
            })
            return;
            this.setData({
              isRegister: true
            });                     
          }
        }
      })
    }else{//拒绝授权手机号
      wx.showToast({
        title: "请您先授权手机号",
        icon: 'none'
      });
    }   
  },
  getCount:function(){
    app.apiRequest({//存完手机号，说明是注册
      url: '/user/phone/addintegral',
      data: {},
      success: res => {
        this.setData({
          isRegister: false,
          isGetCount: true
        });
      }
    })
  },
  giveUpCount:function(){
    if(app.globalData.currentPage!==''){
      if(app.globalData.currentPage.indexOf("/pages/index/index")>-1 ||
        app.globalData.currentPage.indexOf("/pages/mine/index") > -1 ||
        app.globalData.currentPage.indexOf("/pages/discover/index") > -1 ){
            wx.switchTab({
              url: app.globalData.currentPage
            }) 
        }else{
          wx.navigateTo({
            url: app.globalData.currentPage
          })
        }      
    } else {
      wx.switchTab({
        url: "/pages/index/index"
      })
    }
  },
  makeAiDou:function(){//跳排行榜
    wx.switchTab({
      url:"/pages/discover/index"
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
  onShareAppMessage() {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index",
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  }
})