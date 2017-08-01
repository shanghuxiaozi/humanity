/**
 * 
 */
var Bookingmap = function(){
	var _this = this;
	
}
	
	
	/**初始化百度地图**/
Bookingmap.prototype.initBaiduMap=function(id){
	console.log("初始化地图"+id);
	var control_t = -1,isOver = false;
	var _this = this;
		// 百度地图API功能
		function G(id) {
			return document.getElementById(id);
		}
		var map = new BMap.Map(id);
		_this.map = map;
		//map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
		var point = new BMap.Point(102.73333,   25.05000);
		map.centerAndZoom(point,20);
		map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
//		var geolocation = new BMap.Geolocation();//浏览器定位
//		geolocation.getCurrentPosition(function(r){
//			if(this.getStatus() == BMAP_STATUS_SUCCESS){
//				var mk = new BMap.Marker(r.point);
//				map.addOverlay(mk);
//				map.panTo(r.point);
//				console.log('您的位置：'+r.point.lng+','+r.point.lat,r);
//				if( typeof _this.browserhandler === 'function' ){
//					_this.browserhandler(this.getStatus(),r);
//				}
//				
//			}
//			else {
//				console.log('failed'+this.getStatus());
//				if( typeof _this.browserhandler === 'function' ){
//					_this.browserhandler(this.getStatus(),"失败");
//				}
//			}        
//		},{enableHighAccuracy: true})
		 map.enableScrollWheelZoom();  
		var geoc = new BMap.Geocoder(); 
		
		
		
		
		//单击获取点击的经纬度
		map.addEventListener("click",function(e){
			//alert(e.point.lng + "," + e.point.lat);
			console.log(e.point);
			var pt = e.point;
			geoc.getLocation(pt, function(rs){
				var addComp = rs.addressComponents;
				/**
				 * Si:"房地产",address:"广东省深圳市福田区红荔西路8133号",city:"深圳市",gu:Array(1),phoneNumber:null,point:Hpostcode:null,title:"农科商务办公楼",type:0,uid:"b644b14f108cdfd115764393"
				 * **/
				//console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber,rs);
				//console.log(rs.surroundingPois);
//				console.log(rs);
//				if(rs.surroundingPois.length){
//					var r = rs.surroundingPois.shift();
					var mk = new BMap.Marker(rs.point);
					map.clearOverlays();
					map.addOverlay(mk);
					map.panTo(rs.point);
//				}
				
				if( typeof _this.choosehandler === 'function' ){//console.log("点击下来选项");
					_this.choosehandler(rs);
			    }
			});   
		});
		var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
				{"input" : "suggestId"
				,"location" : map
			});

			ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
			var str = "";
				var _value = e.fromitem.value;
				var value = "";
				if (e.fromitem.index > -1) {
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
				
				value = "";
				if (e.toitem.index > -1) {
					_value = e.toitem.value;
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
				G("searchResultPanel").innerHTML = str;
			});

			var myValue;
			ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
			var _value = e.item.value;
				myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
				
				
				if( typeof _this.handler === 'function' ){//console.log("点击下来选项");
					_this.handler(myValue);
			    }
				$('#suggestId').focusout();console.log("失去焦点");
				setPlace(myValue);
				
				control_t = setTimeout(clock(),5000);
			});

			function setPlace(myValue){
				map.clearOverlays();    //清除地图上所有覆盖物
				function myFun(){
					var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
					console.log("位置经纬度=",pp);
					isOver = true;
					
					if( typeof _this.pointHandler === 'function' ){
						_this.pointHandler(myValue,pp);
					}
					map.centerAndZoom(pp, 18);
					map.addOverlay(new BMap.Marker(pp));    //添加标注
				}
				var local = new BMap.LocalSearch(map, { //智能搜索
				  onSearchComplete: myFun
				});
				local.search(myValue);
			}
			
			function clock(){
				clearTimeout(control_t);
				if(!isOver){
					console.log("未查到经纬度---",myValue);
					
					setPlace(myValue);
					
				}else{
					isOver = false;
				}
			}
	
	
} ;

/**根据起点和终点的位置信息计算驾车时间与距离**/
Bookingmap.prototype.getRoute=function(onPlace,offPlace){
	var _this = this;
	var map = _this.map;
	var control_t = -1,isOver = false;
	
	var output = "";
	var distance = '';
	var searchComplete = function (results){
		if (transit.getStatus() != BMAP_STATUS_SUCCESS){
			return ;
		}
		var plan = results.getPlan(0);console.log("plan=",plan);
		output = "从"+onPlace+"到"+offPlace+"需要";
		output += plan.getDuration(true) + "\n";                //获取时间
		output += "总路程为：" ;
		output += plan.getDistance(true) + "\n";             //获取距离
		distance = plan.getDistance(true)
		isOver = true;
	}
	var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
		onSearchComplete: searchComplete,
		onPolylinesSet: function(){        
			setTimeout(function(){
				console.log(distance,"----------------------",distance.substring(0,distance.indexOf("公里")));
				_this.routeHandler(output,distance.substring(0,distance.indexOf("公里")))},"1000");
	}});
	transit.search(onPlace, offPlace);
	function clockis(){
		clearTimeout(control_t);
//		if(!isOver){
//			
//			console.log("未查到距离重新查看",onPlace, offPlace);
//			if(transit)
//			transit.search(onPlace, offPlace);
//			
//		}
//		else{
//			isOver = false;
//		}
	}
	control_t = setTimeout(clockis(),2000);
}

/**监听浏览器定位事件**/
Bookingmap.prototype.addEventListenBrowserLocation=function(handler){
	var _this = this;
	_this.browserhandler = handler;
	
}


/**手动选择**/
Bookingmap.prototype.addEventListenManuallyChoose=function(handler){
	var _this = this;
	_this.choosehandler = handler;
	
}


/**监听下拉框点击事件**/
Bookingmap.prototype.addEventListenDownList=function(handler){
	var _this = this;
	_this.handler = handler;
	
}
	
/**获取驾车时间与距离的回调**/
Bookingmap.prototype.addEventListenGetRoute=function(handler){
	var _this = this;
	_this.routeHandler = handler;
	
}

/**获取位置**/
Bookingmap.prototype.addEventListenPoint=function(handler){
	var _this = this;
	_this.pointHandler = handler;
	
}