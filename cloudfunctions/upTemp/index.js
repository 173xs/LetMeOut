// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let tempRecord = await db.collection('temperature')
    .where(_.and([{
        sno: _.eq(event.sno),
      },
      {
        date: _.eq(event.date),
      }
    ]))
    .get()
  console.log(tempRecord)
  temperature = parseFloat(event.temperature)
  if (0 != tempRecord.data.length) {
    return await db.collection('temperature')
      .doc(tempRecord.data[0]._id)
      .update({
        data: {
          temperature: temperature,
        }
      })
  }
  return await db.collection('temperature')
    .add({
      data: [{
        sno: event.sno,
        temperature: temperature,
        date: event.date,
      }]
    })
}