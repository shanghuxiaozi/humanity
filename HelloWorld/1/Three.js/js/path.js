var JS_PATH="http://120.25.221.94:8080";//本项目所有ajax，域名配置
/**
 * 调用ajax方法
 * @param {Object} url 请求的路径
 * @param {Object} obj 请求参数，函数
 * @param {Object} isLoading 是否启用遮罩动画效果
 */
var humanAjax = function(url,obj,isLoading,content){
	var enIndex  = -1;
	if(isLoading){
		//loading效果
				enIndex = layer.open({
							    type: 2
							    ,content: content||'登录中...'
							  });
	}
	
	mui.ajax(url,{
					data:obj.data,
					crossDomain :obj.crossDomain,
					dataType:obj.dataType,//服务器返回json格式数据
					type:obj.type,//HTTP请求类型
//					async:obj.async||false,
					success:function(data){
						if(isLoading){
							layer.close(enIndex);
						}
						if(data.code == 332){
							
							if(obj.isNoToloagin){//判断是否自动跳转到登录页面，默认跳转
								obj.success(data);
							}else{
								var webview = mui.openWindow('login.html');
								if(obj.webviewBackHandler&& typeof obj.webviewBackHandler == 'function'){
									webview.addEventListener('loaded', function(e){
	//									alert('Webview Hided');
									}, false);
									webview.addEventListener('close', function(e){
										alert('Webview close');
										obj.webviewBackHandler();
									}, false );
								}
								
							}
							
							
						}else if(data.code == 400){
							mui.toast(data.msg);
						}else
							obj.success(data);
						
					},error:function(e){
						if(isLoading){
							layer.close(enIndex);
						}
							obj.error(e);
					}
				});
}

/*调用ajax
* @param {Object} url 请求的路径
 * @param {Object} obj 请求参数，函数
 * @param {Object} isLoading 是否启用遮罩动画效果
 */
var $Ajax = function(url,obj,isLoading,content){
	var enIndex  = -1;
	if(isLoading){
		//loading效果
				enIndex = layer.open({
							    type: 2
							    ,content: content||'登录中...'
							  });
	}
	
	$.ajax({
					url:url,
					data:obj.data,
					crossDomain :obj.crossDomain,
					dataType:obj.dataType,//服务器返回json格式数据
					type:obj.type,//HTTP请求类型
						/**
	             * 必须false才会避开jQuery对 formdata 的默认处理
	             * XMLHttpRequest会对 formdata 进行正确的处理
	             */
	            processData: false,
	            /**
	             *必须false才会自动加上正确的Content-Type
	             */
	            contentType: false,
					success:function(data){
						if(isLoading){
							layer.close(enIndex);
						}
						if(data.code == 332){
							mui.openWindow('login.html');
						}else if(data.code == 400){
							mui.toast(data.msg);
						}else
							obj.success(data);
						
					},error:function(e){
						if(isLoading){
							layer.close(enIndex);
						}
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