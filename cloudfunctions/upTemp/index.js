// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

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

  return await db.collection('temperature')
  .add({
    data: [
      {
        sno: sno,
        temperature: event.temperature,
        date: event.date,
        timeFlag: event.timeFlag
      }
    ]
  })
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