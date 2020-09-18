// pages/myLeave/myLeave.js
const util = require('../../utils/util.js')
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
  //调用云函数提交行程
  callUpTravel: function (building) {
    wx.showLoading({
      title: '行程提交中',
    })

    // console.log(obj)
    let d = new Date()
    // console.log(util.formatTime(d))
    let time = util.formatTime(d).split(' ')
    wx.cloud.callFunction({
        name: 'upTravel',
        data: {
          sno: app.globalData.regInfo.sno,
          date: time[0],
          time: time[1],
          bnum: building.num
        }
      })
      .then(res => {
        //console.log(res)
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500
            })
          },
        })
      })
      .catch(err => {
        console.error(err)
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '提交失败',
              icon:'none',
            })
          },
        })
      })
  },
  //封装调用使用请假单出校或者返校的云函数
  callLetMeOut(curId, checkState, building) {
    wx.showLoading({
      title: '请求提交中',
    })
    wx.cloud.callFunction({
        name: 'letMeOut',
        data: {
          checkState: checkState + 1,
          _id: curId,
          gateNum: building.num
        }
      })
      .then(res => {
        if (-1 == checkState) {
          console.log('离校：更新成功')
        } else {
          console.log('返校：更新成功')
        }

        //清理掉building
        try {
          wx.removeStorageSync('building')
        } catch (e) {
          console.error(e)
          // Do something when catch error
        }

        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: (res) => {
                setTimeout(() => {
                  //更新列表
                  let newList = this.data.reslist
                  newList[this.data.curIdx].checkState += 1
                  this.setData({
                    reslist: newList,
                    coverBoxDisplay: "none"
                  })
                }, 1500);
              }
            })
          },
        })
      })
      .catch(err=>{
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
  },
  //使用请假单
  useBill: function (e) {
    console.log('useBill = ', e)
    let bill = this.data.curLeaveBill
    if (bill.checkState == -1 && util.formatDay(new Date()) != bill.leaveDate) {
      wx.showToast({
        title: '请假单不符合出校条件',
        icon: 'none',
        mask: true
      })
      return
    }
    /*先判断是通过扫一扫跳转过来此处，还是直接点击过来
    如果是直接扫一扫过来的就可以从storge获取building
    */
    var building = {}
    //扫一扫过来
    try {
      var value = wx.getStorageSync('building')
      if (value) {
        console.log('value = ', value)
        building = value
        // Do something with return value
      } else {
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
            return
          },
          complete: (res) => {},
        })
      }
    } catch (err) {
      console.error('err = ', err)
      // Do something when catch error
    }

    //扫的是校门，调用出校门云函数
    setTimeout(() => {
      this.callLetMeOut(bill._id, bill.checkState, building)
    }, 1500);
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
          let list = res.result.data
          list.reverse()
          this.setData({
            reslist: list
          })
        } else if ('2-b' == funcName) {
          let noUse = []
          let using = []
          let used = []
          for (var item of res.result.list) {
            if (-1 == item.checkState) {
              noUse.unshift(item)
            } else if (1 == item.checkState) {
              used.unshift(item)
            } else {
              using.unshift(item)
            }
          }
          using.push.apply(using, noUse)
          using.push.apply(using, used)
          console.log(using, noUse, used)
          this.setData({
            reslist: using
          })
        } else if ('2-c' == funcName) {
          let list = res.result.list
          list.reverse()
          this.setData({
            reslist: list
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
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载失败',
              icon: 'none',
              mask: true
            })
          },
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
      curLeaveBill: bill,
      curIdx: e.currentTarget.dataset.curidx
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