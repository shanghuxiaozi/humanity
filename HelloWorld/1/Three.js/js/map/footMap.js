/**
 * 
 */
var Bookingmap = function(){
	var _this = this;
	
}
	
	
	/**初始化百度地图**/
Bookingmap.prototype.initBaiduMap=function(id){
	//console.log("初始化地图"+id);
	
	var control_t = -1,isOver = false;
	var _this = this;
	var icons = [];//图标
	_this.sizeList = [];
	var searchLsit = [];
	_this.markList = [];
	_this.originSize = [];
	
	_this.isActivity = false;//表示是否在活动页面默认不是
		// 百度地图API功能
		function G(id) {
			return document.getElementById(id);
		}
		var map = new BMap.Map(id, {enableMapClick:false});//
//		map.setMapType(BMAP_PERSPECTIVE_MAP); 
//		map.setCurrentCity("深圳");
		map.setMapStyle({styleJson: mapDefine });
		
		_this.map = map;
		//map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
		var longitude =  localStorage.getItem('longitude');
		var latitude =  localStorage.getItem('latitude');
		console.log(longitude,latitude);
		//暂时定位到河南登封少林寺
		var point = new BMap.Point(112.948713,34.512389);//new BMap.Point(longitude||114.06444, latitude||22.548488);
		map.centerAndZoom(point,4);
//map.centerAndZoom("北京",15); 
//		map.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
		/*var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				var mk = new BMap.Marker(r.point);
				map.addOverlay(mk);
				map.panTo(r.point);
				alert('您的位置：'+r.point.lng+','+r.point.lat);
			}
			else {
				alert('failed'+this.getStatus());
			}        
		},{enableHighAccuracy: true})*/
		 map.enableScrollWheelZoom();  
		 
		
		 /*var myKeys = ["酒店", "加油站"];
		var local = new BMap.LocalSearch(map, {
			renderOptions:{map: map},
			pageCapacity:5
		});
		local.searchInBounds(myKeys, map.getBounds());*/
		
//		var local = new BMap.LocalSearch(map, {
//		renderOptions:{map: map}
//		,onSearchComplete: myFunHandler
//	});
	
//	//回调
//	function myFunHandler(){
//		map.clearOverlays();    //清除地图上所有覆盖物
//		console.log(local.getResults());
//	}
//	
//	
//	var pStart = new BMap.Point(116.393562,39.914805);
//	var pEnd = new BMap.Point(116.413562,39.934805);
//	var bs = new BMap.Bounds(pStart,pEnd);   //自己规定范围
//	local.searchInBounds(["景点","山","水"], bs);
//
//	var polygon = new BMap.Polygon([
//		new BMap.Point(pStart.lng,pStart.lat),
//		new BMap.Point(pEnd.lng,pStart.lat),
//		new BMap.Point(pEnd.lng,pEnd.lat),
//		new BMap.Point(pStart.lng,pEnd.lat)
//		], {strokeColor:"blue", strokeWeight:1, strokeOpacity:0.1});
//	map.addOverlay(polygon);
		//var myIcon = new BMap.Icon("../../icon/mark/characteristicArchitecture.png", new BMap.Size(26*2,32*2),{anchor: new BMap.Size(24*1,32*1), imageOffset: new BMap.Size(0-5, 0 - 17),imageSize:new BMap.Size(0.5, 0.5)});
		 var myIcon = new BMap.Icon("../../icon/mark/characteristicArchitecture.png", new BMap.Size(66,71),{imageSize:new BMap.Size(33, 35.5)});
		 _this.createMark("景点",point,myIcon);
		 icons.push(myIcon);
		 _this.myIcon = myIcon;
		// sizeList.push(new BMap.Size(33, 35.5));
		 //var myIcon1 = new BMap.Icon("../../icon/mark/hill.png", new BMap.Size(26*2,36*2),{anchor: new BMap.Size(24*1,32*1), imageOffset: new BMap.Size(0-12, 0 - 17),imageSize:new BMap.Size(0.5, 0.5)});
		 var myIcon1 = new BMap.Icon("../../icon/mark/hill.png", new BMap.Size(78,62),{imageSize:new BMap.Size(39, 31)});
		 _this.createMark("山",point,myIcon1);
		 icons.push(myIcon1);
		 _this.myIcon1 = myIcon1;
		 // sizeList.push(new BMap.Size(39, 31));
		 //var myIcon2 = new BMap.Icon("../../icon/mark/hill1.png", new BMap.Size(52*4,62*4),{anchor: new BMap.Size(20*1,32*1), imageOffset: new BMap.Size(0-12, 0 - 17),imageSize:new BMap.Size(0.5, 0.5)});
		 var myIcon2 = new BMap.Icon("../../icon/mark/hill1.png", new BMap.Size(239,110),{anchor: new BMap.Size(50,32),imageSize:new BMap.Size(169.5, 55)});
		 _this.createMark("山脉",point,myIcon2);
		 icons.push(myIcon2);
		 _this.myIcon2 = myIcon2;
		// sizeList.push(new BMap.Size(169.5, 55));
		 //var myIcon3 = new BMap.Icon("../../icon/mark/hole.png", new BMap.Size(28*2,40*2),{anchor: new BMap.Size(20*1,32*1), imageOffset: new BMap.Size(0-12, 0 - 0),imageSize:new BMap.Size(0.5, 0.5)});
		 var myIcon3 = new BMap.Icon("../../icon/mark/hole.png", new BMap.Size(74,53),{imageSize:new BMap.Size(37, 26.5)});
		 _this.createMark("洞",point,myIcon3);
		 icons.push(myIcon3);
		 _this.myIcon3 = myIcon3;
		  //sizeList.push(new BMap.Size(37, 26.5));
		 //岛
		 _this.myIconIsland = new BMap.Icon("../../icon/mark/island.png", new BMap.Size(80,51),{imageSize:new BMap.Size(40, 25.5)});
		 //ruins遗址
		 _this.myIconRuins = new BMap.Icon("../../icon/mark/ruins.png", new BMap.Size(59,53),{imageSize:new BMap.Size(29.5, 26.5)});
		 //小镇
		 _this.myTown = new BMap.Icon("../../icon/mark/town.png", new BMap.Size(68,60),{imageSize:new BMap.Size(34, 30)});
		 
		 //特效
		 _this.t4Icon = new BMap.Icon("../../icon/mark/t4.gif", new BMap.Size(66,71),{imageSize:new BMap.Size(33, 35.5)});
		 icons.push(_this.t4Icon);
		 
		 //红旗
		 _this.flagRed = new BMap.Icon("../../icon/flag/flag-red.ico", new BMap.Size(66,71),{anchor: new BMap.Size(10,10), imageSize:new BMap.Size(33, 35.5)});
		 icons.push(_this.flagRed);
		 
		 
		 map.addEventListener("zoomend",function(e){
		 	console.log(map.getZoom());
		 	
		 	
		 	if(_this.isActivity){
		 		
		 		
		 		
		 		
		 		return;
		 	}
		 	
		 	
		 	
		 	
		 	//--------------------------------------非活动页面-----------------------------------------
		 	if(map.getZoom()>=16){
		 		map.setZoom(16);
		 	}
//		 	for( var i= 0,m=icons.length;i<m;i++ ){
//		 		var icon = icons[i];
//		 		var size = sizeList[i];
//		 		size.width *= map.getZoom()/15;
//		 		size.height *= map.getZoom()/15;
//		 		icon.setImageSize(size);
//		 	}
			for( var i= 0,m=_this.markList.length;i<m;i++ ){
				var mark = _this.markList[i];
				/*if(map.getZoom()<14 &&( i%30!=0)){
					
					mark.hide();
					continue;
				}else if(map.getZoom()>=14 && map.getZoom()<15 &&( i%10!=0)){
					
					mark.hide();
					continue;
				}*/
				if(!mark.isVisible())mark.show();
				var icon = mark.getIcon();
				//icon.size.width *= map.getZoom()/15;
				//icon.size.height *= map.getZoom()/15;
				//icon.imageUrl
				var size = _this.sizeList[i];
				if(i==0){
					console.log(icon.imageSize);
				}
				var zoom = map.getZoom()/15;
				//zoom = (zoom==1?zoom:zoom<1?zoom/2:zoom*1.2)
				if(zoom >=1.2)zoom = 1.2
				else if(zoom < 1.2 && zoom >= 1)zoom = 1
				else if(zoom < 1 && zoom > 0.5)zoom = 0.6
				else if(zoom <=0.5)zoom = 0.5
				icon.setImageSize(new BMap.Size(size.width*zoom, size.height*zoom));
				
				mark.setIcon(icon);
			}
		 });
		 
		 //拖拽地图dragend
		  map.addEventListener("dragend",function(e){
		  	
		  	if(_this.isActivity){
		 		
		 		
		 		
		 		
		 		return;
		 	}
		  		
		  		_this.drageHandler(map.getCenter(),map.getZoom());
		  });
		 
		 //-----------------
		 var myStyleJson=[  
		{  
		    "featureType": "road",  
		    "elementType": "geometry.stroke",  
		    "stylers": {  
		        "color": "#ff0000"  
		    }  
		}];
	//map.setMapStyle({styleJson: mapDefine });
		 
		var geoc = new BMap.Geocoder(); 
		var touchKong = 0;
		map.addEventListener("touchstart",function(e){
			//alert("触摸");
			console.log(e);
			touchKong++;
			var time = setTimeout(function(){
				touchKong = 0;
				clearTimeout(time);
				
			},400);
			if(touchKong==2){
				touchKong=0;
				
				var input = document.getElementById("suggestId");
	//			input.blur();
	//			_this.clickhandler(e.touches[0]);
				var pt = e.point;
				geoc.getLocation(pt, function(rs){//console.log(rs);
					var addComp = rs.addressComponents;
					if(addComp.province==""&&addComp.city ==""){
						mui.toast('请把旗帜插在陆地上！~');
						return;
					}
					var address = rs.addressComponents;
					var obj 
					if(rs.surroundingPois.length>0)
					 obj = rs.surroundingPois[0];
					else{
						obj = new Object();
						obj.title = "";
					}
					 
					var _value = address.province +  address.city +  address.district +  address.street +  (rs.business!=""? rs.business:obj.title);
					mui.confirm('您选择的足迹地点：'+_value,'温馨提示', ['取消','确认'],function(e){
						
						if(e.index == 0){
							
						}else{
							var mk = new BMap.Marker(rs.point,{icon:_this.flagRed});
			//				map.clearOverlays();
							map.addOverlay(mk);
							console.log(BMAP_ANIMATION_BOUNCE);
							mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
							map.panTo(rs.point);
							
							console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber,addComp);
							
							
							//$('#suggestId').val(_value);
							//$('#suggestId').focusout();
							if( typeof _this.clickhandler === 'function' ){
								_this.clickhandler(_value,pt);
							}
							if( typeof _this.pointHandler === 'function' ){
								_this.pointHandler(pt);
							}
						}
					})
					
					
					
				}); 
			}
			
		});
		//单击获取点击的经纬度
		var clickKong = 0;
		map.addEventListener("click",function(e){
			console.log(e.point);
			//alert(9);
			clickKong++;
			var time = setTimeout(function(){
				clickKong = 0;
				clearTimeout(time);
				
			},400);
			if(clickKong==2){
				clickKong=0
			
				var input = document.getElementById("suggestId");
	//			input.blur();
	//			_this.clickhandler();
				//console.log('覆盖物',map.getOverlays());
	//			return;
				//var os = map.getOverlays();
				
				
				
	//			for(var i = 0; i < os.length ; i++){
	//			             //不同覆盖物调用不同的计算方法
	//			             switch (os[i].toString()) {
	//			                 case "[object Polyline]":
	//			                     //
	//			                     break;
	//			                 case "[object Polygon]":
	//			                     //
	//			                     break;
	//			                 case "[object Circle]":
	//			                     //
	//			                     break;
	//			                 case "[object Marker]":
	//			                     //
	//			                	 console.log();
	//			                     break;
	//			            }
	//			}
				
				
	//			if( os._indexOf(e.overlay)!=-1){
	//	            console.log('你点击的是覆盖物：',e.overlay);   
	//	            //return;
	//	        }
				var pt = e.point;
				geoc.getLocation(pt, function(rs){//console.log(rs);
					var addComp = rs.addressComponents;
					if(addComp.province==""&&addComp.city ==""){
						mui.toast('请把旗帜插在陆地上！~');
						return;
					}
					var address = rs.addressComponents;
					var obj 
					if(rs.surroundingPois.length>0)
					 obj = rs.surroundingPois[0];
					else{
						obj = new Object();
						obj.title = "";
					}
					var _value = address.province +  address.city +  address.district +  address.street +  (rs.business!=""? rs.business:obj.title);
					mui.confirm('您选择的足迹地点：'+_value,'温馨提示', ['取消','确认'],function(e){
						
						if(e.index == 0){
							
						}else{
							var mk = new BMap.Marker(rs.point,{icon:_this.flagRed});
			//				map.clearOverlays();
							map.addOverlay(mk);
							mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
							map.panTo(rs.point);
							//console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber,addComp);
							
							 
							
							//$('#suggestId').val(_value);
							//$('#suggestId').focusout();
							if( typeof _this.clickhandler === 'function' ){
								_this.clickhandler(_value,pt);
							}
							if( typeof _this.pointHandler === 'function' ){
								_this.pointHandler(pt);
							}
						}
						
					});
					
				});  
			}
		});
