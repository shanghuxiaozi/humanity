/*************************
*返回顶部
*************************************************/
function manhuatoTop ()
{
	$(function() {
		$.fn.manhuatoTop = function(options) {
			var defaults = {
				showHeight : 150,
				speed : 1000
			};
			var options = $.extend(defaults,options);
			$("body").prepend("<div id='totop'><a></a></div>");
			var $toTop = $(this);
			var $top = $("#totop");
			var $ta = $("#totop a");
			$toTop.scroll(function(){
				var scrolltop=$(this).scrollTop();
				if(scrolltop>=options.showHeight){
					$top.show();
				}
				else{
					$top.hide();
				}
			});
			$ta.hover(function(){
				$(this).addClass("cur");
			},function(){
				$(this).removeClass("cur");
			});
			$top.click(function(){
				$("html,body").animate({scrollTop: 0}, options.speed);
			});
		}
	});
	$(function (){
		$(window).manhuatoTop({
			showHeight : 100,
			speed : 500
		});
	});
}
manhuatoTop();

// index跳转页面
function ahref(){
	window.location.href="destination.html";
}

//热门推荐  轮播
function bann(){
	console=window.console || {dir:new Function(),log:new Function()};
	var active=0,
		as=document.getElementById('pagenavi').getElementsByTagName('a');
	for(var i=0;i<as.length;i++){
		(function(){
			var j=i;
			as[i].onclick=function(){
				t4.slide(j);
				return false;
			}
		})();
	}
	var t4=new TouchSlider('slider4',{speed:1000, direction:0, interval:6000, fullsize:true});
	t4.on('before',function(m,n){
	    as[m].className='';
		as[n].className='active';
	})
}
// 定位城市  目的地
var bia = $(".desti_ul");
var newly = $(".content_new .new");
var inp_val = $(".form-control");
function muddd(){
	var getLg;
    var getLt;
	var map, geolocation;
	var tx = $(".desti_ul li:eq(0)");
	tx.children().text("定位中...");
	tx.addClass("txe");

	    //加载地图，调用浏览器定位服务
	    map = new AMap.Map('container', {
	        resizeEnable: true
	    });
	    map.plugin('AMap.Geolocation', function() {
	        geolocation = new AMap.Geolocation({
	            enableHighAccuracy: true,//是否使用高精度定位，默认:true
	            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
	            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	            buttonPosition:'RB'
	        });
	        map.addControl(geolocation);
	        geolocation.getCurrentPosition();
	        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
	        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
	    });
	    //解析定位结果
	    function onComplete(data) {
	        var str=['定位成功'];
	       str.push('经度：' +'<div>' + data.position.getLng() +'</div>');
	       str.push('纬度：' + '<p>' + data.position.getLat() +'</p>');
	       str.push('精度：' + data.accuracy + ' 米');
	       str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
	       document.getElementById('tip').innerHTML = str.join('<br>');
	       getLg = $("#tip div").text(); //经度
		   getLt = $("#tip p").text();  //纬度
		   hsd();
	    }
	    //解析定位错误信息
	    function onError(data) {
	        document.getElementById('tip').innerHTML = '定位失败';
	    }
	    //经纬度转换
	    function hsd() {
	       lnglatXY = [getLg,getLt]; //已知点坐标
	       //lnglatXY = [113.93543464479588,22.527765169768482]; //已知点坐标
	       //alert(lnglatXY);
	        var geocoder = new AMap.Geocoder({
	            radius: 1000,
	            extensions: "all"
	        });
	        geocoder.getAddress(lnglatXY, function(status, result) {
	            if (status === 'complete' && result.info === 'OK') {
	                geocoder_CallBack(result);
	            }
	        });
	        var marker = new AMap.Marker({  //加点
	            map: map,
	            position: lnglatXY
	        });
	        map.setFitView();
	        function geocoder_CallBack(data) {
	            var address = data.regeocode.addressComponent.city; //返回地址描述
	            $(".desti_ul li:eq(0) a").text(address);
	           //console.log(address);
	        };
	    };
	    bann(); //轮播
	    oCity(bia);
	    aSort();
}
// 目的地  选择城市
function oCity(e){
	e.children().click(function (){
		$(this).addClass("txe_1");
		$(this).siblings().removeClass("txe_1");
		var nn = $(this).children().text();
		inp_val.val(nn);
	});
}
// 城市排序 a b c d 固定定位
function aSort(){
		var arry = []; //a
		var arr = []; //字母
		var r = $(".city_box .desti_ul").offset().top;
		var re = $(".city_box .dest_tite").offset().top+15+"px";
		var le = $(".sort_box .sort_titme");
		$(".right_side").css({"position":"fixed","top":re});
		for(var p=0;p<le.length;p++)
		{
			var p1 = le.eq(p).find("a").eq(p).offset()//.top;
			arry.push(p1);
		}
		$(window).scroll(function(){
	        var before = $(window).scrollTop();
	        $(window).scroll(function() {
	        	//变量after就是滚动条滚动时，到顶部的距离
	        	var after = $(window).scrollTop();
	        	//上
	            if (before<after) {
	                before = after;
	                for(var i=0;i<le.length;i++)
	    		    {
	    		    	var p = le.eq(i).offset().top;
	    		    	arr.push(p);
	    		    	if(after >= p)
	    		    	{
	    		    		le.eq(i).find("h6").css({"position":"fixed","top":"0"});
	    		    	}
	    		    }
	    		    //right 定位城市
		        	if(after >=r) {
			        	//当拖动到距离顶部r处时，左边导航固定，不随滚动条滚动
			            $(".right_side").css({"position":"fixed","top":"4px"});
		        	}else{
			        	//恢复正常
			        	$(".right_side").css({"position":"absolute","top":r});
		        	}
	            };
	            //下
	            if (before>after) {
	            	before = after;
	                for(var i=0;i<arry.length;i++)
	           		{
	           			if(after <= arry[i])
	           			{
	           				le.eq(i).find("h6").css({"position":"initial","top":"0"});
	           			}
	           		}
	           		 //right 定位城市
		        	if(after >=r-20) {
			        	//当拖动到距离顶部r处时，左边导航固定，不随滚动条滚动
			            $(".right_side").css({"position":"fixed","top":"4px"});
		        	}else{
			        	//恢复正常
			        	$(".right_side").css({"position":"absolute","top":re});
		        	}
	            };
	        });
	    });
}

