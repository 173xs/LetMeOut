// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var sno
  await db.collection("stuInfo")
    .where({
      _openid: wxContext.OPENID,
    })
    .get()
    .then(res => {
      sno = res.data[0].sno
    })

  return await db.collection("leave")
    .add({
      data: {
        sno: sno,
        leaveClass: event.leaveClass,
        leaveDate: event.leaveDate,
        leaveReason: event.leaveReason,
        returnDate: event.returnDate,
        approveState: 0,
        subDate:event.subDate
      }
    })
}