//		var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
//				{"input" : "suggestId"
//				,"location" : map
//			});
//
//			ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
//			var str = "";
//				var _value = e.fromitem.value;
//				var value = "";
//				if (e.fromitem.index > -1) {
//					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
//				}    
//				str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
//				
//				value = "";
//				if (e.toitem.index > -1) {
//					_value = e.toitem.value;
//					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
//				}    
//				str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
//				G("searchResultPanel").innerHTML = str;
//			});
//
//			var myValue;
//			ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
//				var input = document.getElementById("suggestId");
//				input.blur();
//				var _value = e.item.value;
//				myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
//				G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
//				
//				if( typeof _this.handler === 'function' ){//console.log("点击下来选项");
//					_this.handler(myValue,_value.city );
//			    }
//				setPlace();
//				control_t = setTimeout(clock(),5000);
//			});
//
//			function setPlace(){
//				map.clearOverlays();    //清除地图上所有覆盖物
//				_this.markList = [];
//				_this.sizeList = [];
//				function myFun(){
//					var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
//					//console.log("位置经纬度=",pp);
//					isOver = true;
//					
//					if( typeof _this.pointHandler === 'function' ){
//						_this.pointHandler(pp);
//					}
//					map.centerAndZoom(pp, 14);
//					map.addOverlay(new BMap.Marker(pp));//添加标注
//					myIcon.setImageSize(new BMap.Size(33, 35.5));
//					 _this.createMark("景点",pp,myIcon);
//					 myIcon1.setImageSize(new BMap.Size(39, 31));
//					 _this.createMark("山",pp,myIcon1);
//		 			myIcon2.setImageSize(new BMap.Size(169.5, 55));
//					 _this.createMark("山脉",pp,myIcon2);
//					myIcon3.setImageSize(new BMap.Size(37, 26.5));
//					 _this.createMark("洞",pp,myIcon3);
//				}
//				var local = new BMap.LocalSearch(map, { //智能搜索
//				  onSearchComplete: myFun
//				});
//				local.search(myValue);
//			}
//			
//			function clock(){
//				clearTimeout(control_t);
//				if(!isOver){
//					//console.log("未查到经纬度---",myValue);
//					
//					setPlace();
//					
//				}
////				else{
////					isOver = false;
////				}
//			}
	
	
} ;






