// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.funcName) {
    case '1-a':
      return await getLeave1_a(event, context);
      break;
    case '2-a':
      return await getLeave2_a(event, context);
      break;
    case '2-b':
      return await getLeave2_b(event, context);
      break;
    case '2-c':
      return await getLeave2_c(event, context);
      break;
    case '2-d':
      return await getLeave2_d(event, context);
      break;
  }

}

//老师审批请假单的查询函数
async function getLeave1_a(event, context) {
  console.log('condition = ', event.condition)

  let leave = await db.collection('leave')
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
    .match(_.expr($.and([
      $.eq([0, '$approveState']),
      $.eq([event.condition.tacademy, '$sacademy'])
    ])))
    .limit(event.condition.limit)
    .skip(event.condition.skip)
    .end()

  console.log('leave = ', leave)
  return leave
}

//查询某个学生未审批请假单
async function getLeave2_a(event, context) {
  console.log('sno = ', event.sno)
  return await db.collection("leave")
    .where(_.and([{
        'approveState': _.eq(0)
      },
      {
        'sno': _.eq(event.sno)
      }
    ]))
    .get()
}

//查询某个学生已通过审批的请假单
async function getLeave2_b(event, context) {
  let expr = _.expr($.and([
    $.eq([event.sno, '$sno']),
    $.eq([1, '$approveState']),
  ]))

  return await getLeave(expr)
}

//查询某个学生已经驳回的请假申请
async function getLeave2_c(event, context) {
  let expr = _.expr($.and([
    $.eq([event.sno, '$sno']),
    $.eq([-1, '$approveState']), //已驳回的请假单
  ]))
  return await getLeave(expr)
}

//查询某个学生已经审核通过，还未使用的请假单
//或者已经通过审核，正在使用中的请假单
async function getLeave2_d(event, context) {
  let expr = _.expr($.and([
    $.eq([event.sno, '$sno']),
    $.eq([1, '$approveState']),//审核通过
    $.eq([event.checkState, '$checkState']), //未使用的请假单-1,正在使用0
    //$.eq([event.curDate, '$leaveDate'])//时间也要是当天的
  ]))
  return await getLeave(expr)
}

//通过不同条件来查询某个学生请假单
async function getLeave(expr) {
  return await db.collection('leave')
    .aggregate()
    .lookup({
      from: 'teaInfo',
      let: {
        leave_ano: '$ano',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$tno', '$$leave_ano']),
        ])))
        .project({
          _id: 0,
          _openid: 0,
          tno: 0,
          tacademy: 0,
        })
        .done(),
      as: 'teaInfo',
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$teaInfo', 0]), '$$ROOT'])
    })
    .project({
      teaInfo: 0
    })
    .match(expr)
    .end()
}