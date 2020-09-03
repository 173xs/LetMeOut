// pages/myLeave/myLeave.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverBoxDisplay:"none",

    //菜单栏按钮选中时的样式
    noCheckWxss:'addColor',
    yesCheckWxss:' ',
    backCheckWxss:' '
  },
  //未审核按钮点击事件
  noCheckClick:function(){
    //切换按钮颜色
    this.setData({
      noCheckWxss:'addColor',
      yesCheckWxss:' ',
      backCheckWxss:' '
    })
    //刷新列表，填充未审核的请假信息
  },

  //已审核按钮点击事件
  yesCheckClick:function(){
    //切换按钮颜色
    this.setData({
      noCheckWxss:'',
      yesCheckWxss:'addColor',
      backCheckWxss:' '
    })
    //刷新列表，填充已审核的请假信息
  },

    //驳回按钮点击事件
  backCheckClick:function(){
    //切换按钮颜色
    this.setData({
      noCheckWxss:'',
      yesCheckWxss:' ',
      backCheckWxss:'addColor'
    })
    //刷新列表，填充驳回的请假信息
  },


  showBill:function(){
    this.setData({
      coverBoxDisplay:"block"
    })
  },
  hideBill:function(){
    this.setData({
      coverBoxDisplay:"none"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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