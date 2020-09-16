// pages/myLeave/myLeave.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverBoxDisplay: "none",
    reslist: [],
    curLeaveBill: [], //初始化请假单的信息

    //菜单栏按钮选中时的样式
    noCheckWxss: '',
    yesCheckWxss: 'addColor',
    backCheckWxss: ' ',

    sname: ''
  },
  callLetMeOut(curId, checkState, building) {
    wx.cloud.callFunction({
        name: 'letMeOut',
        data: {
          checkState: checkState + 1,
          _id: curId,
          gateNum: building.num
        }
      })
      .then(res => {
        if (-1 == checkState){
          console.log('离校：更新成功')
        }else{
          console.log('返校：更新成功')
        }
        //清理掉building
        try {
          wx.removeStorageSync('building')
        } catch (e) {
          console.error(e)
          // Do something when catch error
        }
      })
  },
  //使用请假单
  useBill: function(e) {
    console.log('useBill = '.e)
    /*先判断是通过扫一扫跳转过来此处，还是直接点击过来
    如果是直接扫一扫过来的就可以从storge获取building
    */
    var building = {}
    //扫一扫过来
    try {
      var value = wx.getStorageSync('building')
      if (value) {
        console.log('value = ',value)
        building = value
        // Do something with return value
      }
    } catch (err) {
      console.error('err = ',err)
      // Do something when catch error
      //直接点击过来
      //先从二维码读取建筑信息
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: (res) => {
          building = JSON.parse(res.result)
          console.log('building = ', building)
          this.callUpTravel(building)
        },
        fail: (res) => {
          console.error(res)
        },
        complete: (res) => {},
      })
    }

    if (1 == e.currentTarget.dataset.checkState) {
      console.log('此请假单已经使用')
      return
    }
    //获取请假单id
    var curId = e.currentTarget.dataset.id
    // console.log(curId)
    //获取请假单的使用状态，判断是出校门还是返校
    var checkState = e.currentTarget.dataset.checkState
    console.log('---',curId,checkState,building)
    //扫的是校门，调用出校门云函数
    this.callLetMeOut(curId, checkState, building)
  },

  callGetLeave: function (funcName) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
        name: 'getleave',
        data: {
          sno: app.globalData.regInfo.sno,
          funcName: funcName
        }
      })
      .then(res => {
        console.log('请假单', res)
        if (funcName == '2-a') {
          this.setData({
            reslist: res.result.data
          })
        } else {
          this.setData({
            reslist: res.result.list
          })
        }
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载成功',
              icon: 'success',
              mask: true,
              duration: 500
            })
          },
        })
      })
      .catch(err => {
        wx.showToast({
          title: '加载失败',
          icon: 'fail',
          mask: true
        })
      })
  },
  //未审核按钮点击事件
  noCheckClick: function () {
    console.log('nocheckclick')
    //切换按钮颜色
    this.setData({
      noCheckWxss: 'addColor',
      yesCheckWxss: ' ',
      backCheckWxss: ' '
    })
    //刷新列表，填充未审核的请假信息
    this.callGetLeave('2-a')

  },

  //已审核按钮点击事件
  yesCheckClick: function () {
    //切换按钮颜色
    this.setData({
      noCheckWxss: '',
      yesCheckWxss: 'addColor',
      backCheckWxss: ' '
    })
    //刷新列表，填充已审核的请假信息
    this.callGetLeave('2-b')
  },

  //驳回按钮点击事件
  backCheckClick: function () {
    //切换按钮颜色
    this.setData({
      noCheckWxss: '',
      yesCheckWxss: ' ',
      backCheckWxss: 'addColor'
    })
    //刷新列表，填充驳回的请假信息
    this.callGetLeave('2-c')
  },


  showBill: function (e) {
    var curId = e.currentTarget.dataset.curid
    var list = this.data.reslist
    var bill = []
    //console.log(curId)
    for (var i = 0; i < list.length; ++i) {
      if (list[i]._id === curId) {
        bill = list[i]
      }
    }
    //console.log(bill)
    this.setData({
      coverBoxDisplay: "block",
      curLeaveBill: bill
    })
  },
  hideBill: function () {
    this.setData({
      coverBoxDisplay: "none"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //默认刷新已通过的
    this.callGetLeave('2-b')

    this.setData({
      sname: app.globalData.regInfo.sname
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