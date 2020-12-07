// pages/pict/pict.js
const ctx = wx.createCanvasContext("makepic");
const app=getApp();
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
  data: {
    timg:{},
    cutImg:[],
    cWidth:0,//画布宽
    cHeight:0,//画布高
    positions:[],
    imgPos:[],
    isCanShow:"block",//画布是否渲染
    setWidthH: "",//初始化设置宽高
    nowNone:'',
    nowPos:'',
    isResetShow:"block",
    haveShare:0,
    haveGk:0,
    chanlinge:0,
    isHaveShare:false,//是否显示需要分享
    allGk:3,
    spotext:'',
    isSaved:false,//海报框是否显示
    sysWidth: 0,//海报宽
    sysHeight: 0,//海报高
    isHavePassed:false,//
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.showGoShare();//临时显示生海报按钮
    var tcl = wx.getStorageSync("chanlinget" + app.globalData.selfActiveId),
      dtg = wx.getStorageSync("haveChanl" + app.globalData.selfActiveId),
      isS = wx.getStorageSync("haveShared" + app.globalData.selfActiveId);
    console.log(tcl, dtg, isS);
    this.setData({
      chanlinge: parseInt(tcl),
      haveShare: parseInt(isS),
      haveGk: parseInt(dtg)
    });
    
    //初始化宽高
    this.data.sys = wx.getSystemInfoSync(); 
    //海报相关 
    var syst = this.data.sys;
    var th = syst.screenWidth * 1136 / 640;
    this.setData({
      sysWidth: syst.screenWidth,
      sysHeight: th
    });
//开始显示
    wx.showLoading({title:"加载中"});
    var sysInfo=wx.getSystemInfoSync();
    this.setData({
      cWidth:sysInfo.screenWidth*600/750, /*获得canvas画布的像素点数*/
      cHeight:sysInfo.screenWidth*600/750
    });
    var _this=this;
    app.apiRequest({//请求图片
      url: "/activityQaUrl/queryOne",
      data: { "id": app.globalData.selfActiveId},
      success: function (res) {
        console.log("获取的图片：",res)
        if (res.data.code == 1){
          setTimeout(()=>wx.redirectTo({ url: "../mess/mess"}),1000);
          return false;}
        _this.setData({ spotext: res.data.data.sponsorName })
        app.apiRequest({
          url:"/activityQaUrl/toBase64",
          data:{
            url: res.data.data.url
          },
          success:function(res){
            console.log(res)
            _this.setData({
              timg:res.data.data
            });
            if (_this.data.chanlinge <= 0) {
              _this.showGoShare();
            }
            _this.makeStart();
          }
        });
      }
    });
    //初始化位置信息    
      this.initStyle();
      this.randomPos();    
  },
  initStyle:function(wid){
    var tst=[];
    var tpo=[];
    var tw=194;
    var tcout=0;
    var tshow=false;
    if(wid){tw=wid;}    
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        var tob={};
        var position="left:"+(j*200+(200-tw)/2+1+1+j)+"rpx;top:"+(i*200+(200-tw)/2+1+j)+"rpx;";
        tob.width = "width:" + tw + "rpx;height:" + tw + "rpx;";
        tob.show="";
        tob.id=tcout;
        tob.pos=tcout;//要把pos随机乱序，点击的时候要切换pos值，检测是否通关的时候 要检测pos值和id值是否都一致
      //  if (this.data.nowNone!==''){ if (this.data.nowNone == tcout) { tob.show ="box-shadow:0 0 5px 3px #cc33cc;";}}
        tcout++;
        tst.push(tob);
        tpo.push(position);
      }
    }    
    this.setData({
      imgPos:tst,
      positions:tpo
    }); 
  },
  randomPos: function () {
    //随机乱序    
    var tst = this.data.imgPos;
    var randoma = [0, 1, 2, 3, 4, 5, 6, 7,8];
    for (let k = 0; k < 9; k++) {
      var tk = Math.floor(Math.random() * randoma.length);
      tst[k].pos = randoma[tk];//把图片临时按顺序打印
      tst[k].show="";
      randoma.splice(tk,1);
    }
  //  console.log("初始化的位置信息：",tst)
    this.setData({
      imgPos: tst,
      nowNone: '',
      nowPos: '',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  makeStart:function(){
    function send_code(code,call) {
      /*code是指图片base64格式数据*/
      //声明文件系统
      const fs = wx.getFileSystemManager();
      //随机定义路径名称
      var times = new Date().getTime();
      var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
      //将base64图片写入
      fs.writeFile({
        filePath: codeimg,
        data: code.slice(22),
        encoding: 'base64',
        success: (res) => {
          //写入成功了的话，新的图片路径就能用了          
          call(codeimg);
        }
      });
    }
    var thisimg=this.data.timg//this.data.timg.path;
    send_code(thisimg, function (imgd){
      ctx.drawImage(imgd, 0, 0, imgd.width, imgd.height, 0, 0, this.data.cWidth, this.data.cHeight);
      ctx.draw(true, this.startCut);  
    }.bind(this))     
  },
  startCut: function(){
    var tw = this.data.cWidth / 3;
    var _this = this;
    var tallimg = [];    
    function cutImg(i,j){
      wx.canvasToTempFilePath({
        x: j * tw,
        y: i * tw,
        width: tw,
        height: tw,
        destWidth: _this.data.cWidth,
        destHeight: _this.data.cHeight,
        canvasId: "makepic",
        success: function (res) {
          tallimg.unshift(res.tempFilePath);
          j--;
          if(j<0){j=2;i--}
          if(i<0){
            checkeCutOver();
            return false;
          }
          cutImg(i,j);
        }
      });
    }
    cutImg(2,2);
    // for (let i = 0; i < 3; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     wx.canvasToTempFilePath({
    //       x: j * tw,
    //       y: i * tw,
    //       width: tw,
    //       height: tw,
    //       destWidth: _this.data.cWidth,
    //       destHeight: _this.data.cHeight,
    //       canvasId: "makepic",
    //       success: function (res) {
    //         tallimg.push(res.tempFilePath);
    //         tcounti++;
    //       }
    //     });
    //   }
    // }    
    function checkeCutOver(){      
        // console.log("切片图片：",tallimg)
        _this.setData({
          cutImg: tallimg,
          isCanShow:"none"
        });
        wx.hideLoading();
        _this.startGame();      
    }    
  },  
  startGame:function(){
    //拼图游戏开始
    console.log("游戏开始");
  },
  makeStep:function(e){
    var id=e.target.dataset.id,
        pos=e.target.dataset.pos;
    var tpos = this.data.imgPos;
    if(this.data.nowNone===""){
      this.data.nowNone=id;
      this.data.nowPos=pos;
     
      tpos[id].show ="transform:scale(1.1,1.1);z-index:99;box-shadow:0 0 2px 1px rgba(0,0,0,0.3);"// "box-shadow:0 0 1px 1px #cc33cc;";
      this.setData({
        imgPos: tpos
      });
      return;
    }else{
      if(id==this.data.nowNone){        
        tpos[this.data.nowNone].show = "";
        this.setData({
          imgPos: tpos,
          nowPos: "",
          nowNone: ""
        });
        return;}      
      tpos[this.data.nowNone].show = "";
      tpos[this.data.nowNone].pos =pos;
      tpos[id].pos = this.data.nowPos
      this.setData({
        imgPos: tpos,
        nowPos:"",
        nowNone:""
      });
    }
   // if (!this.checkCanMove(pos)){return;}    
    if (this.checkPass()){//拼图成功
      this.initStyle(200);      
      this.setData({
        isResetShow:"none"
      });
      //存储过关情况
      var _this = this;
      this.setData({ haveGk: this.data.haveGk + 1})
      var dtg=this.data.haveGk+'';
      console.log(dtg)
      wx.setStorageSync("haveChanl" + app.globalData.selfActiveId,dtg);      
      this.data.chanlinge -= 1;
      var tcl=this.data.chanlinge+'';
      wx.setStorageSync("chanlinget" + app.globalData.selfActiveId,tcl);
      // console.log("当前已过关pict",this.data.haveGk)
      if (this.data.haveGk >= this.data.allGk) {
          // console.log("通关了")
          app.apiRequest({
            url: "/activityUser/update",
            data: { "passQty": 12, "activityId": app.globalData.selfActiveId },
            success: res=>{
              this.setData({ isHavePassed:true})
            }
          });
        }else{
            // console.log("当前未通关")
            wx.showToast({
              title: "任务完成,等待进入下一关",
              icon: "none"          
            });            
              if (_this.data.chanlinge > 0) {
                //选下一关
                setTimeout(function () {    _this.makeNext();}, 1500);
              } else if (_this.data.haveShare > 0) {
                setTimeout(function () { _this.showGoShare(); },1500);
              } else {
                setTimeout(function () { 
                wx.showToast({
                  title: "您的闯关次数已用光，请明天再来吧",
                  icon: "none"                  
                  })
                }, 1500);
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../performance/detail?id=' + app.globalData.selfActiveId
                  })},2500);
              }
            
          
        }
    }
  },
  checkCanMove:function(ind){//检查当前块是否可以移动
    var tnone=this.data.nowNone;
    if((ind+1)==tnone && ind!=2 && ind!=5){return true;}
    if ((ind - 1) == tnone && ind != 3 && ind != 6) { return true; }
    if ((ind + 3) == tnone) { return true; }
    if ((ind - 3) == tnone) { return true; }
    return false;
  },
  checkPass:function(){
    // wx.showToast({
    //   title:JSON.stringify(this.data.imgPos)
    // });
    console.log("现在的位置关系：",this.data.imgPos)
    for(let i=0;i<9;i++){
      if (this.data.imgPos[i].id != this.data.imgPos[i].pos){return false;}
    }
    // console.log("当前拼图过关")
    return true;
  },
  viewImage:function(e){//预览图片    
    
    var tsrc=this.data.timg;
    wx.previewImage({
      current:'123',
      urls:[tsrc]
    });
  },
  backhomep: function (){
    wx.redirectTo({ url: "../index/index?id=" + app.globalData.selfActiveId });
  },
  backhome:function(){
    wx.showModal({
      title:"退出任务",
      content:"退出任务将返回活动首页，此操作不消耗次数。您确定要退出任务么？",
      success:function(e){        
        if(e.confirm){
          wx.redirectTo({url:"../index/index?id="+app.globalData.selfActiveId});
        }else if(e.cancel){}
      }
    });
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
  onShareAppMessage: function (res) {//设置分享内容
    let turl = 'http://resource.jiyilive.com/img2/share/3.jpg'
    let ttit = '【我的抽奖机会用光啦，来帮我增加一次！】'
    let url = "/pages/darwShare/darwShare?cu=" + app.globalData.userId + "&id=" + app.globalData.selfActiveId
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
    // return {
    //   title: '我的答题机会用光啦，来帮我增加一次！',
    //   path: url,
    //   imageUrl: 'http://resource.jiyilive.com/img2/share/3.jpg'
    // }
    // var user = wx.getStorageSync('user');

    // var userid = app.globalData.userNumId;
    // var url = "/pages/index/index?userId=" + userid + "&shareId=" + app.globalData.selfActiveId
    // //console.log(escape(url))
    // //url=escape(url)
    // return {
    //   title: "快来助力，为我idol加油，一起拿票看演出！",
    //   path: url,
    //   imageUrl: "http://resource.jiyilive.com/img/index/share1.jpg",
    //   success: function (res) {        
    //     var shareTicket = res.shareTickets[0] || '';
    //     wx.getShareInfo({
    //       shareTicket: shareTicket,
    //       success: function (res) {
    //         console.log(res);
    //         wx.showModel({
    //           title: "text",
    //           text: JSON.stringify(res)
    //         });
    //       }
    //     });
    //   }
    // }
  },
  haveShared:function(){//已经分享
   this.data.haveShare -= 1
    var tsS = this.data.haveShare+''
    wx.setStorageSync("haveShared" + app.globalData.selfActiveId,tsS);
    wx.setStorageSync("chanlinget" + app.globalData.selfActiveId,'1');
    wx.showLoading()
    //选择下一关
    setTimeout(function () {
      wx.hideLoading();
      this.setData({ isHaveShare: false });
      wx.showToast({ "title": "闯关次数+1,进入下一关", "icon": "none" })
      setTimeout(() => { this.makeNext(); }, 1000);
    }.bind(this), 4000);
  },
  makeNext:function(){
    var tround = Math.random() > 0.5;
    if (tround) {
      wx.redirectTo({ url: "../mess/mess" })
    } else {
      wx.redirectTo({ url: "../pict/pict" })
    }
  },
  showGoShare:function(){//显示需要分享获得次数窗口；
    this.setData({ isHaveShare:true});
  },
  makeHaib(){//生成海报
    // var pages = getCurrentPages(); 				//获取加载的页面
    // var currentPage = pages[pages.length - 1]   //获取当前页面的对象
    // var url = currentPage.route 		//获取页面url
    var url ='/pages/activity/performance/detail';//这里是活动内不能直接获取当前页面路径，而是固定跳活动信息介绍页
    wx.showLoading({
      title:"正在生成海报"
    })
    this.setData({
      isSaved:true
    })
    //先获取小程序码的base64文件    
    app.apiRequest({
      url: "/smallprogramcode/getSmallProgramCode",
      data:{//传递小程序路径，和路径携带的参数，u代表分享人userid，
        path:url,
        param:"id="+app.globalData.selfActiveId
      },
      success:res=>{
        console.log(res);       
        let avertou = app.globalData.userInfo.avatarUrl.replace("132", '0')

        send_code(res.data,resd=>{
          wx.getImageInfo({
            src: avertou,
            success: res =>{
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
              _this.setData({ isSaved: false,isHaveShare:false })
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
  goToLaohj:function(){//跳转老虎机
    wx.redirectTo({
      url:"../laohj/index"
    })
  },
  giveUpCount:function() {
      wx.switchTab({
        url: "/pages/index/index"
      })
  },
})