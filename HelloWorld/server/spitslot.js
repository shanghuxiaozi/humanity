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

/*查询吐槽类型数据*/
router.post('/queryType', function (req, res, next) {//
    	console.log('------查询吐槽类型数据----');
		console.log(req.body);
		
		dbHelper.list('select * from spitslot_type', function (data, res) {
			res.send(data);
		}, res);
	
    // 第一个是whereSql查询条件，json格式；第二个是表名，第三个是回调函数，第四个是express返回客户端的response类
});
//'select * from spitslot_record as a join spitslot_type b join app_user c on b.id = a.type_id and a.user_id=c.id  and a.scenice_id=921
/*查询吐槽数据*/
router.get('/queryAll', function (req, res, next) {//
		if(!req.query.id||req.query.id==""){
			res.send({code:400,msg:'此景点id不存在'});
			return;
		}else{
			var sql = 'select a.id ,a.publish_content,a.point_number,a.publish_time,a.scenice_id, a.scenice_name,a.type_id,a.user_id,a.user_name ,b.name ,c.nickname,c.headimg,c.login_type,c.openid,c.account from spitslot_record as a join spitslot_type b join app_user c on b.id = a.type_id and a.user_id=c.id  and a.scenice_id='+req.query.id;
			console.log('------查询吐槽数据----');
			console.log('sql=',sql);
			//通过景点id查询
			dbHelper.list(sql, function (data, res) {
				
				res.send(data);
			}, res);
		}
    	
	
    
});

/*根据id查询吐槽数据*/
router.post('/queryTypeById', function (req, res, next) {//
    	console.log('------查询吐槽类型数据----');
		console.log(req.body);
		
		dbHelper.list('select * from spitslot_type where id='+req.body.id, function (data, res) {
			
			res.send(data);
		}, res);
	
});
//insert into spitslot_record( publish_content,publish_time,scenice_id,scenice_name,type_id,user_id,user_name ,point_number) values('who care you','2017-09-27 10:10:10',921,'香蜜湖',1,30,'sq',10)
/*提交吐槽数据*/
router.post('/add', function (req, res, next) {//
    	console.log('------提交吐槽数据----');
		console.log(req.session.user);
		if(req.session.user){
			if(!req.body.publish_content){
				res.send({code:400,msg:'发送内容为空'});
				return;
			}
			if(!req.body.publish_time){
				res.send({code:400,msg:'发送时间为空'});
				return;
			}
			if(!req.body.scenice_name){
				res.send({code:400,msg:'景点名称为空'});
				return;
			}
			
			var sql = 'insert into spitslot_record( publish_content,publish_time,scenice_id,scenice_name,type_id,user_id,user_name ,point_number) values( "'
			+req.body.publish_content+'","'+req.body.publish_time+'",'+req.body.scenice_id+',"'+req.body.scenice_name+'",'+req.body.type_id+','+req.session.user.id+',"'+req.session.user.nickname+'",'+0+' ) ';
			console.log('sql=',sql);
			dbHelper.list( sql
			, function (data, res) {
				
				res.send({code:200,msg:'提交成功'});
			}, res);
		}else{
				res.send({code:332,msg:'请您登录'});
		}
		
	
});


/*点赞吐槽数据*/
router.post('/thumbsUp', function (req, res, next) {//
    	console.log('------点赞吐槽数据----');
		console.log(req.session.user);
		
		if(req.session.user){
			console.log(typeof req.body.point_number,typeof req.body.point_number == 'number')
			//if( typeof req.body.point_number == 'number' ){
				var sql = 'update spitslot_record set point_number = '+parseInt(req.body.point_number)+' where id='+req.body.id;
				console.log('sql=',sql);
				dbHelper.list( sql
				, function (data, res) {
					
					res.send({code:200,msg:'点赞成功'});
				}, res);
			//}else{
			//	res.send({code:500,msg:'接口需要的参数point_number必输是int类型'})
			//}
			
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