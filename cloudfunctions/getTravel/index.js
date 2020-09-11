// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command
const $ = _.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //获取学号
  var sno
  await db.collection("stuInfo")
    .where({
      _openid: wxContext.OPENID,
    })
    .get()
    .then(res => {
      sno = res.data[0].sno
    })
console.log(event,event.date)
    return await db.collection('travelRecords')
    .aggregate()
    .lookup(
      {
        from: "buildings",
        let: {
          travel_sno: '$sno',
          travel_bnum: '$bnum',
          travel_date: '$date'
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq([sno, '$$travel_sno']),
            $.eq(['$bnum', '$$travel_bnum']),
            $.eq([event.date, '$$travel_date'])
          ])))
          .project({
            _id:0,
            type:0,
            num:0,
          })
          .done(),
        as: 'buildInfo',
      }
    )
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$buildInfo', 0]), '$$ROOT'])
    })
    .project({
      buildInfo:0
    })
    .end()
  
}