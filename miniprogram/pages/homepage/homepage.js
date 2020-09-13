// pages/homepage/homepage.js
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //温度按钮的背景色，当体温格式不对时，切换背景色，并取消点击事件
    tempBtnBGColor: "#66ccff",
    upTemp: 0,

    //病例数初始化
    sureIllNum: 0,
    suspectIllNum: 0,
    isolateIllNum: 0,
    hotIllNum: 0,

    nowDate: util.formatTime(new Date()),
    academyIndex: 0,
    academyList: ['全部', ' 数学科学学院', '物理与材料科学学院', '化学化工学院', '计算机科学与技术学院', '电子信息工程学院', '生命科学学院', '文学院', '历史系', '哲学系', '新闻传播学院',
      '经济学院', '商学院', '外语学院', '法学院', '管理学院', '社会与政治学院', '艺术学院', '资源与环境工程学院', '电气工程与自动化学院', '江淮学院', '马克思主义学院', '体育军事教学部', '国际商学院',
      '国际教育学院', '文典学院', '互联网学院', '徽学与中国传统文化研究院', '物质科学与信息技术研究院'
    ],
    dormIndex: 0,
    dormList: ['全部', '枫园', '桂园', '槐园', '竹园', '松园', '梅园', '李园', '桔园', '桃园', '榴园', '杏园', '枣园']
  },

  //变化的时候要更新病例数
  bindAcademyChange: function (e) {
    this.setData({
      academyIndex: e.detail.value
    })
  },
  //变化的时候要更新病例数
  bindDormChange: function (e) {
    this.setData({
      dormIndex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
   prefixInteger:function(num) {
    return (Array(2).join('0') + num).slice(-2);
   },
  //扫一扫
  scancode() {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        wx.showLoading({
          title: '行程提交中',
        })
        var obj = JSON.parse(res.result)
        // console.log(obj)
        let d = new Date()
        wx.cloud.callFunction({
          name:'upTravel',
          data:{
            sno: app.globalData.regInfo.sno,
            date: d.getFullYear() + '-' + this.prefixInteger(d.getMonth()+1) + '-' + this.prefixInteger(d.getDate()),
            time: this.prefixInteger(d.getHours()) + ':' + this.prefixInteger(d.getMinutes()),
            bunm: obj.num
          }
        })
        .then(res=>{
          //console.log(res)
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '提交成功',
                icon:'success',
                duration:1500
              })
            },
          })
        })
        .catch(err=>{
          console.error(err)
        })
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  //体温输入框的体温值的判断，不合理的体温值不允许输入
  bindReplaceInput: function (e) {
    console.log(e.detail)
    var value = e.detail.value;
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入2个小数
    if (value < 35 || value > 45) {
      this.setData({
        tempBtnBGColor: "#a7defa",
        upTemp: 0
      })
    } else {
      this.setData({
        tempBtnBGColor: "#66ccff",
        upTemp: value
      })
    }
    return {
      value: value
    }
  },
  //体温框的上传
  upTempBtn: function () {
    console.log(this.data.upTemp)
    if (this.data.upTemp == 0) {
      wx.showToast({
        title: '输入有误',
        icon:'none',
        duration: 1000,
        mask: true
      })
    }
    var d = new Date()
    let timeFlag
    if (d.getHours() <= 10 && d.getHours() >= 6) {
      timeFlag = 0
    } else if (d.getHours() > 10 && d.getHours() <= 14) {
      timeFlag = 1
    } else if (d.getHours() > 14) {
      timeFlag = 2
    }
    wx.cloud.callFunction({
        name: 'upTemp',
        data: {
          sno: app.globalData.regInfo.sno,
          temperature: this.data.upTemp,
          date: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(),
          timeFlag: timeFlag
        }
      })
      .then(res => {
        console.log('上传成功')
        wx.showToast({
          title: '上传成功',
          icon:'none',
          duration: 1000,
          mask: true
        })
      })
      .catch(err => {
        console.log('上传失败')
        wx.showToast({
          title: '上传失败',
          icon:'none',
          duration: 1000,
          mask: true
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})