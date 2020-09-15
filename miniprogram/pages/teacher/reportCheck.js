// miniprogram/pages/teacher/reportCheck.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportList: [],
    skip: 0,
  },
  //不足两位数的数字前面补零
  prefixInteger: function (num) {
    return (Array(2).join('0') + num).slice(-2);
  },
  //获取日期
  getDate: function (d) {
    return d.getFullYear() + '-' + this.prefixInteger(d.getMonth() + 1) + '-' + this.prefixInteger(d.getDate())
  },
  okBtn: function (e) {
    console.log(e.target.dataset)
    wx.cloud.callFunction({
        name: 'reviewReport',
        data: {
          reportId: e.target.dataset.id,
          reviewDate: this.getDate(new Date()),
          tno: app.globalData.regInfo.tno
        }
      })
      .then(res => {
        console.log(res)
        this.data.skip -= 1
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
        name: 'getReport',
        data: {
          tacademy: app.globalData.regInfo.tacademy,
          limit: 4,
          skip: this.data.skip
        }
      })
      .then(res => {
        console.log(res.result)
        this.setData({
          reportList: res.result.list,
          skip: res.result.list.length
        })
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
    wx.cloud.callFunction({
        name: 'getReport',
        data: {
          tacademy: app.globalData.regInfo.tacademy,
          limit: 4 + this.data.skip,
          skip: this.data.skip
        }
      })
      .then(res => {
        console.log(res.result)
        var oldList = this.data.reportList
        var newList = oldList.concat(res.result.list)
        this.setData({
          reportList: newList,
        })
        this.data.skip += res.result.list.length
        console.log('待查阅列表', this.data.reportList)
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})