/**根据起点和终点的位置信息计算驾车时间与距离**/
Bookingmap.prototype.getRoute=function(onPlace,offPlace,c,v){
	var _this = this;
	var map = _this.map;
	//加载层
	//var loadRouteIndex = layer.load(1, {shade: 0.5}); //0代表加载的风格，支持0-2
	var control_t = -1,isOver = false;
	
	_this.output = "从"+onPlace+"到"+offPlace+"需要";//console.log('------',onPlace,offPlace)
	var outputDistance = "";
	var distance = '';
	var searchComplete = function (results){
		if (transit.getStatus() != BMAP_STATUS_SUCCESS){
			return ;
		}
		var plan = results.getPlan(0);//console.log("plan=",plan);
		//console.log('=================',onPlace,offPlace);
		outputDistance = "";
		_this.output += plan.getDuration(true) + "\n";                //获取时间
		_this.output += "总路程为：" ;
		_this.output += plan.getDistance(true) + "\n";             //获取距离
		distance = plan.getDistance(true)
		isOver = true;
	}
	var transit;
	if( !_this.transit){
		transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
			onSearchComplete: searchComplete,
			onPolylinesSet: function(){        
				setTimeout(function(){
					//console.log(distance,"----------------------",_this.output,'==========',onPlace,offPlace,'============');
					//layer.close(loadRouteIndex);
					_this.routeHandler(_this.output,distance.substring(0,distance.indexOf("公里")))},1000);
		}});
	}else{
		transit = _this.transit;
	}
	
	//transit.search(onPlace, offPlace);
	transit.search(c?new BMap.Point(c.lng,c.lat):onPlace, v?new BMap.Point(v.lng,v.lat):offPlace);
	function clockis(){
		clearTimeout(control_t);
		if(!isOver){
			layer.msg("您选择的范围有误未查到距离重新查看", {icon: 2});
			//console.log("未查到距离重新查看",onPlace, offPlace);//console.log(transit);
			//if(transit)
			//transit.search(onPlace, offPlace);
			//layer.close(loadRouteIndex);
			if(typeof _this.errorHandler === 'function' ){
				_this.errorHandler();
			}
		}else{
			isOver = false;
		}
	}
	control_t = setTimeout(function(){clockis()},10000);
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


