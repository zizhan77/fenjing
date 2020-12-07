// pages/lingj/lingj.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    setWidthH: "",//初始化设置宽高
    isAddrShow:"none",//显示输入地址框
    isListShow:"block",//显示列表
    allres:[],
    jiangpId:"",
    named:'',
    phoned:"",
    prov:"",
    addr:"",
    insteadp:""
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
      //初始化背景方向及位置
      
    this.data.sys = wx.getSystemInfoSync();
    function makeFit(obj){//返回宽高差的一半
      var tx = (obj.y - obj.x) / 2;
      var ty = (obj.y - obj.x) / 2;
      return { x: tx, y: ty }
    }
    var tr = makeFit({ x: this.data.sys.screenWidth, y: this.data.sys.screenHeight });
    this.setData({
      setWidthH: "width:" + this.data.sys.screenHeight + 'px;height:' + this.data.sys.screenWidth + "px;transform:rotate(90deg) translate(" + tr.y + "px," + tr.x + "px);-webkit-transform:rotate(90deg) translate(" + tr.y + "px," + tr.x + "px);"
    });
    //请求中奖纪录数据
    var that=this;
    app.apiRequest({
      url: "/reward/queryMaterialAndTicketList",     
      data: { query:0,
        "activityId": app.globalData.selfActiveId
      },      
      success: function (res) {
        console.log(res.data);
        that.setData({
          allres: res.data.data
        });
      }
    });   
  },
  backHome:function(){
    wx.navigateTo({url:"../index/index?id="+app.globalData.selfActiveId});
  },
  backList:function(){
    this.setData({
      isAddrShow:"none",
      isListShow: "block",
    });
  },
  showAddr: function (e) {
    var tid=e.target.dataset.ind,
        cid=e.target.dataset.cid;

    this.setData({
      jiangpId:tid,
      countId:cid,
      isAddrShow: "block",
      isListShow:"none"
    });
  },
  clickCopy:function(e){
    var str=e.target.dataset.ma;
    wx.setClipboardData({
      data:str,
      success:function(res){
        wx.showToast({title:"复制成功"});
      }
    });
  },
  inputValue: function (e) {
    //console.log(e);
    var named=e.target.dataset.name;
    var val=e.detail.value;
    this.setData({
      [named]:val
    });
  },
  updatas:function(){
    if (this.data.named == '') {wx.showToast({title:"请您输入姓名",icon:"none"});return;}
    if (this.data.phoned == '') { wx.showToast({ title: "请您输入电话", icon: "none" }); return;}
    if (this.data.prov == '') { wx.showToast({ title: "请您输入省市", icon: "none" }); return;}
    if (this.data.addr == '') { wx.showToast({ title: "请您输入地址", icon: "none" }); return;}
    var that=this;    
    var datas ={
      id:that.data.countId,
      prizeId: that.data.jiangpId,
      contactName: that.data.named,
      contactPhone: that.data.phoned,
      contactProvince: that.data.prov,
      contactAddress: that.data.addr,
      "activityId": app.globalData.selfActiveId
    }
    this.data.named ="";
    this.data.phoned="";
    this.data.prov = "";
    this.data.addr = "";
    console.log(datas);
    app.apiRequest({
      url: "/reward/update",     
      data:datas,
      success:function(res){
        console.log(res);
        if(res.data.message=="成功"){
          wx.showToast
          that.backList();
        }else{}
      }
    });
  },
  findYou:function(){
    var that=this;
    wx.chooseLocation({
      success:function(res){
          //console.log(res);
          that.setData({
            insteadp:res.address,
            prov:res.address
          });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(){
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
