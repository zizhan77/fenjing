// pages/discover/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    discoverList: [],
    icoFocus: '', //图标拖动添加的效果
    icon: {
      icoPosX: "0", //横向 取值 left， right
      icoPosY: "370px", //纵向 取值 top bottom;
      icoLeft: "right", //水平坐标
      icoTop: 'top', //垂直坐标
    },
    icoTime: 0, //开始按住的时间
    icoMoving: false, //是否正在移动
    tmpPos: {
      x: 0,
      y: 0
    }, //缓存每次位置
    nowPage: 1, //页码
    mineRice: 0,
    mineActive: 0,
    mineShow: 0,
    defaultimg: 'http://resource.jiyilive.com/img2/index/newlogo.png',
    stars: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    // zt
    let userS = wx.getStorageSync("userLogin");
    if (userS) {
      this.setData({
        show: true
      })
    } else {
      this.setData({
        show: false
      })
    }
    this.getActivities();
    // end
    if (!app.globalData.currentPage || app.globalData.currentPage == '') {
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var url = currentPage.route //获取页面url
      var can = false,
        tmpc = '',
        tmpurl;
      for (let to in option) {
        can = true;
        if (tmpc != '') {
          tmpc += "&"
        }
        tmpc += to + "=" + option[to]
      }
      if (can) {
        tmpurl = url + "?" + tmpc;
      } else {
        tmpurl = url;
      }
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
      if (option.u) {
        app.makeHelp(option.u);
      }
      //新增获取已有位置
      this.updatePos()
      this.data.sys = wx.getSystemInfoSync()
      //获取规则框真是宽度
      this.data.ruleTrueWidth = 120 / 750 * this.data.sys.windowWidth;
      this.data.ruleTrueHeight = 160 / 750 * this.data.sys.windowWidth;
      this.data.ruleTrueBottom = 140 / 750 * this.data.sys.windowWidth;
      // this.getActivities();
    // });
    // 新增获取明星列表
    this.getStarlist()
  },
  getStarlist(){
    app.apiRequest({
      url:'/actor/phone/getActorList',
      data: {
        page:1,
        pageSize:20
      },
      success:res => {
        // console.log('明星数据：',res);    
        let tdata=res.data.data.lists.map(item => {
          item.integral = item.integral > 10000 ? Math.round(item.integral/100)/100+'W':item.integral
          return item
        })
        console.log(tdata)
        this.setData({
          stars: tdata
        })
      }
    })
  },
  showStar(e){
   
    let starid=e.target.dataset.id
    wx.navigateTo({
      url:'star/detail?id='+starid
    })
  },
  // zt点击授权登录
  haveGetUser: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    if (e.detail.userInfo) {
      wx.hideLoading()
      wx.setStorageSync("userLogin", e.detail.userInfo);
      this.setData({
        show: true
      })
      let data = {},
        obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl
      // 获取token
      wx.login({
        success: res => {
          // console.log(res.code)
          app.globalData.jsCode = res.code;
          app.globalData.checkLogin = true;
          app.apiRequest({
            url: '/login/minoPro/getToken',
            data: {
              'jscode': app.globalData.jsCode
            },
            success: (res) => {
              // console.log(res.data);
              if (res.data.code === 0) {

                // console.log(res.data.data.length)
                app.globalData.isgetToken = true;
                app.globalData.apiToken = res.data.data[0];
                wx.setStorageSync("token", res.data.data[0]);
                app.globalData.userId = res.data.data[1]
                app.globalData.isNew = 0;
                // console.log(app.globalData.apiDomain)
                // console.log(app.globalData.apiToken)
                // 获取是否有电话号
                app.apiRequest({
                  url: '/user/phone/queryUserIdAndActvitity',
                  success: res => {
                    // console.log("获取饭团数：", res.data.data.phoneNumber)
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
                    // console.log(app.globalData.apiToken)
                    // console.log(res)
                    if (res.data.code == 0) {
                      this.setData({
                        userLogin: true,
                      })
                    }
                  },
                  code5: 1
                })

                // 从首页分享领饭团分享后打开授权
                if (app.globalData.share == "yes") {
                  app.apiRequest({
                    url: "/activityShare/shareForUserAndSign",
                    data: {
                      userId: app.globalData.tid,
                      type: 0,
                      shareFrom: 1,
                      isNew: 1
                    },
                    success: res => {
                      console.log(res)
                    }
                  })
                }

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
  // end
  onPullDownRefresh: function() {
    this.data.nowPage = 1;
    this.data.discoverList = [];
    this.getActivities();
    this.checkRice()
    wx.stopPullDownRefresh();
  },
  checkRice() {
    app.apiRequest({
      url: '/ranking/phone/getRankingMoney',
      success: res => {
        this.setData({
          mineRice: res.data.data.integral,
          mineShow: res.data.data.ranking,
          mineActive: res.data.data.winRank
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.checkRice()

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getActivities();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/discover/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  },

  checkDate: function(endTime) {
    //日期格式化
    var start_date = new Date();
    var end_date = new Date(endTime.replace(/-/g, "/"));
    //转成毫秒数，两个日期相减
    var days = end_date.getTime() - start_date.getTime();
    //转换成小时数 天数
    var sday = Math.floor(days / (60 * 60 * 1000 * 24)),
      shour = Math.floor(days % (60 * 60 * 1000 * 24) / (60 * 60 * 1000)),
      smin = Math.floor(days % (60 * 60 * 1000) / (60 * 1000));
    var tstr = ''
    if (sday) {
      tstr += sday + "天"
    }
    if (shour || sday == 0) {
      tstr += shour + "小时"
    }
    tstr += smin + "分"
    // var day = parseInt(days / (1000 * 60 * 60));
    return tstr;
  },
  getActivities: function() {
    var _this = this
    wx.showLoading({
      title: "加载中"
    });
    app.apiRequest({
      url: '/ranking/phone/queryAllByPhone',
      data: {
        pageSize: 10,
        pageNo: this.data.nowPage
      },
      success: res => {
        console.log(res)
        console.log("活动列表：", res);
        if (res.data.code == 0) {
          var tres = res.data.data.lists
          if (tres.length > 0) {
            this.data.nowPage = this.data.nowPage + 1;
            console.log(this.data.nowPage)
            for (var i = 0; i < tres.length; i++) {
              var ts = _this.checkDate(tres[i].endTime)
              tres[i].sday = ts
            }
            _this.setData({
              discoverList: this.data.discoverList.concat(tres)
            })
          }
        }
        wx.hideLoading();
      }
    })
  },
  showPaih: function(e) { //进入活动函数
    console.log(e);
    var tid = e.target.dataset.id
    wx.navigateTo({
      url: "performance/detail?id=" + tid
    })
  },
  updatePos: function(ob) { //更新位置信息
    //新增获取rule图标位置    
    let tmpPos = wx.getStorageSync("rulePos") || '';
    if (ob) { //最优先，拖动时，频繁更新，
      this.setData({
        icon: ob
      })
    } else if (tmpPos != '') { //将已缓存的数据设置显示
      let nowp = JSON.parse(tmpPos);
      this.setData({
        icon: nowp
      })
    } else { //第一次进，使用默认数据初始化缓存
      let tinitPos = this.data.icon;
      wx.setStorageSync("rulePos", JSON.stringify(tinitPos));
    }
    // console.log(this.data.icon)
  },
  showTheRule: function() { //按完
    let ntime = new Date().getTime();
    if (ntime - this.data.icoTime < 100) {
      wx.navigateTo({
        url: "/pages/index/rule/rule"
      });
    } else {
      //还要计算贴近哪个框，就靠哪个框，另一个象限的值不变
      let tpos = this.data.icon,
        twpos = this.data.sys,
        truew = this.data.ruleTrueWidth,
        trueT = this.data.ruleTrueHeight,
        trueB = this.data.ruleTrueBottom;
      if (parseInt(tpos.icoPosX) < 0) {
        tpos.icoPosX = Math.abs(parseInt(tpos.icoPosX));
      }
      if (parseInt(tpos.icoPosY) < 0) {
        tpos.icoPosY = Math.abs(parseInt(tpos.icoPosY));
      }
      if (parseInt(tpos.icoPosX) > (twpos.windowWidth - truew)) {
        tpos.icoPosX = twpos.windowWidth - truew;
      }
      if (parseInt(tpos.icoPosY) > (twpos.windowHeight - truew)) {
        tpos.icoPosY = twpos.windowHeight - truew;
      }

      if (parseInt(tpos.icoPosX) < twpos.windowWidth / 2) {
        if (parseInt(tpos.icoPosY) < twpos.windowHeight / 2) {
          /*第一象限*/
          if (parseInt(tpos.icoPosX) < parseInt(tpos.icoPosY)) { //靠近x
            tpos.icoPosX = 0;
          } else {
            tpos.icoPosY = this.data.ruleTrueHeight + "px";
          }
        } else {
          //第四象限
          if (parseInt(tpos.icoPosX) < (twpos.windowHeight - parseInt(tpos.icoPosY))) { //靠近x
            tpos.icoPosX = 0;
          } else {
            tpos.icoPosY = twpos.windowHeight - truew * 0.7 + "px";
          }
        }
      } else {
        if (parseInt(tpos.icoPosY) < twpos.windowHeight / 2) {
          /*第二象限*/
          if ((twpos.windowWidth - parseInt(tpos.icoPosX)) < parseInt(tpos.icoPosY)) { //靠近x
            tpos.icoPosX = twpos.windowWidth - truew + "px";
          } else {
            tpos.icoPosY = trueT + "px";
          }
        } else {
          //第三象限
          if ((twpos.windowWidth - parseInt(tpos.icoPosX)) < (twpos.windowHeight - parseInt(tpos.icoPosY))) { //靠近x
            tpos.icoPosX = twpos.windowWidth - truew + "px";
          } else {
            tpos.icoPosY = twpos.windowHeight - truew * 0.7 + "px";
          }
        }
      }
      this.setData({
        icon: tpos
      })
      wx.setStorageSync("rulePos", JSON.stringify(tpos));
    }
    this.data.icoTime = 0;
    this.data.icoMoving = false;
  },
  icoTouchStart: function(e) {
    this.data.icoMoving = true;
    let ntime = new Date().getTime();
    this.setData({
      icoTime: ntime
    });
    // console.log(e)
    let tpos = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    };
    this.setData({
      tmpPos: tpos
    });
  },
  icoTouchMove: function(e) {
    // if (this.data.icoMoving){      
    let pos = e.changedTouches[0];
    let tpos = this.data.tmpPos;
    let tob = this.data.icon
    // console.log(pos,tpos,tob);return;
    //计算位置
    tob.icoPosX = parseInt(tob.icoPosX) - (pos.pageX - tpos.x) + "px";
    tob.icoPosY = parseInt(tob.icoPosY) + (pos.pageY - tpos.y) + "px";
    // console.log(tob)
    tpos.x = pos.pageX;
    tpos.y = pos.pageY;
    this.updatePos(tob)
    // }else{
    //   let ntime = new Date().getTime();
    //   if (ntime - this.data.icoTime >= 300) {
    //     this.data.icoMoving=true;//可以开始移动了
    //   }
    // }
  }
})