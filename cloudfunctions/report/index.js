// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
    return await db.collection("abnormal")
    .add({
      data:{
        sno:event.sno,
        title:event.title,
        detail:event.detail,
        subDate: event.subDate,
        checkState: false //默认没有查阅
      }
    })

}
