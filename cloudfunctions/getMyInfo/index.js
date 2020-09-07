// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if ('stu' == event.user) {
    return await db.collection("stuInfo")
      .where({
        _openid: wxContext.OPENID,
      })
      .get()
  }else{
    return await db.collection("teaInfo")
    .where({
      _openid: wxContext.OPENID,
    })
    .get()
  }

}