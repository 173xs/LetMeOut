// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate
// 云函数入口函数
exports.main = async (event, context) => {

  //先把学生自己的消息记录找出来
  let list = await db.collection('msgList')
    .where({
      sno: event.sno
    })
    .get()
  //console.log(list)
  let data = []
  //在把每条的详细信息找出来
  for (const item of list.data) {
    //console.log('item = ', item)

    foo = await db.collection('msgList')
      .aggregate()
      .lookup({
        from: item.type,
        let: {
          msg_id: '$id',
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$_id', '$$msg_id'])
          ])))
          .project({
            _id: 0,
            subDate: 0,
            reviewDate: 0,
            rno: 0,
            // leaveDate: 0,
            // leaveReason: 0,
            // returnDate: 0,
            ano: 0,
            sno: 0
          })
          .done(),
        as: 'info',
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$info', 0]), '$$ROOT'])
      })
      .project({
        info: 0
      })
      .match(_.expr($.and([
        $.eq([item.id, '$id']),
      ])))
      .end()
    let bar = {
      _id: foo.list[0]._id,
      type: foo.list[0].type,
      id: foo.list[0].id,
      time: foo.list[0].checkTime,
      tname: foo.list[0].tname,
    }
    let detail = {}
    if ('leave' == item.type) {
      detail = {
        leaveClass: foo.list[0].leaveClass,
        leaveDate: foo.list[0].leaveDate,
        returnDate: foo.list[0].returnDate,
        leaveReason: foo.list[0].leaveReason,
        approveState: foo.list[0].approveState,
        checkState: foo.list[0].checkState
      }
      // bar.title = foo.list[0].leaveClass +
      //   ':' +
      //   foo.list[0].leaveDate +
      //   '~' +
      //   foo.list[0].returnDate //请假类型:离校时间~返校时间
      // bar.checkState = foo.list[0].approveState
    } else {
      detail = {
        title: foo.list[0].title,
        //checkState: 1
      }
      // bar.title = foo.list[0].title
      // bar.checkState = 1
    }
    bar.detail = detail
    data.push(bar)
    //console.log('foo = ', foo)
  }
  return data
}