// 客服  弹窗  取消
// 显示
function cservice(obj){
	var $this = $(obj);
	var oDial = document.getElementById("dial");
	$this.parents("body").append('<div class="dial_box" id="dial"><div class="dial_box1"><h1>客服热线：0871-67335922</h1><div><a class="an" href="tel:08716733592">拨打</a><a class="an" onclick="Closet(this)" href="javascript:void(0)">取消</a></div></div></div>');
	oDial.style.display = "block";
}
// 隐藏
function Closet(obj){
	var $this = $(obj);
	$this.parents(".dial_box").remove();
};

// 新增限制
function added(obj){
	var $this = $(obj);
	var len = newly.children();
	if(len.length > 10)
	{
		$(".sup").slideDown();
	}
}
// 直飞地
function openClick(obj){
	var $this = $(obj);
	var su = $this.attr("name");
	if(su == 1)
	{	$this.attr("name","0");
		$this.children(".box_nxt").show();
		$this.find(".tu_biao").css({"background-image":"url("+path+"/static/images/mem_bott.png)","background-size":"12px"});
		// $this.siblings().children(".box_nxt").hide();
	}else{
		$this.attr("name","1");
		$this.find(".tu_biao").css({"background-image":"url("+path+"/static/images/mem_left.png)","background-size":"7px"});
		$this.children(".box_nxt").hide();
	}
}
// 选择出行人数
function goxu_bak(obj){
	var $this = $(obj);
	var gox = $this.attr("name");
	if(gox == 1 || gox == undefined)
	{
		$this.attr("name","0");
		$this.addClass("go_xuan");
		var n = $(".go_xuan").length;
		$(".sel_top .color_s").text(n);
	}else{
		$this.attr("name","1");
		$this.removeClass("go_xuan");
		var n = $(".go_xuan").length;
		$(".sel_top .color_s").text(n);
	}
	
	// $this.parent().siblings().find(".wgo").removeClass("go_xuan");
}
// 弹窗
function muxin(){
	$(".popup_box").show();
}
$(".popup_box").click(function(event) {
  $(this).hide();
});

