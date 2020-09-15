// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = {
    checkState: event.checkState
  }
  if (0 == event.checkState) {
    data.leaveGateNum = event.gateNum
  } else {
    data.returnGateNum = event.gateNum
  }
  console.log(data,event)
  return await db.collection('leave')
    .doc(event._id)
    .update({
      data: data
    })

}

// async function leave() {

// }