/**当未查询到路线时的抛错函数**/
Bookingmap.prototype.addEventListenError=function(handler){
	var _this = this;
	_this.errorHandler = handler;
	
}

/**重置中心点**/
Bookingmap.prototype.panTo=function(p,v){
	var _this = this;
	console.log(p.lng,p.lat);
	_this.map.centerAndZoom(new BMap.Point(p.lng,p.lat),v||15);
	
}


/**改变图标大小**/
Bookingmap.prototype.changeIconSize=function(){
	var _this = this;
	var map = _this.map;
	for( var i= 0,m=_this.markList.length;i<m;i++ ){
				var mark = _this.markList[i];
//				if(map.getZoom()<14 &&( i%30!=0)){
//					
//					mark.hide();
//					continue;
//				}else if(map.getZoom()>=14 && map.getZoom()<15 &&( i%10!=0)){
//					
//					mark.hide();
//					continue;
//				}
//				if(!mark.isVisible())mark.show();
				var icon = mark.getIcon();
				//icon.size.width *= map.getZoom()/15;
				//icon.size.height *= map.getZoom()/15;
				//icon.imageUrl
				var size = _this.sizeList[i];
				if(i==0){
					console.log(icon.imageSize);
				}
				var zoom = map.getZoom()/15;
				//zoom = (zoom==1?zoom:zoom<1?zoom/2:zoom*1.2)
				if(zoom >=1.2)zoom = 1.2
				else if(zoom < 1.2 && zoom >= 1)zoom = 1
				else if(zoom < 1 && zoom > 0.5)zoom = 0.6
				else if(zoom <=0.5)zoom = 0.5
				icon.setImageSize(new BMap.Size(size.width*zoom, size.height*zoom));
				
				mark.setIcon(icon);
			}
}

