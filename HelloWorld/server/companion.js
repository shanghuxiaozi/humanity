/*
 * 结伴
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
  console.log('Time: ', (new Date()).Format('yyyy-MM-dd HH:mm:ss'));
  next();
});


/*通过分页查询结伴数据*/
router.get('/queryByPage', function (req, res, next) {//
		if(!req.query.pageSize||req.query.pageSize==""){
			req.query.pageSize = 10;
		}
		if(!req.query.pageNum||req.query.pageNum==""){
			req.query.pageNum = 0;
		}	
			var countSql = 'SELECT COUNT(*) FROM travel_company';//获取数据总条数
			//
			dbHelper.list(countSql, function (data, res) {
				var totalPage = 0;
				if(data && data.length>0)
				totalPage = data[0]['COUNT(*)'];
				var sql = 'select * from travel_company where state=1 limit '+ req.query.pageSize*req.query.pageNum +','+req.query.pageSize;
				console.log('结伴数据总条数=',data,'------查询结伴数据----');
				console.log('sql=',sql);
				//通过景点id查询
				dbHelper.list(sql, function (list, res) {
					
					res.send({code:200,msg:'查询成功', data:list, totalPage:totalPage});
				}, res);
				
			}, res);
});

/*结伴数据发布*/
router.post('/publish',function(req, res, next){
	console.log('------添加结伴数据----');
	if(req.session.user){
		
		
		var sql = 'insert into travel_company(user_id,user_name,tc_content,push_time,tc_time,destination,start_time,tc_number,location,tc_require) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.tc_content+'","'+req.body.push_time+'","'+req.body.tc_time+'","'+req.body.destination+'","'
			+req.body.start_time+'",'+req.body.tc_number+',"'+req.body.tc_location+'","'+req.body.tc_require+'")';
			
		if(req.body.group_id)
		{
			sql = 'insert into travel_company(user_id,user_name,tc_content,push_time,tc_time,destination,start_time,tc_number,location,tc_require,group_id) values('
			+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.tc_content+'","'+req.body.push_time+'","'+req.body.tc_time+'","'+req.body.destination+'","'
			+req.body.start_time+'",'+req.body.tc_number+',"'+req.body.tc_location+'","'+req.body.tc_require+'","'+req.body.group_id+'")';
		}
			
		
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'发布成功'});
		}, res);
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});


/*创建群组*/
router.post('/group',function(req, res, next){
	console.log('------创建群组----');
	if(req.session.user){
		var sql = 'insert into strategy_group(user_id,user_name,name,state,type,create_date) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.name+'",'+req.body.state+','+req.body.type+',"'+req.body.create_date+'")';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			console.log('------创建群组成功----',data);
			res.send({code:200,msg:'创建成功',data:data});
		}, res);
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});


/*查询自己对应的结伴关注*/
router.get('/queryFollow',function(req, res, next){
	if(req.query.company_id && req.session.user ){
		
		var sql = 'select * from follow_company where company_id='+req.query.company_id +' and user_id = '+req.session.user.id;
		console.log('查询自己对应的结伴关注---sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			res.send({code:200,msg:'查询成功',data:data});
		}, res);
	}else{
		res.send({code:400,msg:''});
	}
	
});

/*结伴关注*/
router.post('/follow',function(req, res, next){
	console.log('------关注结伴----');
	if(req.session.user){
		var sql = 'insert into follow_company(user_id,user_name,company_id,status) values('
		+req.session.user.id+',"'+req.session.user.nickname+'",'
			+req.body.company_id+','+req.body.status+')';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			console.log('------关注结伴成功----',data);
			res.send({code:200,msg:'关注结伴',data:{company_id:req.body.company_id}});
		}, res);
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});

/*删除结伴关注*/
router.post('/deleteFollow',function(req, res, next){
	console.log('------关注结伴----');
	if(req.session.user){
		var sql = 'delete from follow_company where user_id = '+req.session.user.id +' and company_id=' +req.body.company_id;
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			console.log('------删除关注结伴----',data);
			res.send({code:200,msg:'删除关注结伴',data:{company_id:req.body.company_id}});
		}, res);
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});

/*查询结伴评论数据*/
router.get('/queryComment', function (req, res, next) {
	if(!req.query.pageSize||req.query.pageSize==""){
		req.query.pageSize = 10;
	}
	if(!req.query.pageNum||req.query.pageNum==""){
		req.query.pageNum = 0;
	}
	var countSql = 'SELECT COUNT(*) FROM travel_company_comment where jb_id='+req.query.jb_id;//获取当前说说id总条数
	dbHelper.list(countSql, function (data, res) {
		var totalPage = 0;
		if(data && data.length>0)
		totalPage = data[0]['COUNT(*)'];
		var sql = 'select * from travel_company_comment where jb_id=' + req.query.jb_id+ ' limit '+ req.query.pageSize*req.query.pageNum + ',' + req.query.pageSize;
		console.log('结伴评论数据总条数=',data,'------查询结伴评论数据----');
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
		var sql = 'insert into travel_company_comment(user_id,user_name,create_date,comment_content,jb_id,to_name) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.create_date+'","'+req.body.comment_content+'",'+req.body.jb_id +',"'+req.body.to_name+'")';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'发送成功',data:{jb_id:req.body.jb_id}});
		}, res);
		
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});

/*发送私信*/
router.post('/sendLetter',function(req, res, next){
	console.log('------发送私信----');
	if(req.session.user){
		var sql = 'insert into travel_private_letter(user_id,user_name,create_date,comment_content,jb_id,to_name) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.create_date+'","'+req.body.comment_content+'",'+req.body.jb_id +',"'+req.body.to_name+'")';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'发送成功',data:{jb_id:req.body.jb_id}});
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

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
        "H+" : this.getHours(), //小时     
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = router;