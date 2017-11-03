var express = require('express');
var dbHelper = require('./dbqs');
var http = require('http');
var router = express.Router();
//导入加密模块
var crypto = require("crypto");

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
	/*res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "x-requested-with");
    res.header('Access-Control-Allow-Headers', 'content-type');*/
  console.log('Time: ', Date.now());
  next();
});

/*判断是否登录*/
router.post('/isLogin', function (req, res, next) {
	if(req.session.user){
		res.send({code:200,msg:'登录成功',data:req.session.user});
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});
/*注册*/
router.post('/register', function (req, res, next) {//
    	console.log('------register-----');
		console.log(req.body);
		var name = req.body.username;
		var password = req.body.password;
		var md5 = crypto.createHash("md5");
		var newPas = md5.update(password).digest("hex");
		dbHelper.list('select * from app_user where account="'+name+'" ', function (data, res) {
			if(data.length>0){
				data = data[0];
			}
			console.log(data.password, newPas,'----',data);
		if(data.account&&data.account == name){
			data.isRegister = false;
			res.send(data);
		}else{
			data = new Object();
			data.isRegister = true;
			dbHelper.list('INSERT INTO app_user(account,login_type,openid,password) VALUES ("'+name+'",0,1,"'+newPas+'")', function(datas, ress){
				console.log(name+"注册成功：",datas);
				req.session.user = datas;
				ress.send(datas);
			}, res);
		}
		
	}, res);
	
    // list参数，第一个是whereSql查询条件，json格式；第二个是表名，第三个是回调函数，第四个是express返回客户端的response类
});

/*登录*/
router.post('/login', function (req, res, next) {//
    	console.log('------login-----');
		console.log(req.body);
		var name = req.body.username;
		var password = req.body.password;
		var md5 = crypto.createHash("md5");
		var newPas = md5.update(password).digest("hex");
		dbHelper.list('select * from app_user where account="'+name+'" ', function (data, res) {
		if(data.length>0){
				data = data[0];
			}
		if(data.length<1){
			data.isLogin = 3;//账户名错误
		}else if(data.password&&data.password == newPas){
			data.isLogin = 1;//登录成功
			req.session.user = data;
		}else{
			data.isLogin = 2;//登录失败
		}
		res.send(data);
	}, res);
    // list参数，第一个是whereSql查询条件，json格式；第二个是表名，第三个是回调函数，第四个是express返回客户端的response类
});


/*更新*/
router.post('/update', function (req, res, next) {//
    	console.log('------更新用户-----');
		console.log(req.body);
		var name = req.body.nickname;
		var sql = 'update  app_user set headimg = "'+req.body.headimg+'" ,  nickname = "'+name+'" where id="'+req.body.id+'" ';
		console.log('sql=',sql);
		dbHelper.list(sql, function (data, res) {
		
		res.send({code:200,msg:'更新成功',data:data});
	}, res);
    // list参数，第一个是whereSql查询条件，json格式；第二个是表名，第三个是回调函数，第四个是express返回客户端的response类
});

/*插入足迹*/
router.post('/insertFoot', function (req, res, next) {//
    	console.log('------插入足迹-----');
	if(req.session.user){
		var sql = 'insert into footprint(user_id,user_name,create_date,longitude,latitude,name) values('
		+req.session.user.id+',"'+req.session.user.nickname+'","'
			+req.body.create_date+'",'+req.body.longitude+','+req.body.latitude +',"'+req.body.name+'")';
		console.log('sql=',sql);
		dbHelper.list( sql
		, function (data, res) {
			
			res.send({code:200,msg:'插入成功',data:data});
		}, res);
		
	}else{
		res.send({code:332,msg:'请您登录'});
	}
});

/*查询自己足迹通过gs_id,user_id*/
router.get('/queryFoot', function (req, res, next) {
	if(req.session.user ){
		var sql = 'select * from footprint where  user_id=' + req.session.user.id ;
		console.log('查询自己点赞灌水','sql=',sql);
		dbHelper.list(sql, function (data, res) {
			res.send({code:200,msg:'查询成功', data:data});
		}, res);
	}else{
		res.send({code:330,msg:'未登录查询不到自己足迹的信息'});
	}
});



var callback = function (data, res) {
   // res.render('list', {listData: data});
    // 第一个参数：模板名称对应list.ejs，第二个是参数名和数据

    console.log('success');
	res.send(data);
};

module.exports = router;