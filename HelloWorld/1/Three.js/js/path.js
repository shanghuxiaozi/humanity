var JS_PATH="http://120.25.221.94:8080";//本项目所有ajax，域名配置
//调用ajax方法
var humanAjax = function(url,obj){
	mui.ajax(url,{
					data:obj.data,
					crossDomain :obj.crossDomain,
					dataType:obj.dataType,//服务器返回json格式数据
					type:obj.type,//HTTP请求类型
					success:function(data){
						if(data.code == 332){
							mui.openWindow('login.html');
						}else
						obj.success(data);
						
					},error:function(e){
						obj.error(e);
					}
				});
}


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