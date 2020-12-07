// pages/mine/prizes/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    setWidthH: "",//初始化设置宽高
    isAddrShow: "none",//显示输入地址框
    isListShow: "block",//显示列表
    allres: [],
    jiangpId: "",
    named: '',
    phoned: "",
    prov: "",
    addr: "",
    insteadp: "",
    havenodata: false,
    showDetai: [],
    navdh: ['nav_dhdac', '', ''],//老虎机下方菜单选中控制
    navList: [],
    navReward: [],
    navFriend: [],
    pageInit: {
      1: { number: 1, size: 20 },
      2: { number: 1, size: 20 }      
    },
    cardcode: [],
    empty: [false, false]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRewardList(1);
    // this.makeDescTime("navList")
    // this.makeDescTime("navReward")
  },
  confirmReward(e) {//确认奖品
    let tid = e.target.dataset.id;
    wx.navigateTo({
      url: "address/list?id=" + tid
    });
  },
  // makeDescTime(ar) {
  //   let tar = this.data[ar]    
  //   for (let i in tar) {      
  //       tar[i].sday = makeTime(tar[i].endDate)      
  //   }
  //   this.setData({
  //     [ar]: tar
  //   })

  //   function makeTime(ti) {
  //     var delta = 60*60*12*1000,
  //       newt = ti.replace(/-/g, '/');
  //     var nowt = new Date();
  //     var nowti = nowt.getTime();
  //     var endt = new Date(newt);
  //     var endti = endt.getTime();
  //       endti=endti+delta
  //     var det=endti-nowti;

  //     var str = '', isday = true;
  //     var td = Math.floor(det/(60*60*1000*24)),
  //         th=Math.floor(det%(60*1000*60*24)/(60*60*1000)),
  //         tm=Math.floor(det%(60*60*1000)/(60*1000)),
  //         ts=Math.floor(det % (60 * 1000) / 1000)
     
  //     if (td>1){
  //         str=td+"天"+th+"小时"+tm+"分钟"        
  //       }else{
  //         str=th+"小时"+tm+"分钟"+ts+"秒"
  //       }        
  //     return str;
  //   }
  //   setTimeout(() => { this.makeDescTime(ar)},1000)
  // },
  copythis: function (e) {
    var str = e.target.dataset.ma;
    wx.setClipboardData({
      data: str,
      success: function (res) {
        wx.showToast({ title: "复制成功" });
      }
    });
  },
  showOrHide: function (e) {
    var vid = parseInt(e.target.dataset.ind),//第一个坐标
      hid = parseInt(e.target.dataset.ide);//第二个坐标    
    var tar = this.data.showDetai
    // console.log(vid, hid, tar[vid][hid])
    if (tar[vid][hid] == "") { tar[vid][hid] = "new_isShow"; }
    else { tar[vid][hid] = ""; }
    this.setData({
      showDetai: tar
    });
  },
  isJumpthis: function (e) {
    var str = e.target.dataset.ma;
    if (str.indexOf('.') > -1) {
      app.globalData.tmpAllUrl = str;
      wx.navigateTo({
        url: "../../webview/webview?url=" + str
      });
    } else {
      wx.navigateToMiniProgram({
        appId: str,
        // path:'',//跳转的页面
        extraData: {
          form: "粉鲸饭团"
        },
        success: function () { }
      })
    }
  },
  getRewardList(key) {//获取奖品列表        
    if (this.data.isLoadMore) { return; }
    let changeInd = [1, 2]
    this.data.isLoadMore = true;
    let keys = ['navList', 'navReward'];
    let tarr = this.data[keys[key - 1]]
    app.apiRequest({
      url: '/activity/phone/queryActivityByUser',
      data: {
        pageNo: this.data.pageInit[key].number,
        pageSize: this.data.pageInit[key].size,
        flag: key
      },
      success: res => {

        // zt
        let now=new Date();
        for (let i = 0; i < res.data.data.lists.length;i++){
          let sday = "";
          let end = new Date(res.data.data.lists[i].endDate);
          //距离下一个假期还有: ?天?小时?分?秒
          var s = parseInt((end - now) / 1000);
          if (s > 0) {
            var d = parseInt(s / 3600 / 24);
            if (d < 10) d = "0" + d;
            //s/3600/24,再下取整
            var h = parseInt(s % (3600 * 24) / 3600);
            if (h < 10) h = "0" + h;
            //s/(3600*24)的余数,再/3600,再下去整
            var m = parseInt(s % 3600 / 60);
            if (m < 10) m = "0" + m;
            //s/3600的余数,再/60，再下取整
            s %= 60;//s/60的余数
            if (s < 10) s = "0" + s;
            console.log(d + "天" + h + "小时" + m + "分" + s + "秒")
            res.data.data.lists[i].sday = d + "天" + h + "小时" 
          }
        }

// end
        this.data.isLoadMore = false;
        // res.data.data.lists=[];
        if (res.data.data.lists.length) {          
          this.data.pageInit[key].number++;
          this.setData({
            [keys[key - 1]]: tarr.concat(res.data.data.lists)
          })          
        } else if (this.data.pageInit[key].number == 1) {
          let tar = this.data.empty
          tar[key - 1] = true
          this.setData({
            empty: tar
          })
        }
      }
    });
  },
  showActive: function (e) {
    let tid = e.target.dataset.id;
    wx.navigateTo({
      url: "/pages/activity/performance/detail?id=" + tid
    })
  },
  checkeTime(n) {
    let m = n * 1000;
    let nowDate = new Date().getTime()
    while (1) {
      let thist = new Date().getTime();
      if ((thist - m) > nowDate) {
        break;
      }
    }
  },
  changeNav(e) {
    if (JSON.stringify(e.target.dataset) == "{}") { return; }
    let tar = ['', ''], tind = parseInt(e.target.dataset.ind);
    tar[tind] = 'nav_dhdac';
    this.setData({
      navdh: tar
    });
    this.getRewardList(tind + 1);
  },
  onReachBottom() {//触底加载更多    
    let loadi = 1;
    if (this.data.navdh[1] != '') { loadi = 2; }    
    this.getRewardList(loadi);
  },
  makeExtend(e) {
    let ti = 0
    for (let i in this.data.pageInit) {
      ti += this.data.pageInit[i].number
    }
    this.checkeTime(ti / 10);
    let ind = e.target.dataset.ind
    let tar = this.data.cardcode
    if (tar[ind] == '') { tar[ind] = 1 } else { tar[ind] = '' }
    this.setData({
      cardcode: tar
    })
  },
  onShareAppMessage(){
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  }
})