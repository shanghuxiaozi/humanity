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

/*查询分享数据*/
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



var callback = function (data, res) {
   // res.render('list', {listData: data});
    // 第一个参数：模板名称对应list.ejs，第二个是参数名和数据

    console.log('success');
	res.send(data);
};

module.exports = router;