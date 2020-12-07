// pages/mess/mess.js
var app=getApp();
const can = wx.createCanvasContext("haibao");
function makeHaib(obj, call) {
  // let ty=40/1334*obj.height,tx=59/750*obj.width;
  // let ex=tx,ey=1162/1334*obj.height;
  // let wx=149/750*obj.width,wy=100/1334*obj.height;  
  // can.drawImage("/img/hb.jpg",0,0,700,1245,0,0,obj.width,obj.height)
  let ty = 24 / 1334 * obj.height, tx = 568 / 750 * obj.width;
  let ex = 178 / 750 * obj.width, ey = 1146 / 1334 * obj.height;
  can.drawImage("/images/haibao/hb1.jpg", 0, 0, 700, 1245, 0, 0, obj.width, obj.height)

  can.save();
  can.beginPath()
  can.arc(tx + 45 * obj.bili, ty + 45 * obj.bili, 45 * obj.bili, 0, Math.PI * 2, false);
  // can.arc(tx+40*obj.bili,ty+40*obj.bili,40*obj.bili,0,Math.PI*2,false);
  can.clip()
  // can.drawImage(obj.toux,tx,ty,80*obj.bili,80*obj.bili);
  can.drawImage(obj.toux, tx, ty, 90 * obj.bili, 90 * obj.bili);
  can.restore();
  can.drawImage(obj.xcxm, ex, ey, 120 * obj.bili, 120 * obj.bili)
  can.draw(true, call);
  //绘制完毕开始保存  
}

