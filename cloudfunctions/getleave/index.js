// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // var leaveList
  //var stuInfoList
  const $ = db.command.aggregate
  await db.collection("leave")
    .aggregate()
    .lookup({
      from: 'stuInfo',
      let:{
        leave_sno: 'sno',
        leave_approveState: 'approveState',
        notApprove: 0
      },
      pipeline: $.pipeline()
      // .match({
      //   '$$leave_approveState': 0
      // })
      .match(
        _.expr($.and([
        //$.eq(['$sno','$$leave_sno']),
        $.eq(['$$notApprove','$$leave_approveState'])
      ])))
      .done(),
      as: 'stuInfo',
    })
    .end()
    .then(res => {
      console.log('res = ',res.list)
      return res
      // leaveList = res.data
    })
    .catch(err => {
      return err
    })

  // var snoArr = new Array()
  // for (var i = 0; i < leaveList.length;i++){
  //   snoArr.push(leaveList[i].sno)
  // }

  // await db.collection("stuInfo")
  // .where({
  //   sno:_.in(snoArr)
  // })
  // .get()
  // .then(res=>{
  //   stuInfoList = res.data
  //   console.log('stuinfolist = ', stuInfoList)
  // })

  // for (var i = 0;i < leaveList;i++){
  //   leaveList[i].sno = stuInfoList[i].sno
  //   leaveList[i].sname = stuInfoList[i].sname
  //   leaveList[i].sacademy = stuInfoList[i].sacademy
  // }
  // return  leaveList
}