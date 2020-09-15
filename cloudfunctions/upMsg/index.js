// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('msgList')
  .add({
    data: [
      {
        sno: event.sno,
        type: event.type,//'leave' or 'abnormal'
        id: event.id,//请假单或者异常的id
        checkTime: event.checkTime,//审批的时间
      }
    ]
  })
}