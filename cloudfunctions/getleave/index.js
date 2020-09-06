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
  let leave = await db.collection("leave")
    .where({
      'approveState': 0
    })
    .get()

  //console.log('leave = ',leave)
  for (let item of leave.data) {
    let leave_sno = item.sno
    //console.log('leave_sno = ',leave_sno)
    let stu_info = await db.collection("stuInfo")
      .where({
        sno: leave_sno
      })
      .get()
    //console.log('stu_info = ',stu_info)
    item['sname'] = stu_info.data[0].sname
    item['sacademy'] = stu_info.data[0].sacademy

  }
  //console.log(leave.data)
  return leave
}

//查询学生的未审批请假单
async function getLeave2_a(event, context) {
  console.log('get sno')
  let sno
  await getSno()
  .then(res=>{
    // console.log('res = ',res)
    sno = res.data[0].sno
  })
  .catch(err=>{
    // console.log(err)
    return err
  })

  console.log('sno = ',sno)
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
  .then(res=>{
    // console.log('res = ',res)
    sno = res.data[0].sno
  })
  .catch(err=>{
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
  .then(res=>{
    // console.log('res = ',res)
    sno = res.data[0].sno
  })
  .catch(err=>{
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