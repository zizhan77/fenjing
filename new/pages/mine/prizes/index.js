// pages/mine/prizes/index.js
const app=getApp();
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
    havenodata:false,
    showDetai: [],    
    navdh: ['nav_dhdac', '', ''],//老虎机下方菜单选中控制
    navList: [],
    navReward: [],
    navFriend: [],
    pageInit: {
      1: { number: 1, size: 20 },
      2: { number: 1, size: 20 },
      3: { number: 1, size: 20 }
    },
    cardcode:[],
    empty:[false,false,false]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){    
    this.getRewardList(1);
    setInterval(() => { this.makeDescTime('navList')},1000);
    setInterval(() => { this.makeDescTime('navReward') }, 1000);    
  },
  confirmReward(e){//确认奖品
      let tid=e.target.dataset.id;
      wx.navigateTo({
        url:"address/list?id="+tid
      });
  },
  makeDescTime(ar){
    let tar=this.data[ar]
    for(let i in tar){
      if (tar[i].status==0){
        tar[i].sday = makeTime(tar[i].time)
      }
    }
    this.setData({
      [ar]:tar
    })

    function makeTime(ti){
      let delta=60*60*12*1000,
          newt=ti.replace(/-/g,'/');
      let nowt=new Date().getTime(),
          endt=new Date(newt).getTime()+delta,
          det=endt-nowt;
      let str='',isday=true;
      if(det/(60*60*1000*24)>1){str+=Math.floor(det/(60*60*1000*24))+"天";isday=false;}
      str+=Math.floor(det%(60*1000*60*24)/(60*60*1000))+"小时"
      str+=Math.floor(det%(60*60*1000)/(60*1000))+"分"
      if(isday){
        str+=Math.floor(det%(60*1000)/1000)+"秒"
      }
      return str;
    }
  },
  copythis: function (e) {
    // console.log(e.currentTarget.dataset.prizedid)
    var str = e.target.dataset.ma;
    wx.setClipboardData({
      data: str,
      success: function (res) {
        wx.showToast({ title: "复制成功"});
      }
    })
    // 获取点击次数
    app.apiRequest({
      url: "/click/phone/clickPrize",
      data: {
        id: e.currentTarget.dataset.prizedid,
        tokenId: app.globalData.apiToken
      },
      success: res => {

      }
    })
  },
  showOrHide:function(e){
    var vid=parseInt(e.target.dataset.ind),//第一个坐标
        hid=parseInt(e.target.dataset.ide);//第二个坐标    
    var tar = this.data.showDetai
    // console.log(vid, hid, tar[vid][hid])
    if (tar[vid][hid] == "") { tar[vid][hid] = "new_isShow";}
    else { tar[vid][hid] = "";}
    this.setData({
      showDetai:tar
    })
  },
  isJumpthis:function(e){
    var str = e.target.dataset.ma;    
    if(str.indexOf('.')>-1){      
      app.globalData.tmpAllUrl=str;
      wx.navigateTo({
        url: "../../webview/webview?url=" + str
      });
    }else{
      wx.navigateToMiniProgram({
        appId: str,
        // path:'',//跳转的页面
        extraData: {
          form:"粉鲸饭团"
        },
        success: function () { }
      })
    }
  },
  getRewardList(key) {//获取奖品列表        
    if (this.data.isLoadMore) { return; }
    let changeInd=[1,2,4]
    this.data.isLoadMore = true;
    let keys = ['navList', 'navReward', 'navFriend'];
    let tarr = this.data[keys[key - 1]]
    app.apiRequest({
      url: '/reward/phone/queryListByUser',
      data: {
        pageNo: this.data.pageInit[key].number,
        pageSize: this.data.pageInit[key].size,
        flag: changeInd[key-1]
      },
      success: res => {
        console.log(key,"的奖品信息是",res);
        this.data.isLoadMore = false;
        // res.data.data.lists=[];
        if (res.data.data.lists.length) {
          if (key == 3) {
            let tard=[]
            let tl = res.data.data.lists.length,
              ta = res.data.data.lists;
            for(let i=0;i<tl;i++){
              if(ta[i].key.indexOf("://")>-1){
                ta[i].isCode=false
              }else{
                ta[i].isCode = true
              }
              tard.push('')
            }
            this.setData({ cardcode: this.data.cardcode.concat(tard)});
          }
          this.data.pageInit[key].number++;
          this.setData({
            [keys[key - 1]]: tarr.concat(res.data.data.lists)
          })
          // console.log("新数组：", this.data[keys[key - 1]])
        } else if (this.data.pageInit[key].number==1){
          let tar=this.data.empty
          tar[key-1]=true
          this.setData({
            empty:tar
          })
        }
      }
    });
  },
  checkeTime(n){
    // let m=n*1000;
    // let nowDate=new Date().getTime()
    // while(1){
    //   let thist=new Date().getTime();
    //   if((thist-m)>nowDate){
    //     break;
    //   }
    // }
  },
  changeNav(e) {
    if (JSON.stringify(e.target.dataset) == "{}") { return; }
    let tar = ['', '', ''], tind = parseInt(e.target.dataset.ind);
    tar[tind] = 'nav_dhdac';
    this.setData({
      navdh: tar
    });
    this.getRewardList(tind + 1);
  },
  onReachBottom() {//触底加载更多    
    let loadi = 1;
    if (this.data.navdh[1] != '') { loadi = 2; }
    if (this.data.navdh[2] != '') { loadi = 3; }
    this.getRewardList(loadi);
  },
  makeExtend(e){
    let ti=0
    for(let i in this.data.pageInit){
      ti+=this.data.pageInit[i].number
    }
    this.checkeTime(ti/10);
    let ind=e.target.dataset.ind
    let tar=this.data.cardcode
    if(tar[ind]==''){tar[ind]=1}else{tar[ind]=''}
    this.setData({
      cardcode:tar
    })
  },
  onShareAppMessage() {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  }
})