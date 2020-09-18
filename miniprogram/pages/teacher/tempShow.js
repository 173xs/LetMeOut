// miniprogram/pages/teacher/tempShow.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: "",
    queryDate: "",
    totalNum: 0, //总人数
    upedNum: 0, //已上报人数
    hotNum: 0, //体温发热人数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  callGetTemp(queryDate) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
        name: 'getTemp',
        data: {
          funcName: 1,
          date: queryDate,
          academy: app.globalData.regInfo.tacademy
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
        this.setData({
          totalNum: res.result.total,
          upedNum: res.result.uped,
          hotNum: res.result.hot
        })
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
      var that=this
      var t=setTimeout(function(){
        that.drawPic()
      },1500)
  },
  drawPic:function(){
 //画饼图
    // 页面渲染完成
    //使用wx.createContext获取绘图上下文context
    var context = wx.createContext();
    // 画饼图
    //    数据源
    var rate = 1 - (this.data.hotNum / this.data.upedNum).toFixed(2)
    var colors = ["#68ed50", "#f6b943"];
    //    定义圆心坐标
    var point = {
      x: 100,
      y: 100
    };
    //    定义半径大小
    var radius = 60;
    /*    循环遍历所有的pie */
    for (var i = 0; i < 2; i++) {
      context.beginPath();
      //    	1.起点弧度
      var start = 0;
      //   	2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针
      if (i == 0) {
        context.arc(point.x, point.y, radius, start, rate * 2 * Math.PI, false);
      } else {
        start = rate * 2 * Math.PI;
        context.arc(point.x, point.y, radius, start, 2 * Math.PI, false);
      }
      //      3.连线回圆心
      context.lineTo(point.x, point.y);
      //      4.填充样式
      context.setFillStyle(colors[i]);
      //      5.填充动作
      context.fill();
      context.closePath();
    }
    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    wx.drawCanvas({
      //指定canvasId,canvas 组件的唯一标识符
      canvasId: 'mypie',
      actions: context.getActions()
    });
  },
  onLoad: function (options) {
   
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      queryDate: e.detail.value,
    })
    //这里获取日期对应的出行记录 eg: queryDate:2020-09-10
    this.callGetTemp(this.data.queryDate)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var now = util.formatDay(new Date())
    this.setData({
      nowDate: now,
      queryDate: now
    })
    this.callGetTemp(this.data.queryDate)
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