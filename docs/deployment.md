## 部署教程

1. 下载源码

   使用git工具下载源码
   
   ```shell
   git clone git@github.com:173xs/LetMeOut.git
   ````

2. 导入开发者工具

   导入时填入自己的`AppID`。创建一个新的云开发环境，设置`cloudfunctions`的环境为新创建的环境。`app.js`的`cloud.init`设置`env`为刚刚创建的环境ID。

3. 配置云函数和数据库

   上传部署`cloudfunctions`中所有的云函数。云开发控制台数据库新建以下集合：`abnormal`、`buildings`、`leave`、`msgList`、`stuInfo`、`teaInfo`、`temperature`和`travelRecords`，并将所有数据库的数据权限改为所有用户可读，仅创建者可读写。

   `buildings`集合里面导入`data`文件夹中`buildings.json`中的数据。

   `temperature`集合里面导入`data`文件夹中`temperature.json`中的数据。

4. 编译使用