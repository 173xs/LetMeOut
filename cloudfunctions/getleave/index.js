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
  }

}

//老师审批请假单的查询函数
async function getLeave1_a(event, context) {
  console.log('condition = ', event.condition)

  let wxContext = cloud.getWXContext()
  let leave = await db.collection('leave')
  .aggregate()
  .lookup(
    {
      from: 'stuInfo',
      let: {
        leave_sno: '$sno',
        // leave_approve: '$approveState',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$sno', '$$leave_sno']),
          // $.eq([0, '$$leave_approve']),
          // $.eq([event.condition.tacademy, '$sacademy'])
        ])))
        .project({
          _id: 0,
          _openid: 0,
        })
        .done(),
      as: 'stuInfo',
    }
  )
  .replaceRoot({
    newRoot: $.mergeObjects([$.arrayElemAt(['$stuInfo', 0]), '$$ROOT'])
  })
  .project({
    stuInfo: 0
  })
  .match(_.expr($.and([
    $.eq([0, '$approveState']),
    // $.eq([0, '$checkState']),
    $.eq([event.condition.tacademy, '$sacademy'])
  ])))
  .limit(event.condition.limit)
  .skip(event.condition.skip)
  .end()

  console.log('leave = ',leave)
  return leave
}

//查询学生的未审批请假单
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

//查询已通过审批请假单
async function getLeave2_b(event, context) {
  return await db.collection('leave')
  .aggregate()
  .lookup(
    {
      from: 'teaInfo',
      let: {
        // leave_sno: '$sno',
        leave_ano: '$ano',
        // leave_approve: '$approveState',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          //$.eq(['E19301222', '$$leave_sno']),
          $.eq(['$tno', '$$leave_ano']),
          //$.eq([0, '$$leave_approve']),
          //$.eq(['计算机科学与技术学院', '$sacademy'])
        ])))
        .project({
          _id: 0,
          _openid: 0,
          tno: 0,
          tacademy:0,
        })
        .done(),
      as: 'teaInfo',
    }
  )
  .replaceRoot({
    newRoot: $.mergeObjects([$.arrayElemAt(['$teaInfo', 0]), '$$ROOT'])
  })
  .project({
    teaInfo: 0
  })
  .match(_.expr($.and([
    $.eq([event.sno, '$sno']),
    $.eq([1, '$approveState']),
  ])))
  .end()
}

//查询已经驳回的请假申请
async function getLeave2_c(event, context) {
  return await db.collection('leave')
  .aggregate()
  .lookup(
    {
      from: 'teaInfo',
      let: {
        // leave_sno: '$sno',
        leave_ano: '$ano',
        // leave_approve: '$approveState',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          //$.eq(['E19301222', '$$leave_sno']),
          $.eq(['$tno', '$$leave_ano']),
          //$.eq([0, '$$leave_approve']),
          //$.eq(['计算机科学与技术学院', '$sacademy'])
        ])))
        .project({
          _id: 0,
          _openid: 0,
          tno: 0,
          tacademy:0,
        })
        .done(),
      as: 'teaInfo',
    }
  )
  .replaceRoot({
    newRoot: $.mergeObjects([$.arrayElemAt(['$teaInfo', 0]), '$$ROOT'])
  })
  .project({
    teaInfo: 0
  })
  .match(_.expr($.and([
    $.eq([event.sno, '$sno']),
    $.eq([-1, '$approveState']),//已驳回的请假单
  ])))
  .end()
}