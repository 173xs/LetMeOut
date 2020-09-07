// pages/myInfo/myInfo.js
const db = wx.cloud.database()
var app = getApp(0)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:"",
    sno:"",
    sname:"",
    sacademy:"",
    sdorm:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid
    wx.cloud.callFunction({
      name:'getMyInfo',
      data:{
        user:'stu'
      }
    })
    .then(res=>{
      console.log('myinfo = ', res.result)
      console.log('userinfo = ', app.globalData)
      openid = res.result
      this.setData({
        nickName : app.globalData.userInfo.nickName,
        sno: res.result.data[0].sno,
        sname:res.result.data[0].sname,
        sacademy: res.result.data[0].sacademy,
        sdorm: res.result.data[0].sdorm
      })
      
    })
    .catch(err=>{
      console.error(err)
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