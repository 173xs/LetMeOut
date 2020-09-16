// pages/inform/inform.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverBoxDisplay: "none",
    curLeaveBill: [], //初始化请假单的信息
  },
  showBill: function (e) {
    console.log(e)
    /*
    这里不用获取id了，直接把所以信息都带过来了，
    反正就只差一点点信息了。
    */
    let bill = this.data.reslist[e.currentTarget.dataset.curidx]
    bill.sno = app.globalData.regInfo.sno
    bill.sname = app.globalData.regInfo.sname
    bill.sacademy = app.globalData.regInfo.sacademy

    this.setData({
      coverBoxDisplay: "block",
      curLeaveBill: bill
    })
    console.log(this.data.curLeaveBill)
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
    wx.cloud.callFunction({
        name: 'getMsg',
        data: {
          sno: app.globalData.regInfo.sno,
        }
      })
      .then(res => {
        console.log('消息列表', res.result)
        let list = []
        for (var item of res.result) {
          if ('leave' == item.type) {
            item.title = item.detail.leaveClass +
              ':' +
              item.detail.leaveDate +
              '~' +
              item.detail.returnDate
          } else {
            item.title
          }
          list.push(item)
        }
        this.setData({
          reslist: list
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