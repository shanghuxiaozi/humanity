/**
 * 
 */
var BrowerMap = function(){
	var _this = this;
	
}
	
	
	/**初始化百度地图**/
BrowerMap.prototype.initBaiduMap=function(id){
	console.log("初始化地图"+id);	
	var _this = this;
	var map = new BMap.Map(id);
	_this.map = map;
	//map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
	var point = new BMap.Point(102.73333,   25.05000);
	map.centerAndZoom(point,20);
	var geolocation = new BMap.Geolocation();//浏览器定位
	geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				var mk = new BMap.Marker(r.point);
				map.addOverlay(mk);
				map.panTo(r.point);
				console.log('您的位置：'+r.point.lng+','+r.point.lat,r);
				_this.browserhandler(this.getStatus(),r);
			}
			else {
				console.log('failed'+this.getStatus());
				if( typeof _this.browserhandler === 'function' ){
					_this.browserhandler(this.getStatus(),"失败");
				}
			}        
		},{enableHighAccuracy: true})
}

/**监听浏览器定位事件**/
BrowerMap.prototype.addEventListenBrowserLocation=function(handler){
	var _this = this;
	_this.browserhandler = handler;
	
}