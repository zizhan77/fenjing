// pages/index/friend/index.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:10,
    pageNo:1,
    friends:[]
  },
  getList(){
    let tid=this.data.id
    app.apiRequest({
      url:"/activityUser/phone/queryRewardByUser/3",
      data:{
        pageNo:this.data.pageNo,
        pageSize:20        
      },
      success:res=>{
        console.log(res)
        if(res.data.code==0){
          if(res.data.data.lists.length){
            this.data.pageNo++;
            for(let i in res.data.data.lists){
              res.data.data.lists[i].createTime = res.data.data.lists[i].createTime.substr(0,10)
            }
            this.setData({
              friends:res.data.data.lists
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id=options.id;
    this.getList()
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '一起来拿演唱会门票吧！',
      path: "/pages/index/index?u=" + app.globalData.userId,
      imageUrl: "http://resource.jiyilive.com/img2/share/2.jpg"
    }
  }
})