//选择旅客
function goxu(obj){//alert(1);
	var $this = $(obj);
	var gox = $this.attr("name");
	if(gox == 1 || gox == undefined)
	{
		$this.attr("name","0");
		$this.addClass("go_xuan");
		var n = $(".go_xuan").length;
		$(".sel_top .color_s").text(n);console.log("gox=",gox,$this,$this.parent());
		//$this.parent().append(" <input type='hidden' name='orderId' vlaue='xxx' id='orderId'/>");
		$this.parent().find('input').removeAttr("name");//.attr("name","444");
		console.log(document.getElementById('orderId'));
	}else{
		$this.attr("name","1");
		$this.removeClass("go_xuan");
		var n = $(".go_xuan").length;
		$(".sel_top .color_s").text(n);
	}
	// $this.parent().siblings().find(".wgo").removeClass("go_xuan");
}

// 支付中心  选择支付
var isChoice = false;//判断是否已被选中
function Choiceq(obj,index){
	var $this = $(obj);
	if(isChoice){
		$this.removeClass('choice');
		$this.parent().siblings().children().addClass('choice');
		$("#pay").attr("href","");
	}else{
		$this.addClass("choice");
		$this.parent().siblings().children().removeClass('choice');
		var orderNumber = $("#orderNumber").val();
		var basePath = $("#basePath").val();
//		$("#pay").attr("href",basePath+"/reserve/paymentm?state="+orderNumber+"&code="+index);
		$("#pay").attr("href",basePath+"/reserve/selectPay?state="+orderNumber);
	}
	isChoice = !isChoice;
}


// 数据加载
function bottomLoad(we){
	$(window).scroll(function(){
        var before = $(window).scrollTop();
        $(window).scroll(function() {
            var after = $(window).scrollTop();
            if (before<after) {
                before = after;
                var bot = 0; //bot是底部距离的高度
		       if ((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
		          //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
		           //我们需要去异步加载数据了
		           if(we == 1)
		           {
		           		/*$("body").append('<div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div>');
		           		alert("列表页");*/
		           }else{
		           		/*$("body").append('<div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div><div class="tite_order"><span></span>昆明直飞丽江【邂逅·云淡风轻】2晚3天自由行 入住丽江晓zhu驻匠心精品酒店</div>');
		           		alert("我的订单页");*/
		           }
		       }
            };
        });
    });
}
var controlIsLe = 0;//那个按钮
var currentIndex = 0;//目前点击的Index,li
var taocanList = [];
function footscroll(){
	// 判断滚动条位置
	$(window).scroll(function() {
		var fos = $(window).scrollTop();
		if(fos > 10)
		{
			$(".footer_list").slideUp()
		}else{
			$(".footer_list").slideDown()
		}
	});
	// 切换效果
	$(".footer_list .fo_im").eq(0).attr("name","1");
	$(".footer_list .fo_im").eq(1).attr("name","2");
	$(".footer_list .fo_im").on('click touchstart',function(e) {
		var le = $(this).attr("name");
		$(this).css("background","#2a313f");
		$(this).children("p").css("color","#ca1f31");
		$(this).children("em").addClass("em_col");
		$(this).siblings().children("em").removeClass("em_col");
		$(this).children("div").addClass("img_to1");
		$(this).children("div").removeClass("img_to");
		e.preventDefault();
		$(".bo_t_lisr .bo_bottom").children('li').remove();
		controlIsLe = le;
		// 显示筛选弹窗
		if(le == "1")
		{
			$(this).parent().siblings(".bo_t").show();
			
			$(".bo_t_lisr .bo_bottom").append("<li class=\"left bo_li\"> <span>￥1~￥1000</span> </li> <li class=\"left \"> <span>￥1001~￥2000</span> </li> <li class=\"left \"> <span>￥2000以上</span> </li> ");
			
			$(this).parent().siblings(".bo_t").children().slideDown();
		}else if(le == "2"){
			$(this).parent().siblings(".bo_t").show();
			
			$(".bo_t_lisr .bo_bottom").append("<li class=\"left bo_li\" > <span>从低到高</span> </li> <li class=\"left \" > <span>从高到低</span> </li> ");
			
			$(this).parent().siblings(".bo_t").children().slideDown();
		}
		$(".bo_bottom").on("click","li",function (){
			$(this).addClass("bo_li");
			$(this).siblings().removeClass("bo_li");
			currentIndex = $(this).index();console.log(controlIsLe,$(this).index(),currentIndex);
			
		});
	})
	$(".footer_list .fo_im").on('click touchend',function(e) {
		$(this).css("background","#474E5F");
		$(this).children("p").css("color","#fff");
		$(this).children("div").addClass("img_to");
		$(this).children("div").removeClass("img_to1");
	})
	// 选择价格
	$(".bo_bottom li").click(function(){
		$(this).addClass("bo_li");
		$(this).siblings().removeClass("bo_li");
		currentIndex = $(this).index();console.log(controlIsLe,$(this).index(),currentIndex);
	})
}
// 筛选弹窗
function tou(obj){
	var $this = $(obj);	
	$this.parents(".bo_t").hide();
	$this.parents(".bo_t").children().slideUp();
	if(controlIsLe == 1){
		shuaxuanPrice(currentIndex);
		
	}else if(controlIsLe == 2){
		sortByPrice(currentIndex);
		
	}else if(controlIsLe == 3){
		cplistCombeHandler();
	}
}
function touquit(obj){
	var $this = $(obj);	
	$this.parents(".bo_t").hide();
	$this.parents(".bo_t").children().slideUp();
}
// 验证码倒计时
function second(obj){
	var phone = $("#phone").val();
	var password = $("#code").val();
	var _this = $(obj);	
	if(phone=="" || phone==undefined){
		$(".pho").text("请输入手机号码！");
        $(".pho").show();  //显示提示
		return; 
	}
	
	if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
    	$(".pho").text("手机号码有误，请重新填写！");
        $(".pho").show();  //显示提示
        return false; 
    } 
	var att = _this.attr("name");	
	// 发起请求
	$.ajax({ 
		type:"get",
		url:path+"/sms/send", 
		data:{"mobile":phone}, 
		success: function(string){
			if(string!="success"){
				alert(string);
			}
			return true;
		}
	});
	if(att == "1")
	{
		_this.attr("name","0");
		_this.children("span").text("60");
		_this.children("em").show();
		set(_this);
	}	
	return true;
}

