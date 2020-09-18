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
    reslist: [],
    limit: 20,
    skip: 0
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      queryDate: e.detail.value,
    })
    this.callGetTemp(this.data.queryDate)
  },
  //调用getTemp云函数
  callGetTemp(queryDate, limit, skip) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
        name: 'getTemp',
        data: {
          funcName: 2,
          date: queryDate,
          academy: app.globalData.regInfo.tacademy,
          limit: limit,
          skip: skip
        }
      })
      .then(res => {
        console.log('res = ', res)
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载成功',
              icon: 'success',
              duration: 1000,
            })
          },
        })
        let oldList = this.data.reslist
        let newList = oldList.concat(res.result.list)
        this.setData({
          reslist: newList
        })
        this.data.skip += res.result.list.length
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载失败，请稍候重试',
              icon: 'none',
              duration: 1500,
            })
          },
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
    let limit = this.data.limit + this.data.skip
    this.callGetTemp(this.data.queryDate, limit, this.data.skip)
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
    let limit = this.data.limit + this.data.skip
    this.callGetTemp(this.data.queryDate, limit, this.data.skip)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})