var JS_PATH="http://120.25.221.94:8080";//本项目所有ajax，域名配置
//调用ajax方法
var humanAjax = function(url,obj){
	mui.ajax(url,{
					data:obj.data,
					crossDomain :obj.crossDomain,
					dataType:obj.dataType,//服务器返回json格式数据
					type:obj.type,//HTTP请求类型
					success:function(data){
						obj.success(data);
						
					},error:function(e){
						obj.error(e);
					}
				});
}
