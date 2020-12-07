// pages/index/help/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultimg: 'http://resource.jiyilive.com/img2/index/newlogo.png',
    mess: {
      avatarurl: '',
      name: "粉鲸小团子123"
    },
    lastTime: '距结束：00:00:00',
    paihang: [], //排行榜的列表
    noMore: false,
    request: false,
    page: 1,
    time: null,
    isOver: false,
    isHelped: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    console.log(option)    
    this.id = option.id;
    this.setData({
      id:option.id
    })    
    if (option.cu) {
      this.opt = option
    }
    if (wx.getStorageSync("newPeople") == "no") {
      this.setData({
        isNotShare: false
      });
      this.makeChoujAdd(option);
    }
    console.log(wx.getStorageSync("newPeople"));
    // if (option.cu) { this.makeChoujAdd(option) }
    // if (option.u) { app.makeHelp(option.u); }
    // if (app.globalData.isNew) {//新用户奖励饭团
    //   this.setData({
    //     isRegister: true
    //   })
    // }
    // zt
    // if (option.cu) { 
    //   this.setData({ isNotShare: false }); this.makeChoujAdd(option); 
    //   console.log(55555);
    // }
    // if (option.u) { app.makeHelp(option.u); this.setData({ isNotShare: false }); }
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
    // end
    if (!app.globalData.currentPage || app.globalData.currentPage == '') {
      this.data.isNotShare = false;
      this.setData({
        isNotShare: true
      });
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
    // })

    this.data.tid = option.u;
    this.getPerformance();

  },
  // 未开启项目的跳转
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
  makeChoujAdd: function(opt) { //点击被分享的小程序并注册完成了    
    if (wx.getStorageSync("newPeople") == "no") {
      return;
    }
    console.log(opt)
    app.apiRequest({
      data: {
        userId: opt.cu,
        type: 1,
        activityId: opt.id
      },
      url: "/activityShare/updateShareQty",
      success: res => {
        console.log("抽奖接口。增加抽奖次数结束：", res)
        //临时显示下返回信息
        // wx.showToast({ "text": JSON.stringify(res.data) })
      }
    })
  },

  // 授权
  haveGetUser(e) {
    wx.showLoading({
      title: '加载中',
    })
    if (e.detail.userInfo) {
      wx.hideLoading()
      wx.setStorageSync("userLogin", e.detail.userInfo);
      let data = {},
        obj = e.detail.userInfo;
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
            success: res => {
              console.log(res.data);
              if (res.data.code === 0) {
                wx.navigateTo({
                  url: '../activity/performance/detail?id=' + this.id,
                })
                console.log(res.data.data.length)
                app.globalData.isgetToken = true;
                app.globalData.apiToken = res.data.data[0];
                wx.setStorageSync("token", res.data.data[0]);
                app.globalData.userId = res.data.data[1]
                app.globalData.isNew = 0;
                console.log(app.globalData.apiDomain)
                console.log(app.globalData.apiToken)


                if (wx.getStorageSync("newPeople") == "yes") {
                  this.setData({
                    isNotShare: false
                  });
                  this.makeChoujAdd(this.opt);
                }

                // 获取是否有电话号
                app.apiRequest({
                  url: '/user/phone/queryUserIdAndActvitity',
                  success: res => {
                    console.log("获取饭团数：", res.data.data.phoneNumber)
                    if (!res.data.data.phoneNumber) {
                      wx.setStorageSync("phoneNum", false);
                    } else {
                      wx.setStorageSync("phoneNum", true);
                      this.setData({
                        phoneNum: true,
                      })
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
  // 手机号
  onGetPhoneNumber(e) {
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
            wx.navigateTo({
              url: '../activity/performance/detail?id=' + this.id,
            })
            console.log(res)
            wx.setStorageSync("phoneNum", true);
            app.globalData.hasUserPhone = true;
            app.globalData.isLoged = true;

          }
        }
      })
    } else { //拒绝授权手机号
      wx.showToast({
        title: "请您先授权手机号",
        icon: 'none'
      });
    }
  },
  // end
  // 增加抽奖次数方法
  makeShit() {
    console.log(app.globalData.userNumId)
    console.log(app.globalData.selfActiveId)
    app.apiRequest({
      data: {
        // userId: opt.cu,
        // type: 1,
        // activityId: opt.id,
        userId: app.globalData.userNumId,
        type: 1,
        activityId: app.globalData.selfActiveId
      },
      url: "/activityShare/updateShareQty",
      success: res => {
        console.log("增加抽奖次数结束：", res)
        // wx.navigateTo({
        //   url: "/pages/activity/performance/detail?id=" + app.globalData.selfActiveId
        // })
        wx.navigateTo({
          url: '../activity/performance/detail?id=' + this.id,
        })
        //临时显示下返回信息
        // wx.showToast({ "text": JSON.stringify(res.data) })
      }
    })
  },
  getPerformance: function(e) { //获取排行列表   
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 防止多次请求
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
        wx.hideLoading();
        this.setData({
          request: false
        })
        if (e.data.data.lists.length == 0) {
          setTimeout(() => {
            this.setData({
              noMore: true
            })
          }, 1000);
          return false;
        }
        var tar = e.data.data.lists //获取嵌套的数组
        if (tar.length) {
          var cardList = this.data.paihang.concat(this.filterArray(tar))
          this.setData({
            page: this.data.page + 1,
            paihang: cardList
          })
        }
      }
    })
  },
  checkDate: function(endTime) {
    //日期格式化
    var start_date = new Date();
    var end_date = new Date(endTime.replace(/-/g, "/"));
    //转成毫秒数，两个日期相减
    var days = end_date.getTime() - start_date.getTime();
    //转换成小时数 天数
    var day = parseInt(days / (1000 * 60 * 60));
    return day;
  },
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

  showActive: function(e) {
    let tid = e.target.dataset.id;
    console.log(tid);
    // return;
    wx.navigateTo({
      url: "/pages/activity/performance/detail?id=" + tid
    })
  },
  makeTime() {
    // console.log(this.data.time,this.data.time != null)
    if (this.data.time != null) {
      let ttime = this.data.time.replace(/-/g, '/')
      let nowt = new Date().getTime(),
        oldt = new Date(ttime).getTime();
      nowt = parseInt(nowt)
      oldt = parseInt(oldt) + (60 * 60 * 1000 * 24)
      let delta = oldt - nowt;
      if (delta >= (60 * 60 * 1000 * 24)) {
        this.setData({
          lastTime: "已结束",
          isOver: true
        })
      } else {
        let hour = Math.floor(delta / (60 * 60 * 1000)),
          min = Math.floor(delta % (60 * 60 * 1000) / (60 * 1000)),
          sec = Math.floor(delta % (60 * 1000) / 1000)

        this.setData({
          lastTime: "距结束：" + hour + ":" + min + ":" + sec
        });
        setTimeout(() => {
          this.makeTime()
        }, 1000);
      }
    } else {
      this.setData({
        lastTime: "已结束",
        isOver: true
      })
    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let tit = '一起来拿演唱会门票吧！';
    let turl = "http://resource.jiyilive.com/img2/share/2.jpg"
    if (this.id == '162'){      
      tit ='共抗病毒限时领N95口罩'
      turl = "http://resource.jiyilive.com/img2%2Fshare%2F123456.jpg"
    }
    return {
      title: tit,
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: turl
    }
  }
})