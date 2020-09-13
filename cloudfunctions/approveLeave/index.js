// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  console.log(event)
  let data = {}
  data['approveState'] = event.approveState
  //如果是审批通过，就加上一个使用状态字段
  if (event.approveState == 1){
    data['checkState'] = 0
  }
  data.ano = event.tno
  return await db.collection('leave')
  .doc(event.leaveId)
  .update({
    data: data
  })
}