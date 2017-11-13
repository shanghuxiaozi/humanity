var express = require('express');
var router = express.Router();
var dbHelper = require('./dbqs');
var socket_io = require('socket.io');
// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
	/*res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "x-requested-with");
    res.header('Access-Control-Allow-Headers', 'content-type');*/
  console.log('Time: ', (new Date()).Format('yyyy-MM-dd HH:mm:ss'));
  next();
});
 
//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = {};
 
//按用户的userid保存生成的socket
var users = {};
router.prepareSocketIO = function (server) {
	console.log("-----------------群聊---------------");
	 var io = socket_io(server);
	io.on('connection', function(socket){
    console.log('a user connected');
     
    //监听新用户加入
    socket.on('login', function(obj){
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.userid;
        socket.groupid = obj.groupid;
        users[obj.userid] = socket;//保存当前用户的socket,还是放到外面
        var isSame = false;//判断是否是同一个人登录
        if(onlineUsers[obj.groupid]){
        	for(var key in onlineUsers[obj.groupid]){
        		if(onlineUsers[obj.groupid][key] == obj.username&&key==obj.userid){
        			isSame = true;
        			break;
        		}
        	}
        }
        if(isSame){
        	console.log(obj.username+'已经加入了聊天室');
        }else{
        	 //检查在线列表，如果不在里面就加入
	        if(!onlineUsers[obj.groupid])onlineUsers[obj.groupid]={};
	        if(!onlineCount[obj.groupid])onlineCount[obj.groupid]=0;
	        if(!onlineUsers[obj.groupid].hasOwnProperty(obj.userid)) {
	            onlineUsers[obj.groupid][obj.userid] = obj.username;
	            
	            
	            
	            //在线人数+1
	            onlineCount[obj.groupid]++;
	        }
	         
	        //向所有客户端广播用户加入
	        io.emit('login'+obj.groupid, {onlineUsers:onlineUsers[obj.groupid], onlineCount:onlineCount[obj.groupid], user:obj});
	        console.log(obj.username+'加入了聊天室');
        }
       
    });
     
    //监听用户退出
    socket.on('disconnect', function(){
        //将退出的用户从在线列表中删除
        if(onlineUsers[socket.groupid]&&onlineUsers[socket.groupid].hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = {userid:socket.name, username:onlineUsers[socket.groupid][socket.name]};
             
            //删除
            delete onlineUsers[socket.groupid][socket.name];
            //在线人数-1
            onlineCount[socket.groupid]--;
             
            //向所有客户端广播用户退出
            io.emit('logout'+socket.groupid, {onlineUsers:onlineUsers[socket.groupid], onlineCount:onlineCount[socket.groupid], user:obj});
            console.log(obj.username+'退出了聊天室');
        }
    });
     
    //监听用户发布聊天内容
    socket.on('message', function(obj){
        //向所有客户端广播发布的消息
        io.emit('message'+obj.groupid, obj);
       // console.log(obj.username+'说：'+obj.content);
    });
   
});
}

//http.listen(3000, function(){
//  console.log('listening on *:3000');
//});

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