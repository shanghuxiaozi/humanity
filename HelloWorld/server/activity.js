/**
*活动的路线id
*/
var express = require('express');
var dbHelper = require('./dbqs');
var http = require('http');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
	/*res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "x-requested-with");
    res.header('Access-Control-Allow-Headers', 'content-type');*/
  console.log('Time: ', Date.now());
  next();
});


/*获取所有活动*/
router.get('/queryAll', function (req, res, next) {
	console.log("获取所有活动");
	dbHelper.list('select * from  activity', callback, res);
});

/*获取最近的20个活动*/
router.get('/queryRecentActivity', function (req, res, next) {
	console.log("获取最近的20个活动");
	dbHelper.list('select * from  activity limit 0,20', callback, res);
});

/*根据活动id查询活动路线*/
router.get('/queryRouter', function (req, res, next) {
	console.log("根据活动id查询活动路线",req.query.id);
	dbHelper.list('select * from  activity_route where activity_id='+req.query.id, callback, res);
});

var callback = function (data, res) {
   // res.render('list', {listData: data});
    // 第一个参数：模板名称对应list.ejs，第二个是参数名和数据

    console.log('success');
	res.send(data);
};

module.exports = router;