function set(obj){
	var se = setInterval(function(){
		var t = obj.children("span").text();
		t--;
		obj.children("span").text(t);
		if(t == -1)
		{
			clearInterval(se);
			obj.children("span").text("重新发验证码");
			obj.children("em").hide();
			obj.attr("name","1");
		}
	},1000);
}

/*设置底部导航*/
var setFooterFontStyle = function(index){
	//去除所有样式
	$(".footer").find("a").each(function(index,obj){
		$(this).removeClass("fo_cor");
		$(this).find("img").attr("src","images/bo_b"+index+".png");
	});
	//添加样式
	$(".footer").find("a").eq(index).addClass("fo_cor");
	$(".footer").find("a").eq(index).find("img").attr("src","images/red_b"+index+".png");
};

var cuslee= $(".su_box #cusle");
var divsele= $(".su_box #sele");

//目的地 城市

function destins(e){//console.log(e);
if(cityListDIV.style.visibility=="hidden"){
	cityListDIV.style.visibility="visible";
	cityListDIV.style.top = 112+20+"px";
}
arriveCityListDIV.style.visibility = "hidden";
//document.getElementById("cusle").placeholder = cuslee.val();
//cuslee.attr('placeholder',cuslee.val());
cuslee.val("");

}
var arriveCityList = {};//对应出发地的目的地
function sele(obj) {
	//清空目的地下拉列表
	$("#sele").html("");
	//获取出发地选择的城市国际航空码(三字码)
	//var cusleValue = $("#cusle option:selected").val();
	var $this = $(obj);
	var nam = $this.attr("name");
	//if(nam == 0){
		$this.attr("name","1");
		$.ajax({
			type:"get",
			url:path+"/queryDestination",
			dateType:"jsonp",
			data:{"cityid":currentCityId},
			success:function(date){
				arriveCityList[currentCityId]=date;
				$("#arriveCityListDIV .desti_ul").children('li').remove();
				for(var i=0;i<date.length;i++){
					if(date[i].indexSpell)
						date[i].indexSpell = date[i].indexSpell.toLowerCase();
					if(date[i].spell)
						date[i].spell = date[i].spell.toLowerCase();
					//$this.append("<option value="+date[i].cityId+" name="+date[i].cityId+">"+date[i].shortName+"</option>");
					$("#arriveCityListDIV .desti_ul").append("<li><a  onClick='clickArriveCity("+i+")'>"+date[i].shortName+"</a></li>");
				}
				
				//点击搜索跳产品页面
				//indexCplist();
			}
		})
	//}
}

