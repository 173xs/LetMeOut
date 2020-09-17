// miniprogram/pages/teacher/abnormalList.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: "",
    queryDate: "",
    reslist: []
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      queryDate: e.detail.value,
    })
    this.callGetTemp(this.data.queryDate)
  },
  //调用getTemp云函数
  callGetTemp(queryDate) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
        name: 'getTemp',
        data: {
          funcName: 2,
          date: queryDate,
          academy: app.globalData.regInfo.tacademy
        }
      })
      .then(res => {
        console.log('res = ', res)
        wx.hideLoading({
          success: (res) => {},
        })
        this.setData({
          reslist: res.result.list
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var now = util.formatDay(new Date())
    this.setData({
      nowDate: now,
      queryDate: now
    })
    this.callGetTemp(this.data.queryDate)
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