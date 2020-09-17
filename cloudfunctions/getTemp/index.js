// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  //先获取专业总人数
  let total = await db.collection('temperature')
    .where({
      academy: event.academy
    })
    .get()

  console.log('total = ', total)

  let uped = await db.collection('temperature')
    .aggregate()
    .lookup({
      from: 'stuInfo',
      let: {
        temp_sno: '$sno'
      },
      pipeline: $.pipeline()
      .match(_.expr($.and([
        $.eq(['$sno','$$temp_sno'])
      ])))
      .project({
        _id: 0,
        _openid: 0,
        sdorm: 0,
        sname: 0
      })
      .done(),
      as: 'stuInfo'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$stuInfo',0]),'$$ROOT'])
    })
    .match(_.expr($.and([
      $.eq([event.date, '$date']),
      $.eq([event.academy, '$sacademy'])
    ])))
    .count('uped')
    .end()

    let hot = await db.collection('temperature')
    .aggregate()
    .lookup({
      from: 'stuInfo',
      let: {
        temp_sno: '$sno'
      },
      pipeline: $.pipeline()
      .match(_.expr($.and([
        $.eq(['$sno','$$temp_sno'])
      ])))
      .project({
        _id: 0,
        _openid: 0,
        sdorm: 0,
        sname: 0
      })
      .done(),
      as: 'stuInfo'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$stuInfo',0]),'$$ROOT'])
    })
    .match(_.expr($.and([
      $.eq([event.date, '$date']),
      $.eq([event.academy, '$sacademy']),
      $.gte(['$temperature',37.3])
    ])))
    .count('hot')
    .end()

    let result =  {
      total: total.data[0].total,
      uped: 0,
      hot: 0
    }
    if (0 != uped.list.length){
      result.uped = uped.list[0].uped
    }
    if (0 != hot.list.length){
      result.hot = hot.list[0].hot
    }

    return result
}