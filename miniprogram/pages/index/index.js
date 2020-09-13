//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  teaHome: function () {
    //根据用户的appid判断用户是否已经注册
    wx.cloud.callFunction({
        name: 'getMyInfo',
        data: {
          user: 'tea'
        }
      })
      .then(res => {
        if (res.result.data.length == 1) {
          app.globalData.regInfo = res.result.data[0]
          //如果已经注册，跳转首页
          wx.redirectTo({
            url: "/pages/teacher/teaHomepage",
          })
        } else {
          //如果没有注册，跳转注册页面
          wx.redirectTo({
            url: "/pages/teacher/teaRegist",
          })
        }
      })
      .catch(err => {
        console.error(err)
      })

  },
  stuHome: function () {
    //根据用户的appid判断用户是否已经注册
    wx.cloud.callFunction({
        name: 'getMyInfo',
        data: {
          user: 'tea'
        }
      })
      .then(res => {
        if (res.result.data.length == 1) {
          //如果已经注册，跳转首页
          wx.switchTab({
            url: '/pages/homepage/homepage',
          })
        } else {
          //如果没有注册，跳转注册页面
          wx.redirectTo({
            url: "/pages/regist/regist",
          })
        }
      })
  },

})