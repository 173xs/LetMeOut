// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //console.log('event = ',event)
  var data = {
    _openid: wxContext.OPENID,
  }
  Object.assign(data, event.info)

  //console.log('data= ', data)
  if ('student' == event.user) {
    return await db.collection("stuInfo")
      .add({
        data: data
      })
  } else {
    return await db.collection("teaInfo")
      .add({
        data: data
      })
  }
}