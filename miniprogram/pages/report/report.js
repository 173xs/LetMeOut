// pages/report/report.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonLength: 0,
    errmsg1:"",
    errmsg2:""
  },
  inputBlur:function(e){
    var len=e.detail.value.length
    if(len==0){
      this.setData({
        errmsg1:"*来都来了，啥都不写吗"
      })
    }
  },
  textBlur:function(e){
    var len=e.detail.value.length
    if(len==0){
      this.setData({
        errmsg2:"*来都来了，啥都不写吗"
      })
    }else if(len<10){
      this.setData({
        errmsg2:"*这么一丢丢，你再多写一点嘛"
      })
    }
  },
  submit(e) {
    var titleLen=e.detail.value.title.length
    var qosLen=e.detail.value.detail.length
    if(titleLen>0 & qosLen>10){
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
            success: (res) => {
              console.log('提交成功')
              wx.showToast({
                title: '提交成功',
                icon:'success',
                duration:2000,
                mask:true,
                success: (res)=>{
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            },
          })
  
        })
        .catch(err => {
          // console.error(err)
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                mask: true
              })
            },
          })
  
        })
    }else{
      this.setData({
        errmsg1:"*来都来了，啥都不写吗",
        errmsg2:"*来都来了，啥都不写吗"
      })
    }
    
  },
  textCount: function (e) {
    var len = e.detail.value.length
    if (len <= 150) {
      this.setData({
        reasonLength: len,
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