Page({
  /**
   * 页面的初始数据
   */  
  data:{
    setWidthH:'',    
    nowQuest:"",
    answer1:"",
    answer2: "",
    answer3: "",
    answer4: "",
    nowQuesi:0,
    chanlinge:0,
    wordNumber:"一",//大写数字
    questions:[],
    nowQueses:{},
    haveAnswerI:0,//当前页面的题目索引
    quesTitle:["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
    utoux:"http://resource.jiyilive.com/img/ques/toux.png",
    uname:"当前用户",
    isGuoGK:"none",//过关框显示
    isWGuoGK: false,//未过关框显示
    isQuesShow:"block",//问题框，提示出现的时候隐藏
    chanlinge:0,
    haveShare:0,
    allGk:3,//总关卡  
    haveGk: 0,   
    isHaveShare: false,//是否显示需要分享
    isHavePassed:false,//通关了
    isSaved: false,//海报框是否显示
    sysWidth: 0,//海报宽
    sysHeight: 0,//海报高
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    var tcl = wx.getStorageSync("chanlinget" + app.globalData.selfActiveId),
      dtg = wx.getStorageSync("haveChanl" + app.globalData.selfActiveId),
      isS = wx.getStorageSync("haveShared" + app.globalData.selfActiveId);
      console.log(tcl, dtg, isS);
      
    //设置抽奖次数  
    this.setData({
      chanlinge: parseInt(tcl),//剩余闯关次数
      haveShare: parseInt(isS),//已经分享的次数
      haveGk: parseInt(dtg)//已经到达的关数
    });
  
    this.data.sys = wx.getSystemInfoSync();
    //海报相关 
    var syst = this.data.sys;
    var th = syst.screenWidth * 1136 / 640;
    this.setData({
      sysWidth: syst.screenWidth,
      sysHeight: th
    });
    var _this=this;
    
    //请求问题数据     
    app.apiRequest({
      url: "/activityQa/queryOne",
      data: { "id": app.globalData.selfActiveId},
      success: function(res){     
        console.log('问题数据：',res)   
        var datas = [makearr(res.data.data)]
        function makearr(ar){
           ar.answers=ar.answers.split("$&");
           ar.title=ar.tile;
          // ar.answer = ar.answer
          return ar;
          for(var i=0;i<ar.length;i++){
            var tstr=ar[i].answers.replace(/[\[\]]/g,'');
            ar[i].answers=tstr.split(",");
          }
          return ar;
        }
        _this.setData({
          questions: datas
        });
        _this.makeQues();        
      }      
    })
     
  //设置头像
  var info=app.globalData.userInfo;
    if(info!==null && JSON.stringify(info)!=="{}"){
      this.setData({
        uname:info.nickName,
        utoux: info.avatarUrl
      });
    }
    if (tcl <= 0) {
      if (this.data.haveShare > 0) {
        this.showGoShare();
        return;
      }
    }
  
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(){
  },
  makeQues:function(){
    var obj = this.data.questions[0];
    // console.log(obj);return;
    this.setData({
      nowQueses:obj,
      nowQuest: obj.title,
      answer1:obj.answers[0]+'',
      answer2:obj.answers[1]+'',
      answer3:obj.answers[2]+'',
      answer4:obj.answers[3]+'',
      wordNumber: this.data.quesTitle[this.data.nowQuesi]
    });
  
  },
  checkChanl:function(call){//检测是否还能继续
    var tcl = this.data.chanlinge;    
    tcl += ''
    wx.setStorageSync("chanlinget" + app.globalData.selfActiveId, tcl);    
    if (tcl <= 0) {
      if (this.data.haveShare > 0) {
        this.showGoShare();
        return;
      }
      wx.showToast({ "title": "您的答题次数用光了，请明天再来吧", "icon": "none" });
      setTimeout(() => {
        this.backhomep();
      }, 1000);
      return;
    }
    
    call();//都检测没问题，继续下一关
  },
  nextChanl:function(){//下一关   
    this.data.chanlinge--
    var tcl=this.data.chanlinge;
    tcl+=""
    wx.setStorageSync("chanlinget" + app.globalData.selfActiveId, tcl); 
    this.checkChanl(this.makeNext)
  },
  reChanlege: function () {//重新挑战      
    this.setData({
      isWGuoGK:false,
      chanlinge: this.data.chanlinge-1
    });
    this.checkChanl(function () { });
  },
  checkQues(e){
    var ind =e.target.dataset.set;    
    if (ind == this.data.nowQueses.answer){
      this.setData({
        haveGk: this.data.haveGk + 1
      })
      var dtg=this.data.haveGk+"";
      wx.setStorageSync("haveChanl" + app.globalData.selfActiveId,dtg);
      // console.log("关卡情况", this.data.haveGk, this.data.allGk)
      //先检验是不是通关了
      var _this=this;
      if (this.data.haveGk >= this.data.allGk) {
        app.apiRequest({
          url: "/activityUser/update",
          data: {
            "activityId": app.globalData.selfActiveId, "passQty": 12
          },
          success: function (res) {            
            //过关
            _this.setData({ isHavePassed: true })
          }
        });
        return;
      }
      //显示过关成功
      wx.showToast({
        title:"恭喜答对了"
      })
      setTimeout(() => {//正确
        this.nextChanl()
      }, 500);
      return      
    }else{
      this.setData({
        isWGuoGK:true
      })
      return;
      setTimeout(()=>{//错误
        this.reChanlege()        
      },100);
    }
  },  
  backhomep:function(){
    //this.reChanlege();
    wx.redirectTo({ url:"../index/index?id="+app.globalData.selfActiveId});
  },
  backhomed: function () {
    wx.showModal({
      title: "退出任务",
      content: "退出任务将返回活动首页，此操作不消耗次数。您确定要退出任务么？",
      success: function (e) {
        if (e.confirm) {
          wx.redirectTo({ url: "../index/index?id=" + app.globalData.selfActiveId });
        } else if (e.cancel) { }
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (){
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
  //  wx.showToast({title:"触底啦~"});
    //console.log("触底啦")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {//设置分享内容
    var userid = app.globalData.userId;
    let turl = 'http://resource.jiyilive.com/img2/share/3.jpg'
    let ttit = '【我的抽奖机会用光啦，来帮我增加一次！】'
    let url = "/pages/darwShare/darwShare?cu=" + userid + "&id=" + app.globalData.selfActiveId
    if (app.globalData.selfActiveId === '162') {
      ttit = '共抗病毒限时领N95口罩';
      turl = 'http://resource.jiyilive.com/img2%2Fshare%2F123456.jpg'
    }
    return {
      title: ttit,
      path: url,
      imageUrl: turl
    }

    // var userid = app.globalData.userId;
    // var url = "/pages/activity/performance/detail?u=" + userid + "&id=" + app.globalData.selfActiveId,
    //   strs = "【快来助力，为我idol加油，一起拿票看演出！】";
    // return{
    //   title: '我的答题机会用光啦，来帮我增加一次！',
    //   path: url,
    //   imageUrl: 'http://resource.jiyilive.com/img2/share/3.jpg'
    // }    
  },
  haveShared: function () {//已经分享
    this.data.haveShare-=1;
    var tsS=this.data.haveShare+""
    wx.setStorageSync("haveShared" + app.globalData.selfActiveId,tsS);
    wx.setStorageSync("chanlinget" + app.globalData.selfActiveId,'1');
    this.data.chanlinge=1;
    wx.showLoading()
    //选择下一关
    setTimeout(function(){
      wx.hideLoading();
      this.setData({ isHaveShare: false });
      wx.showToast({ "title": "闯关次数+1,进入下一关", "icon": "none" })
      setTimeout(() => { this.makeNext(); }, 1000);
    }.bind(this),4000);    
  },
  makeNext: function () {
    var tround = Math.random() > 0.5;
    if (tround) {
      wx.redirectTo({ url: "../mess/mess" })
      return;
     //直接进入下一题
      this.data.questions.shift()
      this.makeQues();
    } else {
      wx.redirectTo({ url: "../pict/pict" })
    }
  },
  showGoShare: function () {//显示需要分享获得次数窗口；
    this.setData({ isHaveShare: true });
  },
  goToLaohj() {//跳转老虎机
    wx.redirectTo({
      url: "../laohj/index"
    })
  },
  giveUpCount() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  makeHaib() {//生成海报
    // var pages = getCurrentPages(); 				//获取加载的页面
    // var currentPage = pages[pages.length - 1]   //获取当前页面的对象
    // var url = currentPage.route 		//获取页面url
    var url = '/pages/activity/performance/detail';//这里是活动内不能直接获取当前页面路径，而是固定跳活动信息介绍页
    wx.showLoading({
      title: "正在生成海报"
    })
    this.setData({
      isSaved: true
    })
    //先获取小程序码的base64文件    
    app.apiRequest({
      url: "/smallprogramcode/getSmallProgramCode",
      data: {//传递小程序路径，和路径携带的参数，u代表分享人userid，
        path: url,
        param: "id=" + app.globalData.selfActiveId
      },
      success: res => {
        console.log(res);
        let avertou = app.globalData.userInfo.avatarUrl.replace("132", '0')

        send_code(res.data, resd => {
          wx.getImageInfo({
            src: avertou,
            success: res => {
              let obj = {}
              obj.name = app.globalData.userInfo.nickName
              obj.width = this.data.sysWidth
              obj.height = this.data.sysHeight
              obj.toux = res.path
              obj.xcxm = resd
              obj.bili = this.data.sysWidth / 750
              makeHaib(obj, () => {
                wx.hideLoading()
                cutImg()//保存图片
              })
            }
          });
        });
      }
    });
    function send_code(code, call) {
      /*code是指图片base64格式数据*/
      //声明文件系统
      const fs = wx.getFileSystemManager();
      //随机定义路径名称
      var times = new Date().getTime();
      var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
      //将base64图片写入
      fs.writeFile({
        filePath: codeimg,
        data: code,//.slice(22),
        encoding: 'base64',
        success: (res) => {
          //写入成功了的话，新的图片路径就能用了          
          call(codeimg);
        }
      });
    }
    var _this = this;
    function cutImg() {//画布转图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.data.sysWidth,
        height: _this.data.sysHeight,
        destWidth: _this.data.sysWidth * 4,
        destHeight: _this.data.sysHeight * 4,
        canvasId: "haibao",
        success: (res) => {//缓存完图片，转存到本地
          // console.log("缓存文件路径", res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              _this.setData({ isSaved: false, isHaveShare: false })
              wx.showToast({
                title: "保存成功，请在相册选择海报分享吧",
                icon: 'none'
              })
              _this.haveShared();
            }
          });
        }
      });
    }
  },
})