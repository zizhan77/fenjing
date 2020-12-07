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
    isHelped: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    // option.u = 4981;
    this.setData({
      tid: option.u
    })
    if (wx.getStorageSync("newPeople") == "yes" || !wx.getStorageSync("userLogin")) {
      this.setData({
        isuserLogin: true
      })
    }

    // 获取token和是否为新用户
    wx.login({
      success: res => {
        this.code = res.code;
        app.apiRequest({
          url: '/login/minoPro/getUser',
          data: {
            'jscode': res.code
          },
          success: res => {
            console.log(res)
            // 两个参数是老用户 否则一个用户 
            if (res.data.data.length == 2) {
              wx.setStorageSync("newPeople", "no");
              app.globalData.apiToken = res.data.data[1];
              app.globalData.isNew = 0;
              wx.setStorageSync("tokenZt", res.data.data[1]);
              app.globalData.shareFrom = 0
            } else {
              // 新人1
              wx.setStorageSync("newPeople", "yes");
              app.globalData.isNew = 1;
              app.globalData.shareFrom = 1
            }
          }
        })
      }
    })


    // this.data.tid=4949;
    this.getPerformance();
    // if (option.u) {
    this.getUserMess();
    // }

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
  },

  // zt授权
  haveGetUser: function(e) {
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
          // console.log(res)
          // app.globalData.jsCode = res.code;
          // app.globalData.checkLogin = true;
          console.log(this.code)
          app.apiRequest({
            url: '/login/minoPro/getToken',
            data: {
              'jscode': res.code
            },
            success: res => {
              console.log(res.data);
              console.log(this.data.tid)
              if (res.data.code === 0) {
                app.globalData.isgetToken = true;
                app.globalData.apiToken = res.data.data[0];
                wx.setStorageSync("token", res.data.data[0]);
                app.globalData.userId = res.data.data[1]
                app.globalData.isNew = 0;
                console.log(app.globalData.apiDomain)
                console.log(app.globalData.apiToken)
                this.setData({
                  isuserLogin: false,
                  isHelped: true
                })
                // 更新微信名称
                // app.apiRequest({
                //   url: '/user/updateUserName',
                //   data,
                //   success: (res) => {
                //     console.log(app.globalData.apiToken)
                //     console.log(res)
                //     if (res.data.code == 0) {

                //     }
                //   },
                //   code5: 1
                // })
                if(wx.getStorageSync("newPeople")=="yes"){
                  app.apiRequest({
                    url: "/activityShare/shareForUserAndSign",
                    data: {
                      userId: this.data.tid,
                      type: 0,
                      shareFrom: 1,
                      isNew: 1
                    },
                    success: res => {
                      console.log(res)
                      if (res.data.code == 0) {
                        wx.showToast({
                          title: "成功~"
                        })
                      } else if (res.data.code == 8) {
                        wx.showToast({
                          title: res.data.message,
                          icon: "none"
                        })
                      }
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
      // } else {
      //   wx.showToast({
      //     title: "请您先登录",
      //     icon: 'none'
      //   });
    }
  },


  // end
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
          });
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
  getUserMess() {
    var tid = this.data.tid;
    console.log(tid)
    app.apiRequest({
      url: "/activityShare/phone/getSharetimeForUser",
      data: {
        userId: this.data.tid
      },
      success: res => {
        console.log(res)
        this.setData({
          mess: res.data.data,
          time: res.data.data.time
        });
        this.makeTime()
      }
    })
  },
  showActive: function(e) {
    let tid = e.target.dataset.id;
    console.log(tid);
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
        let sec = "",
          min = "";
        let hour = Math.floor(delta / (60 * 60 * 1000)),
          min1 = Math.floor(delta % (60 * 60 * 1000) / (60 * 1000)),
          sec1 = Math.floor(delta % (60 * 1000) / 1000)

        if (sec1 < 10) {
          sec = "0" + sec1
        } else {
          sec = sec1
        }
        if (min1 < 10) {
          min = "0" + min1
        } else {
          min = min1
        }

        this.setData({
          lastTime: "距结束：" + hour + ":" + min + ":" + sec
        });
        let timer = setTimeout(() => {
          this.makeTime()
          timer = null;
        }, 1000);
      }
    } else {
      this.setData({
        lastTime: "已结束",
        isOver: true
      })
    }
  },
  compoentMakeShit() {
    let tid = this.data.tid
    app.apiRequest({
      url: "/activityShare/shareForUserAndSign",
      data: {
        userId: tid,
        type: 0,
        shareFrom: 0,
        isNew: 0
      },
      success: res => {
        console.log(res)
        if (res.data.code == 0) {
          wx.showToast({
            title: "成功~"
          })

        } else if (res.data.code == 8) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
        this.setData({
          isHelped: false
        })
      }
    })
  },
  makeShit() {
    this.compoentMakeShit();
    this.setData({
      makeShit: false
    })
  },
  makeShit1() {
    this.compoentMakeShit();
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
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  }
})