//保存出发城市数据
var cusleCityList = [];
var currentCityId = 0;//当前出发的城市ID
var currentArriveCityId = 0;//达到城市ID
//出发地 城市
function cusle(obj) {
	var $this = $(obj);
	var nam = $this.attr("name");
	if(nam == 0){
		$this.attr("name","1");
		$.ajax({
			type:"get",
			url:path+"/queryDeparture",
			dateType:"jsonp",
			success:function(date){
				cusleCityList = date;
				$("#cityListDIV .desti_ul").children('li').remove();
				for(var i=0;i<date.length;i++){
//					if(date[i].codeIATA=='KMG'){
//						$this.append("<option value="+date[i].codeIATA+" selected='selected' name="+date[i].cityId+">"+date[i].shortName+"</option>");
//					}else{
//						$this.append("<option value="+date[i].codeIATA+" name="+date[i].cityId+">"+date[i].shortName+"</option>");
//					} 
					
					if(date[i].codeIATA && date[i].codeIATA.toLowerCase()=='KMG'.toLowerCase()){
						cuslee.val(date[i].shortName/*+"/"+date[i].spell+"/"+date[i].indexSpell*/);
						currentArriveCityId = currentCityId = date[i].cityId;
						
					}
					if(date[i].indexSpell)
						date[i].indexSpell = date[i].indexSpell.toLowerCase();
					if(date[i].spell)
						date[i].spell = date[i].spell.toLowerCase();
					
					if(date[i].shortName)$("#cityListDIV .desti_ul").append("<li><a  onClick='clickCity("+i+")'>"+date[i].shortName+"</a></li>");
				}
//				$("#cityListDIV .sort_box do_h_3").on("click","li",function (){
//					cuslee.val(cusleCityList[$(this).index()].shortName);alert(999);
//				});
				//获取目的地{"cityId":124,"shortName":"兰州","codeIATA":"LHW","spell":"lanzhou","indexSpell":"lz","ifhotCity":1,"indexName":"L-兰州"}
				sele(divsele);
			}
		})
	}
}


//点击搜索跳产品页面
function indexCplist(e){
	//出发地城市ID
	//var cityId = $("#cusle option:selected").attr("name");
	//var arriveCity = $("#sele option:selected").attr("name");
	//目的地城市ID
	//var arriveCity= $("#sele option:selected").val();
	//$('#cplistId').attr('href',path+"/queryIndexGoods?cityId="+cityId+"&arriveCity="+arriveCity); 
	//document.getElementById("sele").placeholder = divsele.val();
	divsele.val("");


	if(arriveCityListDIV.style.visibility=="hidden"){
		arriveCityListDIV.style.visibility="visible";
		arriveCityListDIV.style.top = 155+20+"px";
	}
}

function clickCity(e){
	currentCityId = cusleCityList[e].cityId;
	cuslee.val(cusleCityList[e].shortName/*+"/"+cusleCityList[e].spell+"/"+cusleCityList[e].indexSpell*/);
	cityListDIV.style.visibility = "hidden";
	sele(divsele);
}
var currentIndexArrive = -1;
function clickArriveCity(e){
	divsele.val(arriveCityList[currentCityId][e].shortName/*+"/"+arriveCityList[currentCityId][e].spell+"/"+arriveCityList[currentCityId][e].indexSpell*/);
	currentArriveCityId=arriveCityList[currentCityId][e].cityId;
	currentIndexArrive = e;
	arriveCityListDIV.style.visibility = "hidden";
}
function destinsChange(){
	console.log("6");
}
cuslee.keyup(function(){
	
	console.log("9");
	$("#cityListDIV .desti_ul").children('li').remove();
	for( var i = 0, m = cusleCityList.length; i< m ; i++){
		var msg = cusleCityList[i];console.log(cuslee.val(),msg.spell);
		if((msg.indexSpell&&msg.indexSpell.indexOf(cuslee.val().toLowerCase())!=-1)||(msg.spell&&msg.spell.indexOf(cuslee.val().toLowerCase())!=-1)||msg.shortName.indexOf(cuslee.val())!=-1){
			$("#cityListDIV .desti_ul").append("<li><a  onClick='clickCity("+i+")'>"+msg.shortName+"</a></li>");
		}
		
	}
});
divsele.keyup(function(){
	
	//console.log("5");
	$("#arriveCityListDIV .desti_ul").children('li').remove();
	for( var i = 0, m = arriveCityList[currentCityId].length; i< m ; i++){
		var msg = arriveCityList[currentCityId][i];console.log(divsele.val(),msg.spell);
		if((msg.indexSpell&&msg.indexSpell.indexOf(divsele.val().toLowerCase())!=-1)||(msg.spell&&msg.spell.indexOf(divsele.val().toLowerCase())!=-1)||msg.shortName.indexOf(divsele.val())!=-1){
			$("#arriveCityListDIV .desti_ul").append("<li><a  onClick='clickArriveCity("+i+")'>"+msg.shortName+"</a></li>");
		}
	}
});

