// pages/index/share/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharedFriends:0,
    haveGetRice:0,
    isNotShare:true,
    riceCount:20,
    firstName:'李**',
    helpPer:1,
    getRice:50
  },
 /*   命期函数--监听页面加载   */
  onLoad: function (option) {

    // zt
    console.log(wx.getStorageSync("newPeople"))
    if (wx.getStorageSync("newPeople")=="no"){
        this.getFriend();
    }
    if (wx.getStorageSync("userLogin")) {
      this.setData({
        userLogin: true
      })
    }
    if (wx.getStorageSync("phoneNum")) {
      this.setData({
        phoneNum: true
      })
    }
    // zt
    app.apiRequest({
      url: '/user/queryUserId',
      success: function (res) {
        console.log(res.data.data);
        app.globalData.userNumId = res.data.data;
      },
      fail: function (res) {
        console.log("失败了：", res)
      }
    })
    // end
    this.makeRandMess();
    this.getAllMess();
    if (!app.globalData.currentPage || app.globalData.currentPage == '') {
      this.setData({isNotShare:true});
      var pages = getCurrentPages(); 				//获取加载的页面
      var currentPage = pages[pages.length - 1]   //获取当前页面的对象
      var url = currentPage.route 				//获取页面url
      var can = false, tmpc = '', tmpurl;
      for (let to in option) {
        can = true;
        if (tmpc != '') { tmpc += "&" }
        tmpc += to + "=" + option[to]
      }
      if (can) { tmpurl = url + "?" + tmpc; } else { tmpurl = url; }
      app.globalData.currentOption = JSON.stringify(option);
      app.globalData.currentPage = '/' + tmpurl;
    }
    // app.checkOver(option, (option) => {
      if (JSON.stringify(option) == "{}") {
        if (app.globalData.currentOption != '') {
          if (app.globalData.currentOption) {
            option = JSON.parse(app.globalData.currentOption);
            app.globalData.currentOption = ''
          }
        }
      }
      if(option.u){app.makeHelp(option.u);this.setData({isNotShare:false});}
    // })
  },
  // zt
  // 获取授权
  haveGetUser(e){
    if (e.detail.userInfo) {
      wx.setStorageSync("userLogin", e.detail.userInfo);
      let data = {}, obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl
      // 获取token
      wx.login({
        success: res => {
          console.log(res.code)
          app.globalData.jsCode = res.code;
          app.globalData.checkLogin = true;
          app.apiRequest({
            url: '/login/minoPro/getToken',
            data: {
              'jscode': app.globalData.jsCode
            },
            success: (res) => {
              console.log(res.data);
              if (res.data.code === 0) {

                console.log(res.data.data.length)
                app.globalData.isgetToken = true;
                app.globalData.apiToken = res.data.data[0];
                wx.setStorageSync("token", res.data.data[0]);
                app.globalData.userId = res.data.data[1]
                app.globalData.isNew = 0;
                console.log(app.globalData.apiDomain)
                console.log(app.globalData.apiToken)
                // 获取是否有电话号
                app.apiRequest({
                  url: '/user/phone/queryUserIdAndActvitity',
                  success: res => {
                    console.log("获取饭团数：", res.data.data.phoneNumber)
                    if (!res.data.data.phoneNumber) {
                      wx.setStorageSync("phoneNum", false);
                    } else {
                      wx.setStorageSync("phoneNum", true);
                    }
                    wx.hideLoading()
                  }
                })

                // 更新微信名称
                app.apiRequest({
                  url: '/user/updateUserName',
                  data,
                  success: (res) => {
                    console.log(app.globalData.apiToken)
                    console.log(res)
                    if (res.data.code == 0) {
                      this.setData({
                        userLogin: true,
                      })
                    }
                  },
                  code5: 1
                })

                // 新用户返两个参数 老用户返三个
                // if (res.data.data.length == 3) {
                //   wx.setStorageSync("newPeople", false);
                //   app.globalData.hasUserPhone = !!res.data.data[2];
                // } else {
                //   wx.setStorageSync("newPeople", true);
                // }
              }
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: "请您先登录",
        icon: 'none'
      });
    }
  },
  // 获取手机号
  onGetPhoneNumber(e){
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.apiRequest({
        url: '/minoPro/bind/phone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          userInfo: JSON.stringify(wx.getStorageSync("userLogin"))
        },
        success: res => {
          if (res.data.code == 0) {
            this.onShareAppMessage();
            console.log(res)
            wx.setStorageSync("phoneNum", true);
            this.setData({
              phoneNum:true,
              userLogin:true
            })
            app.globalData.hasUserPhone = true;
            app.globalData.isLoged = true;
          }
        }
      })
    } else {//拒绝授权手机号
      wx.showToast({
        title: "请您先授权手机号",
        icon: 'none'
      });
    }
  },
  // end
  makeRandMess(){
    let allFirstName='赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董粱杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄麴家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴欎胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍舄璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查後荆红游竺权逯盖益桓公子鼠丑牛寅虎卯兔辰龙巳蛇午马未羊申猴酉鸡戌狗亥猪ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz-*/_=+.1234567890·~！@#￥%……&*（）{}【】[]|/,';
    let alll=allFirstName.length;
    let mayl=Math.ceil(Math.random()*3)+2;
    let mays='';
    for(let i=0;i<mayl;i++){
      let randi=Math.floor(Math.random()*alll)
      if(mays.length>1){
        mays=mays+"*";
      }else{
        mays = mays + allFirstName.split('')[randi];
      }
    }
    let mayc=Math.round(Math.random()*5);
    this.setData({
      helpPer: mayc,
      riceCount: mayc*20,
      firstName: mays,
      makeNews:0,
      makeMesses:0
    })
    setTimeout(()=>{this.makeRandMess()},6000);
  },
  getAllMess(){
    app.apiRequest({
      url: "/reward/pc/integralRoleList",
      success: res => {
        console.log(res)
        this.setData({          
          getRice: res.data.data[3].addcount,
        })        
      }
    })
  },
  getFriend(){
    app.apiRequest({
      url:"/activityShare/phone/showShareInUser",
      success:res=>{
        console.log(res)
        this.setData({
          sharedFriends:res.data.data.count,
          haveGetRice:res.data.data.sumofcount
        })
        // console.log(res)
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

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(app.globalData.userNumId)
    return {
      title: '墙裂推荐！我发现一个能免费拿演出票的地方>>',
      path: "/pages/index/index?u=" + app.globalData.userNumId,
      imageUrl: "http://resource.jiyilive.com/img2/share/3.jpg"
    } 
  }
})