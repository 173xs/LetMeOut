// miniprogram/pages/teacher/leaveShow.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        NnoCheck: 0,
        NnoUse: 0,
        NnoReturn: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.cloud.callFunction({
                name: 'getLeaveCount',
                data: {
                    tacademy: app.globalData.regInfo.tacademy
                }
            })
            .then(res => {
                console.log(res)
                this.setData({
                    NnoCheck: res.result.noCheck,
                    NnoUse: res.result.noUse,
                    NnoReturn: res.result.noReturn
                })
                this.drawPieChart()
            })
            .catch(err=>{
                console.error(err)
            })
    },

    drawPieChart: function () {
        // 页面渲染完成
        //使用wx.createContext获取绘图上下文context
        var context = wx.createContext();
        // 画饼图
        //    数据源
        if(this.data.NnoCheck==0 & this.data.NnoUse==0 & this.data.NnoReturn==0){
            var array=[1,1,1]
        }
        else{
            var array = [this.data.NnoCheck, this.data.NnoUse, this.data.NnoReturn];
        }
        var colors = ["#66ccff", "#ccccff", "#ccffff"];
        var total = 0;
        //    计算总量
        for (var index = 0; index < array.length; index++) {
            total += array[index];
        }
        //    定义圆心坐标
        var point = {
            x: 100,
            y: 100
        };
        //    定义半径大小
        var radius = 60;
        /*    循环遍历所有的pie */
        for (var i = 0; i < array.length; i++) {
            context.beginPath();
            //    	起点弧度
            var start = 0;
            if (i > 0) {
                // 计算开始弧度是前几项的总和，即从之前的基础的上继续作画
                for (var j = 0; j < i; j++) {
                    start += array[j] / total * 2 * Math.PI;
                }
            }
            console.log("i:" + i);
            console.log("start:" + start);
            //      1.先做第一个pie
            //   	2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针
            context.arc(point.x, point.y, radius, start, start + array[i] / total * 2 * Math.PI, false);
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
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.drawPieChart()
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