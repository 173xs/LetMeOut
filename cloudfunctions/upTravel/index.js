// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //获取学号
  var sno
  await db.collection("stuInfo")
    .where({
      _openid: wxContext.OPENID,
    })
    .get()
    .then(res => {
      sno = res.data[0].sno
    })

  //增加记录
  return await db.collection("travelRecords")
    .add({
      data: [{
        sno: sno,
        date: event.date,
        time: event.time,
        bnum: event.bnum
      }]
    })
}