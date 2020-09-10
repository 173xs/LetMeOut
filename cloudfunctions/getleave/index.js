// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

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

//通过openid查学号
async function getSno() {
  const wxContext = cloud.getWXContext()

  return await db.collection("stuInfo")
    .where({
      _openid: wxContext.OPENID,
    })
    .field({
      sno: true,
    })
    .get()
}
//老师审批请假单的查询函数
async function getLeave1_a(event, context) {
  console.log('condition = ', event.condition)
  const $ = _.aggregate
  let wxContext = cloud.getWXContext()
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

  console.log('tacademy = ',academy)
  let leave = await db.collection('leave')
  .aggregate()
  .lookup(
    {
      from: 'stuInfo',
      let: {
        leave_sno: '$sno',
        leave_approve: '$approveState',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$sno', '$$leave_sno']),
          $.eq([0, '$$leave_approve']),
          $.eq([academy, '$sacademy'])
        ])))
        .project({
          _id: 0,
          _openid: 0,
        })
        .done(),
      as: 'stuInfo',
    }
  )
  .match({
    'approveState': 0
  })
  .limit(event.condition.limit)
  .skip(event.condition.skip)
  .end()

  console.log('leave = ',leave)
  return leave
}

//查询学生的未审批请假单
async function getLeave2_a(event, context) {
  console.log('get sno')
  let sno
  await getSno()
    .then(res => {
      // console.log('res = ',res)
      sno = res.data[0].sno
    })
    .catch(err => {
      // console.log(err)
      return err
    })

  console.log('sno = ', sno)
  return await db.collection("leave")
    .where(_.and([{
        'approveState': _.eq(0)
      },
      {
        'sno': _.eq(sno)
      }
    ]))
    .get()
}

//查询已通过审批请假单
async function getLeave2_b(event, context) {
  let sno
  await getSno()
    .then(res => {
      // console.log('res = ',res)
      sno = res.data[0].sno
    })
    .catch(err => {
      // console.log(err)
      return err
    })

  return await db.collection("leave")
    .where(_.and([{
        'approveState': _.eq(1) //已经通过审批
      },
      {
        'sno': _.eq(sno)
      },
      {
        'checkState': _.eq(0) //通过审批但是没有使用
      }
    ]))
    .get()
}

//查询已经驳回的请假申请
async function getLeave2_c(event, context) {
  let sno
  await getSno()
    .then(res => {
      // console.log('res = ',res)
      sno = res.data[0].sno
    })
    .catch(err => {
      // console.log(err)
      return err
    })

  return await db.collection("leave")
    .where(_.and([{
        'approveState': _.eq(-1) //驳回的请假单
      },
      {
        'sno': _.eq(sno)
      }
    ]))
    .get()
}