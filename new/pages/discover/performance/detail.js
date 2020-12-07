// pages/index/performance/detail.js
const app = getApp();
var util = require("../../../utils/util.js")
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fold: true,
    showBuyModal: false,
    chooseList: {},
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    plusStatus: 'normal',
    performanceInfo: {},
    placeInfo: {},
    ticketGearList: {},
    showTimeList: {},
    choosedShowTimeId: 0,
    choosedTicketGearId: 0,
    choosedPrice: 0,
    totalPrice: 0,
    foldHeight: "291rpx",
    content: '',
    ticketStore: [],
    curStoreNum: 1,
    isLike: 0,
    countDownTime: 0,
    showEnter: true,
    showMess: false,
    sday: 0,
    lastTime: '0小时0分',
    isExtend: true,
    sponsors: [],//所有赞助商
    activityId: 0,
    pageInit: {
      number: 1,
      size: 10
    },
    rankList:[],
    rankListt: [],
    mineDetal:{},
    noMore:false,//投饭团弹窗
    haveAdded:'',//已输入的的饭团数0
    inputBottom:0,//输入框位置
    isNotShare: true,
    defaultimg: 'http://resource.jiyilive.com/img2/index/newlogo.png',
    isShowT:"展开",
    isShowF:"收起"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option.id)
    // zt
    if (!wx.getStorageSync("userLogin")){
      this.setData({
        active:true
      })
    }
    this.getMineDetal(option.id); 
    this.data.activityId = option.id;
    // this.getSponsors(option.id);
    this.getRankingList(option.id);
    this.getPerformanceDetail(option.id);
    // end
    if (!app.globalData.currentPage || app.globalData.currentPage == '') {
      this.setData({ isNotShare: true });
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
      if (option.u) { app.makeHelp(option.u); this.setData({ isNotShare: false }); }
      wx.onKeyboardHeightChange(res => {
        console.log("键盘高度变化",res)
        // wx.showToast({title:res.height})
      })
      // this.data.activityId = option.id
      // this.getPerformanceDetail(option.id);
      // this.getSponsors(option.id);
      // this.getRankingList(option.id);
      // this.getMineDetal(option.id); 

      // this.data.activityId = 76
      // this.getPerformanceDetail(76);
      // this.getSponsors(76);
      // this.getRankingList(76);
      // this.getMineDetal(76);    
    // });
  },

  // zt
  onShow(){
    // zt
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
  },
  // 授权登录
  haveGetUser(e){
    wx.showLoading({
      title: '加载中',
    })
    if (e.detail.userInfo) {
      wx.hideLoading()
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
            console.log(res)
            wx.setStorageSync("phoneNum", true);
            app.globalData.hasUserPhone = true;
            app.globalData.isLoged = true;
            app.globalData.isNew = 1;
            function show() {
              wx.showToast({ title: "您当前没有饭团", icon: "none" })
            }
            if (this.data.mineDetal.integral == 0) {
              show();
              this.getMineDetal(this.data.activityId);
              return;
            }
            this.setData({
              isShowAdd: true
            })

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
  // 展开收起效果
  tigger(){
    this.setData({
      isShow: !this.data.isShow
    })
  },
  // end
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '一起来拿免费门票吧',
      path: "/pages/discover/performance/detail?u="+app.globalData.userId+"&id="+this.data.activityId,
      imageUrl: 'http://resource.jiyilive.com/img2/share/3.jpg'
    }
  },
  // 展开更多
  unfold: function (e) {
    this.setData({
      foldHeight: 'auto',
      isExtend: false
    })
  },
  //获取演出详情信息
  getPerformanceDetail(performanceId) {
    console.log(performanceId)
    wx.showLoading({
      title: '加载中',
    })
    app.apiRequest({
      url: '/ranking/phone/queryRankingDetail',
      data: {
        id: performanceId
      },
      success: res => {
        console.log(res.data)
        if (res.data.code === 0) {
          this.setData({
            performanceInfo: res.data.data,
            cont: res.data.data.intro
          })
        this.getSponsors(res.data.data.id)

          WxParse.wxParse('content', 'html', res.data.data.intro || '', this, 5);
          this.makeEndTime(res.data.data.endTime)
        }
      },
      // complete: res => {
      //   wx.hideLoading();
      // }
    })
  },
  getRankingList(){
    app.apiRequest({
      url: '/ranking/phone/queryUserByRanking',
      data: {
        id: this.data.activityId,
        pageNo:this.data.pageInit.number,
        pageSize:this.data.pageInit.size
      },
      success: res => {        
        if (res.data.code === 0 && res.data.data.lists.length) {
          let tar=[],ti=0,tmpar=res.data.data.lists;
          for(let i in tmpar){
            tmpar[i].sort = Math.abs(parseInt(tmpar[i].sort))
          }
          if(this.data.pageInit.number==1){
            while (ti < 3 && tmpar[0]) {
              tar.push(tmpar.shift());
              ti++;
            }
            for(let i in tar){
              tar[i].number=i
            }
            if (tar[1]) {
              let ttwo = tar.shift()
              tar.splice(1, 0, ttwo)
            }
            this.setData({              
              rankListt: tar
            })
          }
          this.data.pageInit.number++
          this.setData({
            rankList: this.data.rankList.concat(tmpar)            
          })
          // console.log(this.data.rankList, this.data.rankListt)
        }else{
          this.setData({
            noMore:true
          })
        }
      },
      complete: res => {
        wx.hideLoading();
      }
    })
  },
  getSponsors(tid) {
    app.apiRequest({
      url: "/sponsor/phone/queryAllSponorByPhone",
      // url: "/activity/phone/queryActivityDetail",

      data: { "activityid": tid },
      success: res => {
        console.log("赞助商",res);
        this.setData({
          sponsors: res.data.data
        })
      }
    })
  },
  // 赞助商跳转
  sponsor(e) {
    wx.navigateTo({
      url: '../../activity/performance/sponsor?id=' + e.currentTarget.dataset.spid ,
    })
  },
  getMineDetal(tid){
    app.apiRequest({
      url: "/ranking/phone/getRankingtToUserIntegrty",
      data: { "id": tid },
      success: res => {
        console.log("我的信息",res);
        res.data.data.rankintegral = Math.abs(parseInt(res.data.data.rankintegral))
        this.setData({
          mineDetal: res.data.data
        })
      }
    });
  },
  bindBuy() {//进入活动
    wx.navigateTo({
      url: '../index/index?id=' + this.data.activityId
    })
  },
  makeEndTime(endt) {
    let nowt = new Date().getTime();
    let endd = new Date(endt.replace(/\-/g, '/')).getTime();

    if ((endd - nowt) < 0) {
      wx.showToast({
        title: "活动已结束",
        icon: "none"
      })
      wx.switchTab({
        url: "/pages/index/index"
      })
    } else {
      let tdelta = endd - nowt;
      let td = Math.floor(tdelta / (60 * 60 * 1000 * 24)),
        tmpde = tdelta - (td * 60 * 60 * 1000 * 24),
        th = Math.floor(tmpde / (60 * 60 * 1000)),
        tm = Math.floor((tmpde % (60 * 60 * 1000)) / 60000),
        ts = Math.floor((tmpde % (60 * 60 * 1000)) % 60000 / 1000)
      var tst = "";
      if (td > 0) {
        tst += td + "天"
        tst += th + '小时'
        tst += tm + "分"
      } else {
        if (th > 0) { tst += th + '小时'; }
        tst += tm + "分";
        tst += ts + "秒";
      }
     
      this.setData({
        lastTime: tst
      })
      setTimeout(() => { this.makeEndTime(endt); }, 1000);
    }
  },
    
  isLike: function (performanceId) {
    app.apiRequest({
      url: '/user/like/isLike',
      data: {
        performanceId: performanceId
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            isLike: res.data.data
          })
        }
      }
    })
  },
  backDetail: function () {
    wx.switchTab({
      url: '/pages/discover/index'
    })
  },
  bindAddRice(){
    function show() {
      wx.showToast({ title: "您当前没有饭团", icon: "none" })
    }    
    if (this.data.mineDetal.integral ==0) {
      show();
      this.getMineDetal(this.data.activityId);
      return;
    }
    this.setData({
      isShowAdd: true ,
      haveAdded:""   
    })
  },
  sendRiceAdd: function () {//发送投饭团数据
    var tid = this.data.nowId;
    var coun = this.data.haveAdded;

    console.log(this.data.activityId)
    console.log(coun)

    var _this = this;
    if (coun == 0 || coun == "") {
      wx.showToast({
        title: "不能投0个哦~",
        icon: "none"
      });
      return false;
    }
    // console.log(tid,coun)
    app.apiRequest({
      url: '/ranking/add',
      data: {
        id: this.data.activityId,
        count: coun
      },
      success: res => {    
        console.log(res)    
        if (res.data.code == 0) {
          wx.showToast({
            title: "投递成功~"
          })
          _this.getMineDetal(_this.data.activityId);
          _this.getPerformanceDetail(_this.data.activityId)
          _this.data.pageInit.number=1
          _this.data.rankList=[];
          _this.data.rankListt= [];
          _this.getRankingList(_this.data.activityId)
          _this.setData({
            isShowAdd:false
          })
        } else {
          wx.showToast({
            title: "投递失败，请稍后重试",
            icon: "none"
          })
        }
      }
    });
  },
  checkNum: function (e) {
    console.log(e)
    var v = e.detail.value;
    v = parseInt(v);
    if (isNaN(v)) {
      console.log()
      wx.showToast({ title: "请您输入数字", icon: "none" })
      this.setData({
        haveAdded: ""
      });
      return;
    }
    if (v > this.data.mineDetal.integral) {
      wx.showToast({ title: "投递数量不能多于您的饭团总数", icon: "none" })
      this.setData({
        haveAdded: this.data.mineDetal.integral
      });
      return;
    }
    this.setData({
      haveAdded:v
    })
  },
  closeRicek(){
    this.setData({
      isShowAdd:false
    })
  }
})