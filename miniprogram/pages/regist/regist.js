// pages/regist/regist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //表单的value值，若用户已注册，则查询appid获取下列的值，填充到表单中
    // sno:"E19301219",
    sno:"",
    name:"",
    academyIndex:0,
    dormIndex:0,
    stuChecked:"true",
    teaCheked:"",

    //当前用户的身份，用于跳转到不同的首页
    curUser:"student",


    //错误信息，例如‘用户名已存在’
    errMsg:"",

    
    academyList: ['数学科学学院','物理与材料科学学院','化学化工学院','计算机科学与技术学院','电子信息工程学院','生命科学学院','文学院','历史系','哲学系','新闻传播学院',
    '经济学院','商学院','外语学院','法学院','管理学院','社会与政治学院','艺术学院','资源与环境工程学院','电气工程与自动化学院','江淮学院','马克思主义学院','体育军事教学部','国际商学院',
    '国际教育学院','文典学院','互联网学院','徽学与中国传统文化研究院','物质科学与信息技术研究院'],
    
    dormList: ['惠园','枫园','桂园','槐园','竹园','松园','梅园','李园','桔园','桃园','榴园','杏园','枣园']
  },

  //学院按钮点击赋值
  bindAcademyChange: function(e) {
    this.setData({
      academyIndex: e.detail.value
    })
  },

    //宿舍按钮点击赋值
  bindDormChange: function(e) {
    this.setData({
      dormIndex: e.detail.value
    })
  },

  // 已删除  //根据身份的不同跳转到不同的首页
  // goHomepage:function(){
  //   var user=this.data.curUser
  //   if(user=='student'){
  //     wx.switchTab({
  //       url: "/pages/homepage/homepage",
  //     })
  //   }else if(user=='teacher'){
  //     wx.redirectTo({
  //       url: "/pages/teacher/teaHomepage",
  //     })
  //   }
  // },

  // 已删除  //身份按钮切换赋值
  // radioChange: function (e) {
  //   console.log(e)
  //   this.setData({
  //     curUser:e.detail.value
  //   })
  // },

  noChange: function(e){
    this.setData({
      sno:e.detail.value
    })
  },
  nameChange:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  callRegister(data) {
    wx.cloud.callFunction({
        name: 'register',
        data: data
      })
      .then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000,
          mask: true
        })
        wx.switchTab({
          url: '/pages/homepage/homepage',
        })
      })
      .catch(err => {
        console.log(err)
        wx.showToast({
          title: '注册失败',
          icon: 'fail',
          duration: 1000,
          mask: true
        })
      })
  },
  regist() {
    console.log(this.data)
    var user = this.data.curUser
    if(this.data.sno=="" || this.name==""){
      this.setData({
        errMsg:"用户名或密码不能为空"
      })
    }
    else{
      this.setData({
        errMsg:""
      })
      wx.showLoading({
        title: '注册中',
        mask: true
      })
      var data 
      if ('student' == user) {
        data = {
          user: user,
          info: {
            sno: this.data.sno,
            sname: this.data.name,
            sacademy: this.data.academyList[this.data.academyIndex],
            sdorm: this.data.dormList[this.data.dormIndex]
          }
        }
      } else if ('teacher' == user) {
        data = {
          user: user,
          info: {
            tno: this.data.sno,
            tname: this.data.name,
            tacademy: this.data.academyList[this.data.academyIndex],
          }
        }
      }
      this.callRegister(data)
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