function queryIndexGoods(){
	var codeIATA,arrCodeIATA;
	for(var i=0,m=cusleCityList.length;i<m;i++){
		var a = cusleCityList[i];
		var b = cuslee.val();
		if(b.indexOf(a.shortName)!=-1){
			currentCityId = a.cityId;
			codeIATA = a.codeIATA;
			for(var j=0,n=arriveCityList[currentCityId].length;j<n;j++){
				var c =  arriveCityList[currentCityId][j];
				var d = divsele.val();
				if( d.indexOf(c.shortName)!=-1 ){
					currentArriveCityId = arriveCityList[currentCityId][j].cityId;
					arrCodeIATA = arriveCityList[currentCityId][j].codeIATA;
					break;
				}
			}
			break;
		}
	}
	
	//cplistId.href = path+"/queryIndexGoods?cityId="+currentCityId+"&arriveCity="+currentArriveCityId;
	cplistId.href = path+"/queryIndexGoods?codeIATA="+codeIATA+"&arrCodeIATA="+arrCodeIATA;
	
}
var destinId= $("#destinId");
destinId.keyup(function(){
	if(cityListDIV.style.visibility=="hidden"){
		cityListDIV.style.visibility="visible";
		cityListDIV.style.top = $(".swipe").outerHeight(true)+$(".search_box").outerHeight(true)+"px";//182+"px";
	}
	//console.log("8");
	$("#cityListDIV .desti_ul").children('li').remove();
	for( var i = 0, m = cityLists.length; i< m ; i++){
		var msg = cityLists[i];
		if((msg.indexSpell&&msg.indexSpell.indexOf(destinId.val().toLowerCase())!=-1)||(msg.spell&&msg.spell.indexOf(destinId.val().toLowerCase())!=-1)||msg.shortName.indexOf(destinId.val())!=-1){
			$("#cityListDIV .desti_ul").append("<li><a  onClick='clickDestinIdCity("+i+")'>"+msg.shortName+"</a></li>");//console.log(destinId.val(),msg.spell);
		}
		
	}
});
function clickDestinIdCity(e){
	destinId.val(cityLists[e].shortName/*+"/"+arriveCityList[currentCityId][e].spell+"/"+arriveCityList[currentCityId][e].indexSpell*/);
	currentArriveCityId=cityLists[e].cityId;
	currentIndexArrive = e;
	cityListDIV.style.visibility = "hidden";
}
function destinIdClick(){//console.log($(".swipe").outerHeight(true),$(".search_box").outerHeight(true));
	if(cityListDIV.style.visibility=="hidden"){
		cityListDIV.style.visibility="visible";
		cityListDIV.style.top = cityListDIV.style.top = $(".swipe").outerHeight(true)+$(".search_box").outerHeight(true)+"px";//182+"px";
	}
	$("#cityListDIV .desti_ul").children('li').remove();
	for( var i = 0, m = cityLists.length; i< m ; i++){
		var msg = cityLists[i];
		if((msg.indexSpell&&msg.indexSpell.indexOf(destinId.val().toLowerCase())!=-1)||(msg.spell&&msg.spell.indexOf(destinId.val().toLowerCase())!=-1)||msg.shortName.indexOf(destinId.val())!=-1){
			$("#cityListDIV .desti_ul").append("<li><a  onClick='clickDestinIdCity("+i+")'>"+msg.shortName+"</a></li>");//console.log(destinId.val(),msg.spell);
		}
		
	}
	destinId.val("");
}
function queryDestination(){
	var arrCodeIATA;
	for(var i=0,m=cityLists.length;i<m;i++){
		var a = cityLists[i];
		var b = destinId.val();
		arrCodeIATA = a.codeIATA;
		if(a.shortName=="昆明"){
			currentArriveCityId = a.cityId;
		}
		if(b.indexOf(a.shortName)!=-1){
			currentArriveCityId = a.cityId;
			break; 
		}
	} 
	cplistId.href = path+"/destination/seekCityId?cityId="+currentArriveCityId+"&arrCodeIATA="+arrCodeIATA;
}
//套餐刷选
function taoCanClick(v){
	controlIsLe = 3;
	$.ajax({
		type:"get",
		url:path+"/cplistGoods/queryCplistCombo",
		dateType:"jsonp",
		data:{"goodsId":v},
		success:function(date){
			
			//console.log(date);
			for( var i=0,m=date.length;i<m;i++ ){
				for(var j=i+1;j<m;j++){
					if(date[i].roomPrice>date[j].roomPrice){
						var tmp = date[i];
						 date[i] = date[j];
						 date[j] = tmp;
					}
				}
			}
			taocanList = date;//
			$(".bo_t_lisr .bo_bottom").children('li').remove();
			// 套餐刷选弹窗
			$(".footer_list .fo_im").parent().siblings(".bo_t").show();
			for(var i=0;i<date.length;i++){
				var item = date[i];
				var price = (item.roomPrice+"");
				var pindex= price.indexOf('.');console.log(price,pindex,parseInt(price.substring(pindex)));
				if(pindex!=-1 && parseInt(price.substring(pindex))==0){
					
					console.log(item.roomPrice);
				}
				if(i==0)
					$(".bo_t_lisr .bo_bottom").append("<li class=\"left bo_li\"> <p>"+item.comboName+"</p><span>￥"+Math.floor(item.comboPrice/item.leasts)+"/人</span> </li>  ");
				else
					$(".bo_t_lisr .bo_bottom").append(" <li class=\"left \"> <p>"+item.comboName+"</p><span>￥"+Math.floor(item.comboPrice/item.leasts)+"/人</span> </li>  ");
				//console.log($(".bo_t_lisr .bo_bottom"));
				
			}
			$(".bo_bottom li").click(function(){
				$(this).addClass("bo_li");
				$(this).siblings().removeClass("bo_li");
				currentIndex = $(this).index();console.log(controlIsLe,$(this).index(),currentIndex);
			})
			$(".footer_list .fo_im").parent().siblings(".bo_t").children().slideDown();
			
		}
	})
}
//排序价格,s=0从低到高
function sortByPrice(s){
	for(var i=0,m=colistTmp.length;i<m;i++){
		for(var j=i+1;j<m;j++){
			if((colistTmp[i].comboPrice>colistTmp[j].comboPrice&& s==0) ||(colistTmp[i].comboPrice<colistTmp[j].comboPrice&& s==1)){
				var tmp = colistTmp[i];
				colistTmp[i] = colistTmp[j];
				colistTmp[j] = tmp;
			}
		}
	}
	$(".cont_list").children('div').remove();
	for(var i=0,m=colistTmp.length;i<m;i++){
		var item = colistTmp[i];
		$(".cont_list").append("<div class=\"box_list\"><a onclick=\"taoCanClick("+item.goodsId+")\"><div class=\"left\"><img src=\""+item.coverImageUrl+"\" style=\"heigth:100%\"></div><div class=\"right\"><p>"+item.goodName+"</p><em class=\"em_list1\">"+item.stayDay+"晚"+item.journeyDay+"</em><em class=\"em_list2\">"+item.shortName+"</em><div class=\"div_list\"><i>￥</i><span>"+item.comboPrice+"</span><i>/人</i></div></div><div class=\"clear\"></div></a></div> ");
	}
	currentIndex = 0;
}

