// pages/teaHomepage/leaveCheck.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leaveList: [],
    limit: 6,
    skip: 0
  },

  callApproveFunc(leave, approveState) {
    console.log('leave = ', leave, approveState)
    wx.showLoading({
      title: '审批提交中',
      mask: true
    })
    wx.cloud.callFunction({
        name: 'approveLeave',
        data: {
          tno: app.globalData.regInfo.tno,
          leaveId: leave.id,
          approveState: approveState
        }
      })
      .then(res => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '完成审批',
              icon:'success',
              duration: 500
            })
          },
        })
        console.log('完成审批')
        //更新一下前端界面的上的请假单表
        let newList = this.data.leaveList
        newList[leave.idx].approveState = approveState
        newList[leave.idx].approved = 1
        this.setData({
          leaveList: newList
        })
        this.data.skip -= 1
        this.callUpMsg(leave.sno,
          'leave',
          leave.id,
          new Date())
      })
      .catch(err => {
        console.error(err)
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '审批提交失败，请稍候重试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          },
        })
      })
  },
  //提交发给学生的反馈消息
  callUpMsg(sno, type, id, d) {
    console.log(sno, type, id)
    wx.cloud.callFunction({
        name: 'upMsg',
        data: {
          sno: sno,
          type: type,
          id: id,
          checkTime: util.formatTime(d),
          tname: app.globalData.regInfo.tname
        }
      })
      .then(res => {
        // console.log(res)
        // console.log(id,'消息记录成功')
      })
  },
  backBtn(res) {
    this.callApproveFunc(res.currentTarget.dataset, -1)
  },

  okBtn(res) {
    this.callApproveFunc(res.currentTarget.dataset, 1)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    })
    wx.cloud.callFunction({
        name: 'getleave',
        data: {
          funcName: '1-a',
          condition: {
            limit: this.data.limit,
            // approvedList:approvedList
            skip: this.data.skip,
            tacademy: app.globalData.regInfo.tacademy
          }
        }
      })
      .then(res => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载成功',
              icon: 'success',
              duration: 1000,
            })
          },
        })
        this.setData({
          leaveList: res.result.list,
          skip: res.result.list.length
        })
        console.log('待审核请假单:', this.data.leaveList)
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
    wx.showLoading({
      title: '加载中',
    })
    console.log('onreachbottom')
    wx.cloud.callFunction({
        name: 'getleave',
        data: {
          funcName: '1-a',
          condition: {
            limit: this.data.limit + this.data.skip,
            // approvedList:approvedList
            skip: this.data.skip,
            tacademy: app.globalData.regInfo.tacademy
          }
        }
      })
      .then(res => {
        // console.log(res)
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载成功',
              icon: 'success',
              duration: 1000,
            })
          },
        })
        let oldList = this.data.leaveList
        let newList = oldList.concat(res.result.list)
        this.setData({
          leaveList: newList
        })
        this.data.skip += res.result.list.length
        console.log('待审核请假单:', this.data.leaveList)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})