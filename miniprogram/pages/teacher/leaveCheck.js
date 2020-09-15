// pages/teaHomepage/leaveCheck.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leaveList: [],
    approvedList:[],
    limit:4,
    skip: 0
  },

  callApproveFunc(id, approveSate) {
    wx.cloud.callFunction({
        name: 'approveLeave',
        data: {
          leaveId: id,
          approveState: approveSate
        }
      })
      .then(res => {
        console.log('完成审批')
      })
      .catch(err => {
        console.error(err)
      })
  },
  backBtn(res) {
    // callApproveFunc(res.currentTarget.dataset.id,-1)
    wx.cloud.callFunction({
        name: 'approveLeave',
        data: {
          tno:app.globalData.regInfo.tno,
          leaveId: res.currentTarget.dataset.id,
          approveState: -1
        }
      })
      .then(res => {
        console.log('完成审批')
        // approvedList.push(res.currentTarget.dataset.id)
        this.data.skip -= 1
      })
      .catch(err => {
        console.error(err)
      })
  },
  okBtn(res) {
    // callApproveFunc(res.currentTarget.dataset.id,1)
    wx.cloud.callFunction({
        name: 'approveLeave',
        data: {
          tno:app.globalData.regInfo.tno,
          leaveId: res.currentTarget.dataset.id,
          approveState: 1
        }
      })
      .then(res => {
        console.log('完成审批')
        // approvedList.push(res.currentTarget.dataset.id)
        this.data.skip -= 1
      })
      .catch(err => {
        console.error(err)
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        this.setData({
          leaveList: res.result.list,
          skip : res.result.list.length
        })
        console.log('待审核请假单:', this.data.leaveList)
      })
      .catch(err => {
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
        console.log(res)
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
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})