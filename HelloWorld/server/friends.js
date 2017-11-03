/*
 * 朋友圈分享
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
			var countSql = 'SELECT COUNT(*) FROM say_say';//获取数据总条数
			//
			dbHelper.list(countSql, function (data, res) {
				var totalPage = 0;
				if(data && data.length>0)
				totalPage = data[0]['COUNT(*)'];
				var sql = 'select * from say_say where if_pass=1 limit '+ req.query.pageNum +','+req.query.pageSize*(req.query.pageNum+1);
				console.log('分享数据总条数=',data,'------查询分享数据----');
				console.log('sql=',sql);
				//通过景点id查询
				dbHelper.list(sql, function (list, res) {
					
					res.send({code:200,msg:'查询成功', data:list, totalPage:totalPage});
				}, res);
				
			}, res);
});

/*朋友圈分享数据*/
router.post('/publish',function(req, res, next){
	console.log('------添加朋友圈分享数据----');
	if(req.session.user){
		var sql = 'insert into say_say(user_id,user_name,publish_content,publish_time,point_number) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.publish_content+'","'+req.body.publish_time+'",0)';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'分享成功'});
		}, res);
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});


/*查询朋友圈点赞数据*/
router.get('/queryThumbsUp', function (req, res, next) {
	if(!req.query.pageSize||req.query.pageSize==""){
		req.query.pageSize = 10;
	}
	if(!req.query.pageNum||req.query.pageNum==""){
		req.query.pageNum = 0;
	}
	var countSql = 'SELECT COUNT(*) FROM say_say_spot where say_id='+req.query.say_id;//获取当前说说id总条数
	dbHelper.list(countSql, function (data, res) {
		var totalPage = 0;
		if(data && data.length>0)
		totalPage = data[0]['COUNT(*)'];
		var sql = 'select * from say_say_spot where say_id=' + req.query.say_id+ ' limit '+ req.query.pageNum + ',' + req.query.pageSize*(req.query.pageNum+1);
		console.log('朋友圈点赞数据总条数=',data,'------查询朋友圈点赞数据----');
		console.log('sql=',sql);
		//通过景点id查询
		dbHelper.list(sql, function (list, res) {
			
			res.send({code:200,msg:'查询成功', data:list, totalPage:totalPage});
		}, res);
		
	}, res);
	
	
	
});


/*查询自己点赞朋友圈点赞数据通过say_id,user_id*/
router.get('/queryThumbsUpByMyself', function (req, res, next) {
	if(req.session.user && !isNaN(req.query.say_id)){
		var sql = 'select * from say_say_spot where say_id=' + req.query.say_id+ ' and user_id=' + req.session.user.id ;
		console.log('查询自己点赞朋友圈','sql=',sql);
		dbHelper.list(sql, function (data, res) {
			res.send({code:200,msg:'查询成功', data:data});
		}, res);
	}else{
		res.send({code:330,msg:'未登录查询不到自己点赞的信息'});
	}
});


/*朋友圈点赞*/
router.post('/thumbsUp',function(req, res, next){
	console.log('------朋友圈点赞----');
	if(req.session.user){
		var sql = 'insert into say_say_spot(user_id,user_name,create_date,if_spot,say_id) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.create_date+'",'+req.body.if_spot+','+req.body.say_id +')';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'点赞成功',data:{say_id:req.body.say_id}});
		}, res);
		
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});

/*朋友圈更新点赞*/
router.post('/upDateThumbsUp',function(req, res, next){
	console.log('------朋友圈点赞----');
	if(req.session.user){
		var sql = 'update say_say_spot set if_spot = '+req.body.if_spot+' where id='+req.body.id;
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'更新点赞',data:{id:req.body.id}});
		}, res);
		
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});

/*查询说说评论数据*/
router.get('/queryComment', function (req, res, next) {
	if(!req.query.pageSize||req.query.pageSize==""){
		req.query.pageSize = 10;
	}
	if(!req.query.pageNum||req.query.pageNum==""){
		req.query.pageNum = 0;
	}
	if(!req.query.say_id ||req.query.say_id == "" ){
		console.log('说说id为空');
		res.send({code:400,msg:'说说id为空'});
	}else{
		var countSql = 'SELECT COUNT(*) FROM say_say_comment where say_id='+req.query.say_id;//获取当前说说id总条数
		dbHelper.list(countSql, function (data, res) {
			var totalPage = 0;
			if(data && data.length>0)
			totalPage = data[0]['COUNT(*)'];
			var sql = 'select * from say_say_comment where say_id=' + req.query.say_id+ ' limit '+ req.query.pageNum + ',' + req.query.pageSize*(req.query.pageNum+1);
			console.log('说说评论数据总条数=',data,'------查询说说评论数据----');
			console.log('sql=',sql);
			//通过景点id查询
			dbHelper.list(sql, function (list, res) {
				
				res.send({code:200,msg:'查询成功', data:list, totalPage:totalPage});
			}, res);
			
		}, res);
	}
	
	
	
	
});


/*发送评论*/
router.post('/sendComment',function(req, res, next){
	console.log('------发送评论----');
	if(req.session.user){
		var sql = 'insert into say_say_comment(user_id,user_name,create_date,comment_content,say_id,to_name) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.create_date+'","'+req.body.comment_content+'",'+req.body.say_id +',"'+req.body.to_name+'")';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'发送成功',data:{say_id:req.body.say_id}});
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