/**重置中心点**/
Bookingmap.prototype.centerAndZoom=function(p,c,v){
	var _this = this;
	if(_this.map){
		
		//console.log( p);
	//	//{"lng":102.936818,"lat":25.104579}
		_this.map.zoomTo(12);//在panTo函数之前执行否则
		setTimeout(function(){_this.map.panTo(new BMap.Point(p.lng,p.lat))},500);
		//_this.map.panTo(new BMap.Point(102.936818,25.104579));
        // 设置地图中心点
		if(c&&v){
			_this.map.clearOverlays();
			_this.map.setCenter(new BMap.Point(p.lng,p.lat));
			var searchComplete = function (results){
				if (transit.getStatus() != BMAP_STATUS_SUCCESS){
					return ;
				}
				
			}
			var transit;
			if( !_this.transit){
				transit = new BMap.DrivingRoute(_this.map, {renderOptions: {map: _this.map},
					onSearchComplete: searchComplete,
					});
			}else{
				transit = _this.transit;
			}
			
			transit.search(new BMap.Point(c.lng,c.lat), new BMap.Point(v.lng,v.lat));
		}
		
	}
		
	
}



/**自定义控件**/
Bookingmap.prototype.defineControl=function(x,y,html,style){
	var _this = this;
	var map = _this.map;
	// 定义一个控件类,即function
	function ZoomControl(){
	  // 默认停靠位置和偏移量
	  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
	  this.defaultOffset = new BMap.Size(x, y);
	}

	// 通过JavaScript的prototype属性继承于BMap.Control
	ZoomControl.prototype = new BMap.Control();

	// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
	// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
	ZoomControl.prototype.initialize = function(map){
	  // 创建一个DOM元素
	  var div = document.createElement("div");
	  // 添加文字说明
	  div.appendChild(html);
	  // 设置样式
//	  div.style.cursor = "pointer";
//	  div.style.border = "1px solid gray";
//	  div.style.backgroundColor = "white";
		for(var key in style){
			div.style[key] = style[key];
		}
	  // 绑定事件,点击一次放大两级
	  div.onclick = function(e){
		map.setZoom(map.getZoom() + 2);
	  }
	  // 添加DOM元素到地图中
	  map.getContainer().appendChild(div);
	  // 将DOM元素返回
	  return div;
	}
	// 创建控件
	var myZoomCtrl = new ZoomControl();
	// 添加到地图当中
	map.addControl(myZoomCtrl);
}

