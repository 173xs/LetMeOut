// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let tno
  //先获取老师的no
  await db.collection("teaInfo")
  .where({
    _openid: wxContext.OPENID
  })
  .get()
  .then(res=>{
    tno = res.data[0].tno
  })

  console.log(event)
  let data = {}
  data['approveState'] = event.approveState
  if (event.approveState == 1){
    data['checkState'] = 0
  }
  data.ano = tno
  return await db.collection('leave')
  .doc(event.leaveId)
  .update({
    data: data
  })
}