var app = getApp();
app.selfidxz = 0;
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    flag: false,
    list: [{
      url: "../../images/tabbar/performance.png",
      selurl: "../../images/tabbar/performance_cur.png",
      text: "首页",
      },
      {
        selurl: "../../images/tabbar/activity_cur.png",
        url: "../../images/tabbar/activity.png",
        text: "排行榜",
      },
      {
        selurl: "../../images/tabbar/me_cur.png",
        url: "../../images/tabbar/me.png",
        text: "我的",
      },
    ]
  },
  properties: {

  },
  attached() {},
  pageLifetimes: {
    show() {
      this.setData({
        isIpx: app.globalData.isIpx
      })
      if (this.data.flag == true) {
        let animationData = wx.createAnimation({
          duration: 200,
        })
        let animationMonth = wx.createAnimation({
          duration: 200,
        })
        animationMonth.translate(-10).step();
        animationData.rotate(0).step();
        this.data.list[2].moves = animationData.export();
        this.setData({
          flag: false,
          list: this.data.list,
          animationMonth: animationMonth
        })
      }
      var obj = {}
      for (let i = 0; i < this.data.list.length; i++) {
        let key = this.data.list[i].text;
        if (i == app.selfidxz) {
          obj[key] = true
        } else {
          obj[key] = false
        }
      }
      this.setData({
        obj: obj,
      })
    }
  },
  methods: {
    tohome(e) {
      console.log(e.currentTarget.dataset.index);
      app.selfidxz = e.currentTarget.dataset.idx;
      switch (e.currentTarget.dataset.index) {
        case 0:
          wx.redirectTo({
            url: '../index/index',
          })
          break;
        case 1:
          wx.redirectTo({
            url: '../discover/index',
          })
          break;
        case 2:
          wx.redirectTo({
            url: "../mine/index",
          })
          break;
      }
    },
    // 点击中间发布按钮
    release() {
      this.setData({
        flag: !this.data.flag
      })
      var animationData = wx.createAnimation({
        duration: 200,
      })
      var animationMonth = wx.createAnimation({
        duration: 200,
      })
      if (this.data.flag == true) {
        animationMonth.opacity(0.8).translate(10).step();
        animationMonth.opacity(1).step();
        animationData.rotate(45).step();
      } else {
        animationMonth.translate(-10).step();
        animationData.rotate(0).step();
      }
      this.data.list[2].moves = animationData.export();
      this.setData({
        list: this.data.list,
        animationMonth: animationMonth
      })
    },
    tolick() {
      wx.navigateTo({
        url: '../release/release'
      })
    },
    tobar() {
      wx.navigateTo({
        url: '../barRelease/barRelease',
      })
    },
    // 获取formId
    formhuoqu(e) {
      app.selfidxz = 0;
      let time = new Date().getTime();
      try {
        wx.request({
          url: app.globalData.urlhu + '/toolsShow/addFormId',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            openId: wx.getStorageSync("openid"),
            formId: e.detail.formId,
            time: time
          },
          success: res => {
            console.log(res)
          }
        })
      } catch (err) {

      }

    },
  }
})