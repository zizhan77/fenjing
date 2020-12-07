// pages/discover/star/detail.js
const wxParse = require('../../../wxParse/wxParse.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    star: {},
    tdate: [ //缓存当前日期和月份
    ],
    tripact: [], ///激活月份控制
    leftPos: 0,
    tripShowList: [
      //正在展示的行程列表
    ],
    tripLists: [],
    isShowStarDet: false,
    nowTrip: {},
    clicktitle: '',
    clickid: 0,
    mineDetal:{},
    noMore:false,//投饭团弹窗
    haveAdded:'',//已输入的的饭团数0
    inputBottom:0,//输入框位置
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tid: options.id
    });
    // console.log(tid,options)    
    this.getMineDetal(options.id); 

    this.getActor();
  },
  getActor() {
    app.apiRequest({
      url: '/actor/phone/getActorList',
      data: {
        page: 1,
        pageSize: 9999
      },
      success: res => {
        let tid = this.data.tid
        console.log("明星数据：", res)
        const tdata = res.data.data.lists.filter(item => item.id == tid)
        this.setData({
          star: tdata[0]
        })
        console.log(this.data.star)
        //设置好月份
        this.setData({
          tdate: this.getEveryMon()
        })
        this.getTrips(this.data.tdate)
      }
    })
  },
  getTrips(m) {
    let tar = []
    let ti = 0
    for (let i = 0; i < m.length; i++) {
      app.apiRequest({
        url: '/actor/phone/getActorTripList',
        data: {
          actorid: this.data.star.id,
          page: 1,
          pageSize: 9999,
          time: makeTime(m[i])
        },
        success: res => {
          ti++
          tar[i] = res.data.data || {}
          // console.log('行程信息：',res);return;          
          if (ti == m.length) {
            console.log('行程列表：', tar)
            let tsrt = tar[0].name || ''
            tsrt = tsrt.substr(13)
            // console.log('123',tsrt)

            this.setData({
              tripLists: tar,
              tripShowList: tar[0].lists,
              clicktitle: tsrt,
              clickid: tar[0].wincount
            })
          }
        }
      })
    }

    function makeTime(o) {
      let ty = o.y,
        tm = o.m
      if (tm < 10) {
        return ty + '0' + tm
      } else {
        return '' + ty + tm
      }
    }
  },
  getEveryMon(n = 8) {
    //n不能大于24
    let tripact = []
    let allMonth = []
    let nowd = new Date()
    let year = nowd.getFullYear(),
      month = nowd.getMonth() + 1;
   
    //计算要获取的月份列表 
    for (let i = 1; i <= n; i++) {
      tripact.push('')
      if (i < n / 2) {
        // let tpre = getpre(year, month, i)
        // allMonth.unshift(tpre)
      } else if (i == n / 2 || i == (n / 2 + 0.5)) {
        allMonth.push({
          y: year,
          m: month
        })
      } else {
        let tnext = getnext(year, month, i - Math.ceil(n/2))
        allMonth.push(tnext)
      }
    }
    allMonth.push()
    console.log('获取的月份4444：', allMonth)

    function getpre(m, n, i) {
      if (n - i < 1) {
        return {
          y: m - 1,
          m: n - i + 12
        }
      } else {
        return {
          y: m,
          m: n - i
        }
      }
    }

    function getnext(m, n, i) {
      if (n + i > 12) {
        return {
          y: m + 1,
          m: n + i - 12
        }
      } else {
        return {
          y: m,
          m: n + i
        }
      }
    }
    tripact[0] = 'star_mac'
    this.setData({
      tripact: tripact,
      // leftPos: 500
    })
    return allMonth
  },
  showMonth(e) {
    let tar = this.data.tripact,
      tdatas = this.data.tripLists;
    let tin = e.target.dataset.ind
    if (tar[tin]) {
      return;
    }
    for (let i in tar) {
      tar[i] = ''
    }
    tar[tin] = 'star_mac'
    console.log('当月行程', tdatas[tin].lists)
    let tstr = tdatas[tin].name || ''
    tstr = tstr.substr(0, 15)
    console.log('1356', tstr)
    this.setData({
      tripact: tar,
      tripShowList: tdatas[tin].lists,
      clicktitle: tstr,
      clickid: tdatas[tin].wincount
      // leftPos:tin * 90
    })
  },
  showTripDetail(e) {
    let tind = e.target.dataset.tind,
      tid = e.target.dataset.tid,
      tflag = e.target.dataset.act
    if (tflag == 'null' || tflag == 0) {
      this.setData({
        nowTrip: this.data.tripShowList[tind],
        isShowStarDet: true
      })
      wxParse.wxParse('content', 'html', this.data.tripShowList[tind].intro, this, 5);
    } else {
      wx.navigateTo({
        url: '/pages/activity/index/index?id=' + tid,
      })
    }

  },
  closeStarDetail() {
    this.setData({
      isShowStarDet: false,
      nowTrip: {}
    })
  },
  showActived() {
    wx.navigateTo({
      url: '/pages/activity/index/index?id=' + this.data.clickid
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
  sendRiceAdd() {//发送投饭团数据
    var tid = this.data.tid;
    var coun = this.data.haveAdded;

    console.log(this.data)
    console.log(coun)

    var _this = this;
    if (coun == 0 || coun == "") {
      wx.showToast({
        title: "不能投0个哦~",
        icon: "none"
      });
      return false;
    }
    console.log(tid,coun)
    app.apiRequest({
      url: '/ranking/add',
      data: {
        id: tid,
        count: coun
      },
      success: res => {    
        console.log(res)    
        if (res.data.code == 0) {
          wx.showToast({
            title: "投递成功~"
          })
          _this.getMineDetal(_this.data.activityId);
          // _this.getPerformanceDetail(_this.data.activityId)
          // _this.data.pageInit.number=1
          // _this.data.rankList=[];
          // _this.data.rankListt= [];
          // _this.getRankingList(_this.data.activityId)
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

  }
})