/**运行轨迹，路书**/
Bookingmap.prototype.trajectory = function(){
	var _this = this;
	var map = _this.map;
	var myStartIcon = new BMap.Icon("../../images/schedule/start.png", new BMap.Size(66,89),{
 //offset: new BMap.Size(10, 25), // 指定定位位置
   // imageOffset: new BMap.Size(0, 0 - 10 * 25)
    });
	var myEndIcon = new BMap.Icon("../../images/schedule/end.png", new BMap.Size(66,89));
	var icon = new BMap.Icon('../../images/schedule/xingzou.png', new BMap.Size(55*2,45*2),{anchor : new BMap.Size(55, 45),imageOffset: new BMap.Size(27, 22),offset: new BMap.Size(27, 22)});
	icon.setImageSize(new BMap.Size(55,45));
	var lushu;
	var drv = new BMap.DrivingRoute('深圳',{
	          onSearchComplete: function(res) {
            if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                var plan = res.getPlan(0);
                var arrPois =[];
                for(var j=0,m = plan.getNumRoutes();j<m;j++){
                    var route = plan.getRoute(j);
                    arrPois= arrPois.concat(route.getPath());
                    if(j == 0){
                    	console.log('route=',route.getPath()[0]);
						//var marker2 = new BMap.Marker(route.getPath()[0],{icon:myStartIcon});  // 创建标注
						var marker2 = new ComplexCustomOverlay(route.getPath()[0],"../../images/schedule/start.png");
						map.addOverlay(marker2);
						var marker3 = new ComplexCustomOverlay(route.getPath()[route.getPath().length -1],"../../images/schedule/end.png");
						map.addOverlay(marker3);
                    }else if(j == (m-1)){
                    	console.log('route=',route.getPath()[0]);
//						var marker3 = new BMap.Marker(route.getPath()[0],{icon:myEndIcon});  // 创建标注
						
                    }
                }
                
                map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#0000ff'}));
                map.setViewport(arrPois);
                
                lushu = new BMapLib.LuShu(map,arrPois,{
                defaultContent:"",//
                autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                icon  : icon,
                speed: 1500,
                enableRotation:true,//是否设置marker随着道路的走向进行旋转
                landmarkPois: [
                   
                ]});  
                lushu.start();
            }
        }
    });
	drv.search('深圳市南山区世界之窗', '深圳市宝安区深圳北站');
	//drv.serch(new BMap.Point(114.036759, 22.617103),new BMap.Point(113.907978, 22.486263));
	
}

// 复杂的自定义覆盖物
    function ComplexCustomOverlay(point,imgUrl/*, text, mouseoverText*/){
      this._point = point;
      //this._text = text;
      //this._overText = mouseoverText;
      this._url = imgUrl;
      
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
      this._map = map;
      var div = this._div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
      //div.style.backgroundColor = "#EE5D5B";
      //div.style.border = "1px solid #BC3B3A";
      div.style.color = "white";
      div.style.height = "18px";
      div.style.padding = "2px";
      div.style.lineHeight = "18px";
      div.style.whiteSpace = "nowrap";
      div.style.MozUserSelect = "none";
      div.style.fontSize = "12px";
     // div.style.background = "url("+this._url+")";
      var span = this._span = document.createElement("span");
      div.appendChild(span);
      var img = document.createElement("img");
      img.src = this._url;
      img.style.width = "30px";
      div.appendChild(img);
      
     // span.appendChild(document.createTextNode(this._text));      
      var that = this;

//    var arrow = this._arrow = document.createElement("div");
//    arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
//    arrow.style.position = "absolute";
//    arrow.style.width = "11px";
//    arrow.style.height = "10px";
//    arrow.style.top = "22px";
//    arrow.style.left = "10px";
//    arrow.style.overflow = "hidden";
//    div.appendChild(arrow);
     
//    div.onmouseover = function(){
//      this.style.backgroundColor = "#6BADCA";
//      this.style.borderColor = "#0000ff";
//      this.getElementsByTagName("span")[0].innerHTML = that._overText;
//      arrow.style.backgroundPosition = "0px -20px";
//    }
//
//    div.onmouseout = function(){
//      this.style.backgroundColor = "#EE5D5B";
//      this.style.borderColor = "#BC3B3A";
//      //this.getElementsByTagName("span")[0].innerHTML = that._text;
//      arrow.style.backgroundPosition = "0px 0px";
//    }

      map.getPanes().labelPane.appendChild(div);
      
      return div;
    }
    ComplexCustomOverlay.prototype.draw = function(){
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this._point);
//    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
	  this._div.style.left = pixel.x -15 + "px";
      this._div.style.top  = pixel.y -30+ "px";
    }

