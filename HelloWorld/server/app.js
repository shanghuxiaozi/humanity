var express = require('express');

//查询景点信息
var list = require('./list');
//用户登录注册
var user = require('./user');
//上传图片
var upload = require('./upload');
//活动
var activity = require('./activity');

//足迹
var foot = require('./foot');

//朋友圈分享
var friends = require('./friends');

//结伴
var companion = require('./companion');

//灌水
var irrigation = require('./irrigation');
//聊天
var chat = require('./chat');

var spitslot = require('./spitslot');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded());
//定义静态资源路径为(文件夹)：
app.use(express.static('1/Three.js/'));
//app.use(express.bodyParser());
app.use(session({
  secret: '12345',
  name: 'name',
  cookie: {maxAge: 600000},
  resave: false,
  saveUninitialized: true,
}));
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.get('/index', function(req,res){
	console.log("==进入首页==");
	res.sendfile("1/Three.js/schedule/schedule.html");
});

app.get('/earth', function(req,res){
	console.log("==进入地球==");
	res.sendfile("1/Three.js/Earth-Elevations.html");
});

 


var server = app.listen(8080, function () {
var host = server.address().address;
var port = server.address().port;
chat.prepareSocketIO(server);
console.log('Example app listening at http://%s:%s', host, port);
});
//var http = require('http').Server(app);
//var server = http.createServer(app);
app.ready=function(server){
  chat.prepareSocketIO(server);
};
app.use('/list',list);
app.use('/user',user);
app.use('/spitslot',spitslot);
app.use('/upload',upload);
app.use('/activity',activity);
app.use('/foot',foot);
app.use('/friends',friends);
app.use('/companion',companion);
app.use('/irrigation',irrigation);
app.use('/chat',chat);



//http.listen(8080, function(){
//  console.log('listening on *:8080');
//});