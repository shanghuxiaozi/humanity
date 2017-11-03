/*
 * 灌水
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


/*通过分页查询分享数据*/
router.get('/queryByPage', function (req, res, next) {//
		if(!req.query.pageSize||req.query.pageSize==""){
			req.query.pageSize = 10;
		}
		if(!req.query.pageNum||req.query.pageNum==""){
			req.query.pageNum = 0;
		}	
			var countSql = 'SELECT COUNT(*) FROM irrigation';//获取数据总条数
			//
			dbHelper.list(countSql, function (data, res) {
				var totalPage = 0;
				if(data && data.length>0)
				totalPage = data[0]['COUNT(*)'];
				var sql = 'select * from irrigation where if_pass=1 limit '+ req.query.pageNum +','+req.query.pageSize*(req.query.pageNum+1);
				console.log('灌水数据总条数=',data,'------查询灌水数据----');
				console.log('sql=',sql);
				//通过景点id查询
				dbHelper.list(sql, function (list, res) {
					
					res.send({code:200,msg:'查询成功', data:list, totalPage:totalPage});
				}, res);
				
			}, res);
});


/*查询灌水类型*/
router.get('/queryType', function (req, res, next) {//
	var sql = 'select * from irrigation_type ';
	console.log('------查询灌水类型----');
	console.log('sql=',sql);
	//通过景点id查询
	dbHelper.list(sql, function (data, res) {
		res.send({code:200,msg:'查询成功', data:data});
	}, res);
});


/*发布灌水*/
router.post('/publish',function(req, res, next){
	console.log('------发布灌水数据----');
	if(req.session.user){
		var sql = 'insert into irrigation(user_id,user_name,publish_content,publish_time,point_number,type_id) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.publish_content+'","'+req.body.publish_time+'",0,"'+req.body.type_id+'")';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'发布成功'});
		}, res);
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});


/*查询灌水点赞数据*/
router.get('/queryThumbsUp', function (req, res, next) {
	if(!req.query.pageSize||req.query.pageSize==""){
		req.query.pageSize = 10;
	}
	if(!req.query.pageNum||req.query.pageNum==""){
		req.query.pageNum = 0;
	}
	var countSql = 'SELECT COUNT(*) FROM irrigation_spot where gs_id='+req.query.gs_id;//获取当前说说id总条数
	dbHelper.list(countSql, function (data, res) {
		var totalPage = 0;
		if(data && data.length>0)
		totalPage = data[0]['COUNT(*)'];
		var sql = 'select * from irrigation_spot where gs_id=' + req.query.gs_id+ ' limit '+ req.query.pageNum + ',' + req.query.pageSize*(req.query.pageNum+1);
		console.log('朋友圈点赞数据总条数=',data,'------查询朋友圈点赞数据----');
		console.log('sql=',sql);
		//通过景点id查询
		dbHelper.list(sql, function (list, res) {
			
			res.send({code:200,msg:'查询成功', data:list, totalPage:totalPage});
		}, res);
		
	}, res);
	
});

/*查询自己灌水点赞数据通过gs_id,user_id*/
router.get('/queryThumbsUpByMyself', function (req, res, next) {
	if(req.session.user && !isNaN(req.query.say_id)){
		var sql = 'select * from irrigation_spot where gs_id=' + req.query.say_id+ ' and user_id=' + req.session.user.id ;
		console.log('查询自己点赞灌水','sql=',sql);
		dbHelper.list(sql, function (data, res) {
			res.send({code:200,msg:'查询成功', data:data});
		}, res);
	}else{
		res.send({code:330,msg:'未登录查询不到自己点赞的信息'});
	}
});

/*灌水点赞*/
router.post('/thumbsUp',function(req, res, next){
	console.log('------灌水点赞----');
	if(req.session.user){
		var sql = 'insert into irrigation_spot(user_id,user_name,create_date,if_spot,gs_id) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.create_date+'",'+req.body.if_spot+','+req.body.gs_id +')';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'点赞成功',data:{gs_id:req.body.gs_id}});
		}, res);
		
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});

/*灌水更新点赞*/
router.post('/upDateThumbsUp',function(req, res, next){
	console.log('------灌水点赞----');
	if(req.session.user){
		var sql = 'update irrigation_spot set if_spot = '+req.body.if_spot+' where id='+req.body.id;
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'更新点赞',data:{id:req.body.id}});
		}, res);
		
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});


/*查询灌水评论数据*/
router.get('/queryComment', function (req, res, next) {
	if(!req.query.pageSize||req.query.pageSize==""){
		req.query.pageSize = 10;
	}
	if(!req.query.pageNum||req.query.pageNum==""){
		req.query.pageNum = 0;
	}
	var countSql = 'SELECT COUNT(*) FROM irrigation_comment where gs_id='+req.query.gs_id;//获取当前说说id总条数
	dbHelper.list(countSql, function (data, res) {
		var totalPage = 0;
		if(data && data.length>0)
		totalPage = data[0]['COUNT(*)'];
		var sql = 'select * from irrigation_comment where gs_id=' + req.query.gs_id+ ' limit '+ req.query.pageNum + ',' + req.query.pageSize*(req.query.pageNum+1);
		console.log('灌水评论数据总条数=',data,'------查询灌水评论数据----');
		console.log('sql=',sql);
		//通过景点id查询
		dbHelper.list(sql, function (list, res) {
			
			res.send({code:200,msg:'查询成功', data:list, totalPage:totalPage});
		}, res);
		
	}, res);
	
});

/*发送评论*/
router.post('/sendComment',function(req, res, next){
	console.log('------发送评论----');
	if(req.session.user){
		var sql = 'insert into irrigation_comment(user_id,user_name,create_date,comment_content,gs_id,to_name) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.create_date+'","'+req.body.comment_content+'",'+req.body.gs_id +',"'+req.body.to_name+'")';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'发送成功',data:{gs_id:req.body.gs_id}});
		}, res);
		
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});


var callback = function (data, res) {
   // res.render('list', {listData: data});
    // 第一个参数：模板名称对应list.ejs，第二个是参数名和数据

    console.log('success');
	res.send(data);
};

module.exports = router;