//刷选价格e价格区间
function shuaxuanPrice(e){
	var s,t;
	if(e==0){
		s=1;
		t=1000;
	}else if(e==1){
		s=1001;
		t=2000;
	}else if(e==2){
		s=2001;
		t=1000000;
	}
	$(".cont_list").children('div').remove();//console.log("s",s,t);
	for(var i=0,m=colistTmp.length;i<m;i++){
		var item = colistTmp[i];
		if(item.comboPrice>=s&&item.comboPrice<=t){
			$(".cont_list").append("<div class=\"box_list\"><a onclick=\"taoCanClick("+item.goodsId+")\"><div class=\"left\"><img src=\""+item.coverImageUrl+"\" style=\"heigth:100%\"></div><div class=\"right\"><p>"+item.goodName+"</p><em class=\"em_list1\">"+item.stayDay+"晚"+item.journeyDay+"</em><em class=\"em_list2\">"+item.shortName+"</em><div class=\"div_list\"><i>￥</i><span>"+item.comboPrice+"</span><i>/人</i></div></div><div class=\"clear\"></div></a></div> ");
		}
	}
	currentIndex = 0;
}

function cplistCombeHandler(){
	/*$.ajax({
		type:"get",
		url:path+"/queryIndexGoodsCplist",//http://192.168.1.121/km_airhotel/cplistGoods/queryCplistInventory?goodsId=299&goodsPriceId=4
		dateType:"jsonp",
		data:{"goodsId":taocanList[currentIndex].goodsId,"goodsPriceId":taocanList[currentIndex].goodsPriceId},
		success:function(date){
			
		}
	});*/
	window.location.href = path+"/queryIndexGoodsCplist?goodsId="+taocanList[currentIndex].goodsId+"&goodsPriceId="+taocanList[currentIndex].goodsPriceId;
}
(function(){
	
	//从接口获取初始化数据
	  function startNewInit(){
	  	$.ajax({
	  		type:"get",
	  		url:path+"/cplistGoods/queryCplistInventory",
	  		dateType:"jsonp",
	  		data:{"goodsId":goodsId ,"goodsPriceId":goodsPriceId  },
	  		success:function(date){
	  			var d1 = new Date();
	  			var b = d1.getDate(); 
	  			for(var i=0;i<date.length;i++){
	  				var item = date[i];
	  				var dat = new Date(item.travelTime);
	  				
	  				item.day = dat.getDate();
	  				//dat.setSeconds(item.travelTime) ;
	  				console.log("date=",dat);
	  				$(".date_title .date_ul").append("<li class=\"bei_data\"><a href=\"${basePath }/date?goodsId=${cplistGoodsDetail.goodsId }&goodsPriceId=${cplistGoodsDetail.goodsPriceId }&comboPrice=${cplistGoodsDetail.comboPrice }\">"+dateGoods[0]+"<p>"+dateGoods[1]+"-"+dateGoods[2]+" }</p></a></li>");
	  			}
	  			
	  			
	  		}
	  	})
	  }
	
})();
(function(){
	if( $(".xin_z").find("li").length > 0 ){
		$(".xin_z").css({"height":"auto"});
	}
})();
//产品列表的
(function(){
	var priceList = $(".div_list").find("span");//console.log(priceList,"------------");
	for(var i=0,m=priceList.length;i<m;i++){
		var price = priceList[i].innerHTML;
		var pindex= price.indexOf('.')+1;console.log(price,pindex,parseInt(price.substring(pindex)));
		if(pindex!=-1 && parseInt(price.substring(pindex))==0){
			priceList[i].innerHTML = price.substring(0,pindex-1);
			//console.log(item.roomPrice);
		}
	}
})();
//热门推荐的
(function(){
	var priceList = $(".hot_box_tite").find("li").find("span");//console.log(priceList,"------------");
	for(var i=0,m=priceList.length;i<m;i++){
		var price = priceList[i].innerHTML;
		var pindex= price.indexOf('.')+1;console.log(price,pindex,parseInt(price.substring(pindex)));
		if(pindex!=-1 && parseInt(price.substring(pindex))==0){
			priceList[i].innerHTML = price.substring(0,pindex-1)+"<em>/人</em>";
			//console.log(item.roomPrice);
		}
	}
})();
//产品详情
(function(){
	var priceList = $(".width_p2").find("p").find("span");console.log(priceList,"------------");
	for(var i=0,m=priceList.length;i<m;i++){
		var price = priceList[i].innerHTML;
		var pindex= price.indexOf('.')+1;console.log(price,pindex,parseInt(price.substring(pindex)));
		if(pindex!=-1 && parseInt(price.substring(pindex))==0){
			priceList[i].innerHTML =price.substring(0,pindex-1);
			//console.log(item.roomPrice);
		}
	}
})();
//首页
(function(){
	var priceList = $(".content_box").find("li").find("span");//console.log(priceList,"------------");
	for(var i=0,m=priceList.length;i<m;i++){
		var price = priceList[i].innerHTML;
		var pindex= price.indexOf('.')+1;console.log(price,pindex,parseInt(price.substring(pindex)));
		if(pindex!=-1 && parseInt(price.substring(pindex))==0){
			priceList[i].innerHTML = price.substring(0,pindex-1)+"<em>/人</em>";
			//console.log(item.roomPrice);
		}
	}
})();
