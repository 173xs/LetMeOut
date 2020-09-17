// miniprogram/pages/teacher/reportCheck.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportList: [],
    limit:4,
    skip: 0,
  },
  callUpMsg(sno,type,id,d){
    wx.cloud.callFunction({
      name:'upMsg',
      data: {
        sno:sno,
        type:type,
        id:id,
        checkTime:util.formatTime(d),
        tname: app.globalData.regInfo.tname
      }
    })
    .then(res=>{
      wx.hideLoading({
        success: (res) => {
          //console.log('消息记录成功')
          wx.showToast({
            title: '提交成功',
            duration: 800
          })
        },
      })
    })

  },
  okBtn: function (e) {
    console.log(e.target.dataset)
    wx.showLoading({
      title: '审批提交中',
      mask:true
    })
    wx.cloud.callFunction({
        name: 'reviewReport',
        data: {
          reportId: e.target.dataset.id,
          reviewDate: util.formatDay(new Date()),
          tno: app.globalData.regInfo.tno
        }
      })
      .then(res => {
        console.log(res)
        this.data.skip -= 1
        this.callUpMsg(e.target.dataset.sno,
          'abnormal',
          e.target.dataset.id,
          new Date())
          let newList = this.data.reportList
          newList[e.currentTarget.dataset.idx].check = 1
          this.setData({
            reportList: newList
          })
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
          limit: this.data.limit,
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
          limit: this.data.limit + this.data.skip,
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