var express = require('express');
var http = require('http');
var cheerio = require('cheerio');
var pageUrl = 'http://shixi.info/';
var router = express.Router();






/*百度识别*/
router.post('/identify',function(req, res, next){
	console.log('------开始识别图片----');
	if(req.body.content){
			http.get(req.body.url, function(res_bai) {
			    var html = '';
			    res_bai.on('data', function(data) {
			        html += data;
			    });
			    res_bai.on('end', function() {
			        //数据获取完，执行回调函数
			        callback_bai(html);
			    });
			});
			
			function callback_bai(html) {
			    //使用load方法，参数是刚才获取的html源代码数据
			    var $ = cheerio.load(html);
			    var arrUrl = [];
			    console.log('百度识别=',html);
			    //写法和jQuery一模一样，有没有觉得很cool
//			    $('article').each(function(index, element) {
//			        var href = $(element).find('.entry-title a').attr('href');
//			        arrUrl.push(href);
//			    });
			    res.send({code:200,msg:'识别成功',data:$('body').html()});
			}
			
		
	}else{
		res.send({code:401,msg:'失败'});
	}
});

/*百度相似识别*/
router.post('/similar',function(req, res, next){
	console.log('------开始识别相似图片----');
	if(req.body.content){
			http.get(req.body.url, function(res_bai) {
			    var html = '';
			    res_bai.on('data', function(data) {
			        html += data;
			    });
			    res_bai.on('end', function() {
			        //数据获取完，执行回调函数
			        callback_bai(html);
			    });
			});
			
			function callback_bai(html) {
			    res.send({code:200,msg:'识别成功',html});
			}
			
		
	}else{
		res.send({code:401,msg:'失败'});
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