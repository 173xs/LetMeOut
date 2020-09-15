// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  let exprNoCheck = _.expr($.and([
    $.eq([0, '$approveState']), //未审核
    // $.eq([0, '$checkState']),
    $.eq([event.tacademy, '$sacademy'])
  ]))

  let exprNoUse = _.expr($.and([
    $.eq([1, '$approveState']), //审核通过
    $.eq([-1, '$checkState']), //未出校门
    $.eq([event.tacademy, '$sacademy'])
  ]))

  let exprNoReturn = _.expr($.and([
    $.eq([1, '$approveState']), //审核通过
    $.eq([0, '$checkState']), //已经使用，出了校门
    $.eq([event.tacademy, '$sacademy'])
  ]))

  let noCheck = await count('noCheck', exprNoCheck)
  let noUse = await count('noUse', exprNoUse)
  let noReturn = await count('noReturn', exprNoReturn)

  //拼接最后结果
  let result = {
    noCheck: 0,
    noUse: 0,
    noReturn: 0
  }
  if (0 != noCheck.list.length) {
    result.noCheck = noCheck.list[0].noCheck
  }
  if (0 != noUse.list.length) {
    result.noUse = noUse.list[0].noUse
  }
  if (0 != noReturn.list.length) {
    result.noReturn = noReturn.list[0].noReturn
  }
  //console.log(result)
  return result
}

async function count(type, expr) {
  return await db.collection('leave')
    .aggregate()
    .lookup({
      from: 'stuInfo',
      let: {
        leave_sno: '$sno',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$sno', '$$leave_sno']),
        ])))
        .project({
          _id: 0,
          _openid: 0,
          sname: 0,
          sdorm: 0
        })
        .done(),
      as: 'stuInfo',
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$stuInfo', 0]), '$$ROOT'])
    })
    .project({
      stuInfo: 0
    })
    .match(expr)
    .count(type)
    .end()
}