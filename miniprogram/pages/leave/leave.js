// pages/leave/leave.js
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowDate:'',
    leaveDate:'',
    returnDate:'',
    endDate:'2021-09-01',
  },

  // 离开日期变化时返回日期最小为离开日期
 bindLeaveDateChange: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    leaveDate: e.detail.value,
    returnDate: e.detail.value
  })
},
bindReturnDateChange: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    returnDate: e.detail.value
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // leaveDate和returnDate的初始化
    var today=util.formatDay(new Date())
    this.setData({
      nowDate: today,
      leaveDate: today,
      returnDate: today
    })
  },
  submit: function(e) {
    // console.log('form submit 事件',e.detail.value)
    wx.showLoading({
      title: '提交中...',
      mask:true
    })
    var data = {
      leaveClass: e.detail.value.leaveClass,
      leaveDate: this.data.leaveDate,
      returnDate: this.data.returnDate,
      leaveReason: e.detail.value.leaveReason
    }
    //console.log('data = ',data)
    wx.cloud.callFunction({
      name:"upleave",
      data:data
    })
    .then(res=>{
      // console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon:'success',
        duration:1000,
        mask:true
      })
    })
    .catch(err=>{
      wx.showToast({
        title: '提交失败',
        icon:'fail',
        duration:1000,
        mask:true
      })
      console.log(err)
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
