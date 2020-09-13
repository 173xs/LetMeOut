// pages/travelRecords/travelRecords.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: '',
    queryDate: '',
    recordlist: [],
  },
  //调用getTravel云函数，获取出行记录
  getTravel: function(queryDate) {
    wx.cloud.callFunction({
        name: "getTravel",
        data: {
          sno: app.globalData.regInfo.sno,
          date: queryDate
        }
      })
      .then(res => {
        this.setData({
          recordlist: res.result.list
        })
        console.log("recordlist:", res.result.list)
        console.log('travelrecords = ', res)
      })
      .catch(err => {
        console.error(err)
      })
  },
  // 日期的选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      queryDate: e.detail.value,
    })
    //这里获取日期对应的出行记录 eg: queryDate:2020-09-10
    this.getTravel(this.data.queryDate)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // leaveDate和returnDate的初始化
    var today = util.formatDay(new Date())
    this.setData({
      nowDate: today,
      queryDate: today
    })
    this.getTravel(this.data.nowDate)

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