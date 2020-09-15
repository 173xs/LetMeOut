// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)
  return await db.collection('abnormal')
  .doc(event.reportId)
  .update({
    data:{
      checkState: true,//将查阅状态改为已阅
      reviewDate: event.reviewDate,
      rno: event.tno//查阅人id
    }
  })

}