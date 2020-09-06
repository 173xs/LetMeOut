// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let leave = await db.collection("leave")
  .where({
    'approveState':0
  })
  .get()

  //console.log('leave = ',leave)
  for ( let item of leave.data){
    let leave_sno = item.sno
    //console.log('leave_sno = ',leave_sno)
    let stu_info = await db.collection("stuInfo")
    .where({
      sno:leave_sno
    })
    .get()
    //console.log('stu_info = ',stu_info)
    item['sname'] = stu_info.data[0].sname
    item['sacademy'] = stu_info.data[0].sacademy

  }
  //console.log(leave.data)
  return leave
}