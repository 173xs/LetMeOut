// pages/report/report.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonLength:0,
  },

  submit(e) {
    console.log(e.detail.value)
    wx.showLoading({
      title: '提交中',
      mask: true,
    })
    wx.cloud.callFunction({
        name: 'report',
        data: {
          sno: app.globalData.regInfo.sno,
          title: e.detail.value.title,
          detail: e.detail.value.detail,
          subDate: util.formatDay(new Date())
        }
      })
      .then(res => {
        // if (res.result)
        wx.hideLoading({
          success: (res) => {},
        })
        console.log('提交成功')
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          mask: false
        })
      })
      .catch(err => {
        console.error(err)
        wx.showToast({
          title: '提交失败',
          icon: 'fail',
          mask: true
        })
      })
  },
  textCount:function(e){
    var len=e.detail.value.length
    if(len<=150){
      this.setData({
        reasonLength:len,
      })
    }
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