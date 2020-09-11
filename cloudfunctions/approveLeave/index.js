// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let data 
  data.approveState = event.approveState
  if (event.approveState == 1){
    data.checkState = 0
  }
  return await db.collection('leave').
  doc(event.leaveId)
  .update({
    data: data
  })
}