/*点击图标后*/
Bookingmap.prototype.clickMark = function(handler){
	var _this = this;
	_this.clickMarkHandler = handler;
}

/*点击地图*/
Bookingmap.prototype.clickhandler = function(handler){
	var _this = this;
	_this.clickhandler = handler;
}

/*点击地图*/
Bookingmap.prototype.drageHandler = function(handler){
	var _this = this;
	_this.drageHandler = handler;
}

/*点击地图*/
Bookingmap.prototype.centerAndZoomByName = function(c,v){
	var _this = this;
	var map = _this.map;
	_this.map.centerAndZoom(c,v||15);
}


/*从后台数据查询过来的mark*/
Bookingmap.prototype.createMarkFromData = function(obj){
	var map = this.map;
	var _this = this;
	var pt = new BMap.Point(parseFloat(obj.longitude),parseFloat(obj.latitude));
	var myIcon;
	if(obj.type_id == 1){//山地自然景观
		myIcon = _this.myIcon1;
	}else if(obj.type_id == 3){//地标建筑
		myIcon = _this.myIcon;
	}else if(obj.type_id == 5){//森林公园动植物景观
		myIcon = _this.myIcon2;
	}else if(obj.type_id == 9){//宗教景观
		myIcon = _this.myTown;
	}else if(obj.type_id == 8888){//活动
		myIcon = _this.t4Icon;
	}else if(obj.type_id == 8889){//红旗
		myIcon = _this.flagRed;
	}else{
		myIcon = _this.myIcon;
	}
	
	var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
	map.addOverlay(marker); 
	var label = new BMap.Label(obj.title,{offset:new BMap.Size(10,-10)});
				label.setStyle({
					border:false,
					backgroundColor:false,
				// color : "red",
				 fontSize : "12px",
				 height : "20px",
				// lineHeight : "20px",
				 fontFamily:"微软雅黑"
			 });
			 
				marker.setLabel(label);
				marker.result = obj;
				marker.addEventListener("touchstart",attribute);
				marker.addEventListener("click",attribute);
				
				function attribute(e){
					console.log(e);
					//e.stopPropagation();
					 e.domEvent.stopPropagation();
					var p = marker.getPosition();  //获取marker的位置
					map.panTo(p);
					//alert("marker的位置是" + p.lng + "," + p.lat);  
					if(e.type=="ontouchstart"){
						_this.clickMarkHandler(e.target.result,e.touches[0]);//貌似百度不支持touchstart此事件
					}else
						_this.clickMarkHandler(e.target.result,e);
				}
				_this.markList.push(marker);
				_this.sizeList.push(new BMap.Size(marker.getIcon().imageSize.width,marker.getIcon().imageSize.height) );
}

