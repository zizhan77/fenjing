//index.js
//获取应用实例
const app = getApp()
const anim = wx.createAnimation({
  duration: 300,
  timingFunction: "linear"
})
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showStartModal: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperList: [],
    cardList: [],
    page: 1,
    noMore: false,
    request: false,
    keywordsColor: ['blue', 'purple', 'yellow', 'red'],
    direction: null,
    openBannerInfo: {},
    isOpen: 0,
    jingcaituijian: '',
    jingcaituijianId: 0,
    jingcaituijtype: "",
    paihang: [], //排行榜的列表
    keyword: '', //搜索的关键字
    isShowAdd: false, //显示投饭团框
    isShowRule: false, //显示活动规则
    nowTitle: "·", //当前被投的活动名称
    nowId: 0, //当前被投递的活动id
    haveAdded: "", //当前已经投递的饭团数
    minecount: "", //当前一共的饭团数
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
    paddingBot: 0, //显示底部规则的距离
    paddingTop: 0, //显示刷新的距离
    coninit: [], //缓存活动列表的数组
    isRegister: false,
    openTime: 5,
  },
  onLoad: function(option) {
    // zt
    //获取轮播图列表
    app.employIdCallback = employId => {
      if (employId !== "") {
        if (option.u && employId === 1) {
          app.globalData.share = "yes";
          app.globalData.tid = option.u;
        }
        if (employId === 1) { //新用户奖励饭团
          app.globalData.isNew = 1;
        }
        let t = 5;
        let timer = setInterval(() => {
          t--;
          this.setData({
            openTime: t
          })
          if (t == 0) {
            clearInterval(timer);
            this.hideModal();
          }
        }, 1000)
        if (wx.getStorageSync("userLogin")) {
          app.globalData.userLoginZ = true;
          this.getInfo()
        }
      }
    }

    this.getBannerList();
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
        tmpc += to + "=" + option[to];
      }
      if (can) {
        tmpurl = url + "?" + tmpc;
      } else {
        tmpurl = url;
      }
      app.globalData.currentOption = JSON.stringify(option);
      app.globalData.currentPage = '/' + tmpurl;
    }
    //获取演出列表
    this.getPerformance();
    app.apiRequest({
      url: '/user/queryUserId',
      success: function(res) {
        console.log(res)
        app.globalData.userNumId = res.data.data;
      },
      fail: function(res) {
        console.log("失败了：", res)
      }
    })
    // end
    // app.checkOver(option, (option) => {
    if (JSON.stringify(option) == "{}") {
      if (app.globalData.currentOption != '') {
        if (app.globalData.currentOption) {
          option = JSON.parse(app.globalData.currentOption);
          app.globalData.currentOption = ''
        }
      }
    }
    if (option.cu) {
      this.makeChoujAdd(option);
      app.globalData.isNew = 0;
    }
    console.log(app.globalData.isNew)
    if (option.u) {
      app.makeHelp(option.u);
    }

    var pmess = wx.getSystemInfoSync();
    if (app.globalData.userInfo) {
      this.getAllRice(); //已经登录则获取用户饭团数；
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      //获取开屏页
      this.getOpenBanner();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        //获取开屏页
        this.getOpenBanner();
      }
      this.getOpenBanner();
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.getOpenBanner();
        }
      })
    }
    //【【添加保存分享逻辑】】
    //检测是否带参数，判断是否点开别人分享得小程序
    app.globalData.selfActiveId = option.shareId;
    app.globalData.shareUserId = option.userId;

    //新增获取已有位置
    this.updatePos()
    this.data.sys = wx.getSystemInfoSync()
    //获取规则框真是宽度
    this.data.ruleTrueWidth = 120 / 750 * this.data.sys.windowWidth;
    this.data.ruleTrueHeight = 128 / 750 * this.data.sys.windowWidth;
    this.data.ruleTrueBottom = 140 / 750 * this.data.sys.windowWidth;
    // app.apiRequest({
    //   url: '/user/queryUserId',
    //   success: function (res) {

    //     console.log(res.data.data)

    //     app.globalData.userNumId = res.data.data
    //   },
    //   fail: function (res) {
    //     console.log("失败了：", res)
    //   }
    // });
    // //获取轮播图列表
    // this.getBannerList();
    // //获取演出列表
    // this.getPerformance();
    // });
  },
  // 开屏页跳转
  tojumpZ() {
    this.hideModal();
  },
  testFunc() {
    console.log("testping456")
    //我了个曹操的
  },
  // 点击跳转赞助商详情
  tosponsor(e) {
    let spid = e.target.dataset.spid;
    wx.navigateTo({
      url: '../activity/performance/sponsor?id=' + spid,
    })
    app.apiRequest({
      url: "/click/phone/clickSponsor",
      data: {
        id: spid,
        tokenId: app.globalData.apiToken
      },
      success: res => {
        console.log(res)
      }
    })
  },
  // 跳转详情
  showActive: function(e) {
    // wx.navigateTo({
    //   url: "/pages/index/help/index?u=977"
    // }); return;
    let tid = e.target.dataset.id;
    wx.navigateTo({
      url: "../activity/performance/detail?id=" + tid
    })
  },
  // 获取是否领取过新人饭团
  getInfo: function(e) {
    app.apiRequest({
      url: '/my/findUserByToken',
      success: res => {
        console.log("所有用户信息：", res)
        if (res.data.code == 0) {
          if (res.data.data.integralflag === 0) {
            this.setData({
              istruezt: true
            })
          } else {
            this.setData({
              istruezt: false
            })
          }
        }
      }
    })
  },
  // zt授权登录
  // haveGetUser(e) {
  //   if (e.detail.userInfo) {
  //     wx.showLoading({
  //       title: '加载中',
  //     })
  //     wx.setStorageSync("userLogin", e.detail.userInfo);
  //     let data = {},
  //       obj = e.detail.userInfo;
  //     data.name = obj.nickName;
  //     data.gender = obj.gender;
  //     data.avatarurl = obj.avatarUrl
  //     // 获取token
  //     wx.login({
  //       success: res => {
  //         console.log(res.code)
  //         app.globalData.jsCode = res.code;
  //         app.globalData.checkLogin = true;
  //         app.apiRequest({
  //           url: '/login/minoPro/getToken',
  //           data: {
  //             'jscode': app.globalData.jsCode
  //           },
  //           success: (res) => {
  //             wx.hideLoading();
  //             console.log(res.data);
  //             if (res.data.code === 0) {
  //               this.setData({
  //                 userLogin: false
  //               })
  //               console.log(res.data.data.length)
  //               app.globalData.isgetToken = true;
  //               app.globalData.apiToken = res.data.data[0];
  //               wx.setStorageSync("token", res.data.data[0]);
  //               app.globalData.userId = res.data.data[1]

  //               console.log(app.globalData.apiDomain)
  //               console.log(app.globalData.apiToken)
  //               // 获取是否有电话号
  //               // app.apiRequest({
  //               //   url: '/user/phone/queryUserIdAndActvitity',
  //               //   success: res => {
  //               //     console.log("获取饭团数：", res.data.data.phoneNumber)
  //               //     if (!res.data.data.phoneNumber) {
  //               //       wx.setStorageSync("phoneNum", false);
  //               //     } else {
  //               //       wx.setStorageSync("phoneNum", true);
  //               //     }
  //               //     wx.hideLoading()
  //               //   }
  //               // })

  //               // 更新微信名称
  //               app.apiRequest({
  //                 url: '/user/updateUserName',
  //                 data,
  //                 success: (res) => {
  //                   console.log(app.globalData.apiToken)
  //                   console.log(res)
  //                   if (res.data.code == 0) {
  //                     this.setData({
  //                       userLogin: true,
  //                     })
  //                   }
  //                 },
  //                 code5: 1
  //               })
  //             }
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     wx.showToast({
  //       title: "请您先登录",
  //       icon: 'none'
  //     });
  //   }
  // },
  haveGetUser(e) {
    if (e.detail.userInfo) {
      // app.globalData.userInfo = e.detail.userInfo
      // app.globalData.isGoGetPhone = false;
      // app.globalData.hasUserInfo = true;
      //存储用户昵称头像等信息
      wx.setStorageSync("userLogin", e.detail.userInfo);
      let data = {},
        obj = e.detail.userInfo;
      data.name = obj.nickName;
      data.gender = obj.gender;
      data.avatarurl = obj.avatarUrl
      this.setData({
        userLogin: false
      })
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
  makeChoujAdd: function(opt) { //点击被分享的小程序并注册完成了    
    if (!app.globalData.isNew) {
      return;
    }
    app.apiRequest({
      data: {
        userId: opt.cu,
        type: 1,
        activityId: opt.id
      },
      url: "/activityShare/updateShareQty",
      success: res => {
        console.log("增加抽奖次数结束：", res)
        //临时显示下返回信息
        // wx.showToast({ "text": JSON.stringify(res.data) })
      }
    })
  },
  // makeChoujAdd:function(){//点击被分享的小程序并注册完成了
  //   if (app.globalData.selfActiveId &&  app.globalData.shareUserId){
  //     app.apiRequest({
  //       data: {
  //         userId: app.globalData.shareUserId,
  //         type: 1,
  //         activityId: app.globalData.selfActiveId
  //       },
  //       url: "/activityShare/updateShareQty",
  //       success: res => {
  //         // console.log("存储回来的信息：",res)
  //         //临时显示下返回信息
  //         wx.showToast({"text":JSON.stringify(res.data)})
  //       }
  //     })
  //   }
  // },  
  backIndex: function() {
    this.setData({
      isHavePhone: false
    });
    wx.showTabBar();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let ttime ='2019-8-5 12:18:35'
    // let date=new Date(ttime).getTime()
    // console.log(date)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

    if (this.data.icoMoving) {
      return false;
    }
    if (app.globalData.hasUserPhone) {
      this.getAllRice();
    }
    this.getBannerList();
    this.setData({
      cardList: [],
      keyword: '',
      page: 1,
      noMore: false
    })
    this.getPerformance();
    // wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.getPerformance();
  },

  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getBannerList: function(e) {
    app.apiRequest({
      url: '/banner/queryBanner',
      success: res => {
        console.log("轮播图：",res);
        let jingcaituijian = res.data.data[0].thumbUrl;
        let jingcaituijianId = res.data.data[0].url;
        let jingcaituijtype = res.data.data[0].thumbType;
        res.data.data.splice(0, 1);
        this.setData({
          swiperList: res.data.data,
          jingcaituijian: jingcaituijian,
          jingcaituijianId: jingcaituijianId,
          jingcaituijtype: jingcaituijtype
        })
        this.towerSwiper('swiperList');
      }
    })
  },
  getPerformance: function(e) { //获取排行列表   
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })
    // 防止多次请求
    wx.showLoading({
      title: '加载中...',
    })
    if (this.data.request) {
      return false;
    } else {
      this.setData({
        request: true
      })
    }
    app.apiRequest({
      url: '/activity/phone/queryAllByPhone',
      data: {
        pageNo: this.data.page,
        pageSize: 10,
      },
      success: (e) => {
        console.log(e)
        // 隐藏加载框
        // console.log("活动列表：",e)
        wx.hideLoading();
        // console.log("各种信息",e.data.data);
        this.setData({
          request: false
        })
        if (e.data.data.lists.length == 0) {
          setTimeout(() => {
            this.setData({
              noMore: true
            })
          }, 1000);
          // this.conTouchCtrl(this.data.sys.windowHeight - this.data.conHeight - this.data.ruleTrueBottom);
          return false;
        }
        var tar = e.data.data.lists //获取嵌套的数组
        //处理时间格式
        var cardList
        if (this.data.page == 1) {
          let tard = this.filterArray(tar)
          console.log(tard)
          // console.log(tard)
          cardList = [tard[0]]
          if (tard[1]) {
            cardList.push(tard[1])
          }
          if (tard[2]) {
            cardList.push(tard[2])
          }
          this.setData({
            coninit: tard
          });
        } else {
          cardList = this.data.paihang.concat(this.filterArray(tar))
        }
        this.setData({
          page: this.data.page + 1,
          paihang: cardList
        });

        //请求完信息再请求活动信息
        this.getActivities()
      }
    })
  },
  //演出详情
  showDetail(e) {
    console.log(e)
    // 记录跳转次数
    app.apiRequest({
      url: "/click/phone/clickBanner",
      data: {
        id: e.currentTarget.dataset.id,
        tokenId: app.globalData.apiToken
      },
      success: res => {
        console.log(res)
      }
    })
    //点击轮播图或者开屏页跳转的设置   0-不跳转  1-跳活动  2-跳演出 3-跳h5  4-跳小程序   5-跳公众号文章
    var tid = e.currentTarget.dataset.id,
      type = parseInt(e.currentTarget.dataset.type);
    // console.log(tid,type);
    console.log(type);
    switch (type) {
      case 0:
        {
          return;
        }
      case 1:
        {
          if (app.globalData.activityLists) {
            if (app.globalData.activityLists.length == 0) {
              return;
            }
            let tar = app.globalData.activityLists;
            let isid = false;
            for (let i in tar) {
              if (tar[i].id == tid) {
                isid = true;
                break;
              }
            }
            if (isid) {
              wx.navigateTo({
                url: "../activity/index/index?id=" + tid
              });
            }
          } else {
            this.getActivities(this.showRandomA)
          }
          break;
        }
      case 2:
        {
          // wx.navigateTo({url: 'performance/detail?id=' + tid});
          break;
        }
      case 3:
        { //h5          
          app.globalData.tmpAllUrl = tid;
          wx.navigateTo({
            url: "../webview/webview?url=" + tid
          });
          break;
        }
      case 4:
        { //小程序          
          wx.navigateToMiniProgram({
            appId: tid,
            // path:'',//跳转的页面
            extraData: {},
            success: function() {}
          })
          break;
        }
      case 5:
        { //公众号链接
          app.globalData.tmpAllUrl = tid;
          wx.navigateTo({
            url: "../webview/webview?url=" + tid
          });
          break;
        }
    }
  },

  hideModal: function() {
    this.setData({
      showStartModal: false
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
    //初始化完毕，开始轮播
    var _this = this;
    if (this.data.intval == undefined) {
      // this.data.intval = setInterval(function () { _this.lunbo("left"); }, 5000);
    }
  },
  onHide: function() {


  },

  onPageScroll: function(e) {
    // console.log(e)
    // 页面滚动时执行

  },
  // towerSwiper触摸开始
  towerStart(e) {
    clearInterval(this.data.intval);
    this.setData({
      towerStart: e.touches[0].pageX
    });
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    if (this.data.direction == null) {
      return false;
    }
    //滚动执行
    this.lunbo()

    this.setData({
      direction: null
    })
    var _this = this;
    this.data.intval = setInterval(function() {
      _this.lunbo("left");
    }, 5000);
  },
  lunbo: function(direct) {
    let direction = direct ? direct : this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  getOpenBanner: function(e) {
    app.apiRequest({
      url: '/banner/queryOpeningPage',
      data: {
        type: 2
      },
      success: res => {
        console.log(res)
        if (res.data.code == 0 && res.data.data.data.length != 0) {
          this.setData({
            openBannerInfo: res.data.data.data[0],
            isOpen: res.data.show ? res.data.show : 1
          })
        }
      }
    })
  },
  // 时间戳转化
  filterArray: function(ar) {

    var tar = []
    for (let i = 0; i < ar.length; i++) {
      ar[i].ranking = parseInt(ar[i].ranking);
      ar[i].sday = this.checkDate(ar[i].startDate) > 0;
      ar[i].startTime = ar[i].startDate.substr(0, 10);
      let thour = this.checkDate(ar[i].endDate);
      ar[i].endDate = thour < 24 ? (thour + "小时") : Math.floor(thour / 24) + "天" + thour % 24 + "小时";

      tar.push(ar[i]);
    }
    return tar;
  },

  checkDate: function(endTime) {
    console.log(endTime)
    //日期格式化
    var start_date = new Date();
    var end_date = new Date(endTime.replace(/-/g, "/"));
    //转成毫秒数，两个日期相减
    var days = end_date.getTime() - start_date.getTime();
    //转换成小时数 天数
    var day = parseInt(days / (1000 * 60 * 60));
    return day;
  },
  getSearchV: function(e) { //获取输入的关键字、
    // console.log(e);
    var nowv = e.detail.value;
    nowv = nowv.replace(/\s{2,}/, ' ');
    this.setData({
      keyword: nowv
    });
    if (this.data.keyword == '') {
      this.setData({
        page: 1
      })
      this.getPerformance();
    }
  },
  makeSearch: function() {
    // console.log("开始搜索")
    var _this = this;
    if (this.data.keyword == '') {
      wx.showToast({
        title: "请输入关键字~",
        icon: "none"
      });
    } else {
      var _this = this;
      app.apiRequest({
        url: "/ranking/queryByName",
        data: {
          "name": _this.data.keyword
        },
        success: function(res) {
          let cardList = _this.filterArray(res.data.data)
          // console.log("搜索结果：", cardList);
          _this.setData({
            paihang: cardList
          });
        }
      })
    }
  },
  getAllRice: function(call) { //获取饭团总数
    var _this = this;
    app.apiRequest({
      url: '/my/findUserByToken',
      success: res => {
        console.log(res)
        //  console.log("获取饭团数：", res.data.data.integral)
        _this.setData({
          minecount: res.data.data.integral
        });
        // if(call){call();}
      }
    });
  },
  makeRiceAdd: function(e) { //投饭团
    var tit = e.target.dataset.name,
      tid = e.target.dataset.id;

    function show() {
      wx.showToast({
        title: "您当前没有饭团",
        icon: "none"
      })
    }
    if (!app.globalData.hasUserInfo) {
      wx.showToast({
        title: "请您先登录",
        icon: "none"
      })
      setTimeout(function() {
        wx.switchTab({
          url: '../mine/index'
        })
      }, 1000);
      return;
    }
    if (this.data.minecount === "") {
      this.getAllRice(this.makeRiceAdd);
      return;
    }
    if (this.data.minecount === 0) {
      show();
      this.getAllRice();
      return;
    }
    wx.hideTabBar();
    this.setData({
      isShowAdd: true,
      nowTitle: tit,
      nowId: tid
    })
  },
  sendRiceAdd: function() { //发送投饭团数据
    var tid = this.data.nowId;
    var coun = this.data.haveAdded
    var _this = this;
    if (coun == 0 || coun == "") {
      wx.showToast({
        title: "不能投0个哦~",
        icon: "fail"
      });
      return false;
    }
    // console.log(tid,coun)
    app.apiRequest({
      url: '/ranking/add',
      data: {
        id: tid,
        count: coun
      },
      success: res => {
        // console.log("投递饭团", res.data)
        _this.closeTan();
        _this.getAllRice();
        if (res.data.code == 0) {
          wx.showToast({
            title: "投递成功~"
          })
          setTimeout(function() {
            _this.onPullDownRefresh();
          }, 1500);
        } else {
          wx.showToast({
            title: "投递失败，请稍后重试",
            icon: "none"
          })
        }
      }
    });

  },
  checkNum: function(e) {
    var v = e.detail.value;
    v = parseInt(v);
    if (isNaN(v)) {
      wx.showToast({
        title: "请您输入数字",
        icon: "none"
      })
      this.setData({
        haveAdded: ""
      });
      return;
    }
    if (v > this.data.minecount) {
      wx.showToast({
        title: "投递数量不能多于您的饭团总数",
        icon: "none"
      })
      this.setData({
        haveAdded: this.data.minecount
      });
      return;
    }
    this.setData({
      haveAdded: v
    })
  },
  closeTan: function() {
    this.setData({
      isShowAdd: false,
      isShowRule: false
    });
    wx.showTabBar();
  },
  showAcRule: function() { //显示活动规则
    wx.hideTabBar();
    this.setData({
      isShowRule: true
    })
  },
  showActiveList: function(e) { //新增精彩推荐跳转活动列表
    wx.switchTab({
      url: '../discover/index'
    });
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
  showTheTrueRule: function() {
    wx.navigateTo({
      url: "/pages/index/rule/rule"
    });
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
  },
  showRandomA: function() { //随机跳活动
    // console.log(app.globalData.activityLists)
    if (app.globalData.activityLists) {
      if (app.globalData.activityLists.length == 0) {
        return;
      }
      let tar = app.globalData.activityLists;
      let ti = Math.floor(Math.random() * tar.length)
      wx.navigateTo({
        url: "../activity/index/index?id=" + tar[ti].id
      })
    } else {
      this.getActivities(this.showRandomA)
    }
  },
  checkDate: function(endTime) {
    //日期格式化
    var start_date = new Date();
    var end_date = new Date(endTime.replace(/-/g, "/"));
    // console.log(endTime,'|',start_date)
    //转成毫秒数，两个日期相减
    var days = end_date.getTime() - start_date.getTime();
    //转换成小时数 天数
    var day = parseInt(days / (1000 * 60 * 60));
    //do something
    // console.log("day = ", day);
    return day;
  },
  getActivities: function(call) {
    var _this = this
    app.apiRequest({
      url: '/activity/queryAll',
      data: {
        "status": 0,
        "isDelete": 0
      },
      success: res => {
        // console.log("活动列表：", res);
        var arr = []
        if (res.data instanceof Array) {
          arr = res.data
        }
        if (res.data.data instanceof Array) {
          arr = res.data.data
        }
        if (res.data.data.data instanceof Array) {
          arr = res.data.data.data
        }

        var tres = arr //.reverse();
        if (res.data.code == 0) {
          for (var i = 0; i < tres.length; i++) {

            tres[i].day = _this.checkDate(tres[i].endDate)
            var ts = _this.checkDate(tres[i].startDate)
            if (ts <= 0) {
              ts = 0;
            }
            // ts=0
            tres[i].sday = ts
            // console.log(tres[i].startDate,tres[i].sday)
          }
          app.globalData.activityLists = tres.filter(({
            sday
          }) => sday <= 0);
          // console.log("可以随机跳的",app.globalData.activityLists)
          if (call) {
            call();
          }
        }
      }
    })
  },
  checkHowToApply: function() {
    if (this.data.coninit.length > 0) {
      this.setData({
        paihang: this.data.coninit
      });
      this.data.coninit = [];
      return false;
    } else {
      this.getPerformance()
    }
  },
  isReachBot: function(e) {
    // console.log("到底了", e)
    this.data.isReacheBot = true
    this.setData({
      paddingBot: 580
    })
  },
  // isReachTop: function (e) {
  //   console.log("到顶了", e)
  //   this.data.isReacheTop = true
  //   this.setData({
  //     paddingTop: 250
  //   })
  // },
  onShow: function() {
    console.log(wx.getStorageSync("userLogin"))
    console.log(app.globalData.isNew)
    console.log(app.globalData.userInfo)
    // zt
    // 判断是否有授权
    if (!wx.getStorageSync("userLogin")) {
      this.setData({
        userLogin: true
      })
    } else {
      this.setData({
        userLogin: false
      })
      this.getInfo()
    }
    // end
  },
  checkReachBot: function(e) {
    if (this.data.istruezt) {
      if (e.detail.scrollTop > 100) {
        this.setData({
          isRegister: true
        })
      }
    }
    if (this.data.isReachBot) {
      this.setData({
        paddingBot: Math.abs(e.detail.deltaY)
      })
    }
  },
  slideTouchEnd: function(e) {
    if (this.data.isReacheBot) {
      this.data.isReacheBot = false
      this.setData({
        paddingBot: 0
      })
      this.checkHowToApply();
    }
    // else if (this.data.isReacheTop){
    //   this.data.isReacheTop=false;
    //   this.setData({
    //     paddingTop: 0
    //   })
    //   this.onPullDownRefresh()
    // }
  },

  showPaih: function(e) {
    let tid = e.target.dataset.id;
    wx.navigateTo({
      url: "../activity/index/index?id=" + tid
    })
  },
  shareAddRice: function() { //分享赚饭团
    app.apiRequest({
      url: '',
      data: {},
      success: res => {

      }
    })
  },
  // zt
  // 为开始的活动跳转详情
  showNot(e) {
    console.log(e.currentTarget.dataset.ofranking)
    var time = e.target.dataset.ti;
    if (wx.getStorageSync("userLogin")) {
      wx.navigateTo({
        url: `../discover/performance/detail?id=${e.currentTarget.dataset.ofranking}`
      })
    } else {
      this.setData({
        userLogin: true
      })
    }
  },
  // end
  getCount: function() {
    app.apiRequest({ //存完手机号，说明是注册
      url: '/user/phone/addintegral',
      data: {},
      success: res => {
        this.setData({
          isRegister: false,
          isGetCount: true,
          istruezt: false
        })
      }
    })
  },
  giveUpCount: function() {
    this.setData({
      isRegister: false,
      isGetCount: false,
      istruezt: false
    })
    if (app.globalData.currentPage !== '') {
      if (app.globalData.currentPage.indexOf("/pages/index/index") > -1 ||
        app.globalData.currentPage.indexOf("/pages/mine/index") > -1 ||
        app.globalData.currentPage.indexOf("/pages/discover/index") > -1) {
        wx.switchTab({
          url: app.globalData.currentPage
        })
      } else {
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
  makeAiDou: function() { //跳排行榜
    this.setData({
      isRegister: false,
      isGetCount: false
    });
    wx.switchTab({
      url: "/pages/discover/index"
    })
  },
  onShareAppMessage: function() {

    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  },
})