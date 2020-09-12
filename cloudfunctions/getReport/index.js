// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const $ = _.aggregate
  let academy
  //先获取老师的学院信息
  await db.collection("teaInfo")
  .where({
    _openid: wxContext.OPENID
  })
  .get()
  .then(res=>{
    academy = res.data[0].tacademy
  })

  return await db.collection('abnormal')
  .aggregate()
  .lookup(
    {
      from: "stuInfo",
      let: {
        abnormal_sno: '$sno',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$sno', '$$abnormal_sno']),
          //$.eq([academy,'$sacademy'])
        ])))
        .project({
          _id:0,
          _openid:0,
        })
        .done(),
      as: 'stuInfo',
    }
  )
  .replaceRoot({
    newRoot: $.mergeObjects([$.arrayElemAt(['$stuInfo', 0]), '$$ROOT'])
  })
  .project({
    stuInfo:0
  })
  .match({
    sacademy: academy
  })
  .end()
}