Bookingmap.prototype.createMark = function(nme,p,myIcon){
	return;
	var map = this.map;
	var _this = this;
	
	//console.log(p)
	var local = new BMap.LocalSearch(map, {
		//renderOptions:{map: map},
		onSearchComplete: myFunHandler
	});
	function myFunHandler(){
		//map.clearOverlays();
		//console.log(local.getResults()[0].getPoi(0),local.getResults()[0].vr);
		
			for(var i = 0,m = local.getResults()[0].vr.length;i<m;i++){
				
				var result  = local.getResults()[0].vr[i];//console.log(result);
				if(nme=="山"||nme=="山脉")
				{
					var isHill = false;
					var a_len = result.tags.length;
					if(a_len>0){
						for(var a=0;a<a_len;a++){
							if(result.tags[0].indexOf("山")!=-1){
								isHill = true;
								break;
							}
						}
					}
					if(!isHill)continue;
				}else if(nme=="洞"){
					var isHole = false;
					var a_len = result.tags.length;
					if(a_len>0){
						for(var a=0;a<a_len;a++){
							if(result.tags[0].indexOf("风景")!=-1){
								isHole = true;
								break;
							}
						}
					}
					if(!isHole)continue;
				}else if(nme=="景点"){
					if(result.title.indexOf("山")!=-1){
						myIcon = _this.myIcon1;
					}else{
						myIcon = _this.myIcon;
					}
				}
				var pt = local.getResults()[0].vr[i].point;
				var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
				map.addOverlay(marker); 
				var label = new BMap.Label(result.title,{offset:new BMap.Size(10,-10)});
				label.setStyle({
					border:false,
					backgroundColor:false,
				// color : "red",
				 fontSize : "12px",
				 height : "20px",
				// lineHeight : "20px",
				 fontFamily:"微软雅黑"
			 });
			 
				marker.setLabel(label);
				marker.result = result;
				marker.addEventListener("touchstart",attribute);
				marker.addEventListener("click",attribute);
				
				function attribute(e){
					console.log(e.target);
					//e.stopPropagation();
					 e.domEvent.stopPropagation();
					var p = marker.getPosition();  //获取marker的位置
					//alert("marker的位置是" + p.lng + "," + p.lat);  
					_this.clickMarkHandler(e.target.result,e);
				}
				_this.markList.push(marker);
				_this.sizeList.push(new BMap.Size(marker.getIcon().imageSize.width,marker.getIcon().imageSize.height) );
			}
		}
	
	
	var pStart = new BMap.Point(p.lng-0.1,p.lat-0.1);
	var pEnd = new BMap.Point(p.lng+0.1,p.lat+0.1);
	var bs = new BMap.Bounds(pStart,pEnd);   //自己规定范围
	local.searchInBounds([nme], bs);

//	var polygon = new BMap.Polygon([
//		new BMap.Point(pStart.lng,pStart.lat),
//		new BMap.Point(pEnd.lng,pStart.lat),
//		new BMap.Point(pEnd.lng,pEnd.lat),
//		new BMap.Point(pStart.lng,pEnd.lat)
//		], {strokeColor:"blue", strokeWeight:1, strokeOpacity:0.1});
//	map.addOverlay(polygon);
}



/**扩展IE*不支持indexOf**/
function extendTheIEArray(){
	if(!Array.prototype._indexOf){   
		Array.prototype._indexOf=function(n){                                                                                                                                         
	    if("indexOf" in this){ 
	        return this["indexOf"](n); 
	    }   
	    for(var i=0;i<this.length;i++){ 
	        if(n===this[i]){ 
	            return i; 
	        } 
	    } 
	    return -1; 
	}; 
	}; 
}



var  mapDefine = [
		
		//背景
          {
                    "featureType": "background",
                    "elementType": "all",
                    "stylers": {
                              "color": "#f3f1e3"//,
                             // "lightness": 5,
                              //"saturation": 3
                    }
          },

//陆地
          {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                              "color": "#EBE7D1"//,f1efde
                              //"lightness": 5,
                              //"saturation": 3
                    }
          },

//水系
          {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": {
                              "color": "#B6D9DF"//,#69c0e0
                              //"lightness": 5,
                              //"saturation": 3
                    }
          },

//绿地 
          {
                    "featureType": "green",
                    "elementType": "all",
                    "stylers": {
                              "color": "#B8CFA9"//,#c9e9bf
                              //"lightness": 5,
                              //"saturation": 3
                    }
          },

//人造区域
          {
                    "featureType": "manmade",
                    "elementType": "all",
                    "stylers": {
                              "color": "#EBE7D1"//,f7f3d5
                              //"lightness": 5,
                              //"saturation": 3
                    }
          },
//建筑物
          {
                    "featureType": "building",
                    "elementType": "all",
                    "stylers": {
                              "color": "#EBE7D1"
                    }
          },
     // 高速及国道
           {
                    "featureType": "highway",
                    "elementType": "all",
                    "stylers": {
                              "color": "#FAE5B4"//#f7e5B1
                             // "lightness": 5
                    }
          },
          //城市主路
          {
                    "featureType": "arterial",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                              "color": "#FCFAF7",//#f7e5B1
                              "weight": "0.1",
                              "lightness": -18
                              
                    }
          },
          //地铁
 		{
                    "featureType": "subway",
                    "elementType": "all",
                    "stylers": {
                              "color": "#f2dea3",
                              "lightness": 5,
                              "visibility": "off"
                    }
         },
         //铁路
         {
                    "featureType": "railway",
                    "elementType": "all",
                    "stylers": {
                              "color": "#f2dea3",
                              "lightness": 5,
                              "visibility": "off"
                    }
         },
         //兴趣点
         {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": {
                              "color": "#cccccc",
                              "weight": "0.1",
                              "lightness": -18,
                              "visibility": "off"
                    }
          }


]
