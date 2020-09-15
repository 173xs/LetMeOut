// pages/report/report.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //不足两位数的数字前面补零
  prefixInteger: function (num) {
    return (Array(2).join('0') + num).slice(-2);
  },
  //获取日期
  getDate: function (d) {
    return d.getFullYear() + '-' + this.prefixInteger(d.getMonth() + 1) + '-' + this.prefixInteger(d.getDate())
  },
  submit(e) {
    var d = new Date()

    console.log(e.detail.value)
    wx.cloud.callFunction({
        name: 'report',
        data: {
          sno: app.globalData.regInfo.sno,
          title: e.detail.value.title,
          detail: e.detail.value.detail,
          sudDate: this.getDate()
        }
      })
      .then(res => {
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