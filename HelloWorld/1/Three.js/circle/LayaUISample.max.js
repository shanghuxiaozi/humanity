var window = window || global;
var document = document || (window.document = {});
/***********************************/
/*http://www.layabox.com  2017/3/23*/
/***********************************/
var Laya=window.Laya=(function(window,document){
	var Laya={
		__internals:[],
		__packages:{},
		__classmap:{'Object':Object,'Function':Function,'Array':Array,'String':String},
		__sysClass:{'object':'Object','array':'Array','string':'String','dictionary':'Dictionary'},
		__propun:{writable: true,enumerable: false,configurable: true},
		__presubstr:String.prototype.substr,
		__substr:function(ofs,sz){return arguments.length==1?Laya.__presubstr.call(this,ofs):Laya.__presubstr.call(this,ofs,sz>0?sz:(this.length+sz));},
		__init:function(_classs){_classs.forEach(function(o){o.__init$ && o.__init$();});},
		__isClass:function(o){return o && (o.__isclass || o==Object || o==String || o==Array);},
		__newvec:function(sz,value){
			var d=[];
			d.length=sz;
			for(var i=0;i<sz;i++) d[i]=value;
			return d;
		},
		__extend:function(d,b){
			for (var p in b){
				if (!b.hasOwnProperty(p)) continue;
				var gs=Object.getOwnPropertyDescriptor(b, p);
				var g = gs.get, s = gs.set; 
				if ( g || s ) {
					if ( g && s)
						Object.defineProperty(d,p,gs);
					else{
						g && Object.defineProperty(d, p, g);
						s && Object.defineProperty(d, p, s);
					}
				}
				else d[p] = b[p];
			}
			function __() { Laya.un(this,'constructor',d); }__.prototype=b.prototype;d.prototype=new __();Laya.un(d.prototype,'__imps',Laya.__copy({},b.prototype.__imps));
		},
		__copy:function(dec,src){
			if(!src) return null;
			dec=dec||{};
			for(var i in src) dec[i]=src[i];
			return dec;
		},
		__package:function(name,o){
			if(Laya.__packages[name]) return;
			Laya.__packages[name]=true;
			var p=window,strs=name.split('.');
			if(strs.length>1){
				for(var i=0,sz=strs.length-1;i<sz;i++){
					var c=p[strs[i]];
					p=c?c:(p[strs[i]]={});
				}
			}
			p[strs[strs.length-1]] || (p[strs[strs.length-1]]=o||{});
		},
		__hasOwnProperty:function(name,o){
			o=o ||this;
		    function classHas(name,o){
				if(Object.hasOwnProperty.call(o.prototype,name)) return true;
				var s=o.prototype.__super;
				return s==null?null:classHas(name,s);
			}
			return (Object.hasOwnProperty.call(o,name)) || classHas(name,o.__class);
		},
		__typeof:function(o,value){
			if(!o || !value) return false;
			if(value===String) return (typeof o==='string');
			if(value===Number) return (typeof o==='number');
			if(value.__interface__) value=value.__interface__;
			else if(typeof value!='string')  return (o instanceof value);
			return (o.__imps && o.__imps[value]) || (o.__class==value);
		},
		__as:function(value,type){
			return (this.__typeof(value,type))?value:null;
		},		
		interface:function(name,_super){
			Laya.__package(name,{});
			var ins=Laya.__internals;
			var a=ins[name]=ins[name] || {self:name};
			if(_super)
			{
				var supers=_super.split(',');
				a.extend=[];
				for(var i=0;i<supers.length;i++){
					var nm=supers[i];
					ins[nm]=ins[nm] || {self:nm};
					a.extend.push(ins[nm]);
				}
			}
			var o=window,words=name.split('.');
			for(var i=0;i<words.length-1;i++) o=o[words[i]];
			o[words[words.length-1]]={__interface__:name};
		},
		class:function(o,fullName,_super,miniName){
			_super && Laya.__extend(o,_super);
			if(fullName){
				Laya.__package(fullName,o);
				Laya.__classmap[fullName]=o;
				if(fullName.indexOf('.')>0){
					if(fullName.indexOf('laya.')==0){
						var paths=fullName.split('.');
						miniName=miniName || paths[paths.length-1];
						if(Laya[miniName]) console.log("Warning!,this class["+miniName+"] already exist:",Laya[miniName]);
						Laya[miniName]=o;
					}
				}
				else {
					if(fullName=="Main")
						window.Main=o;
					else{
						if(Laya[fullName]){
							console.log("Error!,this class["+fullName+"] already exist:",Laya[fullName]);
						}
						Laya[fullName]=o;
					}
				}
			}
			var un=Laya.un,p=o.prototype;
			un(p,'hasOwnProperty',Laya.__hasOwnProperty);
			un(p,'__class',o);
			un(p,'__super',_super);
			un(p,'__className',fullName);
			un(o,'__super',_super);
			un(o,'__className',fullName);
			un(o,'__isclass',true);
			un(o,'super',function(o){this.__super.call(o);});
		},
		imps:function(dec,src){
			if(!src) return null;
			var d=dec.__imps|| Laya.un(dec,'__imps',{});
			function __(name){
				var c,exs;
				if(! (c=Laya.__internals[name]) ) return;
				d[name]=true;
				if(!(exs=c.extend)) return;
				for(var i=0;i<exs.length;i++){
					__(exs[i].self);
				}
			}
			for(var i in src) __(i);
		},
		getset:function(isStatic,o,name,getfn,setfn){
			if(!isStatic){
				getfn && Laya.un(o,'_$get_'+name,getfn);
				setfn && Laya.un(o,'_$set_'+name,setfn);
			}
			else{
				getfn && (o['_$GET_'+name]=getfn);
				setfn && (o['_$SET_'+name]=setfn);
			}
			if(getfn && setfn) 
				Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false});
			else{
				getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false});
				setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false});
			}
		},
		static:function(_class,def){
				for(var i=0,sz=def.length;i<sz;i+=2){
					if(def[i]=='length') 
						_class.length=def[i+1].call(_class);
					else{
						function tmp(){
							var name=def[i];
							var getfn=def[i+1];
							Object.defineProperty(_class,name,{
								get:function(){delete this[name];return this[name]=getfn.call(this);},
								set:function(v){delete this[name];this[name]=v;},enumerable: true,configurable: true});
						}
						tmp();
					}
				}
		},		
		un:function(obj,name,value){
			value || (value=obj[name]);
			Laya.__propun.value=value;
			Object.defineProperty(obj, name, Laya.__propun);
			return value;
		},
		uns:function(obj,names){
			names.forEach(function(o){Laya.un(obj,o)});
		}
	};

	window.console=window.console || ({log:function(){}});
	window.trace=window.console.log;
	Error.prototype.throwError=function(){throw arguments;};
	//String.prototype.substr=Laya.__substr;
	Object.defineProperty(Array.prototype,'fixed',{enumerable: false});

	return Laya;
})(window,document);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
	Laya.interface('laya.ui.IItem');
	Laya.interface('laya.ui.ISelect');
	Laya.interface('laya.runtime.IMarket');
	Laya.interface('laya.filters.IFilter');
	Laya.interface('laya.display.ILayout');
	Laya.interface('laya.resource.IDispose');
	Laya.interface('laya.runtime.IConchNode');
	Laya.interface('laya.filters.IFilterAction');
	Laya.interface('laya.runtime.ICPlatformClass');
	//class Laya
	var ___Laya=(function(){
		//function Laya(){};
		/**
		*表示是否捕获全局错误并弹出提示。默认为false。
		*适用于移动设备等不方便调试的时候，设置为true后，如有未知错误，可以弹窗抛出详细错误堆栈。
		*/
		__getset(1,Laya,'alertGlobalError',null,function(value){
			var erralert=0;
			if (value){
				Browser.window.onerror=function (msg,url,line,column,detail){
					if (erralert++< 5 && detail)
						alert("出错啦，请把此信息截图给研发商\n"+msg+"\n"+detail.stack);
				}
				}else {
				Browser.window.onerror=null;
			}
		});

		Laya.init=function(width,height,__plugins){
			var plugins=[];for(var i=2,sz=arguments.length;i<sz;i++)plugins.push(arguments[i]);
			if (Laya._isinit)return;
			ArrayBuffer.prototype.slice || (ArrayBuffer.prototype.slice=Laya._arrayBufferSlice);
			Laya._isinit=true;
			Browser.__init__();
			Context.__init__();
			Graphics.__init__();
			Laya.timer=new Timer();
			Laya.loader=new LoaderManager();
			for (var i=0,n=plugins.length;i < n;i++){
				if (plugins[i].enable)plugins[i].enable();
			}
			Font.__init__();
			Style.__init__();
			ResourceManager.__init__();
			CacheManger.beginCheck();
			Laya._currentStage=Laya.stage=new Stage();
			Laya.stage.conchModel && Laya.stage.conchModel.setRootNode();
			var location=Browser.window.location;
			var pathName=location.pathname;
			pathName=pathName.charAt(2)==':' ? pathName.substring(1):pathName;
			URL.rootPath=URL.basePath=URL.getPath(location.protocol=="file:" ? pathName :location.protocol+"//"+location.host+location.pathname);
			Laya.render=new Render(0,0);
			Laya.stage.size(width,height);
			RenderSprite.__init__();
			KeyBoardManager.__init__();
			MouseManager.instance.__init__(Laya.stage,Render.canvas);
			Input.__init__();
			SoundManager.autoStopMusic=true;
			LocalStorage.__init__();
			return Render.canvas;
		}

		Laya._arrayBufferSlice=function(start,end){
			var arr=this;
			var arrU8List=new Uint8Array(arr,start,end-start);
			var newU8List=new Uint8Array(arrU8List.length);
			newU8List.set(arrU8List);
			return newU8List.buffer;
		}

		Laya.stage=null;
		Laya.timer=null;
		Laya.loader=null;
		Laya.version="1.7.6";
		Laya.render=null
		Laya._currentStage=null
		Laya._isinit=false;
		__static(Laya,
		['conchMarket',function(){return this.conchMarket=window.conch?conchMarket:null;},'PlatformClass',function(){return this.PlatformClass=window.PlatformClass;}
		]);
		return Laya;
	})()


	//class trade.Trade
	var Trade=(function(){
		function Trade(){}
		__class(Trade,'trade.Trade');
		return Trade;
	})()


	//class LayaUISample
	var LayaUISample=(function(){
		function LayaUISample(){
			Laya.init(375,667);
			Laya.stage.bgColor=null;
			Laya.stage.scaleMode="exactfit";
			Laya.stage.mouseThrough=true;
			Laya.loader.load([{url:"res/atlas/comp.json",type:"atlas"},{url:"res/atlas/schedule.json",type:"atlas"},{url:"res/atlas/circle.json",type:"atlas"}],Handler.create(this,this.onLoaded));
		}

		__class(LayaUISample,'LayaUISample');
		var __proto=LayaUISample.prototype;
		__proto.onLoaded=function(){
			var circle=new Circle();
		}

		return LayaUISample;
	})()


	//class laya.events.EventDispatcher
	var EventDispatcher=(function(){
		var EventHandler;
		function EventDispatcher(){
			this._events=null;
		}

		__class(EventDispatcher,'laya.events.EventDispatcher');
		var __proto=EventDispatcher.prototype;
		/**
		*检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
		*@param type 事件的类型。
		*@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
		*/
		__proto.hasListener=function(type){
			var listener=this._events && this._events[type];
			return !!listener;
		}

		/**
		*派发事件。
		*@param type 事件类型。
		*@param data （可选）回调数据。<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
		*@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
		*/
		__proto.event=function(type,data){
			if (!this._events || !this._events[type])return false;
			var listeners=this._events[type];
			if (listeners.run){
				if (listeners.once)delete this._events[type];
				data !=null ? listeners.runWith(data):listeners.run();
				}else {
				for (var i=0,n=listeners.length;i < n;i++){
					var listener=listeners[i];
					if (listener){
						(data !=null)? listener.runWith(data):listener.run();
					}
					if (!listener || listener.once){
						listeners.splice(i,1);
						i--;
						n--;
					}
				}
				if (listeners.length===0 && this._events)delete this._events[type];
			}
			return true;
		}

		/**
		*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args （可选）事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.on=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,false);
		}

		/**
		*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args （可选）事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.once=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,true);
		}

		/**@private */
		__proto._createListener=function(type,caller,listener,args,once,offBefore){
			(offBefore===void 0)&& (offBefore=true);
			offBefore && this.off(type,caller,listener,once);
			var handler=EventHandler.create(caller || this,listener,args,once);
			this._events || (this._events={});
			var events=this._events;
			if (!events[type])events[type]=handler;
			else {
				if (!events[type].run)events[type].push(handler);
				else events[type]=[events[type],handler];
			}
			return this;
		}

		/**
		*从 EventDispatcher 对象中删除侦听器。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param onceOnly （可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.off=function(type,caller,listener,onceOnly){
			(onceOnly===void 0)&& (onceOnly=false);
			if (!this._events || !this._events[type])return this;
			var listeners=this._events[type];
			if (listener !=null){
				if (listeners.run){
					if ((!caller || listeners.caller===caller)&& listeners.method===listener && (!onceOnly || listeners.once)){
						delete this._events[type];
						listeners.recover();
					}
					}else {
					var count=0;
					for (var i=0,n=listeners.length;i < n;i++){
						var item=listeners[i];
						if (item && (!caller || item.caller===caller)&& item.method===listener && (!onceOnly || item.once)){
							count++;
							listeners[i]=null;
							item.recover();
						}
					}
					if (count===n)delete this._events[type];
				}
			}
			return this;
		}

		/**
		*从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
		*@param type （可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.offAll=function(type){
			var events=this._events;
			if (!events)return this;
			if (type){
				this._recoverHandlers(events[type]);
				delete events[type];
				}else {
				for (var name in events){
					this._recoverHandlers(events[name]);
				}
				this._events=null;
			}
			return this;
		}

		__proto._recoverHandlers=function(arr){
			if (!arr)return;
			if (arr.run){
				arr.recover();
				}else {
				for (var i=arr.length-1;i >-1;i--){
					if (arr[i]){
						arr[i].recover();
						arr[i]=null;
					}
				}
			}
		}

		/**
		*检测指定事件类型是否是鼠标事件。
		*@param type 事件的类型。
		*@return 如果是鼠标事件，则值为 true;否则，值为 false。
		*/
		__proto.isMouseEvent=function(type){
			return EventDispatcher.MOUSE_EVENTS[type];
		}

		EventDispatcher.MOUSE_EVENTS={"rightmousedown":true,"rightmouseup":true,"rightclick":true,"mousedown":true,"mouseup":true,"mousemove":true,"mouseover":true,"mouseout":true,"click":true,"doubleclick":true};
		EventDispatcher.__init$=function(){
			Object.defineProperty(laya.events.EventDispatcher.prototype,"_events",{enumerable:false,writable:true});
			/**@private */
			//class EventHandler extends laya.utils.Handler
			EventHandler=(function(_super){
				function EventHandler(caller,method,args,once){
					EventHandler.__super.call(this,caller,method,args,once);
				}
				__class(EventHandler,'',_super);
				var __proto=EventHandler.prototype;
				__proto.recover=function(){
					if (this._id > 0){
						this._id=0;
						EventHandler._pool.push(this.clear());
					}
				}
				EventHandler.create=function(caller,method,args,once){
					(once===void 0)&& (once=true);
					if (EventHandler._pool.length)return EventHandler._pool.pop().setTo(caller,method,args,once);
					return new EventHandler(caller,method,args,once);
				}
				EventHandler._pool=[];
				return EventHandler;
			})(Handler)
		}

		return EventDispatcher;
	})()


	//class Config
	var Config=(function(){
		function Config(){};
		__class(Config,'Config');
		Config.WebGLTextCacheCount=500;
		Config.atlasEnable=false;
		Config.showCanvasMark=false;
		Config.animationInterval=50;
		Config.isAntialias=false;
		Config.isAlpha=false;
		Config.premultipliedAlpha=true;
		Config.isStencil=true;
		Config.preserveDrawingBuffer=false;
		return Config;
	})()


	//class laya.display.Graphics
	var Graphics=(function(){
		function Graphics(){
			//this._sp=null;
			this._one=null;
			this._cmds=null;
			//this._temp=null;
			//this._bounds=null;
			//this._rstBoundPoints=null;
			//this._vectorgraphArray=null;
			this._cacheBoundsType=false;
			this._render=this._renderEmpty;
			if (Render.isConchNode){
				this._nativeObj=new _conchGraphics();;
				this.id=this._nativeObj.conchID;;
			}
		}

		__class(Graphics,'laya.display.Graphics');
		var __proto=Graphics.prototype;
		/**
		*<p>销毁此对象。</p>
		*/
		__proto.destroy=function(){
			this.clear();
			this._temp=null;
			this._bounds=null;
			this._rstBoundPoints=null;
			this._vectorgraphArray=null;
			this._sp && (this._sp._renderType=0);
			this._sp=null;
		}

		/**
		*<p>清空绘制命令。</p>
		*/
		__proto.clear=function(){
			this._one=null;
			this._render=this._renderEmpty;
			this._cmds=null;
			this._temp && (this._temp.length=0);
			this._sp && (this._sp._renderType &=~0x01);
			this._sp && (this._sp._renderType &=~0x200);
			this._repaint();
			if (this._vectorgraphArray){
				for (var i=0,n=this._vectorgraphArray.length;i < n;i++){
					VectorGraphManager.getInstance().deleteShape(this._vectorgraphArray[i]);
				}
				this._vectorgraphArray.length=0;
			}
		}

		/**
		*@private
		*重绘此对象。
		*/
		__proto._repaint=function(){
			this._temp && (this._temp.length=0);
			this._sp && this._sp.repaint();
		}

		/**@private */
		__proto._isOnlyOne=function(){
			return !this._cmds || this._cmds.length===0;
		}

		/**
		*获取位置及宽高信息矩阵(比较耗CPU，频繁使用会造成卡顿，尽量少用)。
		*@param realSize （可选）使用图片的真实大小，默认为false
		*@return 位置与宽高组成的 一个 Rectangle 对象。
		*/
		__proto.getBounds=function(realSize){
			(realSize===void 0)&& (realSize=false);
			if (!this._bounds || !this._temp || this._temp.length < 1 || realSize !=this._cacheBoundsType){
				this._bounds=Rectangle._getWrapRec(this.getBoundPoints(realSize),this._bounds)
			}
			this._cacheBoundsType=realSize;
			return this._bounds;
		}

		/**
		*@private
		*@param realSize （可选）使用图片的真实大小，默认为false
		*获取端点列表。
		*/
		__proto.getBoundPoints=function(realSize){
			(realSize===void 0)&& (realSize=false);
			if (!this._temp || this._temp.length < 1 || realSize !=this._cacheBoundsType)
				this._temp=this._getCmdPoints(realSize);
			this._cacheBoundsType=realSize;
			return this._rstBoundPoints=Utils.copyArray(this._rstBoundPoints,this._temp);
		}

		__proto._addCmd=function(a){
			this._cmds=this._cmds || [];
			a.callee=a.shift();
			this._cmds.push(a);
		}

		__proto._getCmdPoints=function(realSize){
			(realSize===void 0)&& (realSize=false);
			var context=Render._context;
			var cmds=this._cmds;
			var rst;
			rst=this._temp || (this._temp=[]);
			rst.length=0;
			if (!cmds && this._one !=null){
				Graphics._tempCmds.length=0;
				Graphics._tempCmds.push(this._one);
				cmds=Graphics._tempCmds;
			}
			if (!cmds)
				return rst;
			var matrixs;
			matrixs=Graphics._tempMatrixArrays;
			matrixs.length=0;
			var tMatrix=Graphics._initMatrix;
			tMatrix.identity();
			var tempMatrix=Graphics._tempMatrix;
			var cmd;
			var tex
			for (var i=0,n=cmds.length;i < n;i++){
				cmd=cmds[i];
				switch (cmd.callee){
					case context._save:
					case 7:
						matrixs.push(tMatrix);
						tMatrix=tMatrix.clone();
						break ;
					case context._restore:
					case 8:
						tMatrix=matrixs.pop();
						break ;
					case context._scale:
					case 5:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[2],-cmd[3]);
						tempMatrix.scale(cmd[0],cmd[1]);
						tempMatrix.translate(cmd[2],cmd[3]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._rotate:
					case 3:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.rotate(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._translate:
					case 6:
						tempMatrix.identity();
						tempMatrix.translate(cmd[0],cmd[1]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._transform:
					case 4:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.concat(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case 16:
					case 24:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
						break ;
					case 17:
						tMatrix.copyTo(tempMatrix);
						tempMatrix.concat(cmd[4]);
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tempMatrix);
						break ;
					case context._drawTexture:
						tex=cmd[0];
						if (realSize){
							if (cmd[3] && cmd[4]){
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
								}else {
								tex=cmd[0];
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tMatrix);
							}
							}else {
							var offX=tex.offsetX > 0 ? tex.offsetX :0;
							var offY=tex.offsetY > 0 ? tex.offsetY :0;
							if (cmd[3] && cmd[4]){
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1]-offX,cmd[2]-offY,cmd[3]+tex.sourceWidth-tex.width,cmd[4]+tex.sourceHeight-tex.height),tMatrix);
								}else {
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1]-offX,cmd[2]-offY,tex.width+tex.sourceWidth-tex.width,tex.height+tex.sourceHeight-tex.height),tMatrix);
							}
						}
						break ;
					case context._fillTexture:
						if (cmd[3] && cmd[4]){
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
							}else {
							tex=cmd[0];
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tMatrix);
						}
						break ;
					case context._drawTextureWithTransform:;
						var drawMatrix;
						if (cmd[5]){
							tMatrix.copyTo(tempMatrix);
							tempMatrix.concat(cmd[5]);
							drawMatrix=tempMatrix;
							}else {
							drawMatrix=tMatrix;
						}
						if (realSize){
							if (cmd[3] && cmd[4]){
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),drawMatrix);
								}else {
								tex=cmd[0];
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),drawMatrix);
							}
							}else {
							tex=cmd[0];
							offX=tex.offsetX > 0 ? tex.offsetX :0;
							offY=tex.offsetY > 0 ? tex.offsetY :0;
							if (cmd[3] && cmd[4]){
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1]-offX,cmd[2]-offY,cmd[3]+tex.sourceWidth-tex.width,cmd[4]+tex.sourceHeight-tex.height),drawMatrix);
								}else {
								Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1]-offX,cmd[2]-offY,tex.width+tex.sourceWidth-tex.width,tex.height+tex.sourceHeight-tex.height),drawMatrix);
							}
						}
						break ;
					case context._drawRect:
					case 13:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
						break ;
					case context._drawCircle:
					case context._fillCircle:
					case 14:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0]-cmd[2],cmd[1]-cmd[2],cmd[2]+cmd[2],cmd[2]+cmd[2]),tMatrix);
						break ;
					case context._drawLine:
					case 20:
						Graphics._tempPoints.length=0;
						var lineWidth=NaN;
						lineWidth=cmd[5] *0.5;
						if (cmd[0]==cmd[2]){
							Graphics._tempPoints.push(cmd[0]+lineWidth,cmd[1],cmd[2]+lineWidth,cmd[3],cmd[0]-lineWidth,cmd[1],cmd[2]-lineWidth,cmd[3]);
							}else if (cmd[1]==cmd[3]){
							Graphics._tempPoints.push(cmd[0],cmd[1]+lineWidth,cmd[2],cmd[3]+lineWidth,cmd[0],cmd[1]-lineWidth,cmd[2],cmd[3]-lineWidth);
							}else {
							Graphics._tempPoints.push(cmd[0],cmd[1],cmd[2],cmd[3]);
						}
						Graphics._addPointArrToRst(rst,Graphics._tempPoints,tMatrix);
						break ;
					case context._drawCurves:
					case 22:
						Graphics._addPointArrToRst(rst,Bezier.I.getBezierPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPoly:
					case context._drawLines:
					case 18:
						Graphics._addPointArrToRst(rst,cmd[2],tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPath:
					case 19:
						Graphics._addPointArrToRst(rst,this._getPathPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPie:
					case 15:
						Graphics._addPointArrToRst(rst,this._getPiePoints(cmd[0],cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
						break ;
					}
			}
			if (rst.length > 200){
				rst=Utils.copyArray(rst,Rectangle._getWrapRec(rst)._getBoundPoints());
			}else if (rst.length > 8)
			rst=GrahamScan.scanPList(rst);
			return rst;
		}

		__proto._switchMatrix=function(tMatix,tempMatrix){
			tempMatrix.concat(tMatix);
			tempMatrix.copyTo(tMatix);
		}

		/**
		*绘制纹理。
		*@param tex 纹理。
		*@param x X （可选）轴偏移量。
		*@param y Y （可选）轴偏移量。
		*@param width （可选）宽度。
		*@param height （可选）高度。
		*@param m （可选）矩阵信息。
		*@param alpha （可选）透明度。
		*/
		__proto.drawTexture=function(tex,x,y,width,height,m,alpha){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(alpha===void 0)&& (alpha=1);
			if (!tex || alpha < 0.01)return;
			if (!width)width=tex.sourceWidth;
			if (!height)height=tex.sourceHeight;
			width=width-tex.sourceWidth+tex.width;
			height=height-tex.sourceHeight+tex.height;
			if (tex.loaded && (width <=0 || height <=0))return;
			x+=tex.offsetX;
			y+=tex.offsetY;
			this._sp && (this._sp._renderType |=0x200);
			var args=[tex,x,y,width,height,m,alpha];
			args.callee=(m || alpha !=1)? Render._context._drawTextureWithTransform :Render._context._drawTexture;
			if (this._one==null && !m && alpha==1){
				this._one=args;
				this._render=this._renderOneImg;
				}else {
				this._saveToCmd(args.callee,args);
			}
			if (!tex.loaded){
				tex.once("loaded",this,this._textureLoaded,[tex,args]);
			}
			this._repaint();
		}

		/**
		*@private 清理贴图并替换为最新的
		*@param tex
		*/
		__proto.cleanByTexture=function(tex,x,y,width,height){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			if (!tex)return this.clear();
			if (this._one && this._render===this._renderOneImg){
				if (!width)width=tex.sourceWidth;
				if (!height)height=tex.sourceHeight;
				width=width-tex.sourceWidth+tex.width;
				height=height-tex.sourceHeight+tex.height;
				x+=tex.offsetX;
				y+=tex.offsetY;
				this._one[0]=tex;
				this._one[1]=x;
				this._one[2]=y;
				this._one[3]=width;
				this._one[4]=height;
				}else {
				this.clear();
				tex && this.drawTexture(tex,x,y,width,height);
			}
		}

		/**
		*批量绘制同样纹理。
		*@param tex 纹理。
		*@param pos 绘制次数和坐标。
		*/
		__proto.drawTextures=function(tex,pos){
			if (!tex)return;
			this._saveToCmd(Render._context._drawTextures,[tex,pos]);
		}

		/**
		*用texture填充。
		*@param tex 纹理。
		*@param x X轴偏移量。
		*@param y Y轴偏移量。
		*@param width （可选）宽度。
		*@param height （可选）高度。
		*@param type （可选）填充类型 repeat|repeat-x|repeat-y|no-repeat
		*@param offset （可选）贴图纹理偏移
		*
		*/
		__proto.fillTexture=function(tex,x,y,width,height,type,offset){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(type===void 0)&& (type="repeat");
			if (!tex)return;
			var args=[tex,x,y,width,height,type,offset || Point.EMPTY,{}];
			if (!tex.loaded){
				tex.once("loaded",this,this._textureLoaded,[tex,args]);
			}
			this._saveToCmd(Render._context._fillTexture,args);
		}

		__proto._textureLoaded=function(tex,param){
			param[3]=param[3] || tex.width;
			param[4]=param[4] || tex.height;
			this._repaint();
		}

		/**
		*@private
		*保存到命令流。
		*/
		__proto._saveToCmd=function(fun,args){
			this._sp && (this._sp._renderType |=0x200);
			if (this._one==null){
				this._one=args;
				this._render=this._renderOne;
				}else {
				this._sp && (this._sp._renderType &=~0x01);
				this._render=this._renderAll;
				(this._cmds || (this._cmds=[])).length===0 && this._cmds.push(this._one);
				this._cmds.push(args);
			}
			args.callee=fun;
			this._temp && (this._temp.length=0);
			this._repaint();
			return args;
		}

		/**
		*设置剪裁区域，超出剪裁区域的坐标不显示。
		*@param x X 轴偏移量。
		*@param y Y 轴偏移量。
		*@param width 宽度。
		*@param height 高度。
		*/
		__proto.clipRect=function(x,y,width,height){
			this._saveToCmd(Render._context._clipRect,[x,y,width,height]);
		}

		/**
		*在画布上绘制文本。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字号和字体，比如"20px Arial"。
		*@param color 定义文本颜色，比如"#ff0000"。
		*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
		*/
		__proto.fillText=function(text,x,y,font,color,textAlign){
			this._saveToCmd(Render._context._fillText,[text,x,y,font || Font.defaultFont,color,textAlign]);
		}

		/**
		*在画布上绘制“被填充且镶边的”文本。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字体和字号，比如"20px Arial"。
		*@param fillColor 定义文本颜色，比如"#ff0000"。
		*@param borderColor 定义镶边文本颜色。
		*@param lineWidth 镶边线条宽度。
		*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
		*/
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			this._saveToCmd(Render._context._fillBorderText,[text,x,y,font || Font.defaultFont,fillColor,borderColor,lineWidth,textAlign]);
		}

		/**
		*在画布上绘制文本（没有填色）。文本的默认颜色是黑色。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字体和字号，比如"20px Arial"。
		*@param color 定义文本颜色，比如"#ff0000"。
		*@param lineWidth 线条宽度。
		*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
		*/
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this._saveToCmd(Render._context._strokeText,[text,x,y,font || Font.defaultFont,color,lineWidth,textAlign]);
		}

		/**
		*设置透明度。
		*@param value 透明度。
		*/
		__proto.alpha=function(value){
			this._saveToCmd(Render._context._alpha,[value]);
		}

		/**
		*替换绘图的当前转换矩阵。
		*@param mat 矩阵。
		*@param pivotX （可选）水平方向轴心点坐标。
		*@param pivotY （可选）垂直方向轴心点坐标。
		*/
		__proto.transform=function(matrix,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._transform,[matrix,pivotX,pivotY]);
		}

		/**
		*旋转当前绘图。(推荐使用transform，性能更高)
		*@param angle 旋转角度，以弧度计。
		*@param pivotX （可选）水平方向轴心点坐标。
		*@param pivotY （可选）垂直方向轴心点坐标。
		*/
		__proto.rotate=function(angle,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._rotate,[angle,pivotX,pivotY]);
		}

		/**
		*缩放当前绘图至更大或更小。(推荐使用transform，性能更高)
		*@param scaleX 水平方向缩放值。
		*@param scaleY 垂直方向缩放值。
		*@param pivotX （可选）水平方向轴心点坐标。
		*@param pivotY （可选）垂直方向轴心点坐标。
		*/
		__proto.scale=function(scaleX,scaleY,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._scale,[scaleX,scaleY,pivotX,pivotY]);
		}

		/**
		*重新映射画布上的 (0,0)位置。
		*@param x 添加到水平坐标（x）上的值。
		*@param y 添加到垂直坐标（y）上的值。
		*/
		__proto.translate=function(x,y){
			this._saveToCmd(Render._context._translate,[x,y]);
		}

		/**
		*保存当前环境的状态。
		*/
		__proto.save=function(){
			this._saveToCmd(Render._context._save,[]);
		}

		/**
		*返回之前保存过的路径状态和属性。
		*/
		__proto.restore=function(){
			this._saveToCmd(Render._context._restore,[]);
		}

		/**
		*@private
		*替换文本内容。
		*@param text 文本内容。
		*@return 替换成功则值为true，否则值为flase。
		*/
		__proto.replaceText=function(text){
			this._repaint();
			var cmds=this._cmds;
			if (!cmds){
				if (this._one && this._isTextCmd(this._one.callee)){
					if (this._one[0].toUpperCase)this._one[0]=text;
					else this._one[0].setText(text);
					return true;
				}
				}else {
				for (var i=cmds.length-1;i >-1;i--){
					if (this._isTextCmd(cmds[i].callee)){
						if (cmds[i][0].toUpperCase)cmds[i][0]=text;
						else cmds[i][0].setText(text);
						return true;
					}
				}
			}
			return false;
		}

		/**@private */
		__proto._isTextCmd=function(fun){
			return fun===Render._context._fillText || fun===Render._context._fillBorderText || fun===Render._context._strokeText;
		}

		/**
		*@private
		*替换文本颜色。
		*@param color 颜色。
		*/
		__proto.replaceTextColor=function(color){
			this._repaint();
			var cmds=this._cmds;
			if (!cmds){
				if (this._one && this._isTextCmd(this._one.callee)){
					this._one[4]=color;
					if (!this._one[0].toUpperCase)this._one[0].changed=true;
				}
				}else {
				for (var i=cmds.length-1;i >-1;i--){
					if (this._isTextCmd(cmds[i].callee)){
						cmds[i][4]=color;
						if (!cmds[i][0].toUpperCase)cmds[i][0].changed=true;
					}
				}
			}
		}

		/**
		*加载并显示一个图片。
		*@param url 图片地址。
		*@param x （可选）显示图片的x位置。
		*@param y （可选）显示图片的y位置。
		*@param width （可选）显示图片的宽度，设置为0表示使用图片默认宽度。
		*@param height （可选）显示图片的高度，设置为0表示使用图片默认高度。
		*@param complete （可选）加载完成回调。
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			var tex=Loader.getRes(url);
			if (tex)onloaded(tex);
			else Laya.loader.load(url,Handler.create(null,onloaded),null,"image");
			function onloaded (tex){
				if (tex){
					_$this.drawTexture(tex,x,y,width,height);
					if (complete !=null)complete.call(_$this._sp,tex);
				}
			}
		}

		/**
		*@private
		*/
		__proto._renderEmpty=function(sprite,context,x,y){}
		/**
		*@private
		*/
		__proto._renderAll=function(sprite,context,x,y){
			var cmds=this._cmds,cmd;
			for (var i=0,n=cmds.length;i < n;i++){
				(cmd=cmds[i]).callee.call(context,x,y,cmd);
			}
		}

		/**
		*@private
		*/
		__proto._renderOne=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
		}

		/**
		*@private
		*/
		__proto._renderOneImg=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
			if (sprite._renderType!==2305){
				sprite._renderType |=0x01;
			}
		}

		/**
		*绘制一条线。
		*@param fromX X轴开始位置。
		*@param fromY Y轴开始位置。
		*@param toX X轴结束位置。
		*@param toY Y轴结束位置。
		*@param lineColor 颜色。
		*@param lineWidth （可选）线条宽度。
		*/
		__proto.drawLine=function(fromX,fromY,toX,toY,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var offset=lineWidth % 2===0 ? 0 :0.5;
			var arr=[fromX+offset,fromY+offset,toX+offset,toY+offset,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawLine,arr);
		}

		/**
		*绘制一系列线段。
		*@param x 开始绘制的X轴位置。
		*@param y 开始绘制的Y轴位置。
		*@param points 线段的点集合。格式:[x1,y1,x2,y2,x3,y3...]。
		*@param lineColor 线段颜色，或者填充绘图的渐变对象。
		*@param lineWidth （可选）线段宽度。
		*/
		__proto.drawLines=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var tId=0;
			if (!points || points.length < 1)return;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var offset=lineWidth % 2===0 ? 0 :0.5;
			var arr=[x+offset,y+offset,points,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawLines,arr);
		}

		/**
		*绘制一系列曲线。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param points 线段的点集合，格式[startx,starty,ctrx,ctry,startx,starty...]。
		*@param lineColor 线段颜色，或者填充绘图的渐变对象。
		*@param lineWidth （可选）线段宽度。
		*/
		__proto.drawCurves=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var arr=[x,y,points,lineColor,lineWidth];
			this._saveToCmd(Render._context._drawCurves,arr);
		}

		/**
		*绘制矩形。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param width 矩形宽度。
		*@param height 矩形高度。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth （可选）边框宽度。
		*/
		__proto.drawRect=function(x,y,width,height,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? lineWidth / 2 :0;
			var lineOffset=lineColor ? lineWidth :0;
			var arr=[x+offset,y+offset,width-lineOffset,height-lineOffset,fillColor,lineColor,lineWidth];
			this._saveToCmd(Render._context._drawRect,arr);
		}

		/**
		*绘制圆形。
		*@param x 圆点X 轴位置。
		*@param y 圆点Y 轴位置。
		*@param radius 半径。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth （可选）边框宽度。
		*/
		__proto.drawCircle=function(x,y,radius,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? lineWidth / 2 :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x,y,radius-offset,fillColor,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawCircle,arr);
		}

		/**
		*绘制扇形。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param radius 扇形半径。
		*@param startAngle 开始角度。
		*@param endAngle 结束角度。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth （可选）边框宽度。
		*/
		__proto.drawPie=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? lineWidth / 2 :0;
			var lineOffset=lineColor ? lineWidth :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x+offset,y+offset,radius-lineOffset,startAngle,endAngle,fillColor,lineColor,lineWidth,tId];
			arr[3]=Utils.toRadian(startAngle);
			arr[4]=Utils.toRadian(endAngle);
			this._saveToCmd(Render._context._drawPie,arr);
		}

		__proto._getPiePoints=function(x,y,radius,startAngle,endAngle){
			var rst=Graphics._tempPoints;
			Graphics._tempPoints.length=0;
			rst.push(x,y);
			var dP=Math.PI / 10;
			var i=NaN;
			for (i=startAngle;i < endAngle;i+=dP){
				rst.push(x+radius *Math.cos(i),y+radius *Math.sin(i));
			}
			if (endAngle !=i){
				rst.push(x+radius *Math.cos(endAngle),y+radius *Math.sin(endAngle));
			}
			return rst;
		}

		/**
		*绘制多边形。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param points 多边形的点集合。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor （可选）边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth （可选）边框宽度。
		*/
		__proto.drawPoly=function(x,y,points,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
				var tIsConvexPolygon=false;
				if (points.length > 6){
					tIsConvexPolygon=false;
					}else {
					tIsConvexPolygon=true;
				}
			};
			var offset=lineColor ? (lineWidth % 2===0 ? 0 :0.5):0;
			var arr=[x+offset,y+offset,points,fillColor,lineColor,lineWidth,tId,tIsConvexPolygon];
			this._saveToCmd(Render._context._drawPoly,arr);
		}

		__proto._getPathPoints=function(paths){
			var i=0,len=0;
			var rst=Graphics._tempPoints;
			rst.length=0;
			len=paths.length;
			var tCMD;
			for (i=0;i < len;i++){
				tCMD=paths[i];
				if (tCMD.length > 1){
					rst.push(tCMD[1],tCMD[2]);
					if (tCMD.length > 3){
						rst.push(tCMD[3],tCMD[4]);
					}
				}
			}
			return rst;
		}

		/**
		*绘制路径。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param paths 路径集合，路径支持以下格式：[["moveTo",x,y],["lineTo",x,y,x,y,x,y],["arcTo",x1,y1,x2,y2,r],["closePath"]]。
		*@param brush （可选）刷子定义，支持以下设置{fillStyle}。
		*@param pen （可选）画笔定义，支持以下设置{strokeStyle,lineWidth,lineJoin,lineCap,miterLimit}。
		*/
		__proto.drawPath=function(x,y,paths,brush,pen){
			var arr=[x,y,paths,brush,pen];
			this._saveToCmd(Render._context._drawPath,arr);
		}

		/**
		*@private
		*命令流。存储了所有绘制命令。
		*/
		__getset(0,__proto,'cmds',function(){
			return this._cmds;
			},function(value){
			this._sp && (this._sp._renderType |=0x200);
			this._cmds=value;
			this._render=this._renderAll;
			this._repaint();
		});

		Graphics.__init__=function(){
			if (Render.isConchNode){
				var from=laya.display.Graphics.prototype;
				var to=ConchGraphics.prototype;
				var list=["clear","destroy","alpha","rotate","transform","scale","translate","save","restore","clipRect","blendMode","fillText","fillBorderText","_fands","drawRect","drawCircle","drawPie","drawPoly","drawPath","drawImageM","drawLine","drawLines","_drawPs","drawCurves","replaceText","replaceTextColor","_fillImage","fillTexture","setSkinMesh","drawParticle","drawImageS"];
				for (var i=0,len=list.length;i <=len;i++){
					var temp=list[i];
					from[temp]=to[temp];
				}
				from._saveToCmd=null;
				if (to.drawImageS){
					from.drawTextures=function (tex,pos){
						if (!tex)return;
						if (!(tex.loaded && tex.bitmap && tex.source)){
							return;
						};
						var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
						this.drawImageS(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,tex.offsetX,tex.offsetY,tex.width,tex.height,pos);
					}
				}
				from.drawTexture=function (tex,x,y,width,height,m,alpha){
					(x===void 0)&& (x=0);
					(y===void 0)&& (y=0);
					(width===void 0)&& (width=0);
					(height===void 0)&& (height=0);
					(alpha===void 0)&& (alpha=1);
					if (!tex)return;
					if (!tex.loaded){
						tex.once("loaded",this,function(){
							this.drawTexture(tex,x,y,width,height,m);
						});
						return;
					}
					if (!(tex.loaded && tex.bitmap && tex.source)){
						return;
					}
					if (!width)width=tex.sourceWidth;
					if (!height)height=tex.sourceHeight;
					width=width-tex.sourceWidth+tex.width;
					height=height-tex.sourceHeight+tex.height;
					if (width <=0 || height <=0)return;
					x+=tex.offsetX;
					y+=tex.offsetY;
					var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
					this.drawImageM(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x,y,width,height,m,alpha);
					this._repaint();
				}
				from.fillTexture=function (tex,x,y,width,height,type,offset){
					(width===void 0)&& (width=0);
					(height===void 0)&& (height=0);
					(type===void 0)&& (type="repeat");
					if (!tex)return;
					if (tex.loaded){
						var ctxi=Render._context.ctx;
						var w=tex.bitmap.width,h=tex.bitmap.height,uv=tex.uv;
						var pat;
						if (tex.uv !=Texture.DEF_UV){
							pat=ctxi.createPattern(tex.bitmap.source,type,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h);
							}else {
							pat=ctxi.createPattern(tex.bitmap.source,type);
						};
						var sX=0,sY=0;
						if (offset){
							x+=offset.x % tex.width;
							y+=offset.y % tex.height;
							sX-=offset.x % tex.width;
							sY-=offset.y % tex.height;
						}
						this._fillImage(pat,x,y,sX,sY,width,height);
					}
				}
			}
		}

		Graphics._addPointArrToRst=function(rst,points,matrix,dx,dy){
			(dx===void 0)&& (dx=0);
			(dy===void 0)&& (dy=0);
			var i=0,len=0;
			len=points.length;
			for (i=0;i < len;i+=2){
				Graphics._addPointToRst(rst,points[i]+dx,points[i+1]+dy,matrix);
			}
		}

		Graphics._addPointToRst=function(rst,x,y,matrix){
			var _tempPoint=Point.TEMP;
			_tempPoint.setTo(x ? x :0,y ? y :0);
			matrix.transformPoint(_tempPoint);
			rst.push(_tempPoint.x,_tempPoint.y);
		}

		Graphics._tempPoints=[];
		Graphics._tempMatrixArrays=[];
		Graphics._tempCmds=[];
		__static(Graphics,
		['_tempMatrix',function(){return this._tempMatrix=new Matrix();},'_initMatrix',function(){return this._initMatrix=new Matrix();}
		]);
		return Graphics;
	})()


	//class laya.debug.data.Base64AtlasManager
	var Base64AtlasManager=(function(){
		function Base64AtlasManager(){}
		__class(Base64AtlasManager,'laya.debug.data.Base64AtlasManager');
		Base64AtlasManager.replaceRes=function(uiO){
			Base64AtlasManager.base64.replaceRes(uiO);
		}

		__static(Base64AtlasManager,
		['dataO',function(){return this.dataO={"comp/button1.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABRCAYAAAApS3MNAAABSUlEQVR4Xu3a0QmFMADFUJ1JXM0h3moPZ6qg4AoNeLqAIenFn65jjLE40w2sQkxvcAMI0eggRKSDEEJUDEQ4/COEiBiIYFiEEBEDEQyLECJiIIJhEUJEDEQwLEKIiIEIhkUIETEQwbAIISIGIhgWIUTEQATDIoSIGIhgWIQQEQMRDIsQImIggnEvYvv9IzjfxDiP/XlgJsTcCyDEXP/v14UQImIggmERQkQMRDAsQoiIgQiGRQgRMRDBsAghIgYiGBYhRMRABMMihIgYiGBYhBARAxEMixAiYiCCYRFCRAxEMCxCiIiBCMa7iAjPpzG8fY3kF0KIiIEIhkUIETEQwbAIISIGIhgWIUTEQATDIoSIGIhgWIQQEQMRDIsQImIggmERQkQMRDAsQoiIgQiGRQgRMRDBsAghIgYiGBYhRMRABMMihIgYiGBcGJiOHTRZjZAAAAAASUVORK5CYII=","comp/line2.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAECAYAAACOXx+WAAAAG0lEQVQYV2NkoDJgpLJ5DIxtra3/qWko1V0IAJvgApS1libIAAAAAElFTkSuQmCC","view/create.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAkCAYAAAC9itu8AAAAdElEQVQ4T2NkwAIWLFjwH5t4QkICIyM2CXQxmAHka/j///9mXDYxMjL6YtgwBDUg+w8crIT8MBQ0oEca55JvWNPS9xgu4tISzADyNfz///8MnrRkgmHDENSALWng9fRQ0DA40xLecglbWhpqGoZCMUNKUQkANAHAJVkE5XwAAAAASUVORK5CYII=","view/rendertime.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAkCAYAAAC9itu8AAABeUlEQVQ4T+2Uv0tCURSAvyNdcwiXBlsaaomWFgeHlqAtCPsDJHwIiUtDSxERtErtmQ6CjkHo4FpDBQ0tbVFR0BYE0eQvOnFF7T17QlOTd3m88873OD8+rtA9uVzOBIPBlIisAwvd8B1QajQahXQ63bIx6QHFYrEEJHrv7qeqZhzHOfYA+Xw+Yow5B+YHoGwymdxW1QAQEFWNAk8i8uEDuZM3gUcLZIEJYNcNqWrVcZyd7p9t8jLwYIFTYBx47UHlcjmcSCQ+B5JtpU0LnAFj3br7kE+yTalb4BCYczVqoT3AjteW4T73FlgFNgY+1IGQz4hPLGCAI2DGbweu2Auw1Vmcqk4C+8DsEOgZOBCR9/6mVdU2vgIsAdOuIVwANRFpezatuahpTYVSop1m+y6pasm8NQqSvvW61KwslkSHuCRkgvErr0taiUXaal1Sr0siWRO/9HfpF+RN9nfpB/qqmrXrv7mktVhYVm5GLo1cct9LI5e8d84/3UvfAgdlKH0EO7MAAAAASUVORK5CYII=","view/cache.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAkCAYAAABSSLCCAAAAcElEQVQ4T2NcsGDB/4SEBEYGBgYGYtmMxCpENhhsA6mA8f///5tHNTEwkBcQpIYcSD15kUtWigi51vR/jVYdOGUQy2YkViGywWSnvTOkhiAonkY1gZIRqSEHTntkRe4g10RWQIyWe5Bgo2O5R7dkBADztyP+yFzirAAAAABJRU5ErkJggg==","comp/clip_selectBox.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAYAAAAIeF9DAAAAsElEQVRoQ+3ZQQ0AMQzEwAuqEgh/Sj2pKObhIrBsrfLonHPu12MMTEGYFg+kIFaPgmA9ClIQzQDG0w0pCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBmd/tTh6IUBIrx/tRbiFWkIFaPFoL1KEhBNAMYTzekIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LwYL8U/BE1dCJ3PsAAAAASUVORK5CYII=","comp/label.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAASCAYAAACQCxruAAAAmElEQVRoQ+3aMQqAQBBDUef+hx4Zq1mrbPnhWylECHmghVZ397OOqqp97TlugdNzgEXFIaaFuwROt0LmBEay5aXb920+FjIpMJItLy1wvhUyKTCSLS8tcL4VMikwki0vLXC+FTIpMJItLy1wvhUyKTCSLS89wPP1Qeh8M0zy+84gMMbruqjA15OxbtjAu7mPa5bj0fb/A8cLgD4n/wQKNiIAAAAASUVORK5CYII=","comp/clip_tree_arrow.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAQCAYAAAArij59AAAAwUlEQVQoU5WRPRKCMBCFWUt6vYQeB06RUDpoBbFDa7yDwm30FGi9dHnOMiQDBgvT5c3b7+0PRVEUlVV9A3NmzL6T//SRfMz5CgCdtVafjlmzaHAigAbM2tE8YVo1pf0yvABoc9D3wACgBbMKIgD4qqDJsqqlMV8VGL5n/88geCJKlijSMBXFZUNx/CSi9WwX1r7R99thzKKqkxXRbMUWSE2u2sEwHsxHCbrMVSq6N4xRD9HAvJstylEkarhurlqnfQC58YP5+CvQNwAAAABJRU5ErkJggg==","view/bg_panel.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMUlEQVRYR+3QQREAAAjDMGZk/l2CDD6pgl7SduexGCBAgAABAgQIECBAgAABAgS+BQ4oyStBhXcy5AAAAABJRU5ErkJggg==","view/bg_top.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMUlEQVRYR+3QQREAAAjDMKZp/rWBDD6pgl7SduexGCBAgAABAgQIECBAgAABAgS+BQ6WyDMhXMLeQgAAAABJRU5ErkJggg==","view/clickselect.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAqCAYAAACDdWrxAAACfElEQVRIS8WVO2iTYRSGn5OWqpMOurg0VRBdVVCsg7GgDjpZECyirl4GEYfSgBlaB5VSpApdxCJIoeKgg7dKC21ALahIiyiKKUjxAiI4qCH1lRP/hPhfAnHpGZPv+c4573nP95ukO/xHmINmtq8RtswsPiipB/gAPAFem5nCbcSWKukIsD84/A2YBh4DL8ysWLkk0qOkDcD5GLF+Ac+Ap35ZHGjAdWB5gtJvgZFYVSWdBHaFwBlg1Mw8K0ngFiAbAm+a2XBij/6HpBbgBrAEmAVeAZ1AFU40QDCWrcBZL0/S4Vq4HtgB7DWzU5XyauDBMhhWz70ryVVdb2ZuhGpI2g1MODjfiMFrxZk3s9WNwJ6snHFxQUlXgXfAPeC5mf2O2Y5oqZLcMceCw1+AseCSSTP7mSiOpM3A7RixfvgYgAd+WUQcSSnfPWBlgtIvgf5YVSVdBA6GQF/mS2bmWcvbERmHJF+payFw0MzO1TWApKXBViwL3h5/Pk4AVTjRAMFY9njJXl6wLccrcD3wAHDUzBwuRw18JtbkbkFJruomM7sf2o4u4Jals/mFRgxeFcfBQm97UyOwM+WMiwums/k3QnMps+HWpuLIRC5TCrcRW2pbT35MRiY4XDRsVmiU5uJQIZfxb0k5Ij229eQPySJ287MLGO8Rd1M0XY6AO3LjzYVSy3fAH+VICL4a6o9VtTWbnzbYGKI+IrtQ6Ns2EFuq/5jOTnWD9f4DikeFvvbqhyg2Yzo3voJSy2fAjfEJMYPRQQ2caAAfC7AW2WkvrzU79dCwnRW4Hjgg6JrrbV9VKbkKw1Csyd2Ca7on1y2krHOub3t16//2n79SarbsH7BKtfejoCjmAAAAAElFTkSuQmCC","view/resize.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAqCAYAAACDdWrxAAABeUlEQVRIS+2UvUpdURCFvxXRKJpIEBURsVAIiiBoaaGCjY2VLyH4MBaCPoWlnQlpI6SxsQmkURQL5eK/6JK57iuRnMPZtxAkuOFUhzWz96xvjcg8tluAT5LOQqJMHba/AgPAD0nOEtruAOaB6Lon6U+ucAoYTLe7Bb5XCm1/BCaAXqAVOAHyOkYn27PA5/TGWmXHxvBeT2i7TVIM4MUp7ZhGPlY3V/pVKUxEjAIjyac74LIAjK70PwCoyfYXYDJwyqDoHtiRdFOfql0naBgIrILF/ZIi1yH6h1XbYXCPpKOq7s34GEX7JB00m445YBzYlPSQ1dF2N7CaWN2W9DNXuJxAj1uGVeuVQtvh32LyuR34DexWCv+CfAXoBzYkHb8Boe1OSRcFkBdfNY18IQiUtFUpTJjNAPEFHVfAaQFyjZ3zNBzbQ8BSWkZViEbk1uIpjXR8AKbT7jwEvpVUqEk6L0pHLN5hSWWxeq7XjI/v6Sgz0vZ7Ov7DdDwCkcb1m86tSukAAAAASUVORK5CYII=","view/clickanalyse.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAqCAYAAACDdWrxAAAC7UlEQVRIS5WWT2hUZxTFfyfGFolkoUVKrHQiEaX+IfgHa54UQzUqpWYhLbQU6ULNwgYXuog6yiiTgK2LgtAu6yqbFkpRBEURQzJEBN200NqKkxoDLnQhFUrizJU7vje8SSbzZr7FwDy+c75z7z3nfU80uMxMDin9JC0zewvYAHwIrAH65wWaWQuwOdy8CVgUHnBd0sUKoJktBbYC24B1QHMVNeck3ZWZrYhtXpUg/3/gS0kzDnT2/cDqpFqBUUnnK5pjZutDgo01Tr0g6XbVrprZypBgO9AUU/EK+ErSyzLQzC5XkTkCfBR7fl/Smeh/qasOlPRp9DAkOgp8H5P9o6SriUAnMrOzgNdswNeSntcL9IYNAQ8kHYuXU5Y6u8ZIupldAO5I+nkOsNb8wjk/ljTZKFCSvMbSMrPSiOpNx9uAz3UP4IbfWSsdrcDH4eZuYHF46LCk47PT8S6wG9gbJmRhlfoPSLrhJvdERJs7E+S73dZKmnagsx8JB50UEHdY3+x0dIUEO2qcekTSr/OlY21I4N5dEJMwA6yX9CKejqkqGn8DemPPb0v6YrZXpyS1xYbsRD3AtZjsk5IuJQKdyMyGAa/ZnbNR0tN6gd6wXwAP8SfV0jGnxki6mV1xyf4ubdTkPue/Jf3TEJCMNZFRMQLtyNwqvaTrSkdHZry1MFM8bLLPgY5U8/SyeYHvncotb5b1A/t8c2QGg3sT2WBLBbD95PiGogr9Ej0Gbap8r4ZJ5kR+MPhW7WdGd5npEFaa15IE+YWW5uklf2S6/1N7OnfasG+Ad5KiAfyVzwYfVDQnlc71YTaA8Ntrvtq/y2eDgapdTZ0a60UMhjdvmcCgWDClJge7npSBqfRYYY5M6U/M/NqO1mQ+G7xf4VUH5rNBOXtviLQfzH0afizop0fZroOJQCdKpcfyUKrZFhTpfDgU/F4nMNcH9gPwLJ8Nls3xarUaI+mp9NhTg5GJbPBZQyb3OReayP17rutmHPga1PpCOk+zrlEAAAAASUVORK5CYII=","view/res.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAADwUlEQVRIS+3WT2gcdRQH8O/b2SwNC7l4MAEPvbilUkoPOUmLjSDrZn4hxYKH/kGwyB4tQogiu/N+GymyoWguhVBQKKkHQTHsW9fUQwqKp4AgtMXkInhILl4CkoTdmSe/6XZp2pntLli8uMedt9/3mze/33yW8Jw+9Jxy0TeYmV8FcFVVTxPRiwA6AP5U1TvZbHapUqn8nrawxGBVJWvtNVWdJ6K05h1V/dhaW08KT/wRM1sAVQCRqn5JRLdyudw9Iora7faJKIrKqnrBNSWiahAEC0+GHwpm5utEdD+KopsuBMDbzPxt0oqstRdV9Za7lslkzlar1Z8erzsUHATBJhG93C34fmJi4ly5XG6nzTEIgjoRzanqkrX2amowM98F8Fq3wK34PWb+Ii14cXExv7e3V6hWq78+axQrANwt/kVEl5j5h0G2IzMfUdWCtfa3R/VPzvhTAG8AOM/MfwwYehTANwB+ZOYPE4ODIDhJRJvMvD9IqLW2GEXRbSJ6AcBtZr6UGPzoS2Y+lc/nt+bm5v5Oa2CtvaKqywC8bs06M7+eGszMn7nTBqDOzPNpwcvLyyPb29vfAZh2Naq6Za0tpAbXarUzURS53eGKL1trv0oKZ+a3AHytqplMJlOOoui4tfaDvqOw1lZUtabubBOtqOqN0dHRB/v7++62XwHwDoB33dkAUGPmoO92e/yitXZeVT8BkE1acbdpPQiCj4hIBw52hQsLC8c6nc77AN4E8FK3yQ4R/Qzgc2b+Je0ZDPU+fjiZp1eXFD5U8CB7u+/DGybgXxnFMA3/m1GISGwegNMAeuYBuON53lKpVBrePBG5RkTuSPc1b2ZmZnDzRKRnHoDYvIODg3u5XM69/E8AKAO40G1aNcb0N6/ZbF5X1fsAbjpInXnGmETzGo3GRdew+0DPGmPSzRORTQA988bHx89NTk6mmtdoNGLziGjJ9/1085rN5l1VPWSeMSbVvLW1tXwYhoXp6en+5olIbB6A2Dzf9wcyb319/cju7m5hdnY22TwRic3zPO98qVQayLxWq3U0DMPYPGNMsnmrq6snx8bGNqempgYyT0SKzjoAsXnGmP7mNZvNU9lsdqtYLKaaJyJXABwyzxiTbp6IxOYRUd33/VTzNjY2RnZ2dnrmAdgyxqSbJyJnAMTmEdFl3/cTzROR2DzHk6qWiei4Maa/eSJScZY99FRXPM+7MTIy8iAMQ6/dbsfmEVHPPGPM4OaJiBtDqnmuqfuL4Pv+8Oa1Wq1jYRg+ZR6A2DxjzP/mPRupfwAf56Q4urCh6QAAAABJRU5ErkJggg==","view/tab_panel.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAABICAYAAADyMAW8AAAAcUlEQVRYR+3WsQ3AMAhE0TCMeyTvP1tShRQo7lxYegxA8fUPLuac97VhwuKXKhTlFxRQ9GPDClawYvGEDwxIZu7pFRZXr4ACinY1ghWsYMX/NxWQr22edyvGGHt6hcV1NqGAon8QVrCCFYteISDnBuQB3xJuQcDkEngAAAAASUVORK5CYII=","view/btn_close.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAACmUlEQVRIS7WWS0/bUBCFz7mJmyZxENm06mNVoVZC7LqGn9FNqy55/BSWSEhs2/4uuqFVoA150JLKJvGdaiIH2TfXNoKQpeP5PHPO3GMTK/5xxTwsAUWkBeBZ+qAByb/Zh4pIA8CL9NqY5Dj7vw9YA/ABwDsAfwB8ITnUIhF5CuATgNcAfgH4RnJSCkwLl6AA/lXBtLZQQxFxoTr6q6LOFl2WmuJAtcY7ZuXIixsczfRyTlPfhpSN7BpwBeBtFdQLFJE2gI8AXi7GBBBl3Fdnv5L87XbpWxuFfQbw3NXM0dQLLdrDIH3ylGTiLLYB8CS9lpCc3tmU+xzL1Z9lEXl/n06KavjowCiK1uM4fqMd1Ov1s3a7fZntZjabtSeTiQYHgiC4aLVavZwpbofT6TQYDAaH1tod3bMwDHc7nc5PLZrNZmG/3z8WkS1jzGm32z1oNBqjUqD+6YM2m81xFWyeNkUaulAAlyKyWdTZbdqUmZKFakEVrLRDV7P5zY6m3rQp6tA1AMC5tXY7he51Op0fdwbGcdwdDodHWc2MMdcL9wGM1tbW9sMw/L6UNm6HChuNRifW2g1XM0dTL3TJZS1KkkTDFbVaLQqCIJcm6k0URRpxuvg39Xo9rtzDh5zt1Z/lXq+32rR5dKC1dt0YM08bAGd65BxN1ZB52ojIBcl82rgdWmsDkocAdgDoW22X5DxtSIZJkhyT3AJwCuCAZD5tfCP7oMaYcRVs/tAiDT1QHX2zqLPbtCkzxYFqjXfM3GKXAR3NtC6nqTccioAeA84BbCuU5B4Af9r4gCLSBXCU1UxErjPuj0Rk3xiznDYuMIWdANhwNXM09UKXXNai9LtQ9y4yxuS/XUijr9L0lXBDMp82j370HhJdWvsftiHJYFPSIqEAAAAASUVORK5CYII=","comp/combobox.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABCCAYAAAA476rKAAACfElEQVR4Xu3bMYsTURQF4PMmExgIWkgEU5hskyJYxGYKY5VS7NzCylL8Bftj3NbKQjuxTBWbaUwhKdIYLCJotlACA5m8kQTZZZkkeN9dbuNJOXPPu/DN5ZHkMa7dbpfgx0TAEdvEedeE2HbWxDa0JjaxLQUMe3HPJrahQECrNE3RarUOJheLBbIsq9znZAdgJ0mC4XCIer1eSa/Xa4xGI+R5TuwA272RTqeDfr9fuTeZTDCfz/dmONkK/cFggGazebnCcrnEeDw+uCKxFdiNRmO3nURRBO/9bvtYrVbEVpgejXa7XfR6PUynU8xms6O1nGzlU3DO7fbu7V5dlsf/0yO2ElsSJ7ZES1lLbCWgJE5siZaylthKQEmc2BItZS2xlYCSOLElWspaYisBJXFiS7SUtcRWAkrixJZoKWuJrQSUxIkt0VLWElsJKIkTW6L1t5an6wFooRGerofKBeZ4uh4IFxrj6XqoXECOp+sBaJoIT9c1esIsT9eFYFbl/J5tJc13agyliU1sWwHDbtyziW0oYNiKk22JfXJ6xnfXjcDdFttnb43a/b9tovQ5iG30/IltBL1tQ2xiGwoYtuJkE9tQILBV/ugl4rh2MF1sPJJP59fuc7IDsTe37mHz8Bki+MoKHhFqn9+j9vs7sQN9K7G89xRx837levHzG5Lph8p1TrZK3iF//ApxdLVI4YFk/BpA9Uc5sVXYwObOCfyDJ3AoUcIh+vIRtYuve1clthJ7G8/7p4hv30Xx6weSybuDKxL7BrARxcjTF0iyN4AviH0Tpto1ONlaQUGe2AIsbSmxtYKCPLEFWNpSYmsFBXliC7C0pZfY2oWY/zeBP8uaLni/AFTVAAAAAElFTkSuQmCC","comp/textinput.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAAAWCAYAAACv8OArAAAAZElEQVRYR+3UQQkAMAwEwcZI/LtsoSL2NTGwMByZ3b3HJQIDO3H+EdidNezQGjbsUiBs+dmwQ4EwZdmwQ4EwZdmwQ4EwZdmwQ4EwZdmwQ4EwZdmwQ4EwZdmwQ4EwZdmwQ4Ew9QBe0R29X9x+dwAAAABJRU5ErkJggg==","comp/vscroll.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAhCAYAAAA/F0BXAAAAOklEQVRIS2N8+OzVf2YWFgYmJiYGcgHjqCEYQTcaJpipaTRMRsOEmDJmNJ2MppPRdEJMCIymE2JCCQAYonwDuu2VMAAAAABJRU5ErkJggg==","comp/vscroll$down.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAzCAYAAABxCePHAAAC/klEQVRIS+2WS0wTURSG/zszBcrLFVvjio0LiAqRRDAmGpRodFE1MQQQkOKGqBujRo3ExLjB4MaKgDzUaGQhvoJGYwAjYoioERcuDGxYEIwPkBY6nWvObXuLnXZaSklYOIu5M/fxzZn/nvPPsInJKa5qGhRFQaIH+w8xSbcymtTd+gBFYXAdyjM9sf7ORxgGR0t5/j9jpkhq2t5B0xQwBrgqNsnJ9V0j4BzQdQNtNYXWkKz0NDiaXkBTFTCFoaWmCHVtQ+AGh+4z0HNiO2bmPNYQGiXQvkuPoaqqiIgi8Pl8eHBqtwlA86MKS6Cy8z1gjIFzjqcXHBEBlpBgRNuOd+HVlYqogJiQIChcg/BtW5k8SaSSkxPJ5PRPTttHfkI7kcghIpn8NYfp33NLXp+TnYG1OWvA3ox9499nPSjdkCsgHJxOIjc43VMrugL9dEUD4Oj/PA4CsUfDX/jOjbmisHTDCCzi4t4QgLDrQF+qTYOmqhgYGw9BvLpv0ZNjQwieaU9b7ZCDriFhSt3VBSZNartHA6aUJ7SK+jqO5n5pSp1HiqSw1e3Di0ypwBpiU1XsudwnTanraDEqrg2GmZLbGkJh2jQVZY29JlPqPe03JX/uxLE7Nk3DjjP3pCn1Ne7HrNsjdYoLQsmWYtNQ3NCBgeZKzLrn/foEoogbQgvSUmz4454P7VQikGhpHzGSZdVOUqqYTGli6gemZ9yJ+0lSTalk/TrxtQOYaBnESbTinokev4UG+p+9/xoyJQKQn8x7vf7JjEFZ1FJBBvuC12RINIdAwtkIQuksnxgHhKBUZ6scQtLSNyiWJpav47z9STjbjfJ8k5iVN0eEs911bhZjUTWpbR+RztZ6uFBERNCq1rfS2e43lFhDsjPscDS9lM7W4dyCquuvpbM9PFkq0iHm7mSl2yP+bj05uxdeXZe5FHOL6Xdr17nQ79bziwew4NXFqwUTMiaEtKBPwtZjnRi8WgXPglfqsyQITc60pwpAeNpH1GRZtRM0pWVVcTJM6S+dYaRsIf025wAAAABJRU5ErkJggg==","comp/vscroll$bar.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAA/CAYAAAAGyyO8AAABYElEQVRYR+2Wv0sDMRTH30tarCg6dRWnQnFT6OiqoP+tk+Cig+AiHayDiNSlg+jgD47K1US+Lwm5s4o/mkElN1xy73KfcF/efTi+Ht3Y0X1Btw8FffdoLy3QSnuZ+HhwZe+exrS13hGGJYsTWSszN0rJ1zHDDbJ0eDYkgHjv5Nxub3TIGEsTY/xDVq6NAN7MfW2u2aCG1nQ0GEZIOXmp7Pw5BPDF+VaGIGQfbM6k0ng5kw8/wF/eJzP5JInZkjg2CSS8zk6vCys7Wb8r5qqsncAP+pdR1Lu9rvgVT4uYg+3F+PCtAzjzu/taKdKKBSS2/wkEMBg/Q+rB50zqzZb7ZPoD/GeZ1HySxGxJHJsEEl5nc22VmCFalpFJTjLKNUtFxlDfP72IogYAP8PPZekWM5OqjErFWpjjbxprABJRA/JYjOOOX4Bgo6bWGYKsfMg5k+lmy5n8uUxm8kkSs6Vw7Cstibc9Fv5vWQAAAABJRU5ErkJggg==","comp/vscroll$up.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAzCAYAAABxCePHAAADF0lEQVRIS92WTUhUURTHz31vPv0KKmkXrtxUGNomkCANLdCUpEatJFuIClIEFRl9kGH0BYWQElLpotGKEJXAtKQooYUFpi1axLQZMCyyZJqv926cM2/uTM288emoUHfx3v16v3fuuef+72Hume/c7/cBAwaLKWaLBZjLPc0Zk0CSJGBs4SDOObDP7i9ckuXkIbLJRJDFFrJk2SGNvZNwy7ExoZEJLWnqfQ+4SlUFaHNs0gXpQhq6x0GWGe0Y7oCicGivyYsLigup7XgFJlkCJjFwNm2HqrZR4CqHoKLC3fr8GFAMpPLqEJhMoZjpay6Bnx4vpKfYoLx1kCwKBlXoOV78BygGsudCH1nwtNVBgHBBUFFzL1n0+Gx5YghOxhINiAbFG1uZODESxf+bJShKrulv8HUusp1G/IBz1qTZIGvdamBjU584Aopzs+lbDhwfFFgc2/imLq0fazgAHF5MumBtuh3YwJsPfGdeNqgY1qqqfcSprRLgr7rWZzWbwCTL8HLKFYEEgkrUn+eHIDzNbltBSG33O+jcnxNZmrYcw5Yc7hoXotRenRPyz0IgBzrGYkTp9qEtxiEV10eEKD08Wgh7bzwTonSvIV/soK5jd53rE6I0eGY3/PL5wWYxQ+nFgShRKqK6LqTwhJNEafRKNQHCcWK3WmDHqR5NlMoSQzAWUV+9vkBMsKXYLCSbs3Oe+SGqqupGrIL3h3YclifYkjo7yZ7izIzUUGrhnvXAzA+PURkR8xCwPnMVsCUVpW0bsiCUKOH9S0980JvaLJSQUTal9Q+9/RgRJQSgnvgCgdBkxkCKektSpC9cR0HCOQgiZUMI3njijwYg+COzLP9rkLr7E3Dn4Gbhp7BPDC+n0TkhlK2zJpccuSBIfVdsutVdt9U4pLbjtVC2B0cKYN/N50LZHh0rFGGguztV14aFsvWfLiVhSrVboaSlXyjbk/NlBNKFVLT0k7INX3KAx+sXfkBlKzjpJItGLlcmhmSkptAB83h9MTuCICxBRUkMwUmY5+uFPY7LmJ7GW05SZycsSos9xUsmSr8BfgGeWI6+BgEAAAAASUVORK5CYII=","comp/button.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABFCAYAAAAPWmvdAAABA0lEQVR4Xu3ZMRGDUBRFwXwfKSgxFhfRgAbUxEakkCEO3qmX+p9m5w7NW9v7cz18I4EFbeT1fwxtbgYtmEGDVgRC458GLQiExNKgBYGQWBq0IBASS4MWBEJiadCCQEgsDVoQCImlQQsCIbE0aEEgJJZW0Pbj64Q3hFvQhmL3CQ8atLlAKCwNWhAIiaVBCwIhsTRoQSAklgYtCITE0qAFgZBYGrQgEBJLgxYEQmJp0IJASCwNWhAIiaUVtOfrdMIbwi1oQ7H7hAcN2lwgFJYGLQiExNKgBYGQWBq0IBASS4MWBEJiadCCQEgsDVoQCImlQQsCIbE0aEEgJJYGLQiExNIC2g/MxaMp6CSauwAAAABJRU5ErkJggg==","view/bg_tool.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMklEQVRYR+3QQREAAAjDMCYG/DsEGXxSBb2ke7YeiwECBAgQIECAAAECBAgQIEDgW+AAAeIuAVS/mngAAAAASUVORK5CYII=","comp/minBtn.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAA8CAYAAAB1odqiAAAArUlEQVRYR+3X0QmAMAwE0GQN19B9nM193CmiIH7ZXOAoRc/fpjl8jVDdOj/eOc8USBcXqUjLAtDQRMSOdHb3JatTYCZUXodIy10bGxTI1Lx6/YA0Ima6W2tKFcjmdpGKtCow7NBAdxozy+804Gfx/cDqbLzWDzs0ekNY4B9nOMEehMKTVIEEyKeFSKmc18+MppRtipJuYPCa1SkwEyqvo6Tlxm8bFEijvBt9n/QA/fOPydLHcUIAAAAASUVORK5CYII=","view/zoom_out.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAACy0lEQVRIS92WQU8TQRTH/28oQkj0CL0QOMAJQkz4DkS6A+GA+A00Hrhj0uy8NiTwEdBPAOrB0Fnq3U8g6gkOSjxUjpCQCu08M5u2qaVAt7YmOqfNZPa3b9/+Z35L6NOgPnHx98Gbm5sTlUplA0AGQBpACcBBKpXazmaz3+5607YVM/MjEXlNRPdbASJyTkRrzPz+Nvg1MDNPAvgI4AGA10qpvHPuSCk17ZwLAazV4HPM/PUmeDvwSwBPAbxl5sf+RmYWZo7XMvOehwPYYebnScAnAMaVUrNhGH5pBefz+Rnn3GcAJ8w8kQT8E8A9AEMA/HXrqM9fMrO/bjvataJvFdd7/IaZfS9/67ExZpeIngB4xczPklQ8KSKHPmoispdKpXKjo6PHp6enU5VKxXhoV6moVXhnjpVS5wDOwjD81K7qG7e033lXV1cviMjvvDEAP0TkYHBwcKtarT4UkXcALolo1RhTaIV3dVYYY9aIyOfZDw9fMcYUm+FdgWvtYgCmBisrpRbCMPxQh3cNbgM3zJzvCdhDcrncuojMA8gy8/eegTvO8U0Lk87/UY9ve9h/BI6iyJ+1GyLScB4RHQDYDoKgO+dFURSfFQCuOQ9A7LwgCJI5r1gsTlar1YbznHP5crl8NDw8PK2Uip3n4QMDA3OLi4udO89a23Ce1jp2nrVWtNbxh7bWxs4jop0gCDp3XhRFJyIy7pybXV5ejp3XDN7f359RSsXO01p37jxrbey8i4uLoZGRkWvOa5q/1Fp37rx+VtxwntY6dl5zK6Io2hWR2Hla686dV0vFoY+aP8xFJJdOp49LpdIUEZkaNHkqfIWd5JiIzkXkLAiCZM7zO09EYueJyBgRxc4joi0ADeeJyOrS0lJvnBdFkf8xbDhPKbWSyWR647xCocC+53XnAVjQWvfGeS1wo7XunfOstesA5pVS2Uwm8w877xeHf444cscwYAAAAABJRU5ErkJggg==","view/refresh2.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAA/CAYAAAAPIIPGAAAEIElEQVRYR+2XTUhjVxTH/+fGpBrGT/xoBQdFFMMQLNLNbLooLbaFzqKMUhCSZwsuhGG6KCNd6DuRLgqzmGVxUd8LUrpoYWZTKO1yNi2F1oVtceEHflSLqNEav8bklPuqgsl75sUPSsucTQj33v895+R/7y+XcA1B16CJ/6GoYRiDItKfzWZjExMTv5/XtoLlx2Kxm0qp1wH0AHgTwC4RfWRZ1mdewp6ig4ODN9Lp9CMieh+AchH41Lbtj92EXUUHBgaCh4eH3wJ4zSObGSLqtSzrZ9+ihmF8CODR8YIflFL3MplMNxF9IiJWIBC4Pz4+/ldR5RuG8QuAlwGsAWi3bTsVj8dvAWhOJpPfFPK2a/mGYewDeAHAV7Zt9+aK9PX1VYRCoVcApNxa4CX6J4B6AE9t2341V9QwjO8AvAFg27btytxxL9EvAbynJxNRj2VZX58sjMfjd4joyT9D9NiyrHf9iup+/gggBCALQPfxVwARAO8cWywD4LZt2z/5EtWT+vv774rIBIBSlx/mmT5dyWTyC9+WOpkYi8XalVIPRKQbwItEpHv9PRE9tCzrt6IsVcgyhcYLnv1CAkWXfxFBxzEXXXipq+8imz7P9CJdO3+N754y86A+vYFAIDY8PHw58DHzTQB54DNNs3jwMfONY6R4go+Z/YNvbGwsuLKyci74APQys3/wMfMZ8InIPaVUt4g44AuHw/eHhoaKAx8znwEfM6dGR0dviUizaZoXA59pmvtE5ICPmfPAx8wVABzwubXA1VLM7IBPRJ4mEok88DHzKfiY2R/4mPkUfCLSk0gkTsHHzHdE5Immnog8TiQS/sDHzK7gE5EIEZ2CTyl1e2RkxD/4TNO8S0Su4BORZ0qpftM0iwefaZrtAB4QkQM+AA74ADxk5ufgc78CfV99xdy61yMajUbfAvA5gJeKycZj7gqADygajf5xRYIn+6xoUbmCDM9I/LuidXV1qK2txdzcHPb39ZPAOwpmGgqFUFFRgerqauczm81iaWkJa2v64eLhU6+eKqXQ1NTkZOcWq6urWF5edh1zzZSI0NbWhvLyctdFBwcHmJ2dxe7urn/R+vp6J0sd6XQaCwsLqKysRGNjI9bX17G4uIhMRr8jiig/EokgHA7j6OgIU1NTjkBZWRl0f7e2tgo60LX8rq4u/UjC5uamU2ZuBAIBZ1O9mVsLXEU7OztRUlKCnZ0dTE9P54nqfmsnaNHJycm8cVfRlpYW1NTUOJN1pjrjk6iqqkJra6vzNZVKYWZmxp+oLq2jo8NpgQ7dx729PZSWlkKL6hARpwr9Q+aGp/m12Zubm6H9mhtacH5+HhsbG/4tdTJTZ9bQ0OD0LxgMOm7Y3t6GNv55R7XgMS3oH5cJ/y3Rq775V3X5bx8zSv8DuWzoa2vgb5tumbHGlerDAAAAAElFTkSuQmCC","view/settings2.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAA/CAYAAAAPIIPGAAAD2ElEQVRYR+1Xz08bRxT+ZjAGYQoH4rS9IBJBQJEsUC8VKNdQtamUE0fLayqhKHeOaGbFkT8gFVLZtXzk1qqKSs4NUg8RXCIQVoOQ2jRFHHCwBRj2VW+zttY/14BXVaPOyR7NfPN9771536xACEOEgImPDHRhYaHv/Pz8kEMVjUbjq6urxVZhayo/lUo9chzndTabfWMYxkMAGx7QrG3bL5LJ5B0p5f1MJvNz7QENQdPp9LdE9CMAZrcHYAaoxJ8AvARwD8AtAI9t2/7JD9wQdH5+/q7jOLzx04DqeCelnFlbW/s9EJQXGIbxq8eQ//4mhPieiJjlEwBf8qQQYtOyLFZRNeqYJpPJWCQSeUBEzz3JrwqFwvT6+vo575ybm4vGYrFNAF8AICnlbKlU2sxms4Uych2oYRh5AJ9UFggxb1mW5aeSTqfTRLTmm3tv2/bAVUCfWpb1zA9qGAaHwD/XGjQU+WVGHU0Ug4ZSUjXFnwMwXVP8nP1RAPG2i5/Z+q9pKpWaFUL8wvNE9FUmk9m48jWtLWavofztNZTb124oN2neH1mTvmoo/pcfHDGtdZ9nLbw4rrW+nvGZpvlISvl6aWnpjWmaD4nINT4hxKxS6sXy8vIdx3HuK6XaMz6ttWt8QohDInKNTwjhJtWzlJdCiHtEdEtK+VgpFWx8Wuu7RMQbWxofEb0TQsxordszPq11Q+MjoidCCNf4AGxqrYONb2VlJVYsFh84jvPck/yKW5/W2jU+rXWUwdj4OBQcYzbCxcXF5sanlMoLIaqMTylVZXymaVYZHxG9N02zufE1AH2qlKoyPqUUh6AyFwgaivzyVehoorxkdL6k/MUPIEdE0/7i5zcUGx8Rxdsufmbrv6ZKqSrjM01z48rXtLbFeA3FNT4At6/dUIJ7V/MV/6HOn0gkvgbwA4DPbyLZ2/sWwHcikUj82SHAMqe3DMrv+I6Ofw9USonJyUlXzfb2NhzHaamsKdPBwUGcnp7i7OwMAwMDGBsbc4H29vaQz+fR09OD3t5eHB8f1x3QEJQBR0dHcXFx4QL39/dXbTw5OXEBI5EIcrlcHXBDUGYxPj6O7u7uljJLpRJ2d3ddNf7RVD6DlhkWCgUcHrof0YjH44jFYu5vnt/Z2QmWz0lhsHIMi8Wiu/HDF6T7mMDExAT6+vjR8iHGHA5/8uqYTk1Noaurq3L6/v4+jo6OqtgMDQ1hZGSkMnd5eYmtra3K/0DQg4ODivTyLg7B8PBw+6ChyC8f39FEMWgoJRVK8TPbjl/T2mruWEO5SYMNo/P/xaDfeB712U3YeXv/ALDwD+TbY8Dbd9BBAAAAAElFTkSuQmCC","view/setting.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAkCAYAAAC9itu8AAACAklEQVQ4T5XUS4iOcRTH8c9xCeVeiiiXhSJRJFIusRO2lEtZKFlgY6GxZDUrk2TFwii22JJLlERRLKRQJmXBkHIb8+hM/2d6ememed93957n93v+55zf9/mHll9VVTNxopTPR8T3piTyT1VVs7AL9zEd+4roOn5gK25HxLfacAjL8A8TWw6ta28jorc2LMLhIu7Ds2Jah4XlRVci4mNUVTUDadiLFF/G5GL4iyOYjxsYMnQ1BDfxujk0VmJPecFAO4bV2Nk05Bqzz3Za6ut86JJDx2vN4Hbj3hjBbcOt4eCaQZXUj5daT4pGoNFimI1zpdYVEf2jsTQX+5MX5NaOFdFFJHzJ2bWI+FJv6SRWYACTWliqa68ioqc2LMWpwtJ7PCymzVhSWOqOiHeZdPachqNIcXdBJV/2B6cLa5cwZLjQYOkqnuNsOeEM1uJgE43xDBsaH9QQfJ21VNBoHfpBaWHLiKGLoeO1ZnAHkpcxgkvOeoeDa0FjTnNLEfF1PJamYkcR3YmIX6OxNA35Kb7BFKwvoqf4jeV4GRE/azQ2Yh4GMaGFpbr2OSKe1Ibse1MRJ84fimkxMqc0Pc55MrjsOYvZRoofNW6/vPUSwEQ+2+tPQ14h9fX4Ap+aQ2MB1pQTB9sx5K24qmnorKWCRvtDF0PHa+0suBaW0ry91O5mus3n/wHmQwUTIH+tVgAAAABJRU5ErkJggg==","view/refresh.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAkCAYAAAC9itu8AAACiElEQVQ4T4WVS4iPYRTGf4/7/X6XcivXcktEUhTKQkqyYCOKjWyUhezFThbIlJ3LYrIRkoWGUhhhTMko4zJujYRpxgxHj9737/P3zfh239c57/uc5/zO+UQ3T0QsBRYCtZI+5jBVx0fEcGA6MA+YCXQCVyXddWwlISL6ARuARcXvhQPrJF3/nRARvYHtwLRuFLYCFyW15ITl6XTHvwIuJzlrgHrgiqSOiqSI2ANMAL4BxyW1R8RYYKSkp8Vb8w2HgD7AE0kXSozoD0wC2nPCAWAw0CyppiRhBzAD6MgJW4D5KdDFNeSkiJgFbEvONeYE698N2K0ArPsDMAZwguN+AmeKfZgLbAb6llj7A7gk6eFfnY6I0cDKpNc1tQFNwG1JvvFPp0sKXQ2sAGokveuJpVHAHGBJ4ul76vLNapbs9dYk6R8oU7driyztA2Z3w5L1n5LUnBPWptMd/xw4l+RscsHAeeNSZMloTAG+AIcltUXERPdB0qMylk4klu5LOlni2ABgqm3Oko4BQ4Fnko6WJOxPzlXg2wV4hv2czuOYhmsBsDf1rD7fYP0HkyyzZN0twHjACZmlI0WWFgM7e2DprKQ71SyNA9YDBnFYcq0RuOZ5/h9LdsVS6yV97YmlgYDn2X3wjUa7QdKLapY8015ePrWMJVtembhewLI0YWU4eZvck/Q525pXo4M/AY+TLMP40u+SuooseVjsitm/IakzItz5QcXhKSZsBCyrpdjlwuZwfSO8mLOkdYAHqFXSrRKWvErtXFdOcJcnp0AX96ZwuldQ5uxtTrD+VUmWWXqfujwk8eQ4f68rsuRG+d/gZVb9eIk9kPS6miXvIv91rNc12TXPc5MkTyO/AFhJCujHqZlCAAAAAElFTkSuQmCC","comp/checkbox.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAqCAYAAACDdWrxAAABbUlEQVRIS+2TP0gCURzHv88GRYsrExyOo5cEQVEtWdQQpE4N0R+HxmirXXCrKYigqMF2IRqCQByaLJqNIFpyUIzu4rIwpExODy88ITD/cJ603Rsf7/OGz+/zI5TSEAE20cZRgBMySKni8XrbwICrWAwG2ESZIadFS53J0R25brCyHZNud1vbcRuPV7fDAOu9GXJatNSZHN2R6wb/PfJCrxOZCR8Gbk6hWc6Xg8PrcgBETMIVPdIGSjYG/NoOSHcfkLqDK3qsBSRIrgRAuBF1quUPEUPhYGMwb2dhywrqQ3F0Dt++jSokJMBdhmDO52pB2WwFP7OK8rgH9os99IgppNf3QWwMFP4RNHKALrmoflIj53l6CaWpRcBkgiIkYHl6gDTrh5JJg57v/kJ1YOUixw7jfWELxMpAKUmAXAR7tg3LZ7am3IbjKDBOvPiDqkUmcoj+9H1d7k3nmHdweBubB70ON9wRzQH8pVVQb+Q/zZAEfpwDCU4AAAAASUVORK5CYII=","comp/btn_close.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAA8CAYAAAB1odqiAAAE6UlEQVRYR+3Y30+bVRgH8G/T0t/0Jy0USrIsC0E2GMKAVYcRpmSbEzIGZhqyxCxeceGVF3pjvJl/wYyJWZYY4hZBFnBuBBUW2ewYAxlsSMiyLKH8aEt/0vZtSxvM+562We15C6jlxr53zfO8z+ec5z2nOTmCk598tY19fAQs+Hlvz76QX1zpAwd+1NMNXzieU1QtFeKbvn4CXvqgC95wLKegRirC1e8GCPjh+53wMnRwedkG54aLG4yhSI/ycnPawHaKJ5M1MhGuXR8k4MX3OnjBx3NPcLX3DPfepSu3odfrYC4r5X7bVlbhcrnT4kdrjlA7xYLffj9EwJ6udnhCW9TEJ08XUgWTqE6n5XLdbk9G7MjhKmodrbwAfQPDBLxw7h1ecH3dDq/Xm1GYrZqceXIgGo0GJSXFvOCNmz8RsLv9NNyhKO+icTqc8Pl8acDLyWyr1Wo1DEYDbw2dXIz+4TsE7DzbBneQH2SruDZc8Pv9GSiLqVQq6Iv0WVe5TiHG4K1RAnaceguuYCTrCx63G4FAgAoqlUpodbqs7+sVEgyN/ELAs20t2Ajwgz6vF6FgMGtL5QoF1BoNL1qklODW6DgBT518gxcM+P1gQqFdLRqZXA6lSkVFWXDk198I2NZyAs7NMDXR7XRmYBKZjMuNMEzmljHQF46hUIrR8XsEbG228IJ+T/rGFkskkMoVHBgOBRGNRNI2vkpL/5YsODZhJeCbJ47D4WeoM4wyDLai5PsWiCUQJ2aXTN4pnswzqmS4e+8BAZstDbxg1qW3hyALTlinCPh6Uz1C0Rg2w/S/tz3UpaYWSgsgF4twf3IagvOXr297PR5YGuv+bd2s71sfzkCj1ULQe+3u9vraGlg0lw+LlZhMEIzUNu7vmYYFmz/9LJeTS9We+PIymaGl6wLizo2cokJDEawDNxLg+W7EHTkGjUWw/tBPwOMdnYg7nNQZep4/Q2B9jYspS0zQHjyUlrdTPJksNBrwYGiQgE3vtiNup4O2SSuOzk5y7z2ubYKyuBiaAwe5394XzxGw29Pi5iYLdeDCYgMmfxxOgKfPIG53UBNt049SBVNo4g864HRmxMz1x3hAIybv3CZg49ttiK/bqYneFRuCLldGYTY5OfPkQBR6PTRl6cfIVEtLivHw51ECNrS2Ir62zrtKfWtrCHo8acDLyWyrFVot1CYTbw2hqQRTY2MJsLk5K8hW8TkcCPp8GSiHqdVQG41ZtxUHTkwQ8NhrFsRXyUrke3wuF0L+TSooVxVCrc9+iBKWmvDodysB65saEFtZ5cX8Hi+YQDBrS2VKBVRa/jONqKwU05NTBKyrexWxlRUquOnfBBNidrVoZHIZClWF1DqisjLMzPxBwNraasRsdHDD6c7ApDIJVzTMRDJiRQb6EUNkLsPs7DwBa6qrELPZqCNzu/1pG1siEUOhkHK5wWAYkUg0La7T0U9tIrMZc/MLBKw+XImtZTrIMBFEouQkIBEXQJaYXXJ0O8WTeQXlZsw/XSRg1SsVvGDWpbuHIAsu/LlEwMrKCsQDAcQ93j2U2H2qUKuBUKnE4uISBF9f/Hj7wJwVhyordl/hH2Q+W1zCixoLOdNUj98Ei+byYbH5lnPkmJhL6O+18/c0/1m38/c0qVbm72nYVuTvadgu5O9pUtsif0+Tv6dhF8P/657mLz4NfQVdLmZiAAAAAElFTkSuQmCC","comp/textarea.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAAAXCAYAAABkrDOOAAAA4klEQVRoQ+3ZvQrCMBiF4e9rU+sPOErRqxDRe/KG9Fp0EAc3VzuIg1ML4uDmlkaaquDenMUTyJoDD+8W3ZyKlaoshSeogHOy1m1euOmoI1EU+auqQUf/8XHnnBzLp3jsWdaVJEnEGEPsADXU2Ifro8Gej/uSpqnHruvmaVegqirZX+4N9mIy8Nh13XEct7vE18RaK7vzjdiIFoiNUH5vEJvYQAHgFMsmNlAAOMWyiQ0UAE6xbGIDBYBTLJvYQAHgFMsmNlAAOMWyiQ0UAE79lM2fmrDy358a/q6Hhf68ng175QueKdEXxUGVVwAAAABJRU5ErkJggg==","view/re.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAACpklEQVRIS+WWPUgcQRiG3+8O70QEUwTB1EJgsTGdRRrhOMjOtEtSRbBIBMFKuCtkZleES2uRQoWQJggKKW7Of7GyTRvBLkVShhS73OXMfWGOU85Es7uXs0m2XeZh+OZ95xnCHX10R1ykBvu+P5fP59+VSqVvf9pUarBS6jWAR0Q0rbWOboP3BCaiOQAHAKTW+vtN8L8BW96W4zjPPM/78Ss8FlypVEYajYbHzALAJIAHALJdoDWl1Esi4m74rWBmpiAI5pk5AHAvJj0VrXU5Fmyhvu+/AfA8YRxfaa1LsWDf92eZeSMJlJnXtdYvEo1Ca30G4GEH/ImI1lqt1nE+nz9vNBrLnVTY39uO4zxNdHgrKytjzWbzs13FzKfDw8PFxcXF8HL3Nscd8BEAN3HcgiCYbLVaHyyIiGaUUm+7R9JzQZRSo0T0BUCGmRd831/tBttK53K5zXK5/DV1pZVSG0Q0C2BXa/0kySEmKojWeoiZD4hoKpvNTiwtLX1MC7+1IFrrQWZeJaJxx3EKN5186lF0LwiC4DEz31dKvU+z69i7Ig0stnm9wv4zsDGm7bxCodBf5xlj2s5j5mkpZf+c1wHPEdFBGIbS87z+OO8S3EnAVhRFvTnv8PBwpF6ve0QkiGiSmX9znuu66ZxXq9XmAcQ6j5krUspkzqvVaqmcJ4SId54xxl6ZiZwHYN113WTOq1arZ0R05TwAa5lM5rher5/ncrllAPYl1HZeFEXJnLe3tzd2cXHRdh6A04GBgWKxWLxyXlcqjqIochPHbWdn58p5AGaEENec13NB9vf3R5vNZtt5RLTguu4159lKA9gUQqR3njHGHpx9tOxKKfvnvGq1OmQrC2AKwIQQon/OOzk5GQzD0I5hPIqi/jvPGNN2npTyH3feTzoJOzgswwlqAAAAAElFTkSuQmCC","view/search.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAqCAYAAABcOxDuAAABX0lEQVRIS+3VsUrEQBAG4H9HiDZiJQg+gJVaiKAoWClYXWeZ7D6CtbWFr5Ai2ayQxkLQRgsLGwtBUQsRC6sDCxHxEIvIZSRwxRGSu83pNUe23c0H+89kR2AISwzBxAiinuctCSH2AawD+AFwRkR7QRC85CO0ur5SaoOZzwGM54A3IlrJw1aolPIewEJJUY+01jvde31RKeUMgNceXdLSWk9VQl3XnSWiZhnKzF9RFE1WQrPDUsonAHNFsBDiJAzDRmXUdd1tIjoFMJaDW0KI1TAMH61RpdQ0Mx8z8zMzHxLRAYBlAG0Al2ma7hpjHqxbqgNeAJgHcKW1XutEMeE4Ttv3/axXC1dh9XPgbZqmW8aYd9t3ohCVUt4BWARwkyTJZhzHH7Zgdq4MvQbw7ThOw/f9zypgKVoVsS7UX+C+v+kgeI0Oklrvb0Yw03rwlZW8Hnz14OvqjXrw1e/pPyfwCww91CttlMG7AAAAAElFTkSuQmCC","view/save.png":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAAA1klEQVRIS+2VzQ3DIAyFwxwdoMMAA/VQ8ZByyEBhmA7QOVxxKLIaOcIoSZUfrlifHw/wM91Ky6zE7SZgANTaDEDhzYJ5odSMC7nA5U7+b4X2dVQr3ic4hHCTlMcY33xPZUUGcwBvdEJwjcfGGIQQ4rd2qenWA3hyAUuABwCP31NtN+i1v02qP4DicRybM885J2ceB/NCyUupfuLxBS4WbmKF9rNUv4p9gq21d0l5SunF91RWZDAH8EYnBNd4nDPPWitnXst0I6Leez+feVowEQ3e+wNk3ge7C/Qp3GfwkgAAAABJRU5ErkJggg=="};},'base64',function(){return this.base64=new Base64Atlas(Base64AtlasManager.dataO);}
		]);
		return Base64AtlasManager;
	})()


	//class laya.debug.DebugTool
	var DebugTool=(function(){
		function DebugTool(){}
		__class(DebugTool,'laya.debug.DebugTool');
		__getset(1,DebugTool,'target',function(){
			return DebugTool._target;
			},function(v){
			DebugTool._target=v;
		});

		__getset(1,DebugTool,'isThisShow',function(){
			return false;
		});

		/**
		*设置是否显示帧率信息
		*@param value 是否显示true|false
		*/
		__getset(1,DebugTool,'showStatu',null,function(value){
			if (value){
				Stat.show();
			}
			else{
				Stat.hide();
				DebugTool.clearDebugLayer();
			}
		});

		/**
		*是否自动显示点击对象的边框
		*@param value
		*/
		__getset(1,DebugTool,'showBound',function(){
			return DebugTool._showBound;
			},function(value){
			DebugTool._showBound=value;
			if (!DebugTool._showBound){
				DebugTool.clearDebugLayer();
			}
		});

		DebugTool.getMenuShowEvent=function(){
			if (Browser.onMobile){
				return "doubleclick";
				}else{
				return "rightclick";
			}
		}

		DebugTool.init=function(cacheAnalyseEnable,loaderAnalyseEnable,createAnalyseEnable,renderAnalyseEnable,showCacheRec){
			(cacheAnalyseEnable===void 0)&& (cacheAnalyseEnable=true);
			(loaderAnalyseEnable===void 0)&& (loaderAnalyseEnable=true);
			(createAnalyseEnable===void 0)&& (createAnalyseEnable=true);
			(renderAnalyseEnable===void 0)&& (renderAnalyseEnable=true);
			(showCacheRec===void 0)&& (showCacheRec=false);
			DebugTool.enableCacheAnalyse=cacheAnalyseEnable;
			if (DebugTool.enableCacheAnalyse){
				RenderSpriteHook.init();
			}
			if (renderAnalyseEnable){
				SpriteRenderHook.init();
			}
			DebugTool.enableNodeCreateAnalyse=createAnalyseEnable;
			if (DebugTool.enableNodeCreateAnalyse){
				ClassCreateHook.I.hookClass(Node);
			}
			if (loaderAnalyseEnable){
				LoaderHook.init();
			}
			CacheAnalyser.showCacheSprite=showCacheRec;
			NodeInfoPanel.init();
			DebugTool.initBasicFunctions();
		}

		DebugTool.initBasicFunctions=function(){
			DisplayHook.initMe();
			if (!DebugTool.debugLayer){
				DebugInfoLayer.init();
				DebugTool.debugLayer=DebugInfoLayer.I.graphicLayer;
				DebugTool.debugLayer.mouseEnabled=false;
				DebugTool.debugLayer.mouseThrough=true;
				DebugTool.showStatu=true;
				Laya.stage.on("keydown",null,DebugTool.keyHandler);
				DebugTool.cmdToTypeO[0x01]="IMAGE";
				DebugTool.cmdToTypeO[0x02]="ALPHA";
				DebugTool.cmdToTypeO[0x04]="TRANSFORM";
				DebugTool.cmdToTypeO[0x10]="CANVAS";
				DebugTool.cmdToTypeO[0x200]="GRAPHICS";
				DebugTool.cmdToTypeO[0x400]="CUSTOM";
				DebugTool.cmdToTypeO[0x800]="CHILDS";
				DebugExport.export();
			}
		}

		DebugTool.dTrace=function(str){
			if (DebugTool._traceFun !=null){
				DebugTool._traceFun(str);
			}
			console.log(str);
		}

		DebugTool.keyHandler=function(e){
			var key;
			key=String.fromCharCode(e.keyCode);
			if (!e.altKey)
				return;
			switch (e.keyCode){
				case 38:
					DebugTool.showParent();
					break ;
				case 40:
					DebugTool.showChild();
					break ;
				case 37:
					DebugTool.showBrother(DebugTool.target,1);
					break ;
				case 39:
					DebugTool.showBrother(DebugTool.target,-1);
					break ;
				}
			DebugTool.dealCMDKey(key);
		}

		DebugTool.dealCMDKey=function(key){
			switch (key){
				case "上":
					DebugTool.showParent();
					break ;
				case "下":
					DebugTool.showChild();
					break ;
				case "左":
					DebugTool.showBrother(DebugTool.target,1);
					break ;
				case "右":
					DebugTool.showBrother(DebugTool.target,-1);
					break ;
				case "B":
					DebugTool.showAllBrother();
					break ;
				case "C":
					DebugTool.showAllChild();
					break ;
				case "E":
					DebugTool.traceDisMouseEnable();
					break ;
				case "S":
					DebugTool.traceDisSizeChain();
					break ;
				case "D":
					DisControlTool.downDis(DebugTool.target);
					break ;
				case "U":
					DisControlTool.upDis(DebugTool.target);
					break ;
				case "N":
					DebugTool.getNodeInfo();
					break ;
				case "M":
					DebugTool.showAllUnderMosue();
					break ;
				case "I":
					break ;
				case "O":
					ObjectCreateView.I.show();
					break ;
				case "L":
					DisController.I.switchType();
					break ;
				case "Q":
					DebugTool.showNodeInfo();
					break ;
				case "F":
					DebugTool.showToolPanel();
					break ;
				case "P":
					DebugTool.showToolFilter();
					break ;
				case "V":
					DebugTool.selectNodeUnderMouse();
					break ;
				case "A":
					if (NodeToolView.I.target){
						MouseEventAnalyser.analyseNode(NodeToolView.I.target);
					}
					break ;
				case "K":
					NodeUtils.traceStage();
					break ;
				case "T":
					DebugTool.switchNodeTree();
					break ;
				case "R":
					RenderCostRankView.I.show();
					break ;
				case "X":
					NodeTree.I.fresh();
					break ;
				case "mCMD":
					DebugTool.traceCMD();
					break ;
				case "allCMD":
					DebugTool.traceCMDR();
					break ;
				}
		}

		DebugTool.switchNodeTree=function(){
			ToolPanel.I.switchShow("Tree");
		}

		DebugTool.analyseMouseHit=function(){
			if (DebugTool.target)
				MouseEventAnalyser.analyseNode(DebugTool.target);
		}

		DebugTool.selectNodeUnderMouse=function(){
			DisplayHook.instance.selectDisUnderMouse();
			DebugTool.showDisBound();
			return;
		}

		DebugTool.showToolPanel=function(){
			ToolPanel.I.switchShow("Find");
		}

		DebugTool.showToolFilter=function(){
			ToolPanel.I.switchShow("Filter");
		}

		DebugTool.showNodeInfo=function(){
			if (NodeInfoPanel.I.isWorkState){
				NodeInfoPanel.I.recoverNodes();
			}
			else{
				NodeInfoPanel.I.showDisInfo(DebugTool.target);
			}
		}

		DebugTool.switchDisController=function(){
			if (DisController.I.target){
				DisController.I.target=null;
			}
			else{
				if (DebugTool.target){
					DisController.I.target=DebugTool.target;
				}
			}
		}

		DebugTool.showParent=function(sprite){
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return null;
			}
			DebugTool.target=sprite.parent;
			DebugTool.autoWork();
		}

		DebugTool.showChild=function(sprite){
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return null;
			}
			if (sprite.numChildren > 0){
				DebugTool.target=sprite.getChildAt(0);
				DebugTool.autoWork();
			}
		}

		DebugTool.showAllChild=function(sprite){
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return null;
			}
			DebugTool.selectedNodes=DisControlTool.getAllChild(sprite);
			DebugTool.showSelected();
		}

		DebugTool.showAllUnderMosue=function(){
			DebugTool.selectedNodes=DisControlTool.getObjectsUnderGlobalPoint(Laya.stage);
			DebugTool.showSelected();
		}

		DebugTool.showParentChain=function(sprite){
			if (!sprite)
				return;
			DebugTool.selectedNodes=[];
			var tar;
			tar=sprite.parent;
			while (tar){
				DebugTool.selectedNodes.push(tar);
				tar=tar.parent;
			}
			DebugTool.showSelected();
		}

		DebugTool.showAllBrother=function(sprite){
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return null;
			}
			if (!sprite.parent)
				return;
			DebugTool.selectedNodes=DisControlTool.getAllChild(sprite.parent);
			DebugTool.showSelected();
		}

		DebugTool.showBrother=function(sprite,dID){
			(dID===void 0)&& (dID=1);
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return null;
			};
			var p;
			p=sprite.parent;
			if (!p)
				return;
			var n=0;
			n=p.getChildIndex(sprite);
			n+=dID;
			if (n < 0)
				n+=p.numChildren;
			if (n >=p.numChildren)
				n-=p.numChildren;
			DebugTool.target=p.getChildAt(n);
			DebugTool.autoWork();
		}

		DebugTool.clearDebugLayer=function(){
			if (DebugTool.debugLayer.graphics)
				DebugTool.debugLayer.graphics.clear();
		}

		DebugTool.showSelected=function(){
			if (!DebugTool.autoShowSelected)
				return;
			if (!DebugTool.selectedNodes || DebugTool.selectedNodes.length < 1)
				return;
			console.log("selected:");
			console.log(DebugTool.selectedNodes);
			var i=0;
			var len=0;
			len=DebugTool.selectedNodes.length;
			DebugTool.clearDebugLayer();
			for (i=0;i < len;i++){
				DebugTool.showDisBound(DebugTool.selectedNodes[i],false);
			}
		}

		DebugTool.getClassCreateInfo=function(className){
			return RunProfile.getRunInfo(className);
		}

		DebugTool.autoWork=function(){
			if (!DebugTool.isThisShow)
				return;
			if (DebugTool.showBound)
				DebugTool.showDisBound();
			if (DebugTool.autoTraceSpriteInfo && DebugTool.target){
				TraceTool.traceSpriteInfo(DebugTool.target,DebugTool.autoTraceBounds,DebugTool.autoTraceSize,DebugTool.autoTraceTree);
			}
			if (!DebugTool.target)
				return;
			if (DebugTool.autoTraceCMD){
				DebugTool.traceCMD();
			}
			if (DebugTool.autoTraceCMDR){
				DebugTool.traceCMDR();
			}
			if (DebugTool.autoTraceEnable){
				DebugTool.traceDisMouseEnable(DebugTool.target);
			}
		}

		DebugTool.traceDisMouseEnable=function(tar){
			console.log("traceDisMouseEnable:");
			if (!tar)
				tar=DebugTool.target;
			if (!tar){
				console.log("no targetAvalible");
				return null;
			};
			var strArr;
			strArr=["TraceDisMouseEnable"];
			DebugTool.selectedNodes=[];
			while (tar){
				strArr.push(ClassTool.getNodeClassAndName(tar)+":"+tar.mouseEnabled+" hitFirst:"+tar.hitTestPrior);
				DebugTool.selectedNodes.push(tar);
				tar=tar.parent;
			}
			DebugTool.showSelected();
			return strArr.join("\n");
		}

		DebugTool.traceDisSizeChain=function(tar){
			console.log("traceDisSizeChain:");
			if (!tar)
				tar=DebugTool.target;
			if (!tar){
				console.log("no targetAvalible");
				return null;
			}
			DebugTool.selectedNodes=[];
			var strArr;
			strArr=["traceDisSizeChain"];
			while (tar){
				DebugTool.dTrace(TraceTool.getClassName(tar)+":");
				strArr.push(ClassTool.getNodeClassAndName(tar)+":");
				strArr.push("Size: x:"+tar.x+" y:"+tar.y+" w:"+tar.width+" h:"+tar.height+" scaleX:"+tar.scaleX+" scaleY:"+tar.scaleY);
				TraceTool.traceSize(tar);
				DebugTool.selectedNodes.push(tar);
				tar=tar.parent;
			}
			DebugTool.showSelected();
			return strArr.join("\n");
		}

		DebugTool.showDisBound=function(sprite,clearPre,color){
			(clearPre===void 0)&& (clearPre=true);
			(color===void 0)&& (color="#ff0000");
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return null;
			}
			if (clearPre)
				DebugTool.clearDebugLayer();
			var pointList;
			pointList=sprite._getBoundPointsM(true);
			if (!pointList || pointList.length < 1)
				return;
			pointList=GrahamScan.pListToPointList(pointList,true);
			WalkTools.walkArr(pointList,sprite.localToGlobal,sprite);
			pointList=GrahamScan.pointListToPlist(pointList);
			DebugTool._disBoundRec=Rectangle._getWrapRec(pointList,DebugTool._disBoundRec);
			DebugTool.debugLayer.graphics.drawRect(DebugTool._disBoundRec.x,DebugTool._disBoundRec.y,DebugTool._disBoundRec.width,DebugTool._disBoundRec.height,null,color);
			DebugInfoLayer.I.setTop();
		}

		DebugTool.showDisBoundToSprite=function(sprite,graphicSprite,color,lineWidth){
			(color===void 0)&& (color="#ff0000");
			(lineWidth===void 0)&& (lineWidth=1);
			var pointList;
			pointList=sprite._getBoundPointsM(true);
			if (!pointList || pointList.length < 1)
				return;
			pointList=GrahamScan.pListToPointList(pointList,true);
			WalkTools.walkArr(pointList,sprite.localToGlobal,sprite);
			pointList=GrahamScan.pointListToPlist(pointList);
			DebugTool._disBoundRec=Rectangle._getWrapRec(pointList,DebugTool._disBoundRec);
			graphicSprite.graphics.drawRect(DebugTool._disBoundRec.x,DebugTool._disBoundRec.y,DebugTool._disBoundRec.width,DebugTool._disBoundRec.height,null,color,lineWidth);
		}

		DebugTool.getNodeInfo=function(){
			DebugTool.counter.reset();
			WalkTools.walkTarget(Laya.stage,DebugTool.addNodeInfo);
			console.log("node info:");
			DebugTool.counter.traceSelf();
			return DebugTool.counter.data;
		}

		DebugTool.findByClass=function(className){
			DebugTool._classList=[];
			DebugTool._tFindClass=className;
			WalkTools.walkTarget(Laya.stage,DebugTool.addClassNode);
			DebugTool.selectedNodes=DebugTool._classList;
			DebugTool.showSelected();
			return DebugTool._classList;
		}

		DebugTool.addClassNode=function(node){
			var type;
			type=node["constructor"].name;
			if (type==DebugTool._tFindClass){
				DebugTool._classList.push(node);
			}
		}

		DebugTool.traceCMD=function(sprite){
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return null;
			}
			console.log("self CMDs:");
			console.log(sprite.graphics.cmds);
			var renderSprite;
			renderSprite=RenderSprite.renders[sprite._renderType];
			console.log("renderSprite:",renderSprite);
			DebugTool._rSpList.length=0;
			while (renderSprite && renderSprite["_sign"] > 0){
				DebugTool._rSpList.push(DebugTool.cmdToTypeO[renderSprite["_sign"]]);
				renderSprite=renderSprite._next;
			}
			console.log("fun:",DebugTool._rSpList.join(","));
			DebugTool.counter.reset();
			DebugTool.addCMDs(sprite.graphics.cmds);
			DebugTool.counter.traceSelf();
			return DebugTool.counter.data;
		}

		DebugTool.addCMDs=function(cmds){
			WalkTools.walkArr(cmds,DebugTool.addCMD);
		}

		DebugTool.addCMD=function(cmd){
			DebugTool.counter.add(cmd.callee);
		}

		DebugTool.traceCMDR=function(sprite){
			if (!sprite)
				sprite=DebugTool.target;
			if (!sprite){
				console.log("no targetAvalible");
				return 0;
			}
			DebugTool.counter.reset();
			WalkTools.walkTarget(sprite,DebugTool.getCMdCount);
			console.log("cmds include children");
			DebugTool.counter.traceSelf();
			return DebugTool.counter.data;
		}

		DebugTool.getCMdCount=function(target){
			if (!target)
				return 0;
			if (! (target instanceof laya.display.Sprite ))
				return 0;
			if (!target.graphics.cmds)
				return 0;
			DebugTool.addCMDs(target.graphics.cmds);
			var rst=target.graphics.cmds.length;
			return rst;
		}

		DebugTool.addNodeInfo=function(node){
			var type;
			type=node["constructor"].name;
			DebugTool.counter.add(type);
		}

		DebugTool.find=function(filter,ifShowSelected){
			(ifShowSelected===void 0)&& (ifShowSelected=true);
			var rst;
			rst=DebugTool.findTarget(Laya.stage,filter);
			DebugTool.selectedNodes=rst;
			if (DebugTool.selectedNodes){
				DebugTool.target=DebugTool.selectedNodes[0];
			}
			if (ifShowSelected)
				DebugTool.showSelected();
			return rst;
		}

		DebugTool.findByName=function(name){
			DebugTool.nameFilter.name=name;
			return DebugTool.find(DebugTool.nameFilter);
		}

		DebugTool.findNameStartWith=function(startStr){
			DebugTool.nameFilter.name=DebugTool.getStartWithFun(startStr);
			return DebugTool.find(DebugTool.nameFilter);
		}

		DebugTool.findNameHas=function(hasStr,showSelected){
			(showSelected===void 0)&& (showSelected=true);
			DebugTool.nameFilter.name=DebugTool.getHasFun(hasStr);
			return DebugTool.find(DebugTool.nameFilter,showSelected);
		}

		DebugTool.getStartWithFun=function(startStr){
			var rst=function (str){
				if (!str)
					return false;
				if (str.indexOf(startStr)==0)
					return true;
				return false;
			};
			return rst;
		}

		DebugTool.getHasFun=function(hasStr){
			var rst=function (str){
				if (!str)
					return false;
				if (str.indexOf(hasStr)>=0)
					return true;
				return false;
			};
			return rst;
		}

		DebugTool.findTarget=function(target,filter){
			var rst=[];
			if (DebugTool.isFit(target,filter))
				rst.push(target);
			var i=0;
			var len=0;
			var tChild;
			len=target.numChildren;
			for (i=0;i < len;i++){
				tChild=target.getChildAt(i);
				if ((tChild instanceof laya.display.Sprite )){
					rst=rst.concat(DebugTool.findTarget(tChild,filter));
				}
			}
			return rst;
		}

		DebugTool.findClassHas=function(target,str){
			var rst=[];
			if (ClassTool.getClassName(target).indexOf(str)>=0)
				rst.push(target);
			var i=0;
			var len=0;
			var tChild;
			len=target.numChildren;
			for (i=0;i < len;i++){
				tChild=target.getChildAt(i);
				if ((tChild instanceof laya.display.Sprite )){
					rst=rst.concat(DebugTool.findClassHas(tChild,str));
				}
			}
			return rst;
		}

		DebugTool.isFit=function(tar,filter){
			if (!tar)
				return false;
			if (!filter)
				return true;
			if ((typeof filter=='function')){
				return (filter)(tar);
			};
			var key;
			for (key in filter){
				if ((typeof (filter[key])=='function')){
					if (!filter[key](tar[key]))
						return false;
				}
				else{
					if (tar[key] !=filter[key])
						return false;
				}
			}
			return true;
		}

		DebugTool.log=function(__args){
			var args=arguments;
			var arr;
			arr=DTrace.getArgArr(args);
			if (DebugTool._logFun!=null){
				DebugTool._logFun(arr.join(" "));
			}
		}

		DebugTool.enableCacheAnalyse=false;
		DebugTool.enableNodeCreateAnalyse=true;
		DebugTool._traceFun=null
		DebugTool.debugLayer=null
		DebugTool._target=null
		DebugTool.selectedNodes=[];
		DebugTool.autoShowSelected=true;
		DebugTool._showBound=true;
		DebugTool._disBoundRec=null
		DebugTool.autoTraceEnable=false;
		DebugTool.autoTraceBounds=false;
		DebugTool.autoTraceSize=false;
		DebugTool.autoTraceTree=true;
		DebugTool.autoTraceCMD=true;
		DebugTool.autoTraceCMDR=false;
		DebugTool.autoTraceSpriteInfo=true;
		DebugTool._classList=null
		DebugTool._tFindClass=null
		DebugTool._rSpList=[];
		DebugTool._logFun=null
		__static(DebugTool,
		['text',function(){return this.text=new Stat();},'cmdToTypeO',function(){return this.cmdToTypeO={
		};},'counter',function(){return this.counter=new CountTool();},'nameFilter',function(){return this.nameFilter={"name":"name"};}

		]);
		return DebugTool;
	})()


	//class laya.debug.tools.Base64Atlas
	var Base64Atlas=(function(){
		function Base64Atlas(data,idKey){
			this.data=null;
			this.replaceO=null;
			this.idKey=null;
			this._loadedHandler=null;
			this.data=data;
			if (!idKey)idKey=Math.random()+"key";
			this.idKey=idKey;
			this.init();
		}

		__class(Base64Atlas,'laya.debug.tools.Base64Atlas');
		var __proto=Base64Atlas.prototype;
		//preLoad();
		__proto.init=function(){
			this.replaceO={};
			var key;
			for (key in this.data){
				this.replaceO[key]=this.idKey+"/"+key;
			}
		}

		__proto.getAdptUrl=function(url){
			return this.replaceO[url];
		}

		__proto.preLoad=function(completeHandler){
			this._loadedHandler=completeHandler;
			Laya.loader.load(Base64ImageTool.getPreloads(this.data),new Handler(this,this.preloadEnd));
		}

		__proto.preloadEnd=function(){
			var key;
			for (key in this.data){
				var tx;
				tx=Laya.loader.getRes(this.data[key]);
				Loader.cacheRes(this.replaceO[key],tx);
			}
			if (this._loadedHandler){
				this._loadedHandler.run();
			}
		}

		__proto.replaceRes=function(uiObj){
			ObjectTools.replaceValue(uiObj,this.replaceO);
		}

		return Base64Atlas;
	})()


	//class laya.debug.tools.Base64ImageTool
	var Base64ImageTool=(function(){
		function Base64ImageTool(){}
		__class(Base64ImageTool,'laya.debug.tools.Base64ImageTool');
		Base64ImageTool.getCanvasPic=function(img){
			img=img.bitmap;
			var canvas=Browser.createElement("canvas");
			var ctx=canvas.getContext('2d');
			canvas.height=img.height;
			canvas.width=img.width;
			ctx.drawImage(img.source,0,0);
			return canvas;
		}

		Base64ImageTool.getBase64Pic=function(img){
			return Base64ImageTool.getCanvasPic(img).toDataURL("image/png");
		}

		Base64ImageTool.getPreloads=function(base64Data){
			var rst;
			rst=[];
			var key;
			for (key in base64Data){
				rst.push({url:base64Data[key],type:"image" });
			}
			return rst;
		}

		return Base64ImageTool;
	})()


	//class laya.debug.tools.CacheAnalyser
	var CacheAnalyser=(function(){
		function CacheAnalyser(){}
		__class(CacheAnalyser,'laya.debug.tools.CacheAnalyser');
		var __proto=CacheAnalyser.prototype;
		__proto.renderCanvas=function(sprite,time){
			(time===void 0)&& (time=0);
			if (!CacheAnalyser.showCacheSprite)return;
			if (DebugInfoLayer.I.isDebugItem(sprite))return;
			DebugTool.showDisBoundToSprite(sprite,DebugInfoLayer.I.cacheViewLayer,DebugConsts.CANVAS_REC_COLOR,4);
		}

		__proto.reCacheCanvas=function(sprite,time){
			(time===void 0)&& (time=0);
			if (!CacheAnalyser.showRecacheSprite)return;
			if (DebugInfoLayer.I.isDebugItem(sprite))return;
			var info;
			info=CacheAnalyser.getNodeInfoByNode(sprite);
			info.addCount(time);
			CacheAnalyser.counter.addTime(sprite,time);
			if (!info.parent){
				DebugInfoLayer.I.nodeRecInfoLayer.addChild(info);
			}
		}

		CacheAnalyser.renderLoopBegin=function(){
			DebugInfoLayer.I.cacheViewLayer.graphics.clear();
		}

		CacheAnalyser.getNodeInfoByNode=function(node){
			IDTools.idObj(node);
			var key=0;
			key=IDTools.getObjID(node);
			if (!CacheAnalyser._nodeInfoDic[key]){
				CacheAnalyser._nodeInfoDic[key]=new ReCacheRecInfo();
			}
			(CacheAnalyser._nodeInfoDic [key]).setTarget(node);
			return CacheAnalyser._nodeInfoDic[key];
		}

		CacheAnalyser._nodeInfoDic={};
		CacheAnalyser.showCacheSprite=false;
		CacheAnalyser.showRecacheSprite=true;
		__static(CacheAnalyser,
		['counter',function(){return this.counter=new ObjTimeCountTool();},'I',function(){return this.I=new CacheAnalyser();}
		]);
		return CacheAnalyser;
	})()


	//class laya.debug.tools.CanvasTools
	var CanvasTools=(function(){
		function CanvasTools(){}
		__class(CanvasTools,'laya.debug.tools.CanvasTools');
		CanvasTools.createCanvas=function(width,height){
			var rst=new HTMLCanvas("2D");
			rst.getContext('2d');
			rst.size(width,height);
			return rst;
		}

		CanvasTools.renderSpriteToCanvas=function(sprite,canvas,offsetX,offsetY){
			RenderSprite.renders[sprite._renderType]._fun(sprite,canvas.context,offsetX,offsetY);
		}

		CanvasTools.getImageDataFromCanvas=function(canvas,x,y,width,height){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			if (width <=0)
				width=canvas.width;
			if (height <=0)
				height=canvas.height;
			var imgdata=canvas.context.getImageData(x,y,width,height);
			return imgdata;
		}

		CanvasTools.getImageDataFromCanvasByRec=function(canvas,rec){
			var imgdata=canvas.context.getImageData(rec.x,rec.y,rec.width,rec.height);
			return imgdata;
		}

		CanvasTools.getDifferCount=function(imageData1,imageData2){
			var data1=imageData1.data;
			var data2=imageData2.data;
			var differCount=0;
			differCount=0;
			CanvasTools.walkImageData(imageData1,myWalkFun);
			return differCount;
			function myWalkFun (i,j,tarPos,data){
				if (!CanvasTools.isPoinSame(tarPos,data1,data2))differCount++;
			}
		}

		CanvasTools.getDifferRate=function(imageData1,imageData2){
			return CanvasTools.getDifferCount(imageData1,imageData2)/(imageData1.width *imageData1.height);
		}

		CanvasTools.getCanvasDisRec=function(canvas){
			var rst;
			rst=new Rectangle;
			var imgdata;
			imgdata=CanvasTools.getImageDataFromCanvas(canvas,0,0);
			var maxX=0;
			var minX=0;
			var maxY=0;
			var minY=0;
			maxX=maxY=0;
			minX=imgdata.width;
			minY=imgdata.height;
			var i=0,iLen=0;
			var j=0,jLen=0;
			iLen=imgdata.width;
			jLen=imgdata.height;
			var data;
			data=imgdata.data;
			var tarPos=0;
			for (j=0;j < jLen;j++){
				for (i=0;i < iLen;i++){
					if (!CanvasTools.isEmptyPoint(data,tarPos)){
						if (minX > i)
							minX=i;
						if (maxX < i)
							maxX=i;
						if (minY > j)
							minY=j;
						if (maxY < j)
							maxY=j;
					}
					tarPos+=4;
				}
			}
			rst.setTo(minX,minY,maxX-minX+1,maxY-minY+1);
			return rst;
		}

		CanvasTools.fillCanvasRec=function(canvas,rec,color){
			var ctx=canvas.context;
			ctx.fillStyle=color;
			ctx.fillRect(rec.x,rec.y,rec.width,rec.height);
		}

		CanvasTools.isEmptyPoint=function(data,pos){
			if (data[pos]==0 && data[pos+1]==0 && data[pos+2]==0 && data[pos+3]==0){
				return true;
			}
			else{
				return false;
			}
		}

		CanvasTools.isPoinSame=function(pos,data1,data2){
			if (data1[pos]==data2[pos] && data1[pos+1]==data2[pos+1] && data1[pos+2]==data2[pos+2] && data1[pos+3]==data2[pos+3]){
				return true;
			}
			else{
				return false;
			}
		}

		CanvasTools.walkImageData=function(imgdata,walkFun){
			var i=0,iLen=0;
			var j=0,jLen=0;
			iLen=imgdata.width;
			jLen=imgdata.height;
			var tarPos=0;
			var data=imgdata.data;
			for (i=0;i < iLen;i++){
				for (j=0;j < jLen;j++){
					walkFun(i,j,tarPos,data);
					tarPos+=4;
				}
			}
		}

		CanvasTools.getSpriteByCanvas=function(canvas){
			var rst;
			rst=new Sprite();
			rst.graphics.drawTexture(new Texture(canvas),0,0,canvas.width,canvas.height);
			return rst;
		}

		CanvasTools.renderSpritesToCanvas=function(canvas,sprites,offx,offy,startIndex){
			(offx===void 0)&& (offx=0);
			(offy===void 0)&& (offy=0);
			(startIndex===void 0)&& (startIndex=0);
			var i=0,len=0;
			len=sprites.length;
			for (i=startIndex;i < len;i++){
				CanvasTools.renderSpriteToCanvas(sprites[i],canvas,offx,offy);
			}
		}

		CanvasTools.clearCanvas=function(canvas){
			var preWidth=NaN;
			var preHeight=NaN;
			preWidth=canvas.width;
			preHeight=canvas.height;
			canvas.size(preWidth+1,preHeight);
			canvas.size(preWidth,preHeight);
		}

		CanvasTools.getImagePixels=function(x,y,width,data,colorLen){
			(colorLen===void 0)&& (colorLen=4);
			var pos=0;
			pos=(x *width+y)*colorLen;
			var i=0,len=0;
			var rst;
			rst=[];
			len=colorLen;
			for (i=0;i < len;i++){
				rst.push(data[pos+i]);
			}
			return rst;
		}

		return CanvasTools;
	})()


	//class laya.debug.tools.ClassTool
	var ClassTool=(function(){
		function ClassTool(){}
		__class(ClassTool,'laya.debug.tools.ClassTool');
		ClassTool.defineProperty=function(obj,name,des){
			Object.defineProperty(obj,name,des);;
		}

		ClassTool.getOwnPropertyDescriptor=function(obj,name){
			var rst;
			rst=Object.getOwnPropertyDescriptor(obj,name);;
			return rst;
		}

		ClassTool.getOwnPropertyDescriptors=function(obj){
			var rst;
			rst=Object.getOwnPropertyDescriptors(obj);;
			return rst;
		}

		ClassTool.getOwnPropertyNames=function(obj){
			var rst;
			rst=Object.getOwnPropertyNames(obj);;
			return rst;
		}

		ClassTool.getObjectGetSetKeys=function(obj,rst){
			if (!rst)rst=[];
			var keys;
			keys=laya.debug.tools.ClassTool.getOwnPropertyNames(obj);
			var key;
			for (key in keys){
				key=keys[key];
				if (key.indexOf("_$get_")>=0){
					key=key.replace("_$get_","");
					rst.push(key);
				}
			}
			if (obj["__proto__"]){
				ClassTool.getObjectGetSetKeys(obj["__proto__"],rst);
			}
			return rst;
		}

		ClassTool.getObjectDisplayAbleKeys=function(obj,rst){
			if (!rst)rst=[];
			var key;
			var tValue;
			var tType;
			for (key in obj){
				tValue=obj[key];
				tType=typeof(tValue);
				if (key.charAt(0)=="_")continue ;
				rst.push(key);
			}
			ClassTool.getObjectGetSetKeys(obj,rst);
			rst=ObjectTools.getNoSameArr(rst);
			return rst;
		}

		ClassTool.getClassName=function(tar){
			if ((typeof tar=='function'))return tar.name;
			return tar["constructor"].name;
		}

		ClassTool.getNodeClassAndName=function(tar){
			if (!tar)return "null";
			var rst;
			if (tar.name){
				rst=ClassTool.getClassName(tar)+"("+tar.name+")";
				}else{
				rst=ClassTool.getClassName(tar);
			}
			return rst;
		}

		ClassTool.getClassNameByClz=function(clz){
			return clz["name"];
		}

		ClassTool.getClassByName=function(className){
			var rst;
			rst=eval(className);
			return rst;
		}

		ClassTool.createObjByName=function(className){
			var clz;
			clz=ClassTool.getClassByName(className);
			return new clz();
		}

		__static(ClassTool,
		['displayTypes',function(){return this.displayTypes={"boolean":true,"number":true,"string":true };}
		]);
		return ClassTool;
	})()


	//class laya.debug.tools.ColorTool
	var ColorTool=(function(){
		function ColorTool(){
			this.red=NaN;
			this.green=NaN;
			this.blue=NaN;
		}

		__class(ColorTool,'laya.debug.tools.ColorTool');
		ColorTool.toHexColor=function(color){
			return Utils.toHexColor(color);
		}

		ColorTool.getRGBByRGBStr=function(str){
			str.charAt(0)=='#' && (str=str.substr(1));
			var color=parseInt(str,16);
			var flag=(str.length==8);
			var _color;
			_color=[((0x00FF0000 & color)>> 16),((0x0000FF00 & color)>> 8),(0x000000FF & color)];
			return _color;
		}

		ColorTool.getColorBit=function(value){
			var rst;
			rst=Math.floor(value).toString(16);
			rst=rst.length > 1 ? rst :"0"+rst;
			return rst;
		}

		ColorTool.getRGBStr=function(rgb){
			return "#"+ColorTool.getColorBit(rgb[0])+ColorTool.getColorBit(rgb[1])+ColorTool.getColorBit(rgb[2]);
		}

		ColorTool.traseHSB=function(hsb){
			console.log("hsb:",hsb[0],hsb[1],hsb[2]);
		}

		ColorTool.rgb2hsb=function(rgbR,rgbG,rgbB){
			var rgb=[rgbR,rgbG,rgbB];
			rgb.sort(MathTools.sortNumSmallFirst);
			var max=rgb[2];
			var min=rgb[0];
			var hsbB=max / 255.0;
			var hsbS=max==0 ? 0 :(max-min)/ max;
			var hsbH=0;
			if(max==min){
				hsbH=1;
			}
			else
			if (rgbR==0 && rgbG==0&&rgbB==0){
			}else
			if (max==rgbR && rgbG >=rgbB){
				hsbH=(rgbG-rgbB)*60 / (max-min)+0;
			}
			else if (max==rgbR && rgbG < rgbB){
				hsbH=(rgbG-rgbB)*60 / (max-min)+360;
			}
			else if (max==rgbG){
				hsbH=(rgbB-rgbR)*60 / (max-min)+120;
			}
			else if (max==rgbB){
				hsbH=(rgbR-rgbG)*60 / (max-min)+240;
			}
			return [hsbH,hsbS,hsbB];
		}

		ColorTool.hsb2rgb=function(h,s,v){
			var r=0,g=0,b=0;
			var i=Math.floor((h / 60)% 6);
			var f=(h / 60)-i;
			var p=v *(1-s);
			var q=v *(1-f *s);
			var t=v *(1-(1-f)*s);
			switch (i){
				case 0:
					r=v;
					g=t;
					b=p;
					break ;
				case 1:
					r=q;
					g=v;
					b=p;
					break ;
				case 2:
					r=p;
					g=v;
					b=t;
					break ;
				case 3:
					r=p;
					g=q;
					b=v;
					break ;
				case 4:
					r=t;
					g=p;
					b=v;
					break ;
				case 5:
					r=v;
					g=p;
					b=q;
					break ;
				default :
					break ;
				}
			return [Math.floor(r *255.0),Math.floor(g *255.0),Math.floor(b *255.0)];
		}

		return ColorTool;
	})()


	//class laya.debug.tools.CountTool
	var CountTool=(function(){
		function CountTool(){
			this.data={};
			this.preO={};
			this.changeO={};
			this.count=0;
		}

		__class(CountTool,'laya.debug.tools.CountTool');
		var __proto=CountTool.prototype;
		__proto.reset=function(){
			this.data={};
			this.count=0;
		}

		__proto.add=function(name,num){
			(num===void 0)&& (num=1);
			this.count++;
			if(!this.data.hasOwnProperty(name)){
				this.data[name]=0;
			}
			this.data[name]=this.data[name]+num;
		}

		__proto.getKeyCount=function(key){
			if(!this.data.hasOwnProperty(key)){
				this.data[key]=0;
			}
			return this.data[key];
		}

		__proto.getKeyChange=function(key){
			if (!this.changeO[key])return 0;
			return this.changeO[key];
		}

		__proto.record=function(){
			var key;
			for (key in this.changeO){
				this.changeO[key]=0;
			}
			for (key in this.data){
				if (!this.preO[key])this.preO[key]=0;
				this.changeO[key]=this.data[key]-this.preO[key];
				this.preO[key]=this.data[key]
			}
		}

		__proto.getCount=function(dataO){
			var rst=0;
			var key;
			for (key in dataO){
				rst+=dataO[key];
			}
			return rst;
		}

		__proto.traceSelf=function(dataO){
			if (!dataO)dataO=this.data;
			var tCount=0;
			tCount=this.getCount(dataO);
			console.log("total:"+tCount);
			return "total:"+tCount+"\n"+TraceTool.traceObj(dataO);
		}

		__proto.traceSelfR=function(dataO){
			if (!dataO)dataO=this.data;
			var tCount=0;
			tCount=this.getCount(dataO);
			console.log("total:"+tCount);
			return "total:"+tCount+"\n"+TraceTool.traceObjR(dataO);
		}

		return CountTool;
	})()


	//class laya.debug.tools.DebugConsts
	var DebugConsts=(function(){
		function DebugConsts(){}
		__class(DebugConsts,'laya.debug.tools.DebugConsts');
		DebugConsts.CLICK_SELECT_COLOR="#ff0000";
		DebugConsts.CANVAS_REC_COLOR="#FF00FF";
		DebugConsts.RECACHE_REC_COLOR="#00ff00";
		DebugConsts.SPRITE_REC_COLOR="#ff0000";
		DebugConsts.SPRITE_REC_LINEWIDTH=2;
		return DebugConsts;
	})()


	//class laya.debug.tools.DebugExport
	var DebugExport=(function(){
		function DebugExport(){}
		__class(DebugExport,'laya.debug.tools.DebugExport');
		DebugExport.export=function(){
			var _window;
			_window=window;;
			var key;
			for(key in DebugExport._exportsDic){
				_window[key]=DebugExport._exportsDic[key];
			}
		}

		__static(DebugExport,
		['_exportsDic',function(){return this._exportsDic={
				"DebugTool":DebugTool,
				"Watcher":Watcher
		};}

		]);
		return DebugExport;
	})()


	//class laya.debug.tools.DifferTool
	var DifferTool=(function(){
		function DifferTool(sign,autoTrace){
			this.autoTrace=true;
			this.sign="";
			this.obj=null;
			(sign===void 0)&& (sign="");
			(autoTrace===void 0)&& (autoTrace=true);
			this.sign=sign;
			this.autoTrace=autoTrace;
		}

		__class(DifferTool,'laya.debug.tools.DifferTool');
		var __proto=DifferTool.prototype;
		__proto.update=function(data,msg){
			if(msg){
				console.log(msg);
			};
			var tObj=ObjectTools.copyObj(data);
			if(!this.obj)this.obj={};
			var rst;
			rst=ObjectTools.differ(this.obj,tObj);
			this.obj=tObj;
			if(this.autoTrace){
				console.log(this.sign+" differ:");
				ObjectTools.traceDifferObj(rst);
			}
			return rst;
		}

		DifferTool.differ=function(sign,data,msg){
			if(!DifferTool._differO[sign])DifferTool._differO[sign]=new DifferTool(sign,true);
			var tDiffer;
			tDiffer=DifferTool._differO[sign];
			return tDiffer.update(data,msg);
		}

		DifferTool._differO={};
		return DifferTool;
	})()


	//class laya.debug.tools.DisController
	var DisController=(function(){
		function DisController(){
			this.arrowAxis=null;
			this._target=null;
			this.recInfo=null;
			DisController.init();
			this.arrowAxis=new Axis();
			this.arrowAxis.mouseEnabled=true;
		}

		__class(DisController,'laya.debug.tools.DisController');
		var __proto=DisController.prototype;
		__proto.switchType=function(){
			this.arrowAxis.switchType();
		}

		__proto.updateMe=function(){
			if(!this._target)return;
			this.recInfo=RecInfo.getGlobalRecInfo(this._target,0,0,1,0,0,1);
			console.log("rotation:",this.recInfo.rotation);
			console.log("pos:",this.recInfo.x,this.recInfo.y);
			console.log("scale:",this.recInfo.width,this.recInfo.height);
			this.arrowAxis.x=this.recInfo.x;
			this.arrowAxis.y=this.recInfo.y;
			this.arrowAxis.rotation=this.recInfo.rotation;
			this.arrowAxis.yAxis.rotation=this.recInfo.rotationV-this.recInfo.rotation;
		}

		__getset(0,__proto,'target',function(){
			return this._target;
			},function(target){
			this._target=target;
			if(target){
				DisController._container.addChild(this.arrowAxis);
				Laya.timer.loop(100,this,this.updateMe);
				}else{
				this.arrowAxis.removeSelf();
				Laya.timer.clear(this,this.updateMe);
			}
			this.arrowAxis.target=target;
			this.updateMe();
		});

		__getset(0,__proto,'type',function(){
			return this.arrowAxis.type;
			},function(lenType){
			this.arrowAxis.type=lenType;
		});

		DisController.init=function(){
			if (DisController._container){
				DisControlTool.setTop(DisController._container);
				return;
			};
			DisController._container=new Sprite();
			DisController._container.mouseEnabled=true;
			Laya.stage.addChild(DisController._container);
		}

		DisController._container=null
		__static(DisController,
		['I',function(){return this.I=new DisController();}
		]);
		return DisController;
	})()


	//class laya.debug.tools.DisControlTool
	var DisControlTool=(function(){
		function DisControlTool(){}
		__class(DisControlTool,'laya.debug.tools.DisControlTool');
		DisControlTool.getObjectsUnderPoint=function(sprite,x,y,rst,filterFun){
			rst=rst?rst:[];
			if(filterFun!=null&&!filterFun(sprite))return rst;
			if (sprite.getBounds().contains(x,y)){
				rst.push(sprite);
				var tS;
				var tempP=new Point();
				tempP.setTo(x,y);
				tempP=sprite.fromParentPoint(tempP);
				x=tempP.x;
				y=tempP.y;
				for (var i=sprite._childs.length-1;i >-1;i--){
					var child=sprite._childs[i];
					if((child instanceof laya.display.Sprite ))
						DisControlTool.getObjectsUnderPoint(child,x,y,rst,filterFun);
				}
			}
			return rst;
		}

		DisControlTool.getObjectsUnderGlobalPoint=function(sprite,filterFun){
			var point=new Point();
			point.setTo(Laya.stage.mouseX,Laya.stage.mouseY);
			if(sprite.parent)
				point=(sprite.parent).globalToLocal(point);
			return DisControlTool.getObjectsUnderPoint(sprite,point.x,point.y,null,filterFun);
		}

		DisControlTool.findFirstObjectsUnderGlobalPoint=function(){
			var disList;
			disList=DisControlTool.getObjectsUnderGlobalPoint(Laya.stage);
			if (!disList)return null;
			var i=0,len=0;
			var tDis;
			len=disList.length;
			for (i=len-1;i>=0;i--){
				tDis=disList[i];
				if (tDis && tDis.numChildren < 1){
					return tDis;
				}
			}
			return tDis;
		}

		DisControlTool.visibleAndEnableObjFun=function(tar){
			return tar.visible&&tar.mouseEnabled;
		}

		DisControlTool.visibleObjFun=function(tar){
			return tar.visible;
		}

		DisControlTool.getMousePoint=function(sprite){
			var point=new Point();
			point.setTo(Laya.stage.mouseX,Laya.stage.mouseY);
			point=sprite.globalToLocal(point);
			return point;
		}

		DisControlTool.isChildE=function(parent,child){
			if (!parent)return false;
			while (child){
				if (child.parent==parent)return true;
				child=child.parent;
			}
			return false;
		}

		DisControlTool.isInTree=function(pNode,child){
			return pNode==child || DisControlTool.isChildE(pNode,child);
		}

		DisControlTool.setTop=function(tar){
			if(tar&&tar.parent){
				var tParent;
				tParent=tar.parent;
				tParent.setChildIndex(tar,tParent.numChildren-1);
			}
		}

		DisControlTool.clearItemRelativeInfo=function(item){
			var Nan="NaN";
			item.getLayout().left=Nan;
			item.getLayout().right=Nan;
			item.getLayout().top=Nan;
			item.getLayout().bottom=Nan;
		}

		DisControlTool.swap=function(tarA,tarB){
			if (tarA==tarB)return;
			var iA=0;
			iA=tarA.parent.getChildIndex(tarA);
			var iB=0;
			iB=tarB.parent.getChildIndex(tarB);
			var bP;
			bP=tarB.parent;
			tarA.parent.addChildAt(tarB,iA);
			bP.addChildAt(tarA,iB);
		}

		DisControlTool.insertToTarParent=function(tarA,tars,after){
			(after===void 0)&& (after=false);
			var tIndex=0;
			var parent;
			if(!tarA)return;
			parent=tarA.parent;
			if(!parent)return;
			tIndex=parent.getChildIndex(tarA);
			if(after)tIndex++;
			DisControlTool.insertToParent(parent,tars,tIndex);
		}

		DisControlTool.insertToParent=function(parent,tars,index){
			(index===void 0)&& (index=-1);
			if(!parent)return;
			if(index<0)index=parent.numChildren;
			var i=0,len=0;
			len=tars.length;
			for(i=0;i<len;i++){
				DisControlTool.transParent(tars[i],parent);
				parent.addChildAt(tars[i],index);
			}
		}

		DisControlTool.transParent=function(tar,newParent){
			if(!tar||!newParent)return;
			if(!tar.parent)return;
			var preParent;
			preParent=tar.parent;
			var pos;
			pos=new Point(tar.x,tar.y);
			pos=preParent.localToGlobal(pos);
			pos=newParent.globalToLocal(pos);
			tar.pos(pos.x,pos.y);
		}

		DisControlTool.transPoint=function(nowParent,tarParent,point){
			point=nowParent.localToGlobal(point);
			point=tarParent.globalToLocal(point);
			return point;
		}

		DisControlTool.removeItems=function(itemList){
			var i=0,len=0;
			len=itemList.length;
			for (i=0;i < len;i++){
				(itemList [i]).removeSelf();
			}
		}

		DisControlTool.addItems=function(itemList,parent){
			var i=0,len=0;
			len=itemList.length;
			for (i=0;i < len;i++){
				parent.addChild(itemList[i]);
			}
		}

		DisControlTool.getAllChild=function(tar){
			if(!tar)return [];
			var i=0;
			var len=0;
			var rst=[];
			len=tar.numChildren;
			for(i=0;i<len;i++){
				rst.push(tar.getChildAt(i));
			}
			return rst;
		}

		DisControlTool.upDis=function(child){
			if(child&&child.parent){
				var tParent;
				tParent=child.parent;
				var newIndex=0;
				newIndex=tParent.getChildIndex(child)+1;
				if(newIndex>=tParent.numChildren){
					newIndex=tParent.numChildren-1;
				}
				console.log("setChildIndex:"+newIndex);
				tParent.setChildIndex(child,newIndex);
			}
		}

		DisControlTool.downDis=function(child){
			if(child&&child.parent){
				var tParent;
				tParent=child.parent;
				var newIndex=0;
				newIndex=tParent.getChildIndex(child)-1;
				if(newIndex<0)newIndex=0;
				console.log("setChildIndex:"+newIndex);
				tParent.setChildIndex(child,newIndex);
			}
		}

		DisControlTool.setResizeAbleEx=function(node){
			var clickItem;
			clickItem=node.getChildByName("resizeBtn");
			if (clickItem){
				SimpleResizer.setResizeAble(clickItem,node);
			}
		}

		DisControlTool.setResizeAble=function(node){
			node.on("click",null,DisControlTool.resizeHandler,[node]);
		}

		DisControlTool.resizeHandler=function(tar){
			DisResizer.setUp(tar);
		}

		DisControlTool.setDragingItem=function(dragBar,tar){
			dragBar.on("mousedown",null,DisControlTool.dragingHandler,[tar]);
			tar.on("dragend",null,DisControlTool.dragingEnd,[tar]);
		}

		DisControlTool.dragingHandler=function(tar){
			if (tar){
				tar.startDrag();
			}
		}

		DisControlTool.dragingEnd=function(tar){
			DisControlTool.intFyDisPos(tar);
			console.log(tar.x,tar.y);
		}

		DisControlTool.showToStage=function(dis,offX,offY){
			(offX===void 0)&& (offX=0);
			(offY===void 0)&& (offY=0);
			var rec=dis.getBounds();
			dis.x=Laya.stage.mouseX+offX;
			dis.y=Laya.stage.mouseY+offY;
			if (dis.x+rec.width > Laya.stage.width){
				dis.x-=rec.width+offX;
			}
			if (dis.y+rec.height > Laya.stage.height){
				dis.y-=rec.height+offY;
			}
			DisControlTool.intFyDisPos(dis);
		}

		DisControlTool.intFyDisPos=function(dis){
			if (!dis)return;
			dis.x=Math.round(dis.x);
			dis.y=Math.round(dis.y);
		}

		DisControlTool.showOnly=function(disList,showItem){
			var i=0,len=0;
			len=disList.length;
			for (i=0;i < len;i++){
				disList[i].visible=disList[i]==showItem;
			}
		}

		DisControlTool.showOnlyByIndex=function(disList,index){
			DisControlTool.showOnly(disList,disList[index]);
		}

		DisControlTool.addOnly=function(disList,showItem,parent){
			var i=0,len=0;
			len=disList.length;
			for (i=0;i < len;i++){
				if (disList[i] !=showItem){
					disList[i].removeSelf();
					}else{
					parent.addChild(disList[i]);
				}
			}
		}

		DisControlTool.addOnlyByIndex=function(disList,index,parent){
			DisControlTool.addOnly(disList,disList[index],parent);
		}

		__static(DisControlTool,
		['tempP',function(){return this.tempP=new Point();}
		]);
		return DisControlTool;
	})()


	//class laya.debug.tools.DisplayHook
	var DisplayHook=(function(){
		function DisplayHook(){
			this.mouseX=NaN;
			this.mouseY=NaN;
			this._stage=null;
			this._target=null;
			this.isGetting=false;
			this._matrix=new Matrix();
			this._point=new Point();
			this._rect=new Rectangle();
			this._event=Event.EMPTY;
			this._stage=Laya.stage;
			this.init(Render.context.canvas);
		}

		__class(DisplayHook,'laya.debug.tools.DisplayHook');
		var __proto=DisplayHook.prototype;
		__proto.init=function(canvas){
			var _$this=this;
			if (Browser.window.navigator.msPointerEnabled){
				canvas.style['-ms-content-zooming']='none';
				canvas.style['-ms-touch-action']='none';
			};
			var _this=this;
			Browser.document.addEventListener('mousedown',function(e){
				_$this._event._stoped=false;
				DisplayHook.isFirst=true;
				_this.check(_this._stage,e.offsetX,e.offsetY,_this.onMouseDown,true,false);
			},true);
			Browser.document.addEventListener('touchstart',function(e){
				_$this._event._stoped=false;
				DisplayHook.isFirst=true;
				var touches=e.changedTouches;
				for (var i=0,n=touches.length;i < n;i++){
					var touch=touches[i];
					initEvent(touch,e);
					_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown,true,false);
				}
			},true);
			function initEvent (e,event){
				_this._event._stoped=false;
				_this._event.nativeEvent=event || e;
				_this._target=null;
				if (e.offsetX){
					_this.mouseX=e.offsetX;
					_this.mouseY=e.offsetY;
					}else {
					_this.mouseX=e.clientX-Laya.stage.offset.x;
					_this.mouseY=e.clientY-Laya.stage.offset.y;
				}
			}
		}

		__proto.onMouseMove=function(ele,hit){
			this.sendEvent(ele,"mousemove");
			return;
			if (hit && ele !=this._stage && ele!==this._target){
				if (this._target){
					if (this._target.$_MOUSEOVER){
						this._target.$_MOUSEOVER=false;
						this._target.event("mouseout");
					}
				}
				this._target=ele;
				if (!ele.$_MOUSEOVER){
					ele.$_MOUSEOVER=true;
					this.sendEvent(ele,"mouseover");
				}
				}else if (!hit && this._target && ele===this._target){
				this._target=null;
				if (ele.$_MOUSEOVER){
					ele.$_MOUSEOVER=false;
					this.sendEvent(ele,"mouseout");
				}
			}
		}

		__proto.onMouseUp=function(ele,hit){
			hit && this.sendEvent(ele,"mouseup");
		}

		__proto.onMouseDown=function(ele,hit){
			if (hit){
				ele.$_MOUSEDOWN=true;
				this.sendEvent(ele,"mousedown");
			}
		}

		__proto.sendEvent=function(ele,type){
			if (!this._event._stoped){
				ele.event(type,this._event.setTo(type,ele,ele));
				if (type==="mouseup" && ele.$_MOUSEDOWN){
					ele.$_MOUSEDOWN=false;
					ele.event("click",this._event.setTo("click",ele,ele));
				}
			}
		}

		__proto.selectDisUnderMouse=function(){
			DisplayHook.isFirst=true;
			this.check(Laya.stage,Laya.stage.mouseX,Laya.stage.mouseY,null,true,false);
			SelectInfosView.I.setSelectTarget(DebugTool.target);
		}

		__proto.getDisUnderMouse=function(){
			this.isGetting=true;
			DisplayHook.isFirst=true;
			DebugTool.target=null;
			this.check(Laya.stage,Laya.stage.mouseX,Laya.stage.mouseY,null,true,false);
			this.isGetting=false;
			return DebugTool.target;
		}

		__proto.check=function(sp,mouseX,mouseY,callBack,hitTest,mouseEnable){
			if (sp==DebugTool.debugLayer)return false;
			if (sp==DebugInfoLayer.I)return false;
			if (this.isGetting && sp==DebugInfoLayer.I)return false;
			if (!sp.visible || sp.getSelfBounds().width<=0)return false;
			var isHit=false;
			mouseEnable=true
			if (mouseEnable){
				var graphicHit=false;
				if (hitTest){
					this._rect=sp.getBounds();
					isHit=this._rect.contains(mouseX,mouseY);
					this._point.setTo(mouseX,mouseY);
					sp.fromParentPoint(this._point);
					mouseX=this._point.x;
					mouseY=this._point.y;
				}
				if (isHit){
					var flag=false;
					for (var i=sp._childs.length-1;i >-1;i--){
						var child=sp._childs[i];
						(flag=this.check(child,mouseX,mouseY,callBack,hitTest,true));
						if (flag)break ;
					}
					graphicHit=sp.getGraphicBounds().contains(mouseX,mouseY);
					isHit=flag||graphicHit;
					if(isHit&&!flag&&DisplayHook.isFirst){
						DisplayHook.isFirst=false;
						if(! ((sp instanceof laya.debug.tools.debugUI.DButton ))){
							DebugTool.target=sp;
							if (!this.isGetting){
								DebugTool.autoWork();
								Notice.notify("ItemClicked",sp);
							}
						}
					}
				}
			}
			return isHit;
		}

		DisplayHook.initMe=function(){
			if(!DisplayHook.instance){
				DisplayHook.instance=new DisplayHook();
			}
		}

		DisplayHook.ITEM_CLICKED="ItemClicked";
		DisplayHook.instance=null
		DisplayHook.isFirst=false;
		return DisplayHook;
	})()


	//class laya.debug.tools.DTrace
	var DTrace=(function(){
		function DTrace(){}
		__class(DTrace,'laya.debug.tools.DTrace');
		DTrace.getArgArr=function(arg){
			var rst;
			rst=[];
			var i=0,len=arg.length;
			for(i=0;i<len;i++){
				rst.push(arg[i]);
			}
			return rst;
		}

		DTrace.dTrace=function(__arg){
			var arg=arguments;
			arg=DTrace.getArgArr(arg);
			arg.push(TraceTool.getCallLoc(2));
			console.log.apply(console,arg);
			var str;
			str=arg.join(" ");
		}

		DTrace.timeStart=function(sign){
			console.time(sign);;
		}

		DTrace.timeEnd=function(sign){
			console.timeEnd(sign);;
		}

		DTrace.traceTable=function(data){
			console.table(data);;
		}

		return DTrace;
	})()


	//class laya.debug.tools.enginehook.ClassCreateHook
	var ClassCreateHook=(function(){
		function ClassCreateHook(){
			this.createInfo={};
		}

		__class(ClassCreateHook,'laya.debug.tools.enginehook.ClassCreateHook');
		var __proto=ClassCreateHook.prototype;
		__proto.hookClass=function(clz){
			var _$this=this;
			if (ClassCreateHook.isInited)return;
			ClassCreateHook.isInited=true;
			var createFun=function (sp){
				_$this.classCreated(sp,clz);
			}
			FunHook.hook(clz,"call",createFun);
		}

		__proto.classCreated=function(clz,oClass){
			var key;
			key=ClassTool.getNodeClassAndName(clz);
			var depth=0;
			var tClz;
			tClz=clz;
			while (tClz && tClz !=oClass){
				tClz=tClz.__super;
				depth++;
			}
			if (!ClassCreateHook.I.createInfo[key]){
				ClassCreateHook.I.createInfo[key]=0;
			}
			ClassCreateHook.I.createInfo[key]=ClassCreateHook.I.createInfo[key]+1;
			RunProfile.run(key,depth+6);
		}

		__proto.getClassCreateInfo=function(clz){
			var key;
			key=ClassTool.getClassName(clz);
			return RunProfile.getRunInfo(key);
		}

		ClassCreateHook.isInited=false;
		__static(ClassCreateHook,
		['I',function(){return this.I=new ClassCreateHook();}
		]);
		return ClassCreateHook;
	})()


	//class laya.debug.tools.enginehook.RenderSpriteHook
	var RenderSpriteHook=(function(){
		function RenderSpriteHook(){
			//this._next=null;
			//this._fun=null;
			//this._oldCanvas=null;
		}

		__class(RenderSpriteHook,'laya.debug.tools.enginehook.RenderSpriteHook');
		var __proto=RenderSpriteHook.prototype;
		__proto.createRenderSprite=function(type,next){
			var rst;
			rst=RenderSpriteHook._preCreateFun(type,next);
			if (type==0x10){
				rst["_oldCanvas"]=rst._fun;
				rst._fun=RenderSpriteHook.I._canvas;
			}
			return rst;
		}

		__proto._canvas=function(sprite,context,x,y){
			if (!SpriteRenderForVisibleAnalyse.allowRendering)return;
			var _cacheCanvas=sprite._$P.cacheCanvas;
			var _next=this._next;
			if (!_cacheCanvas||SpriteRenderForVisibleAnalyse.isVisibleTesting){
				_next._fun.call(_next,sprite,context,x,y);
				return;
			};
			var preTime;
			preTime=Browser.now();
			var tx=_cacheCanvas.ctx;
			var _repaint=sprite._needRepaint()|| (!tx);
			this._oldCanvas(sprite,context,x,y);
			if (Config.showCanvasMark){
			}
			if (_repaint){
				CacheAnalyser.I.reCacheCanvas(sprite,Browser.now()-preTime);
				}else{
				CacheAnalyser.I.renderCanvas(sprite,Browser.now()-preTime);
			}
		}

		RenderSpriteHook.init=function(){
			if (RenderSpriteHook.I)return;
			RenderSpriteHook.I=new RenderSpriteHook();
			RenderSpriteHook._preCreateFun=RunDriver.createRenderSprite;
			RunDriver.createRenderSprite=RenderSpriteHook.I.createRenderSprite;
		}

		RenderSpriteHook.IMAGE=0x01;
		RenderSpriteHook.FILTERS=0x02;
		RenderSpriteHook.ALPHA=0x04;
		RenderSpriteHook.TRANSFORM=0x08;
		RenderSpriteHook.CANVAS=0x10;
		RenderSpriteHook.BLEND=0x20;
		RenderSpriteHook.CLIP=0x40;
		RenderSpriteHook.STYLE=0x80;
		RenderSpriteHook.GRAPHICS=0x100;
		RenderSpriteHook.CUSTOM=0x200;
		RenderSpriteHook.ENABLERENDERMERGE=0x400;
		RenderSpriteHook.CHILDS=0x800;
		RenderSpriteHook.INIT=0x11111;
		RenderSpriteHook.renders=[];
		RenderSpriteHook.I=null
		RenderSpriteHook._preCreateFun=null
		return RenderSpriteHook;
	})()


	//class laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse
	var SpriteRenderForVisibleAnalyse=(function(){
		function SpriteRenderForVisibleAnalyse(){
			this._repaint=1;
			this._renderType=1;
			this._x=0;
			this._y=0;
			this.target=null;
			this.isTargetRenderd=false;
			this.preFun=null;
			this._next=null;
			this.pgraphic=RenderSprite["prototype"]["_graphics"];
			this.pimage=RenderSprite["prototype"]["_image"];
			this.pimage2=RenderSprite["prototype"]["_image2"];
		}

		__class(SpriteRenderForVisibleAnalyse,'laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse');
		var __proto=SpriteRenderForVisibleAnalyse.prototype;
		__proto.setRenderHook=function(){
			Sprite["prototype"]["render"]=SpriteRenderForVisibleAnalyse.I.render;
		}

		/**
		*更新、呈现显示对象。
		*@param context 渲染的上下文引用。
		*@param x X轴坐标。
		*@param y Y轴坐标。
		*/
		__proto.render=function(context,x,y){
			var me;
			me=this;
			if (DebugInfoLayer.I.isDebugItem(me))return;
			if (me==laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.I.target){
				laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.allowRendering=true;
				laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.I.isTargetRenderd=true;
				CanvasTools.clearCanvas(SpriteRenderForVisibleAnalyse.mainCanvas);
			}
			RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
			if (me==laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.I.target){
				SpriteRenderForVisibleAnalyse.tarRec=CanvasTools.getCanvasDisRec(laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.mainCanvas);
				console.log("rec",SpriteRenderForVisibleAnalyse.tarRec.toString());
				if (SpriteRenderForVisibleAnalyse.tarRec.width >0&& SpriteRenderForVisibleAnalyse.tarRec.height > 0){
					SpriteRenderForVisibleAnalyse.isTarRecOK=true;
					SpriteRenderForVisibleAnalyse.preImageData=CanvasTools.getImageDataFromCanvasByRec(SpriteRenderForVisibleAnalyse.mainCanvas,SpriteRenderForVisibleAnalyse.tarRec);
					SpriteRenderForVisibleAnalyse.tarImageData=CanvasTools.getImageDataFromCanvasByRec(SpriteRenderForVisibleAnalyse.mainCanvas,SpriteRenderForVisibleAnalyse.tarRec);
					}else{
					console.log("tarRec Not OK:",SpriteRenderForVisibleAnalyse.tarRec);
				}
				}else{
				if (SpriteRenderForVisibleAnalyse.isTarRecOK){
					SpriteRenderForVisibleAnalyse.tImageData=CanvasTools.getImageDataFromCanvasByRec(SpriteRenderForVisibleAnalyse.mainCanvas,SpriteRenderForVisibleAnalyse.tarRec);
					var dRate=NaN;
					dRate=CanvasTools.getDifferRate(SpriteRenderForVisibleAnalyse.preImageData,SpriteRenderForVisibleAnalyse.tImageData);
					SpriteRenderForVisibleAnalyse.preImageData=SpriteRenderForVisibleAnalyse.tImageData;
					if (dRate > 0){
						VisibleAnalyser.addCoverNode(me,dRate);
					}
				}
			}
		}

		__proto.analyseNode=function(node){
			VisibleAnalyser.resetCoverList();
			if (Sprite["prototype"]["render"] !=SpriteRenderForVisibleAnalyse.I.render){
				this.preFun=Sprite["prototype"]["render"];
			}
			this.target=node;
			Sprite["prototype"]["render"]=this.render;
			if (!SpriteRenderForVisibleAnalyse.tarCanvas)
				SpriteRenderForVisibleAnalyse.tarCanvas=CanvasTools.createCanvas(Laya.stage.width,Laya.stage.height);
			if (!SpriteRenderForVisibleAnalyse.mainCanvas)
				SpriteRenderForVisibleAnalyse.mainCanvas=CanvasTools.createCanvas(Laya.stage.width,Laya.stage.height);
			this.isTargetRenderd=false;
			SpriteRenderForVisibleAnalyse.isVisibleTesting=true;
			SpriteRenderForVisibleAnalyse.allowRendering=false;
			CanvasTools.clearCanvas(SpriteRenderForVisibleAnalyse.mainCanvas);
			CanvasTools.clearCanvas(SpriteRenderForVisibleAnalyse.tarCanvas);
			SpriteRenderForVisibleAnalyse.isTarRecOK=false;
			var ctx=new RenderContext(SpriteRenderForVisibleAnalyse.mainCanvas.width,SpriteRenderForVisibleAnalyse.mainCanvas.height,SpriteRenderForVisibleAnalyse.mainCanvas);
			SpriteRenderForVisibleAnalyse.mainCanvas=ctx.canvas;
			this.render.call(Laya.stage,ctx,0,0);
			if (!SpriteRenderForVisibleAnalyse.isTarRecOK){
				SpriteRenderForVisibleAnalyse.coverRate=0;
				}else{
				SpriteRenderForVisibleAnalyse.coverRate=CanvasTools.getDifferRate(SpriteRenderForVisibleAnalyse.preImageData,SpriteRenderForVisibleAnalyse.tarImageData);
			}
			VisibleAnalyser.coverRate=SpriteRenderForVisibleAnalyse.coverRate;
			VisibleAnalyser.isTarRecOK=SpriteRenderForVisibleAnalyse.isTarRecOK;
			console.log("coverRate:",SpriteRenderForVisibleAnalyse.coverRate);
			this.isTargetRenderd=false;
			SpriteRenderForVisibleAnalyse.isVisibleTesting=false;
			SpriteRenderForVisibleAnalyse.allowRendering=true;
			Sprite["prototype"]["render"]=this.preFun;
		}

		__proto.noRenderMode=function(){
			return;
			RenderSprite["prototype"]["_graphics"]=this.m_graphics;
			RenderSprite["prototype"]["_image"]=this.m_image;
			RenderSprite["prototype"]["_image2"]=this.m_image2;
		}

		__proto.normalMode=function(){
			RenderSprite["prototype"]["_graphics"]=this.pgraphic;
			RenderSprite["prototype"]["_image"]=this.pimage;
			RenderSprite["prototype"]["_image2"]=this.pimage2;
		}

		__proto.inits=function(){
			this.noRenderMode();
		}

		__proto.m_graphics=function(sprite,context,x,y){
			if (laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.allowRendering){
				var tf=sprite._style._tf;
				sprite._graphics && sprite._graphics._render(sprite,context,x-tf.translateX,y-tf.translateY);
			};
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto.m_image=function(sprite,context,x,y){
			if (laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.allowRendering){
				var style=sprite._style;
				context.ctx.drawTexture2(x,y,style._tf.translateX,style._tf.translateY,sprite.transform,style.alpha,style.blendMode,sprite._graphics._one);
			}
		}

		__proto.m_image2=function(sprite,context,x,y){
			if (laya.debug.tools.enginehook.SpriteRenderForVisibleAnalyse.allowRendering){
				var tf=sprite._style._tf;
				context.ctx.drawTexture2(x,y,tf.translateX,tf.translateY,sprite.transform,1,null,sprite._graphics._one);
			}
		}

		SpriteRenderForVisibleAnalyse.tarCanvas=null
		SpriteRenderForVisibleAnalyse.mainCanvas=null
		SpriteRenderForVisibleAnalyse.preImageData=null
		SpriteRenderForVisibleAnalyse.tImageData=null
		SpriteRenderForVisibleAnalyse.tarImageData=null
		SpriteRenderForVisibleAnalyse.tarRec=null
		SpriteRenderForVisibleAnalyse.isTarRecOK=false;
		SpriteRenderForVisibleAnalyse.isVisibleTesting=false;
		SpriteRenderForVisibleAnalyse.allowRendering=true;
		SpriteRenderForVisibleAnalyse.coverRate=NaN
		__static(SpriteRenderForVisibleAnalyse,
		['I',function(){return this.I=new SpriteRenderForVisibleAnalyse();}
		]);
		return SpriteRenderForVisibleAnalyse;
	})()


	//class laya.debug.tools.enginehook.SpriteRenderHook
	var SpriteRenderHook=(function(){
		function SpriteRenderHook(){
			this._repaint=1;
			this._renderType=1;
			this._x=0;
			this._y=0;
		}

		__class(SpriteRenderHook,'laya.debug.tools.enginehook.SpriteRenderHook');
		var __proto=SpriteRenderHook.prototype;
		/**
		*更新、呈现显示对象。
		*@param context 渲染的上下文引用。
		*@param x X轴坐标。
		*@param y Y轴坐标。
		*/
		__proto.render=function(context,x,y){
			if ((this)==Laya.stage){
				CacheAnalyser.renderLoopBegin();
			};
			var preTime=0;
			preTime=Browser.now();
			Stat.spriteCount++;
			if (this["ShowBorderSign"]){
				DebugTool.showDisBoundToSprite(this,DebugInfoLayer.I.cacheViewLayer,DebugConsts.SPRITE_REC_COLOR,DebugConsts.SPRITE_REC_LINEWIDTH);
			}
			RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
			this._repaint=0;
			RenderAnalyser.I.render(this,Browser.now()-preTime);
		}

		SpriteRenderHook.init=function(){
			if (SpriteRenderHook.I)return;
			SpriteRenderHook.I=new SpriteRenderHook();
			SpriteRenderHook.setRenderHook();
		}

		SpriteRenderHook.setRenderHook=function(){
			Sprite["prototype"]["render"]=SpriteRenderHook.I.render;
		}

		SpriteRenderHook.showDisplayBorder=function(sprite,ifShowBorder){
			(ifShowBorder===void 0)&& (ifShowBorder=true);
			sprite["ShowBorderSign"]=ifShowBorder;
		}

		SpriteRenderHook.isDisplayShowBorder=function(sprite){
			return sprite["ShowBorderSign"];
		}

		SpriteRenderHook.I=null
		SpriteRenderHook.ShowBorderSign="ShowBorderSign";
		return SpriteRenderHook;
	})()


	//class laya.debug.tools.hook.FunHook
	var FunHook=(function(){
		function FunHook(){}
		__class(FunHook,'laya.debug.tools.hook.FunHook');
		FunHook.hook=function(obj,funName,preFun,aftFun){
			FunHook.hookFuns(obj,funName,[preFun,obj[funName],aftFun],1);
		}

		FunHook.hookAllFun=function(obj){
			var key;
			var arr;
			arr=ClassTool.getOwnPropertyNames(obj);
			for(key in arr){
				key=arr[key];
				if (FunHook.special[key])continue ;
				console.log("try hook:",key);
				if((typeof (obj[key])=='function')){
					console.log("hook:",key);
					FunHook.hookFuns(obj,key,[FunHook.getTraceMsg("call:"+key),obj[key]],1);
				}
			}
			if(obj["__proto__"]){
				FunHook.hookAllFun(obj["__proto__"]);
				}else{
				console.log("end:",obj);
			}
		}

		FunHook.getTraceMsg=function(msg){
			var rst;
			rst=function (){
				console.log(msg);
			}
			return rst;
		}

		FunHook.hookFuns=function(obj,funName,funList,rstI){
			(rstI===void 0)&& (rstI=-1);
			var _preFun=obj[funName];
			var newFun;
			newFun=function (__args){
				var args=arguments;
				var rst;
				var i=0;
				var len=0;
				len=funList.length;
				for(i=0;i<len;i++){
					if(!funList[i])continue ;
					if(i==rstI){
						rst=funList[i].apply(this,args);
						}else{
						funList[i].apply(this,args);
					}
				}
				return rst;
			};
			newFun["pre"]=_preFun;
			obj[funName]=newFun;
		}

		FunHook.removeHook=function(obj,funName){
			if(obj[funName].pre!=null){
				obj[funName]=obj[funName].pre;
			}
		}

		FunHook.debugHere=function(){
			debugger;;
		}

		FunHook.traceLoc=function(level,msg){
			(level===void 0)&& (level=0);
			(msg===void 0)&& (msg="");
			console.log(msg,"fun loc:",TraceTool.getCallLoc(3+level));
		}

		FunHook.getLocFun=function(level,msg){
			(level===void 0)&& (level=0);
			(msg===void 0)&& (msg="");
			level+=1;
			var rst;
			rst=function (){
				FunHook.traceLoc(level,msg);
			}
			return rst;
		}

		__static(FunHook,
		['special',function(){return this.special={
				"length":true,
				"name":true,
				"arguments":true,
				"caller":true,
				"prototype":true,
				"is":true,
				"isExtensible":true,
				"isFrozen":true,
				"isSealed":true,
				"preventExtensions":true,
				"seal":true,
				"unobserve":true,
				"apply":true,
				"call":true,
				"bind":true,
				"freeze":true,
				"unobserve":true
		};}

		]);
		return FunHook;
	})()


	//class laya.debug.tools.hook.VarHook
	var VarHook=(function(){
		function VarHook(){}
		__class(VarHook,'laya.debug.tools.hook.VarHook');
		VarHook.hookVar=function(obj,name,setHook,getHook){
			if(!setHook)setHook=[];
			if(!getHook)getHook=[];
			var preO=obj;
			var preValue=obj[name];
			var des;
			des=ClassTool.getOwnPropertyDescriptor(obj,name);
			var ndes={};
			var mSet=function (value){
				console.log("var hook set "+name+":",value);
				preValue=value;
			};
			var mGet=function (){
				console.log("var hook get"+name+":",preValue);
				return preValue;
			}
			if(des){
				ndes.set=mSet;
				ndes.get=mGet;
				ndes.enumerable=des.enumerable;
				setHook.push(ndes.set);
				getHook.push(ndes.get);
				FunHook.hookFuns(ndes,"set",setHook);
				FunHook.hookFuns(ndes,"get",getHook,getHook.length-1);
				ClassTool.defineProperty(obj,name,ndes);
				return;
			}
			while(!des&&obj["__proto__"]){
				obj=obj["__proto__"];
				des=ClassTool.getOwnPropertyDescriptor(obj,name);
			}
			if (des){
				ndes.set=des.set?des.set:mSet;
				ndes.get=des.get?des.get:mGet;
				ndes.enumerable=des.enumerable;
				setHook.push(ndes.set);
				getHook.push(ndes.get);
				FunHook.hookFuns(ndes,"set",setHook);
				FunHook.hookFuns(ndes,"get",getHook,getHook.length-1);
				ClassTool.defineProperty(preO,name,ndes);
			}
			if(!des){
				console.log("get des fail add directly");
				ndes.set=mSet;
				ndes.get=mGet;
				setHook.push(ndes.set);
				getHook.push(ndes.get);
				FunHook.hookFuns(ndes,"set",setHook);
				FunHook.hookFuns(ndes,"get",getHook,getHook.length-1);
				ClassTool.defineProperty(obj,name,ndes);
			}
		}

		VarHook.getLocFun=function(msg,level){
			(msg===void 0)&& (msg="");
			(level===void 0)&& (level=0);
			level+=1;
			var rst;
			rst=function (){
				FunHook.traceLoc(level,msg);
			}
			return rst;
		}

		return VarHook;
	})()


	//class laya.debug.tools.IDTools
	var IDTools=(function(){
		function IDTools(){
			this.tID=1;
		}

		__class(IDTools,'laya.debug.tools.IDTools');
		var __proto=IDTools.prototype;
		__proto.getID=function(){
			return this.tID++;
		}

		IDTools.getAID=function(){
			return IDTools._ID.getID();
		}

		IDTools.idObjE=function(obj,sign){
			(sign===void 0)&& (sign="default");
			if (obj["_M_id_"])return obj;
			if(!sign){
				sign="default";
			}
			if(!IDTools._idDic[sign]){
				IDTools._idDic[sign]=new IDTools();
			}
			obj["_M_id_"]=IDTools._idDic[sign].getAID();
			return obj;
		}

		IDTools.setObjID=function(obj,id){
			obj["_M_id_"]=id;
			return obj;
		}

		IDTools.idObj=function(obj){
			if (obj["_M_id_"])return obj;
			obj["_M_id_"]=IDTools.getAID();
			return obj;
		}

		IDTools.getObjID=function(obj){
			if(!obj)return-1;
			return obj["_M_id_"];
		}

		IDTools.idSign="_M_id_";
		__static(IDTools,
		['_ID',function(){return this._ID=new IDTools();},'_idDic',function(){return this._idDic={"default":new IDTools()};}
		]);
		return IDTools;
	})()


	//class laya.debug.tools.MathTools
	var MathTools=(function(){
		function MathTools(){}
		__class(MathTools,'laya.debug.tools.MathTools');
		MathTools.sortBigFirst=function(a,b){
			if (a==b)
				return 0;
			return b > a ? 1 :-1;
		}

		MathTools.sortSmallFirst=function(a,b){
			if (a==b)
				return 0;
			return b > a ?-1 :1;
		}

		MathTools.sortNumBigFirst=function(a,b){
			return parseFloat(b)-parseFloat(a);
		}

		MathTools.sortNumSmallFirst=function(a,b){
			return parseFloat(a)-parseFloat(b);
		}

		MathTools.sortByKey=function(key,bigFirst,forceNum){
			(bigFirst===void 0)&& (bigFirst=false);
			(forceNum===void 0)&& (forceNum=true);
			var _sortFun;
			if (bigFirst){
				_sortFun=forceNum ? MathTools.sortNumBigFirst :MathTools.sortBigFirst;
				}else {
				_sortFun=forceNum ? MathTools.sortNumSmallFirst :MathTools.sortSmallFirst;
			}
			return function (a,b){
				return _sortFun(a[key],b[key]);
			};
		}

		return MathTools;
	})()


	//class laya.debug.tools.MouseEventAnalyser
	var MouseEventAnalyser=(function(){
		function MouseEventAnalyser(){}
		__class(MouseEventAnalyser,'laya.debug.tools.MouseEventAnalyser');
		MouseEventAnalyser.analyseNode=function(node){
			DebugTool.showDisBound(node,true);
			var _node;
			_node=node;
			ObjectTools.clearObj(MouseEventAnalyser.infoO);
			ObjectTools.clearObj(MouseEventAnalyser.nodeO);
			ObjectTools.clearObj(MouseEventAnalyser.hitO);
			var nodeList;
			nodeList=[];
			while (node){
				IDTools.idObj(node);
				MouseEventAnalyser.nodeO[IDTools.getObjID(node)]=node;
				nodeList.push(node);
				node=node.parent;
			}
			MouseEventAnalyser.check(Laya.stage,Laya.stage.mouseX,Laya.stage.mouseY,null);
			var canStr;
			if (MouseEventAnalyser.hitO[IDTools.getObjID(_node)]){
				console.log("can hit");
				canStr="can hit";
			}
			else{
				console.log("can't hit");
				canStr="can't hit";
			};
			var i=0,len=0;
			nodeList=nodeList.reverse();
			len=nodeList.length;
			var rstTxts;
			rstTxts=["[分析对象]:"+ClassTool.getNodeClassAndName(_node)+":"+canStr];
			for (i=0;i < len;i++){
				node=nodeList[i];
				if (MouseEventAnalyser.hitO[IDTools.getObjID(node)]){
					console.log("can hit:",ClassTool.getNodeClassAndName(node));
					console.log("原因:",MouseEventAnalyser.infoO[IDTools.getObjID(node)]);
					rstTxts.push("can hit:"+" "+ClassTool.getNodeClassAndName(node));
					rstTxts.push("原因:"+" "+MouseEventAnalyser.infoO[IDTools.getObjID(node)]);
				}
				else{
					console.log("can't hit:"+ClassTool.getNodeClassAndName(node));
					console.log("原因:",MouseEventAnalyser.infoO[IDTools.getObjID(node)] ? MouseEventAnalyser.infoO[IDTools.getObjID(node)] :"鼠标事件在父级已停止派发");
					rstTxts.push("can't hit:"+" "+ClassTool.getNodeClassAndName(node));
					rstTxts.push("原因:"+" "+(MouseEventAnalyser.infoO[IDTools.getObjID(node)] ? MouseEventAnalyser.infoO[IDTools.getObjID(node)] :"鼠标事件在父级已停止派发"));
				}
			};
			var rstStr;
			rstStr=rstTxts.join("\n");
			ToolPanel.I.showTxtInfo(rstStr);
		}

		MouseEventAnalyser.check=function(sp,mouseX,mouseY,callBack){
			IDTools.idObj(sp);
			var isInAnlyseChain=false;
			isInAnlyseChain=MouseEventAnalyser.nodeO[IDTools.getObjID(sp)];
			MouseEventAnalyser._point.setTo(mouseX,mouseY);
			sp.fromParentPoint(MouseEventAnalyser._point);
			mouseX=MouseEventAnalyser._point.x;
			mouseY=MouseEventAnalyser._point.y;
			var scrollRect=sp.scrollRect;
			if (scrollRect){
				MouseEventAnalyser._rect.setTo(scrollRect.x,scrollRect.y,scrollRect.width,scrollRect.height);
				var isHit=MouseEventAnalyser._rect.contains(mouseX,mouseY);
				if (!isHit){
					if (isInAnlyseChain){
						MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="scrollRect没有包含鼠标"+MouseEventAnalyser._rect.toString()+":"+mouseX+","+mouseY;
					}
					return false;
				}
			};
			var i=0,len=0;
			var cList;
			cList=sp._childs;
			len=cList.length;
			var child;
			var childInChain;
			childInChain=null;
			for (i=0;i < len;i++){
				child=cList[i];
				IDTools.idObj(child);
				if (MouseEventAnalyser.nodeO[IDTools.getObjID(child)]){
					childInChain=child;
					break ;
				}
			};
			var coverByOthers=false;
			coverByOthers=childInChain ? true :false;
			var flag=false;
			if (sp.hitTestPrior && !sp.mouseThrough && !MouseEventAnalyser.hitTest(sp,mouseX,mouseY)){
				MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="hitTestPrior=true，宽高区域不包含鼠标:"+":"+mouseX+","+mouseY+" size:"+sp.width+","+sp.height;
				return false;
			}
			for (i=sp._childs.length-1;i >-1;i--){
				child=sp._childs[i];
				if (child==childInChain){
					if (!childInChain.mouseEnabled){
						MouseEventAnalyser.infoO[IDTools.getObjID(childInChain)]="mouseEnabled=false";
					}
					if (!childInChain.visible){
						MouseEventAnalyser.infoO[IDTools.getObjID(childInChain)]="visible=false";
					}
					coverByOthers=false;
				}
				if (child.mouseEnabled && child.visible){
					flag=MouseEventAnalyser.check(child,mouseX ,mouseY,callBack);
					if (flag){
						MouseEventAnalyser.hitO[IDTools.getObjID(sp)]=true;
						MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="子对象被击中";
						if (child==childInChain){
							MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="子对象被击中,"+"击中对象在分析链中";
						}
						else{
							MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="子对象被击中,"+"击中对象不在分析链中";
							if (coverByOthers){
								MouseEventAnalyser.infoO[IDTools.getObjID(childInChain)]="被兄弟节点挡住,兄弟节点信息:"+ClassTool.getNodeClassAndName(child)+","+child.getBounds().toString();
								DebugTool.showDisBound(child,false,"#ffff00");
							}
						}
						return true;
					}
					else{
						if (child==childInChain){
							coverByOthers=false;
						}
					}
				}
			};
			var mHitRect=new Rectangle();
			var graphicHit=false;
			graphicHit=sp.getGraphicBounds().contains(mouseX,mouseY);
			if (sp.width > 0 && sp.height > 0){
				var hitRect=MouseEventAnalyser._rect;
				if (!sp.mouseThrough){
					if (sp.hitArea)
						hitRect=sp.hitArea;
					else
					hitRect.setTo(0,0,sp.width,sp.height);
					mHitRect.copyFrom(hitRect);
					isHit=hitRect.contains(mouseX,mouseY);
				}
				else{
					isHit=graphicHit;
					mHitRect.copyFrom(sp.getGraphicBounds());
				}
				if (isHit){
					MouseEventAnalyser.hitO[IDTools.getObjID(sp)]=true;
				}
				}else{
			}
			if (!isHit){
				if (graphicHit){
					MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="子对象未包含鼠标，实际绘图区域包含鼠标，设置的宽高区域不包含鼠标:"+":"+mouseX+","+mouseY+" hitRec:"+mHitRect.toString()+" graphicBounds:"+sp.getGraphicBounds().toString()+"，设置mouseThrough=true或将宽高设置到实际绘图区域可解决问题";
					}else{
					MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="子对象未包含鼠标，实际绘图区域不包含鼠标，设置的宽高区域不包含鼠标:"+":"+mouseX+","+mouseY+" hitRec:"+mHitRect.toString()+" graphicBounds:"+sp.getGraphicBounds().toString();
				}
			}
			else{
				MouseEventAnalyser.infoO[IDTools.getObjID(sp)]="自身区域被击中";
			}
			return isHit;
		}

		MouseEventAnalyser.hitTest=function(sp,mouseX,mouseY){
			var isHit=false;
			if ((sp.hitArea instanceof laya.utils.HitArea )){
				return sp.hitArea.isHit(mouseX,mouseY);
			}
			if (sp.width > 0 && sp.height > 0 || sp.mouseThrough || sp.hitArea){
				var hitRect=MouseEventAnalyser._rect;
				if (!sp.mouseThrough){
					if (sp.hitArea)hitRect=sp.hitArea;
					else hitRect.setTo(0,0,sp.width,sp.height);
					isHit=hitRect.contains(mouseX,mouseY);
					}else {
					isHit=sp.getGraphicBounds().contains(mouseX,mouseY);
				}
			}
			return isHit;
		}

		MouseEventAnalyser.infoO={};
		MouseEventAnalyser.nodeO={};
		MouseEventAnalyser.hitO={};
		__static(MouseEventAnalyser,
		['_matrix',function(){return this._matrix=new Matrix();},'_point',function(){return this._point=new Point();},'_rect',function(){return this._rect=new Rectangle();}
		]);
		return MouseEventAnalyser;
	})()


	//class laya.debug.tools.ObjectTools
	var ObjectTools=(function(){
		function ObjectTools(){}
		__class(ObjectTools,'laya.debug.tools.ObjectTools');
		ObjectTools.getFlatKey=function(tKey,aKey){
			if(tKey=="")return aKey;
			return tKey+ObjectTools.sign+aKey;
		}

		ObjectTools.flatObj=function(obj,rst,tKey){
			(tKey===void 0)&& (tKey="");
			rst=rst?rst:{};
			var key;
			var tValue;
			for(key in obj){
				if((typeof (obj[key])=='object')){
					ObjectTools.flatObj(obj[key],rst,ObjectTools.getFlatKey(tKey,key));
					}else{
					tValue=obj[key];
					rst[ObjectTools.getFlatKey(tKey,key)]=obj[key];
				}
			}
			return rst;
		}

		ObjectTools.recoverObj=function(obj){
			var rst={};
			var tKey;
			for(tKey in obj){
				ObjectTools.setKeyValue(rst,tKey,obj[tKey]);
			}
			return rst;
		}

		ObjectTools.differ=function(objA,objB){
			var tKey;
			var valueA;
			var valueB;
			objA=ObjectTools.flatObj(objA);
			objB=ObjectTools.flatObj(objB);
			var rst={};
			for(tKey in objA){
				if(!objB.hasOwnProperty(tKey)){
					rst[tKey]="被删除";
				}
			}
			for(tKey in objB){
				if(objB[tKey]!=objA[tKey]){
					rst[tKey]={"pre":objA[tKey],"now":objB[tKey]};
				}
			}
			return rst;
		}

		ObjectTools.traceDifferObj=function(obj){
			var key;
			var tO;
			for(key in obj){
				if((typeof (obj[key])=='string')){
					console.log(key+":",obj[key]);
					}else{
					tO=obj[key];
					console.log(key+":","now:",tO["now"],"pre:",tO["pre"]);
				}
			}
		}

		ObjectTools.setKeyValue=function(obj,flatKey,value){
			if(flatKey.indexOf(ObjectTools.sign)>=0){
				var keys=flatKey.split(ObjectTools.sign);
				var tKey;
				while(keys.length>1){
					tKey=keys.shift();
					if(!obj[tKey]){
						obj[tKey]={};
						console.log("addKeyObj:",tKey);
					}
					obj=obj[tKey];
					if(!obj){
						console.log("wrong flatKey:",flatKey);
						return;
					}
				}
				obj[keys.shift()]=value;
				}else{
				obj[flatKey]=value;
			}
		}

		ObjectTools.clearObj=function(obj){
			var key;
			for (key in obj){
				delete obj[key];
			}
		}

		ObjectTools.copyObjFast=function(obj){
			var jsStr;
			jsStr=laya.debug.tools.ObjectTools.getJsonString(obj);
			return laya.debug.tools.ObjectTools.getObj(jsStr);
		}

		ObjectTools.copyObj=function(obj){
			if((obj instanceof Array))return ObjectTools.copyArr(obj);
			var rst={};
			var key;
			for(key in obj){
				if(obj[key]===null||obj[key]===undefined){
					rst[key]=obj[key];
				}else
				if(((obj[key])instanceof Array)){
					rst[key]=ObjectTools.copyArr(obj[key]);
				}
				else
				if((typeof (obj[key])=='object')){
					rst[key]=ObjectTools.copyObj(obj[key]);
					}else{
					rst[key]=obj[key];
				}
			}
			return rst;
		}

		ObjectTools.copyArr=function(arr){
			var rst;
			rst=[];
			var i=0,len=0;
			len=arr.length;
			for(i=0;i<len;i++){
				rst.push(ObjectTools.copyObj(arr[i]));
			}
			return rst;
		}

		ObjectTools.concatArr=function(src,a){
			if (!a)return src;
			if (!src)return a;
			var i=0,len=a.length;
			for (i=0;i < len;i++){
				src.push(a[i]);
			}
			return src;
		}

		ObjectTools.insertArrToArr=function(src,insertArr,pos){
			(pos===void 0)&& (pos=0);
			if (pos < 0)pos=0;
			if (pos > src.length)pos=src.length;
			var preLen=src.length;
			var i=0,len=0;
			src.length+=insertArr.length;
			var moveLen=0;
			moveLen=insertArr.length;
			for (i=src.length-1;i >=pos;i--){
				src[i]=src[i-moveLen];
			}
			len=insertArr.length;
			for (i=0;i < len;i++){
				src[pos+i]=insertArr[i];
			}
			return src;
		}

		ObjectTools.clearArr=function(arr){
			if (!arr)return arr;
			arr.length=0;
			return arr;
		}

		ObjectTools.removeFromArr=function(arr,item){
			var i=0,len=0;
			len=arr.length;
			for(i=0;i<len;i++){
				if(arr[i]==item){
					arr[i].splice(i,1);
					return;
				}
			}
		}

		ObjectTools.setValueArr=function(src,v){
			src || (src=[]);
			src.length=0;
			return ObjectTools.concatArr(src,v);
		}

		ObjectTools.getFrom=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src[i]);
			}
			return rst;
		}

		ObjectTools.getFromR=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src.pop());
			}
			return rst;
		}

		ObjectTools.enableDisplayTree=function(dis){
			while (dis){
				dis.mouseEnabled=true;
				dis=dis.parent;
			}
		}

		ObjectTools.getJsonString=function(obj){
			var rst;
			rst=JSON.stringify(obj);
			return rst;
		}

		ObjectTools.getObj=function(jsonStr){
			var rst;
			rst=JSON.parse(jsonStr);
			return rst;
		}

		ObjectTools.getKeyArr=function(obj){
			var rst;
			var key;
			rst=[];
			for(key in obj){
				rst.push(key);
			}
			return rst;
		}

		ObjectTools.getObjValues=function(dataList,key){
			var rst;
			var i=0,len=0;
			len=dataList.length;
			rst=[];
			for(i=0;i<len;i++){
				rst.push(dataList[i][key]);
			}
			return rst;
		}

		ObjectTools.hasKeys=function(obj,keys){
			var i=0,len=0;
			len=keys.length;
			for(i=0;i<len;i++){
				if(!obj.hasOwnProperty(keys[i]))return false;
			}
			return true;
		}

		ObjectTools.copyValueByArr=function(tar,src,keys){
			var i=0,len=keys.length;
			for(i=0;i<len;i++){
				if(!(src[keys[i]]===null))
					tar[keys[i]]=src[keys[i]];
			}
		}

		ObjectTools.getNoSameArr=function(arr){
			var i=0,len=0;
			var rst;
			rst=[];
			var tItem;
			len=arr.length;
			for (i=0;i < len;i++){
				tItem=arr[i];
				if (rst.indexOf(tItem)< 0){
					rst.push(tItem);
				}
			}
			return rst;
		}

		ObjectTools.insertValue=function(tar,src){
			var key;
			for (key in src){
				tar[key]=src[key];
			}
		}

		ObjectTools.replaceValue=function(obj,replaceO){
			var key;
			for(key in obj){
				if(replaceO.hasOwnProperty(obj[key])){
					obj[key]=replaceO[obj[key]];
				}
				if((typeof (obj[key])=='object')){
					ObjectTools.replaceValue(obj[key],replaceO);
				}
			}
		}

		ObjectTools.setKeyValues=function(items,key,value){
			var i=0,len=0;
			len=items.length;
			for(i=0;i<len;i++){
				items[i][key]=value;
			}
		}

		ObjectTools.findItemPos=function(items,sign,value){
			var i=0,len=0;
			len=items.length;
			for(i=0;i<len;i++){
				if(items[i][sign]==value){
					return i;
				}
			}
			return-1;
		}

		ObjectTools.setObjValue=function(obj,key,value){
			obj[key]=value;
			return obj;
		}

		ObjectTools.setAutoTypeValue=function(obj,key,value){
			if(obj.hasOwnProperty(key)){
				if(ObjectTools.isNumber(obj[key])){
					obj[key]=parseFloat(value);
					}else{
					obj[key]=value;
				}
				}else{
				obj[key]=value;
			}
			return obj;
		}

		ObjectTools.getAutoValue=function(value){
			if (parseFloat(value)==value)return parseFloat(value);
			return value;
		}

		ObjectTools.isNumber=function(value){
			return (parseFloat(value)==value);
		}

		ObjectTools.isNaNS=function(value){
			return (value.toString()=="NaN");
		}

		ObjectTools.isNaN=function(value){
			if(typeof(value)=="number")return false;
			if(typeof(value)=="string"){
				if(parseFloat(value).toString()!="NaN"){
					if(parseFloat(value)==value){
						return false;
					}
				}
			}
			return true;
		}

		ObjectTools.getStrTypedValue=function(value){
			if(value=="false"){
				return false;
			}else
			if(value=="true"){
				return true;
			}else
			if(value=="null"){
				return null;
			}else
			if(value=="undefined"){
				return null;
				}else{
				return ObjectTools.getAutoValue(value);
			}
		}

		ObjectTools.createKeyValueDic=function(dataList,keySign){
			var rst;
			rst={};
			var i=0,len=0;
			len=dataList.length;
			var tItem;
			var tKey;
			for(i=0;i<len;i++){
				tItem=dataList[i];
				tKey=tItem[keySign];
				rst[tKey]=tItem;
			}
			return rst;
		}

		ObjectTools.sign="_";
		return ObjectTools;
	})()


	//class laya.debug.tools.ObjTimeCountTool
	var ObjTimeCountTool=(function(){
		function ObjTimeCountTool(){
			this.timeDic={};
			this.resultDic={};
			this.countDic={};
			this.resultCountDic={};
			this.nodeDic={};
			this.resultNodeDic={};
		}

		__class(ObjTimeCountTool,'laya.debug.tools.ObjTimeCountTool');
		var __proto=ObjTimeCountTool.prototype;
		__proto.addTime=function(sprite,time){
			IDTools.idObj(sprite);
			var key=0;
			key=IDTools.getObjID(sprite);
			if (!this.timeDic.hasOwnProperty(key)){
				this.timeDic[key]=0;
			}
			this.timeDic[key]=this.timeDic[key]+time;
			if (!this.countDic.hasOwnProperty(key)){
				this.countDic[key]=0;
			}
			this.countDic[key]=this.countDic[key]+1;
			this.nodeDic[key]=sprite;
		}

		__proto.getTime=function(sprite){
			IDTools.idObj(sprite);
			var key=0;
			key=IDTools.getObjID(sprite);
			if (!this.resultDic[key])return 0;
			return this.resultDic[key];
		}

		__proto.getCount=function(sprite){
			IDTools.idObj(sprite);
			var key=0;
			key=IDTools.getObjID(sprite);
			return this.resultCountDic[key];
		}

		__proto.reset=function(){
			var key;
			for (key in this.timeDic){
				this.timeDic[key]=0;
				this.countDic[key]=0;
			}
			ObjectTools.clearObj(this.nodeDic);
		}

		__proto.updates=function(){
			ObjectTools.clearObj(this.resultDic);
			ObjectTools.insertValue(this.resultDic,this.timeDic);
			ObjectTools.clearObj(this.resultCountDic);
			ObjectTools.insertValue(this.resultCountDic,this.countDic);
			ObjectTools.insertValue(this.resultNodeDic,this.nodeDic);
			this.reset();
		}

		return ObjTimeCountTool;
	})()


	//class laya.debug.tools.RecInfo
	var RecInfo=(function(){
		function RecInfo(){
			this.oX=0;
			this.oY=0;
			this.hX=1;
			this.hY=0;
			this.vX=0;
			this.vY=1;
		}

		__class(RecInfo,'laya.debug.tools.RecInfo');
		var __proto=RecInfo.prototype;
		__proto.initByPoints=function(oPoint,ePoint,vPoint){
			this.oX=oPoint.x;
			this.oY=oPoint.y;
			this.hX=ePoint.x;
			this.hY=ePoint.y;
			this.vX=vPoint.x;
			this.vY=vPoint.y;
		}

		__getset(0,__proto,'rotation',function(){
			return this.rotationRad/Math.PI*180;
		});

		__getset(0,__proto,'width',function(){
			return Math.sqrt((this.hX-this.oX)*(this.hX-this.oX)+(this.hY-this.oY)*(this.hY-this.oY));
		});

		__getset(0,__proto,'x',function(){
			return this.oX;
		});

		__getset(0,__proto,'rotationRadV',function(){
			var dx=this.vX-this.oX;
			var dy=this.vY-this.oY;
			return Math.atan2(dy,dx);
		});

		__getset(0,__proto,'y',function(){
			return this.oY;
		});

		__getset(0,__proto,'rotationRad',function(){
			var dx=this.hX-this.oX;
			var dy=this.hY-this.oY;
			return Math.atan2(dy,dx);
		});

		__getset(0,__proto,'height',function(){
			return Math.sqrt((this.vX-this.oX)*(this.vX-this.oX)+(this.vY-this.oY)*(this.vY-this.oY));
		});

		__getset(0,__proto,'rotationV',function(){
			return this.rotationRadV/Math.PI*180;
		});

		RecInfo.createByPoints=function(oPoint,ePoint,vPoint){
			var rst;
			rst=new RecInfo();
			rst.initByPoints(oPoint,ePoint,vPoint);
			return rst;
		}

		RecInfo.getGlobalPoints=function(sprite,x,y){
			return sprite.localToGlobal(new Point(x,y));
		}

		RecInfo.getGlobalRecInfo=function(sprite,x0,y0,x1,y1,x2,y2){
			(x0===void 0)&& (x0=0);
			(y0===void 0)&& (y0=0);
			(x1===void 0)&& (x1=1);
			(y1===void 0)&& (y1=0);
			(x2===void 0)&& (x2=0);
			(y2===void 0)&& (y2=1);
			return RecInfo.createByPoints(RecInfo.getGlobalPoints(sprite,x0,y0),RecInfo.getGlobalPoints(sprite,x1,y1),RecInfo.getGlobalPoints(sprite,x2,y2));
		}

		return RecInfo;
	})()


	//class laya.debug.tools.RenderAnalyser
	var RenderAnalyser=(function(){
		function RenderAnalyser(){
			this.timeDic={};
			this.resultDic={};
			this.countDic={};
			this.resultCountDic={};
			this.nodeDic={};
			this.isWorking=false;
			this.working=true;
		}

		__class(RenderAnalyser,'laya.debug.tools.RenderAnalyser');
		var __proto=RenderAnalyser.prototype;
		__proto.render=function(sprite,time){
			this.addTime(sprite,time);
		}

		__proto.addTime=function(sprite,time){
			IDTools.idObj(sprite);
			var key=0;
			key=IDTools.getObjID(sprite);
			if (!this.timeDic.hasOwnProperty(key)){
				this.timeDic[key]=0;
			}
			this.timeDic[key]=this.timeDic[key]+time;
			if (!this.countDic.hasOwnProperty(key)){
				this.countDic[key]=0;
			}
			this.countDic[key]=this.countDic[key]+1;
			this.nodeDic[key]=sprite;
		}

		__proto.getTime=function(sprite){
			IDTools.idObj(sprite);
			var key=0;
			key=IDTools.getObjID(sprite);
			if (!this.resultDic[key])return 0;
			return this.resultDic[key];
		}

		__proto.getCount=function(sprite){
			IDTools.idObj(sprite);
			var key=0;
			key=IDTools.getObjID(sprite);
			return this.resultCountDic[key];
		}

		__proto.reset=function(){
			var key;
			for (key in this.timeDic){
				this.timeDic[key]=0;
				this.countDic[key]=0;
			}
			ObjectTools.clearObj(this.nodeDic);
		}

		__proto.updates=function(){
			ObjectTools.clearObj(this.resultDic);
			ObjectTools.insertValue(this.resultDic,this.timeDic);
			ObjectTools.clearObj(this.resultCountDic);
			ObjectTools.insertValue(this.resultCountDic,this.countDic);
			this.reset();
		}

		__getset(0,__proto,'working',null,function(v){
			this.isWorking=v;
			if (v){
				Laya.timer.loop(NodeConsts.RenderCostMaxTime,this,this.updates);
				}else{
				Laya.timer.clear(this,this.updates);
			}
		});

		__static(RenderAnalyser,
		['I',function(){return this.I=new RenderAnalyser();}
		]);
		return RenderAnalyser;
	})()


	//class laya.debug.tools.resizer.DisResizer
	var DisResizer=(function(){
		function DisResizer(){}
		__class(DisResizer,'laya.debug.tools.resizer.DisResizer');
		DisResizer.init=function(){
			if (DisResizer._up)return;
			DisResizer._up=new AutoFillRec("T");
			DisResizer._up.height=2;
			DisResizer._up.type=0;
			DisResizer._down=new AutoFillRec("T");
			DisResizer._down.height=2;
			DisResizer._down.type=0;
			DisResizer._left=new AutoFillRec("R");
			DisResizer._left.width=2;
			DisResizer._left.type=1;
			DisResizer._right=new AutoFillRec("R");
			DisResizer._right.width=2;
			DisResizer._right.type=1;
			DisResizer._barList=[DisResizer._up,DisResizer._down,DisResizer._left,DisResizer._right];
			DisResizer.addEvent();
		}

		DisResizer.stageDown=function(e){
			var target;
			target=e.target;
			if (DisResizer._tar && DisControlTool.isInTree(DisResizer._tar,target)){
				return;
			}
			DisResizer.clear();
		}

		DisResizer.clear=function(){
			DisResizer._tar=null;
			Laya.stage.off("mouseup",null,DisResizer.stageDown);
			DisControlTool.removeItems(DisResizer._barList);
			DisResizer.clearDragEvents();
		}

		DisResizer.addEvent=function(){
			var i=0,len=0;
			var tBar;
			len=DisResizer._barList.length;
			for (i=0;i < len;i++){
				tBar=DisResizer._barList[i];
				tBar.on("mousedown",null,DisResizer.barDown);
			}
		}

		DisResizer.barDown=function(e){
			DisResizer.clearDragEvents();
			DisResizer.tBar=e.target;
			if (!DisResizer.tBar)return;
			var area;
			area=new Rectangle();
			if (DisResizer.tBar.type==0){
				area.x=DisResizer.tBar.x;
				area.width=0;
				area.y=DisResizer.tBar.y-200;
				area.height=400;
				}else{
				area.x=DisResizer.tBar.x-200;
				area.width=400;
				area.y=0;
				area.height=0;
			};
			var option;
			option={};
			option.area=area;
			DisResizer.tBar.record();
			DisResizer.tBar.startDrag(area);
			DisResizer.tBar.on("dragmove",null,DisResizer.draging);
			DisResizer.tBar.on("dragend",null,DisResizer.dragEnd);
		}

		DisResizer.draging=function(e){
			console.log("draging");
			if (!DisResizer.tBar)return;
			if (!DisResizer._tar)return;
			switch(DisResizer.tBar){
				case DisResizer._left:
					DisResizer._tar.x+=DisResizer.tBar.getDx();
					DisResizer._tar.width-=DisResizer.tBar.getDx();
					DisResizer._up.width-=DisResizer.tBar.getDx();
					DisResizer._down.width-=DisResizer.tBar.getDx();
					DisResizer._right.x-=DisResizer.tBar.getDx();
					DisResizer.tBar.x-=DisResizer.tBar.getDx();
					break ;
				case DisResizer._right:
					DisResizer._tar.width+=DisResizer.tBar.getDx();
					DisResizer._up.width+=DisResizer.tBar.getDx();
					DisResizer._down.width+=DisResizer.tBar.getDx();
					break ;
				case DisResizer._up:
					DisResizer._tar.y+=DisResizer.tBar.getDy();
					DisResizer._tar.height-=DisResizer.tBar.getDy();
					DisResizer._right.height-=DisResizer.tBar.getDy();
					DisResizer._left.height-=DisResizer.tBar.getDy();
					DisResizer._down.y-=DisResizer.tBar.getDy();
					DisResizer.tBar.y-=DisResizer.tBar.getDy();
					break ;
				case DisResizer._down:
					DisResizer._tar.height+=DisResizer.tBar.getDy();
					DisResizer._right.height+=DisResizer.tBar.getDy();
					DisResizer._left.height+=DisResizer.tBar.getDy();
					break ;
				}
			DisResizer.tBar.record();
		}

		DisResizer.dragEnd=function(e){
			console.log("dragEnd");
			DisResizer.clearDragEvents();
			DisResizer.updates();
		}

		DisResizer.clearDragEvents=function(){
			if (!DisResizer.tBar)return;
			DisResizer.tBar.off("dragmove",null,DisResizer.draging);
			DisResizer.tBar.off("dragend",null,DisResizer.dragEnd);
		}

		DisResizer.setUp=function(dis,force){
			(force===void 0)&& (force=false);
			if (force && dis==DisResizer._tar){
				return;
			};
			DisControlTool.removeItems(DisResizer._barList);
			if (DisResizer._tar==dis){
				DisResizer._tar=null;
				DisResizer.clearDragEvents();
				if(!force)
					return;
			}
			DisResizer._tar=dis;
			DisResizer.updates();
			DisControlTool.addItems(DisResizer._barList,dis);
			Laya.stage.off("mouseup",null,DisResizer.stageDown);
			Laya.stage.on("mouseup",null,DisResizer.stageDown);
		}

		DisResizer.updates=function(){
			var dis;
			dis=DisResizer._tar;
			if(!dis)return;
			var bounds;
			bounds=new Rectangle(0,0,dis.width,dis.height);
			DisResizer._up.x=bounds.x;
			DisResizer._up.y=bounds.y;
			DisResizer._up.width=bounds.width;
			DisResizer._down.x=bounds.x;
			DisResizer._down.y=bounds.y+bounds.height-2;
			DisResizer._down.width=bounds.width;
			DisResizer._left.x=bounds.x;
			DisResizer._left.y=bounds.y;
			DisResizer._left.height=bounds.height;
			DisResizer._right.x=bounds.x+bounds.width-2;
			DisResizer._right.y=bounds.y;
			DisResizer._right.height=bounds.height;
		}

		DisResizer.Side=2;
		DisResizer.Vertical=1;
		DisResizer.Horizon=0;
		DisResizer._up=null
		DisResizer._down=null
		DisResizer._left=null
		DisResizer._right=null
		DisResizer._barList=null
		DisResizer._tar=null
		DisResizer.barWidth=2;
		DisResizer.useGetBounds=false;
		DisResizer.tBar=null
		return DisResizer;
	})()


	//class laya.debug.tools.resizer.SimpleResizer
	var SimpleResizer=(function(){
		function SimpleResizer(){}
		__class(SimpleResizer,'laya.debug.tools.resizer.SimpleResizer');
		SimpleResizer.setResizeAble=function(clickItem,tar,minWidth,minHeight){
			(minWidth===void 0)&& (minWidth=150);
			(minHeight===void 0)&& (minHeight=150);
			clickItem.on("mousedown",null,SimpleResizer.onMouseDown,[tar,minWidth,minHeight]);
		}

		SimpleResizer.onMouseDown=function(tar,minWidth,minHeight,e){
			SimpleResizer.clearEvents();
			if (!tar)return;
			SimpleResizer.preMousePoint.setTo(Laya.stage.mouseX,Laya.stage.mouseY);
			SimpleResizer.preTarSize.setTo(tar.width,tar.height);
			SimpleResizer.preScale.setTo(1,1);
			var rTar;
			rTar=tar;
			while (rTar&&rTar!=Laya.stage){
				SimpleResizer.preScale.x *=rTar.scaleX;
				SimpleResizer.preScale.y *=rTar.scaleY;
				rTar=rTar.parent;
			}
			Laya.stage.on("mouseup",null,SimpleResizer.onMouseMoveEnd);
			Laya.timer.loop(100,null,SimpleResizer.onMouseMoving,[tar,minWidth,minHeight]);
		}

		SimpleResizer.onMouseMoving=function(tar,minWidth,minHeight,e){
			var tWidth=(Laya.stage.mouseX-SimpleResizer.preMousePoint.x)/ SimpleResizer.preScale.x+SimpleResizer.preTarSize.x;
			var tHeight=(Laya.stage.mouseY-SimpleResizer.preMousePoint.y)/SimpleResizer.preScale.y+SimpleResizer.preTarSize.y;
			tar.width=tWidth > minWidth?tWidth:minWidth;
			tar.height=tHeight>minHeight?tHeight:minHeight;
		}

		SimpleResizer.onMouseMoveEnd=function(e){
			SimpleResizer.clearEvents();
		}

		SimpleResizer.clearEvents=function(){
			Laya.timer.clear(null,SimpleResizer.onMouseMoving);
			Laya.stage.off("mouseup",null,SimpleResizer.onMouseMoveEnd);
		}

		__static(SimpleResizer,
		['preMousePoint',function(){return this.preMousePoint=new Point();},'preTarSize',function(){return this.preTarSize=new Point();},'preScale',function(){return this.preScale=new Point();}
		]);
		return SimpleResizer;
	})()


	//class laya.debug.tools.ResTools
	var ResTools=(function(){
		function ResTools(){}
		__class(ResTools,'laya.debug.tools.ResTools');
		ResTools.getCachedResList=function(){
			if (Render.isWebGL){
				return ResTools.getWebGlResList();
				}else{
				return ResTools.getCanvasResList();
			}
		}

		ResTools.getWebGlResList=function(){
			var rst;
			rst=[];
			var tResource;
			var _resources;
			_resources=ResourceManager.currentResourceManager["_resources"];
			for(var i=0;i <_resources.length;i++){
				tResource=_resources[i];
				if(ClassTool.getClassName(tResource)=="WebGLImage"){
					var url=tResource["src"];
					if(url&&url.indexOf("data:image/png;base64")<0)
						rst.push(url);
				}
			}
			return rst;
		}

		ResTools.getCanvasResList=function(){
			var picDic;
			picDic={};
			var dataO;
			dataO=Loader.loadedMap;
			ResTools.collectPics(dataO,picDic);
			return ResTools.getArrFromDic(picDic);
		}

		ResTools.getArrFromDic=function(dic){
			var key;
			var rst;
			rst=[];
			for (key in dic){
				rst.push(key);
			}
			return rst;
		}

		ResTools.collectPics=function(dataO,picDic){
			if (!dataO)return;
			var key;
			var tTexture;
			for (key in dataO){
				tTexture=dataO[key];
				if (tTexture){
					if (tTexture.bitmap&&tTexture.bitmap.src){
						var url=tTexture.bitmap.src;
						if(url.indexOf("data:image/png;base64")<0)
							picDic[tTexture.bitmap.src]=true;
					}
				}
			}
		}

		return ResTools;
	})()


	//class laya.debug.tools.RunProfile
	var RunProfile=(function(){
		function RunProfile(){}
		__class(RunProfile,'laya.debug.tools.RunProfile');
		RunProfile.run=function(funName,callLen){
			(callLen===void 0)&& (callLen=3);
			var tCount;
			if(!RunProfile.infoDic.hasOwnProperty(funName)){
				RunProfile.infoDic[funName]=new CountTool();
			}
			tCount=RunProfile.infoDic[funName];
			var msg;
			msg=TraceTool.getCallLoc(callLen)+"\n"+TraceTool.getCallStack(1,callLen-3);
			tCount.add(msg);
			if(RunProfile._runShowDic[funName]){
				console.log("Create:"+funName);
				console.log(msg);
			}
		}

		RunProfile.showClassCreate=function(funName){
			RunProfile._runShowDic[funName]=true;
		}

		RunProfile.hideClassCreate=function(funName){
			RunProfile._runShowDic[funName]=false;
		}

		RunProfile.getRunInfo=function(funName){
			var rst;
			rst=RunProfile.infoDic[funName];
			if(rst){
			}
			return RunProfile.infoDic[funName];
		}

		RunProfile.runTest=function(fun,count,sign){
			(sign===void 0)&& (sign="runTest");
			DTrace.timeStart(sign);
			var i=0;
			for(i=0;i<count;i++){
				fun();
			}
			DTrace.timeEnd(sign);
		}

		RunProfile.infoDic={};
		RunProfile._runShowDic={};
		return RunProfile;
	})()


	//class laya.debug.tools.StringTool
	var StringTool=(function(){
		function StringTool(){}
		__class(StringTool,'laya.debug.tools.StringTool');
		StringTool.toUpCase=function(str){
			return str.toUpperCase();
		}

		StringTool.toLowCase=function(str){
			return str.toLowerCase();
		}

		StringTool.toUpHead=function(str){
			var rst;
			if(str.length<=1)return str.toUpperCase();
			rst=str.charAt(0).toUpperCase()+str.substr(1);
			return rst;
		}

		StringTool.toLowHead=function(str){
			var rst;
			if(str.length<=1)return str.toLowerCase();
			rst=str.charAt(0).toLowerCase()+str.substr(1);
			return rst;
		}

		StringTool.packageToFolderPath=function(packageName){
			var rst;
			rst=packageName.replace(".","/");
			return rst;
		}

		StringTool.insert=function(str,iStr,index){
			return str.substring(0,index)+iStr+str.substr(index);
		}

		StringTool.insertAfter=function(str,iStr,tarStr,isLast){
			(isLast===void 0)&& (isLast=false);
			var i=0;
			if(isLast){
				i=str.lastIndexOf(tarStr);
				}else{
				i=str.indexOf(tarStr);
			}
			if(i>=0){
				return StringTool.insert(str,iStr,i+tarStr.length);
			}
			return str;
		}

		StringTool.insertBefore=function(str,iStr,tarStr,isLast){
			(isLast===void 0)&& (isLast=false);
			var i=0;
			if(isLast){
				i=str.lastIndexOf(tarStr);
				}else{
				i=str.indexOf(tarStr);
			}
			if(i>=0){
				return StringTool.insert(str,iStr,i);
			}
			return str;
		}

		StringTool.insertParamToFun=function(funStr,params){
			var oldParam;
			oldParam=StringTool.getParamArr(funStr);
			var inserStr;
			inserStr=params.join(",");
			if(oldParam.length>0){
				inserStr=","+inserStr;
			}
			return StringTool.insertBefore(funStr,inserStr,")",true);
		}

		StringTool.trim=function(str,vList){
			if(!vList){
				vList=[" ","\r","\n","\t",String.fromCharCode(65279)];
			};
			var rst;
			var i=0;
			var len=0;
			rst=str;
			len=vList.length;
			for(i=0;i<len;i++){
				rst=StringTool.getReplace(rst,vList[i],"");
			}
			return rst;
		}

		StringTool.isEmpty=function(str){
			if(str.length<1)return true;
			return StringTool.emptyStrDic.hasOwnProperty(str);
		}

		StringTool.trimLeft=function(str){
			var i=0;
			i=0;
			var len=0;
			len=str.length;
			while(StringTool.isEmpty(str.charAt(i))&&i<len){
				i++;
			}
			if(i<len){
				return str.substr(i);
			}
			return "";
		}

		StringTool.trimRight=function(str){
			var i=0;
			i=str.length-1;
			while(StringTool.isEmpty(str.charAt(i))&&i>=0){
				i--;
			};
			var rst;
			rst=str.substring(0,i)
			if(i>=0){
				return str.substring(0,i+1);
			}
			return "";
		}

		StringTool.trimSide=function(str){
			var rst;
			rst=StringTool.trimLeft(str);
			rst=StringTool.trimRight(rst);
			return rst;
		}

		StringTool.isOkFileName=function(fileName){
			if(laya.debug.tools.StringTool.trimSide(fileName)=="")return false;
			var i=0,len=0;
			len=fileName.length;
			for(i=0;i<len;i++){
				if(StringTool.specialChars[fileName.charAt(i)])return false;
			}
			return true;
		}

		StringTool.trimButEmpty=function(str){
			return StringTool.trim(str,["\r","\n","\t"]);
		}

		StringTool.removeEmptyStr=function(strArr){
			var i=0;
			i=strArr.length-1;
			var str;
			for(i=i;i>=0;i--){
				str=strArr[i];
				str=laya.debug.tools.StringTool.trimSide(str);
				if(StringTool.isEmpty(str)){
					strArr.splice(i,1);
					}else{
					strArr[i]=str;
				}
			}
			return strArr;
		}

		StringTool.ifNoAddToTail=function(str,sign){
			if(str.indexOf(sign)>=0){
				return str;
			}
			return str+sign;
		}

		StringTool.trimEmptyLine=function(str){
			var i=0;
			var len=0;
			var tLines;
			var tLine;
			tLines=str.split("\n");
			for(i=tLines.length-1;i>=0;i--){
				tLine=tLines[i];
				if(StringTool.isEmptyLine(tLine)){
					tLines.splice(i,1);
				}
			}
			return tLines.join("\n");
		}

		StringTool.isEmptyLine=function(str){
			str=laya.debug.tools.StringTool.trim(str);
			if(str=="")return true;
			return false;
		}

		StringTool.removeCommentLine=function(lines){
			var rst;
			rst=[];
			var i=0;
			var tLine;
			var adptLine;
			i=0;
			var len=0;
			var index=0;
			len=lines.length;
			while(i<len){
				adptLine=tLine=lines[i];
				index=tLine.indexOf("/**");
				if(index>=0){
					adptLine=tLine.substring(0,index-1);
					StringTool.addIfNotEmpty(rst,adptLine);
					while(i<len){
						tLine=lines[i];
						index=tLine.indexOf("*/");
						if(index>=0){
							adptLine=tLine.substring(index+2);
							StringTool.addIfNotEmpty(rst,adptLine);
							break ;
						}
						i++;
					}
					}else if(tLine.indexOf("//")>=0){
					if(laya.debug.tools.StringTool.trim(tLine).indexOf("//")==0){
						}else{
						StringTool.addIfNotEmpty(rst,adptLine);
					}
					}else{
					StringTool.addIfNotEmpty(rst,adptLine);
				}
				i++;
			}
			return rst;
		}

		StringTool.addIfNotEmpty=function(arr,str){
			if(!str)return;
			var tStr;
			tStr=StringTool.trim(str);
			if(tStr!=""){
				arr.push(str);
			}
		}

		StringTool.trimExt=function(str,vars){
			var rst;
			rst=StringTool.trim(str);
			var i=0;
			var len=0;
			len=vars.length;
			for(i=0;i<len;i++){
				rst=StringTool.getReplace(rst,vars[i],"");
			}
			return rst;
		}

		StringTool.getBetween=function(str,left,right,ifMax){
			(ifMax===void 0)&& (ifMax=false);
			if(!str)return "";
			if(!left)return "";
			if(!right)return "";
			var lId=0;
			var rId=0;
			lId=str.indexOf(left);
			if(lId<0)return"";
			if(ifMax){
				rId=str.lastIndexOf(right);
				if(rId<lId)return "";
				}else{
				rId=str.indexOf(right,lId+1);
			}
			if(rId<0)return "";
			return str.substring(lId+left.length,rId);
		}

		StringTool.getSplitLine=function(line,split){
			(split===void 0)&& (split=" ");
			return line.split(split);
		}

		StringTool.getLeft=function(str,sign){
			var i=0;
			i=str.indexOf(sign);
			return str.substr(0,i);
		}

		StringTool.getRight=function(str,sign){
			var i=0;
			i=str.indexOf(sign);
			return str.substr(i+1);
		}

		StringTool.delelteItem=function(arr){
			while (arr.length>0){
				if(arr[0]==""){
					arr.shift();
					}else{
					break ;
				}
			}
		}

		StringTool.getWords=function(line){
			var rst=StringTool.getSplitLine(line);
			StringTool.delelteItem(rst);
			return rst;
		}

		StringTool.getLinesI=function(startLine,endLine,lines){
			var i=0;
			var rst=[];
			for(i=startLine;i<=endLine;i++){
				rst.push(lines[i]);
			}
			return rst;
		}

		StringTool.structfy=function(str,inWidth,removeEmpty){
			(inWidth===void 0)&& (inWidth=4);
			(removeEmpty===void 0)&& (removeEmpty=true);
			if(removeEmpty){
				str=laya.debug.tools.StringTool.trimEmptyLine(str);
			};
			var lines;
			var tIn=0;
			tIn=0;
			var tInStr;
			tInStr=StringTool.getEmptyStr(0);
			lines=str.split("\n");
			var i=0;
			var len=0;
			var tLineStr;
			len=lines.length;
			for(i=0;i<len;i++){
				tLineStr=lines[i];
				tLineStr=laya.debug.tools.StringTool.trimLeft(tLineStr);
				tLineStr=laya.debug.tools.StringTool.trimRight(tLineStr);
				tIn+=StringTool.getPariCount(tLineStr);
				if(tLineStr.indexOf("}")>=0){
					tInStr=StringTool.getEmptyStr(tIn*inWidth);
				}
				tLineStr=tInStr+tLineStr;
				lines[i]=tLineStr;
				tInStr=StringTool.getEmptyStr(tIn*inWidth);
			}
			return lines.join("\n");
		}

		StringTool.getEmptyStr=function(width){
			if(!StringTool.emptyDic.hasOwnProperty(width)){
				var i=0;
				var len=0;
				len=width;
				var rst;
				rst="";
				for(i=0;i<len;i++){
					rst+=" ";
				}
				StringTool.emptyDic[width]=rst;
			}
			return StringTool.emptyDic[width];
		}

		StringTool.getPariCount=function(str,inChar,outChar){
			(inChar===void 0)&& (inChar="{");
			(outChar===void 0)&& (outChar="}");
			var varDic;
			varDic={};
			varDic[inChar]=1;
			varDic[outChar]=-1;
			var i=0;
			var len=0;
			var tChar;
			len=str.length;
			var rst=0;
			rst=0;
			for(i=0;i<len;i++){
				tChar=str.charAt(i);
				if(varDic.hasOwnProperty(tChar)){
					rst+=varDic[tChar];
				}
			}
			return rst;
		}

		StringTool.readInt=function(str,startI){
			(startI===void 0)&& (startI=0);
			var rst=NaN;
			rst=0;
			var tNum=0;
			var tC;
			var i=0;
			var isBegin=false;
			isBegin=false;
			var len=0;
			len=str.length;
			for(i=startI;i<len;i++){
				tC=str.charAt(i);
				if(Number(tC)>0||tC=="0"){
					rst=10*rst+Number(tC);
					if(rst>0)isBegin=true;
					}else{
					if(isBegin)return rst;
				}
			}
			return rst;
		}

		StringTool.getReplace=function(str,oStr,nStr){
			if(!str)return "";
			var rst;
			rst=str.replace(new RegExp(oStr,"g"),nStr);
			return rst;
		}

		StringTool.getWordCount=function(str,findWord){
			var rg=new RegExp(findWord,"g")
			return str.match(rg).length;
		}

		StringTool.getResolvePath=function(path,basePath){
			if(StringTool.isAbsPath(path)){
				return path;
			};
			var tSign;
			tSign="\\";
			if(basePath.indexOf("/")>=0){
				tSign="/";
			}
			if(basePath.charAt(basePath.length-1)==tSign){
				basePath=basePath.substr(0,basePath.length-1);
			};
			var parentSign;
			parentSign=".."+tSign;
			var tISign;
			tISign="."+tSign;
			var pCount=0;
			pCount=StringTool.getWordCount(path,parentSign);
			path=laya.debug.tools.StringTool.getReplace(path,parentSign,"");
			path=laya.debug.tools.StringTool.getReplace(path,tISign,"");
			var i=0;
			var len=0;
			len=pCount;
			var iPos=0;
			for(i=0;i<len;i++){
				basePath=StringTool.removeLastSign(path,tSign);
			}
			return basePath+tSign+path;
		}

		StringTool.isAbsPath=function(path){
			if(path.indexOf(":")>=0)return true;
			return false;
		}

		StringTool.removeLastSign=function(str,sign){
			var iPos=0;
			iPos=str.lastIndexOf(sign);
			str=str.substring(0,iPos);
			return str;
		}

		StringTool.getParamArr=function(str){
			var paramStr;
			paramStr=laya.debug.tools.StringTool.getBetween(str,"(",")",true);
			if(StringTool.trim(paramStr).length<1)return [];
			return paramStr.split(",");
		}

		StringTool.copyStr=function(str){
			return str.substring();
		}

		StringTool.ArrayToString=function(arr){
			var rst;
			rst="[{items}]".replace(new RegExp("\\{items\\}","g"),StringTool.getArrayItems(arr));
			return rst;
		}

		StringTool.getArrayItems=function(arr){
			var rst;
			if(arr.length<1)return "";
			rst=StringTool.parseItem(arr[0]);
			var i=0;
			var len=0;
			len=arr.length;
			for(i=1;i<len;i++){
				rst+=","+StringTool.parseItem(arr[i]);
			}
			return rst;
		}

		StringTool.parseItem=function(item){
			var rst;
			rst="\""+item+"\"";
			return "";
		}

		StringTool.initAlphaSign=function(){
			if (StringTool.alphaSigns)return;
			StringTool.alphaSigns={};
			StringTool.addSign("a","z",StringTool.alphaSigns);
			StringTool.addSign("A","Z",StringTool.alphaSigns);
			StringTool.addSign("0","9",StringTool.alphaSigns);
		}

		StringTool.addSign=function(ss,e,tar){
			var i=0;
			var len=0;
			var s=0;
			s=ss.charCodeAt(0);
			len=e.charCodeAt(0);
			for(i=s;i<=len;i++){
				tar[String.fromCharCode(i)]=true;
				console.log("add :"+String.fromCharCode(i));
			}
		}

		StringTool.isPureAlphaNum=function(str){
			StringTool.initAlphaSign();
			if (!str)return true;
			var i=0,len=0;
			len=str.length;
			for (i=0;i < len;i++){
				if (!StringTool.alphaSigns[str.charAt(i)])return false;
			}
			return true;
		}

		StringTool.emptyDic={};
		StringTool.alphaSigns=null;
		__static(StringTool,
		['emptyStrDic',function(){return this.emptyStrDic={
				" ":true,
				"\r":true,
				"\n":true,
				"\t":true
		};},'specialChars',function(){return this.specialChars={"*":true,"&":true,"%":true,"#":true,"?":true};}

		]);
		return StringTool;
	})()


	//class laya.debug.tools.TraceTool
	var TraceTool=(function(){
		function TraceTool(){}
		__class(TraceTool,'laya.debug.tools.TraceTool');
		TraceTool.closeAllLog=function(){
			var logFun;
			logFun=TraceTool.emptyLog;
			Browser.window.console.log=logFun;
		}

		TraceTool.emptyLog=function(){}
		TraceTool.traceObj=function(obj){
			TraceTool.tempArr.length=0;
			var key;
			for(key in obj){
				TraceTool.tempArr.push(key+":"+obj[key]);
			};
			var rst;
			rst=TraceTool.tempArr.join("\n");
			console.log(rst);
			return rst;
		}

		TraceTool.traceObjR=function(obj){
			TraceTool.tempArr.length=0;
			var key;
			for(key in obj){
				TraceTool.tempArr.push(obj[key]+":"+key);
			};
			var rst;
			rst=TraceTool.tempArr.join("\n");
			console.log(rst);
			return rst;
		}

		TraceTool.traceSize=function(tar){
			DebugTool.dTrace("Size: x:"+tar.x+" y:"+tar.y+" w:"+tar.width+" h:"+tar.height+" scaleX:"+tar.scaleX+" scaleY:"+tar.scaleY);
		}

		TraceTool.traceSplit=function(msg){
			console.log("---------------------"+msg+"---------------------------");
		}

		TraceTool.group=function(gName){
			console.group(gName);;
		}

		TraceTool.groupEnd=function(){
			console.groupEnd();;
		}

		TraceTool.getCallStack=function(life,s){
			(life===void 0)&& (life=1);
			(s===void 0)&& (s=1);
			var caller;
			caller=TraceTool.getCallStack;
			caller=caller.caller.caller;
			var msg;
			msg="";
			while(caller&&life>0){
				if(s<=0){
					msg+=caller+"<-";
					life--;
					}else{
				}
				caller=caller.caller;
				s--;
			}
			return msg;
		}

		TraceTool.getCallLoc=function(index){
			(index===void 0)&& (index=2);
			var loc;
			try {
				TraceTool.Erroer.i++;
				}catch (e){
				var arr;
				arr=e.stack.replace(/Error\n/).split(/\n/);
				if (arr[index]){
					loc=arr[index].replace(/^\s+|\s+$/,"");
					}else{
					loc="unknow";
				}
			}
			return loc;
		}

		TraceTool.traceCallStack=function(){
			var loc;
			try {
				TraceTool.Erroer.i++;
				}catch (e){
				loc=e.stack;
			}
			console.log(loc);
			return loc;
		}

		TraceTool.getPlaceHolder=function(len){
			if(!TraceTool.holderDic.hasOwnProperty(len)){
				var rst;
				rst="";
				var i=0;
				for(i=0;i<len;i++){
					rst+="-";
				}
				TraceTool.holderDic[len]=rst;
			}
			return TraceTool.holderDic[len];
		}

		TraceTool.traceTree=function(tar,depth,isFirst){
			(depth===void 0)&& (depth=0);
			(isFirst===void 0)&& (isFirst=true);
			if(isFirst){
				console.log("traceTree");
			}
			if(!tar)return;
			var i=0;
			var len=0;
			if(tar.numChildren<1){
				console.log(tar);
				return;
			}
			TraceTool.group(tar);
			len=tar.numChildren;
			depth++;
			for(i=0;i<len;i++){
				TraceTool.traceTree(tar.getChildAt(i),depth,false);
			}
			TraceTool.groupEnd();
		}

		TraceTool.getClassName=function(tar){
			return tar["constructor"].name;
		}

		TraceTool.traceSpriteInfo=function(tar,showBounds,showSize,showTree){
			(showBounds===void 0)&& (showBounds=true);
			(showSize===void 0)&& (showSize=true);
			(showTree===void 0)&& (showTree=true);
			if(!((tar instanceof laya.display.Sprite ))){
				console.log("not Sprite");
				return;
			}
			if(!tar){
				console.log("null Sprite");
				return;
			}
			TraceTool.traceSplit("traceSpriteInfo");
			DebugTool.dTrace(laya.debug.tools.TraceTool.getClassName(tar)+":"+tar.name);
			if(showTree){
				TraceTool.traceTree(tar);
				}else{
				console.log(tar);
			}
			if(showSize){
				TraceTool.traceSize(tar);
			}
			if(showBounds){
				console.log("bounds:"+tar.getBounds());
			}
		}

		TraceTool.tempArr=[];
		TraceTool.Erroer=null;
		TraceTool.holderDic={};
		return TraceTool;
	})()


	//class laya.debug.tools.ValueChanger
	var ValueChanger=(function(){
		function ValueChanger(){
			this.target=null;
			this.key=null;
			this._tValue=NaN;
			this.preValue=0;
		}

		__class(ValueChanger,'laya.debug.tools.ValueChanger');
		var __proto=ValueChanger.prototype;
		__proto.record=function(){
			this.preValue=this.value;
		}

		__proto.showValueByAdd=function(addValue){
			this.value=this.preValue+addValue;
		}

		__proto.showValueByScale=function(scale){
			this.value=this.preValue *scale;
		}

		__proto.recover=function(){
			this.value=this.preValue;
		}

		__proto.dispose=function(){
			this.target=null;
		}

		__getset(0,__proto,'value',function(){
			if(this.target){
				this._tValue=this.target[this.key];
			}
			return this._tValue;
			},function(nValue){
			this._tValue=nValue;
			if(this.target){
				this.target[this.key]=nValue;
			}
		});

		__getset(0,__proto,'dValue',function(){
			return this.value-this.preValue;
		});

		__getset(0,__proto,'scaleValue',function(){
			return this.value/this.preValue;
		});

		ValueChanger.create=function(target,key){
			var rst;
			rst=new ValueChanger();
			rst.target=target;
			rst.key=key;
			return rst;
		}

		return ValueChanger;
	})()


	//class laya.debug.tools.VisibleAnalyser
	var VisibleAnalyser=(function(){
		function VisibleAnalyser(){}
		__class(VisibleAnalyser,'laya.debug.tools.VisibleAnalyser');
		VisibleAnalyser.analyseTarget=function(node){
			var isInstage=false;
			isInstage=node.displayedInStage;
			var gRec;
			gRec=NodeUtils.getGRec(node);
			var stageRec=new Rectangle();
			stageRec.setTo(0,0,Laya.stage.width,Laya.stage.height);
			var isInVisibleRec=false;
			var visibleRec;
			visibleRec=stageRec.intersection(gRec);
			if (visibleRec.width > 0 && visibleRec.height > 0){
				isInVisibleRec=true;
			}
			else{
				isInVisibleRec=false;
			};
			var gAlpha=NaN;
			gAlpha=NodeUtils.getGAlpha(node);
			var gVisible=false;
			gVisible=NodeUtils.getGVisible(node);
			var msg;
			msg="";
			msg+="isInstage:"+isInstage+"\n";
			msg+="isInVisibleRec:"+isInVisibleRec+"\n";
			msg+="gVisible:"+gVisible+"\n";
			msg+="gAlpha:"+gAlpha+"\n";
			if (isInstage && isInVisibleRec && gVisible && gAlpha > 0){
				if (Render.isWebGL){
					VisibleAnalyser.anlyseRecVisible(node);
					}else{
					SpriteRenderForVisibleAnalyse.I.analyseNode(node);
				}
				msg+="coverRate:"+VisibleAnalyser.coverRate+"\n";
				if (VisibleAnalyser._coverList.length > 0){
					Laya.timer.once(1000,null,VisibleAnalyser.showListLater);
				}
			}
			console.log(msg);
			OutPutView.I.showTxt(msg);
		}

		VisibleAnalyser.showListLater=function(){
			NodeListPanelView.I.showList(VisibleAnalyser._coverList);
		}

		VisibleAnalyser.isCoverByBrother=function(node){
			var parent=node.parent;
			if (!parent)
				return;
			var _childs;
			_childs=parent._childs;
			var index=0;
			index=_childs.indexOf(node);
			if (index < 0)
				return;
			var i=0,len=0;
			var canvas;
			var rec;
			rec=parent.getSelfBounds();
			if (rec.width <=0 || rec.height <=0)
				return;
		}

		VisibleAnalyser.anlyseRecVisible=function(node){
			VisibleAnalyser.isNodeWalked=false;
			VisibleAnalyser._analyseTarget=node;
			if (!VisibleAnalyser.mainCanvas)
				VisibleAnalyser.mainCanvas=CanvasTools.createCanvas(Laya.stage.width,Laya.stage.height);
			CanvasTools.clearCanvas(VisibleAnalyser.mainCanvas);
			VisibleAnalyser.tColor=1;
			VisibleAnalyser.resetCoverList();
			WalkTools.walkTargetEX(Laya.stage,VisibleAnalyser.recVisibleWalker,null,VisibleAnalyser.filterFun);
			if (!VisibleAnalyser.isTarRecOK){
				VisibleAnalyser.coverRate=0;
			}
			else{
				VisibleAnalyser.coverRate=CanvasTools.getDifferRate(VisibleAnalyser.preImageData,VisibleAnalyser.tarImageData);
			}
			console.log("coverRate:",VisibleAnalyser.coverRate);
		}

		VisibleAnalyser.getRecArea=function(rec){
			return rec.width *rec.height;
		}

		VisibleAnalyser.addCoverNode=function(node,coverRate){
			var data;
			data={};
			data.path=node;
			data.label=ClassTool.getNodeClassAndName(node)+":"+coverRate;
			data.coverRate=coverRate;
			VisibleAnalyser._coverList.push(data);
			console.log("coverByNode:",node,coverRate);
		}

		VisibleAnalyser.resetCoverList=function(){
			VisibleAnalyser._coverList.length=0;
		}

		VisibleAnalyser.recVisibleWalker=function(node){
			if (node==VisibleAnalyser._analyseTarget){
				VisibleAnalyser.isNodeWalked=true;
				VisibleAnalyser.tarRec.copyFrom(NodeUtils.getGRec(node));
				console.log("tarRec:",VisibleAnalyser.tarRec.toString());
				if (VisibleAnalyser.tarRec.width > 0 && VisibleAnalyser.tarRec.height > 0){
					VisibleAnalyser.isTarRecOK=true;
					VisibleAnalyser.tColor++;
					CanvasTools.fillCanvasRec(VisibleAnalyser.mainCanvas,VisibleAnalyser.tarRec,ColorTool.toHexColor(VisibleAnalyser.tColor));
					VisibleAnalyser.preImageData=CanvasTools.getImageDataFromCanvasByRec(VisibleAnalyser.mainCanvas,VisibleAnalyser.tarRec);
					VisibleAnalyser.tarImageData=CanvasTools.getImageDataFromCanvasByRec(VisibleAnalyser.mainCanvas,VisibleAnalyser.tarRec);
				}
				else{
					console.log("tarRec Not OK:",VisibleAnalyser.tarRec);
				}
			}
			else{
				if (VisibleAnalyser.isTarRecOK){
					var tRec;
					tRec=NodeUtils.getGRec(node);
					VisibleAnalyser.interRec=VisibleAnalyser.tarRec.intersection(tRec,VisibleAnalyser.interRec);
					if (VisibleAnalyser.interRec && VisibleAnalyser.interRec.width > 0 && VisibleAnalyser.interRec.height > 0){
						VisibleAnalyser.tColor++;
						CanvasTools.fillCanvasRec(VisibleAnalyser.mainCanvas,tRec,ColorTool.toHexColor(VisibleAnalyser.tColor));
						VisibleAnalyser.tImageData=CanvasTools.getImageDataFromCanvasByRec(VisibleAnalyser.mainCanvas,VisibleAnalyser.tarRec);
						var dRate=NaN;
						dRate=CanvasTools.getDifferRate(VisibleAnalyser.preImageData,VisibleAnalyser.tImageData);
						VisibleAnalyser.preImageData=VisibleAnalyser.tImageData;
						VisibleAnalyser.addCoverNode(node,dRate);
					}
				}
			}
		}

		VisibleAnalyser.filterFun=function(node){
			if (node.visible==false)
				return false;
			if (node.alpha < 0)
				return false;
			if (DebugInfoLayer.I.isDebugItem(node))return false;
			return true;
		}

		VisibleAnalyser.isNodeWalked=false;
		VisibleAnalyser._analyseTarget=null
		VisibleAnalyser.isTarRecOK=false;
		VisibleAnalyser.mainCanvas=null
		VisibleAnalyser.preImageData=null
		VisibleAnalyser.tImageData=null
		VisibleAnalyser.tarImageData=null
		VisibleAnalyser.coverRate=NaN
		VisibleAnalyser.tColor=0;
		VisibleAnalyser._coverList=[];
		__static(VisibleAnalyser,
		['tarRec',function(){return this.tarRec=new Rectangle();},'interRec',function(){return this.interRec=new Rectangle();}
		]);
		return VisibleAnalyser;
	})()


	//class laya.debug.tools.WalkTools
	var WalkTools=(function(){
		function WalkTools(){}
		__class(WalkTools,'laya.debug.tools.WalkTools');
		WalkTools.walkTarget=function(target,fun,_this){
			fun.apply(_this,[target]);
			var i=0;
			var len=0;
			var tChild;
			len=target.numChildren;
			for(i=0;i<len;i++){
				tChild=target.getChildAt(i);
				WalkTools.walkTarget(tChild,fun,tChild);
			}
		}

		WalkTools.walkTargetEX=function(target,fun,_this,filterFun){
			if (filterFun !=null && !filterFun(target))return;
			fun.apply(_this,[target]);
			var i=0;
			var len=0;
			var tChild;
			var childs;
			childs=target._childs;
			len=childs.length;
			for(i=0;i<len;i++){
				tChild=childs[i];
				WalkTools.walkTarget(tChild,fun,tChild);
			}
		}

		WalkTools.walkChildren=function(target,fun,_this){
			if(!target||target.numChildren<1)return;
			WalkTools.walkArr(DisControlTool.getAllChild(target),fun,_this);
		}

		WalkTools.walkArr=function(arr,fun,_this){
			if(!arr)return;
			var i=0;
			var len=0;
			len=arr.length;
			for(i=0;i<len;i++){
				fun.apply(_this,[arr[i],i]);
			}
		}

		return WalkTools;
	})()


	//class laya.debug.tools.Watcher
	var Watcher=(function(){
		function Watcher(){}
		__class(Watcher,'laya.debug.tools.Watcher');
		Watcher.watch=function(obj,name,funs){
			VarHook.hookVar(obj,name,funs);
		}

		Watcher.traceChange=function(obj,name,sign){
			(sign===void 0)&& (sign="var changed:");
			VarHook.hookVar(obj,name,[Watcher.getTraceValueFun(name),VarHook.getLocFun(sign)]);
		}

		Watcher.debugChange=function(obj,name){
			VarHook.hookVar(obj,name,[VarHook.getLocFun("debug loc"),FunHook.debugHere]);
		}

		Watcher.differChange=function(obj,name,sign,msg){
			(msg===void 0)&& (msg="");
			VarHook.hookVar(obj,name,[Watcher.getDifferFun(obj,name,sign,msg)]);
		}

		Watcher.getDifferFun=function(obj,name,sign,msg){
			(msg===void 0)&& (msg="");
			var rst;
			rst=function (){
				DifferTool.differ(sign,obj[name],msg);
			}
			return rst;
		}

		Watcher.traceValue=function(value){
			console.log("value:",value);
		}

		Watcher.getTraceValueFun=function(name){
			var rst;
			rst=function (value){
				console.log("set "+name+" :",value);
			}
			return rst;
		}

		return Watcher;
	})()


	//class laya.debug.view.nodeInfo.menus.NodeMenu
	var NodeMenu=(function(){
		function NodeMenu(){
			this._tar=null;
			this._menu=null;
			this._shareBtns=[
			"信息面板",
			"边框",
			"进入节点",
			"树定位",
			"Enable链",
			"Size链",
			"节点工具",
			"可见分析",
			"输出到控制台"];
			this._menuItems=["隐藏节点"];
			this._menuHide=null;
			this._menuItemsHide=["显示节点"];
			this._menu1=null;
			this._menuItems1=["输出到控制台"];
		}

		__class(NodeMenu,'laya.debug.view.nodeInfo.menus.NodeMenu');
		var __proto=NodeMenu.prototype;
		__proto.showNodeMenu=function(node){
			if (!node._style){
				DebugTool.log("该节点已不存在，请刷新列表");
				return;
			}
			this._tar=node;
			if (!this._menu){
				this._menuItems=this._menuItems.concat(this._shareBtns);
				this._menu=ContextMenu.createMenuByArray(this._menuItems);
				this._menu.on("select",this,this.onEmunSelect);
				this._menuItemsHide=this._menuItemsHide.concat(this._shareBtns);
				this._menuHide=ContextMenu.createMenuByArray(this._menuItemsHide);
				this._menuHide.on("select",this,this.onEmunSelect);
			}
			if (node.visible){
				this._menu.show();
			}
			else{
				this._menuHide.show();
			}
		}

		__proto.nodeDoubleClick=function(node){
			NodeToolView.I.showByNode(node);
		}

		__proto.setNodeListDoubleClickAction=function(list){
			if (Browser.onMobile)return;
			list.on("doubleclick",this,this.onListDoubleClick,[list]);
		}

		__proto.onListDoubleClick=function(list){
			if (list.selectedItem){
				var tarNode;
				tarNode=list.selectedItem.path;
				laya.debug.view.nodeInfo.menus.NodeMenu.I.nodeDoubleClick(tarNode);
			}
		}

		__proto.setNodeListAction=function(list){
			list.on(DebugTool.getMenuShowEvent(),this,this.onListRightClick,[list]);
		}

		//setNodeListDoubleClickAction(list);
		__proto.onListRightClick=function(list){
			if (list.selectedItem){
				var tarNode;
				tarNode=list.selectedItem.path;
				laya.debug.view.nodeInfo.menus.NodeMenu.I.objRightClick(tarNode);
			}
		}

		__proto.objRightClick=function(obj){
			if ((obj instanceof laya.display.Sprite )){
				laya.debug.view.nodeInfo.menus.NodeMenu.I.showNodeMenu(obj);
			}
			else if ((typeof obj=='object')){
				laya.debug.view.nodeInfo.menus.NodeMenu.I.showObjectMenu(obj);
			}
		}

		__proto.showObjectMenu=function(obj){
			this._tar=obj;
			if (!this._menu1){
				this._menu1=ContextMenu.createMenuByArray(this._menuItems1);
				this._menu1.on("select",this,this.onEmunSelect);
			}
			this._menu1.show();
		}

		__proto.onEmunSelect=function(e){
			var data=(e.target).data;
			if ((typeof data=='string')){
				var key;
				key=data;
				switch (key){
					case "信息面板":
						ObjectInfoView.showObject(this._tar);
						break ;
					case "边框":
						DebugTool.showDisBound(this._tar);
						break ;
					case "输出到控制台":
						console.log(this._tar);
						break ;
					case "树节点":
						ToolPanel.I.showNodeTree(this._tar);
						break ;
					case "进入节点":
						ToolPanel.I.showNodeTree(this._tar);
						break ;
					case "树定位":
						ToolPanel.I.showSelectInStage(this._tar);
						break ;
					case "Enable链":
						OutPutView.I.dTrace(DebugTool.traceDisMouseEnable(this._tar));
						SelectInfosView.I.setSelectList(DebugTool.selectedNodes);
						break ;
					case "Size链":
						OutPutView.I.dTrace(DebugTool.traceDisSizeChain(this._tar));
						SelectInfosView.I.setSelectList(DebugTool.selectedNodes);
						break ;
					case "节点工具":
						NodeToolView.I.showByNode(this._tar);
						break ;
					case "显示节点":
						this._tar.visible=true;
						break ;
					case "隐藏节点":
						this._tar.visible=false;
						break ;
					case "可见分析":
						if (this._tar){
							VisibleAnalyser.analyseTarget(this._tar);
						}
						break ;
					}
			}
		}

		__getset(1,NodeMenu,'I',function(){
			if (!NodeMenu._I)
				NodeMenu._I=new NodeMenu();
			return NodeMenu._I;
		});

		NodeMenu._I=null
		return NodeMenu;
	})()


	//class laya.debug.view.nodeInfo.NodeConsts
	var NodeConsts=(function(){
		function NodeConsts(){}
		__class(NodeConsts,'laya.debug.view.nodeInfo.NodeConsts');
		NodeConsts.defaultFitlerStr="x,y,width,height,scaleX,scaleY,alpha,renderCost";
		NodeConsts.RenderCostMaxTime=3000;
		return NodeConsts;
	})()


	//class laya.debug.view.nodeInfo.NodeUtils
	var NodeUtils=(function(){
		function NodeUtils(){}
		__class(NodeUtils,'laya.debug.view.nodeInfo.NodeUtils');
		NodeUtils.getFilterdTree=function(sprite,keys){
			if (!keys)
				keys=NodeUtils.defaultKeys;
			var me;
			me={};
			var key;
			var i=0,len=0;
			len=keys.length;
			for (i=0;i < len;i++){
				key=keys[i];
				me[key]=sprite[key];
			};
			var cList;
			var tChild;
			cList=sprite._childs;
			len=cList.length;
			var mClist;
			mClist=[];
			for (i=0;i < len;i++){
				tChild=cList[i];
				mClist.push(NodeUtils.getFilterdTree(tChild,keys));
			}
			me.childs=mClist;
			return me;
		}

		NodeUtils.getPropertyDesO=function(tValue,keys){
			if (!keys)
				keys=NodeUtils.defaultKeys;
			var rst={};
			if ((typeof tValue=='object')){
				rst.label=""+ClassTool.getNodeClassAndName(tValue);
			}
			else{
				rst.label=""+tValue;
			}
			rst.type="";
			rst.path=tValue;
			rst.childs=[];
			rst.isDirectory=false;
			var key;
			var i=0,len=0;
			var tChild;
			if ((tValue instanceof laya.display.Node )){
				rst.des=ClassTool.getNodeClassAndName(tValue);
				rst.isDirectory=true;
				len=keys.length;
				for (i=0;i < len;i++){
					key=keys[i];
					tChild=NodeUtils.getPropertyDesO(tValue[key],keys);
					if (tValue.hasOwnProperty(key)){
						tChild.label=""+key+":"+tChild.des;
					}
					else{
						tChild.label=""+key+":"+ObjectInfoView.getNodeValue(tValue,key);
					}
					rst.childs.push(tChild);
				}
				key="_childs";
				tChild=NodeUtils.getPropertyDesO(tValue[key],keys);
				tChild.label=""+key+":"+tChild.des;
				tChild.isChilds=true;
				rst.childs.push(tChild);
			}
			else if ((tValue instanceof Array)){
				rst.des="Array["+(tValue).length+"]";
				rst.isDirectory=true;
				var tList;
				tList=tValue;
				len=tList.length;
				for (i=0;i < len;i++){
					tChild=NodeUtils.getPropertyDesO(tList[i],keys);
					tChild.label=""+i+":"+tChild.des;
					rst.childs.push(tChild);
				}
			}
			else if ((typeof tValue=='object')){
				rst.des=ClassTool.getNodeClassAndName(tValue);
				rst.isDirectory=true;
				for (key in tValue){
					tChild=NodeUtils.getPropertyDesO(tValue[key],keys);
					tChild.label=""+key+":"+tChild.des;
					rst.childs.push(tChild);
				}
			}
			else{
				rst.des=""+tValue;
			}
			rst.hasChild=rst.childs.length > 0;
			return rst;
		}

		NodeUtils.adptShowKeys=function(keys){
			var i=0,len=0;
			len=keys.length;
			for (i=len-1;i >=0;i--){
				keys[i]=StringTool.trimSide(keys[i]);
				if (keys[i].length < 1){
					keys.splice(i,1);
				}
			}
			return keys;
		}

		NodeUtils.getNodeTreeData=function(sprite,keys){
			NodeUtils.adptShowKeys(keys);
			var treeO;
			treeO=NodeUtils.getPropertyDesO(sprite,keys);
			var treeArr;
			treeArr=[];
			NodeUtils.getTreeArr(treeO,treeArr);
			return treeArr;
		}

		NodeUtils.getTreeArr=function(treeO,arr,add){
			(add===void 0)&& (add=true);
			if (add)
				arr.push(treeO);
			var tArr=treeO.childs;
			var i=0,len=tArr.length;
			for (i=0;i < len;i++){
				if (!add){
					tArr[i].nodeParent=null;
				}
				else{
					tArr[i].nodeParent=treeO;
				}
				if (tArr[i].isDirectory){
					NodeUtils.getTreeArr(tArr[i],arr);
				}
				else{
					arr.push(tArr[i]);
				}
			}
		}

		NodeUtils.traceStage=function(){
			console.log(NodeUtils.getFilterdTree(Laya.stage,null));
			console.log("treeArr:",NodeUtils.getNodeTreeData(Laya.stage,null));
		}

		NodeUtils.getNodeCount=function(node,visibleRequire){
			(visibleRequire===void 0)&& (visibleRequire=false);
			if (visibleRequire){
				if (!node.visible)return 0;
			};
			var rst=0;
			rst=1;
			var i=0,len=0;
			var cList;
			cList=node._childs;
			len=cList.length;
			for (i=0;i < len;i++){
				rst+=NodeUtils.getNodeCount(cList[i],visibleRequire);
			}
			return rst;
		}

		NodeUtils.getGVisible=function(node){
			while (node){
				if (!node.visible)return false;
				node=node.parent;
			}
			return true;
		}

		NodeUtils.getGAlpha=function(node){
			var rst=NaN;
			rst=1;
			while (node){
				rst *=node.alpha;
				node=node.parent;
			}
			return rst;
		}

		NodeUtils.getGPos=function(node){
			var point;
			point=new Point();
			node.localToGlobal(point);
			return point;
		}

		NodeUtils.getGRec=function(node){
			var pointList;
			pointList=node._getBoundPointsM(true);
			if (!pointList || pointList.length < 1)
				return Rectangle.TEMP.setTo(0,0,0,0);
			pointList=GrahamScan.pListToPointList(pointList,true);
			WalkTools.walkArr(pointList,node.localToGlobal,node);
			pointList=GrahamScan.pointListToPlist(pointList);
			var _disBoundRec;
			_disBoundRec=Rectangle._getWrapRec(pointList,_disBoundRec);
			return _disBoundRec;
		}

		NodeUtils.getGGraphicRec=function(node){
			var pointList;
			pointList=node.getGraphicBounds()._getBoundPoints();
			if (!pointList || pointList.length < 1)
				return Rectangle.TEMP.setTo(0,0,0,0);
			pointList=GrahamScan.pListToPointList(pointList,true);
			WalkTools.walkArr(pointList,node.localToGlobal,node);
			pointList=GrahamScan.pointListToPlist(pointList);
			var _disBoundRec;
			_disBoundRec=Rectangle._getWrapRec(pointList,_disBoundRec);
			return _disBoundRec;
		}

		NodeUtils.getNodeCmdCount=function(node){
			var rst=0;
			if (node.graphics){
				if (node.graphics.cmds){
					rst=node.graphics.cmds.length;
				}
				else{
					if (node.graphics._one){
						rst=1;
					}
					else{
						rst=0;
					}
				}
			}
			else{
				rst=0;
			}
			return rst;
		}

		NodeUtils.getNodeCmdTotalCount=function(node){
			var rst=0;
			var i=0,len=0;
			var cList;
			cList=node._childs;
			len=cList.length;
			rst=NodeUtils.getNodeCmdCount(node);
			for (i=0;i < len;i++){
				rst+=NodeUtils.getNodeCmdTotalCount(cList[i]);
			}
			return rst;
		}

		NodeUtils.getRenderNodeCount=function(node){
			if (node.cacheAs !="none")return 1;
			var rst=0;
			var i=0,len=0;
			var cList;
			cList=node._childs;
			len=cList.length;
			rst=1;
			for (i=0;i < len;i++){
				rst+=NodeUtils.getRenderNodeCount(cList[i]);
			}
			return rst;
		}

		NodeUtils.getReFreshRenderNodeCount=function(node){
			var rst=0;
			var i=0,len=0;
			var cList;
			cList=node._childs;
			len=cList.length;
			rst=1;
			for (i=0;i < len;i++){
				rst+=NodeUtils.getRenderNodeCount(cList[i]);
			}
			return rst;
		}

		NodeUtils.showCachedSpriteRecs=function(){
			NodeUtils.g=DebugInfoLayer.I.graphicLayer.graphics;
			NodeUtils.g.clear();
			WalkTools.walkTarget(Laya.stage,NodeUtils.drawCachedBounds,null);
		}

		NodeUtils.drawCachedBounds=function(sprite){
			if (sprite.cacheAs=="none")return;
			if (DebugInfoLayer.I.isDebugItem(sprite))return;
			var rec;
			rec=NodeUtils.getGRec(sprite);
			NodeUtils.g.drawRect(rec.x,rec.y,rec.width,rec.height,null,"#0000ff",2);
		}

		NodeUtils.g=null
		__static(NodeUtils,
		['defaultKeys',function(){return this.defaultKeys=["x","y","width","height"];}
		]);
		return NodeUtils;
	})()


	//class laya.debug.view.StyleConsts
	var StyleConsts=(function(){
		function StyleConsts(){}
		__class(StyleConsts,'laya.debug.view.StyleConsts');
		StyleConsts.setViewScale=function(view){
			view.scaleX=view.scaleY=StyleConsts.PanelScale;
		}

		__static(StyleConsts,
		['PanelScale',function(){return this.PanelScale=Browser.onPC?1:Browser.pixelRatio;}
		]);
		return StyleConsts;
	})()


	//class laya.device.geolocation.Geolocation
	var Geolocation=(function(){
		function Geolocation(){}
		__class(Geolocation,'laya.device.geolocation.Geolocation');
		Geolocation.getCurrentPosition=function(onSuccess,onError){
			Geolocation.navigator.geolocation.getCurrentPosition(function(pos){
				Geolocation.position.setPosition(pos);
				onSuccess.runWith(Geolocation.position);
			},
			function(error){
				onError.runWith(error);
				},{
				enableHighAccuracy :laya.device.geolocation.Geolocation.enableHighAccuracy,
				timeout :laya.device.geolocation.Geolocation.timeout,
				maximumAge :laya.device.geolocation.Geolocation.maximumAge
			});
		}

		Geolocation.watchPosition=function(onSuccess,onError){
			return Geolocation.navigator.geolocation.watchPosition(function(pos){
				Geolocation.position.setPosition(pos);
				onSuccess.runWith(Geolocation.position);
			},
			function(error){
				onError.runWith(error);
				},{
				enableHighAccuracy :Geolocation.enableHighAccuracy,
				timeout :Geolocation.timeout,
				maximumAge :Geolocation.maximumAge
			});
		}

		Geolocation.clearWatch=function(id){
			Geolocation.navigator.geolocation.clearWatch(id);
		}

		Geolocation.PERMISSION_DENIED=1;
		Geolocation.POSITION_UNAVAILABLE=2;
		Geolocation.TIMEOUT=3;
		Geolocation.enableHighAccuracy=false;
		Geolocation.maximumAge=0;
		__static(Geolocation,
		['navigator',function(){return this.navigator=Browser.window.navigator;},'position',function(){return this.position=new GeolocationInfo();},'supported',function(){return this.supported=!!Geolocation.navigator.geolocation;},'timeout',function(){return this.timeout=1E10;}
		]);
		return Geolocation;
	})()


	//class laya.device.geolocation.GeolocationInfo
	var GeolocationInfo=(function(){
		function GeolocationInfo(){
			this.pos=null;
			this.coords=null;
		}

		__class(GeolocationInfo,'laya.device.geolocation.GeolocationInfo');
		var __proto=GeolocationInfo.prototype;
		__proto.setPosition=function(pos){
			this.pos=pos;
			this.coords=pos.coords;
		}

		__getset(0,__proto,'heading',function(){
			return this.coords.heading;
		});

		__getset(0,__proto,'latitude',function(){
			return this.coords.latitude;
		});

		__getset(0,__proto,'altitudeAccuracy',function(){
			return this.coords.altitudeAccuracy;
		});

		__getset(0,__proto,'longitude',function(){
			return this.coords.longitude;
		});

		__getset(0,__proto,'altitude',function(){
			return this.coords.altitude;
		});

		__getset(0,__proto,'accuracy',function(){
			return this.coords.accuracy;
		});

		__getset(0,__proto,'speed',function(){
			return this.coords.speed;
		});

		__getset(0,__proto,'timestamp',function(){
			return this.pos.timestamp;
		});

		return GeolocationInfo;
	})()


	//class laya.display.BitmapFont
	var BitmapFont=(function(){
		function BitmapFont(){
			this._texture=null;
			this._fontCharDic={};
			this._fontWidthMap={};
			this._complete=null;
			this._path=null;
			this._maxWidth=0;
			this._spaceWidth=10;
			this._padding=null;
			this.fontSize=12;
			this.autoScaleSize=false;
			this.letterSpacing=0;
		}

		__class(BitmapFont,'laya.display.BitmapFont');
		var __proto=BitmapFont.prototype;
		/**
		*通过指定位图字体文件路径，加载位图字体文件，加载完成后会自动解析。
		*@param path 位图字体文件的路径。
		*@param complete 加载并解析完成的回调。
		*/
		__proto.loadFont=function(path,complete){
			this._path=path;
			this._complete=complete;
			Laya.loader.load([{url:this._path,type:"xml"},{url:this._path.replace(".fnt",".png"),type:"image"}],Handler.create(this,this.onLoaded));
		}

		/**
		*@private
		*/
		__proto.onLoaded=function(){
			this.parseFont(Loader.getRes(this._path),Loader.getRes(this._path.replace(".fnt",".png")));
			this._complete && this._complete.run();
		}

		/**
		*解析字体文件。
		*@param xml 字体文件XML。
		*@param texture 字体的纹理。
		*/
		__proto.parseFont=function(xml,texture){
			if (xml==null || texture==null)return;
			this._texture=texture;
			var tX=0;
			var tScale=1;
			var tInfo=xml.getElementsByTagName("info");
			this.fontSize=parseInt(tInfo[0].attributes["size"].nodeValue);
			var tPadding=tInfo[0].attributes["padding"].nodeValue;
			var tPaddingArray=tPadding.split(",");
			this._padding=[parseInt(tPaddingArray[0]),parseInt(tPaddingArray[1]),parseInt(tPaddingArray[2]),parseInt(tPaddingArray[3])];
			var chars=xml.getElementsByTagName("char");
			var i=0;
			for (i=0;i < chars.length;i++){
				var tAttribute=chars[i].attributes;
				var tId=parseInt(tAttribute["id"].nodeValue);
				var xOffset=parseInt(tAttribute["xoffset"].nodeValue)/ tScale;
				var yOffset=parseInt(tAttribute["yoffset"].nodeValue)/ tScale;
				var xAdvance=parseInt(tAttribute["xadvance"].nodeValue)/ tScale;
				var region=new Rectangle();
				region.x=parseInt(tAttribute["x"].nodeValue);
				region.y=parseInt(tAttribute["y"].nodeValue);
				region.width=parseInt(tAttribute["width"].nodeValue);
				region.height=parseInt(tAttribute["height"].nodeValue);
				var tTexture=Texture.create(texture,region.x,region.y,region.width,region.height,xOffset,yOffset);
				this._maxWidth=Math.max(this._maxWidth,xAdvance+this.letterSpacing);
				this._fontCharDic[tId]=tTexture;
				this._fontWidthMap[tId]=xAdvance;
			}
		}

		/**
		*获取指定字符的字体纹理对象。
		*@param char 字符。
		*@return 指定的字体纹理对象。
		*/
		__proto.getCharTexture=function(char){
			return this._fontCharDic[char.charCodeAt(0)];
		}

		/**
		*销毁位图字体，调用Text.unregisterBitmapFont 时，默认会销毁。
		*/
		__proto.destroy=function(){
			if (this._texture){
				for (var p in this._fontCharDic){
					var tTexture=this._fontCharDic[p];
					if (tTexture)tTexture.destroy();
				}
				this._texture.destroy();
				this._fontCharDic=null;
				this._fontWidthMap=null;
				this._texture=null;
			}
		}

		/**
		*设置空格的宽（如果字体库有空格，这里就可以不用设置了）。
		*@param spaceWidth 宽度，单位为像素。
		*/
		__proto.setSpaceWidth=function(spaceWidth){
			this._spaceWidth=spaceWidth;
		}

		/**
		*获取指定字符的宽度。
		*@param char 字符。
		*@return 宽度。
		*/
		__proto.getCharWidth=function(char){
			var code=char.charCodeAt(0);
			if (this._fontWidthMap[code])return this._fontWidthMap[code]+this.letterSpacing;
			if (char==" ")return this._spaceWidth+this.letterSpacing;
			return 0;
		}

		/**
		*获取指定文本内容的宽度。
		*@param text 文本内容。
		*@return 宽度。
		*/
		__proto.getTextWidth=function(text){
			var tWidth=0;
			for (var i=0,n=text.length;i < n;i++){
				tWidth+=this.getCharWidth(text.charAt(i));
			}
			return tWidth;
		}

		/**
		*获取最大字符宽度。
		*/
		__proto.getMaxWidth=function(){
			return this._maxWidth;
		}

		/**
		*获取最大字符高度。
		*/
		__proto.getMaxHeight=function(){
			return this.fontSize;
		}

		/**
		*@private
		*将指定的文本绘制到指定的显示对象上。
		*/
		__proto.drawText=function(text,sprite,drawX,drawY,align,width){
			var tWidth=this.getTextWidth(text);
			var tTexture;
			var dx=0;
			align==="center" && (dx=(width-tWidth)/ 2);
			align==="right" && (dx=(width-tWidth));
			var tX=0;
			for (var i=0,n=text.length;i < n;i++){
				tTexture=this.getCharTexture(text.charAt(i));
				if (tTexture){
					sprite.graphics.drawTexture(tTexture,drawX+tX+dx,drawY);
					tX+=this.getCharWidth(text.charAt(i));
				}
			}
		}

		return BitmapFont;
	})()


	//class laya.display.css.Style
	var Style=(function(){
		function Style(){
			this.alpha=1;
			this.visible=true;
			this.scrollRect=null;
			this.blendMode=null;
			this._type=0;
			this._tf=Style._TF_EMPTY;
		}

		__class(Style,'laya.display.css.Style');
		var __proto=Style.prototype;
		__proto.getTransform=function(){
			return this._tf;
		}

		__proto.setTransform=function(value){
			this._tf=value==='none' || !value ? Style._TF_EMPTY :value;
		}

		__proto.setTranslateX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.translateX=value;
		}

		__proto.setTranslateY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.translateY=value;
		}

		__proto.setScaleX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.scaleX=value;
		}

		__proto.setScale=function(x,y){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.scaleX=x;
			this._tf.scaleY=y;
		}

		__proto.setScaleY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.scaleY=value;
		}

		__proto.setRotate=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.rotate=value;
		}

		__proto.setSkewX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.skewX=value;
		}

		__proto.setSkewY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.skewY=value;
		}

		/**销毁此对象。*/
		__proto.destroy=function(){
			this.scrollRect=null;
		}

		/**@private */
		__proto.render=function(sprite,context,x,y){}
		/**@private */
		__proto.getCSSStyle=function(){
			return CSSStyle.EMPTY;
		}

		/**@private */
		__proto._enableLayout=function(){
			return false;
		}

		/**X 轴缩放值。*/
		__getset(0,__proto,'scaleX',function(){
			return this._tf.scaleX;
			},function(value){
			this.setScaleX(value);
		});

		/**元素应用的 2D 或 3D 转换的值。该属性允许我们对元素进行旋转、缩放、移动或倾斜。*/
		__getset(0,__proto,'transform',function(){
			return this.getTransform();
			},function(value){
			this.setTransform(value);
		});

		/**定义转换，只是用 X 轴的值。*/
		__getset(0,__proto,'translateX',function(){
			return this._tf.translateX;
			},function(value){
			this.setTranslateX(value);
		});

		/**定义转换，只是用 Y 轴的值。*/
		__getset(0,__proto,'translateY',function(){
			return this._tf.translateY;
			},function(value){
			this.setTranslateY(value);
		});

		/**Y 轴缩放值。*/
		__getset(0,__proto,'scaleY',function(){
			return this._tf.scaleY;
			},function(value){
			this.setScaleY(value);
		});

		/**表示元素是否显示为块级元素。*/
		__getset(0,__proto,'block',function(){
			return (this._type & 0x1)!=0;
		});

		/**定义沿着 Y 轴的 2D 倾斜转换。*/
		__getset(0,__proto,'skewY',function(){
			return this._tf.skewY;
			},function(value){
			this.setSkewY(value);
		});

		/**定义旋转角度。*/
		__getset(0,__proto,'rotate',function(){
			return this._tf.rotate;
			},function(value){
			this.setRotate(value);
		});

		/**定义沿着 X 轴的 2D 倾斜转换。*/
		__getset(0,__proto,'skewX',function(){
			return this._tf.skewX;
			},function(value){
			this.setSkewX(value);
		});

		/**表示元素的左内边距。*/
		__getset(0,__proto,'paddingLeft',function(){
			return 0;
		});

		/**表示元素的上内边距。*/
		__getset(0,__proto,'paddingTop',function(){
			return 0;
		});

		/**是否为绝对定位。*/
		__getset(0,__proto,'absolute',function(){
			return true;
		});

		Style.__init__=function(){
			Style._TF_EMPTY=new TransformInfo();
			Style.EMPTY=new Style();
		}

		Style.EMPTY=null
		Style._TF_EMPTY=null
		return Style;
	})()


	//class laya.display.css.Font
	var Font=(function(){
		function Font(src){
			this._type=0;
			this._weight=0;
			this._decoration=null;
			this._text=null;
			this.indent=0;
			this._color=Color.create(Font.defaultColor);
			this.family=Font.defaultFamily;
			this.stroke=Font._STROKE;
			this.size=Font.defaultSize;
			src && src!==Font.EMPTY && src.copyTo(this);
		}

		__class(Font,'laya.display.css.Font');
		var __proto=Font.prototype;
		/**
		*字体样式字符串。
		*/
		__proto.set=function(value){
			this._text=null;
			var strs=value.split(' ');
			for (var i=0,n=strs.length;i < n;i++){
				var str=strs[i];
				switch (str){
					case 'italic':
						this.italic=true;
						continue ;
					case 'bold':
						this.bold=true;
						continue ;
					}
				if (str.indexOf('px')> 0){
					this.size=parseInt(str);
					this.family=strs[i+1];
					i++;
					continue ;
				}
			}
		}

		/**
		*返回字体样式字符串。
		*@return 字体样式字符串。
		*/
		__proto.toString=function(){
			this._text=""
			this.italic && (this._text+="italic ");
			this.bold && (this._text+="bold ");
			return this._text+=this.size+"px "+this.family;
		}

		/**
		*将当前的属性值复制到传入的 <code>Font</code> 对象。
		*@param dec 一个 Font 对象。
		*/
		__proto.copyTo=function(dec){
			dec._type=this._type;
			dec._text=this._text;
			dec._weight=this._weight;
			dec._color=this._color;
			dec.family=this.family;
			dec.stroke=this.stroke !=Font._STROKE ? this.stroke.slice():Font._STROKE;
			dec.indent=this.indent;
			dec.size=this.size;
		}

		/**
		*表示是否为密码格式。
		*/
		__getset(0,__proto,'password',function(){
			return (this._type & 0x400)!==0;
			},function(value){
			value ? (this._type |=0x400):(this._type &=~0x400);
		});

		/**
		*表示颜色字符串。
		*/
		__getset(0,__proto,'color',function(){
			return this._color.strColor;
			},function(value){
			this._color=Color.create(value);
		});

		/**
		*表示是否为斜体。
		*/
		__getset(0,__proto,'italic',function(){
			return (this._type & 0x200)!==0;
			},function(value){
			value ? (this._type |=0x200):(this._type &=~0x200);
		});

		/**
		*表示是否为粗体。
		*/
		__getset(0,__proto,'bold',function(){
			return (this._type & 0x800)!==0;
			},function(value){
			value ? (this._type |=0x800):(this._type &=~0x800);
		});

		/**
		*文本的粗细。
		*/
		__getset(0,__proto,'weight',function(){
			return ""+this._weight;
			},function(value){
			var weight=0;
			switch (value){
				case 'normal':
					break ;
				case 'bold':
					this.bold=true;
					weight=700;
					break ;
				case 'bolder':
					weight=800;
					break ;
				case 'lighter':
					weight=100;
					break ;
				default :
					weight=parseInt(value);
				}
			this._weight=weight;
			this._text=null;
		});

		/**
		*规定添加到文本的修饰。
		*/
		__getset(0,__proto,'decoration',function(){
			return this._decoration ? this._decoration.value :"none";
			},function(value){
			var strs=value.split(' ');
			this._decoration || (this._decoration={});
			switch (strs[0]){
				case '_':
					this._decoration.type='underline'
					break ;
				case '-':
					this._decoration.type='line-through'
					break ;
				case 'overline':
					this._decoration.type='overline'
					break ;
				default :
					this._decoration.type=strs[0];
				}
			strs[1] && (this._decoration.color=Color.create(strs));
			this._decoration.value=value;
		});

		Font.__init__=function(){
			Font.EMPTY=new Font(null);
		}

		Font.EMPTY=null
		Font.defaultColor="#000000";
		Font.defaultSize=12;
		Font.defaultFamily="Arial";
		Font.defaultFont="12px Arial";
		Font._STROKE=[0,"#000000"];
		Font._ITALIC=0x200;
		Font._PASSWORD=0x400;
		Font._BOLD=0x800;
		return Font;
	})()


	//class laya.display.css.TransformInfo
	var TransformInfo=(function(){
		function TransformInfo(){
			this.translateX=0;
			this.translateY=0;
			this.scaleX=1;
			this.scaleY=1;
			this.rotate=0;
			this.skewX=0;
			this.skewY=0;
		}

		__class(TransformInfo,'laya.display.css.TransformInfo');
		return TransformInfo;
	})()


	//class laya.events.Event
	var Event=(function(){
		function Event(){
			//this.type=null;
			//this.nativeEvent=null;
			//this.target=null;
			//this.currentTarget=null;
			//this._stoped=false;
			//this.touchId=0;
			//this.keyCode=0;
			//this.delta=0;
		}

		__class(Event,'laya.events.Event');
		var __proto=Event.prototype;
		/**
		*设置事件数据。
		*@param type 事件类型。
		*@param currentTarget 事件目标触发对象。
		*@param target 事件当前冒泡对象。
		*@return 返回当前 Event 对象。
		*/
		__proto.setTo=function(type,currentTarget,target){
			this.type=type;
			this.currentTarget=currentTarget;
			this.target=target;
			return this;
		}

		/**
		*防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
		*/
		__proto.stopPropagation=function(){
			this._stoped=true;
		}

		/**鼠标在 Stage 上的 Y 轴坐标*/
		__getset(0,__proto,'stageY',function(){
			return Laya.stage.mouseY;
		});

		/**
		*包含按下或释放的键的字符代码值。字符代码值为英文键盘值。
		*/
		__getset(0,__proto,'charCode',function(){
			return this.nativeEvent.charCode;
		});

		/**
		*触摸点列表。
		*/
		__getset(0,__proto,'touches',function(){
			var arr=this.nativeEvent.touches;
			if (arr){
				var stage=Laya.stage;
				for (var i=0,n=arr.length;i < n;i++){
					var e=arr[i];
					var point=Point.TEMP;
					point.setTo(e.clientX,e.clientY);
					stage._canvasTransform.invertTransformPoint(point);
					stage.transform.invertTransformPoint(point);
					e.stageX=point.x;
					e.stageY=point.y;
				}
			}
			return arr;
		});

		/**
		*表示键在键盘上的位置。这对于区分在键盘上多次出现的键非常有用。<br>
		*例如，您可以根据此属性的值来区分左 Shift 键和右 Shift 键：左 Shift 键的值为 KeyLocation.LEFT，右 Shift 键的值为 KeyLocation.RIGHT。另一个示例是区分标准键盘 (KeyLocation.STANDARD)与数字键盘 (KeyLocation.NUM_PAD)上按下的数字键。
		*/
		__getset(0,__proto,'keyLocation',function(){
			return this.nativeEvent.keyLocation;
		});

		/**
		*表示 Ctrl 键是处于活动状态 (true)还是非活动状态 (false)。
		*/
		__getset(0,__proto,'ctrlKey',function(){
			return this.nativeEvent.ctrlKey;
		});

		/**
		*表示 Alt 键是处于活动状态 (true)还是非活动状态 (false)。
		*/
		__getset(0,__proto,'altKey',function(){
			return this.nativeEvent.altKey;
		});

		/**
		*表示 Shift 键是处于活动状态 (true)还是非活动状态 (false)。
		*/
		__getset(0,__proto,'shiftKey',function(){
			return this.nativeEvent.shiftKey;
		});

		/**鼠标在 Stage 上的 X 轴坐标*/
		__getset(0,__proto,'stageX',function(){
			return Laya.stage.mouseX;
		});

		Event.EMPTY=new Event();
		Event.MOUSE_DOWN="mousedown";
		Event.MOUSE_UP="mouseup";
		Event.CLICK="click";
		Event.RIGHT_MOUSE_DOWN="rightmousedown";
		Event.RIGHT_MOUSE_UP="rightmouseup";
		Event.RIGHT_CLICK="rightclick";
		Event.MOUSE_MOVE="mousemove";
		Event.MOUSE_OVER="mouseover";
		Event.MOUSE_OUT="mouseout";
		Event.MOUSE_WHEEL="mousewheel";
		Event.ROLL_OVER="mouseover";
		Event.ROLL_OUT="mouseout";
		Event.DOUBLE_CLICK="doubleclick";
		Event.CHANGE="change";
		Event.CHANGED="changed";
		Event.RESIZE="resize";
		Event.ADDED="added";
		Event.REMOVED="removed";
		Event.DISPLAY="display";
		Event.UNDISPLAY="undisplay";
		Event.ERROR="error";
		Event.COMPLETE="complete";
		Event.LOADED="loaded";
		Event.PROGRESS="progress";
		Event.INPUT="input";
		Event.RENDER="render";
		Event.OPEN="open";
		Event.MESSAGE="message";
		Event.CLOSE="close";
		Event.KEY_DOWN="keydown";
		Event.KEY_PRESS="keypress";
		Event.KEY_UP="keyup";
		Event.FRAME="enterframe";
		Event.DRAG_START="dragstart";
		Event.DRAG_MOVE="dragmove";
		Event.DRAG_END="dragend";
		Event.ENTER="enter";
		Event.SELECT="select";
		Event.BLUR="blur";
		Event.FOCUS="focus";
		Event.VISIBILITY_CHANGE="visibilitychange";
		Event.FOCUS_CHANGE="focuschange";
		Event.PLAYED="played";
		Event.PAUSED="paused";
		Event.STOPPED="stopped";
		Event.START="start";
		Event.END="end";
		Event.ENABLE_CHANGED="enablechanged";
		Event.ACTIVE_IN_HIERARCHY_CHANGED="activeinhierarchychanged";
		Event.COMPONENT_ADDED="componentadded";
		Event.COMPONENT_REMOVED="componentremoved";
		Event.LAYER_CHANGED="layerchanged";
		Event.HIERARCHY_LOADED="hierarchyloaded";
		Event.RECOVERING="recovering";
		Event.RECOVERED="recovered";
		Event.RELEASED="released";
		Event.LINK="link";
		Event.LABEL="label";
		Event.FULL_SCREEN_CHANGE="fullscreenchange";
		Event.DEVICE_LOST="devicelost";
		Event.MESH_CHANGED="meshchanged";
		Event.MATERIAL_CHANGED="materialchanged";
		Event.RENDERQUEUE_CHANGED="renderqueuechanged";
		Event.WORLDMATRIX_NEEDCHANGE="worldmatrixneedchanged";
		Event.ANIMATION_CHANGED="animationchanged";
		return Event;
	})()


	//class laya.events.KeyBoardManager
	var KeyBoardManager=(function(){
		function KeyBoardManager(){};
		__class(KeyBoardManager,'laya.events.KeyBoardManager');
		KeyBoardManager.__init__=function(){
			KeyBoardManager._addEvent("keydown");
			KeyBoardManager._addEvent("keypress");
			KeyBoardManager._addEvent("keyup");
		}

		KeyBoardManager._addEvent=function(type){
			Browser.document.addEventListener(type,function(e){
				laya.events.KeyBoardManager._dispatch(e,type);
			},true);
		}

		KeyBoardManager._dispatch=function(e,type){
			if (!KeyBoardManager.enabled)return;
			KeyBoardManager._event._stoped=false;
			KeyBoardManager._event.nativeEvent=e;
			KeyBoardManager._event.keyCode=e.keyCode || e.which || e.charCode;
			if (type==="keydown")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=true;
			else if (type==="keyup")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=null;
			var target=(Laya.stage.focus && (Laya.stage.focus.event !=null)&& Laya.stage.focus.displayedInStage)? Laya.stage.focus :Laya.stage;
			var ct=target;
			while (ct){
				ct.event(type,KeyBoardManager._event.setTo(type,ct,target));
				ct=ct.parent;
			}
		}

		KeyBoardManager.hasKeyDown=function(key){
			return KeyBoardManager._pressKeys[key];
		}

		KeyBoardManager._pressKeys={};
		KeyBoardManager.enabled=true;
		__static(KeyBoardManager,
		['_event',function(){return this._event=new Event();}
		]);
		return KeyBoardManager;
	})()


	//class laya.events.MouseManager
	var MouseManager=(function(){
		function MouseManager(){
			this.mouseX=0;
			this.mouseY=0;
			this.disableMouseEvent=false;
			this.mouseDownTime=0;
			this.mouseMoveAccuracy=2;
			this._stage=null;
			this._target=null;
			this._lastMoveTimer=0;
			this._isLeftMouse=false;
			this._eventList=[];
			this._touchIDs={};
			this._id=1;
			this._tTouchID=0;
			this._event=new Event();
			this._matrix=new Matrix();
			this._point=new Point();
			this._rect=new Rectangle();
			this._prePoint=new Point();
			this._curTouchID=NaN;
		}

		__class(MouseManager,'laya.events.MouseManager');
		var __proto=MouseManager.prototype;
		/**
		*@private
		*初始化。
		*/
		__proto.__init__=function(stage,canvas){
			this._stage=stage;
			var _this=this;
			var list=this._eventList;
			canvas.oncontextmenu=function (e){
				if (MouseManager.enabled)return false;
			}
			canvas.addEventListener('mousedown',function(e){
				if (MouseManager.enabled){
					if(!Browser.onIE)e.preventDefault();
					list.push(e);
					_this.mouseDownTime=Browser.now();
				}
			});
			canvas.addEventListener('mouseup',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
					_this.mouseDownTime=-Browser.now();
				}
			},true);
			canvas.addEventListener('mousemove',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					var now=Browser.now();
					if (now-_this._lastMoveTimer < 10)return;
					_this._lastMoveTimer=now;
					list.push(e);
				}
			},true);
			canvas.addEventListener("mouseout",function(e){
				if (MouseManager.enabled)list.push(e);
			})
			canvas.addEventListener("mouseover",function(e){
				if (MouseManager.enabled)list.push(e);
			})
			canvas.addEventListener("touchstart",function(e){
				if (MouseManager.enabled){
					list.push(e);
					if (!Input.isInputting)e.preventDefault();
					_this.mouseDownTime=Browser.now();
				}
			});
			canvas.addEventListener("touchend",function(e){
				if (MouseManager.enabled){
					if (!Input.isInputting)e.preventDefault();
					list.push(e);
					_this.mouseDownTime=-Browser.now();
				}
			},true);
			canvas.addEventListener("touchmove",function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
				}
			},true);
			canvas.addEventListener('mousewheel',function(e){
				if (MouseManager.enabled)list.push(e);
			});
			canvas.addEventListener('DOMMouseScroll',function(e){
				if (MouseManager.enabled)list.push(e);
			});
		}

		__proto.initEvent=function(e,nativeEvent){
			var _this=this;
			_this._event._stoped=false;
			_this._event.nativeEvent=nativeEvent || e;
			_this._target=null;
			this._point.setTo(e.pageX || e.clientX,e.pageY || e.clientY);
			this._stage._canvasTransform.invertTransformPoint(this._point);
			_this.mouseX=this._point.x;
			_this.mouseY=this._point.y;
			_this._event.touchId=e.identifier || 0;
			this._tTouchID=_this._event.touchId;
			var evt;
			evt=TouchManager.I._event;
			evt._stoped=false;
			evt.nativeEvent=_this._event.nativeEvent;
			evt.touchId=_this._event.touchId;
		}

		__proto.checkMouseWheel=function(e){
			this._event.delta=e.wheelDelta ? e.wheelDelta *0.025 :-e.detail;
			var _lastOvers=TouchManager.I.getLastOvers();
			for (var i=0,n=_lastOvers.length;i < n;i++){
				var ele=_lastOvers[i];
				ele.event("mousewheel",this._event.setTo("mousewheel",ele,this._target));
			}
		}

		// _stage.event(Event.MOUSE_WHEEL,_event.setTo(Event.MOUSE_WHEEL,_stage,_target));
		__proto.onMouseMove=function(ele){
			TouchManager.I.onMouseMove(ele,this._tTouchID);
		}

		__proto.onMouseDown=function(ele){
			if (Input.isInputting && Laya.stage.focus && Laya.stage.focus["focus"] && !Laya.stage.focus.contains(this._target)){
				var pre_input=Laya.stage.focus['_tf'] || Laya.stage.focus;
				var new_input=ele['_tf'] || ele;
				if ((new_input instanceof laya.display.Input )&& new_input.multiline==pre_input.multiline)
					pre_input['_focusOut']();
				else
				pre_input.focus=false;
			}
			TouchManager.I.onMouseDown(ele,this._tTouchID,this._isLeftMouse);
		}

		__proto.onMouseUp=function(ele){
			TouchManager.I.onMouseUp(ele,this._tTouchID,this._isLeftMouse);
		}

		__proto.check=function(sp,mouseX,mouseY,callBack){
			this._point.setTo(mouseX,mouseY);
			sp.fromParentPoint(this._point);
			mouseX=this._point.x;
			mouseY=this._point.y;
			var scrollRect=sp.scrollRect;
			if (scrollRect){
				this._rect.setTo(scrollRect.x,scrollRect.y,scrollRect.width,scrollRect.height);
				if (!this._rect.contains(mouseX,mouseY))return false;
			}
			if (!this.disableMouseEvent){
				if (sp.hitTestPrior && !sp.mouseThrough && !this.hitTest(sp,mouseX,mouseY)){
					return false;
				}
				for (var i=sp._childs.length-1;i >-1;i--){
					var child=sp._childs[i];
					if (!child.destroyed && child.mouseEnabled && child.visible){
						if (this.check(child,mouseX,mouseY,callBack))return true;
					}
				}
			};
			var isHit=(sp.hitTestPrior && !sp.mouseThrough && !this.disableMouseEvent)? true :this.hitTest(sp,mouseX,mouseY);
			if (isHit){
				this._target=sp;
				callBack.call(this,sp);
				}else if (callBack===this.onMouseUp && sp===this._stage){
				this._target=this._stage;
				callBack.call(this,this._target);
			}
			return isHit;
		}

		__proto.hitTest=function(sp,mouseX,mouseY){
			var isHit=false;
			if (sp.scrollRect){
				mouseX-=sp.scrollRect.x;
				mouseY-=sp.scrollRect.y;
			}
			if ((sp.hitArea instanceof laya.utils.HitArea )){
				return sp.hitArea.isHit(mouseX,mouseY);
			}
			if (sp.width > 0 && sp.height > 0 || sp.mouseThrough || sp.hitArea){
				if (!sp.mouseThrough){
					var hitRect=this._rect;
					if (sp.hitArea)hitRect=sp.hitArea;
					else hitRect.setTo(0,0,sp.width,sp.height);
					isHit=hitRect.contains(mouseX,mouseY);
					}else {
					isHit=sp.getGraphicBounds().contains(mouseX,mouseY);
				}
			}
			return isHit;
		}

		/**
		*执行事件处理。
		*/
		__proto.runEvent=function(){
			var len=this._eventList.length;
			if (!len)return;
			var _this=this;
			var i=0;
			while (i < len){
				var evt=this._eventList[i];
				if (evt.type!=='mousemove')this._prePoint.x=this._prePoint.y=-1000000;
				switch (evt.type){
					case 'mousedown':
						this._touchIDs[0]=this._id++;
						if (!MouseManager._isTouchRespond){
							_this._isLeftMouse=evt.button===0;
							_this.initEvent(evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						}else
						MouseManager._isTouchRespond=false;
						break ;
					case 'mouseup':
						_this._isLeftMouse=evt.button===0;
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
						break ;
					case 'mousemove':
						if ((Math.abs(this._prePoint.x-evt.clientX)+Math.abs(this._prePoint.y-evt.clientY))>=this.mouseMoveAccuracy){
							this._prePoint.x=evt.clientX;
							this._prePoint.y=evt.clientY;
							_this.initEvent(evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
						}
						break ;
					case "touchstart":
						MouseManager._isTouchRespond=true;
						_this._isLeftMouse=true;
						var touches=evt.changedTouches;
						for (var j=0,n=touches.length;j < n;j++){
							var touch=touches[j];
							if (MouseManager.multiTouchEnabled || isNaN(this._curTouchID)){
								this._curTouchID=touch.identifier;
								if (this._id % 200===0)this._touchIDs={};
								this._touchIDs[touch.identifier]=this._id++;
								_this.initEvent(touch,evt);
								_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
							}
						}
						break ;
					case "touchend":
						MouseManager._isTouchRespond=true;
						_this._isLeftMouse=true;
						var touchends=evt.changedTouches;
						for (j=0,n=touchends.length;j < n;j++){
							touch=touchends[j];
							if (MouseManager.multiTouchEnabled || touch.identifier==this._curTouchID){
								this._curTouchID=NaN;
								_this.initEvent(touch,evt);
								var isChecked=false;
								isChecked=_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
								if (!isChecked){
									_this.onMouseUp(null);
								}
							}
						}
						break ;
					case "touchmove":;
						var touchemoves=evt.changedTouches;
						for (j=0,n=touchemoves.length;j < n;j++){
							touch=touchemoves[j];
							if (MouseManager.multiTouchEnabled || touch.identifier==this._curTouchID){
								_this.initEvent(touch,evt);
								_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
							}
						}
						break ;
					case "wheel":
					case "mousewheel":
					case "DOMMouseScroll":
						_this.checkMouseWheel(evt);
						break ;
					case "mouseout":
						_this._stage.event("mouseout",_this._event.setTo("mouseout",_this._stage,_this._stage));
						break ;
					case "mouseover":
						_this._stage.event("mouseover",_this._event.setTo("mouseover",_this._stage,_this._stage));
						break ;
					}
				i++;
			}
			this._eventList.length=0;
		}

		MouseManager.enabled=true;
		MouseManager.multiTouchEnabled=true;
		MouseManager._isTouchRespond=false;
		__static(MouseManager,
		['instance',function(){return this.instance=new MouseManager();}
		]);
		return MouseManager;
	})()


	//class laya.events.TouchManager
	var TouchManager=(function(){
		function TouchManager(){
			this.preOvers=[];
			this.preDowns=[];
			this.preRightDowns=[];
			this.enable=true;
			this._lastClickTime=0;
			this._event=new Event();
		}

		__class(TouchManager,'laya.events.TouchManager');
		var __proto=TouchManager.prototype;
		/**
		*从touch表里查找对应touchID的数据
		*@param touchID touch ID
		*@param arr touch表
		*@return
		*
		*/
		__proto.getTouchFromArr=function(touchID,arr){
			var i=0,len=0;
			len=arr.length;
			var tTouchO;
			for (i=0;i < len;i++){
				tTouchO=arr[i];
				if (tTouchO.id==touchID){
					return tTouchO;
				}
			}
			return null;
		}

		/**
		*从touch表里移除一个元素
		*@param touchID touch ID
		*@param arr touch表
		*
		*/
		__proto.removeTouchFromArr=function(touchID,arr){
			var i=0;
			for (i=arr.length-1;i >=0;i--){
				if (arr[i].id==touchID){
					arr.splice(i,1);
				}
			}
		}

		/**
		*创建一个touch数据
		*@param ele 当前的根节点
		*@param touchID touchID
		*@return
		*
		*/
		__proto.createTouchO=function(ele,touchID){
			var rst;
			rst=Pool.getItem("TouchData")|| {};
			rst.id=touchID;
			rst.tar=ele;
			return rst;
		}

		/**
		*处理touchStart
		*@param ele 根节点
		*@param touchID touchID
		*@param isLeft （可选）是否为左键
		*/
		__proto.onMouseDown=function(ele,touchID,isLeft){
			(isLeft===void 0)&& (isLeft=false);
			if (!this.enable)
				return;
			var preO;
			var tO;
			var arrs;
			preO=this.getTouchFromArr(touchID,this.preOvers);
			arrs=this.getEles(ele,null,TouchManager._tEleArr);
			if (!preO){
				tO=this.createTouchO(ele,touchID);
				this.preOvers.push(tO);
				}else {
				preO.tar=ele;
			}
			if (Browser.onMobile)
				this.sendEvents(arrs,"mouseover",touchID);
			var preDowns;
			preDowns=isLeft ? this.preDowns :this.preRightDowns;
			preO=this.getTouchFromArr(touchID,preDowns);
			if (!preO){
				tO=this.createTouchO(ele,touchID);
				preDowns.push(tO);
				}else {
				preO.tar=ele;
			}
			this.sendEvents(arrs,isLeft ? "mousedown" :"rightmousedown",touchID);
		}

		/**
		*派发事件。
		*@param eles 对象列表。
		*@param type 事件类型。
		*@param touchID （可选）touchID，默认为0。
		*/
		__proto.sendEvents=function(eles,type,touchID){
			(touchID===void 0)&& (touchID=0);
			var i=0,len=0;
			len=eles.length;
			this._event._stoped=false;
			var _target;
			_target=eles[0];
			var tE;
			for (i=0;i < len;i++){
				tE=eles[i];
				if (tE.destroyed)return;
				tE.event(type,this._event.setTo(type,tE,_target));
				if (this._event._stoped)
					break ;
			}
		}

		/**
		*获取对象列表。
		*@param start 起始节点。
		*@param end 结束节点。
		*@param rst 返回值。如果此值不为空，则将其赋值为计算结果，从而避免创建新数组；如果此值为空，则创建新数组返回。
		*@return Array 返回节点列表。
		*/
		__proto.getEles=function(start,end,rst){
			if (!rst){
				rst=[];
				}else {
				rst.length=0;
			}
			while (start && start !=end){
				rst.push(start);
				start=start.parent;
			}
			return rst;
		}

		/**
		*touchMove时处理out事件和over时间。
		*@param eleNew 新的根节点。
		*@param elePre 旧的根节点。
		*@param touchID （可选）touchID，默认为0。
		*/
		__proto.checkMouseOutAndOverOfMove=function(eleNew,elePre,touchID){
			(touchID===void 0)&& (touchID=0);
			if (elePre==eleNew)
				return;
			var tar;
			var arrs;
			var i=0,len=0;
			if (elePre.contains(eleNew)){
				arrs=this.getEles(eleNew,elePre,TouchManager._tEleArr);
				this.sendEvents(arrs,"mouseover",touchID);
				}else if (eleNew.contains(elePre)){
				arrs=this.getEles(elePre,eleNew,TouchManager._tEleArr);
				this.sendEvents(arrs,"mouseout",touchID);
				}else {
				arrs=TouchManager._tEleArr;
				arrs.length=0;
				var oldArr;
				oldArr=this.getEles(elePre,null,TouchManager._oldArr);
				var newArr;
				newArr=this.getEles(eleNew,null,TouchManager._newArr);
				len=oldArr.length;
				var tIndex=0;
				for (i=0;i < len;i++){
					tar=oldArr[i];
					tIndex=newArr.indexOf(tar);
					if (tIndex >=0){
						newArr.splice(tIndex,newArr.length-tIndex);
						break ;
						}else {
						arrs.push(tar);
					}
				}
				if (arrs.length > 0){
					this.sendEvents(arrs,"mouseout",touchID);
				}
				if (newArr.length > 0){
					this.sendEvents(newArr,"mouseover",touchID);
				}
			}
		}

		/**
		*处理TouchMove事件
		*@param ele 根节点
		*@param touchID touchID
		*
		*/
		__proto.onMouseMove=function(ele,touchID){
			if (!this.enable)
				return;
			var preO;
			preO=this.getTouchFromArr(touchID,this.preOvers);
			var arrs;
			arrs=this.getEles(ele,null,TouchManager._tEleArr);
			var tO;
			if (!preO){
				this.sendEvents(arrs,"mouseover",touchID);
				this.preOvers.push(this.createTouchO(ele,touchID));
				}else {
				this.checkMouseOutAndOverOfMove(ele,preO.tar);
				preO.tar=ele;
			}
			this.sendEvents(arrs,"mousemove",touchID);
		}

		__proto.getLastOvers=function(){
			TouchManager._tEleArr.length=0;
			if (this.preOvers.length > 0 && this.preOvers[0].tar){
				return this.getEles(this.preOvers[0].tar,null,TouchManager._tEleArr);
			}
			TouchManager._tEleArr.push(Laya.stage);
			return TouchManager._tEleArr;
		}

		/**
		*处理TouchEnd事件
		*@param ele 根节点
		*@param touchID touchID
		*@param isLeft 是否为左键
		*/
		__proto.onMouseUp=function(ele,touchID,isLeft){
			(isLeft===void 0)&& (isLeft=false);
			if (!this.enable)
				return;
			var preO;
			var tO;
			var arrs;
			var oldArr;
			var i=0,len=0;
			var tar;
			var sendArr;
			var onMobile=Browser.onMobile;
			arrs=this.getEles(ele,null,TouchManager._tEleArr);
			this.sendEvents(arrs,isLeft ? "mouseup" :"rightmouseup",touchID);
			var preDowns;
			preDowns=isLeft ? this.preDowns :this.preRightDowns;
			preO=this.getTouchFromArr(touchID,preDowns);
			if (!preO){
				}else {
				var isDouble=false;
				var now=Browser.now();
				isDouble=now-this._lastClickTime < 300;
				this._lastClickTime=now;
				if (ele==preO.tar){
					sendArr=arrs;
					}else {
					oldArr=this.getEles(preO.tar,null,TouchManager._oldArr);
					sendArr=TouchManager._newArr;
					sendArr.length=0;
					len=oldArr.length;
					for (i=0;i < len;i++){
						tar=oldArr[i];
						if (arrs.indexOf(tar)>=0){
							sendArr.push(tar);
						}
					}
				}
				if (sendArr.length > 0){
					this.sendEvents(sendArr,isLeft ? "click" :"rightclick",touchID);
				}
				if (isLeft && isDouble){
					this.sendEvents(sendArr,"doubleclick",touchID);
				}
				this.removeTouchFromArr(touchID,preDowns);
				preO.tar=null;
				Pool.recover("TouchData",preO);
			}
			preO=this.getTouchFromArr(touchID,this.preOvers);
			if (!preO){
				}else {
				if (onMobile){
					sendArr=this.getEles(preO.tar,null,sendArr);
					if (sendArr && sendArr.length > 0){
						this.sendEvents(sendArr,"mouseout",touchID);
					}
					this.removeTouchFromArr(touchID,this.preOvers);
					preO.tar=null;
					Pool.recover("TouchData",preO);
				}
			}
		}

		TouchManager._oldArr=[];
		TouchManager._newArr=[];
		TouchManager._tEleArr=[];
		__static(TouchManager,
		['I',function(){return this.I=new TouchManager();}
		]);
		return TouchManager;
	})()


	//class laya.filters.Filter
	var Filter=(function(){
		function Filter(){
			this._action=null;
		}

		__class(Filter,'laya.filters.Filter');
		var __proto=Filter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		/**@private */
		__proto.callNative=function(sp){}
		/**@private 滤镜类型。*/
		__getset(0,__proto,'type',function(){return-1});
		/**@private 滤镜动作。*/
		__getset(0,__proto,'action',function(){return this._action });
		Filter.BLUR=0x10;
		Filter.COLOR=0x20;
		Filter.GLOW=0x08;
		Filter._filterStart=null
		Filter._filterEnd=null
		Filter._EndTarget=null
		Filter._recycleScope=null
		Filter._filter=null
		Filter._useSrc=null
		Filter._endSrc=null
		Filter._useOut=null
		Filter._endOut=null
		return Filter;
	})()


	//class laya.filters.ColorFilterAction
	var ColorFilterAction=(function(){
		function ColorFilterAction(){
			this.data=null;
		}

		__class(ColorFilterAction,'laya.filters.ColorFilterAction');
		var __proto=ColorFilterAction.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterAction":true})
		/**
		*给指定的对象应用颜色滤镜。
		*@param srcCanvas 需要应用画布对象。
		*@return 应用了滤镜后的画布对象。
		*/
		__proto.apply=function(srcCanvas){
			var ctx=srcCanvas.ctx.ctx;
			var canvas=srcCanvas.ctx.ctx.canvas;
			if (canvas.width==0 || canvas.height==0)return canvas;
			var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
			var data=imgdata.data;
			var nData;
			for (var i=0,n=data.length;i < n;i+=4){
				nData=this.getColor(data[i],data[i+1],data[i+2],data[i+3]);
				if (data[i+3]==0)continue ;
				data[i]=nData[0];
				data[i+1]=nData[1];
				data[i+2]=nData[2];
				data[i+3]=nData[3];
			}
			ctx.putImageData(imgdata,0,0);
			return srcCanvas;
		}

		__proto.getColor=function(red,green,blue,alpha){
			var rst=[];
			if (this.data._mat && this.data._alpha){
				var mat=this.data._mat;
				var tempAlpha=this.data._alpha;
				rst[0]=mat[0] *red+mat[1] *green+mat[2] *blue+mat[3] *alpha+tempAlpha[0];
				rst[1]=mat[4] *red+mat[5] *green+mat[6] *blue+mat[7] *alpha+tempAlpha[1];
				rst[2]=mat[8] *red+mat[9] *green+mat[10] *blue+mat[11] *alpha+tempAlpha[2];
				rst[3]=mat[12] *red+mat[13] *green+mat[14] *blue+mat[15] *alpha+tempAlpha[3];
			}
			return rst;
		}

		return ColorFilterAction;
	})()


	//class laya.maths.Bezier
	var Bezier=(function(){
		function Bezier(){
			this._controlPoints=[new Point(),new Point(),new Point()];
			this._calFun=this.getPoint2;
		}

		__class(Bezier,'laya.maths.Bezier');
		var __proto=Bezier.prototype;
		/**@private */
		__proto._switchPoint=function(x,y){
			var tPoint=this._controlPoints.shift();
			tPoint.setTo(x,y);
			this._controlPoints.push(tPoint);
		}

		/**
		*计算二次贝塞尔点。
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint2=function(t,rst){
			var p1=this._controlPoints[0];
			var p2=this._controlPoints[1];
			var p3=this._controlPoints[2];
			var lineX=Math.pow((1-t),2)*p1.x+2 *t *(1-t)*p2.x+Math.pow(t,2)*p3.x;
			var lineY=Math.pow((1-t),2)*p1.y+2 *t *(1-t)*p2.y+Math.pow(t,2)*p3.y;
			rst.push(lineX,lineY);
		}

		/**
		*计算三次贝塞尔点
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint3=function(t,rst){
			var p1=this._controlPoints[0];
			var p2=this._controlPoints[1];
			var p3=this._controlPoints[2];
			var p4=this._controlPoints[3];
			var lineX=Math.pow((1-t),3)*p1.x+3 *p2.x *t *(1-t)*(1-t)+3 *p3.x *t *t *(1-t)+p4.x *Math.pow(t,3);
			var lineY=Math.pow((1-t),3)*p1.y+3 *p2.y *t *(1-t)*(1-t)+3 *p3.y *t *t *(1-t)+p4.y *Math.pow(t,3);
			rst.push(lineX,lineY);
		}

		/**
		*计算贝塞尔点序列
		*@param count
		*@param rst
		*
		*/
		__proto.insertPoints=function(count,rst){
			var i=NaN;
			count=count > 0 ? count :5;
			var dLen=NaN;
			dLen=1 / count;
			for (i=0;i <=1;i+=dLen){
				this._calFun(i,rst);
			}
		}

		/**
		*获取贝塞尔曲线上的点。
		*@param pList 控制点[x0,y0,x1,y1...]
		*@param inSertCount 每次曲线的插值数量
		*@return
		*
		*/
		__proto.getBezierPoints=function(pList,inSertCount,count){
			(inSertCount===void 0)&& (inSertCount=5);
			(count===void 0)&& (count=2);
			var i=0,len=0;
			len=pList.length;
			if (len < (count+1)*2)return [];
			var rst;
			rst=[];
			switch (count){
				case 2:
					this._calFun=this.getPoint2;
					break ;
				case 3:
					this._calFun=this.getPoint3;
					break ;
				default :
					return [];
				}
			while (this._controlPoints.length <=count){
				this._controlPoints.push(new Point());
			}
			for (i=0;i < count *2;i+=2){
				this._switchPoint(pList[i],pList[i+1]);
			}
			for (i=count *2;i < len;i+=2){
				this._switchPoint(pList[i],pList[i+1]);
				if ((i / 2)% count==0)
					this.insertPoints(inSertCount,rst);
			}
			return rst;
		}

		__static(Bezier,
		['I',function(){return this.I=new Bezier();}
		]);
		return Bezier;
	})()


	//class laya.maths.GrahamScan
	var GrahamScan=(function(){
		function GrahamScan(){};
		__class(GrahamScan,'laya.maths.GrahamScan');
		GrahamScan.multiply=function(p1,p2,p0){
			return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));
		}

		GrahamScan.dis=function(p1,p2){
			return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
		}

		GrahamScan._getPoints=function(count,tempUse,rst){
			(tempUse===void 0)&& (tempUse=false);
			if (!GrahamScan._mPointList)GrahamScan._mPointList=[];
			while (GrahamScan._mPointList.length < count)GrahamScan._mPointList.push(new Point());
			if (!rst)rst=[];
			rst.length=0;
			if (tempUse){
				GrahamScan.getFrom(rst,GrahamScan._mPointList,count);
				}else {
				GrahamScan.getFromR(rst,GrahamScan._mPointList,count);
			}
			return rst;
		}

		GrahamScan.getFrom=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src[i]);
			}
			return rst;
		}

		GrahamScan.getFromR=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src.pop());
			}
			return rst;
		}

		GrahamScan.pListToPointList=function(pList,tempUse){
			(tempUse===void 0)&& (tempUse=false);
			var i=0,len=pList.length / 2,rst=GrahamScan._getPoints(len,tempUse,GrahamScan._tempPointList);
			for (i=0;i < len;i++){
				rst[i].setTo(pList[i+i],pList[i+i+1]);
			}
			return rst;
		}

		GrahamScan.pointListToPlist=function(pointList){
			var i=0,len=pointList.length,rst=GrahamScan._temPList,tPoint;
			rst.length=0;
			for (i=0;i < len;i++){
				tPoint=pointList[i];
				rst.push(tPoint.x,tPoint.y);
			}
			return rst;
		}

		GrahamScan.scanPList=function(pList){
			return Utils.copyArray(pList,GrahamScan.pointListToPlist(GrahamScan.scan(GrahamScan.pListToPointList(pList,true))));
		}

		GrahamScan.scan=function(PointSet){
			var i=0,j=0,k=0,top=2,tmp,n=PointSet.length,ch;
			var _tmpDic={};
			var key;
			ch=GrahamScan._temArr;
			ch.length=0;
			n=PointSet.length;
			for (i=n-1;i >=0;i--){
				tmp=PointSet[i];
				key=tmp.x+"_"+tmp.y;
				if (!_tmpDic.hasOwnProperty(key)){
					_tmpDic[key]=true;
					ch.push(tmp);
				}
			}
			n=ch.length;
			Utils.copyArray(PointSet,ch);
			for (i=1;i < n;i++)
			if ((PointSet[i].y < PointSet[k].y)|| ((PointSet[i].y==PointSet[k].y)&& (PointSet[i].x < PointSet[k].x)))
				k=i;
			tmp=PointSet[0];
			PointSet[0]=PointSet[k];
			PointSet[k]=tmp;
			for (i=1;i < n-1;i++){
				k=i;
				for (j=i+1;j < n;j++)
				if ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])> 0)|| ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])==0)&& (GrahamScan.dis(PointSet[0],PointSet[j])< GrahamScan.dis(PointSet[0],PointSet[k]))))
					k=j;
				tmp=PointSet[i];
				PointSet[i]=PointSet[k];
				PointSet[k]=tmp;
			}
			ch=GrahamScan._temArr;
			ch.length=0;
			if (PointSet.length < 3){
				return Utils.copyArray(ch,PointSet);
			}
			ch.push(PointSet[0],PointSet[1],PointSet[2]);
			for (i=3;i < n;i++){
				while (ch.length >=2 && GrahamScan.multiply(PointSet[i],ch[ch.length-1],ch[ch.length-2])>=0)ch.pop();
				PointSet[i] && ch.push(PointSet[i]);
			}
			return ch;
		}

		GrahamScan._mPointList=null
		GrahamScan._tempPointList=[];
		GrahamScan._temPList=[];
		GrahamScan._temArr=[];
		return GrahamScan;
	})()


	//class laya.maths.MathUtil
	var MathUtil=(function(){
		function MathUtil(){};
		__class(MathUtil,'laya.maths.MathUtil');
		MathUtil.subtractVector3=function(l,r,o){
			o[0]=l[0]-r[0];
			o[1]=l[1]-r[1];
			o[2]=l[2]-r[2];
		}

		MathUtil.lerp=function(left,right,amount){
			return left *(1-amount)+right *amount;
		}

		MathUtil.scaleVector3=function(f,b,e){
			e[0]=f[0] *b;
			e[1]=f[1] *b;
			e[2]=f[2] *b;
		}

		MathUtil.lerpVector3=function(l,r,t,o){
			var ax=l[0],ay=l[1],az=l[2];
			o[0]=ax+t *(r[0]-ax);
			o[1]=ay+t *(r[1]-ay);
			o[2]=az+t *(r[2]-az);
		}

		MathUtil.lerpVector4=function(l,r,t,o){
			var ax=l[0],ay=l[1],az=l[2],aw=l[3];
			o[0]=ax+t *(r[0]-ax);
			o[1]=ay+t *(r[1]-ay);
			o[2]=az+t *(r[2]-az);
			o[3]=aw+t *(r[3]-aw);
		}

		MathUtil.slerpQuaternionArray=function(a,Offset1,b,Offset2,t,out,Offset3){
			var ax=a[Offset1+0],ay=a[Offset1+1],az=a[Offset1+2],aw=a[Offset1+3],bx=b[Offset2+0],by=b[Offset2+1],bz=b[Offset2+2],bw=b[Offset2+3];
			var omega,cosom,sinom,scale0,scale1;
			cosom=ax *bx+ay *by+az *bz+aw *bw;
			if (cosom < 0.0){
				cosom=-cosom;
				bx=-bx;
				by=-by;
				bz=-bz;
				bw=-bw;
			}
			if ((1.0-cosom)> 0.000001){
				omega=Math.acos(cosom);
				sinom=Math.sin(omega);
				scale0=Math.sin((1.0-t)*omega)/ sinom;
				scale1=Math.sin(t *omega)/ sinom;
				}else {
				scale0=1.0-t;
				scale1=t;
			}
			out[Offset3+0]=scale0 *ax+scale1 *bx;
			out[Offset3+1]=scale0 *ay+scale1 *by;
			out[Offset3+2]=scale0 *az+scale1 *bz;
			out[Offset3+3]=scale0 *aw+scale1 *bw;
			return out;
		}

		MathUtil.getRotation=function(x0,y0,x1,y1){
			return Math.atan2(y1-y0,x1-x0)/ Math.PI *180;
		}

		MathUtil.sortBigFirst=function(a,b){
			if (a==b)
				return 0;
			return b > a ? 1 :-1;
		}

		MathUtil.sortSmallFirst=function(a,b){
			if (a==b)
				return 0;
			return b > a ?-1 :1;
		}

		MathUtil.sortNumBigFirst=function(a,b){
			return parseFloat(b)-parseFloat(a);
		}

		MathUtil.sortNumSmallFirst=function(a,b){
			return parseFloat(a)-parseFloat(b);
		}

		MathUtil.sortByKey=function(key,bigFirst,forceNum){
			(bigFirst===void 0)&& (bigFirst=false);
			(forceNum===void 0)&& (forceNum=true);
			var _sortFun;
			if (bigFirst){
				_sortFun=forceNum ? MathUtil.sortNumBigFirst :MathUtil.sortBigFirst;
				}else {
				_sortFun=forceNum ? MathUtil.sortNumSmallFirst :MathUtil.sortSmallFirst;
			}
			return function (a,b){
				return _sortFun(a[key],b[key]);
			}
		}

		return MathUtil;
	})()


	//class laya.maths.Matrix
	var Matrix=(function(){
		function Matrix(a,b,c,d,tx,ty){
			//this.a=NaN;
			//this.b=NaN;
			//this.c=NaN;
			//this.d=NaN;
			//this.tx=NaN;
			//this.ty=NaN;
			this.inPool=false;
			this.bTransform=false;
			(a===void 0)&& (a=1);
			(b===void 0)&& (b=0);
			(c===void 0)&& (c=0);
			(d===void 0)&& (d=1);
			(tx===void 0)&& (tx=0);
			(ty===void 0)&& (ty=0);
			this.a=a;
			this.b=b;
			this.c=c;
			this.d=d;
			this.tx=tx;
			this.ty=ty;
			this._checkTransform();
		}

		__class(Matrix,'laya.maths.Matrix');
		var __proto=Matrix.prototype;
		/**
		*将本矩阵设置为单位矩阵。
		*@return 返回当前矩形。
		*/
		__proto.identity=function(){
			this.a=this.d=1;
			this.b=this.tx=this.ty=this.c=0;
			this.bTransform=false;
			return this;
		}

		/**@private*/
		__proto._checkTransform=function(){
			return this.bTransform=(this.a!==1 || this.b!==0 || this.c!==0 || this.d!==1);
		}

		/**
		*设置沿 x 、y 轴平移每个点的距离。
		*@param x 沿 x 轴平移每个点的距离。
		*@param y 沿 y 轴平移每个点的距离。
		*@return 返回对象本身
		*/
		__proto.setTranslate=function(x,y){
			this.tx=x;
			this.ty=y;
			return this;
		}

		/**
		*沿 x 和 y 轴平移矩阵，平移的变化量由 x 和 y 参数指定。
		*@param x 沿 x 轴向右移动的量（以像素为单位）。
		*@param y 沿 y 轴向下移动的量（以像素为单位）。
		*@return 返回此矩形对象。
		*/
		__proto.translate=function(x,y){
			this.tx+=x;
			this.ty+=y;
			return this;
		}

		/**
		*对矩阵应用缩放转换。
		*@param x 用于沿 x 轴缩放对象的乘数。
		*@param y 用于沿 y 轴缩放对象的乘数。
		*/
		__proto.scale=function(x,y){
			this.a *=x;
			this.d *=y;
			this.c *=x;
			this.b *=y;
			this.tx *=x;
			this.ty *=y;
			this.bTransform=true;
		}

		/**
		*对 Matrix 对象应用旋转转换。
		*@param angle 以弧度为单位的旋转角度。
		*/
		__proto.rotate=function(angle){
			var cos=Math.cos(angle);
			var sin=Math.sin(angle);
			var a1=this.a;
			var c1=this.c;
			var tx1=this.tx;
			this.a=a1 *cos-this.b *sin;
			this.b=a1 *sin+this.b *cos;
			this.c=c1 *cos-this.d *sin;
			this.d=c1 *sin+this.d *cos;
			this.tx=tx1 *cos-this.ty *sin;
			this.ty=tx1 *sin+this.ty *cos;
			this.bTransform=true;
		}

		/**
		*对 Matrix 对象应用倾斜转换。
		*@param x 沿着 X 轴的 2D 倾斜弧度。
		*@param y 沿着 Y 轴的 2D 倾斜弧度。
		*@return 当前 Matrix 对象。
		*/
		__proto.skew=function(x,y){
			var tanX=Math.tan(x);
			var tanY=Math.tan(y);
			var a1=this.a;
			var b1=this.b;
			this.a+=tanY *this.c;
			this.b+=tanY *this.d;
			this.c+=tanX *a1;
			this.d+=tanX *b1;
			return this;
		}

		/**
		*对指定的点应用当前矩阵的逆转化并返回此点。
		*@param out 待转化的点 Point 对象。
		*@return 返回out
		*/
		__proto.invertTransformPoint=function(out){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			var a2=d1 / n;
			var b2=-b1 / n;
			var c2=-c1 / n;
			var d2=a1 / n;
			var tx2=(c1 *this.ty-d1 *tx1)/ n;
			var ty2=-(a1 *this.ty-b1 *tx1)/ n;
			return out.setTo(a2 *out.x+c2 *out.y+tx2,b2 *out.x+d2 *out.y+ty2);
		}

		/**
		*将 Matrix 对象表示的几何转换应用于指定点。
		*@param out 用来设定输出结果的点。
		*@return 返回out
		*/
		__proto.transformPoint=function(out){
			return out.setTo(this.a *out.x+this.c *out.y+this.tx,this.b *out.x+this.d *out.y+this.ty);
		}

		/**
		*将 Matrix 对象表示的几何转换应用于指定点，忽略tx、ty。
		*@param out 用来设定输出结果的点。
		*@return 返回out
		*/
		__proto.transformPointN=function(out){
			return out.setTo(this.a *out.x+this.c *out.y ,this.b *out.x+this.d *out.y);
		}

		/**
		*@private
		*将 Matrix 对象表示的几何转换应用于指定点。
		*@param data 点集合。
		*@param out 存储应用转化的点的列表。
		*@return 返回out数组
		*/
		__proto.transformPointArray=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y+this.tx;
				out[i+1]=this.b *x+this.d *y+this.ty;
			}
			return out;
		}

		/**
		*@private
		*将 Matrix 对象表示的几何缩放转换应用于指定点。
		*@param data 点集合。
		*@param out 存储应用转化的点的列表。
		*@return 返回out数组
		*/
		__proto.transformPointArrayScale=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y;
				out[i+1]=this.b *x+this.d *y;
			}
			return out;
		}

		/**
		*获取 X 轴缩放值。
		*@return X 轴缩放值。
		*/
		__proto.getScaleX=function(){
			return this.b===0 ? this.a :Math.sqrt(this.a *this.a+this.b *this.b);
		}

		/**
		*获取 Y 轴缩放值。
		*@return Y 轴缩放值。
		*/
		__proto.getScaleY=function(){
			return this.c===0 ? this.d :Math.sqrt(this.c *this.c+this.d *this.d);
		}

		/**
		*执行原始矩阵的逆转换。
		*@return 当前矩阵对象。
		*/
		__proto.invert=function(){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			this.a=d1 / n;
			this.b=-b1 / n;
			this.c=-c1 / n;
			this.d=a1 / n;
			this.tx=(c1 *this.ty-d1 *tx1)/ n;
			this.ty=-(a1 *this.ty-b1 *tx1)/ n;
			return this;
		}

		/**
		*将 Matrix 的成员设置为指定值。
		*@param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
		*@param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
		*@param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
		*@param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
		*@param tx 沿 x 轴平移每个点的距离。
		*@param ty 沿 y 轴平移每个点的距离。
		*@return 当前矩阵对象。
		*/
		__proto.setTo=function(a,b,c,d,tx,ty){
			this.a=a,this.b=b,this.c=c,this.d=d,this.tx=tx,this.ty=ty;
			return this;
		}

		/**
		*将指定矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
		*@param matrix 要连接到源矩阵的矩阵。
		*@return 当前矩阵。
		*/
		__proto.concat=function(matrix){
			var a=this.a;
			var c=this.c;
			var tx=this.tx;
			this.a=a *matrix.a+this.b *matrix.c;
			this.b=a *matrix.b+this.b *matrix.d;
			this.c=c *matrix.a+this.d *matrix.c;
			this.d=c *matrix.b+this.d *matrix.d;
			this.tx=tx *matrix.a+this.ty *matrix.c+matrix.tx;
			this.ty=tx *matrix.b+this.ty *matrix.d+matrix.ty;
			return this;
		}

		/**
		*@private
		*对矩阵应用缩放转换。反向相乘
		*@param x 用于沿 x 轴缩放对象的乘数。
		*@param y 用于沿 y 轴缩放对象的乘数。
		*/
		__proto.scaleEx=function(x,y){
			var ba=this.a,bb=this.b,bc=this.c,bd=this.d;
			if (bb!==0 || bc!==0){
				this.a=x *ba;
				this.b=x *bb;
				this.c=y *bc;
				this.d=y *bd;
				}else {
				this.a=x *ba;
				this.b=0 *bd;
				this.c=0 *ba;
				this.d=y *bd;
			}
			this.bTransform=true;
		}

		/**
		*@private
		*对 Matrix 对象应用旋转转换。反向相乘
		*@param angle 以弧度为单位的旋转角度。
		*/
		__proto.rotateEx=function(angle){
			var cos=Math.cos(angle);
			var sin=Math.sin(angle);
			var ba=this.a,bb=this.b,bc=this.c,bd=this.d;
			if (bb!==0 || bc!==0){
				this.a=cos *ba+sin *bc;
				this.b=cos *bb+sin *bd;
				this.c=-sin *ba+cos *bc;
				this.d=-sin *bb+cos *bd;
				}else {
				this.a=cos *ba;
				this.b=sin *bd;
				this.c=-sin *ba;
				this.d=cos *bd;
			}
			this.bTransform=true;
		}

		/**
		*返回此 Matrix 对象的副本。
		*@return 与原始实例具有完全相同的属性的新 Matrix 实例。
		*/
		__proto.clone=function(){
			var no=Matrix._cache;
			var dec=!no._length ? (new Matrix()):no[--no._length];
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		/**
		*将当前 Matrix 对象中的所有矩阵数据复制到指定的 Matrix 对象中。
		*@param dec 要复制当前矩阵数据的 Matrix 对象。
		*@return 已复制当前矩阵数据的 Matrix 对象。
		*/
		__proto.copyTo=function(dec){
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		/**
		*返回列出该 Matrix 对象属性的文本值。
		*@return 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
		*/
		__proto.toString=function(){
			return this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty;
		}

		/**
		*销毁此对象。
		*/
		__proto.destroy=function(){
			if (this.inPool)return;
			var cache=Matrix._cache;
			this.inPool=true;
			cache._length || (cache._length=0);
			cache[cache._length++]=this;
			this.a=this.d=1;
			this.b=this.c=this.tx=this.ty=0;
			this.bTransform=false;
		}

		Matrix.mul=function(m1,m2,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			var ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mul16=function(m1,m2,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			var ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
			if (bb!==0 || bc!==0){
				out[0]=aa *ba+ab *bc;
				out[1]=aa *bb+ab *bd;
				out[4]=ac *ba+ad *bc;
				out[5]=ac *bb+ad *bd;
				out[12]=ba *atx+bc *aty+btx;
				out[13]=bb *atx+bd *aty+bty;
				}else {
				out[0]=aa *ba;
				out[1]=ab *bd;
				out[4]=ac *ba;
				out[5]=ad *bd;
				out[12]=ba *atx+btx;
				out[13]=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPre=function(m1,ba,bb,bc,bd,btx,bty,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPos=function(m1,aa,ab,ac,ad,atx,aty,out){
			var ba=m1.a,bb=m1.b,bc=m1.c,bd=m1.d,btx=m1.tx,bty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.preMul=function(parent,self,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			var na=self.a,nb=self.b,nc=self.c,nd=self.d,ntx=self.tx,nty=self.ty;
			out.a=na *pa;
			out.b=out.c=0;
			out.d=nd *pd;
			out.tx=ntx *pa+parent.tx;
			out.ty=nty *pd+parent.ty;
			if (nb!==0 || nc!==0 || pb!==0 || pc!==0){
				out.a+=nb *pc;
				out.d+=nc *pb;
				out.b+=na *pb+nb *pd;
				out.c+=nc *pa+nd *pc;
				out.tx+=nty *pc;
				out.ty+=ntx *pb;
			}
			return out;
		}

		Matrix.preMulXY=function(parent,x,y,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			out.a=pa;
			out.b=pb;
			out.c=pc;
			out.d=pd;
			out.tx=x *pa+parent.tx+y *pc;
			out.ty=y *pd+parent.ty+x *pb;
			return out;
		}

		Matrix.create=function(){
			var cache=Matrix._cache;
			var mat=!cache._length ? (new Matrix()):cache[--cache._length];
			mat.inPool=false;
			return mat;
		}

		Matrix.EMPTY=new Matrix();
		Matrix.TEMP=new Matrix();
		Matrix._cache=[];
		return Matrix;
	})()


	//class laya.maths.Point
	var Point=(function(){
		function Point(x,y){
			//this.x=NaN;
			//this.y=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			this.x=x;
			this.y=y;
		}

		__class(Point,'laya.maths.Point');
		var __proto=Point.prototype;
		/**
		*将 <code>Point</code> 的成员设置为指定值。
		*@param x 水平坐标。
		*@param y 垂直坐标。
		*@return 当前 Point 对象。
		*/
		__proto.setTo=function(x,y){
			this.x=x;
			this.y=y;
			return this;
		}

		/**
		*计算当前点和目标点(x，y)的距离。
		*@param x 水平坐标。
		*@param y 垂直坐标。
		*@return 返回当前点和目标点之间的距离。
		*/
		__proto.distance=function(x,y){
			return Math.sqrt((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y));
		}

		/**返回包含 x 和 y 坐标的值的字符串。*/
		__proto.toString=function(){
			return this.x+","+this.y;
		}

		/**
		*标准化向量。
		*/
		__proto.normalize=function(){
			var d=Math.sqrt(this.x *this.x+this.y *this.y);
			if (d > 0){
				var id=1.0 / d;
				this.x *=id;
				this.y *=id;
			}
		}

		Point.TEMP=new Point();
		Point.EMPTY=new Point();
		return Point;
	})()


	//class laya.maths.Rectangle
	var Rectangle=(function(){
		function Rectangle(x,y,width,height){
			//this.x=NaN;
			//this.y=NaN;
			//this.width=NaN;
			//this.height=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
		}

		__class(Rectangle,'laya.maths.Rectangle');
		var __proto=Rectangle.prototype;
		/**
		*将 Rectangle 的属性设置为指定值。
		*@param x x 矩形左上角的 X 轴坐标。
		*@param y x 矩形左上角的 Y 轴坐标。
		*@param width 矩形的宽度。
		*@param height 矩形的高。
		*@return 返回属性值修改后的矩形对象本身。
		*/
		__proto.setTo=function(x,y,width,height){
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*复制 source 对象的属性值到此矩形对象中。
		*@param sourceRect 源 Rectangle 对象。
		*@return 返回属性值修改后的矩形对象本身。
		*/
		__proto.copyFrom=function(source){
			this.x=source.x;
			this.y=source.y;
			this.width=source.width;
			this.height=source.height;
			return this;
		}

		/**
		*确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
		*@param x 点的 X 轴坐标值（水平位置）。
		*@param y 点的 Y 轴坐标值（垂直位置）。
		*@return 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
		*/
		__proto.contains=function(x,y){
			if (this.width <=0 || this.height <=0)return false;
			if (x >=this.x && x < this.right){
				if (y >=this.y && y < this.bottom){
					return true;
				}
			}
			return false;
		}

		/**
		*确定在 rect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
		*@param rect Rectangle 对象。
		*@return 如果传入的矩形对象与此对象相交，则返回 true 值，否则返回 false。
		*/
		__proto.intersects=function(rect){
			return !(rect.x > (this.x+this.width)|| (rect.x+rect.width)< this.x || rect.y > (this.y+this.height)|| (rect.y+rect.height)< this.y);
		}

		/**
		*如果在 rect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，则此方法返回null。
		*@param rect 待比较的矩形区域。
		*@param out （可选）待输出的矩形区域。如果为空则创建一个新的。建议：尽量复用对象，减少对象创建消耗。
		*@return 返回相交的矩形区域对象。
		*/
		__proto.intersection=function(rect,out){
			if (!this.intersects(rect))return null;
			out || (out=new Rectangle());
			out.x=Math.max(this.x,rect.x);
			out.y=Math.max(this.y,rect.y);
			out.width=Math.min(this.right,rect.right)-out.x;
			out.height=Math.min(this.bottom,rect.bottom)-out.y;
			return out;
		}

		/**
		*<p>矩形联合，通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。</p>
		*<p>注意：union()方法忽略高度或宽度值为 0 的矩形，如：var rect2:Rectangle=new Rectangle(300,300,50,0);</p>
		*@param 要添加到此 Rectangle 对象的 Rectangle 对象。
		*@param out 用于存储输出结果的矩形对象。如果为空，则创建一个新的。建议：尽量复用对象，减少对象创建消耗。Rectangle.TEMP对象用于对象复用。
		*@return 充当两个矩形的联合的新 Rectangle 对象。
		*/
		__proto.union=function(source,out){
			out || (out=new Rectangle());
			this.clone(out);
			if (source.width <=0 || source.height <=0)return out;
			out.addPoint(source.x,source.y);
			out.addPoint(source.right,source.bottom);
			return this;
		}

		/**
		*返回一个 Rectangle 对象，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
		*@param out （可选）用于存储结果的矩形对象。如果为空，则创建一个新的。建议：尽量复用对象，减少对象创建消耗。。Rectangle.TEMP对象用于对象复用。
		*@return Rectangle 对象，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
		*/
		__proto.clone=function(out){
			out || (out=new Rectangle());
			out.x=this.x;
			out.y=this.y;
			out.width=this.width;
			out.height=this.height;
			return out;
		}

		/**
		*当前 Rectangle 对象的水平位置 x 和垂直位置 y 以及高度 width 和宽度 height 以逗号连接成的字符串。
		*/
		__proto.toString=function(){
			return this.x+","+this.y+","+this.width+","+this.height;
		}

		/**
		*检测传入的 Rectangle 对象的属性是否与当前 Rectangle 对象的属性 x、y、width、height 属性值都相等。
		*@param rect 待比较的 Rectangle 对象。
		*@return 如果判断的属性都相等，则返回 true ,否则返回 false。
		*/
		__proto.equals=function(rect){
			if (!rect || rect.x!==this.x || rect.y!==this.y || rect.width!==this.width || rect.height!==this.height)return false;
			return true;
		}

		/**
		*<p>为当前矩形对象加一个点，以使当前矩形扩展为包含当前矩形和此点的最小矩形。</p>
		*<p>此方法会修改本对象。</p>
		*@param x 点的 X 坐标。
		*@param y 点的 Y 坐标。
		*@return 返回此 Rectangle 对象。
		*/
		__proto.addPoint=function(x,y){
			this.x > x && (this.width+=this.x-x,this.x=x);
			this.y > y && (this.height+=this.y-y,this.y=y);
			if (this.width < x-this.x)this.width=x-this.x;
			if (this.height < y-this.y)this.height=y-this.y;
			return this;
		}

		/**
		*@private
		*返回代表当前矩形的顶点数据。
		*@return 顶点数据。
		*/
		__proto._getBoundPoints=function(){
			var rst=Rectangle._temB;
			rst.length=0;
			if (this.width==0 || this.height==0)return rst;
			rst.push(this.x,this.y,this.x+this.width,this.y,this.x,this.y+this.height,this.x+this.width,this.y+this.height);
			return rst;
		}

		/**
		*确定此 Rectangle 对象是否为空。
		*@return 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
		*/
		__proto.isEmpty=function(){
			if (this.width <=0 || this.height <=0)return true;
			return false;
		}

		/**此矩形右侧的 X 轴坐标。 x 和 width 属性的和。*/
		__getset(0,__proto,'right',function(){
			return this.x+this.width;
		});

		/**此矩形底端的 Y 轴坐标。y 和 height 属性的和。*/
		__getset(0,__proto,'bottom',function(){
			return this.y+this.height;
		});

		Rectangle._getBoundPointS=function(x,y,width,height){
			var rst=Rectangle._temA;
			rst.length=0;
			if (width==0 || height==0)return rst;
			rst.push(x,y,x+width,y,x,y+height,x+width,y+height);
			return rst;
		}

		Rectangle._getWrapRec=function(pointList,rst){
			if (!pointList || pointList.length < 1)return rst ? rst.setTo(0,0,0,0):Rectangle.TEMP.setTo(0,0,0,0);
			rst=rst ? rst :new Rectangle();
			var i,len=pointList.length,minX,maxX,minY,maxY,tPoint=Point.TEMP;
			minX=minY=99999;
			maxX=maxY=-minX;
			for (i=0;i < len;i+=2){
				tPoint.x=pointList[i];
				tPoint.y=pointList[i+1];
				minX=minX < tPoint.x ? minX :tPoint.x;
				minY=minY < tPoint.y ? minY :tPoint.y;
				maxX=maxX > tPoint.x ? maxX :tPoint.x;
				maxY=maxY > tPoint.y ? maxY :tPoint.y;
			}
			return rst.setTo(minX,minY,maxX-minX,maxY-minY);
		}

		Rectangle.EMPTY=new Rectangle();
		Rectangle.TEMP=new Rectangle();
		Rectangle._temB=[];
		Rectangle._temA=[];
		return Rectangle;
	})()


	//class laya.media.SoundManager
	var SoundManager=(function(){
		function SoundManager(){};
		__class(SoundManager,'laya.media.SoundManager');
		/**
		*失去焦点后是否自动停止背景音乐。
		*@param v Boolean 失去焦点后是否自动停止背景音乐。
		*
		*/
		/**
		*失去焦点后是否自动停止背景音乐。
		*/
		__getset(1,SoundManager,'autoStopMusic',function(){
			return SoundManager._autoStopMusic;
			},function(v){
			Laya.stage.off("blur",null,SoundManager._stageOnBlur);
			Laya.stage.off("focus",null,SoundManager._stageOnFocus);
			Laya.stage.off("visibilitychange",null,SoundManager._visibilityChange);
			SoundManager._autoStopMusic=v;
			if (v){
				Laya.stage.on("blur",null,SoundManager._stageOnBlur);
				Laya.stage.on("focus",null,SoundManager._stageOnFocus);
				Laya.stage.on("visibilitychange",null,SoundManager._visibilityChange);
			}
		});

		/**
		*背景音乐和所有音效是否静音。
		*/
		__getset(1,SoundManager,'muted',function(){
			return SoundManager._muted;
			},function(value){
			if (value){
				SoundManager.stopAllSound();
			}
			SoundManager.musicMuted=value;
			SoundManager._muted=value;
		});

		/**
		*背景音乐（不包括音效）是否静音。
		*/
		__getset(1,SoundManager,'musicMuted',function(){
			return SoundManager._musicMuted;
			},function(value){
			if (value){
				if (SoundManager._tMusic)
					SoundManager.stopSound(SoundManager._tMusic);
				SoundManager._musicMuted=value;
				}else {
				SoundManager._musicMuted=value;
				if (SoundManager._tMusic){
					SoundManager.playMusic(SoundManager._tMusic);
				}
			}
		});

		/**
		*所有音效（不包括背景音乐）是否静音。
		*/
		__getset(1,SoundManager,'soundMuted',function(){
			return SoundManager._soundMuted;
			},function(value){
			SoundManager._soundMuted=value;
		});

		SoundManager.addChannel=function(channel){
			if (SoundManager._channels.indexOf(channel)>=0)return;
			SoundManager._channels.push(channel);
		}

		SoundManager.removeChannel=function(channel){
			var i=0;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				if (SoundManager._channels[i]==channel){
					SoundManager._channels.splice(i,1);
				}
			}
		}

		SoundManager._visibilityChange=function(){
			if (Laya.stage.isVisibility){
				SoundManager._stageOnFocus();
				}else {
				SoundManager._stageOnBlur();
			}
		}

		SoundManager._stageOnBlur=function(){
			SoundManager._isActive=false;
			if (SoundManager._musicChannel){
				if (!SoundManager._musicChannel.isStopped){
					SoundManager._blurPaused=true;
					SoundManager._musicLoops=SoundManager._musicChannel.loops;
					SoundManager._musicCompleteHandler=SoundManager._musicChannel.completeHandler;
					SoundManager._musicPosition=SoundManager._musicChannel.position;
					SoundManager._musicChannel.stop();
					Laya.stage.once("mousedown",null,SoundManager._stageOnFocus);
				}
			}
			SoundManager.stopAllSound();
		}

		SoundManager._stageOnFocus=function(){
			SoundManager._isActive=true;
			Laya.stage.off("mousedown",null,SoundManager._stageOnFocus);
			if (SoundManager._blurPaused){
				if (SoundManager._tMusic){
					SoundManager.playMusic(SoundManager._tMusic,SoundManager._musicLoops,SoundManager._musicCompleteHandler,SoundManager._musicPosition);
				}
				SoundManager._blurPaused=false;
			}
		}

		SoundManager.playSound=function(url,loops,complete,soundClass,startTime){
			(loops===void 0)&& (loops=1);
			(startTime===void 0)&& (startTime=0);
			if (!SoundManager._isActive)return null;
			if (SoundManager._muted)return null;
			url=URL.formatURL(url);
			if (url==SoundManager._tMusic){
				if (SoundManager._musicMuted)return null;
				}else {
				if (Render.isConchApp){
					var ext=Utils.getFileExtension(url);
					if (ext !="wav" && ext !="ogg"){
						alert("The sound only supports wav or ogg format,for optimal performance reason,please refer to the official website document.");
						return null;
					}
				}
				if (SoundManager._soundMuted)return null;
			};
			var tSound=Laya.loader.getRes(url);
			if (!soundClass)soundClass=SoundManager._soundClass;
			if (!tSound){
				tSound=new soundClass();
				tSound.load(url);
				Loader.cacheRes(url,tSound);
			};
			var channel;
			channel=tSound.play(startTime,loops);
			channel.url=url;
			channel.volume=(url==SoundManager._tMusic)? SoundManager.musicVolume :SoundManager.soundVolume;
			channel.completeHandler=complete;
			return channel;
		}

		SoundManager.destroySound=function(url){
			var tSound=Laya.loader.getRes(url);
			if (tSound){
				Loader.clearRes(url);
				tSound.dispose();
			}
		}

		SoundManager.playMusic=function(url,loops,complete,startTime){
			(loops===void 0)&& (loops=0);
			(startTime===void 0)&& (startTime=0);
			url=URL.formatURL(url);
			SoundManager._tMusic=url;
			if (SoundManager._musicChannel)SoundManager._musicChannel.stop();
			return SoundManager._musicChannel=SoundManager.playSound(url,loops,complete,null,startTime);
		}

		SoundManager.stopSound=function(url){
			url=URL.formatURL(url);
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.stop();
				}
			}
		}

		SoundManager.stopAll=function(){
			SoundManager._tMusic=null;
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				channel.stop();
			}
		}

		SoundManager.stopAllSound=function(){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url !=SoundManager._tMusic){
					channel.stop();
				}
			}
		}

		SoundManager.stopMusic=function(){
			SoundManager._tMusic=null;
			if (SoundManager._musicChannel)SoundManager._musicChannel.stop();
		}

		SoundManager.setSoundVolume=function(volume,url){
			if (url){
				url=URL.formatURL(url);
				SoundManager._setVolume(url,volume);
				}else {
				SoundManager.soundVolume=volume;
				var i=0;
				var channel;
				for (i=SoundManager._channels.length-1;i >=0;i--){
					channel=SoundManager._channels[i];
					if (channel.url !=SoundManager._tMusic){
						channel.volume=volume;
					}
				}
			}
		}

		SoundManager.setMusicVolume=function(volume){
			SoundManager.musicVolume=volume;
			SoundManager._setVolume(SoundManager._tMusic,volume);
		}

		SoundManager._setVolume=function(url,volume){
			url=URL.formatURL(url);
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.volume=volume;
				}
			}
		}

		SoundManager.musicVolume=1;
		SoundManager.soundVolume=1;
		SoundManager.playbackRate=1;
		SoundManager._muted=false;
		SoundManager._soundMuted=false;
		SoundManager._musicMuted=false;
		SoundManager._tMusic=null;
		SoundManager._musicChannel=null;
		SoundManager._channels=[];
		SoundManager._autoStopMusic=false;
		SoundManager._blurPaused=false;
		SoundManager._isActive=true;
		SoundManager._musicLoops=0;
		SoundManager._musicPosition=0;
		SoundManager._musicCompleteHandler=null;
		SoundManager._soundClass=null
		return SoundManager;
	})()


	//class laya.net.LocalStorage
	var LocalStorage=(function(){
		var Storage;
		function LocalStorage(){};
		__class(LocalStorage,'laya.net.LocalStorage');
		LocalStorage.__init__=function(){
			if (!LocalStorage._baseClass){
				LocalStorage._baseClass=Storage;
				Storage.init();
			}
			LocalStorage.items=LocalStorage._baseClass.items;
			LocalStorage.support=LocalStorage._baseClass.support;
		}

		LocalStorage.setItem=function(key,value){
			LocalStorage._baseClass.setItem(key,value);
		}

		LocalStorage.getItem=function(key){
			return LocalStorage._baseClass.getItem(key);
		}

		LocalStorage.setJSON=function(key,value){
			LocalStorage._baseClass.setJSON(key,value);
		}

		LocalStorage.getJSON=function(key){
			return LocalStorage._baseClass.getJSON(key);
		}

		LocalStorage.removeItem=function(key){
			LocalStorage._baseClass.removeItem(key);
		}

		LocalStorage.clear=function(){
			LocalStorage._baseClass.clear();
		}

		LocalStorage._baseClass=null
		LocalStorage.items=null
		LocalStorage.support=false;
		LocalStorage.__init$=function(){
			//class Storage
			Storage=(function(){
				function Storage(){};
				__class(Storage,'');
				Storage.init=function(){
					try{Storage.items=window.localStorage;Storage.setItem('laya','1');Storage.removeItem('laya');Storage.support=true;}catch(e){}if(!Storage.support)console.log('LocalStorage is not supprot or browser is private mode.');
				}
				Storage.setItem=function(key,value){
					try {
						Storage.support && Storage.items.setItem(key,value);
						}catch (e){
						console.warn("set localStorage failed",e);
					}
				}
				Storage.getItem=function(key){
					return Storage.support ? Storage.items.getItem(key):null;
				}
				Storage.setJSON=function(key,value){
					try {
						Storage.support && Storage.items.setItem(key,JSON.stringify(value));
						}catch (e){
						console.warn("set localStorage failed",e);
					}
				}
				Storage.getJSON=function(key){
					return JSON.parse(Storage.support ? Storage.items.getItem(key):null);
				}
				Storage.removeItem=function(key){
					Storage.support && Storage.items.removeItem(key);
				}
				Storage.clear=function(){
					Storage.support && Storage.items.clear();
				}
				Storage.items=null
				Storage.support=false;
				return Storage;
			})()
		}

		return LocalStorage;
	})()


	//class laya.net.URL
	var URL=(function(){
		function URL(url){
			this._url=null;
			this._path=null;
			this._url=URL.formatURL(url);
			this._path=URL.getPath(url);
		}

		__class(URL,'laya.net.URL');
		var __proto=URL.prototype;
		/**地址的路径。*/
		__getset(0,__proto,'path',function(){
			return this._path;
		});

		/**格式化后的地址。*/
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		URL.formatURL=function(url,base){
			if (!url)return "null path";
			if (url.indexOf(":")> 0)return url;
			if (URL.customFormat !=null)url=URL.customFormat(url,base);
			var char1=url.charAt(0);
			if (char1==="."){
				return URL.formatRelativePath((base || URL.basePath)+url);
				}else if (char1==='~'){
				return URL.rootPath+url.substring(1);
				}else if (char1==="d"){
				if (url.indexOf("data:image")===0)return url;
				}else if (char1==="/"){
				return url;
			}
			return (base || URL.basePath)+url;
		}

		URL.formatRelativePath=function(value){
			var parts=value.split("/");
			for (var i=0,len=parts.length;i < len;i++){
				if (parts[i]=='..'){
					parts.splice(i-1,2);
					i-=2;
				}
			}
			return parts.join('/');
		}

		URL.isAbsolute=function(url){
			return url.indexOf(":")> 0 || url.charAt(0)=='/';
		}

		URL.getPath=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(0,ofs+1):"";
		}

		URL.getFileName=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(ofs+1):url;
		}

		URL.version={};
		URL.basePath="";
		URL.rootPath="";
		URL.customFormat=function(url){
			var newUrl=URL.version[url];
			if (!Render.isConchApp && newUrl)url+="?v="+newUrl;
			return url;
		}

		return URL;
	})()


	//class laya.renders.Render
	var Render=(function(){
		function Render(width,height){
			this._timeId=0;
			var style=Render._mainCanvas.source.style;
			style.position='absolute';
			style.top=style.left="0px";
			style.background="#000000";
			Render._mainCanvas.source.id="layaCanvas";
			var isWebGl=laya.renders.Render.isWebGL;
			Render._mainCanvas.source.width=width;
			Render._mainCanvas.source.height=height;
			isWebGl && Render.WebGL.init(Render._mainCanvas,width,height);
			Browser.container.appendChild(Render._mainCanvas.source);
			Render._context=new RenderContext(width,height,isWebGl ? null :Render._mainCanvas);
			Render._context.ctx.setIsMainContext();
			Browser.window.requestAnimationFrame(loop);
			function loop (){
				Laya.stage._loop();
				Browser.window.requestAnimationFrame(loop);
			}
			Laya.stage.on("visibilitychange",this,this._onVisibilitychange);
		}

		__class(Render,'laya.renders.Render');
		var __proto=Render.prototype;
		/**@private */
		__proto._onVisibilitychange=function(){
			if (!Laya.stage.isVisibility){
				this._timeId=Browser.window.setInterval(this._enterFrame,1000);
				}else if (this._timeId !=0){
				Browser.window.clearInterval(this._timeId);
			}
		}

		/**@private */
		__proto._enterFrame=function(e){
			Laya.stage._loop();
		}

		/**目前使用的渲染器。*/
		__getset(1,Render,'context',function(){
			return Render._context;
		});

		/**渲染使用的原生画布引用。 */
		__getset(1,Render,'canvas',function(){
			return Render._mainCanvas.source;
		});

		Render._context=null
		Render._mainCanvas=null
		Render.WebGL=null
		Render.isConchNode=false;
		Render.isConchApp=false;
		Render.isConchWebGL=false;
		Render.isWebGL=false;
		Render.is3DMode=false;
		Render.optimizeTextureMemory=function(url,texture){
			return true;
		}

		Render.__init$=function(){
			window.ConchRenderType=window.ConchRenderType||1;
			window.ConchRenderType|=(!window.conch?0:0x04);;{
				Render.isConchNode=(window.ConchRenderType & 5)==5;
				Render.isConchApp=(window.ConchRenderType & 0x04)==0x04;
				Render.isConchWebGL=window.ConchRenderType==6;
			};;
		}

		return Render;
	})()


	//class laya.renders.RenderContext
	var RenderContext=(function(){
		function RenderContext(width,height,canvas){
			this.x=0;
			this.y=0;
			//this.canvas=null;
			//this.ctx=null;
			this._drawTexture=function(x,y,args){
				if (args[0].loaded)this.ctx.drawTexture(args[0],args[1],args[2],args[3],args[4],x,y);
			}
			this._fillTexture=function(x,y,args){
				if (args[0].loaded)this.ctx.fillTexture(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
			}
			this._drawTextureWithTransform=function(x,y,args){
				if (args[0].loaded)this.ctx.drawTextureWithTransform(args[0],args[1],args[2],args[3],args[4],args[5],x,y,args[6]);
			}
			this._fillQuadrangle=function(x,y,args){
				this.ctx.fillQuadrangle(args[0],args[1],args[2],args[3],args[4]);
			}
			this._drawRect=function(x,y,args){
				var ctx=this.ctx;
				if (args[4] !=null){
					ctx.fillStyle=args[4];
					ctx.fillRect(x+args[0],y+args[1],args[2],args[3],null);
				}
				if (args[5] !=null){
					ctx.strokeStyle=args[5];
					ctx.lineWidth=args[6];
					ctx.strokeRect(x+args[0],y+args[1],args[2],args[3],args[6]);
				}
			}
			this._drawPie=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[8]);
				ctx.beginPath();
				if (Render.isWebGL){
					ctx.movePath(args[0]+x,args[1]+y);
					ctx.moveTo(0,0);
					}else {
					ctx.moveTo(x+args[0],y+args[1]);
				}
				ctx.arc(x+args[0],y+args[1],args[2],args[3],args[4]);
				ctx.closePath();
				this._fillAndStroke(args[5],args[6],args[7],true);
			}
			this._clipRect=function(x,y,args){
				this.ctx.clipRect(x+args[0],y+args[1],args[2],args[3]);
			}
			this._fillRect=function(x,y,args){
				this.ctx.fillRect(x+args[0],y+args[1],args[2],args[3],args[4]);
			}
			this._drawCircle=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[6]);
				Stat.drawCall++;
				ctx.beginPath();
				Render.isWebGL && ctx.movePath(args[0]+x,args[1]+y);
				ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
				ctx.closePath();
				this._fillAndStroke(args[3],args[4],args[5],true);
			}
			this._fillCircle=function(x,y,args){
				Stat.drawCall++;
				var ctx=this.ctx;
				ctx.beginPath();
				ctx.fillStyle=args[3];
				ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
				ctx.fill();
			}
			this._setShader=function(x,y,args){
				this.ctx.setShader(args[0]);
			}
			this._drawLine=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[6]);
				ctx.beginPath();
				ctx.strokeStyle=args[4];
				ctx.lineWidth=args[5];
				if (Render.isWebGL){
					ctx.movePath(x,y);
					ctx.moveTo(args[0],args[1]);
					ctx.lineTo(args[2],args[3]);
					}else {
					ctx.moveTo(x+args[0],y+args[1]);
					ctx.lineTo(x+args[2],y+args[3]);
				}
				ctx.stroke();
			}
			this._drawLines=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[5]);
				ctx.beginPath();
				x+=args[0],y+=args[1];
				Render.isWebGL && ctx.movePath(x,y);
				ctx.strokeStyle=args[3];
				ctx.lineWidth=args[4];
				var points=args[2];
				var i=2,n=points.length;
				if (Render.isWebGL){
					ctx.moveTo(points[0],points[1]);
					while (i < n){
						ctx.lineTo(points[i++],points[i++]);
					}
					}else {
					ctx.moveTo(x+points[0],y+points[1]);
					while (i < n){
						ctx.lineTo(x+points[i++],y+points[i++]);
					}
				}
				ctx.stroke();
			}
			this._drawLinesWebGL=function(x,y,args){
				this.ctx.drawLines(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4]);
			}
			this._drawCurves=function(x,y,args){
				this.ctx.drawCurves(x,y,args);
			}
			this._draw=function(x,y,args){
				args[0].call(null,this,x,y);
			}
			this._transformByMatrix=function(x,y,args){
				this.ctx.transformByMatrix(args[0]);
			}
			this._setTransform=function(x,y,args){
				this.ctx.setTransform(args[0],args[1],args[2],args[3],args[4],args[5]);
			}
			this._setTransformByMatrix=function(x,y,args){
				this.ctx.setTransformByMatrix(args[0]);
			}
			this._save=function(x,y,args){
				this.ctx.save();
			}
			this._restore=function(x,y,args){
				this.ctx.restore();
			}
			this._translate=function(x,y,args){
				this.ctx.translate(args[0],args[1]);
			}
			this._transform=function(x,y,args){
				this.ctx.translate(args[1]+x,args[2]+y);
				var mat=args[0];
				this.ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
				this.ctx.translate(-x-args[1],-y-args[2]);
			}
			this._rotate=function(x,y,args){
				this.ctx.translate(args[1]+x,args[2]+y);
				this.ctx.rotate(args[0]);
				this.ctx.translate(-x-args[1],-y-args[2]);
			}
			this._scale=function(x,y,args){
				this.ctx.translate(args[2]+x,args[3]+y);
				this.ctx.scale(args[0],args[1]);
				this.ctx.translate(-x-args[2],-y-args[3]);
			}
			this._alpha=function(x,y,args){
				this.ctx.globalAlpha *=args[0];
			}
			this._setAlpha=function(x,y,args){
				this.ctx.globalAlpha=args[0];
			}
			this._fillText=function(x,y,args){
				this.ctx.fillText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5]);
			}
			this._strokeText=function(x,y,args){
				this.ctx.strokeText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6]);
			}
			this._fillBorderText=function(x,y,args){
				this.ctx.fillBorderText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
			}
			this._blendMode=function(x,y,args){
				this.ctx.globalCompositeOperation=args[0];
			}
			this._beginClip=function(x,y,args){
				this.ctx.beginClip && this.ctx.beginClip(x+args[0],y+args[1],args[2],args[3]);
			}
			this._setIBVB=function(x,y,args){
				this.ctx.setIBVB(args[0]+x,args[1]+y,args[2],args[3],args[4],args[5],args[6],args[7]);
			}
			this._fillTrangles=function(x,y,args){
				this.ctx.fillTrangles(args[0],args[1]+x,args[2]+y,args[3],args[4]);
			}
			this._drawPath=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(-1);
				ctx.beginPath();
				x+=args[0],y+=args[1];
				var paths=args[2];
				for (var i=0,n=paths.length;i < n;i++){
					var path=paths[i];
					switch (path[0]){
						case "moveTo":
							ctx.moveTo(x+path[1],y+path[2]);
							break ;
						case "lineTo":
							ctx.lineTo(x+path[1],y+path[2]);
							break ;
						case "arcTo":
							ctx.arcTo(x+path[1],y+path[2],x+path[3],y+path[4],path[5]);
							break ;
						case "closePath":
							ctx.closePath();
							break ;
						}
				};
				var brush=args[3];
				if (brush !=null){
					ctx.fillStyle=brush.fillStyle;
					ctx.fill();
				};
				var pen=args[4];
				if (pen !=null){
					ctx.strokeStyle=pen.strokeStyle;
					ctx.lineWidth=pen.lineWidth || 1;
					ctx.lineJoin=pen.lineJoin;
					ctx.lineCap=pen.lineCap;
					ctx.miterLimit=pen.miterLimit;
					ctx.stroke();
				}
			}
			this.drawPoly=function(x,y,args){
				this.ctx.drawPoly(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4],args[5],args[6]);
			}
			this._drawPoly=function(x,y,args){
				var ctx=this.ctx;
				var points=args[2];
				var i=2,n=points.length;
				if (Render.isWebGL){
					ctx.setPathId(args[6]);
					ctx.beginPath();
					x+=args[0],y+=args[1];
					ctx.movePath(x,y);
					ctx.moveTo(points[0],points[1]);
					while (i < n){
						ctx.lineTo(points[i++],points[i++]);
					}
					}else {
					ctx.beginPath();
					x+=args[0],y+=args[1];
					ctx.moveTo(x+points[0],y+points[1]);
					while (i < n){
						ctx.lineTo(x+points[i++],y+points[i++]);
					}
				}
				ctx.closePath();
				this._fillAndStroke(args[3],args[4],args[5],args[7]);
			}
			this._drawSkin=function(x,y,args){
				var tSprite=args[0];
				if (tSprite){
					var ctx=this.ctx;
					tSprite.render(ctx,x,y);
				}
			}
			this._drawParticle=function(x,y,args){
				this.ctx.drawParticle(x+this.x,y+this.y,args[0]);
			}
			if (canvas){
				this.ctx=canvas.getContext('2d');
				}else {
				canvas=HTMLCanvas.create("3D");
				this.ctx=RunDriver.createWebGLContext2D(canvas);
				canvas._setContext(this.ctx);
			}
			canvas.size(width,height);
			this.canvas=canvas;
		}

		__class(RenderContext,'laya.renders.RenderContext');
		var __proto=RenderContext.prototype;
		/**销毁当前渲染环境*/
		__proto.destroy=function(){
			if (this.canvas){
				this.canvas.destroy();
				this.canvas=null;
			}
			if (this.ctx){
				this.ctx.destroy();
				this.ctx=null;
			}
		}

		__proto.drawTexture=function(tex,x,y,width,height){
			if (tex.loaded)this.ctx.drawTexture(tex,x,y,width,height,this.x,this.y);
		}

		__proto._drawTextures=function(x,y,args){
			if (args[0].loaded)this.ctx.drawTextures(args[0],args[1],x+this.x,y+this.y);
		}

		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,alpha){
			if (tex.loaded)this.ctx.drawTextureWithTransform(tex,x,y,width,height,m,this.x,this.y,alpha);
		}

		__proto.fillQuadrangle=function(tex,x,y,point4,m){
			this.ctx.fillQuadrangle(tex,x,y,point4,m);
		}

		__proto.drawCanvas=function(canvas,x,y,width,height){
			this.ctx.drawCanvas(canvas,x+this.x,y+this.y,width,height);
		}

		__proto.drawRect=function(x,y,width,height,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.strokeRect(x+this.x,y+this.y,width,height,lineWidth);
		}

		__proto._fillAndStroke=function(fillColor,strokeColor,lineWidth,isConvexPolygon){
			(isConvexPolygon===void 0)&& (isConvexPolygon=false);
			var ctx=this.ctx;
			if (fillColor !=null){
				ctx.fillStyle=fillColor;
				if (Render.isWebGL){
					ctx.fill(isConvexPolygon);
					}else {
					ctx.fill();
				}
			}
			if (strokeColor !=null && lineWidth > 0){
				ctx.strokeStyle=strokeColor;
				ctx.lineWidth=lineWidth;
				ctx.stroke();
			}
		}

		//ctx.translate(-x-args[0],-y-args[1]);
		__proto.clipRect=function(x,y,width,height){
			this.ctx.clipRect(x+this.x,y+this.y,width,height);
		}

		__proto.fillRect=function(x,y,width,height,fillStyle){
			this.ctx.fillRect(x+this.x,y+this.y,width,height,fillStyle);
		}

		__proto.drawCircle=function(x,y,radius,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			Stat.drawCall++;
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.stroke();
		}

		__proto.fillCircle=function(x,y,radius,color){
			Stat.drawCall++;
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.fillStyle=color;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.fill();
		}

		__proto.setShader=function(shader){
			this.ctx.setShader(shader);
		}

		__proto.drawLine=function(fromX,fromY,toX,toY,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.moveTo(this.x+fromX,this.y+fromY);
			ctx.lineTo(this.x+toX,this.y+toY);
			ctx.stroke();
		}

		__proto.clear=function(){
			this.ctx.clear();
		}

		__proto.transformByMatrix=function(value){
			this.ctx.transformByMatrix(value);
		}

		__proto.setTransform=function(a,b,c,d,tx,ty){
			this.ctx.setTransform(a,b,c,d,tx,ty);
		}

		__proto.setTransformByMatrix=function(value){
			this.ctx.setTransformByMatrix(value);
		}

		__proto.save=function(){
			this.ctx.save();
		}

		__proto.restore=function(){
			this.ctx.restore();
		}

		__proto.translate=function(x,y){
			this.ctx.translate(x,y);
		}

		__proto.transform=function(a,b,c,d,tx,ty){
			this.ctx.transform(a,b,c,d,tx,ty);
		}

		__proto.rotate=function(angle){
			this.ctx.rotate(angle);
		}

		__proto.scale=function(scaleX,scaleY){
			this.ctx.scale(scaleX,scaleY);
		}

		__proto.alpha=function(value){
			this.ctx.globalAlpha *=value;
		}

		__proto.setAlpha=function(value){
			this.ctx.globalAlpha=value;
		}

		__proto.fillWords=function(words,x,y,font,color){
			this.ctx.fillWords(words,x,y,font,color);
		}

		/***@private */
		__proto.fillBorderWords=function(words,x,y,font,fillColor,borderColor,lineWidth){
			this.ctx.fillBorderWords(words,x,y,font,fillColor,borderColor,lineWidth);
		}

		__proto.fillText=function(text,x,y,font,color,textAlign){
			this.ctx.fillText(text,x+this.x,y+this.y,font,color,textAlign);
		}

		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this.ctx.strokeText(text,x+this.x,y+this.y,font,color,lineWidth,textAlign);
		}

		__proto.blendMode=function(type){
			this.ctx.globalCompositeOperation=type;
		}

		__proto.flush=function(){
			this.ctx.flush && this.ctx.flush();
		}

		__proto.addRenderObject=function(o){
			this.ctx.addRenderObject(o);
		}

		__proto.beginClip=function(x,y,w,h){
			this.ctx.beginClip && this.ctx.beginClip(x,y,w,h);
		}

		__proto.endClip=function(){
			this.ctx.endClip && this.ctx.endClip();
		}

		__proto.fillTrangles=function(x,y,args){
			this.ctx.fillTrangles(args[0],args[1],args[2],args[3],args.length > 4 ? args[4] :null);
		}

		RenderContext.PI2=2 *Math.PI;
		return RenderContext;
	})()


	//class laya.renders.RenderSprite
	var RenderSprite=(function(){
		function RenderSprite(type,next){
			//this._next=null;
			//this._fun=null;
			this._next=next || RenderSprite.NORENDER;
			switch (type){
				case 0:
					this._fun=this._no;
					return;
				case 0x01:
					this._fun=this._image;
					return;
				case 0x02:
					this._fun=this._alpha;
					return;
				case 0x04:
					this._fun=this._transform;
					return;
				case 0x08:
					this._fun=this._blend;
					return;
				case 0x10:
					this._fun=this._canvas;
					return;
				case 0x40:
					this._fun=this._mask;
					return;
				case 0x80:
					this._fun=this._clip;
					return;
				case 0x100:
					this._fun=this._style;
					return;
				case 0x200:
					this._fun=this._graphics;
					return;
				case 0x800:
					this._fun=this._childs;
					return;
				case 0x400:
					this._fun=this._custom;
					return;
				case 0x01 | 0x200:
					this._fun=this._image2;
					return;
				case 0x01 | 0x04 | 0x200:
					this._fun=this._image2;
					return;
				case 0x20:
					this._fun=Filter._filter;
					return;
				case 0x11111:
					this._fun=RenderSprite._initRenderFun;
					return;
				}
			this.onCreate(type);
		}

		__class(RenderSprite,'laya.renders.RenderSprite');
		var __proto=RenderSprite.prototype;
		__proto.onCreate=function(type){}
		__proto._style=function(sprite,context,x,y){
			sprite._style.render(sprite,context,x,y);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._no=function(sprite,context,x,y){}
		__proto._custom=function(sprite,context,x,y){
			sprite.customRender(context,x,y);
			var tf=sprite._style._tf;
			this._next._fun.call(this._next,sprite,context,x-tf.translateX,y-tf.translateY);
		}

		__proto._clip=function(sprite,context,x,y){
			var next=this._next;
			if (next==RenderSprite.NORENDER)return;
			var r=sprite._style.scrollRect;
			context.ctx.save();
			context.ctx.clipRect(x,y,r.width,r.height);
			next._fun.call(next,sprite,context,x-r.x,y-r.y);
			context.ctx.restore();
		}

		__proto._blend=function(sprite,context,x,y){
			var style=sprite._style;
			if (style.blendMode){
				context.ctx.globalCompositeOperation=style.blendMode;
			};
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
			context.ctx.globalCompositeOperation="source-over";
		}

		__proto._mask=function(sprite,context,x,y){
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
			var mask=sprite.mask;
			if (mask){
				context.ctx.globalCompositeOperation="destination-in";
				if (mask.numChildren > 0 || !mask.graphics._isOnlyOne()){
					mask.cacheAsBitmap=true;
				}
				mask.render(context,x-sprite.pivotX,y-sprite.pivotY);
			}
			context.ctx.globalCompositeOperation="source-over";
		}

		__proto._graphics=function(sprite,context,x,y){
			var tf=sprite._style._tf;
			sprite._graphics && sprite._graphics._render(sprite,context,x-tf.translateX,y-tf.translateY);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._image=function(sprite,context,x,y){
			var style=sprite._style;
			context.ctx.drawTexture2(x,y,style._tf.translateX,style._tf.translateY,sprite.transform,style.alpha,style.blendMode,sprite._graphics._one);
		}

		__proto._image2=function(sprite,context,x,y){
			var tf=sprite._style._tf;
			context.ctx.drawTexture2(x,y,tf.translateX,tf.translateY,sprite.transform,1,null,sprite._graphics._one);
		}

		__proto._alpha=function(sprite,context,x,y){
			var style=sprite._style;
			var alpha;
			if ((alpha=style.alpha)> 0.01 || sprite._needRepaint()){
				var temp=context.ctx.globalAlpha;
				context.ctx.globalAlpha *=alpha;
				var next=this._next;
				next._fun.call(next,sprite,context,x,y);
				context.ctx.globalAlpha=temp;
			}
		}

		__proto._transform=function(sprite,context,x,y){
			var transform=sprite.transform,_next=this._next;
			if (transform && _next !=RenderSprite.NORENDER){
				context.save();
				context.transform(transform.a,transform.b,transform.c,transform.d,transform.tx+x,transform.ty+y);
				_next._fun.call(_next,sprite,context,0,0);
				context.restore();
			}else
			_next._fun.call(_next,sprite,context,x,y);
		}

		__proto._childs=function(sprite,context,x,y){
			var style=sprite._style;
			x+=-style._tf.translateX+style.paddingLeft;
			y+=-style._tf.translateY+style.paddingTop;
			if (style._calculation){
				var words=sprite._getWords();
				if (words){
					var tStyle=style;
					if (tStyle){
						if (tStyle.stroke){
							context.fillBorderWords(words,x,y,tStyle.font,tStyle.color,tStyle.strokeColor,tStyle.stroke);
							}else{
							context.fillWords(words,x,y,tStyle.font,tStyle.color);
						}
					}
				}
			};
			var childs=sprite._childs,n=childs.length,ele;
			if (sprite.viewport || (sprite.optimizeScrollRect && sprite._style.scrollRect)){
				var rect=sprite.viewport || sprite._style.scrollRect;
				var left=rect.x;
				var top=rect.y;
				var right=rect.right;
				var bottom=rect.bottom;
				var _x=NaN,_y=NaN;
				for (i=0;i < n;++i){
					if ((ele=childs [i]).visible && ((_x=ele._x)< right && (_x+ele.width)> left && (_y=ele._y)< bottom && (_y+ele.height)> top)){
						ele.render(context,x,y);
					}
				}
				}else {
				for (var i=0;i < n;++i)
				(ele=(childs [i]))._style.visible && ele.render(context,x,y);
			}
		}

		__proto._canvas=function(sprite,context,x,y){
			var _cacheCanvas=sprite._$P.cacheCanvas;
			var _next=this._next;
			if (!_cacheCanvas){
				_next._fun.call(_next,sprite,tx,x,y);
				return;
			};
			var tx=_cacheCanvas.ctx;
			var _repaint=sprite._needRepaint()|| (!tx);
			var canvas;
			var left;
			var top;
			var tRec;
			_cacheCanvas.type==='bitmap' ? (Stat.canvasBitmap++):(Stat.canvasNormal++);
			if (_repaint){
				if (!_cacheCanvas._cacheRec)
					_cacheCanvas._cacheRec=new Rectangle();
				var w,h;
				if (!Render.isWebGL || _cacheCanvas.type==="bitmap"){
					tRec=sprite.getSelfBounds();
					tRec.x-=sprite.pivotX;
					tRec.y-=sprite.pivotY;
					tRec.x-=16;
					tRec.y-=16;
					tRec.width+=32;
					tRec.height+=32;
					tRec.x=Math.floor(tRec.x+x)-x;
					tRec.y=Math.floor(tRec.y+y)-y;
					tRec.width=Math.floor(tRec.width);
					tRec.height=Math.floor(tRec.height);
					_cacheCanvas._cacheRec.copyFrom(tRec);
					}else{
					_cacheCanvas._cacheRec.setTo(-sprite.pivotX,-sprite.pivotY,1,1);
				}
				tRec=_cacheCanvas._cacheRec;
				var scaleX=Render.isWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleX;
				var scaleY=Render.isWebGL ? 1 :Browser.pixelRatio *Laya.stage.clientScaleY;
				if (!Render.isWebGL){
					var chainScaleX=1;
					var chainScaleY=1;
					var tar;
					tar=sprite;
					while (tar && tar !=Laya.stage){
						chainScaleX *=tar.scaleX;
						chainScaleY *=tar.scaleY;
						tar=tar.parent;
					}
					if (Render.isWebGL){
						if (chainScaleX < 1)scaleX *=chainScaleX;
						if (chainScaleY < 1)scaleY *=chainScaleY;
						}else {
						if (chainScaleX > 1)scaleX *=chainScaleX;
						if (chainScaleY > 1)scaleY *=chainScaleY;
					}
				}
				w=tRec.width *scaleX;
				h=tRec.height *scaleY;
				left=tRec.x;
				top=tRec.y;
				if (Render.isWebGL && _cacheCanvas.type==='bitmap' && (w > 2048 || h > 2048)){
					console.warn("cache bitmap size larger than 2048,cache ignored");
					if (_cacheCanvas.ctx){
						Pool.recover("RenderContext",_cacheCanvas.ctx);
						_cacheCanvas.ctx.canvas.size(0,0);
						_cacheCanvas.ctx=null;
					}
					_next._fun.call(_next,sprite,context,x,y);
					return;
				}
				if (!tx){
					tx=_cacheCanvas.ctx=Pool.getItem("RenderContext")|| new RenderContext(w,h,HTMLCanvas.create("AUTO"));
				}
				tx.ctx.sprite=sprite;
				canvas=tx.canvas;
				canvas.clear();
				(canvas.width !=w || canvas.height !=h)&& canvas.size(w,h);
				if (_cacheCanvas.type==='bitmap')canvas.context.asBitmap=true;
				else if(_cacheCanvas.type==='normal')canvas.context.asBitmap=false;
				var t;
				if (scaleX !=1 || scaleY !=1){
					var ctx=(tx).ctx;
					ctx.save();
					ctx.scale(scaleX,scaleY);
					if (!Render.isConchWebGL && Render.isConchApp){
						t=sprite._$P.cf;
						t && ctx.setFilterMatrix && ctx.setFilterMatrix(t._mat,t._alpha);
					}
					_next._fun.call(_next,sprite,tx,-left,-top);
					ctx.restore();
					if (!Render.isConchApp || Render.isConchWebGL)sprite._applyFilters();
					}else {
					ctx=(tx).ctx;
					if (!Render.isConchWebGL && Render.isConchApp){
						t=sprite._$P.cf;
						t && ctx.setFilterMatrix && ctx.setFilterMatrix(t._mat,t._alpha);
					}
					_next._fun.call(_next,sprite,tx,-left,-top);
					if (!Render.isConchApp || Render.isConchWebGL)sprite._applyFilters();
				}
				if (sprite._$P.staticCache)_cacheCanvas.reCache=false;
				Stat.canvasReCache++;
				}else {
				tRec=_cacheCanvas._cacheRec;
				left=tRec.x;
				top=tRec.y;
				canvas=tx.canvas;
			}
			context.drawCanvas(canvas,x+left,y+top,tRec.width,tRec.height);
		}

		RenderSprite.__init__=function(){
			var i=0,len=0;
			var initRender;
			initRender=RunDriver.createRenderSprite(0x11111,null);
			len=RenderSprite.renders.length=0x800 *2;
			for (i=0;i < len;i++)
			RenderSprite.renders[i]=initRender;
			RenderSprite.renders[0]=RunDriver.createRenderSprite(0,null);
			function _initSame (value,o){
				var n=0;
				for (var i=0;i < value.length;i++){
					n |=value[i];
					RenderSprite.renders[n]=o;
				}
			}
			_initSame([0x01,0x200,0x04,0x02],new RenderSprite(0x01,null));
			RenderSprite.renders[0x01 | 0x200]=RunDriver.createRenderSprite(0x01 | 0x200,null);
			RenderSprite.renders[0x01 | 0x04 | 0x200]=new RenderSprite(0x01 | 0x04 | 0x200,null);
		}

		RenderSprite._initRenderFun=function(sprite,context,x,y){
			var type=sprite._renderType;
			var r=RenderSprite.renders[type]=RenderSprite._getTypeRender(type);
			r._fun(sprite,context,x,y);
		}

		RenderSprite._getTypeRender=function(type){
			var rst=null;
			var tType=0x800;
			while (tType > 1){
				if (tType & type)
					rst=RunDriver.createRenderSprite(tType,rst);
				tType=tType >> 1;
			}
			return rst;
		}

		RenderSprite.IMAGE=0x01;
		RenderSprite.ALPHA=0x02;
		RenderSprite.TRANSFORM=0x04;
		RenderSprite.BLEND=0x08;
		RenderSprite.CANVAS=0x10;
		RenderSprite.FILTERS=0x20;
		RenderSprite.MASK=0x40;
		RenderSprite.CLIP=0x80;
		RenderSprite.STYLE=0x100;
		RenderSprite.GRAPHICS=0x200;
		RenderSprite.CUSTOM=0x400;
		RenderSprite.CHILDS=0x800;
		RenderSprite.INIT=0x11111;
		RenderSprite.renders=[];
		RenderSprite.NORENDER=new RenderSprite(0,null);
		return RenderSprite;
	})()


	//class laya.resource.Context
	var Context=(function(){
		function Context(){
			//this._canvas=null;
			this._repaint=false;
		}

		__class(Context,'laya.resource.Context');
		var __proto=Context.prototype;
		__proto.setIsMainContext=function(){}
		__proto.drawTextures=function(tex,pos,tx,ty){
			Stat.drawCall+=pos.length / 2;
			var w=tex.width;
			var h=tex.height;
			for (var i=0,sz=pos.length;i < sz;i+=2){
				this.drawTexture(tex,pos[i],pos[i+1],w,h,tx,ty);
			}
		}

		/***@private */
		__proto.drawCanvas=function(canvas,x,y,width,height){
			Stat.drawCall++;
			this.drawImage(canvas.source,x,y,width,height);
		}

		/***@private */
		__proto.fillRect=function(x,y,width,height,style){
			Stat.drawCall++;
			style && (this.fillStyle=style);
			this.__fillRect(x,y,width,height);
		}

		/***@private */
		__proto.fillText=function(text,x,y,font,color,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				this.fillStyle=color;
				this.textAlign=textAlign;
				this.textBaseline="top";
			}
			this.__fillText(text,x,y);
		}

		/***@private */
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			Stat.drawCall++;
			this.font=font;
			this.fillStyle=fillColor;
			this.textBaseline="top";
			this.strokeStyle=borderColor;
			this.lineWidth=lineWidth;
			this.textAlign=textAlign;
			this.__strokeText(text,x,y);
			this.__fillText(text,x,y);
		}

		/***@private */
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				this.strokeStyle=color;
				this.lineWidth=lineWidth;
				this.textAlign=textAlign;
				this.textBaseline="top";
			}
			this.__strokeText(text,x,y);
		}

		/***@private */
		__proto.transformByMatrix=function(value){
			this.transform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.setTransformByMatrix=function(value){
			this.setTransform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.clipRect=function(x,y,width,height){
			Stat.drawCall++;
			this.beginPath();
			this.rect(x,y,width,height);
			this.clip();
		}

		/***@private */
		__proto.drawTexture=function(tex,x,y,width,height,tx,ty){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tx,y+ty,width,height);
		}

		/***@private */
		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,tx,ty,alpha){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.save();
			alpha !=1 && (this.globalAlpha *=alpha);
			if (m){
				this.transform(m.a,m.b,m.c,m.d,m.tx+tx,m.ty+ty);
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x ,y,width,height);
				}else {
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tx ,y+ty,width,height);
			}
			this.restore();
		}

		/***@private */
		__proto.drawTexture2=function(x,y,pivotX,pivotY,m,alpha,blendMode,args2){
			'use strict';
			var tex=args2[0];
			if (!(tex.loaded && tex.bitmap && tex.source)){
				return;
			}
			Stat.drawCall++;
			var alphaChanged=alpha!==1;
			if (alphaChanged){
				var temp=this.globalAlpha;
				this.globalAlpha *=alpha;
			};
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			if (m){
				this.save();
				this.transform(m.a,m.b,m.c,m.d,m.tx+x,m.ty+y);
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX ,args2[2]-pivotY,args2[3],args2[4]);
				this.restore();
				}else {
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX+x ,args2[2]-pivotY+y,args2[3],args2[4]);
			}
			if (alphaChanged)this.globalAlpha=temp;
		}

		__proto.fillTexture=function(texture,x,y,width,height,type,offset,other){
			if (!other.pat){
				if (texture.uv !=Texture.DEF_UV){
					var canvas=new HTMLCanvas("2D");
					canvas.getContext('2d');
					canvas.size(texture.width,texture.height);
					canvas.context.drawTexture(texture,0,0,texture.width,texture.height,0,0);
					texture=new Texture(canvas);
				}
				other.pat=this.createPattern(texture.bitmap.source,type);
			};
			var oX=x,oY=y;
			var sX=0,sY=0;
			if (offset){
				oX+=offset.x % texture.width;
				oY+=offset.y % texture.height;
				sX-=offset.x % texture.width;
				sY-=offset.y % texture.height;
			}
			this.translate(oX,oY);
			this.fillRect(sX,sY,width,height,other.pat);
			this.translate(-oX,-oY);
		}

		/***@private */
		__proto.flush=function(){
			return 0;
		}

		/***@private */
		__proto.fillWords=function(words,x,y,font,color){
			font && (this.font=font);
			color && (this.fillStyle=color);
			var _this=this;
			this.textBaseline="top";
			this.textAlign='left';
			for (var i=0,n=words.length;i < n;i++){
				var a=words[i];
				this.__fillText(a.char,a.x+x,a.y+y);
			}
		}

		/***@private */
		__proto.fillBorderWords=function(words,x,y,font,color,borderColor,lineWidth){
			font && (this.font=font);
			color && (this.fillStyle=color);
			this.textBaseline="top";
			this.lineWidth=lineWidth;
			this.textAlign='left';
			this.strokeStyle=borderColor;
			for (var i=0,n=words.length;i < n;i++){
				var a=words[i];
				this.__strokeText(a.char,a.x+x,a.y+y);
				this.__fillText(a.char,a.x+x,a.y+y);
			}
		}

		/***@private */
		__proto.destroy=function(){
			this.canvas.width=this.canvas.height=0;
		}

		/***@private */
		__proto.clear=function(){
			this.clearRect(0,0,this._canvas.width,this._canvas.height);
			this._repaint=false;
		}

		__proto.drawCurves=function(x,y,args){
			this.beginPath();
			this.strokeStyle=args[3];
			this.lineWidth=args[4];
			var points=args[2];
			x+=args[0],y+=args[1];
			this.moveTo(x+points[0],y+points[1]);
			var i=2,n=points.length;
			while (i < n){
				this.quadraticCurveTo(x+points[i++],y+points[i++],x+points[i++],y+points[i++]);
			}
			this.stroke();
		}

		Context.__init__=function(to){
			var from=laya.resource.Context.prototype;
			to=to || CanvasRenderingContext2D.prototype;
			to.__fillText=to.fillText;
			to.__fillRect=to.fillRect;
			to.__strokeText=to.strokeText;
			var funs=['drawTextures','fillWords','fillBorderWords','setIsMainContext','fillRect','strokeText','fillTexture','fillText','transformByMatrix','setTransformByMatrix','clipRect','drawTexture','drawTexture2','drawTextureWithTransform','flush','clear','destroy','drawCanvas','fillBorderText','drawCurves'];
			funs.forEach(function(i){
				to[i]=from[i];
			});
		}

		Context._default=new Context();
		return Context;
	})()


	//class laya.resource.ResourceManager
	var ResourceManager=(function(){
		function ResourceManager(){
			this._id=0;
			this._name=null;
			this._resources=null;
			this._memorySize=0;
			this._garbageCollectionRate=NaN;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=0;
			this._id=++ResourceManager._uniqueIDCounter;
			this._name="Content Manager";
			ResourceManager._isResourceManagersSorted=false;
			this._memorySize=0;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=1024 *1024 *512;
			this._garbageCollectionRate=0.2;
			ResourceManager._resourceManagers.push(this);
			this._resources=[];
		}

		__class(ResourceManager,'laya.resource.ResourceManager');
		var __proto=ResourceManager.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		/**
		*获取指定索引的资源 Resource 对象。
		*@param 索引。
		*@return 资源 Resource 对象。
		*/
		__proto.getResourceByIndex=function(index){
			return this._resources[index];
		}

		/**
		*获取此管理器所管理的资源个数。
		*@return 资源个数。
		*/
		__proto.getResourcesLength=function(){
			return this._resources.length;
		}

		/**
		*添加指定资源。
		*@param resource 需要添加的资源 Resource 对象。
		*@return 是否添加成功。
		*/
		__proto.addResource=function(resource){
			if (resource.resourceManager)
				resource.resourceManager.removeResource(resource);
			var index=this._resources.indexOf(resource);
			if (index===-1){
				resource._resourceManager=this;
				this._resources.push(resource);
				this.addSize(resource.memorySize);
				return true;
			}
			return false;
		}

		/**
		*移除指定资源。
		*@param resource 需要移除的资源 Resource 对象
		*@return 是否移除成功。
		*/
		__proto.removeResource=function(resource){
			var index=this._resources.indexOf(resource);
			if (index!==-1){
				this._resources.splice(index,1);
				resource._resourceManager=null;
				this._memorySize-=resource.memorySize;
				return true;
			}
			return false;
		}

		/**
		*卸载此资源管理器载入的资源。
		*/
		__proto.unload=function(){
			var tempResources=this._resources.slice(0,this._resources.length);
			for (var i=0;i < tempResources.length;i++){
				var resource=tempResources[i];
				resource.dispose();
			}
			tempResources.length=0;
		}

		/**
		*设置唯一名字。
		*@param newName 名字，如果名字重复则自动加上“-copy”。
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				if (ResourceManager._resourceManagers[i]._name!==newName || ResourceManager._resourceManagers[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					ResourceManager._isResourceManagersSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**释放资源。*/
		__proto.dispose=function(){
			if (this===ResourceManager._systemResourceManager)
				throw new Error("systemResourceManager不能被释放！");
			ResourceManager._resourceManagers.splice(ResourceManager._resourceManagers.indexOf(this),1);
			ResourceManager._isResourceManagersSorted=false;
			var tempResources=this._resources.slice(0,this._resources.length);
			for (var i=0;i < tempResources.length;i++){
				var resource=tempResources[i];
				resource.resourceManager.removeResource(resource);
				resource.dispose();
			}
			tempResources.length=0;
		}

		/**
		*增加内存。
		*@param add 需要增加的内存大小。
		*/
		__proto.addSize=function(add){
			if (add){
				if (this.autoRelease && add > 0)
					((this._memorySize+add)> this.autoReleaseMaxSize)&& (this.garbageCollection((1-this._garbageCollectionRate)*this.autoReleaseMaxSize));
				this._memorySize+=add;
			}
		}

		/**
		*垃圾回收。
		*@param reserveSize 保留尺寸。
		*/
		__proto.garbageCollection=function(reserveSize){
			var all=this._resources;
			all=all.slice();
			all.sort(function(a,b){
				if (!a || !b)
					throw new Error("a或b不能为空！");
				if (a.released && b.released)
					return 0;
				else if (a.released)
				return 1;
				else if (b.released)
				return-1;
				return a.lastUseFrameCount-b.lastUseFrameCount;
			});
			var currentFrameCount=Stat.loopCount;
			for (var i=0,n=all.length;i < n;i++){
				var resou=all[i];
				if (currentFrameCount-resou.lastUseFrameCount > 1){
					resou.releaseResource();
					}else {
					if (this._memorySize >=reserveSize)
						this._isOverflow=true;
					return;
				}
				if (this._memorySize < reserveSize){
					this._isOverflow=false;
					return;
				}
			}
		}

		/**
		*唯一标识 ID 。
		*/
		__getset(0,__proto,'id',function(){
			return this._id;
		});

		/**
		*名字。
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this._name!==value){
				this._name=value;
				ResourceManager._isResourceManagersSorted=false;
			}
		});

		/**
		*此管理器所管理资源的累计内存，以字节为单位。
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
		});

		/**
		*系统资源管理器。
		*/
		__getset(1,ResourceManager,'systemResourceManager',function(){
			(ResourceManager._systemResourceManager===null)&& (ResourceManager._systemResourceManager=new ResourceManager(),ResourceManager._systemResourceManager._name="System Resource Manager");
			return ResourceManager._systemResourceManager;
		});

		/**
		*排序后的资源管理器列表。
		*/
		__getset(1,ResourceManager,'sortedResourceManagersByName',function(){
			if (!ResourceManager._isResourceManagersSorted){
				ResourceManager._isResourceManagersSorted=true;
				ResourceManager._resourceManagers.sort(ResourceManager.compareResourceManagersByName);
			}
			return ResourceManager._resourceManagers;
		});

		ResourceManager.__init__=function(){
			ResourceManager.currentResourceManager=ResourceManager.systemResourceManager;
		}

		ResourceManager.getLoadedResourceManagerByIndex=function(index){
			return ResourceManager._resourceManagers[index];
		}

		ResourceManager.getLoadedResourceManagersCount=function(){
			return ResourceManager._resourceManagers.length;
		}

		ResourceManager.recreateContentManagers=function(force){
			(force===void 0)&& (force=false);
			var temp=ResourceManager.currentResourceManager;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
				for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
					ResourceManager.currentResourceManager._resources[j].releaseResource(force);
					ResourceManager.currentResourceManager._resources[j].activeResource(force);
				}
			}
			ResourceManager.currentResourceManager=temp;
		}

		ResourceManager.releaseContentManagers=function(force){
			(force===void 0)&& (force=false);
			var temp=ResourceManager.currentResourceManager;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
				for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
					var resource=ResourceManager.currentResourceManager._resources[j];
					(!resource.released)&& (resource.releaseResource(force));
				}
			}
			ResourceManager.currentResourceManager=temp;
		}

		ResourceManager.compareResourceManagersByName=function(left,right){
			if (left==right)
				return 0;
			var x=left._name;
			var y=right._name;
			if (x==null){
				if (y==null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right._name;
						return x.localeCompare(y);
					}
				}
			}
		}

		ResourceManager._uniqueIDCounter=0;
		ResourceManager._systemResourceManager=null
		ResourceManager._isResourceManagersSorted=false;
		ResourceManager._resourceManagers=[];
		ResourceManager.currentResourceManager=null
		return ResourceManager;
	})()


	//class laya.ui.LayoutStyle
	var LayoutStyle=(function(){
		function LayoutStyle(){
			this.enable=false;
			this.top=NaN;
			this.bottom=NaN;
			this.left=NaN;
			this.right=NaN;
			this.centerX=NaN;
			this.centerY=NaN;
			this.anchorX=NaN;
			this.anchorY=NaN;
		}

		__class(LayoutStyle,'laya.ui.LayoutStyle');
		__static(LayoutStyle,
		['EMPTY',function(){return this.EMPTY=new LayoutStyle();}
		]);
		return LayoutStyle;
	})()


	//class laya.ui.Styles
	var Styles=(function(){
		function Styles(){};
		__class(Styles,'laya.ui.Styles');
		Styles.labelColor="#000000";
		Styles.buttonStateNum=3;
		Styles.scrollBarMinNum=15;
		Styles.scrollBarDelayTime=500;
		__static(Styles,
		['defaultSizeGrid',function(){return this.defaultSizeGrid=[4,4,4,4,0];},'labelPadding',function(){return this.labelPadding=[2,2,2,2];},'inputLabelPadding',function(){return this.inputLabelPadding=[1,1,1,3];},'buttonLabelColors',function(){return this.buttonLabelColors=["#32556b","#32cc6b","#ff0000","#C0C0C0"];},'comboBoxItemColors',function(){return this.comboBoxItemColors=["#5e95b6","#ffffff","#000000","#8fa4b1","#ffffff"];}
		]);
		return Styles;
	})()


	//class laya.ui.UIUtils
	var UIUtils=(function(){
		function UIUtils(){};
		__class(UIUtils,'laya.ui.UIUtils');
		UIUtils.fillArray=function(arr,str,type){
			var temp=arr.concat();
			if (str){
				var a=str.split(",");
				for (var i=0,n=Math.min(temp.length,a.length);i < n;i++){
					var value=a[i];
					temp[i]=(value=="true" ? true :(value=="false" ? false :value));
					if (type !=null)temp[i]=type(value);
				}
			}
			return temp;
		}

		UIUtils.toColor=function(color){
			return Utils.toHexColor(color);
		}

		UIUtils.gray=function(traget,isGray){
			(isGray===void 0)&& (isGray=true);
			if (isGray){
				UIUtils.addFilter(traget,UIUtils.grayFilter);
				}else {
				UIUtils.clearFilter(traget,ColorFilter);
			}
		}

		UIUtils.addFilter=function(target,filter){
			var filters=target.filters || [];
			filters.push(filter);
			target.filters=filters;
		}

		UIUtils.clearFilter=function(target,filterType){
			var filters=target.filters;
			if (filters !=null && filters.length > 0){
				for (var i=filters.length-1;i >-1;i--){
					var filter=filters[i];
					if (Laya.__typeof(filter,filterType))filters.splice(i,1);
				}
				target.filters=filters;
			}
		}

		UIUtils._getReplaceStr=function(word){
			return UIUtils.escapeSequence[word];
		}

		UIUtils.adptString=function(str){
			return str.replace(/\\(\w)/g,UIUtils._getReplaceStr);
		}

		__static(UIUtils,
		['grayFilter',function(){return this.grayFilter=new ColorFilter([0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0.3086,0.6094,0.082,0,0,0,0,0,1,0]);},'escapeSequence',function(){return this.escapeSequence={"\\n":"\n","\\t":"\t"};}
		]);
		return UIUtils;
	})()


	//class laya.utils.Browser
	var Browser=(function(){
		function Browser(){};
		__class(Browser,'laya.utils.Browser');
		/**设备像素比。*/
		__getset(1,Browser,'pixelRatio',function(){
			Browser.__init__();
			if (Browser.userAgent.indexOf("Mozilla/6.0(Linux; Android 6.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10)")>-1)return 2;
			return RunDriver.getPixelRatio();
		});

		/**浏览器窗口物理高度。考虑了设备像素比。*/
		__getset(1,Browser,'height',function(){
			Browser.__init__();
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientWidth :Browser.clientHeight)*Browser.pixelRatio;
		});

		/**
		*浏览器窗口可视宽度。
		*通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerWidth(包含滚动条宽度)> document.body.clientWidth(不包含滚动条宽度)，如果前者为0或为空，则选择后者。
		*/
		__getset(1,Browser,'clientWidth',function(){
			Browser.__init__();
			return Browser.window.innerWidth || Browser.document.body.clientWidth;
		});

		/**浏览器原生 window 对象的引用。*/
		__getset(1,Browser,'window',function(){
			Browser.__init__();
			return Browser._window;
		});

		/**
		*浏览器窗口可视高度。
		*通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerHeight(包含滚动条高度)> document.body.clientHeight(不包含滚动条高度)> document.documentElement.clientHeight(不包含滚动条高度)，如果前者为0或为空，则选择后者。
		*/
		__getset(1,Browser,'clientHeight',function(){
			Browser.__init__();
			return Browser.window.innerHeight || Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight;
		});

		/**浏览器窗口物理宽度。考虑了设备像素比。*/
		__getset(1,Browser,'width',function(){
			Browser.__init__();
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientHeight :Browser.clientWidth)*Browser.pixelRatio;
		});

		/**画布容器，用来盛放画布的容器。方便对画布进行控制*/
		__getset(1,Browser,'container',function(){
			Browser.__init__();
			if (!Browser._container){
				Browser._container=Browser.createElement("div");
				Browser._container.id="layaContainer";
				Browser.document.body.appendChild(Browser._container);
			}
			return Browser._container;
			},function(value){
			Browser._container=value;
		});

		/**浏览器原生 document 对象的引用。*/
		__getset(1,Browser,'document',function(){
			Browser.__init__();
			return Browser._document;
		});

		Browser.__init__=function(){
			SoundManager;
			if (Browser._window)return;
			Browser._window=RunDriver.getWindow();
			Browser._document=Browser.window.document;
			Browser._window.addEventListener('message',function(e){
				laya.utils.Browser._onMessage(e);
			},false);
			Browser.document.__createElement=Browser.document.createElement;
			window.requestAnimationFrame=window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (c){return window.setTimeout(c,1000 / 60);};;
			var $BS=window.document.body.style;$BS.margin=0;$BS.overflow='hidden';;
			var metas=window.document.getElementsByTagName('meta');;
			var i=0,flag=false,content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no';;
			while(i<metas.length){var meta=metas[i];if(meta.name=='viewport'){meta.content=content;flag=true;break;}i++;};
			if(!flag){meta=document.createElement('meta');meta.name='viewport',meta.content=content;document.getElementsByTagName('head')[0].appendChild(meta);};
			Browser.userAgent=/*[SAFE]*/ Browser.window.navigator.userAgent;
			Browser.u=/*[SAFE]*/ Browser.userAgent;
			Browser.onIOS=/*[SAFE]*/ !!Browser.u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
			Browser.onMobile=/*[SAFE]*/ Browser.u.indexOf("Mobile")>-1;
			Browser.onIPhone=/*[SAFE]*/ Browser.u.indexOf("iPhone")>-1;
			Browser.onIPad=/*[SAFE]*/ Browser.u.indexOf("iPad")>-1;
			Browser.onAndriod=/*[SAFE]*/ Browser.u.indexOf('Android')>-1 || Browser.u.indexOf('Adr')>-1;
			Browser.onWP=/*[SAFE]*/ Browser.u.indexOf("Windows Phone")>-1;
			Browser.onQQBrowser=/*[SAFE]*/ Browser.u.indexOf("QQBrowser")>-1;
			Browser.onMQQBrowser=/*[SAFE]*/ Browser.u.indexOf("MQQBrowser")>-1;
			Browser.onIE=/*[SAFE]*/ !!Browser.window.ActiveXObject || "ActiveXObject" in Browser.window;
			Browser.onWeiXin=/*[SAFE]*/ Browser.u.indexOf('MicroMessenger')>-1;
			Browser.onPC=/*[SAFE]*/ !Browser.onMobile;
			Browser.onSafari=/*[SAFE]*/ !!Browser.u.match(/Version\/\d+\.\d\x20Mobile\/\S+\x20Safari/);
			Browser.httpProtocol=/*[SAFE]*/ Browser.window.location.protocol=="http:";
			Browser.webAudioEnabled=/*[SAFE]*/ Browser.window["AudioContext"] || Browser.window["webkitAudioContext"] || Browser.window["mozAudioContext"] ? true :false;
			Browser.soundType=/*[SAFE]*/ Browser.webAudioEnabled ? "WEBAUDIOSOUND" :"AUDIOSOUND";
			Sound=Browser.webAudioEnabled?WebAudioSound:AudioSound;;
			if (Browser.webAudioEnabled)WebAudioSound.initWebAudio();;
			Browser.enableTouch=(('ontouchstart' in window)|| window.DocumentTouch && document instanceof DocumentTouch);
			window.focus();
			SoundManager._soundClass=Sound;;
			Render._mainCanvas=Render._mainCanvas || HTMLCanvas.create('2D');
			if (Browser.canvas)return;
			Browser.canvas=HTMLCanvas.create('2D');
			Browser.context=Browser.canvas.getContext('2d');
		}

		Browser._onMessage=function(e){
			if (!e.data)return;
			if (e.data.name=="size"){
				Browser.window.innerWidth=e.data.width;
				Browser.window.innerHeight=e.data.height;
				Browser.window.__innerHeight=e.data.clientHeight;
				if (!Browser.document.createEvent){
					console.warn("no document.createEvent");
					return;
				};
				var evt=Browser.document.createEvent("HTMLEvents");
				evt.initEvent("resize",false,false);
				Browser.window.dispatchEvent(evt);
				return;
			}
		}

		Browser.createElement=function(type){
			Browser.__init__();
			return Browser.document.__createElement(type);
		}

		Browser.getElementById=function(type){
			Browser.__init__();
			return Browser.document.getElementById(type);
		}

		Browser.removeElement=function(ele){
			if (ele && ele.parentNode)ele.parentNode.removeChild(ele);
		}

		Browser.now=function(){
			return RunDriver.now();
		}

		Browser._window=null
		Browser._document=null
		Browser._container=null
		Browser.userAgent=null
		Browser.u=null
		Browser.onIOS=false;
		Browser.onMobile=false;
		Browser.onIPhone=false;
		Browser.onIPad=false;
		Browser.onAndriod=false;
		Browser.onAndroid=false;
		Browser.onWP=false;
		Browser.onQQBrowser=false;
		Browser.onMQQBrowser=false;
		Browser.onSafari=false;
		Browser.onIE=false;
		Browser.onWeiXin=false;
		Browser.onPC=false;
		Browser.httpProtocol=false;
		Browser.webAudioEnabled=false;
		Browser.soundType=null
		Browser.enableTouch=false;
		Browser.canvas=null
		Browser.context=null
		Browser.__init$=function(){
			AudioSound;
			WebAudioSound;
		}

		return Browser;
	})()


	//class laya.utils.CacheManger
	var CacheManger=(function(){
		function CacheManger(){}
		__class(CacheManger,'laya.utils.CacheManger');
		CacheManger.regCacheByFunction=function(disposeFunction,getCacheListFunction){
			CacheManger.unRegCacheByFunction(disposeFunction,getCacheListFunction);
			var cache;
			cache={
				tryDispose:disposeFunction,
				getCacheList:getCacheListFunction
			};
			CacheManger._cacheList.push(cache);
		}

		CacheManger.unRegCacheByFunction=function(disposeFunction,getCacheListFunction){
			var i=0,len=0;
			len=CacheManger._cacheList.length;
			for (i=0;i < len;i++){
				if (CacheManger._cacheList[i].tryDispose==disposeFunction && CacheManger._cacheList[i].getCacheList==getCacheListFunction){
					CacheManger._cacheList.splice(i,1);
					return;
				}
			}
		}

		CacheManger.forceDispose=function(){
			var i=0,len=CacheManger._cacheList.length;
			for(i=0;i<len;i++){
				CacheManger._cacheList[i].tryDispose(true);
			}
		}

		CacheManger.beginCheck=function(waitTime){
			(waitTime===void 0)&& (waitTime=15000);
			Laya.timer.loop(waitTime,null,CacheManger._checkLoop);
		}

		CacheManger.stopCheck=function(){
			Laya.timer.clear(null,CacheManger._checkLoop);
		}

		CacheManger._checkLoop=function(){
			var cacheList=CacheManger._cacheList;
			if (cacheList.length < 1)return;
			var tTime=Browser.now();
			var count=0;
			var len=0;
			len=count=cacheList.length;
			while (count > 0){
				CacheManger._index++;
				CacheManger._index=CacheManger._index % len;
				cacheList[CacheManger._index].tryDispose(false);
				if (Browser.now()-tTime > CacheManger.loopTimeLimit)break ;
				count--;
			}
		}

		CacheManger.loopTimeLimit=2;
		CacheManger._cacheList=[];
		CacheManger._index=0;
		return CacheManger;
	})()


	//class laya.utils.ClassUtils
	var ClassUtils=(function(){
		function ClassUtils(){};
		__class(ClassUtils,'laya.utils.ClassUtils');
		ClassUtils.regClass=function(className,classDef){
			ClassUtils._classMap[className]=classDef;
		}

		ClassUtils.getRegClass=function(className){
			return ClassUtils._classMap[className];
		}

		ClassUtils.getInstance=function(className){
			var compClass=ClassUtils.getClass(className);
			if (compClass)
				return new compClass();
			else
			console.warn("[error] Undefined class:",className);
			return null;
		}

		ClassUtils.createByJson=function(json,node,root,customHandler,instanceHandler){
			if ((typeof json=='string'))
				json=JSON.parse(json);
			var props=json.props;
			if (!node){
				node=instanceHandler ? instanceHandler.runWith(json):ClassUtils.getInstance(props.runtime || json.type);
				if (!node)
					return null;
			};
			var child=json.child;
			if (child){
				for (var i=0,n=child.length;i < n;i++){
					var data=child[i];
					if ((data.props.name==="render" || data.props.renderType==="render")&& node["_$set_itemRender"])
						node.itemRender=data;
					else {
						if (data.type=="Graphic"){
							ClassUtils.addGraphicsToSprite(data,node);
							}else if (ClassUtils.isDrawType(data.type)){
							ClassUtils.addGraphicToSprite(data,node,true);
							}else {
							var tChild=ClassUtils.createByJson(data,null,root,customHandler,instanceHandler)
							if (data.type=="Script"){
								if (tChild.hasOwnProperty("owner")){
									tChild["owner"]=node;
									}else if (tChild.hasOwnProperty("target")){
									tChild["target"]=node;
								}
								}else if (data.props.renderType=="mask"){
								node.mask=tChild;
								}else {
								node.addChild(tChild);
							}
						}
					}
				}
			}
			if (props){
				for (var prop in props){
					var value=props[prop];
					if (prop==="var" && root){
						root[value]=node;
						}else if ((value instanceof Array)&& (typeof (node[prop])=='function')){
						node[prop].apply(node,value);
						}else {
						node[prop]=value;
					}
				}
			}
			if (customHandler && json.customProps){
				customHandler.runWith([node,json]);
			}
			if (node["created"])
				node.created();
			return node;
		}

		ClassUtils.addGraphicsToSprite=function(graphicO,sprite){
			var graphics;
			graphics=graphicO.child;
			if (!graphics || graphics.length < 1)
				return;
			var g;
			g=ClassUtils._getGraphicsFromSprite(graphicO,sprite);
			var ox=0;
			var oy=0;
			if (graphicO.props){
				ox=ClassUtils._getObjVar(graphicO.props,"x",0);
				oy=ClassUtils._getObjVar(graphicO.props,"y",0);
			}
			if (ox !=0 && oy !=0){
				g.translate(ox,oy);
			};
			var i=0,len=0;
			len=graphics.length;
			for (i=0;i < len;i++){
				ClassUtils._addGraphicToGraphics(graphics[i],g);
			}
			if (ox !=0 && oy !=0){
				g.translate(-ox,-oy);
			}
		}

		ClassUtils.addGraphicToSprite=function(graphicO,sprite,isChild){
			(isChild===void 0)&& (isChild=false);
			var g;
			g=isChild ? ClassUtils._getGraphicsFromSprite(graphicO,sprite):sprite.graphics;
			ClassUtils._addGraphicToGraphics(graphicO,g);
		}

		ClassUtils._getGraphicsFromSprite=function(dataO,sprite){
			var g;
			if (!dataO || !dataO.props)
				return sprite.graphics;
			var propsName;
			propsName=dataO.props.renderType;
			switch (propsName){
				case "hit":
				case "unHit":;
					var hitArea;
					if (!sprite.hitArea){
						sprite.hitArea=new HitArea();
					}
					hitArea=sprite.hitArea;
					if (!hitArea[propsName]){
						hitArea[propsName]=new Graphics();
					}
					g=hitArea[propsName];
					break ;
				default :
				}
			if (!g)
				g=sprite.graphics;
			return g;
		}

		ClassUtils._getTransformData=function(propsO){
			var m;
			if (propsO.hasOwnProperty("pivotX")|| propsO.hasOwnProperty("pivotY")){
				m=m || new Matrix();
				m.translate(-ClassUtils._getObjVar(propsO,"pivotX",0),-ClassUtils._getObjVar(propsO,"pivotY",0));
			};
			var sx=ClassUtils._getObjVar(propsO,"scaleX",1),sy=ClassUtils._getObjVar(propsO,"scaleY",1);
			var rotate=ClassUtils._getObjVar(propsO,"rotation",0);
			var skewX=ClassUtils._getObjVar(propsO,"skewX",0);
			var skewY=ClassUtils._getObjVar(propsO,"skewY",0);
			if (sx !=1 || sy !=1 || rotate !=0){
				m=m || new Matrix();
				m.scale(sx,sy);
				m.rotate(rotate *0.0174532922222222);
			}
			return m;
		}

		ClassUtils._addGraphicToGraphics=function(graphicO,graphic){
			var propsO;
			propsO=graphicO.props;
			if (!propsO)
				return;
			var drawConfig;
			drawConfig=ClassUtils.DrawTypeDic[graphicO.type];
			if (!drawConfig)
				return;
			var g;
			g=graphic;
			var m;
			var params=ClassUtils._getParams(propsO,drawConfig[1],drawConfig[2],drawConfig[3]);
			m=ClassUtils._tM;
			if (m || ClassUtils._alpha !=1){
				g.save();
				if (m)
					g.transform(m);
				if (ClassUtils._alpha !=1)
					g.alpha(ClassUtils._alpha);
			}
			g[drawConfig[0]].apply(g,params);
			if (m || ClassUtils._alpha !=1){
				g.restore();
			}
		}

		ClassUtils._adptLineData=function(params){
			params[2]=parseFloat(params[0])+parseFloat(params[2]);
			params[3]=parseFloat(params[1])+parseFloat(params[3]);
			return params;
		}

		ClassUtils._adptTextureData=function(params){
			params[0]=Loader.getRes(params[0]);
			return params;
		}

		ClassUtils._adptLinesData=function(params){
			params[2]=ClassUtils._getPointListByStr(params[2]);
			return params;
		}

		ClassUtils.isDrawType=function(type){
			if (type=="Image")
				return false;
			return ClassUtils.DrawTypeDic.hasOwnProperty(type);
		}

		ClassUtils._getParams=function(obj,params,xPos,adptFun){
			(xPos===void 0)&& (xPos=0);
			var rst;
			rst=ClassUtils._temParam;
			rst.length=params.length;
			var i=0,len=0;
			len=params.length;
			for (i=0;i < len;i++){
				rst[i]=ClassUtils._getObjVar(obj,params[i][0],params[i][1]);
			}
			ClassUtils._alpha=ClassUtils._getObjVar(obj,"alpha",1);
			var m;
			m=ClassUtils._getTransformData(obj);
			if (m){
				if (!xPos)xPos=0;
				m.translate(rst[xPos],rst[xPos+1]);
				rst[xPos]=rst[xPos+1]=0;
				ClassUtils._tM=m;
				}else {
				ClassUtils._tM=null;
			}
			if (adptFun && ClassUtils[adptFun]){
				rst=ClassUtils[adptFun](rst);
			}
			return rst;
		}

		ClassUtils._getPointListByStr=function(str){
			var pointArr;
			pointArr=str.split(",");
			var i=0,len=0;
			len=pointArr.length;
			for (i=0;i < len;i++){
				pointArr[i]=parseFloat(pointArr[i]);
			}
			return pointArr;
		}

		ClassUtils._getObjVar=function(obj,key,noValue){
			if (obj.hasOwnProperty(key)){
				return obj[key];
			}
			return noValue;
		}

		ClassUtils._temParam=[];
		ClassUtils._classMap={'Sprite':'laya.display.Sprite','Text':'laya.display.Text','Animation':'laya.display.Animation','Skeleton':'laya.ani.bone.Skeleton','Particle2D':'laya.particle.Particle2D','div':'laya.html.dom.HTMLDivElement','p':'laya.html.dom.HTMLElement','img':'laya.html.dom.HTMLImageElement','span':'laya.html.dom.HTMLElement','br':'laya.html.dom.HTMLBrElement','style':'laya.html.dom.HTMLStyleElement','font':'laya.html.dom.HTMLElement','a':'laya.html.dom.HTMLElement','#text':'laya.html.dom.HTMLElement'};
		ClassUtils.getClass=function(className){
			var classObject=ClassUtils._classMap[className] || className;
			if ((typeof classObject=='string'))
				return Laya["__classmap"][classObject];
			return classObject;
		}

		ClassUtils._tM=null
		ClassUtils._alpha=NaN
		__static(ClassUtils,
		['DrawTypeDic',function(){return this.DrawTypeDic={"Rect":["drawRect",[["x",0],["y",0],["width",0],["height",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Circle":["drawCircle",[["x",0],["y",0],["radius",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Pie":["drawPie",[["x",0],["y",0],["radius",0],["startAngle",0],["endAngle",0],["fillColor",null],["lineColor",null],["lineWidth",1]]],"Image":["drawTexture",[["x",0],["y",0],["width",0],["height",0]]],"Texture":["drawTexture",[["skin",null],["x",0],["y",0],["width",0],["height",0]],1,"_adptTextureData"],"FillTexture":["fillTexture",[["skin",null],["x",0],["y",0],["width",0],["height",0],["repeat",null]],1,"_adptTextureData"],"FillText":["fillText",[["text",""],["x",0],["y",0],["font",null],["color",null],["textAlign",null]],1],"Line":["drawLine",[["x",0],["y",0],["toX",0],["toY",0],["lineColor",null],["lineWidth",0]],0,"_adptLineData"],"Lines":["drawLines",[["x",0],["y",0],["points",""],["lineColor",null],["lineWidth",0]],0,"_adptLinesData"],"Curves":["drawCurves",[["x",0],["y",0],["points",""],["lineColor",null],["lineWidth",0]],0,"_adptLinesData"],"Poly":["drawPoly",[["x",0],["y",0],["points",""],["fillColor",null],["lineColor",null],["lineWidth",1]],0,"_adptLinesData"]};}
		]);
		return ClassUtils;
	})()


	//class laya.utils.Color
	var Color=(function(){
		function Color(str){
			this._color=[];
			//this.strColor=null;
			//this.numColor=0;
			//this._drawStyle=null;
			if ((typeof str=='string')){
				this.strColor=str;
				if (str===null)str="#000000";
				str.charAt(0)=='#' && (str=str.substr(1));
				var len=str.length;
				if (len==3 || len==4){
					var temp="";
					for (var i=0;i < len;i++){
						temp+=(str[i]+str[i]);
					}
					str=temp;
				};
				var color=this.numColor=parseInt(str,16);
				var flag=(str.length==8);
				if (flag){
					this._color=[parseInt(str.substr(0,2),16)/ 255,((0x00FF0000 & color)>> 16)/ 255,((0x0000FF00 & color)>> 8)/ 255,(0x000000FF & color)/ 255];
					return;
				}
				}else {
				color=this.numColor=str;
				this.strColor=Utils.toHexColor(color);
			}
			this._color=[((0xFF0000 & color)>> 16)/ 255,((0xFF00 & color)>> 8)/ 255,(0xFF & color)/ 255,1];
			(this._color).__id=++Color._COLODID;
		}

		__class(Color,'laya.utils.Color');
		Color._initDefault=function(){
			Color._DEFAULT={};
			for (var i in Color._COLOR_MAP)Color._SAVE[i]=Color._DEFAULT[i]=new Color(Color._COLOR_MAP[i]);
			return Color._DEFAULT;
		}

		Color._initSaveMap=function(){
			Color._SAVE_SIZE=0;
			Color._SAVE={};
			for (var i in Color._DEFAULT)Color._SAVE[i]=Color._DEFAULT[i];
		}

		Color.create=function(str){
			var color=Color._SAVE[str+""];
			if (color !=null)return color;
			(Color._SAVE_SIZE < 1000)|| Color._initSaveMap();
			return Color._SAVE[str+""]=new Color(str);
		}

		Color._SAVE={};
		Color._SAVE_SIZE=0;
		Color._COLOR_MAP={"white":'#FFFFFF',"red":'#FF0000',"green":'#00FF00',"blue":'#0000FF',"black":'#000000',"yellow":'#FFFF00','gray':'#AAAAAA'};
		Color._DEFAULT=Color._initDefault();
		Color._COLODID=1;
		return Color;
	})()


	//class laya.utils.Dragging
	var Dragging=(function(){
		function Dragging(){
			//this.target=null;
			this.ratio=0.92;
			this.maxOffset=60;
			//this.area=null;
			//this.hasInertia=false;
			//this.elasticDistance=NaN;
			//this.elasticBackTime=NaN;
			//this.data=null;
			this._dragging=false;
			this._clickOnly=true;
			//this._elasticRateX=NaN;
			//this._elasticRateY=NaN;
			//this._lastX=NaN;
			//this._lastY=NaN;
			//this._offsetX=NaN;
			//this._offsetY=NaN;
			//this._offsets=null;
			//this._disableMouseEvent=false;
			//this._tween=null;
			//this._parent=null;
		}

		__class(Dragging,'laya.utils.Dragging');
		var __proto=Dragging.prototype;
		/**
		*开始拖拽。
		*@param target 待拖拽的 <code>Sprite</code> 对象。
		*@param area 滑动范围。
		*@param hasInertia 拖动是否有惯性。
		*@param elasticDistance 橡皮筋最大值。
		*@param elasticBackTime 橡皮筋回弹时间，单位为毫秒。
		*@param data 事件携带数据。
		*@param disableMouseEvent 鼠标事件是否有效。
		*@param ratio 惯性阻尼系数
		*/
		__proto.start=function(target,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio){
			(ratio===void 0)&& (ratio=0.92);
			this.clearTimer();
			this.target=target;
			this.area=area;
			this.hasInertia=hasInertia;
			this.elasticDistance=area ? elasticDistance :0;
			this.elasticBackTime=elasticBackTime;
			this.data=data;
			this._disableMouseEvent=disableMouseEvent;
			this.ratio=ratio;
			if (target.globalScaleX !=1 || target.globalScaleY !=1){
				this._parent=target.parent;
				}else {
				this._parent=Laya.stage;
			}
			this._clickOnly=true;
			this._dragging=true;
			this._elasticRateX=this._elasticRateY=1;
			this._lastX=this._parent.mouseX;
			this._lastY=this._parent.mouseY;
			Laya.stage.on("mouseup",this,this.onStageMouseUp);
			Laya.stage.on("mouseout",this,this.onStageMouseUp);
			Laya.timer.frameLoop(1,this,this.loop);
		}

		/**
		*清除计时器。
		*/
		__proto.clearTimer=function(){
			Laya.timer.clear(this,this.loop);
			Laya.timer.clear(this,this.tweenMove);
			if (this._tween){
				this._tween.recover();
				this._tween=null;
			}
		}

		/**
		*停止拖拽。
		*/
		__proto.stop=function(){
			if (this._dragging){
				MouseManager.instance.disableMouseEvent=false;
				Laya.stage.off("mouseup",this,this.onStageMouseUp);
				Laya.stage.off("mouseout",this,this.onStageMouseUp);
				this._dragging=false;
				this.target && this.area && this.backToArea();
				this.clear();
			}
		}

		/**
		*拖拽的循环处理函数。
		*/
		__proto.loop=function(){
			var point=this._parent.getMousePoint();
			var mouseX=point.x;
			var mouseY=point.y;
			var offsetX=mouseX-this._lastX;
			var offsetY=mouseY-this._lastY;
			if (this._clickOnly){
				if (Math.abs(offsetX *Laya.stage._canvasTransform.getScaleX())> 1 || Math.abs(offsetY *Laya.stage._canvasTransform.getScaleY())> 1){
					this._clickOnly=false;
					this._offsets || (this._offsets=[]);
					this._offsets.length=0;
					this.target.event("dragstart",this.data);
					MouseManager.instance.disableMouseEvent=this._disableMouseEvent;
					this.target._set$P("$_MOUSEDOWN",false);
				}else return;
				}else {
				this._offsets.push(offsetX,offsetY);
			}
			if (offsetX===0 && offsetY===0)return;
			this._lastX=mouseX;
			this._lastY=mouseY;
			this.target.x+=offsetX *this._elasticRateX;
			this.target.y+=offsetY *this._elasticRateY;
			this.area && this.checkArea();
			this.target.event("dragmove",this.data);
		}

		/**
		*拖拽区域检测。
		*/
		__proto.checkArea=function(){
			if (this.elasticDistance <=0){
				this.backToArea();
				}else {
				if (this.target.x < this.area.x){
					var offsetX=this.area.x-this.target.x;
					}else if (this.target.x > this.area.x+this.area.width){
					offsetX=this.target.x-this.area.x-this.area.width;
					}else {
					offsetX=0;
				}
				this._elasticRateX=Math.max(0,1-(offsetX / this.elasticDistance));
				if (this.target.y < this.area.y){
					var offsetY=this.area.y-this.target.y;
					}else if (this.target.y > this.area.y+this.area.height){
					offsetY=this.target.y-this.area.y-this.area.height;
					}else {
					offsetY=0;
				}
				this._elasticRateY=Math.max(0,1-(offsetY / this.elasticDistance));
			}
		}

		/**
		*移动至设定的拖拽区域。
		*/
		__proto.backToArea=function(){
			this.target.x=Math.min(Math.max(this.target.x,this.area.x),this.area.x+this.area.width);
			this.target.y=Math.min(Math.max(this.target.y,this.area.y),this.area.y+this.area.height);
		}

		/**
		*舞台的抬起事件侦听函数。
		*@param e Event 对象。
		*/
		__proto.onStageMouseUp=function(e){
			MouseManager.instance.disableMouseEvent=false;
			Laya.stage.off("mouseup",this,this.onStageMouseUp);
			Laya.stage.off("mouseout",this,this.onStageMouseUp);
			Laya.timer.clear(this,this.loop);
			if (this._clickOnly || !this.target)return;
			if (this.hasInertia){
				if (this._offsets.length < 1){
					this._offsets.push(this._parent.mouseX-this._lastX,this._parent.mouseY-this._lastY);
				}
				this._offsetX=this._offsetY=0;
				var len=this._offsets.length;
				var n=Math.min(len,6);
				var m=this._offsets.length-n;
				for (var i=len-1;i > m;i--){
					this._offsetY+=this._offsets[i--];
					this._offsetX+=this._offsets[i];
				}
				this._offsetX=this._offsetX / n *2;
				this._offsetY=this._offsetY / n *2;
				if (Math.abs(this._offsetX)> this.maxOffset)this._offsetX=this._offsetX > 0 ? this.maxOffset :-this.maxOffset;
				if (Math.abs(this._offsetY)> this.maxOffset)this._offsetY=this._offsetY > 0 ? this.maxOffset :-this.maxOffset;
				Laya.timer.frameLoop(1,this,this.tweenMove);
				}else if (this.elasticDistance > 0){
				this.checkElastic();
				}else {
				this.clear();
			}
		}

		/**
		*橡皮筋效果检测。
		*/
		__proto.checkElastic=function(){
			var tx=NaN;
			var ty=NaN;
			if (this.target.x < this.area.x)tx=this.area.x;
			else if (this.target.x > this.area.x+this.area.width)tx=this.area.x+this.area.width;
			if (this.target.y < this.area.y)ty=this.area.y;
			else if (this.target.y > this.area.y+this.area.height)ty=this.area.y+this.area.height;
			if (!isNaN(tx)|| !isNaN(ty)){
				var obj={};
				if (!isNaN(tx))obj.x=tx;
				if (!isNaN(ty))obj.y=ty;
				this._tween=Tween.to(this.target,obj,this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
				}else {
				this.clear();
			}
		}

		/**
		*移动。
		*/
		__proto.tweenMove=function(){
			this._offsetX *=this.ratio *this._elasticRateX;
			this._offsetY *=this.ratio *this._elasticRateY;
			this.target.x+=this._offsetX;
			this.target.y+=this._offsetY;
			this.area && this.checkArea();
			this.target.event("dragmove",this.data);
			if ((Math.abs(this._offsetX)< 1 && Math.abs(this._offsetY)< 1)|| this._elasticRateX < 0.5 || this._elasticRateY < 0.5){
				Laya.timer.clear(this,this.tweenMove);
				if (this.elasticDistance > 0)this.checkElastic();
				else this.clear();
			}
		}

		/**
		*结束拖拽。
		*/
		__proto.clear=function(){
			if (this.target){
				this.clearTimer();
				var sp=this.target;
				this.target=null;
				this._parent=null;
				sp.event("dragend",this.data);
			}
		}

		return Dragging;
	})()


	//class laya.utils.Ease
	var Ease=(function(){
		function Ease(){};
		__class(Ease,'laya.utils.Ease');
		Ease.linearNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearIn=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearInOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.bounceIn=function(t,b,c,d){
			return c-Ease.bounceOut(d-t,0,c,d)+b;
		}

		Ease.bounceInOut=function(t,b,c,d){
			if (t < d *0.5)return Ease.bounceIn(t *2,0,c,d)*.5+b;
			else return Ease.bounceOut(t *2-d,0,c,d)*.5+c *.5+b;
		}

		Ease.bounceOut=function(t,b,c,d){
			if ((t /=d)< (1 / 2.75))return c *(7.5625 *t *t)+b;
			else if (t < (2 / 2.75))return c *(7.5625 *(t-=(1.5 / 2.75))*t+.75)+b;
			else if (t < (2.5 / 2.75))return c *(7.5625 *(t-=(2.25 / 2.75))*t+.9375)+b;
			else return c *(7.5625 *(t-=(2.625 / 2.75))*t+.984375)+b;
		}

		Ease.backIn=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *(t /=d)*t *((s+1)*t-s)+b;
		}

		Ease.backInOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			if ((t /=d *0.5)< 1)return c *0.5 *(t *t *(((s *=(1.525))+1)*t-s))+b;
			return c / 2 *((t-=2)*t *(((s *=(1.525))+1)*t+s)+2)+b;
		}

		Ease.backOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *((t=t / d-1)*t *((s+1)*t+s)+1)+b;
		}

		Ease.elasticIn=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return-(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
		}

		Ease.elasticInOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d *0.5)==2)return b+c;
			if (!p)p=d *(.3 *1.5);
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			if (t < 1)return-.5 *(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
			return a *Math.pow(2,-10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p)*.5+c+b;
		}

		Ease.elasticOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return (a *Math.pow(2,-10 *t)*Math.sin((t *d-s)*Ease.PI2 / p)+c+b);
		}

		Ease.strongIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.strongInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.strongOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.sineInOut=function(t,b,c,d){
			return-c *0.5 *(Math.cos(Math.PI *t / d)-1)+b;
		}

		Ease.sineIn=function(t,b,c,d){
			return-c *Math.cos(t / d *Ease.HALF_PI)+c+b;
		}

		Ease.sineOut=function(t,b,c,d){
			return c *Math.sin(t / d *Ease.HALF_PI)+b;
		}

		Ease.quintIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.quintInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.quintOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.quartIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t+b;
		}

		Ease.quartInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t+b;
			return-c *0.5 *((t-=2)*t *t *t-2)+b;
		}

		Ease.quartOut=function(t,b,c,d){
			return-c *((t=t / d-1)*t *t *t-1)+b;
		}

		Ease.cubicIn=function(t,b,c,d){
			return c *(t /=d)*t *t+b;
		}

		Ease.cubicInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t+b;
			return c *0.5 *((t-=2)*t *t+2)+b;
		}

		Ease.cubicOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t+1)+b;
		}

		Ease.quadIn=function(t,b,c,d){
			return c *(t /=d)*t+b;
		}

		Ease.quadInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t+b;
			return-c *0.5 *((--t)*(t-2)-1)+b;
		}

		Ease.quadOut=function(t,b,c,d){
			return-c *(t /=d)*(t-2)+b;
		}

		Ease.expoIn=function(t,b,c,d){
			return (t==0)? b :c *Math.pow(2,10 *(t / d-1))+b-c *0.001;
		}

		Ease.expoInOut=function(t,b,c,d){
			if (t==0)return b;
			if (t==d)return b+c;
			if ((t /=d *0.5)< 1)return c *0.5 *Math.pow(2,10 *(t-1))+b;
			return c *0.5 *(-Math.pow(2,-10 *--t)+2)+b;
		}

		Ease.expoOut=function(t,b,c,d){
			return (t==d)? b+c :c *(-Math.pow(2,-10 *t / d)+1)+b;
		}

		Ease.circIn=function(t,b,c,d){
			return-c *(Math.sqrt(1-(t /=d)*t)-1)+b;
		}

		Ease.circInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return-c *0.5 *(Math.sqrt(1-t *t)-1)+b;
			return c *0.5 *(Math.sqrt(1-(t-=2)*t)+1)+b;
		}

		Ease.circOut=function(t,b,c,d){
			return c *Math.sqrt(1-(t=t / d-1)*t)+b;
		}

		Ease.HALF_PI=Math.PI *0.5;
		Ease.PI2=Math.PI *2;
		return Ease;
	})()


	//class laya.utils.Handler
	var Handler=(function(){
		function Handler(caller,method,args,once){
			//this.caller=null;
			//this.method=null;
			//this.args=null;
			this.once=false;
			this._id=0;
			(once===void 0)&& (once=false);
			this.setTo(caller,method,args,once);
		}

		__class(Handler,'laya.utils.Handler');
		var __proto=Handler.prototype;
		/**
		*设置此对象的指定属性值。
		*@param caller 执行域(this)。
		*@param method 回调方法。
		*@param args 携带的参数。
		*@param once 是否只执行一次，如果为true，执行后执行recover()进行回收。
		*@return 返回 handler 本身。
		*/
		__proto.setTo=function(caller,method,args,once){
			this._id=Handler._gid++;
			this.caller=caller;
			this.method=method;
			this.args=args;
			this.once=once;
			return this;
		}

		/**
		*执行处理器。
		*/
		__proto.run=function(){
			if (this.method==null)return null;
			var id=this._id;
			var result=this.method.apply(this.caller,this.args);
			this._id===id && this.once && this.recover();
			return result;
		}

		/**
		*执行处理器，携带额外数据。
		*@param data 附加的回调数据，可以是单数据或者Array(作为多参)。
		*/
		__proto.runWith=function(data){
			if (this.method==null)return null;
			var id=this._id;
			if (data==null)
				var result=this.method.apply(this.caller,this.args);
			else if (!this.args && !data.unshift)result=this.method.call(this.caller,data);
			else if (this.args)result=this.method.apply(this.caller,this.args.concat(data));
			else result=this.method.apply(this.caller,data);
			this._id===id && this.once && this.recover();
			return result;
		}

		/**
		*清理对象引用。
		*/
		__proto.clear=function(){
			this.caller=null;
			this.method=null;
			this.args=null;
			return this;
		}

		/**
		*清理并回收到 Handler 对象池内。
		*/
		__proto.recover=function(){
			if (this._id > 0){
				this._id=0;
				Handler._pool.push(this.clear());
			}
		}

		Handler.create=function(caller,method,args,once){
			(once===void 0)&& (once=true);
			if (Handler._pool.length)return Handler._pool.pop().setTo(caller,method,args,once);
			return new Handler(caller,method,args,once);
		}

		Handler._pool=[];
		Handler._gid=1;
		return Handler;
	})()


	//class laya.utils.HitArea
	var HitArea=(function(){
		function HitArea(){
			this._hit=null;
			this._unHit=null;
		}

		__class(HitArea,'laya.utils.HitArea');
		var __proto=HitArea.prototype;
		/**
		*是否包含某个点
		*@param x x坐标
		*@param y y坐标
		*@return 是否点击到
		*/
		__proto.isHit=function(x,y){
			if (!HitArea.isHitGraphic(x,y,this.hit))return false;
			return !HitArea.isHitGraphic(x,y,this.unHit);
		}

		/**
		*检测对象是否包含指定的点。
		*@param x 点的 X 轴坐标值（水平位置）。
		*@param y 点的 Y 轴坐标值（垂直位置）。
		*@return 如果包含指定的点，则值为 true；否则为 false。
		*/
		__proto.contains=function(x,y){
			return this.isHit(x,y);
		}

		/**
		*可点击区域，可以设置绘制一系列矢量图作为点击区域（目前只支持圆形，矩形，多边形）
		*/
		__getset(0,__proto,'hit',function(){
			if (!this._hit)this._hit=new Graphics();
			return this._hit;
			},function(value){
			this._hit=value;
		});

		/**
		*不可点击区域，可以设置绘制一系列矢量图作为非点击区域（目前只支持圆形，矩形，多边形）
		*/
		__getset(0,__proto,'unHit',function(){
			if (!this._unHit)this._unHit=new Graphics();
			return this._unHit;
			},function(value){
			this._unHit=value;
		});

		HitArea.isHitGraphic=function(x,y,graphic){
			if (!graphic)return false;
			var cmds;
			cmds=graphic.cmds;
			if (!cmds && graphic._one){
				cmds=HitArea._cmds;
				cmds.length=1;
				cmds[0]=graphic._one;
			}
			if (!cmds)return false;
			var i=0,len=0;
			len=cmds.length;
			var cmd;
			for (i=0;i < len;i++){
				cmd=cmds[i];
				if (!cmd)continue ;
				var context=Render._context;
				switch (cmd.callee){
					case context._translate:
					case 6:
						x-=cmd[0];
						y-=cmd[1];
					default :
					}
				if (HitArea.isHitCmd(x,y,cmd))return true;
			}
			return false;
		}

		HitArea.isHitCmd=function(x,y,cmd){
			if (!cmd)return false;
			var context=Render._context;
			var rst=false;
			switch (cmd["callee"]){
				case context._drawRect:
				case 13:
					HitArea._rec.setTo(cmd[0],cmd[1],cmd[2],cmd[3]);
					rst=HitArea._rec.contains(x,y);
					break ;
				case context._drawCircle:
				case context._fillCircle:
				case 14:;
					var d=NaN;
					x-=cmd[0];
					y-=cmd[1];
					d=x *x+y *y;
					rst=d < cmd[2] *cmd[2];
					break ;
				case context._drawPoly:
				case 18:
					x-=cmd[0];
					y-=cmd[1];
					rst=HitArea.ptInPolygon(x,y,cmd[2]);
					break ;
				default :
					break ;
				}
			return rst;
		}

		HitArea.ptInPolygon=function(x,y,areaPoints){
			var p;
			p=HitArea._ptPoint;
			p.setTo(x,y);
			var nCross=0;
			var p1x=NaN,p1y=NaN,p2x=NaN,p2y=NaN;
			var len=0;
			len=areaPoints.length;
			for (var i=0;i < len;i+=2){
				p1x=areaPoints[i];
				p1y=areaPoints[i+1];
				p2x=areaPoints[(i+2)% len];
				p2y=areaPoints[(i+3)% len];
				if (p1y==p2y)
					continue ;
				if (p.y < Math.min(p1y,p2y))
					continue ;
				if (p.y >=Math.max(p1y,p2y))
					continue ;
				var tx=(p.y-p1y)*(p2x-p1x)/ (p2y-p1y)+p1x;
				if (tx > p.x){
					nCross++;
				}
			}
			return (nCross % 2==1);
		}

		HitArea._cmds=[];
		__static(HitArea,
		['_rec',function(){return this._rec=new Rectangle();},'_ptPoint',function(){return this._ptPoint=new Point();}
		]);
		return HitArea;
	})()


	//class laya.utils.HTMLChar
	var HTMLChar=(function(){
		function HTMLChar(char,w,h,style){
			//this._sprite=null;
			//this._x=NaN;
			//this._y=NaN;
			//this._w=NaN;
			//this._h=NaN;
			//this.isWord=false;
			//this.char=null;
			//this.charNum=NaN;
			//this.style=null;
			this.char=char;
			this.charNum=char.charCodeAt(0);
			this._x=this._y=0;
			this.width=w;
			this.height=h;
			this.style=style;
			this.isWord=!HTMLChar._isWordRegExp.test(char);
		}

		__class(HTMLChar,'laya.utils.HTMLChar');
		var __proto=HTMLChar.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		/**
		*设置与此对象绑定的显示对象 <code>Sprite</code> 。
		*@param sprite 显示对象 <code>Sprite</code> 。
		*/
		__proto.setSprite=function(sprite){
			this._sprite=sprite;
		}

		/**
		*获取与此对象绑定的显示对象 <code>Sprite</code>。
		*@return
		*/
		__proto.getSprite=function(){
			return this._sprite;
		}

		/**@private */
		__proto._isChar=function(){
			return true;
		}

		/**@private */
		__proto._getCSSStyle=function(){
			return this.style;
		}

		/**
		*宽度。
		*/
		__getset(0,__proto,'width',function(){
			return this._w;
			},function(value){
			this._w=value;
		});

		/**
		*此对象存储的 X 轴坐标值。
		*当设置此值时，如果此对象有绑定的 Sprite 对象，则改变 Sprite 对象的属性 x 的值。
		*/
		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			if (this._sprite){
				this._sprite.x=value;
			}
			this._x=value;
		});

		/**
		*此对象存储的 Y 轴坐标值。
		*当设置此值时，如果此对象有绑定的 Sprite 对象，则改变 Sprite 对象的属性 y 的值。
		*/
		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			if (this._sprite){
				this._sprite.y=value;
			}
			this._y=value;
		});

		/**
		*高度。
		*/
		__getset(0,__proto,'height',function(){
			return this._h;
			},function(value){
			this._h=value;
		});

		HTMLChar._isWordRegExp=new RegExp("[\\w\.]","");
		return HTMLChar;
	})()


	//class laya.utils.Mouse
	var Mouse=(function(){
		function Mouse(){}
		__class(Mouse,'laya.utils.Mouse');
		/**
		*设置鼠标样式
		*@param cursorStr
		*例如auto move no-drop col-resize
		*all-scroll pointer not-allowed row-resize
		*crosshair progress e-resize ne-resize
		*default text n-resize nw-resize
		*help vertical-text s-resize se-resize
		*inherit wait w-resize sw-resize
		*
		*/
		__getset(1,Mouse,'cursor',function(){
			return Mouse._style.cursor;
			},function(cursorStr){
			Mouse._style.cursor=cursorStr;
		});

		Mouse.hide=function(){
			if (Mouse.cursor !="none"){
				Mouse._preCursor=Mouse.cursor;
				Mouse.cursor="none";
			}
		}

		Mouse.show=function(){
			if (Mouse.cursor=="none"){
				if (Mouse._preCursor){
					Mouse.cursor=Mouse._preCursor;
					}else{
					Mouse.cursor="auto";
				}
			}
		}

		Mouse._preCursor=null
		__static(Mouse,
		['_style',function(){return this._style=Browser.document.body.style;}
		]);
		return Mouse;
	})()


	//class laya.utils.Pool
	var Pool=(function(){
		function Pool(){};
		__class(Pool,'laya.utils.Pool');
		Pool.getPoolBySign=function(sign){
			return Pool._poolDic[sign] || (Pool._poolDic[sign]=[]);
		}

		Pool.clearBySign=function(sign){
			if (Pool._poolDic[sign])Pool._poolDic[sign].length=0;
		}

		Pool.recover=function(sign,item){
			if (item["__InPool"])return;
			item["__InPool"]=true;
			Pool.getPoolBySign(sign).push(item);
		}

		Pool.getItemByClass=function(sign,cls){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():new cls();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItemByCreateFun=function(sign,createFun){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():createFun();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItem=function(sign){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():null;
			if (rst){
				rst["__InPool"]=false;
			}
			return rst;
		}

		Pool._poolDic={};
		Pool.InPoolSign="__InPool";
		return Pool;
	})()


	//class laya.utils.RunDriver
	var RunDriver=(function(){
		function RunDriver(){};
		__class(RunDriver,'laya.utils.RunDriver');
		RunDriver.FILTER_ACTIONS=[];
		RunDriver.pixelRatio=-1;
		RunDriver._charSizeTestDiv=null
		RunDriver.now=function(){
			return Date.now();
		}

		RunDriver.getWindow=function(){
			return window;
		}

		RunDriver.getPixelRatio=function(){
			if (RunDriver.pixelRatio < 0){
				var ctx=Browser.context;
				var backingStore=ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
				RunDriver.pixelRatio=(Browser.window.devicePixelRatio || 1)/ backingStore;
				if(RunDriver.pixelRatio<1)RunDriver.pixelRatio=1;
			}
			return RunDriver.pixelRatio;
		}

		RunDriver.getIncludeStr=function(name){
			return null;
		}

		RunDriver.createShaderCondition=function(conditionScript){
			var fn="(function() {return "+conditionScript+";})";
			return Browser.window.eval(fn);
		}

		RunDriver.fontMap=[];
		RunDriver.measureText=function(txt,font){
			var isChinese=RunDriver.hanzi.test(txt);
			if (isChinese && RunDriver.fontMap[font]){
				return RunDriver.fontMap[font];
			};
			var ctx=Browser.context;
			ctx.font=font;
			var r=ctx.measureText(txt);
			if (isChinese)RunDriver.fontMap[font]=r;
			return r;
		}

		RunDriver.getWebGLContext=function(canvas){
		};

		RunDriver.beginFlush=function(){
		};

		RunDriver.endFinish=function(){
		};

		RunDriver.addToAtlas=null
		RunDriver.flashFlushImage=function(atlasWebGLCanvas){
		};

		RunDriver.drawToCanvas=function(sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
			var canvas=HTMLCanvas.create("2D");
			var context=new RenderContext(canvasWidth,canvasHeight,canvas);
			RenderSprite.renders[_renderType]._fun(sprite,context,offsetX,offsetY);
			return canvas;
		}

		RunDriver.createParticleTemplate2D=null
		RunDriver.createGLTextur=null;
		RunDriver.createWebGLContext2D=null;
		RunDriver.changeWebGLSize=function(w,h){
		};

		RunDriver.createRenderSprite=function(type,next){
			return new RenderSprite(type,next);
		}

		RunDriver.createFilterAction=function(type){
			return new ColorFilterAction();
		}

		RunDriver.createGraphics=function(){
			return new Graphics();
		}

		RunDriver.clear=function(value){
			Render._context.ctx.clear();
		}

		RunDriver.clearAtlas=function(value){
		};

		RunDriver.addTextureToAtlas=function(value){
		};

		RunDriver.getTexturePixels=function(value,x,y,width,height){
			return null;
		}

		RunDriver.skinAniSprite=function(){
			return null;
		}

		__static(RunDriver,
		['hanzi',function(){return this.hanzi=new RegExp("^[\u4E00-\u9FA5]$");}
		]);
		return RunDriver;
	})()


	//class laya.utils.Stat
	var Stat=(function(){
		function Stat(){};
		__class(Stat,'laya.utils.Stat');
		/**
		*点击帧频显示区域的处理函数。
		*/
		__getset(1,Stat,'onclick',null,function(fn){
			Stat._canvas.source.onclick=fn;
			Stat._canvas.source.style.pointerEvents='';
		});

		Stat.show=function(x,y){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			if (Render.isConchApp){
				conch.showFPS&&conch.showFPS(x,y);
				return;
			};
			var pixel=Browser.pixelRatio;
			Stat._width=pixel *130;
			Stat._vx=pixel *75;
			Stat._view[0]={title:"FPS(Canvas)",value:"_fpsStr",color:"yellow",units:"int"};
			Stat._view[1]={title:"Sprite",value:"spriteCount",color:"white",units:"int"};
			Stat._view[2]={title:"DrawCall",value:"drawCall",color:"white",units:"int"};
			Stat._view[3]={title:"CurMem",value:"currentMemorySize",color:"yellow",units:"M"};
			if (Render.isWebGL){
				Stat._view[4]={title:"Shader",value:"shaderCall",color:"white",units:"int"};
				if (!Render.is3DMode){
					Stat._view[0].title="FPS(WebGL)";
					Stat._view[5]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
					}else {
					Stat._view[0].title="FPS(3D)";
					Stat._view[5]={title:"TriFaces",value:"trianglesFaces",color:"white",units:"int"};
					Stat._view[6]={title:"treeNodeColl",value:"treeNodeCollision",color:"white",units:"int"};
					Stat._view[7]={title:"treeSpriteColl",value:"treeSpriteCollision",color:"white",units:"int"};
				}
				}else {
				Stat._view[4]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
			}
			Stat._fontSize=12 *pixel;
			for (var i=0;i < Stat._view.length;i++){
				Stat._view[i].x=4;
				Stat._view[i].y=i *Stat._fontSize+2 *pixel;
			}
			Stat._height=pixel *(Stat._view.length *12+3 *pixel)+4;
			if (!Stat._canvas){
				Stat._canvas=new HTMLCanvas('2D');
				Stat._canvas.size(Stat._width,Stat._height);
				Stat._ctx=Stat._canvas.getContext('2d');
				Stat._ctx.textBaseline="top";
				Stat._ctx.font=Stat._fontSize+"px Sans-serif";
				Stat._canvas.source.style.cssText="pointer-events:none;background:rgba(150,150,150,0.8);z-index:100000;position: absolute;left:"+x+"px;top:"+y+"px;width:"+(Stat._width / pixel)+"px;height:"+(Stat._height / pixel)+"px;";
			}
			Stat._first=true;
			Stat.loop();
			Stat._first=false;
			Browser.container.appendChild(Stat._canvas.source);
			Stat.enable();
		}

		Stat.enable=function(){
			Laya.timer.frameLoop(1,Stat,Stat.loop);
		}

		Stat.hide=function(){
			if (Stat._canvas){
				Browser.removeElement(Stat._canvas.source);
				Laya.timer.clear(Stat,Stat.loop);
			}
		}

		Stat.clear=function(){
			Stat.trianglesFaces=Stat.drawCall=Stat.shaderCall=Stat.spriteCount=Stat.treeNodeCollision=Stat.treeSpriteCollision=Stat.canvasNormal=Stat.canvasBitmap=Stat.canvasReCache=0;
		}

		Stat.loop=function(){
			Stat._count++;
			var timer=Browser.now();
			if (timer-Stat._timer < 1000)return;
			var count=Stat._count;
			Stat.FPS=Math.round((count *1000)/ (timer-Stat._timer));
			if (Stat._canvas){
				Stat.trianglesFaces=Math.round(Stat.trianglesFaces / count);
				Stat.drawCall=Math.round(Stat.drawCall / count)-2;
				Stat.shaderCall=Math.round(Stat.shaderCall / count);
				Stat.spriteCount=Math.round(Stat.spriteCount / count)-1;
				Stat.canvasNormal=Math.round(Stat.canvasNormal / count);
				Stat.canvasBitmap=Math.round(Stat.canvasBitmap / count);
				Stat.canvasReCache=Math.ceil(Stat.canvasReCache / count);
				Stat.treeNodeCollision=Math.round(Stat.treeNodeCollision / count);
				Stat.treeSpriteCollision=Math.round(Stat.treeSpriteCollision / count);
				var delay=Stat.FPS > 0?Math.floor(1000 / Stat.FPS).toString():" ";
				Stat._fpsStr=Stat.FPS+(Stat.renderSlow ? " slow" :"")+" "+delay;
				Stat._canvasStr=Stat.canvasReCache+"/"+Stat.canvasNormal+"/"+Stat.canvasBitmap;
				Stat.currentMemorySize=ResourceManager.systemResourceManager.memorySize;
				var ctx=Stat._ctx;
				ctx.clearRect(Stat._first ? 0 :Stat._vx,0,Stat._width,Stat._height);
				for (var i=0;i < Stat._view.length;i++){
					var one=Stat._view[i];
					if (Stat._first){
						ctx.fillStyle="white";
						ctx.fillText(one.title,one.x,one.y,null,null,null);
					}
					ctx.fillStyle=one.color;
					var value=Stat[one.value];
					(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
					ctx.fillText(value+"",one.x+Stat._vx,one.y,null,null,null);
				}
				Stat.clear();
			}
			Stat._count=0;
			Stat._timer=timer;
		}

		Stat.FPS=0;
		Stat.loopCount=0;
		Stat.shaderCall=0;
		Stat.drawCall=0;
		Stat.trianglesFaces=0;
		Stat.spriteCount=0;
		Stat.treeNodeCollision=0;
		Stat.treeSpriteCollision=0;
		Stat.canvasNormal=0;
		Stat.canvasBitmap=0;
		Stat.canvasReCache=0;
		Stat.renderSlow=false;
		Stat.currentMemorySize=0;
		Stat._fpsStr=null
		Stat._canvasStr=null
		Stat._canvas=null
		Stat._ctx=null
		Stat._timer=0;
		Stat._count=0;
		Stat._width=0;
		Stat._height=100;
		Stat._view=[];
		Stat._fontSize=12;
		Stat._first=false;
		Stat._vx=NaN
		return Stat;
	})()


	//class laya.utils.Timer
	var Timer=(function(){
		var TimerHandler;
		function Timer(){
			this._delta=0;
			this.scale=1;
			this.currFrame=0;
			this._mid=1;
			this._map=[];
			this._laters=[];
			this._handlers=[];
			this._temp=[];
			this._count=0;
			this.currTimer=Browser.now();
			this._lastTimer=Browser.now();
			Laya.timer && Laya.timer.frameLoop(1,this,this._update);
		}

		__class(Timer,'laya.utils.Timer');
		var __proto=Timer.prototype;
		/**
		*@private
		*帧循环处理函数。
		*/
		__proto._update=function(){
			if (this.scale <=0){
				this._lastTimer=Browser.now();
				return;
			};
			var frame=this.currFrame=this.currFrame+this.scale;
			var now=Browser.now();
			this._delta=(now-this._lastTimer)*this.scale;
			var timer=this.currTimer=this.currTimer+this._delta;
			this._lastTimer=now;
			var handlers=this._handlers;
			this._count=0;
			for (i=0,n=handlers.length;i < n;i++){
				handler=handlers[i];
				if (handler.method!==null){
					var t=handler.userFrame ? frame :timer;
					if (t >=handler.exeTime){
						if (handler.repeat){
							if (t > handler.exeTime){
								handler.exeTime+=handler.delay;
								handler.run(false);
								if (t > handler.exeTime){
									handler.exeTime+=Math.ceil((t-handler.exeTime)/ handler.delay)*handler.delay;
								}
							}
							}else {
							handler.run(true);
						}
					}
					}else {
					this._count++;
				}
			}
			if (this._count > 30 || frame % 200===0)this._clearHandlers();
			var laters=this._laters;
			for (var i=0,n=laters.length-1;i <=n;i++){
				var handler=laters[i];
				if (handler.method!==null){
					this._map[handler.key]=null;
					handler.run(false);
				}
				this._recoverHandler(handler);
				i===n && (n=laters.length-1);
			}
			laters.length=0;
		}

		/**@private */
		__proto._clearHandlers=function(){
			var handlers=this._handlers;
			for (var i=0,n=handlers.length;i < n;i++){
				var handler=handlers[i];
				if (handler.method!==null)this._temp.push(handler);
				else this._recoverHandler(handler);
			}
			this._handlers=this._temp;
			this._temp=handlers;
			this._temp.length=0;
		}

		/**@private */
		__proto._recoverHandler=function(handler){
			if(this._map[handler.key]==handler)this._map[handler.key]=null;
			handler.clear();
			Timer._pool.push(handler);
		}

		/**@private */
		__proto._create=function(useFrame,repeat,delay,caller,method,args,coverBefore){
			if (!delay){
				method.apply(caller,args);
				return;
			}
			if (coverBefore){
				var handler=this._getHandler(caller,method);
				if (handler){
					handler.repeat=repeat;
					handler.userFrame=useFrame;
					handler.delay=delay;
					handler.caller=caller;
					handler.method=method;
					handler.args=args;
					handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer+Browser.now()-this._lastTimer);
					return;
				}
			}
			handler=Timer._pool.length > 0 ? Timer._pool.pop():new TimerHandler();
			handler.repeat=repeat;
			handler.userFrame=useFrame;
			handler.delay=delay;
			handler.caller=caller;
			handler.method=method;
			handler.args=args;
			handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer+Browser.now()-this._lastTimer);
			this._indexHandler(handler);
			this._handlers.push(handler);
		}

		/**@private */
		__proto._indexHandler=function(handler){
			var caller=handler.caller;
			var method=handler.method;
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			handler.key=cid+mid;
			this._map[handler.key]=handler;
		}

		/**
		*定时执行一次。
		*@param delay 延迟时间(单位为毫秒)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.once=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行。
		*@param delay 间隔时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.loop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行一次(基于帧率)。
		*@param delay 延迟几帧(单位为帧)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行(基于帧率)。
		*@param delay 间隔几帧(单位为帧)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**返回统计信息。*/
		__proto.toString=function(){
			return "callLater:"+this._laters.length+" handlers:"+this._handlers.length+" pool:"+Timer._pool.length;
		}

		/**
		*清理定时器。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*/
		__proto.clear=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler){
				this._map[handler.key]=null;handler.key=0;
				handler.clear();
			}
		}

		/**
		*清理对象身上的所有定时器。
		*@param caller 执行域(this)。
		*/
		__proto.clearAll=function(caller){
			if (!caller)return;
			for (var i=0,n=this._handlers.length;i < n;i++){
				var handler=this._handlers[i];
				if (handler.caller===caller){
					this._map[handler.key]=null;handler.key=0;
					handler.clear();
				}
			}
		}

		/**@private */
		__proto._getHandler=function(caller,method){
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			return this._map[cid+mid];
		}

		/**
		*延迟执行。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*/
		__proto.callLater=function(caller,method,args){
			if (this._getHandler(caller,method)==null){
				if (Timer._pool.length)
					var handler=Timer._pool.pop();
				else handler=new TimerHandler();
				handler.caller=caller;
				handler.method=method;
				handler.args=args;
				this._indexHandler(handler);
				this._laters.push(handler);
			}
		}

		/**
		*立即执行 callLater 。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*/
		__proto.runCallLater=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler && handler.method !=null){
				this._map[handler.key]=null;
				handler.run(true);
			}
		}

		/**
		*立即提前执行定时器，执行之后从队列中删除
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*/
		__proto.runTimer=function(caller,method){
			this.runCallLater(caller,method);
		}

		/**
		*两帧之间的时间间隔,单位毫秒。
		*/
		__getset(0,__proto,'delta',function(){
			return this._delta;
		});

		Timer._pool=[];
		Timer.__init$=function(){
			/**@private */
			//class TimerHandler
			TimerHandler=(function(){
				function TimerHandler(){
					this.key=0;
					this.repeat=false;
					this.delay=0;
					this.userFrame=false;
					this.exeTime=0;
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__class(TimerHandler,'');
				var __proto=TimerHandler.prototype;
				__proto.clear=function(){
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__proto.run=function(withClear){
					var caller=this.caller;
					if (caller && caller.destroyed)return this.clear();
					var method=this.method;
					var args=this.args;
					withClear && this.clear();
					if (method==null)return;
					args ? method.apply(caller,args):method.call(caller);
				}
				return TimerHandler;
			})()
		}

		return Timer;
	})()


	//class laya.utils.Tween
	var Tween=(function(){
		function Tween(){
			//this._complete=null;
			//this._target=null;
			//this._ease=null;
			//this._props=null;
			//this._duration=0;
			//this._delay=0;
			//this._startTimer=0;
			//this._usedTimer=0;
			//this._usedPool=false;
			this.gid=0;
			//this.update=null;
		}

		__class(Tween,'laya.utils.Tween');
		var __proto=Tween.prototype;
		/**
		*缓动对象的props属性到目标值。
		*@param target 目标对象(即将更改属性值的对象)。
		*@param props 变化的属性列表，比如{x:100,y:20,ease:Ease.backOut,complete:Handler.create(this,onComplete),update:new Handler(this,onComplete)}。
		*@param duration 花费的时间，单位毫秒。
		*@param ease 缓动类型，默认为匀速运动。
		*@param complete 结束回调函数。
		*@param delay 延迟执行时间。
		*@param coverBefore 是否覆盖之前的缓动。
		*@return 返回Tween对象。
		*/
		__proto.to=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,true,false,true);
		}

		/**
		*从props属性，缓动到当前状态。
		*@param target 目标对象(即将更改属性值的对象)。
		*@param props 变化的属性列表，比如{x:100,y:20,ease:Ease.backOut,complete:Handler.create(this,onComplete),update:new Handler(this,onComplete)}。
		*@param duration 花费的时间，单位毫秒。
		*@param ease 缓动类型，默认为匀速运动。
		*@param complete 结束回调函数。
		*@param delay 延迟执行时间。
		*@param coverBefore 是否覆盖之前的缓动。
		*@return 返回Tween对象。
		*/
		__proto.from=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,false,false,true);
		}

		/**@private */
		__proto._create=function(target,props,duration,ease,complete,delay,coverBefore,isTo,usePool,runNow){
			if (!target)throw new Error("Tween:target is null");
			this._target=target;
			this._duration=duration;
			this._ease=ease || props.ease || Tween.easeNone;
			this._complete=complete || props.complete;
			this._delay=delay;
			this._props=[];
			this._usedTimer=0;
			this._startTimer=Browser.now();
			this._usedPool=usePool;
			this.update=props.update;
			var gid=(target.$_GID || (target.$_GID=Utils.getGID()));
			if (!Tween.tweenMap[gid]){
				Tween.tweenMap[gid]=[this];
				}else {
				if (coverBefore)Tween.clearTween(target);
				Tween.tweenMap[gid].push(this);
			}
			if (runNow){
				if (delay <=0)this.firstStart(target,props,isTo);
				else Laya.timer.once(delay,this,this.firstStart,[target,props,isTo]);
				}else {
				this._initProps(target,props,isTo);
			}
			return this;
		}

		__proto.firstStart=function(target,props,isTo){
			if (target.destroyed){
				this.clear();
				return;
			}
			this._initProps(target,props,isTo);
			this._beginLoop();
		}

		__proto._initProps=function(target,props,isTo){
			for (var p in props){
				if ((typeof (target[p])=='number')){
					var start=isTo ? target[p] :props[p];
					var end=isTo ? props[p] :target[p];
					this._props.push([p,start,end-start]);
					if (!isTo)target[p]=start;
				}
			}
		}

		__proto._beginLoop=function(){
			Laya.timer.frameLoop(1,this,this._doEase);
		}

		/**执行缓动**/
		__proto._doEase=function(){
			this._updateEase(Browser.now());
		}

		/**@private */
		__proto._updateEase=function(time){
			var target=this._target;
			if (!target)return;
			if (target.destroyed)return Tween.clearTween(target);
			var usedTimer=this._usedTimer=time-this._startTimer-this._delay;
			if (usedTimer < 0)return;
			if (usedTimer >=this._duration)return this.complete();
			var ratio=usedTimer > 0 ? this._ease(usedTimer,0,1,this._duration):0;
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+(ratio *prop[2]);
			}
			if (this.update)this.update.run();
		}

		/**
		*立即结束缓动并到终点。
		*/
		__proto.complete=function(){
			if (!this._target)return;
			Laya.timer.runTimer(this,this.firstStart);
			var target=this._target;
			var props=this._props;
			var handler=this._complete;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+prop[2];
			}
			if (this.update)this.update.run();
			this.clear();
			handler && handler.run();
		}

		/**
		*暂停缓动，可以通过resume或restart重新开始。
		*/
		__proto.pause=function(){
			Laya.timer.clear(this,this._beginLoop);
			Laya.timer.clear(this,this._doEase);
		}

		/**
		*设置开始时间。
		*@param startTime 开始时间。
		*/
		__proto.setStartTime=function(startTime){
			this._startTimer=startTime;
		}

		/**
		*停止并清理当前缓动。
		*/
		__proto.clear=function(){
			if (this._target){
				this._remove();
				this._clear();
			}
		}

		/**
		*@private
		*/
		__proto._clear=function(){
			this.pause();
			Laya.timer.clear(this,this.firstStart);
			this._complete=null;
			this._target=null;
			this._ease=null;
			this._props=null;
			if (this._usedPool){
				this.update=null;
				Pool.recover("tween",this);
			}
		}

		/**回收到对象池。*/
		__proto.recover=function(){
			this._usedPool=true;
			this._clear();
		}

		__proto._remove=function(){
			var tweens=Tween.tweenMap[this._target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					if (tweens[i]===this){
						tweens.splice(i,1);
						break ;
					}
				}
			}
		}

		/**
		*重新开始暂停的缓动。
		*/
		__proto.restart=function(){
			this.pause();
			this._usedTimer=0;
			this._startTimer=Browser.now();
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				this._target[prop[0]]=prop[1];
			}
			Laya.timer.once(this._delay,this,this._beginLoop);
		}

		/**
		*恢复暂停的缓动。
		*/
		__proto.resume=function(){
			if (this._usedTimer >=this._duration)return;
			this._startTimer=Browser.now()-this._usedTimer-this._delay;
			this._beginLoop();
		}

		/**设置当前执行比例**/
		__getset(0,__proto,'progress',null,function(v){
			var uTime=v *this._duration;
			this._startTimer=Browser.now()-this._delay-uTime;
		});

		Tween.to=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(autoRecover===void 0)&& (autoRecover=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,true,autoRecover,true);
		}

		Tween.from=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(autoRecover===void 0)&& (autoRecover=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,false,autoRecover,true);
		}

		Tween.clearAll=function(target){
			if (!target || !target.$_GID)return;
			var tweens=Tween.tweenMap[target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					tweens[i]._clear();
				}
				tweens.length=0;
			}
		}

		Tween.clear=function(tween){
			tween.clear();
		}

		Tween.clearTween=function(target){
			Tween.clearAll(target);
		}

		Tween.easeNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Tween.tweenMap={};
		return Tween;
	})()


	//class laya.utils.Utils
	var Utils=(function(){
		function Utils(){};
		__class(Utils,'laya.utils.Utils');
		Utils.toRadian=function(angle){
			return angle *Utils._pi2;
		}

		Utils.toAngle=function(radian){
			return radian *Utils._pi;
		}

		Utils.toHexColor=function(color){
			if (color < 0 || isNaN(color))return null;
			var str=color.toString(16);
			while (str.length < 6)str="0"+str;
			return "#"+str;
		}

		Utils.getGID=function(){
			return Utils._gid++;
		}

		Utils.concatArray=function(source,array){
			if (!array)return source;
			if (!source)return array;
			var i=0,len=array.length;
			for (i=0;i < len;i++){
				source.push(array[i]);
			}
			return source;
		}

		Utils.clearArray=function(array){
			if (!array)return array;
			array.length=0;
			return array;
		}

		Utils.copyArray=function(source,array){
			source || (source=[]);
			if (!array)return source;
			source.length=array.length;
			var i=0,len=array.length;
			for (i=0;i < len;i++){
				source[i]=array[i];
			}
			return source;
		}

		Utils.getGlobalRecByPoints=function(sprite,x0,y0,x1,y1){
			var newLTPoint;
			newLTPoint=new Point(x0,y0);
			newLTPoint=sprite.localToGlobal(newLTPoint);
			var newRBPoint;
			newRBPoint=new Point(x1,y1);
			newRBPoint=sprite.localToGlobal(newRBPoint);
			return Rectangle._getWrapRec([newLTPoint.x,newLTPoint.y,newRBPoint.x,newRBPoint.y]);
		}

		Utils.getGlobalPosAndScale=function(sprite){
			return Utils.getGlobalRecByPoints(sprite,0,0,1,1);
		}

		Utils.bind=function(fun,scope){
			var rst=fun;
			rst=fun.bind(scope);;
			return rst;
		}

		Utils.measureText=function(txt,font){
			return RunDriver.measureText(txt,font);
		}

		Utils.updateOrder=function(array){
			if (!array || array.length < 2)return false;
			var i=1,j=0,len=array.length,key=NaN,c;
			while (i < len){
				j=i;
				c=array[j];
				key=array[j]._zOrder;
				while (--j >-1){
					if (array[j]._zOrder > key)array[j+1]=array[j];
					else break ;
				}
				array[j+1]=c;
				i++;
			};
			var model=c.parent.conchModel;
			if (model){
				if (model.updateZOrder !=null){
					model.updateZOrder();
				}
				else{
					for (i=0;i < len;i++){
						model.removeChild(array[i].conchModel);
					}
					for (i=0;i < len;i++){
						model.addChildAt(array[i].conchModel,i);
					}
				}
			}
			return true;
		}

		Utils.transPointList=function(points,x,y){
			var i=0,len=points.length;
			for (i=0;i < len;i+=2){
				points[i]+=x;
				points[i+1]+=y;
			}
		}

		Utils.parseInt=function(str,radix){
			(radix===void 0)&& (radix=0);
			var result=Browser.window.parseInt(str,radix);
			if (isNaN(result))return 0;
			return result;
		}

		Utils.getFileExtension=function(path){
			Utils._extReg.lastIndex=path.lastIndexOf(".");
			var result=Utils._extReg.exec(path);
			if (result && result.length > 1){
				return result[1].toLowerCase();
			}
			return null;
		}

		Utils.getTransformRelativeToWindow=function(coordinateSpace,x,y){
			var stage=Laya.stage;
			var globalTransform=laya.utils.Utils.getGlobalPosAndScale(coordinateSpace);
			var canvasMatrix=stage._canvasTransform.clone();
			var canvasLeft=canvasMatrix.tx;
			var canvasTop=canvasMatrix.ty;
			canvasMatrix.rotate(-Math.PI / 180 *Laya.stage.canvasDegree);
			canvasMatrix.scale(Laya.stage.clientScaleX,Laya.stage.clientScaleY);
			var perpendicular=(Laya.stage.canvasDegree % 180 !=0);
			var tx=NaN,ty=NaN;
			if (perpendicular){
				tx=y+globalTransform.y;
				ty=x+globalTransform.x;
				tx *=canvasMatrix.d;
				ty *=canvasMatrix.a;
				if (Laya.stage.canvasDegree==90){
					tx=canvasLeft-tx;
					ty+=canvasTop;
				}
				else{
					tx+=canvasLeft;
					ty=canvasTop-ty;
				}
			}
			else{
				tx=x+globalTransform.x;
				ty=y+globalTransform.y;
				tx *=canvasMatrix.a;
				ty *=canvasMatrix.d;
				tx+=canvasLeft;
				ty+=canvasTop;
			}
			ty+=Laya.stage['_safariOffsetY'];
			var domScaleX=NaN,domScaleY=NaN;
			if (perpendicular){
				domScaleX=canvasMatrix.d *globalTransform.height;
				domScaleY=canvasMatrix.a *globalTransform.width;
			}
			else{
				domScaleX=canvasMatrix.a *globalTransform.width;
				domScaleY=canvasMatrix.d *globalTransform.height;
			}
			return {
				x:tx,
				y:ty,
				scaleX:domScaleX,
				scaleY:domScaleY
			};
		}

		Utils.fitDOMElementInArea=function(dom,coordinateSpace,x,y,width,height){
			if (!dom._fitLayaAirInitialized){
				dom._fitLayaAirInitialized=true;
				dom.style.transformOrigin=dom.style.webKittransformOrigin="left top";
				dom.style.position="absolute"
			};
			var transform=Utils.getTransformRelativeToWindow(coordinateSpace,x,y);
			dom.style.transform=dom.style.webkitTransform="scale("+transform.scaleX+","+transform.scaleY+") rotate("+(Laya.stage.canvasDegree)+"deg)";
			dom.style.width=width+'px';
			dom.style.height=height+'px';
			dom.style.left=transform.x+'px';
			dom.style.top=transform.y+'px';
		}

		Utils._gid=1;
		Utils._pi=180 / Math.PI;
		Utils._pi2=Math.PI / 180;
		Utils._extReg=/\.(\w+)\??/g;
		Utils.parseXMLFromString=function(value){
			var rst;
			value=value.replace(/>\s+</g,'><');
			rst=(new DOMParser()).parseFromString(value,'text/xml');
			if (rst.firstChild.textContent.indexOf("This page contains the following errors")>-1){
				throw new Error(rst.firstChild.firstChild.textContent);
			}
			return rst;
		}

		return Utils;
	})()


	//class laya.utils.VectorGraphManager
	var VectorGraphManager=(function(){
		function VectorGraphManager(){
			this.useDic={};
			this.shapeDic={};
			this.shapeLineDic={};
			this._id=0;
			this._checkKey=false;
			this._freeIdArray=[];
			if (Render.isWebGL){
				CacheManger.regCacheByFunction(Utils.bind(this.startDispose,this),Utils.bind(this.getCacheList,this));
			}
		}

		__class(VectorGraphManager,'laya.utils.VectorGraphManager');
		var __proto=VectorGraphManager.prototype;
		/**
		*得到个空闲的ID
		*@return
		*/
		__proto.getId=function(){
			return this._id++;
		}

		/**
		*添加一个图形到列表中
		*@param id
		*@param shape
		*/
		__proto.addShape=function(id,shape){
			this.shapeDic[id]=shape;
			if (!this.useDic[id]){
				this.useDic[id]=true;
			}
		}

		/**
		*添加一个线图形到列表中
		*@param id
		*@param Line
		*/
		__proto.addLine=function(id,Line){
			this.shapeLineDic[id]=Line;
			if (!this.shapeLineDic[id]){
				this.shapeLineDic[id]=true;
			}
		}

		/**
		*检测一个对象是否在使用中
		*@param id
		*/
		__proto.getShape=function(id){
			if (this._checkKey){
				if (this.useDic[id] !=null){
					this.useDic[id]=true;
				}
			}
		}

		/**
		*删除一个图形对象
		*@param id
		*/
		__proto.deleteShape=function(id){
			if (this.shapeDic[id]){
				this.shapeDic[id]=null;
				delete this.shapeDic[id];
			}
			if (this.shapeLineDic[id]){
				this.shapeLineDic[id]=null;
				delete this.shapeLineDic[id];
			}
			if (this.useDic[id] !=null){
				delete this.useDic[id];
			}
		}

		/**
		*得到缓存列表
		*@return
		*/
		__proto.getCacheList=function(){
			var str;
			var list=[];
			for (str in this.shapeDic){
				list.push(this.shapeDic[str]);
			}
			for (str in this.shapeLineDic){
				list.push(this.shapeLineDic[str]);
			}
			return list;
		}

		/**
		*开始清理状态，准备销毁
		*/
		__proto.startDispose=function(key){
			var str;
			for (str in this.useDic){
				this.useDic[str]=false;
			}
			this._checkKey=true;
		}

		/**
		*确认销毁
		*/
		__proto.endDispose=function(){
			if (this._checkKey){
				var str;
				for (str in this.useDic){
					if (!this.useDic[str]){
						this.deleteShape(str);
					}
				}
				this._checkKey=false;
			}
		}

		VectorGraphManager.getInstance=function(){
			return VectorGraphManager.instance=VectorGraphManager.instance|| new VectorGraphManager();
		}

		VectorGraphManager.instance=null
		return VectorGraphManager;
	})()


	//class laya.utils.WordText
	var WordText=(function(){
		function WordText(){
			this.id=NaN;
			this.save=[];
			this.toUpperCase=null;
			this.changed=false;
			this._text=null;
		}

		__class(WordText,'laya.utils.WordText');
		var __proto=WordText.prototype;
		__proto.setText=function(txt){
			this.changed=true;
			this._text=txt;
		}

		__proto.toString=function(){
			return this._text;
		}

		__proto.charCodeAt=function(i){
			return this._text ? this._text.charCodeAt(i):NaN;
		}

		__proto.charAt=function(i){
			return this._text ? this._text.charAt(i):null;
		}

		__getset(0,__proto,'length',function(){
			return this._text ? this._text.length :0;
		});

		return WordText;
	})()


	//class UIConfig
	var UIConfig=(function(){
		function UIConfig(){};
		__class(UIConfig,'UIConfig');
		UIConfig.touchScrollEnable=true;
		UIConfig.mouseWheelEnable=true;
		UIConfig.showButtons=true;
		UIConfig.popupBgColor="#000000";
		UIConfig.popupBgAlpha=0.5;
		UIConfig.closeDialogOnSide=true;
		return UIConfig;
	})()


	//class circle.Circle extends trade.Trade
	var Circle=(function(_super){
		function Circle(){
			Circle.__super.call(this);
			this.initCircle();
		}

		__class(Circle,'circle.Circle',_super);
		var __proto=Circle.prototype;
		__proto.initCircle=function(){
			var circles=new CircleUI();
			Laya.stage.addChild(circles);
			var data=[];
			for(var m=0;m<20;m++){
				data.push({thumbs_up:m});
			}
			circles.m_list.array=data;
		}

		return Circle;
	})(Trade)


	//class schedule.Schedule extends trade.Trade
	var Schedule=(function(_super){
		function Schedule(){
			this.map=null;
			this.marker=null;
			this.mapDiv=null;
			this.infoText=null;
			Schedule.__super.call(this);
			this.BMap=Browser.window.BMap;
			this.convertor=new this.BMap.Convertor();
			this.initTrade();
		}

		__class(Schedule,'schedule.Schedule',_super);
		var __proto=Schedule.prototype;
		__proto.initTrade=function(){
			this.createDom();
			this.initMap();
			this.createInfoText();
			var successHandler=new Handler(this,this.updatePosition);
			var errorHandler=new Handler(this,this.onError);
			this.convertToBaiduCoord=this.convertToBaiduCoord.bind(this);
			var scheduleUI=new ScheduleUI();
			scheduleUI.scaleX=0.5;
			scheduleUI.scaleY=0.5;
			Laya.stage.addChild(scheduleUI);
			scheduleUI.on("click",this,function(e){
				console.log(e);
			});
		}

		__proto.createDom=function(){
			this.mapDiv=Browser.createElement("div");
			var style=this.mapDiv.style;
			style.position="absolute";
			style.top="0px";
			style.left="0px";
			style.zIndex=-1;
			style.width=Browser.width / Browser.pixelRatio+"px";
			style.height=Laya.stage.height/ Browser.pixelRatio+"px";
			console.log('---------',Browser.width,Browser.height,style.top);
			Browser.document.body.appendChild(this.mapDiv);
		}

		__proto.initMap=function(){
			this.map=new this.BMap.Map(this.mapDiv);
			this.map.centerAndZoom(new this.BMap.Point(116.32715863448607,39.990912172420714),15);
			this.marker=new this.BMap.Marker(new this.BMap.Point(0,0));
			this.map.addOverlay(this.marker);
			var label=new this.BMap.Label("当前位置",{offset:new this.BMap.Size(-15,30)});
			this.marker.setLabel(label);
			function showInfo (e){
				console.log(e.point.lng+", "+e.point.lat);
			}
			this.map.addEventListener("click",showInfo);
		}

		__proto.createInfoText=function(){
			this.infoText=new Text();
			Laya.stage.addChild(this.infoText);
			this.infoText.fontSize=50;
			this.infoText.color="#FFFFFF";
			this.infoText.size(Laya.stage.width,Laya.stage.height);
		}

		// 更新设备位置
		__proto.updatePosition=function(p){
			var point=new this.BMap.Point(p.longitude,p.latitude);
			this.convertor.translate([point],1,5,this.convertToBaiduCoord);
			this.infoText.text=
			"经度："+p.longitude+
			"\t纬度："+p.latitude+
			"\t精度："+p.accuracy+
			"\n海拔："+p.altitude+
			"\t海拔精度："+p.altitudeAccuracy+
			"\n头："+p.heading+
			"\n速度："+p.speed+
			"\n时间戳："+p.timestamp;
		}

		// 将原始坐标转换为百度坐标
		__proto.convertToBaiduCoord=function(data){
			if (data.status==0){
				var position=data.points[0];
				this.marker.setPosition(position);
				this.map.panTo(position);
				this.map.setZoom(17);
			}
		}

		__proto.onError=function(e){
			if (e.code==3)
				alert("获取位置超时");
			else if (e.code==2)
			alert("位置不可用");
			else if (e.code==1)
			alert("无权限");
		}

		return Schedule;
	})(Trade)


	//class laya.display.Node extends laya.events.EventDispatcher
	var Node=(function(_super){
		function Node(){
			this._bits=0;
			this._displayedInStage=false;
			this._parent=null;
			this.conchModel=null;
			this.name="";
			this.destroyed=false;
			Node.__super.call(this);
			this._childs=Node.ARRAY_EMPTY;
			this._$P=Node.PROP_EMPTY;
			this.timer=Laya.timer;
			this.conchModel=Render.isConchNode ? this.createConchModel():null;
		}

		__class(Node,'laya.display.Node',_super);
		var __proto=Node.prototype;
		/**@private */
		__proto._setBit=function(type,value){
			if (type==0x1){
				var preValue=this._getBit(type);
				if (preValue !=value){
					this._updateDisplayedInstage();
				}
			}
			if (value){
				this._bits |=type;
				}else {
				this._bits &=~type;
			}
		}

		/**@private */
		__proto._getBit=function(type){
			return (this._bits & type)!=0;
		}

		/**@private */
		__proto._setUpNoticeChain=function(){
			if (this._getBit(0x1)){
				this._setUpNoticeType(0x1);
			}
		}

		/**@private */
		__proto._setUpNoticeType=function(type){
			var ele=this;
			ele._setBit(type,true);
			ele=ele.parent;
			while (ele){
				if (ele._getBit(type))return;
				ele._setBit(type,true);
				ele=ele.parent;
			}
		}

		/**
		*<p>增加事件侦听器，以使侦听器能够接收事件通知。</p>
		*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args （可选）事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.on=function(type,caller,listener,args){
			if (type==="display" || type==="undisplay"){
				if (!this._getBit(0x1)){
					this._setUpNoticeType(0x1);
				}
			}
			return this._createListener(type,caller,listener,args,false);
		}

		/**
		*<p>增加事件侦听器，以使侦听器能够接收事件通知，此侦听事件响应一次后则自动移除侦听。</p>
		*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args （可选）事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.once=function(type,caller,listener,args){
			if (type==="display" || type==="undisplay"){
				if (!this._getBit(0x1)){
					this._setUpNoticeType(0x1);
				}
			}
			return this._createListener(type,caller,listener,args,true);
		}

		/**@private */
		__proto.createConchModel=function(){
			return null;
		}

		/**
		*<p>销毁此对象。destroy对象默认会把自己从父节点移除，并且清理自身引用关系，等待js自动垃圾回收机制回收。destroy后不能再使用。</p>
		*<p>destroy时会移除自身的事情监听，自身的timer监听，移除子对象及从父节点移除自己。</p>
		*@param destroyChild （可选）是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this.destroyed=true;
			this._parent && this._parent.removeChild(this);
			if (this._childs){
				if (destroyChild)this.destroyChildren();
				else this.removeChildren();
			}
			this._childs=null;
			this._$P=null;
			this.offAll();
			this.timer.clearAll(this);
		}

		/**
		*销毁所有子对象，不销毁自己本身。
		*/
		__proto.destroyChildren=function(){
			if (this._childs){
				for (var i=this._childs.length-1;i >-1;i--){
					this._childs[i].destroy(true);
				}
			}
		}

		/**
		*添加子节点。
		*@param node 节点对象
		*@return 返回添加的节点
		*/
		__proto.addChild=function(node){
			if (!node || this.destroyed || node===this)return node;
			if ((node).zOrder)this._set$P("hasZorder",true);
			if (node._parent===this){
				var index=this.getChildIndex(node);
				if (index!==this._childs.length-1){
					this._childs.splice(index,1);
					this._childs.push(node);
					if (this.conchModel){
						this.conchModel.removeChild(node.conchModel);
						this.conchModel.addChildAt(node.conchModel,this._childs.length-1);
					}
					this._childChanged();
				}
				}else {
				node.parent && node.parent.removeChild(node);
				this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
				this._childs.push(node);
				this.conchModel && this.conchModel.addChildAt(node.conchModel,this._childs.length-1);
				node.parent=this;
				this._childChanged();
			}
			return node;
		}

		/**
		*批量增加子节点
		*@param ...args 无数子节点。
		*/
		__proto.addChildren=function(__args){
			var args=arguments;
			var i=0,n=args.length;
			while (i < n){
				this.addChild(args[i++]);
			}
		}

		/**
		*添加子节点到指定的索引位置。
		*@param node 节点对象。
		*@param index 索引位置。
		*@return 返回添加的节点。
		*/
		__proto.addChildAt=function(node,index){
			if (!node || this.destroyed || node===this)return node;
			if ((node).zOrder)this._set$P("hasZorder",true);
			if (index >=0 && index <=this._childs.length){
				if (node._parent===this){
					var oldIndex=this.getChildIndex(node);
					this._childs.splice(oldIndex,1);
					this._childs.splice(index,0,node);
					if (this.conchModel){
						this.conchModel.removeChild(node.conchModel);
						this.conchModel.addChildAt(node.conchModel,index);
					}
					this._childChanged();
					}else {
					node.parent && node.parent.removeChild(node);
					this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
					this._childs.splice(index,0,node);
					this.conchModel && this.conchModel.addChildAt(node.conchModel,index);
					node.parent=this;
				}
				return node;
				}else {
				throw new Error("appendChildAt:The index is out of bounds");
			}
		}

		/**
		*根据子节点对象，获取子节点的索引位置。
		*@param node 子节点。
		*@return 子节点所在的索引位置。
		*/
		__proto.getChildIndex=function(node){
			return this._childs.indexOf(node);
		}

		/**
		*根据子节点的名字，获取子节点对象。
		*@param name 子节点的名字。
		*@return 节点对象。
		*/
		__proto.getChildByName=function(name){
			var nodes=this._childs;
			if (nodes){
				for (var i=0,n=nodes.length;i < n;i++){
					var node=nodes[i];
					if (node.name===name)return node;
				}
			}
			return null;
		}

		/**@private */
		__proto._get$P=function(key){
			return this._$P[key];
		}

		/**@private */
		__proto._set$P=function(key,value){
			if (!this.destroyed){
				this._$P===Node.PROP_EMPTY && (this._$P={});
				this._$P[key]=value;
			}
			return value;
		}

		/**
		*根据子节点的索引位置，获取子节点对象。
		*@param index 索引位置
		*@return 子节点
		*/
		__proto.getChildAt=function(index){
			return this._childs[index];
		}

		/**
		*设置子节点的索引位置。
		*@param node 子节点。
		*@param index 新的索引。
		*@return 返回子节点本身。
		*/
		__proto.setChildIndex=function(node,index){
			var childs=this._childs;
			if (index < 0 || index >=childs.length){
				throw new Error("setChildIndex:The index is out of bounds.");
			};
			var oldIndex=this.getChildIndex(node);
			if (oldIndex < 0)throw new Error("setChildIndex:node is must child of this object.");
			childs.splice(oldIndex,1);
			childs.splice(index,0,node);
			if (this.conchModel){
				this.conchModel.removeChild(node.conchModel);
				this.conchModel.addChildAt(node.conchModel,index);
			}
			this._childChanged();
			return node;
		}

		/**
		*@private
		*子节点发生改变。
		*@param child 子节点。
		*/
		__proto._childChanged=function(child){}
		/**
		*删除子节点。
		*@param node 子节点
		*@return 被删除的节点
		*/
		__proto.removeChild=function(node){
			if (!this._childs)return node;
			var index=this._childs.indexOf(node);
			return this.removeChildAt(index);
		}

		/**
		*从父容器删除自己，如已经被删除不会抛出异常。
		*@return 当前节点（ Node ）对象。
		*/
		__proto.removeSelf=function(){
			this._parent && this._parent.removeChild(this);
			return this;
		}

		/**
		*根据子节点名字删除对应的子节点对象，如果找不到不会抛出异常。
		*@param name 对象名字。
		*@return 查找到的节点（ Node ）对象。
		*/
		__proto.removeChildByName=function(name){
			var node=this.getChildByName(name);
			node && this.removeChild(node);
			return node;
		}

		/**
		*根据子节点索引位置，删除对应的子节点对象。
		*@param index 节点索引位置。
		*@return 被删除的节点。
		*/
		__proto.removeChildAt=function(index){
			var node=this.getChildAt(index);
			if (node){
				this._childs.splice(index,1);
				this.conchModel && this.conchModel.removeChild(node.conchModel);
				node.parent=null;
			}
			return node;
		}

		/**
		*删除指定索引区间的所有子对象。
		*@param beginIndex 开始索引。
		*@param endIndex 结束索引。
		*@return 当前节点对象。
		*/
		__proto.removeChildren=function(beginIndex,endIndex){
			(beginIndex===void 0)&& (beginIndex=0);
			(endIndex===void 0)&& (endIndex=0x7fffffff);
			if (this._childs && this._childs.length > 0){
				var childs=this._childs;
				if (beginIndex===0 && endIndex >=n){
					var arr=childs;
					this._childs=Node.ARRAY_EMPTY;
					}else {
					arr=childs.splice(beginIndex,endIndex-beginIndex);
				}
				for (var i=0,n=arr.length;i < n;i++){
					arr[i].parent=null;
					this.conchModel && this.conchModel.removeChild(arr[i].conchModel);
				}
			}
			return this;
		}

		/**
		*替换子节点。
		*@internal 将传入的新节点对象替换到已有子节点索引位置处。
		*@param newNode 新节点。
		*@param oldNode 老节点。
		*@return 返回新节点。
		*/
		__proto.replaceChild=function(newNode,oldNode){
			var index=this._childs.indexOf(oldNode);
			if (index >-1){
				this._childs.splice(index,1,newNode);
				if (this.conchModel){
					this.conchModel.removeChild(oldNode.conchModel);
					this.conchModel.addChildAt(newNode.conchModel,index);
				}
				oldNode.parent=null;
				newNode.parent=this;
				return newNode;
			}
			return null;
		}

		/**@private */
		__proto._updateDisplayedInstage=function(){
			var ele;
			ele=this;
			var stage=Laya.stage;
			this._displayedInStage=false;
			while (ele){
				if (ele._getBit(0x1)){
					this._displayedInStage=ele._displayedInStage;
					break ;
				}
				if (ele==stage || ele._displayedInStage){
					this._displayedInStage=true;
					break ;
				}
				ele=ele.parent;
			}
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (this._displayedInStage!==value){
				this._displayedInStage=value;
				if (value)this.event("display");
				else this.event("undisplay");
			}
		}

		/**
		*@private
		*设置指定节点对象是否可见(是否在渲染列表中)。
		*@param node 节点。
		*@param display 是否可见。
		*/
		__proto._displayChild=function(node,display){
			var childs=node._childs;
			if (childs){
				for (var i=0,n=childs.length;i < n;i++){
					var child=childs[i];
					if (!child._getBit(0x1))continue ;
					if (child._childs.length > 0){
						this._displayChild(child,display);
						}else {
						child._setDisplay(display);
					}
				}
			}
			node._setDisplay(display);
		}

		/**
		*当前容器是否包含指定的 <code>Node</code> 节点对象 。
		*@param node 指定的 <code>Node</code> 节点对象 。
		*@return 一个布尔值表示是否包含指定的 <code>Node</code> 节点对象 。
		*/
		__proto.contains=function(node){
			if (node===this)return true;
			while (node){
				if (node.parent===this)return true;
				node=node.parent;
			}
			return false;
		}

		/**
		*定时重复执行某函数。功能同Laya.timer.timerLoop()。
		*@param delay 间隔时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args （可选）回调参数。
		*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true。
		*/
		__proto.timerLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行某函数一次。功能同Laya.timer.timerOnce()。
		*@param delay 延迟时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args （可选）回调参数。
		*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true。
		*/
		__proto.timerOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行某函数(基于帧率)。功能同Laya.timer.frameLoop()。
		*@param delay 间隔几帧(单位为帧)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args （可选）回调参数。
		*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true。
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行一次某函数(基于帧率)。功能同Laya.timer.frameOnce()。
		*@param delay 延迟几帧(单位为帧)。
		*@param caller 执行域(this)
		*@param method 结束时的回调方法
		*@param args （可选）回调参数
		*@param coverBefore （可选）是否覆盖之前的延迟执行，默认为true
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*清理定时器。功能同Laya.timer.clearTimer()。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*/
		__proto.clearTimer=function(caller,method){
			this.timer.clear(caller,method);
		}

		/**
		*子对象数量。
		*/
		__getset(0,__proto,'numChildren',function(){
			return this._childs.length;
		});

		/**父节点。*/
		__getset(0,__proto,'parent',function(){
			return this._parent;
			},function(value){
			if (this._parent!==value){
				if (value){
					this._parent=value;
					this.event("added");
					if (this._getBit(0x1)){
						this._setUpNoticeChain();
						value.displayedInStage && this._displayChild(this,true);
					}
					value._childChanged(this);
					}else {
					this.event("removed");
					this._parent._childChanged();
					if (this._getBit(0x1))this._displayChild(this,false);
					this._parent=value;
				}
			}
		});

		/**表示是否在显示列表中显示。*/
		__getset(0,__proto,'displayedInStage',function(){
			if (this._getBit(0x1))return this._displayedInStage;
			this._setUpNoticeType(0x1);
			return this._displayedInStage;
		});

		Node.ARRAY_EMPTY=[];
		Node.PROP_EMPTY={};
		Node.NOTICE_DISPLAY=0x1;
		Node.MOUSEENABLE=0x2;
		return Node;
	})(EventDispatcher)


	//class laya.resource.Resource extends laya.events.EventDispatcher
	var Resource=(function(_super){
		function Resource(){
			this._id=0;
			this._lastUseFrameCount=0;
			this._memorySize=0;
			this._name=null;
			this._url=null;
			this._loaded=false;
			this._released=false;
			this._disposed=false;
			this._resourceManager=null;
			this.lock=false;
			Resource.__super.call(this);
			this._$1__id=++Resource._uniqueIDCounter;
			Resource._loadedResources.push(this);
			Resource._isLoadedResourcesSorted=false;
			this._released=true;
			this.lock=false;
			this._memorySize=0;
			this._lastUseFrameCount=-1;
			(ResourceManager.currentResourceManager)&& (ResourceManager.currentResourceManager.addResource(this));
		}

		__class(Resource,'laya.resource.Resource',_super);
		var __proto=Resource.prototype;
		Laya.imps(__proto,{"laya.resource.ICreateResource":true,"laya.resource.IDispose":true})
		/**重新创建资源,override it，同时修改memorySize属性、处理startCreate()和compoleteCreate()方法。*/
		__proto.recreateResource=function(){
			this.startCreate();
			this.completeCreate();
		}

		/**销毁资源，override it,同时修改memorySize属性。*/
		__proto.detoryResource=function(){}
		/**
		*激活资源，使用资源前应先调用此函数激活。
		*@param force 是否强制创建。
		*/
		__proto.activeResource=function(force){
			(force===void 0)&& (force=false);
			this._lastUseFrameCount=Stat.loopCount;
			if (this._released || force){
				this.recreateResource();
			}
		}

		/**
		*释放资源。
		*@param force 是否强制释放。
		*@return 是否成功释放。
		*/
		__proto.releaseResource=function(force){
			(force===void 0)&& (force=false);
			if (!force && this.lock)
				return false;
			if (!this._released || force){
				this.detoryResource();
				this._released=true;
				this._lastUseFrameCount=-1;
				this.event("released",this);
				return true;
				}else {
				return false;
			}
		}

		/**
		*设置唯一名字,如果名字重复则自动加上“-copy”。
		*@param newName 名字。
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < Resource._loadedResources.length;i++){
				if (Resource._loadedResources[i]._name!==newName || Resource._loadedResources[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					Resource._isLoadedResourcesSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**
		*@private
		*/
		__proto.onAsynLoaded=function(url,data,params){
			throw new Error("Resource: must override this function!");
		}

		/**
		*<p>彻底处理资源，处理后不能恢复。</p>
		*<p><b>注意：</b>会强制解锁清理。</p>
		*/
		__proto.dispose=function(){
			if (this._resourceManager!==null)
				throw new Error("附属于resourceManager的资源不能独立释放！");
			this._disposed=true;
			this.lock=false;
			this.releaseResource();
			var index=Resource._loadedResources.indexOf(this);
			if (index!==-1){
				Resource._loadedResources.splice(index,1);
				Resource._isLoadedResourcesSorted=false;
			}
			Loader.clearRes(this.url);
		}

		/**开始资源激活。*/
		__proto.startCreate=function(){
			this.event("recovering",this);
		}

		/**完成资源激活。*/
		__proto.completeCreate=function(){
			this._released=false;
			this.event("recovered",this);
		}

		__getset(0,__proto,'loaded',function(){
			return this._loaded;
		});

		/**
		*获取唯一标识ID(通常用于优化或识别)。
		*/
		__getset(0,__proto,'id',function(){
			return this._$1__id;
		});

		/**
		*色湖之资源的URL地址。
		*@param value URL地址。
		*/
		/**
		*获取资源的URL地址。
		*@return URL地址。
		*/
		__getset(0,__proto,'url',function(){
			return this._url;
			},function(value){
			this._url=value;
		});

		/**
		*设置名字
		*/
		/**
		*获取名字。
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this.name!==value){
				this._name=value;
				Resource._isLoadedResourcesSorted=false;
			}
		});

		/**
		*是否已处理。
		*/
		__getset(0,__proto,'disposed',function(){
			return this._disposed;
		});

		/**
		*是否已释放。
		*/
		__getset(0,__proto,'released',function(){
			return this._released;
		});

		/**
		*资源管理员。
		*/
		__getset(0,__proto,'resourceManager',function(){
			return this._resourceManager;
		});

		/**
		*距离上次使用帧率。
		*/
		__getset(0,__proto,'lastUseFrameCount',function(){
			return this._lastUseFrameCount;
		});

		/**
		*占用内存尺寸。
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
			},function(value){
			var offsetValue=value-this._memorySize;
			this._memorySize=value;
			this.resourceManager && this.resourceManager.addSize(offsetValue);
		});

		/**
		*本类型排序后的已载入资源。
		*/
		__getset(1,Resource,'sortedLoadedResourcesByName',function(){
			if (!Resource._isLoadedResourcesSorted){
				Resource._isLoadedResourcesSorted=true;
				Resource._loadedResources.sort(Resource.compareResourcesByName);
			}
			return Resource._loadedResources;
		},laya.events.EventDispatcher._$SET_sortedLoadedResourcesByName);

		Resource.getLoadedResourceByIndex=function(index){
			return Resource._loadedResources[index];
		}

		Resource.getLoadedResourcesCount=function(){
			return Resource._loadedResources.length;
		}

		Resource.compareResourcesByName=function(left,right){
			if (left===right)
				return 0;
			var x=left.name;
			var y=right.name;
			if (x===null){
				if (y===null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right.name;
						return x.localeCompare(y);
					}
				}
			}
		}

		Resource._uniqueIDCounter=0;
		Resource._loadedResources=[];
		Resource._isLoadedResourcesSorted=false;
		return Resource;
	})(EventDispatcher)


	//class laya.net.LoaderManager extends laya.events.EventDispatcher
	var LoaderManager=(function(_super){
		var ResInfo;
		function LoaderManager(){
			this.retryNum=1;
			this.retryDelay=0;
			this.maxLoader=5;
			this._loaders=[];
			this._loaderCount=0;
			this._resInfos=[];
			this._infoPool=[];
			this._maxPriority=5;
			this._failRes={};
			LoaderManager.__super.call(this);
			for (var i=0;i < this._maxPriority;i++)this._resInfos[i]=[];
		}

		__class(LoaderManager,'laya.net.LoaderManager',_super);
		var __proto=LoaderManager.prototype;
		/**
		*根据clas定义创建一个资源空壳，随后进行异步加载，资源加载完成后，会调用资源类的onAsynLoaded方法回调真正的数据,套嵌资源的子资源会保留资源路径"?"后的部分
		*@param url 资源地址或者数组，比如[{url:xx,clas:xx,priority:xx,params:xx},{url:xx,clas:xx,priority:xx,params:xx}]
		*@param progress 进度回调，回调参数为当前文件加载的进度信息(0-1)。
		*@param clas 资源类名，比如Texture
		*@param type 资源类型，比如：Loader.IMAGE
		*@param priority 优先级，默认5个优先级，0最快，4最慢，默认为1
		*@param cache 是否缓存
		*@return 返回资源对象
		*/
		__proto.create=function(url,complete,progress,clas,params,priority,cache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			if ((url instanceof Array)){
				var items=url;
				var itemCount=items.length;
				var loadedCount=0;
				if (progress){
					var progress2=Handler.create(progress.caller,progress.method,progress.args,false);
				}
				for (var i=0;i < itemCount;i++){
					var item=items[i];
					if ((typeof item=='string'))item=items[i]={url:item};
					item.progress=0;
					var progressHandler=progress ? Handler.create(null,onProgress,[item],false):null;
					var completeHandler=(progress || complete)? Handler.create(null,onComplete,[item]):null;
					this._create(item.url,completeHandler,progressHandler,item.clas || clas,item.params || params,item.priority || priority,cache);
				}
				function onComplete (item,content){
					loadedCount++;
					item.progress=1;
					if (loadedCount===itemCount && complete){
						complete.run();
					}
				}
				function onProgress (item,value){
					item.progress=value;
					var num=0;
					for (var j=0;j < itemCount;j++){
						var item1=items[j];
						num+=item1.progress;
					};
					var v=num / itemCount;
					progress2.runWith(v);
				}
				return true;
			}else return this._create(url,complete,progress,clas,params,priority,cache);
		}

		__proto._create=function(url,complete,progress,clas,params,priority,cache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			var item=this.getRes(url);
			if (!item){
				var extension=Utils.getFileExtension(url);
				var creatItem=LoaderManager.createMap[extension];
				if (!clas)clas=creatItem[0];
				var type=creatItem[1];
				if (extension=="atlas"){
					this.load(url,complete,progress,type,priority,cache);
					}else {
					if (clas===Texture)type="htmlimage";
					item=clas ? new clas():null;
					this.load(url,Handler.create(null,onLoaded),progress,type,priority,false,null,true);
					function onLoaded (data){
						item && item.onAsynLoaded.call(item,url,data,params);
						if (complete)complete.run();
					}
					if (cache){
						this.cacheRes(url,item);
						item.url=url;
					}
				}
				}else {
				progress && progress.runWith(1);
				complete && complete.run();
			}
			return item;
		}

		/**
		*加载资源。
		*@param url 单个资源地址，或者资源地址数组(简单数组：["a.png","b.png"]，复杂数组[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}])。
		*@param complete 结束回调，如果加载失败，则返回 null 。
		*@param progress 进度回调，回调参数为当前文件加载的进度信息(0-1)。
		*@param type 资源类型。比如：Loader.IMAGE
		*@param priority 优先级，0-4，5个优先级，0优先级最高，默认为1。
		*@param cache 是否缓存加载结果。
		*@param group 分组，方便对资源进行管理。
		*@param ignoreCache 是否忽略缓存，强制重新加载
		*@return 此 LoaderManager 对象。
		*/
		__proto.load=function(url,complete,progress,type,priority,cache,group,ignoreCache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			(ignoreCache===void 0)&& (ignoreCache=false);
			if ((url instanceof Array))return this._loadAssets(url,complete,progress,type,priority,cache,group);
			var content=Loader.getRes(url);
			if (content !=null){
				progress && progress.runWith(1);
				complete && complete.runWith(content);
				this._loaderCount || this.event("complete");
				}else {
				var info=LoaderManager._resMap[url];
				if (!info){
					info=this._infoPool.length ? this._infoPool.pop():new ResInfo();
					info.url=url;
					info.type=type;
					info.cache=cache;
					info.group=group;
					info.ignoreCache=ignoreCache;
					complete && info.on("complete",complete.caller,complete.method,complete.args);
					progress && info.on("progress",progress.caller,progress.method,progress.args);
					LoaderManager._resMap[url]=info;
					priority=priority < this._maxPriority ? priority :this._maxPriority-1;
					this._resInfos[priority].push(info);
					this._next();
					}else {
					complete && info._createListener("complete",complete.caller,complete.method,complete.args,false,false);
					progress && info._createListener("progress",progress.caller,progress.method,progress.args,false,false);
				}
			}
			return this;
		}

		__proto._next=function(){
			if (this._loaderCount >=this.maxLoader)return;
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				if (infos.length > 0){
					var info=infos.shift();
					if (info)return this._doLoad(info);
				}
			}
			this._loaderCount || this.event("complete");
		}

		__proto._doLoad=function(resInfo){
			this._loaderCount++;
			var loader=this._loaders.length ? this._loaders.pop():new Loader();
			loader.on("complete",null,onLoaded);
			loader.on("progress",null,function(num){
				resInfo.event("progress",num);
			});
			loader.on("error",null,function(msg){
				onLoaded(null);
			});
			var _this=this;
			function onLoaded (data){
				loader.offAll();
				loader._data=null;
				_this._loaders.push(loader);
				_this._endLoad(resInfo,(data instanceof Array)? [data] :data);
				_this._loaderCount--;
				_this._next();
			}
			loader.load(resInfo.url,resInfo.type,resInfo.cache,resInfo.group,resInfo.ignoreCache);
		}

		__proto._endLoad=function(resInfo,content){
			if (content==null){
				var errorCount=this._failRes[resInfo.url] || 0;
				if (errorCount < this.retryNum){
					console.warn("[warn]Retry to load:",resInfo.url);
					this._failRes[resInfo.url]=errorCount+1;
					Laya.timer.once(this.retryDelay,this,this._addReTry,[resInfo],false);
					return;
					}else {
					console.warn("[error]Failed to load:",resInfo.url);
					this.event("error",resInfo.url);
				}
			}
			delete LoaderManager._resMap[resInfo.url];
			resInfo.event("complete",content);
			resInfo.offAll();
			this._infoPool.push(resInfo);
		}

		__proto._addReTry=function(resInfo){
			this._resInfos[this._maxPriority-1].push(resInfo);
			this._next();
		}

		/**
		*清理指定资源地址缓存。
		*@param url 资源地址。
		*@param forceDispose 是否强制销毁，有些资源是采用引用计数方式销毁，如果forceDispose=true，则忽略引用计数，直接销毁，比如Texture，默认为false
		*/
		__proto.clearRes=function(url,forceDispose){
			(forceDispose===void 0)&& (forceDispose=false);
			Loader.clearRes(url,forceDispose);
		}

		/**
		*获取指定资源地址的资源。
		*@param url 资源地址。
		*@return 返回资源。
		*/
		__proto.getRes=function(url){
			return Loader.getRes(url);
		}

		/**
		*缓存资源。
		*@param url 资源地址。
		*@param data 要缓存的内容。
		*/
		__proto.cacheRes=function(url,data){
			Loader.cacheRes(url,data);
		}

		/**
		*设置资源分组。
		*@param url 资源地址。
		*@param group 分组名
		*/
		__proto.setGroup=function(url,group){
			Loader.setGroup(url,group);
		}

		/**
		*根据分组清理资源
		*@param group 分组名
		*/
		__proto.clearResByGroup=function(group){
			Loader.clearResByGroup(group);
		}

		/**清理当前未完成的加载，所有未加载的内容全部停止加载。*/
		__proto.clearUnLoaded=function(){
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				for (var j=infos.length-1;j >-1;j--){
					var info=infos[j];
					if (info){
						info.offAll();
						this._infoPool.push(info);
					}
				}
				infos.length=0;
			}
			this._loaderCount=0;
			LoaderManager._resMap={};
		}

		/**
		*根据地址集合清理掉未加载的内容
		*@param urls 资源地址集合
		*/
		__proto.cancelLoadByUrls=function(urls){
			if (!urls)return;
			for (var i=0,n=urls.length;i < n;i++){
				this.cancelLoadByUrl(urls[i]);
			}
		}

		/**
		*根据地址清理掉未加载的内容
		*@param url 资源地址
		*/
		__proto.cancelLoadByUrl=function(url){
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				for (var j=infos.length-1;j >-1;j--){
					var info=infos[j];
					if (info && info.url===url){
						infos[j]=null;
						info.offAll();
						this._infoPool.push(info);
					}
				}
			}
			if (LoaderManager._resMap[url])delete LoaderManager._resMap[url];
		}

		/**
		*@private
		*加载数组里面的资源。
		*@param arr 简单：["a.png","b.png"]，复杂[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]*/
		__proto._loadAssets=function(arr,complete,progress,type,priority,cache,group){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			var itemCount=arr.length;
			var loadedCount=0;
			var totalSize=0;
			var items=[];
			var success=true;
			for (var i=0;i < itemCount;i++){
				var item=arr[i];
				if ((typeof item=='string'))item={url:item,type:type,size:1,priority:priority};
				if (!item.size)item.size=1;
				item.progress=0;
				totalSize+=item.size;
				items.push(item);
				var progressHandler=progress ? Handler.create(null,loadProgress,[item],false):null;
				var completeHandler=(complete || progress)? Handler.create(null,loadComplete,[item]):null;
				this.load(item.url,completeHandler,progressHandler,item.type,item.priority || 1,cache,item.group || group);
			}
			function loadComplete (item,content){
				loadedCount++;
				item.progress=1;
				if (!content)success=false;
				if (loadedCount===itemCount && complete){
					complete.runWith(success);
				}
			}
			function loadProgress (item,value){
				if (progress !=null){
					item.progress=value;
					var num=0;
					for (var j=0;j < items.length;j++){
						var item1=items[j];
						num+=item1.size *item1.progress;
					};
					var v=num / totalSize;
					progress.runWith(v);
				}
			}
			return this;
		}

		LoaderManager.cacheRes=function(url,data){
			Loader.cacheRes(url,data);
		}

		LoaderManager._resMap={};
		__static(LoaderManager,
		['createMap',function(){return this.createMap={atlas:[null,"atlas"]};}
		]);
		LoaderManager.__init$=function(){
			//class ResInfo extends laya.events.EventDispatcher
			ResInfo=(function(_super){
				function ResInfo(){
					this.url=null;
					this.type=null;
					this.cache=false;
					this.group=null;
					this.ignoreCache=false;
					ResInfo.__super.call(this);
				}
				__class(ResInfo,'',_super);
				return ResInfo;
			})(EventDispatcher)
		}

		return LoaderManager;
	})(EventDispatcher)


	//class laya.debug.tools.Notice extends laya.events.EventDispatcher
	var Notice=(function(_super){
		function Notice(){
			Notice.__super.call(this);
		}

		__class(Notice,'laya.debug.tools.Notice',_super);
		Notice.notify=function(type,data){
			Notice.I.event(type,data);
		}

		Notice.listen=function(type,_scope,fun,args,cancelBefore){
			(cancelBefore===void 0)&& (cancelBefore=false);
			if(cancelBefore)Notice.cancel(type,_scope,fun);
			Notice.I.on(type,_scope,fun,args);
		}

		Notice.cancel=function(type,_scope,fun){
			Notice.I.off(type,_scope,fun);
		}

		__static(Notice,
		['I',function(){return this.I=new Notice();}
		]);
		return Notice;
	})(EventDispatcher)


	//class laya.media.h5audio.AudioSound extends laya.events.EventDispatcher
	var AudioSound=(function(_super){
		function AudioSound(){
			this.url=null;
			this.audio=null;
			this.loaded=false;
			AudioSound.__super.call(this);
		}

		__class(AudioSound,'laya.media.h5audio.AudioSound',_super);
		var __proto=AudioSound.prototype;
		/**
		*释放声音
		*
		*/
		__proto.dispose=function(){
			var ad=AudioSound._audioCache[this.url];
			if (ad){
				ad.src="";
				delete AudioSound._audioCache[this.url];
			}
		}

		/**
		*加载声音
		*@param url
		*
		*/
		__proto.load=function(url){
			url=URL.formatURL(url);
			this.url=url;
			var ad=AudioSound._audioCache[url];
			if (ad && ad.readyState >=2){
				this.event("complete");
				return;
			}
			if (!ad){
				ad=Browser.createElement("audio");
				ad.src=url;
				AudioSound._audioCache[url]=ad;
			}
			ad.addEventListener("canplaythrough",onLoaded);
			ad.addEventListener("error",onErr);
			var me=this;
			function onLoaded (){
				offs();
				me.loaded=true;
				me.event("complete");
			}
			function onErr (){
				ad.load=null;
				offs();
				me.event("error");
			}
			function offs (){
				ad.removeEventListener("canplaythrough",onLoaded);
				ad.removeEventListener("error",onErr);
			}
			this.audio=ad;
			if (ad.load){
				ad.load();
				}else {
				onErr();
			}
		}

		/**
		*播放声音
		*@param startTime 起始时间
		*@param loops 循环次数
		*@return
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			if (!this.url)return null;
			var ad;
			ad=AudioSound._audioCache[this.url];
			if (!ad)return null;
			var tAd;
			tAd=Pool.getItem("audio:"+this.url);
			if (Render.isConchApp){
				if (!tAd){
					tAd=Browser.createElement("audio");
					tAd.src=ad.src;
				}
			}
			else{
				tAd=tAd ? tAd :ad.cloneNode(true);
			};
			var channel=new AudioSoundChannel(tAd);
			channel.url=this.url;
			channel.loops=loops;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		/**
		*获取总时间。
		*/
		__getset(0,__proto,'duration',function(){
			var ad;
			ad=AudioSound._audioCache[this.url];
			if (!ad)
				return 0;
			return ad.duration;
		});

		AudioSound._audioCache={};
		return AudioSound;
	})(EventDispatcher)


	//class laya.media.SoundChannel extends laya.events.EventDispatcher
	var SoundChannel=(function(_super){
		function SoundChannel(){
			this.url=null;
			this.loops=0;
			this.startTime=NaN;
			this.isStopped=false;
			this.completeHandler=null;
			SoundChannel.__super.call(this);
		}

		__class(SoundChannel,'laya.media.SoundChannel',_super);
		var __proto=SoundChannel.prototype;
		/**
		*播放。
		*/
		__proto.play=function(){}
		/**
		*停止。
		*/
		__proto.stop=function(){}
		/**
		*暂停。
		*/
		__proto.pause=function(){}
		/**
		*继续播放。
		*/
		__proto.resume=function(){}
		/**
		*private
		*/
		__proto.__runComplete=function(handler){
			if (handler){
				handler.run();
			}
		}

		/**
		*音量范围从 0（静音）至 1（最大音量）。
		*/
		__getset(0,__proto,'volume',function(){
			return 1;
			},function(v){
		});

		/**
		*获取当前播放时间。
		*/
		__getset(0,__proto,'position',function(){
			return 0;
		});

		/**
		*获取总时间。
		*/
		__getset(0,__proto,'duration',function(){
			return 0;
		});

		return SoundChannel;
	})(EventDispatcher)


	//class laya.media.Sound extends laya.events.EventDispatcher
	var Sound=(function(_super){
		function Sound(){Sound.__super.call(this);;
		};

		__class(Sound,'laya.media.Sound',_super);
		var __proto=Sound.prototype;
		/**
		*加载声音。
		*@param url 地址。
		*
		*/
		__proto.load=function(url){}
		/**
		*播放声音。
		*@param startTime 开始时间,单位秒
		*@param loops 循环次数,0表示一直循环
		*@return 声道 SoundChannel 对象。
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			return null;
		}

		/**
		*释放声音资源。
		*
		*/
		__proto.dispose=function(){}
		/**
		*获取总时间。
		*/
		__getset(0,__proto,'duration',function(){
			return 0;
		});

		return Sound;
	})(EventDispatcher)


	//class laya.media.webaudio.WebAudioSound extends laya.events.EventDispatcher
	var WebAudioSound=(function(_super){
		function WebAudioSound(){
			this.url=null;
			this.loaded=false;
			this.data=null;
			this.audioBuffer=null;
			this.__toPlays=null;
			WebAudioSound.__super.call(this);
		}

		__class(WebAudioSound,'laya.media.webaudio.WebAudioSound',_super);
		var __proto=WebAudioSound.prototype;
		/**
		*加载声音
		*@param url
		*
		*/
		__proto.load=function(url){
			var me=this;
			url=URL.formatURL(url);
			this.url=url;
			this.audioBuffer=WebAudioSound._dataCache[url];
			if (this.audioBuffer){
				this._loaded(this.audioBuffer);
				return;
			}
			WebAudioSound.e.on("loaded:"+url,this,this._loaded);
			WebAudioSound.e.on("err:"+url,this,this._err);
			if (WebAudioSound.__loadingSound[url]){
				return;
			}
			WebAudioSound.__loadingSound[url]=true;
			var request=new Browser.window.XMLHttpRequest();
			request.open("GET",url,true);
			request.responseType="arraybuffer";
			request.onload=function (){
				me.data=request.response;
				WebAudioSound.buffs.push({"buffer":me.data,"url":me.url});
				WebAudioSound.decode();
			};
			request.onerror=function (e){
				me._err();
			}
			request.send();
		}

		__proto._err=function(){
			this._removeLoadEvents();
			WebAudioSound.__loadingSound[this.url]=false;
			this.event("error");
		}

		__proto._loaded=function(audioBuffer){
			this._removeLoadEvents();
			this.audioBuffer=audioBuffer;
			WebAudioSound._dataCache[this.url]=this.audioBuffer;
			this.loaded=true;
			this.event("complete");
		}

		__proto._removeLoadEvents=function(){
			WebAudioSound.e.off("loaded:"+this.url,this,this._loaded);
			WebAudioSound.e.off("err:"+this.url,this,this._err);
		}

		__proto.__playAfterLoaded=function(){
			if (!this.__toPlays)return;
			var i=0,len=0;
			var toPlays;
			toPlays=this.__toPlays;
			len=toPlays.length;
			var tParams;
			for (i=0;i < len;i++){
				tParams=toPlays[i];
				if (tParams[2] && !(tParams [2]).isStopped){
					this.play(tParams[0],tParams[1],tParams[2]);
				}
			}
			this.__toPlays.length=0;
		}

		/**
		*播放声音
		*@param startTime 起始时间
		*@param loops 循环次数
		*@return
		*
		*/
		__proto.play=function(startTime,loops,channel){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			channel=channel ? channel :new WebAudioSoundChannel();
			if (!this.audioBuffer){
				if (this.url){
					if (!this.__toPlays)this.__toPlays=[];
					this.__toPlays.push([startTime,loops,channel]);
					this.once("complete",this,this.__playAfterLoaded);
					this.load(this.url);
				}
			}
			channel.url=this.url;
			channel.loops=loops;
			channel["audioBuffer"]=this.audioBuffer;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		__proto.dispose=function(){
			delete WebAudioSound._dataCache[this.url];
			delete WebAudioSound.__loadingSound[this.url];
		}

		__getset(0,__proto,'duration',function(){
			if (this.audioBuffer){
				return this.audioBuffer.duration;
			}
			return 0;
		});

		WebAudioSound.decode=function(){
			if (WebAudioSound.buffs.length <=0 || WebAudioSound.isDecoding){
				return;
			}
			WebAudioSound.isDecoding=true;
			WebAudioSound.tInfo=WebAudioSound.buffs.shift();
			WebAudioSound.ctx.decodeAudioData(WebAudioSound.tInfo["buffer"],WebAudioSound._done,WebAudioSound._fail);
		}

		WebAudioSound._done=function(audioBuffer){
			WebAudioSound.e.event("loaded:"+WebAudioSound.tInfo.url,audioBuffer);
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound._fail=function(){
			WebAudioSound.e.event("err:"+WebAudioSound.tInfo.url,null);
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound._playEmptySound=function(){
			if (WebAudioSound.ctx==null){
				return;
			};
			var source=WebAudioSound.ctx.createBufferSource();
			source.buffer=WebAudioSound._miniBuffer;
			source.connect(WebAudioSound.ctx.destination);
			source.start(0,0,0);
		}

		WebAudioSound._unlock=function(){
			if (WebAudioSound._unlocked){
				return;
			}
			WebAudioSound._playEmptySound();
			if (WebAudioSound.ctx.state=="running"){
				Browser.document.removeEventListener("mousedown",WebAudioSound._unlock,true);
				Browser.document.removeEventListener("touchend",WebAudioSound._unlock,true);
				WebAudioSound._unlocked=true;
			}
		}

		WebAudioSound.initWebAudio=function(){
			if (WebAudioSound.ctx.state !="running"){
				WebAudioSound._unlock();
				Browser.document.addEventListener("mousedown",WebAudioSound._unlock,true);
				Browser.document.addEventListener("touchend",WebAudioSound._unlock,true);
			}
		}

		WebAudioSound._dataCache={};
		WebAudioSound.buffs=[];
		WebAudioSound.isDecoding=false;
		WebAudioSound._unlocked=false;
		WebAudioSound.tInfo=null
		WebAudioSound.__loadingSound={};
		__static(WebAudioSound,
		['window',function(){return this.window=Browser.window;},'webAudioEnabled',function(){return this.webAudioEnabled=WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"];},'ctx',function(){return this.ctx=WebAudioSound.webAudioEnabled ? new (WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"])():undefined;},'_miniBuffer',function(){return this._miniBuffer=WebAudioSound.ctx.createBuffer(1,1,22050);},'e',function(){return this.e=new EventDispatcher();}
		]);
		return WebAudioSound;
	})(EventDispatcher)


	//class laya.net.HttpRequest extends laya.events.EventDispatcher
	var HttpRequest=(function(_super){
		function HttpRequest(){
			this._responseType=null;
			this._data=null;
			HttpRequest.__super.call(this);
			this._http=new Browser.window.XMLHttpRequest();
		}

		__class(HttpRequest,'laya.net.HttpRequest',_super);
		var __proto=HttpRequest.prototype;
		/**
		*发送请求。
		*@param url 请求的地址。
		*@param data 发送的数据，可选。
		*@param method 发送数据方式，值为“get”或“post”，默认为 “get”方式。
		*@param responseType 返回消息类型，可设置为"text"，"json"，"xml","arraybuffer"。
		*@param headers 头信息，key value数组，比如["Content-Type","application/json"]。
		*/
		__proto.send=function(url,data,method,responseType,headers){
			(method===void 0)&& (method="get");
			(responseType===void 0)&& (responseType="text");
			this._responseType=responseType;
			this._data=null;
			var _this=this;
			var http=this._http;
			http.open(method,url,true);
			if (headers){
				for (var i=0;i < headers.length;i++){
					http.setRequestHeader(headers[i++],headers[i]);
				}
				}else if(!Render.isConchApp){
				if (!data || (typeof data=='string'))http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				else http.setRequestHeader("Content-Type","application/json");
			}
			http.responseType=responseType!=="arraybuffer" ? "text" :"arraybuffer";
			http.onerror=function (e){
				_this._onError(e);
			}
			http.onabort=function (e){
				_this._onAbort(e);
			}
			http.onprogress=function (e){
				_this._onProgress(e);
			}
			http.onload=function (e){
				_this._onLoad(e);
			}
			http.send(data);
		}

		/**
		*@private
		*请求进度的侦听处理函数。
		*@param e 事件对象。
		*/
		__proto._onProgress=function(e){
			if (e && e.lengthComputable)this.event("progress",e.loaded / e.total);
		}

		/**
		*@private
		*请求中断的侦听处理函数。
		*@param e 事件对象。
		*/
		__proto._onAbort=function(e){
			this.error("Request was aborted by user");
		}

		/**
		*@private
		*请求出错侦的听处理函数。
		*@param e 事件对象。
		*/
		__proto._onError=function(e){
			this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText);
		}

		/**
		*@private
		*请求消息返回的侦听处理函数。
		*@param e 事件对象。
		*/
		__proto._onLoad=function(e){
			var http=this._http;
			var status=http.status!==undefined ? http.status :200;
			if (status===200 || status===204 || status===0){
				this.complete();
				}else {
				this.error("["+http.status+"]"+http.statusText+":"+http.responseURL);
			}
		}

		/**
		*@private
		*请求错误的处理函数。
		*@param message 错误信息。
		*/
		__proto.error=function(message){
			this.clear();
			this.event("error",message);
		}

		/**
		*@private
		*请求成功完成的处理函数。
		*/
		__proto.complete=function(){
			this.clear();
			var flag=true;
			try {
				if (this._responseType==="json"){
					this._data=JSON.parse(this._http.responseText);
					}else if (this._responseType==="xml"){
					this._data=Utils.parseXMLFromString(this._http.responseText);
					}else {
					this._data=this._http.response || this._http.responseText;
				}
				}catch (e){
				flag=false;
				this.error(e.message);
			}
			flag && this.event("complete",(this._data instanceof Array)? [this._data] :this._data);
		}

		/**
		*@private
		*清除当前请求。
		*/
		__proto.clear=function(){
			var http=this._http;
			http.onerror=http.onabort=http.onprogress=http.onload=null;
		}

		/**请求的地址。*/
		__getset(0,__proto,'url',function(){
			return this._http.responseURL;
		});

		/**原生XMLHttpRequest引用*/
		__getset(0,__proto,'http',function(){
			return this._http;
		});

		/**返回的数据。*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		return HttpRequest;
	})(EventDispatcher)


	//class laya.net.Loader extends laya.events.EventDispatcher
	var Loader=(function(_super){
		function Loader(){
			this._data=null;
			this._url=null;
			this._type=null;
			this._cache=false;
			this._http=null;
			Loader.__super.call(this);
		}

		__class(Loader,'laya.net.Loader',_super);
		var __proto=Loader.prototype;
		/**
		*加载资源。
		*@param url 地址
		*@param type 类型，如果为null，则根据文件后缀，自动分析类型。
		*@param cache 是否缓存数据。
		*@param group 分组。
		*@param ignoreCache 是否忽略缓存，强制重新加载
		*/
		__proto.load=function(url,type,cache,group,ignoreCache){
			(cache===void 0)&& (cache=true);
			(ignoreCache===void 0)&& (ignoreCache=false);
			this._url=url;
			if (url.indexOf("data:image")===0)type="image";
			else url=URL.formatURL(url);
			this._type=type || (type=this.getTypeFromUrl(url));
			this._cache=cache;
			this._data=null;
			if (!ignoreCache && Loader.loadedMap[url]){
				this._data=Loader.loadedMap[url];
				this.event("progress",1);
				this.event("complete",this._data);
				return;
			}
			if (group)Loader.setGroup(url,group);
			if (Loader.parserMap[type] !=null){
				if (((Loader.parserMap[type])instanceof laya.utils.Handler ))Loader.parserMap[type].runWith(this);
				else Loader.parserMap[type].call(null,this);
				return;
			}
			if (type==="image" || type==="htmlimage" || type==="nativeimage")return this._loadImage(url);
			if (type==="sound")return this._loadSound(url);
			if (!this._http){
				this._http=new HttpRequest();
				this._http.on("progress",this,this.onProgress);
				this._http.on("error",this,this.onError);
				this._http.on("complete",this,this.onLoaded);
			};
			var contentType;
			switch (type){
				case "atlas":
					contentType="json";
					break ;
				case "font":
					contentType="xml";
					break ;
				default :
					contentType=type;
				}
			this._http.send(url,null,"get",contentType);
		}

		/**
		*获取指定资源地址的数据类型。
		*@param url 资源地址。
		*@return 数据类型。
		*/
		__proto.getTypeFromUrl=function(url){
			var type=Utils.getFileExtension(url);
			if (type)return Loader.typeMap[type];
			console.warn("Not recognize the resources suffix",url);
			return "text";
		}

		/**
		*@private
		*加载图片资源。
		*@param url 资源地址。
		*/
		__proto._loadImage=function(url){
			url=URL.formatURL(url);
			var _this=this;
			var image;
			function clear (){
				image.onload=null;
				image.onerror=null;
			};
			var onload=function (){
				clear();
				_this.onLoaded(image);
			};
			var onerror=function (){
				clear();
				_this.event("error","Load image failed");
			}
			if (this._type==="nativeimage"){
				image=new Browser.window.Image();
				image.crossOrigin="";
				image.onload=onload;
				image.onerror=onerror;
				image.src=url;
				}else {
				new HTMLImage.create(url,{onload:onload,onerror:onerror,onCreate:function (img){
						image=img;
				}});
			}
		}

		/**
		*@private
		*加载声音资源。
		*@param url 资源地址。
		*/
		__proto._loadSound=function(url){
			var sound=(new SoundManager._soundClass());
			var _this=this;
			sound.on("complete",this,soundOnload);
			sound.on("error",this,soundOnErr);
			sound.load(url);
			function soundOnload (){
				clear();
				_this.onLoaded(sound);
			}
			function soundOnErr (){
				clear();
				sound.dispose();
				_this.event("error","Load sound failed");
			}
			function clear (){
				sound.offAll();
			}
		}

		/**@private */
		__proto.onProgress=function(value){
			if (this._type==="atlas")this.event("progress",value *0.3);
			else this.event("progress",value);
		}

		/**@private */
		__proto.onError=function(message){
			this.event("error",message);
		}

		/**
		*资源加载完成的处理函数。
		*@param data 数据。
		*/
		__proto.onLoaded=function(data){
			var type=this._type;
			if (type==="image"){
				var tex=new Texture(data);
				tex.url=this._url;
				this.complete(tex);
				}else if (type==="sound" || type==="htmlimage" || type==="nativeimage"){
				this.complete(data);
				}else if (type==="atlas"){
				if (!data.src && !data._setContext){
					if (!this._data){
						this._data=data;
						if (data.meta && data.meta.image){
							var toloadPics=data.meta.image.split(",");
							var split=this._url.indexOf("/")>=0 ? "/" :"\\";
							var idx=this._url.lastIndexOf(split);
							var folderPath=idx >=0 ? this._url.substr(0,idx+1):"";
							for (var i=0,len=toloadPics.length;i < len;i++){
								toloadPics[i]=folderPath+toloadPics[i];
							}
							}else {
							toloadPics=[this._url.replace(".json",".png")];
						}
						toloadPics.reverse();
						data.toLoads=toloadPics;
						data.pics=[];
					}
					this.event("progress",0.3+1 / toloadPics.length *0.6);
					return this._loadImage(toloadPics.pop());
					}else {
					this._data.pics.push(data);
					if (this._data.toLoads.length > 0){
						this.event("progress",0.3+1 / this._data.toLoads.length *0.6);
						return this._loadImage(this._data.toLoads.pop());
					};
					var frames=this._data.frames;
					var cleanUrl=this._url.split("?")[0];
					var directory=(this._data.meta && this._data.meta.prefix)? this._data.meta.prefix :cleanUrl.substring(0,cleanUrl.lastIndexOf("."))+"/";
					var pics=this._data.pics;
					var atlasURL=URL.formatURL(this._url);
					var map=Loader.atlasMap[atlasURL] || (Loader.atlasMap[atlasURL]=[]);
					map.dir=directory;
					for (var name in frames){
						var obj=frames[name];
						var tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						var url=URL.formatURL(directory+name);
						Loader.cacheRes(url,Texture.create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y,obj.sourceSize.w,obj.sourceSize.h));
						Loader.loadedMap[url].url=url;
						map.push(url);
					}
					this.complete(this._data);
				}
				}else if (type=="font"){
				if (!data.src){
					this._data=data;
					this.event("progress",0.5);
					return this._loadImage(this._url.replace(".fnt",".png"));
					}else {
					var bFont=new BitmapFont();
					bFont.parseFont(this._data,data);
					var tArr=this._url.split(".fnt")[0].split("/");
					var fontName=tArr[tArr.length-1];
					Text.registerBitmapFont(fontName,bFont);
					this._data=bFont;
					this.complete(this._data);
				}
				}else {
				this.complete(data);
			}
		}

		/**
		*加载完成。
		*@param data 加载的数据。
		*/
		__proto.complete=function(data){
			this._data=data;
			Loader._loaders.push(this);
			if (!Loader._isWorking)Loader.checkNext();
		}

		/**
		*结束加载，处理是否缓存及派发完成事件 <code>Event.COMPLETE</code> 。
		*@param content 加载后的数据
		*/
		__proto.endLoad=function(content){
			content && (this._data=content);
			if (this._cache)Loader.cacheRes(this._url,this._data);
			this.event("progress",1);
			this.event("complete",(this.data instanceof Array)? [this.data] :this.data);
		}

		/**加载地址。*/
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		/**返回的数据。*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		/**是否缓存。*/
		__getset(0,__proto,'cache',function(){
			return this._cache;
		});

		/**加载类型。*/
		__getset(0,__proto,'type',function(){
			return this._type;
		});

		Loader.checkNext=function(){
			Loader._isWorking=true;
			var startTimer=Browser.now();
			var thisTimer=startTimer;
			while (Loader._startIndex < Loader._loaders.length){
				thisTimer=Browser.now();
				Loader._loaders[Loader._startIndex].endLoad();
				Loader._startIndex++;
				if (Browser.now()-startTimer > Loader.maxTimeOut){
					console.warn("loader callback cost a long time:"+(Browser.now()-startTimer)+" url="+Loader._loaders[Loader._startIndex-1].url);
					Laya.timer.frameOnce(1,null,Loader.checkNext);
					return;
				}
			}
			Loader._loaders.length=0;
			Loader._startIndex=0;
			Loader._isWorking=false;
		}

		Loader.clearRes=function(url,forceDispose){
			(forceDispose===void 0)&& (forceDispose=false);
			url=URL.formatURL(url);
			var arr=Loader.getAtlas(url);
			if (arr){
				for (var i=0,n=arr.length;i < n;i++){
					var resUrl=arr[i];
					var tex=Loader.getRes(resUrl);
					if (tex)tex.destroy(forceDispose);
					delete Loader.loadedMap[resUrl];
				}
				arr.length=0;
				delete Loader.atlasMap[url];
				delete Loader.loadedMap[url];
				}else {
				var res=Loader.loadedMap[url];
				if (res){
					if ((res instanceof laya.resource.Texture )&& res.bitmap)(res).destroy(forceDispose);
					delete Loader.loadedMap[url];
				}
			}
		}

		Loader.getRes=function(url){
			return Loader.loadedMap[URL.formatURL(url)];
		}

		Loader.getAtlas=function(url){
			return Loader.atlasMap[URL.formatURL(url)];
		}

		Loader.cacheRes=function(url,data){
			url=URL.formatURL(url);
			if (Loader.loadedMap[url] !=null){
				console.warn("Resources already exist,is repeated loading:",url);
				}else {
				Loader.loadedMap[url]=data;
			}
		}

		Loader.setGroup=function(url,group){
			if (!Loader.groupMap[group])Loader.groupMap[group]=[];
			Loader.groupMap[group].push(url);
		}

		Loader.clearResByGroup=function(group){
			if (!Loader.groupMap[group])return;
			var arr=Loader.groupMap[group],i=0,len=arr.length;
			for (i=0;i < len;i++){
				Loader.clearRes(arr[i]);
			}
			arr.length=0;
		}

		Loader.TEXT="text";
		Loader.JSON="json";
		Loader.XML="xml";
		Loader.BUFFER="arraybuffer";
		Loader.IMAGE="image";
		Loader.SOUND="sound";
		Loader.ATLAS="atlas";
		Loader.FONT="font";
		Loader.typeMap={"png":"image","jpg":"image","jpeg":"image","txt":"text","json":"json","xml":"xml","als":"atlas","atlas":"atlas","mp3":"sound","ogg":"sound","wav":"sound","part":"json","fnt":"font"};
		Loader.parserMap={};
		Loader.groupMap={};
		Loader.maxTimeOut=100;
		Loader.loadedMap={};
		Loader.atlasMap={};
		Loader._loaders=[];
		Loader._isWorking=false;
		Loader._startIndex=0;
		return Loader;
	})(EventDispatcher)


	//class laya.resource.Texture extends laya.events.EventDispatcher
	var Texture=(function(_super){
		function Texture(bitmap,uv){
			//this.bitmap=null;
			//this.uv=null;
			this.offsetX=0;
			this.offsetY=0;
			this.sourceWidth=0;
			this.sourceHeight=0;
			//this._loaded=false;
			this._w=0;
			this._h=0;
			//this.$_GID=NaN;
			//this.url=null;
			this._uvID=0;
			Texture.__super.call(this);
			if (bitmap){
				bitmap.useNum++;
			}
			this.setTo(bitmap,uv);
		}

		__class(Texture,'laya.resource.Texture',_super);
		var __proto=Texture.prototype;
		/**
		*设置此对象的位图资源、UV数据信息。
		*@param bitmap 位图资源
		*@param uv UV数据信息
		*/
		__proto.setTo=function(bitmap,uv){
			this.bitmap=bitmap;
			this.uv=uv || Texture.DEF_UV;
			if (bitmap){
				this._w=bitmap.width;
				this._h=bitmap.height;
				this.sourceWidth=this.sourceWidth || this._w;
				this.sourceHeight=this.sourceHeight || this._h
				this._loaded=this._w > 0;
				var _this=this;
				if (this._loaded){
					RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
					}else {
					var bm=bitmap;
					if ((bm instanceof laya.resource.HTMLImage )&& bm.image)
						bm.image.addEventListener('load',function(e){
						RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
					},false);
				}
			}
		}

		/**@private 激活资源。*/
		__proto.active=function(){
			if(this.bitmap)this.bitmap.activeResource();
		}

		/**
		*销毁纹理（分直接销毁，跟计数销毁两种）。
		*@param forceDispose (default=false)true为强制销毁主纹理，false是通过计数销毁纹理。
		*/
		__proto.destroy=function(forceDispose){
			(forceDispose===void 0)&& (forceDispose=false);
			if (this.bitmap && (this.bitmap).useNum > 0){
				if (forceDispose){
					this.bitmap.dispose();
					(this.bitmap).useNum=0;
					}else {
					(this.bitmap).useNum--;
					if ((this.bitmap).useNum==0){
						this.bitmap.dispose();
					}
				}
				this.bitmap=null;
				if (this.url && this===Laya.loader.getRes(this.url))Laya.loader.clearRes(this.url,forceDispose);
				this._loaded=false;
			}
		}

		/**
		*加载指定地址的图片。
		*@param url 图片地址。
		*/
		__proto.load=function(url){
			var _$this=this;
			this._loaded=false;
			var fileBitmap=(this.bitmap || (this.bitmap=HTMLImage.create(url)));
			if (fileBitmap)fileBitmap.useNum++;
			var _this=this;
			fileBitmap.onload=function (){
				fileBitmap.onload=null;
				_this._loaded=true;
				_$this.sourceWidth=_$this._w=fileBitmap.width;
				_$this.sourceHeight=_$this._h=fileBitmap.height;
				_this.event("loaded",this);
				(RunDriver.addToAtlas)&& (RunDriver.addToAtlas(_this));
			};
		}

		/**@private */
		__proto.addTextureToAtlas=function(e){
			RunDriver.addTextureToAtlas(this);
		}

		/**
		*获取Texture上的某个区域的像素点
		*@param x
		*@param y
		*@param width
		*@param height
		*@return 返回像素点集合
		*/
		__proto.getPixels=function(x,y,width,height){
			if (Render.isWebGL){
				return RunDriver.getTexturePixels(this,x,y,width,height);
				}else {
				Browser.canvas.size(width,height);
				Browser.canvas.clear();
				Browser.context.drawTexture(this,-x,-y,this.width,this.height,0,0);
				var info=Browser.context.getImageData(0,0,width,height);
			}
			return info.data;
		}

		/**@private */
		__proto.onAsynLoaded=function(url,bitmap){
			if (bitmap)bitmap.useNum++;
			this.setTo(bitmap,this.uv);
		}

		/**激活并获取资源。*/
		__getset(0,__proto,'source',function(){
			if (!this.bitmap)return null;
			this.bitmap.activeResource();
			return this.bitmap.source;
		});

		/**
		*表示是否加载成功，只能表示初次载入成功（通常包含下载和载入）,并不能完全表示资源是否可立即使用（资源管理机制释放影响等）。
		*/
		__getset(0,__proto,'loaded',function(){
			return this._loaded;
		});

		/**
		*表示资源是否已释放。
		*/
		__getset(0,__proto,'released',function(){
			if (!this.bitmap)return true;
			return this.bitmap.released;
		});

		/**实际宽度。*/
		__getset(0,__proto,'width',function(){
			if (this._w)return this._w;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[2]-this.uv[0])*this.bitmap.width :this.bitmap.width;
			},function(value){
			this._w=value;
			this.sourceWidth || (this.sourceWidth=value);
		});

		/**
		*通过外部设置是否启用纹理平铺(后面要改成在着色器里计算)
		*/
		/**
		*获取当前纹理是否启用了纹理平铺
		*/
		__getset(0,__proto,'repeat',function(){
			if (Render.isWebGL && this.bitmap){
				return this.bitmap.repeat;
			}
			return true;
			},function(value){
			if (value){
				if (Render.isWebGL && this.bitmap){
					this.bitmap.repeat=value;
					if (value){
						this.bitmap.enableMerageInAtlas=false;
					}
				}
			}
		});

		/**实际高度。*/
		__getset(0,__proto,'height',function(){
			if (this._h)return this._h;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[5]-this.uv[1])*this.bitmap.height :this.bitmap.height;
			},function(value){
			this._h=value;
			this.sourceHeight || (this.sourceHeight=value);
		});

		/**
		*设置线性采样的状态（目前只能第一次绘制前设置false生效,来关闭线性采样）。
		*/
		/**
		*获取当前纹理是否启用了线性采样。
		*/
		__getset(0,__proto,'isLinearSampling',function(){
			return Render.isWebGL ? (this.bitmap.minFifter !=0x2600):true;
			},function(value){
			if (!value && Render.isWebGL){
				if (!value && (this.bitmap.minFifter==-1)&& (this.bitmap.magFifter==-1)){
					this.bitmap.minFifter=0x2600;
					this.bitmap.magFifter=0x2600;
					this.bitmap.enableMerageInAtlas=false;
				}
			}
		});

		Texture.moveUV=function(offsetX,offsetY,uv){
			for (var i=0;i < 8;i+=2){
				uv[i]+=offsetX;
				uv[i+1]+=offsetY;
			}
			return uv;
		}

		Texture.create=function(source,x,y,width,height,offsetX,offsetY,sourceWidth,sourceHeight){
			(offsetX===void 0)&& (offsetX=0);
			(offsetY===void 0)&& (offsetY=0);
			(sourceWidth===void 0)&& (sourceWidth=0);
			(sourceHeight===void 0)&& (sourceHeight=0);
			var btex=(source instanceof laya.resource.Texture );
			var uv=btex ? source.uv :Texture.DEF_UV;
			var bitmap=btex ? source.bitmap :source;
			var tex=new Texture(bitmap,null);
			if (bitmap.width && (x+width)> bitmap.width)width=bitmap.width-x;
			if (bitmap.height && (y+height)> bitmap.height)height=bitmap.height-y;
			tex.width=width;
			tex.height=height;
			tex.offsetX=offsetX;
			tex.offsetY=offsetY;
			tex.sourceWidth=sourceWidth || width;
			tex.sourceHeight=sourceHeight || height;
			var dwidth=1 / bitmap.width;
			var dheight=1 / bitmap.height;
			x *=dwidth;
			y *=dheight;
			width *=dwidth;
			height *=dheight;
			var u1=tex.uv[0],v1=tex.uv[1],u2=tex.uv[4],v2=tex.uv[5];
			var inAltasUVWidth=(u2-u1),inAltasUVHeight=(v2-v1);
			var oriUV=Texture.moveUV(uv[0],uv[1],[x,y,x+width,y,x+width,y+height,x,y+height]);
			tex.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
			return tex;
		}

		Texture.createFromTexture=function(texture,x,y,width,height){
			var rect=Rectangle.TEMP.setTo(x-texture.offsetX,y-texture.offsetY,width,height);
			var result=rect.intersection(Texture._rect1.setTo(0,0,texture.width,texture.height),Texture._rect2);
			if (result)
				var tex=Texture.create(texture,result.x,result.y,result.width,result.height,result.x-rect.x,result.y-rect.y,width,height);
			else return null;
			tex.bitmap.useNum--;
			return tex;
		}

		Texture.DEF_UV=[0,0,1.0,0,1.0,1.0,0,1.0];
		Texture.INV_UV=[0,1,1.0,1,1.0,0.0,0,0.0];
		Texture._rect1=new Rectangle();
		Texture._rect2=new Rectangle();
		return Texture;
	})(EventDispatcher)


	//class laya.ui.AutoBitmap extends laya.display.Graphics
	var AutoBitmap=(function(_super){
		function AutoBitmap(){
			this.autoCacheCmd=true;
			this._width=0;
			this._height=0;
			this._source=null;
			this._sizeGrid=null;
			this._isChanged=false;
			this._offset=null;
			AutoBitmap.__super.call(this);
		}

		__class(AutoBitmap,'laya.ui.AutoBitmap',_super);
		var __proto=AutoBitmap.prototype;
		/**@inheritDoc */
		__proto.destroy=function(){
			_super.prototype.destroy.call(this);
			this._source=null;
			this._sizeGrid=null;
			this._offset=null;
		}

		/**@private */
		__proto._setChanged=function(){
			if (!this._isChanged){
				this._isChanged=true;
				Laya.timer.callLater(this,this.changeSource);
			}
		}

		/**
		*@private
		*修改纹理资源。
		*/
		__proto.changeSource=function(){
			if (AutoBitmap.cacheCount++> 50)AutoBitmap.clearCache();
			this._isChanged=false;
			var source=this._source;
			if (!source || !source.bitmap)return;
			var width=this.width;
			var height=this.height;
			var sizeGrid=this._sizeGrid;
			var sw=source.sourceWidth;
			var sh=source.sourceHeight;
			if (!sizeGrid || (sw===width && sh===height)){
				this.cleanByTexture(source,this._offset ? this._offset[0] :0,this._offset ? this._offset[1] :0,width,height);
				}else {
				source.$_GID || (source.$_GID=Utils.getGID());
				var key=source.$_GID+"."+width+"."+height+"."+sizeGrid.join(".");
				if (AutoBitmap.cmdCaches[key]){
					this.cmds=AutoBitmap.cmdCaches[key];
					return;
				}
				this.clear();
				var top=sizeGrid[0];
				var right=sizeGrid[1];
				var bottom=sizeGrid[2];
				var left=sizeGrid[3];
				var repeat=sizeGrid[4];
				var needClip=false;
				if (left+right > width){
					var clipWidth=width;
					needClip=true;
					width=left+right;
				}
				if (needClip){
					this.save();
					this.clipRect(0,0,clipWidth,height);
				}
				left && top && this.drawTexture(AutoBitmap.getTexture(source,0,0,left,top),0,0,left,top);
				right && top && this.drawTexture(AutoBitmap.getTexture(source,sw-right,0,right,top),width-right,0,right,top);
				left && bottom && this.drawTexture(AutoBitmap.getTexture(source,0,sh-bottom,left,bottom),0,height-bottom,left,bottom);
				right && bottom && this.drawTexture(AutoBitmap.getTexture(source,sw-right,sh-bottom,right,bottom),width-right,height-bottom,right,bottom);
				top && this.drawBitmap(repeat,AutoBitmap.getTexture(source,left,0,sw-left-right,top),left,0,width-left-right,top);
				bottom && this.drawBitmap(repeat,AutoBitmap.getTexture(source,left,sh-bottom,sw-left-right,bottom),left,height-bottom,width-left-right,bottom);
				left && this.drawBitmap(repeat,AutoBitmap.getTexture(source,0,top,left,sh-top-bottom),0,top,left,height-top-bottom);
				right && this.drawBitmap(repeat,AutoBitmap.getTexture(source,sw-right,top,right,sh-top-bottom),width-right,top,right,height-top-bottom);
				this.drawBitmap(repeat,AutoBitmap.getTexture(source,left,top,sw-left-right,sh-top-bottom),left,top,width-left-right,height-top-bottom);
				if (needClip)this.restore();
				if (this.autoCacheCmd && !Render.isConchApp)AutoBitmap.cmdCaches[key]=this.cmds;
			}
			this._repaint();
		}

		__proto.drawBitmap=function(repeat,tex,x,y,width,height){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			if (width < 0.1 || height < 0.1)return;
			if (repeat && (tex.width!=width || tex.height !=height))this.fillTexture(tex,x,y,width,height);
			else this.drawTexture(tex,x,y,width,height);
		}

		/**
		*当前实例的有效缩放网格数据。
		*<p>如果设置为null,则在应用任何缩放转换时，将正常缩放整个显示对象。</p>
		*<p>数据格式：[上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)]。
		*<ul><li>例如：[4,4,4,4,1]</li></ul></p>
		*<p> <code>sizeGrid</code> 的值如下所示：
		*<ol>
		*<li>上边距</li>
		*<li>右边距</li>
		*<li>下边距</li>
		*<li>左边距</li>
		*<li>是否重复填充(值为0：不重复填充，1：重复填充)</li>
		*</ol></p>
		*<p>当定义 <code>sizeGrid</code> 属性时，该显示对象被分割到以 <code>sizeGrid</code> 数据中的"上边距,右边距,下边距,左边距" 组成的矩形为基础的具有九个区域的网格中，该矩形定义网格的中心区域。网格的其它八个区域如下所示：
		*<ul>
		*<li>矩形上方的区域</li>
		*<li>矩形外的右上角</li>
		*<li>矩形左侧的区域</li>
		*<li>矩形右侧的区域</li>
		*<li>矩形外的左下角</li>
		*<li>矩形下方的区域</li>
		*<li>矩形外的右下角</li>
		*<li>矩形外的左上角</li>
		*</ul>
		*同时也支持3宫格，比如0,4,0,4,1为水平3宫格，4,0,4,0,1为垂直3宫格，3宫格性能比9宫格高。
		*</p>
		*/
		__getset(0,__proto,'sizeGrid',function(){
			return this._sizeGrid;
			},function(value){
			this._sizeGrid=value;
			this._setChanged();
		});

		/**
		*表示显示对象的宽度，以像素为单位。
		*/
		__getset(0,__proto,'width',function(){
			if (this._width)return this._width;
			if (this._source)return this._source.sourceWidth;
			return 0;
			},function(value){
			if (this._width !=value){
				this._width=value;
				this._setChanged();
			}
		});

		/**
		*表示显示对象的高度，以像素为单位。
		*/
		__getset(0,__proto,'height',function(){
			if (this._height)return this._height;
			if (this._source)return this._source.sourceHeight;
			return 0;
			},function(value){
			if (this._height !=value){
				this._height=value;
				this._setChanged();
			}
		});

		/**
		*对象的纹理资源。
		*@see laya.resource.Texture
		*/
		__getset(0,__proto,'source',function(){
			return this._source;
			},function(value){
			if (value){
				this._source=value
				this._setChanged();
				}else {
				this._source=null;
				this.clear();
			}
		});

		AutoBitmap.getTexture=function(tex,x,y,width,height){
			if (width <=0)width=1;
			if (height <=0)height=1;
			tex.$_GID || (tex.$_GID=Utils.getGID())
			var key=tex.$_GID+"."+x+"."+y+"."+width+"."+height;
			var texture=AutoBitmap.textureCache[key];
			if (!texture){
				texture=AutoBitmap.textureCache[key]=Texture.createFromTexture(tex,x,y,width,height);
			}
			return texture;
		}

		AutoBitmap.clearCache=function(){
			AutoBitmap.cacheCount=0;
			AutoBitmap.cmdCaches={};
			AutoBitmap.textureCache={};
		}

		AutoBitmap.setCache=function(key,value){
			AutoBitmap.cacheCount++;
			AutoBitmap.textureCache[key]=value;
		}

		AutoBitmap.getCache=function(key){
			return AutoBitmap.textureCache[key];
		}

		AutoBitmap.cmdCaches={};
		AutoBitmap.cacheCount=0;
		AutoBitmap.textureCache={};
		return AutoBitmap;
	})(Graphics)


	//class laya.display.css.CSSStyle extends laya.display.css.Style
	var CSSStyle=(function(_super){
		function CSSStyle(ower){
			this._bgground=null;
			this._border=null;
			//this._ower=null;
			this._rect=null;
			this.lineHeight=0;
			CSSStyle.__super.call(this);
			this._padding=CSSStyle._PADDING;
			this._spacing=CSSStyle._SPACING;
			this._aligns=CSSStyle._ALIGNS;
			this._font=Font.EMPTY;
			this._ower=ower;
		}

		__class(CSSStyle,'laya.display.css.CSSStyle',_super);
		var __proto=CSSStyle.prototype;
		/**@inheritDoc */
		__proto.destroy=function(){
			this._ower=null;
			this._font=null;
			this._rect=null;
		}

		/**
		*复制传入的 CSSStyle 属性值。
		*@param src 待复制的 CSSStyle 对象。
		*/
		__proto.inherit=function(src){
			this._font=src._font;
			this._spacing=src._spacing===CSSStyle._SPACING ? CSSStyle._SPACING :src._spacing.slice();
			this.lineHeight=src.lineHeight;
		}

		/**@private */
		__proto._widthAuto=function(){
			return (this._type & 0x40000)!==0;
		}

		/**@inheritDoc */
		__proto.widthed=function(sprite){
			return (this._type & 0x8)!=0;
		}

		/**
		*@private
		*/
		__proto._calculation=function(type,value){
			if (value.indexOf('%')< 0)return false;
			var ower=this._ower;
			var parent=ower.parent;
			var rect=this._rect;
			function getValue (pw,w,nums){
				return (pw *nums[0]+w *nums[1]+nums[2]);
			}
			function onParentResize (type){
				var pw=parent.width,w=ower.width;
				rect.width && (ower.width=getValue(pw,w,rect.width));
				rect.height && (ower.height=getValue(pw,w,rect.height));
				rect.left && (ower.x=getValue(pw,w,rect.left));
				rect.top && (ower.y=getValue(pw,w,rect.top));
			}
			if (rect===null){
				parent._getCSSStyle()._type |=0x80000;
				parent.on("resize",this,onParentResize);
				this._rect=rect={input:{}};
			};
			var nums=value.split(' ');
			nums[0]=parseFloat(nums[0])/ 100;
			if (nums.length==1)
				nums[1]=nums[2]=0;
			else {
				nums[1]=parseFloat(nums[1])/ 100;
				nums[2]=parseFloat(nums[2]);
			}
			rect[type]=nums;
			rect.input[type]=value;
			onParentResize(type);
			return true;
		}

		/**
		*是否已设置高度。
		*@param sprite 显示对象 Sprite。
		*@return 一个Boolean 表示是否已设置高度。
		*/
		__proto.heighted=function(sprite){
			return (this._type & 0x2000)!=0;
		}

		/**
		*设置宽高。
		*@param w 宽度。
		*@param h 高度。
		*/
		__proto.size=function(w,h){
			var ower=this._ower;
			var resize=false;
			if (w!==-1 && w !=this._ower.width){
				this._type |=0x8;
				this._ower.width=w;
				resize=true;
			}
			if (h!==-1 && h !=this._ower.height){
				this._type |=0x2000;
				this._ower.height=h;
				resize=true;
			}
			if (resize){
				ower._layoutLater();
				(this._type & 0x80000)&& ower.event("resize",this);
			}
		}

		/**@private */
		__proto._getAlign=function(){
			return this._aligns[0];
		}

		/**@private */
		__proto._getValign=function(){
			return this._aligns[1];
		}

		/**@private */
		__proto._getCssFloat=function(){
			return (this._type & 0x8000)!=0 ? 0x8000 :0;
		}

		__proto._createFont=function(){
			return (this._type & 0x1000)? this._font :(this._type |=0x1000,this._font=new Font(this._font));
		}

		/**@inheritDoc */
		__proto.render=function(sprite,context,x,y){
			var w=sprite.width;
			var h=sprite.height;
			x-=sprite.pivotX;
			y-=sprite.pivotY;
			this._bgground && this._bgground.color !=null && context.ctx.fillRect(x,y,w,h,this._bgground.color);
			this._border && this._border.color && context.drawRect(x,y,w,h,this._border.color.strColor,this._border.size);
		}

		/**@inheritDoc */
		__proto.getCSSStyle=function(){
			return this;
		}

		/**
		*设置 CSS 样式字符串。
		*@param text CSS样式字符串。
		*/
		__proto.cssText=function(text){
			this.attrs(CSSStyle.parseOneCSS(text,';'));
		}

		/**
		*根据传入的属性名、属性值列表，设置此对象的属性值。
		*@param attrs 属性名与属性值列表。
		*/
		__proto.attrs=function(attrs){
			if (attrs){
				for (var i=0,n=attrs.length;i < n;i++){
					var attr=attrs[i];
					this[attr[0]]=attr[1];
				}
			}
		}

		/**@inheritDoc */
		__proto.setTransform=function(value){
			(value==='none')? (this._tf=Style._TF_EMPTY):this.attrs(CSSStyle.parseOneCSS(value,','));
		}

		/**
		*定义 X 轴、Y 轴移动转换。
		*@param x X 轴平移量。
		*@param y Y 轴平移量。
		*/
		__proto.translate=function(x,y){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.translateX=x;
			this._tf.translateY=y;
		}

		/**
		*定义 缩放转换。
		*@param x X 轴缩放值。
		*@param y Y 轴缩放值。
		*/
		__proto.scale=function(x,y){
			this._tf===Style._TF_EMPTY && (this._tf=new TransformInfo());
			this._tf.scaleX=x;
			this._tf.scaleY=y;
		}

		/**@private */
		__proto._enableLayout=function(){
			return (this._type & 0x2)===0 && (this._type & 0x4)===0;
		}

		/**
		*是否显示为块级元素。
		*/
		__getset(0,__proto,'block',_super.prototype._$get_block,function(value){
			value ? (this._type |=0x1):(this._type &=(~0x1));
		});

		/**
		*垂直对齐方式。
		*/
		__getset(0,__proto,'valign',function(){
			return CSSStyle._valigndef[this._aligns[1]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[1]=CSSStyle._valigndef[value];
		});

		/**
		*高度。
		*/
		__getset(0,__proto,'height',null,function(h){
			this._type |=0x2000;
			if ((typeof h=='string')){
				if (this._calculation("height",h))return;
				h=parseInt(h);
			}
			this.size(-1,h);
		});

		/**
		*宽度。
		*/
		__getset(0,__proto,'width',null,function(w){
			this._type |=0x8;
			if ((typeof w=='string')){
				var offset=w.indexOf('auto');
				if (offset >=0){
					this._type |=0x40000;
					w=w.substr(0,offset);
				}
				if (this._calculation("width",w))return;
				w=parseInt(w);
			}
			this.size(w,-1);
		});

		/**
		*字体粗细。
		*/
		__getset(0,__proto,'fontWeight',function(){
			return this._font.weight;
			},function(value){
			this._createFont().weight=value;
		});

		/**
		*表示左边距。
		*/
		__getset(0,__proto,'left',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="center")
					value="50% -50% 0";
				else if (value==="right")
				value="100% -100% 0";
				if (this._calculation("left",value))return;
				value=parseInt(value);
			}
			ower.x=value;
		});

		__getset(0,__proto,'_translate',null,function(value){
			this.translate(value[0],value[1]);
		});

		/**@inheritDoc */
		__getset(0,__proto,'absolute',function(){
			return (this._type & 0x4)!==0;
		});

		/**
		*表示上边距。
		*/
		__getset(0,__proto,'top',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="middle")
					value="50% -50% 0";
				else if (value==="bottom")
				value="100% -100% 0";
				if (this._calculation("top",value))return;
				value=parseInt(value);
			}
			ower.y=value;
		});

		/**
		*水平对齐方式。
		*/
		__getset(0,__proto,'align',function(){
			return CSSStyle._aligndef[this._aligns[0]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[0]=CSSStyle._aligndef[value];
		});

		/**
		*表示是否加粗。
		*/
		__getset(0,__proto,'bold',function(){
			return this._font.bold;
			},function(value){
			this._createFont().bold=value;
		});

		/**
		*边距信息。
		*/
		__getset(0,__proto,'padding',function(){
			return this._padding;
			},function(value){
			this._padding=value;
		});

		/**
		*行间距。
		*/
		__getset(0,__proto,'leading',function(){
			return this._spacing[1];
			},function(d){
			((typeof d=='string'))&& (d=parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[1]=d;
		});

		/**
		*是否是行元素。
		*/
		__getset(0,__proto,'lineElement',function(){
			return (this._type & 0x10000)!=0;
			},function(value){
			value ? (this._type |=0x10000):(this._type &=(~0x10000));
		});

		/**
		*浮动方向。
		*/
		__getset(0,__proto,'cssFloat',function(){
			return (this._type & 0x8000)!=0 ? "right" :"left";
			},function(value){
			this.lineElement=false;
			value==="right" ? (this._type |=0x8000):(this._type &=(~0x8000));
		});

		/**
		*添加到文本的修饰。
		*/
		__getset(0,__proto,'textDecoration',function(){
			return this._font.decoration;
			},function(value){
			this._createFont().decoration=value;
		});

		/**
		*设置如何处理元素内的空白。
		*/
		__getset(0,__proto,'whiteSpace',function(){
			return (this._type & 0x20000)? "nowrap" :"";
			},function(type){
			type==="nowrap" && (this._type |=0x20000);
			type==="none" && (this._type &=~0x20000);
		});

		__getset(0,__proto,'background',null,function(value){
			if (!value){
				this._bgground=null;
				return;
			}
			this._bgground || (this._bgground={});
			this._bgground.color=value;
			this._ower.conchModel && this._ower.conchModel.bgColor(value);
			this._type |=0x4000;
			this._ower._renderType |=0x100;
		});

		/**
		*表示是否换行。
		*/
		__getset(0,__proto,'wordWrap',function(){
			return (this._type & 0x20000)===0;
			},function(value){
			value ? (this._type &=~0x20000):(this._type |=0x20000);
		});

		/**
		*字体颜色。
		*/
		__getset(0,__proto,'color',function(){
			return this._font.color;
			},function(value){
			this._createFont().color=value;
		});

		/**
		*<p>指定文本字段是否是密码文本字段。</p>
		*如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
		*/
		__getset(0,__proto,'password',function(){
			return this._font.password;
			},function(value){
			this._createFont().password=value;
		});

		/**
		*背景颜色。
		*/
		__getset(0,__proto,'backgroundColor',function(){
			return this._bgground ? this._bgground.color :null;
			},function(value){
			if (value==='none')this._bgground=null;
			else (this._bgground || (this._bgground={}),this._bgground.color=value);
			this._ower.conchModel && this._ower.conchModel.bgColor(value);
			this._ower._renderType |=0x100;
		});

		/**
		*字体信息。
		*/
		__getset(0,__proto,'font',function(){
			return this._font.toString();
			},function(value){
			this._createFont().set(value);
		});

		/**
		*文本的粗细。
		*/
		__getset(0,__proto,'weight',null,function(value){
			this._createFont().weight=value;
		});

		/**
		*间距。
		*/
		__getset(0,__proto,'letterSpacing',function(){
			return this._spacing[0];
			},function(d){
			((typeof d=='string'))&& (d=parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[0]=d;
		});

		/**
		*字体大小。
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._font.size;
			},function(value){
			this._createFont().size=value;
		});

		/**
		*表示是否为斜体。
		*/
		__getset(0,__proto,'italic',function(){
			return this._font.italic;
			},function(value){
			this._createFont().italic=value;
		});

		/**
		*字体系列。
		*/
		__getset(0,__proto,'fontFamily',function(){
			return this._font.family;
			},function(value){
			this._createFont().family=value;
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*@default 0
		*/
		__getset(0,__proto,'stroke',function(){
			return this._font.stroke[0];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[0]=value;
		});

		/**
		*<p>描边颜色，以字符串表示。</p>
		*@default "#000000";
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._font.stroke[1];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[1]=value;
		});

		/**
		*边框属性，比如border="5px solid red"
		*/
		__getset(0,__proto,'border',function(){
			return this._border ? this._border.value :"";
			},function(value){
			if (value=='none'){
				this._border=null;
				return;
			}
			this._border || (this._border={});
			this._border.value=value;
			var values=value.split(' ');
			this._border.color=Color.create(values[values.length-1]);
			if (values.length==1){
				this._border.size=1;
				this._border.type='solid';
				return;
			};
			var i=0;
			if (values[0].indexOf('px')> 0){
				this._border.size=parseInt(values[0]);
				i++;
			}else this._border.size=1;
			this._border.type=values[i];
			this._ower._renderType |=0x100;
		});

		/**
		*边框的颜色。
		*/
		__getset(0,__proto,'borderColor',function(){
			return (this._border && this._border.color)? this._border.color.strColor :null;
			},function(value){
			if (!value){
				this._border=null;
				return;
			}
			this._border || (this._border={size:1,type:'solid'});
			this._border.color=(value==null)? null :Color.create(value);
			this._ower.conchModel && this._ower.conchModel.border(this._border.color.strColor);
			this._ower._renderType |=0x100;
		});

		/**
		*元素的定位类型。
		*/
		__getset(0,__proto,'position',function(){
			return (this._type & 0x4)? "absolute" :"";
			},function(value){
			value=="absolute" ? (this._type |=0x4):(this._type &=~0x4);
		});

		/**
		*规定元素应该生成的框的类型。
		*/
		__getset(0,__proto,'display',null,function(value){
			switch (value){
				case '':
					this._type &=~0x2;
					this.visible=true;
					break ;
				case 'none':
					this._type |=0x2;
					this.visible=false;
					this._ower._layoutLater();
					break ;
				}
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingLeft',function(){
			return this.padding[3];
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingTop',function(){
			return this.padding[0];
		});

		__getset(0,__proto,'_scale',null,function(value){
			this._ower.scale(value[0],value[1]);
		});

		__getset(0,__proto,'_rotate',null,function(value){
			this._ower.rotation=value;
		});

		CSSStyle.parseOneCSS=function(text,clipWord){
			var out=[];
			var attrs=text.split(clipWord);
			var valueArray;
			for (var i=0,n=attrs.length;i < n;i++){
				var attr=attrs[i];
				var ofs=attr.indexOf(':');
				var name=attr.substr(0,ofs).replace(/^\s+|\s+$/g,'');
				if (name.length==0)
					continue ;
				var value=attr.substr(ofs+1).replace(/^\s+|\s+$/g,'');
				var one=[name,value];
				switch (name){
					case 'italic':
					case 'bold':
						one[1]=value=="true";
						break ;
					case 'line-height':
						one[0]='lineHeight';
						one[1]=parseInt(value);
						break ;
					case 'font-size':
						one[0]='fontSize';
						one[1]=parseInt(value);
						break ;
					case 'padding':
						valueArray=value.split(' ');
						valueArray.length > 1 || (valueArray[1]=valueArray[2]=valueArray[3]=valueArray[0]);
						one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1]),parseInt(valueArray[2]),parseInt(valueArray[3])];
						break ;
					case 'rotate':
						one[0]="_rotate";
						one[1]=parseFloat(value);
						break ;
					case 'scale':
						valueArray=value.split(' ');
						one[0]="_scale";
						one[1]=[parseFloat(valueArray[0]),parseFloat(valueArray[1])];
						break ;
					case 'translate':
						valueArray=value.split(' ');
						one[0]="_translate";
						one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1])];
						break ;
					default :
						(one[0]=CSSStyle._CSSTOVALUE[name])|| (one[0]=name);
					}
				out.push(one);
			}
			return out;
		}

		CSSStyle.parseCSS=function(text,uri){
			var one;
			while ((one=CSSStyle._parseCSSRegExp.exec(text))!=null){
				CSSStyle.styleSheets[one[1]]=CSSStyle.parseOneCSS(one[2],';');
			}
		}

		CSSStyle.EMPTY=new CSSStyle(null);
		CSSStyle._CSSTOVALUE={'letter-spacing':'letterSpacing','line-spacing':'lineSpacing','white-space':'whiteSpace','line-height':'lineHeight','scale-x':'scaleX','scale-y':'scaleY','translate-x':'translateX','translate-y':'translateY','font-family':'fontFamily','font-weight':'fontWeight','vertical-align':'valign','text-decoration':'textDecoration','background-color':'backgroundColor','border-color':'borderColor','float':'cssFloat'};
		CSSStyle._parseCSSRegExp=new RegExp("([\.\#]\\w+)\\s*{([\\s\\S]*?)}","g");
		CSSStyle._aligndef={'left':0,'center':1,'right':2,0:'left',1:'center',2:'right'};
		CSSStyle._valigndef={'top':0,'middle':1,'bottom':2,0:'top',1:'middle',2:'bottom'};
		CSSStyle.styleSheets={};
		CSSStyle.ALIGN_CENTER=1;
		CSSStyle.ALIGN_RIGHT=2;
		CSSStyle.VALIGN_MIDDLE=1;
		CSSStyle.VALIGN_BOTTOM=2;
		CSSStyle._CSS_BLOCK=0x1;
		CSSStyle._DISPLAY_NONE=0x2;
		CSSStyle._ABSOLUTE=0x4;
		CSSStyle._WIDTH_SET=0x8;
		CSSStyle._PADDING=[0,0,0,0];
		CSSStyle._RECT=[-1,-1,-1,-1];
		CSSStyle._SPACING=[0,0];
		CSSStyle._ALIGNS=[0,0,0];
		CSSStyle.ADDLAYOUTED=0x200;
		CSSStyle._NEWFONT=0x1000;
		CSSStyle._HEIGHT_SET=0x2000;
		CSSStyle._BACKGROUND_SET=0x4000;
		CSSStyle._FLOAT_RIGHT=0x8000;
		CSSStyle._LINE_ELEMENT=0x10000;
		CSSStyle._NOWARP=0x20000;
		CSSStyle._WIDTHAUTO=0x40000;
		CSSStyle._LISTERRESZIE=0x80000;
		return CSSStyle;
	})(Style)


	//class laya.filters.ColorFilter extends laya.filters.Filter
	var ColorFilter=(function(_super){
		function ColorFilter(mat){
			//this._mat=null;
			//this._alpha=null;
			ColorFilter.__super.call(this);
			if (!mat){
				mat=[0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0];
			}
			this._mat=new Float32Array(16);
			this._alpha=new Float32Array(4);
			var j=0;
			var z=0;
			for (var i=0;i < 20;i++){
				if (i % 5 !=4){
					this._mat[j++]=mat[i];
					}else {
					this._alpha[z++]=mat[i];
				}
			}
			this._action=RunDriver.createFilterAction(0x20);
			this._action.data=this;
		}

		__class(ColorFilter,'laya.filters.ColorFilter',_super);
		var __proto=ColorFilter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		/**
		*@private 通知微端
		*/
		__proto.callNative=function(sp){
			var t=sp._$P.cf=this;
			sp.conchModel && sp.conchModel.setFilterMatrix && sp.conchModel.setFilterMatrix(this._mat,this._alpha);
		}

		/**@private */
		__getset(0,__proto,'type',function(){
			return 0x20;
		});

		/**@private */
		__getset(0,__proto,'action',function(){
			return this._action;
		});

		return ColorFilter;
	})(Filter)


	//class laya.ui.UIEvent extends laya.events.Event
	var UIEvent=(function(_super){
		function UIEvent(){UIEvent.__super.call(this);;
		};

		__class(UIEvent,'laya.ui.UIEvent',_super);
		UIEvent.SHOW_TIP="showtip";
		UIEvent.HIDE_TIP="hidetip";
		return UIEvent;
	})(Event)


	//class laya.display.Sprite extends laya.display.Node
	var Sprite=(function(_super){
		function Sprite(){
			this._transform=null;
			this._tfChanged=false;
			this._x=0;
			this._y=0;
			this._width=0;
			this._height=0;
			this._repaint=1;
			this._mouseEnableState=0;
			this._zOrder=0;
			this._graphics=null;
			this._renderType=0;
			this._optimizeScrollRect=false;
			this._texture=null;
			this.mouseThrough=false;
			this.autoSize=false;
			this.hitTestPrior=false;
			this.viewport=null;
			Sprite.__super.call(this);
			this._style=Style.EMPTY;
		}

		__class(Sprite,'laya.display.Sprite',_super);
		var __proto=Sprite.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		/**@private */
		__proto.createConchModel=function(){
			return new ConchNode();
		}

		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._style && this._style.destroy();
			this._transform=null;
			this._style=null;
			this._graphics=null;
		}

		/**根据zOrder进行重新排序。*/
		__proto.updateZOrder=function(){
			Utils.updateOrder(this._childs)&& this.repaint();
		}

		/**在设置cacheAs的情况下，调用此方法会重新刷新缓存。*/
		__proto.reCache=function(){
			if (this._$P.cacheCanvas)this._$P.cacheCanvas.reCache=true;
			this._repaint=1;
		}

		/**
		*设置对象bounds大小，如果有设置，则不再通过getBounds计算，合理使用能提高性能。
		*@param bound bounds矩形区域
		*/
		__proto.setBounds=function(bound){
			this._set$P("uBounds",bound);
		}

		/**
		*<p>获取本对象在父容器坐标系的矩形显示区域。</p>
		*<p><b>注意：</b>计算量较大，尽量少用。</p>
		*@return 矩形区域。
		*/
		__proto.getBounds=function(){
			if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
			return Rectangle._getWrapRec(this._boundPointsToParent(),this._$P.mBounds);
		}

		/**
		*获取本对象在自己坐标系的矩形显示区域。
		*<p><b>注意：</b>计算量较大，尽量少用。</p>
		*@return 矩形区域。
		*/
		__proto.getSelfBounds=function(){
			if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
			return Rectangle._getWrapRec(this._getBoundPointsM(false),this._$P.mBounds);
		}

		/**
		*@private
		*获取本对象在父容器坐标系的显示区域多边形顶点列表。
		*当显示对象链中有旋转时，返回多边形顶点列表，无旋转时返回矩形的四个顶点。
		*@param ifRotate （可选）之前的对象链中是否有旋转。
		*@return 顶点列表。结构：[x1,y1,x2,y2,x3,y3,...]。
		*/
		__proto._boundPointsToParent=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var pX=0,pY=0;
			if (this._style){
				pX=this._style._tf.translateX;
				pY=this._style._tf.translateY;
				ifRotate=ifRotate || (this._style._tf.rotate!==0);
				if (this._style.scrollRect){
					pX+=this._style.scrollRect.x;
					pY+=this._style.scrollRect.y;
				}
			};
			var pList=this._getBoundPointsM(ifRotate);
			if (!pList || pList.length < 1)return pList;
			if (pList.length !=8){
				pList=ifRotate ? GrahamScan.scanPList(pList):Rectangle._getWrapRec(pList,Rectangle.TEMP)._getBoundPoints();
			}
			if (!this.transform){
				Utils.transPointList(pList,this._x-pX,this._y-pY);
				return pList;
			};
			var tPoint=Point.TEMP;
			var i=0,len=pList.length;
			for (i=0;i < len;i+=2){
				tPoint.x=pList[i];
				tPoint.y=pList[i+1];
				this.toParentPoint(tPoint);
				pList[i]=tPoint.x;
				pList[i+1]=tPoint.y;
			}
			return pList;
		}

		/**
		*返回此实例中的绘图对象（ <code>Graphics</code> ）的显示区域，不包括子对象。
		*@param realSize （可选）使用图片的真实大小，默认为false
		*@return 一个 Rectangle 对象，表示获取到的显示区域。
		*/
		__proto.getGraphicBounds=function(realSize){
			(realSize===void 0)&& (realSize=false);
			if (!this._graphics)return Rectangle.TEMP.setTo(0,0,0,0);
			return this._graphics.getBounds(realSize);
		}

		/**
		*@private
		*获取自己坐标系的显示区域多边形顶点列表
		*@param ifRotate （可选）当前的显示对象链是否由旋转
		*@return 顶点列表。结构：[x1,y1,x2,y2,x3,y3,...]。
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			if (this._$P.uBounds)return this._$P.uBounds._getBoundPoints();
			if (!this._$P.temBM)this._set$P("temBM",[]);
			if (this.scrollRect){
				var rst=Utils.clearArray(this._$P.temBM);
				var rec=Rectangle.TEMP;
				rec.copyFrom(this.scrollRect);
				Utils.concatArray(rst,rec._getBoundPoints());
				return rst;
			};
			var pList=this._graphics ? this._graphics.getBoundPoints():Utils.clearArray(this._$P.temBM);
			var child;
			var cList;
			var __childs;
			__childs=this._childs;
			for (var i=0,n=__childs.length;i < n;i++){
				child=__childs [i];
				if ((child instanceof laya.display.Sprite )&& child.visible==true){
					cList=child._boundPointsToParent(ifRotate);
					if (cList)
						pList=pList ? Utils.concatArray(pList,cList):cList;
				}
			}
			return pList;
		}

		/**
		*@private
		*获取样式。
		*@return 样式 Style 。
		*/
		__proto.getStyle=function(){
			this._style===Style.EMPTY && (this._style=new Style());
			return this._style;
		}

		/**
		*@private
		*设置样式。
		*@param value 样式。
		*/
		__proto.setStyle=function(value){
			this._style=value;
		}

		/**@private */
		__proto._adjustTransform=function(){
			'use strict';
			this._tfChanged=false;
			var style=this._style;
			var tf=style._tf;
			var sx=tf.scaleX,sy=tf.scaleY;
			var m;
			if (tf.rotate || sx!==1 || sy!==1 || tf.skewX || tf.skewY){
				m=this._transform || (this._transform=Matrix.create());
				m.bTransform=true;
				var skx=(tf.rotate-tf.skewX)*0.0174532922222222;
				var sky=(tf.rotate+tf.skewY)*0.0174532922222222;
				var cx=Math.cos(sky);
				var ssx=Math.sin(sky);
				var cy=Math.sin(skx);
				var ssy=Math.cos(skx);
				m.a=sx *cx;
				m.b=sx *ssx;
				m.c=-sy *cy;
				m.d=sy *ssy;
				m.tx=m.ty=0;
				return m;
				}else {
				this._transform && this._transform.destroy();
				this._transform=null;
				this._renderType &=~0x04;
			}
			return m;
		}

		/**
		*<p>设置坐标位置。相当于分别设置x和y属性。</p>
		*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.pos(...).scale(...);</p>
		*@param x X轴坐标。
		*@param y Y轴坐标。
		*@param speedMode （可选）是否极速模式，正常是调用this.x=value进行赋值，极速模式直接调用内部函数处理，如果未重写x,y属性，建议设置为急速模式性能更高。
		*@return 返回对象本身。
		*/
		__proto.pos=function(x,y,speedMode){
			(speedMode===void 0)&& (speedMode=false);
			if (this._x!==x || this._y!==y){
				if (this.destroyed)return this;
				if (speedMode){
					this._x=x;
					this._y=y;
					this.conchModel && this.conchModel.pos(this._x,this._y);
					var p=this._parent;
					if (p && p._repaint===0){
						p._repaint=1;
						p.parentRepaint();
					}
					if (this._$P.maskParent && this._$P.maskParent._repaint===0){
						this._$P.maskParent._repaint=1;
						this._$P.maskParent.parentRepaint();
					}
					}else {
					this.x=x;
					this.y=y;
				}
			}
			return this;
		}

		/**
		*<p>设置轴心点。相当于分别设置pivotX和pivotY属性。</p>
		*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.pivot(...).pos(50,100);</p>
		*@param x X轴心点。
		*@param y Y轴心点。
		*@return 返回对象本身。
		*/
		__proto.pivot=function(x,y){
			this.pivotX=x;
			this.pivotY=y;
			return this;
		}

		/**
		*<p>设置宽高。相当于分别设置width和height属性。</p>
		*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.size(...).pos(50,100);</p>
		*@param width 宽度值。
		*@param hegiht 高度值。
		*@return 返回对象本身。
		*/
		__proto.size=function(width,height){
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*<p>设置缩放。相当于分别设置scaleX和scaleY属性。</p>
		*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.scale(...).pos(50,100);</p>
		*@param scaleX X轴缩放比例。
		*@param scaleY Y轴缩放比例。
		*@param speedMode （可选）是否极速模式，正常是调用this.scaleX=value进行赋值，极速模式直接调用内部函数处理，如果未重写scaleX,scaleY属性，建议设置为急速模式性能更高。
		*@return 返回对象本身。
		*/
		__proto.scale=function(scaleX,scaleY,speedMode){
			(speedMode===void 0)&& (speedMode=false);
			var style=this.getStyle();
			var _tf=style._tf;
			if (_tf.scaleX !=scaleX || _tf.scaleY !=scaleY){
				if (this.destroyed)return this;
				if (speedMode){
					style.setScale(scaleX,scaleY);
					this._tfChanged=true;
					this.conchModel && this.conchModel.scale(scaleX,scaleY);
					this._renderType |=0x04;
					var p=this._parent;
					if (p && p._repaint===0){
						p._repaint=1;
						p.parentRepaint();
					}
					}else {
					this.scaleX=scaleX;
					this.scaleY=scaleY;
				}
			}
			return this;
		}

		/**
		*<p>设置倾斜角度。相当于分别设置skewX和skewY属性。</p>
		*<p>因为返回值为Sprite对象本身，所以可以使用如下语法：spr.skew(...).pos(50,100);</p>
		*@param skewX 水平倾斜角度。
		*@param skewY 垂直倾斜角度。
		*@return 返回对象本身
		*/
		__proto.skew=function(skewX,skewY){
			this.skewX=skewX;
			this.skewY=skewY;
			return this;
		}

		/**
		*更新、呈现显示对象。由系统调用。
		*@param context 渲染的上下文引用。
		*@param x X轴坐标。
		*@param y Y轴坐标。
		*/
		__proto.render=function(context,x,y){
			Stat.spriteCount++;
			RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
			this._repaint=0;
		}

		/**
		*<p>绘制 当前<code>Sprite</code> 到 <code>Canvas</code> 上，并返回一个HtmlCanvas。</p>
		*<p>绘制的结果可以当作图片源，再次绘制到其他Sprite里面，示例：</p>
		*
		*var htmlCanvas:HTMLCanvas=sprite.drawToCanvas(100,100,0,0);//把精灵绘制到canvas上面
		*var texture:Texture=new Texture(htmlCanvas);//使用htmlCanvas创建Texture
		*var sp:Sprite=new Sprite().pos(0,200);//创建精灵并把它放倒200位置
		*sp.graphics.drawTexture(texture);//把截图绘制到精灵上
		*Laya.stage.addChild(sp);//把精灵显示到舞台
		*
		*<p>也可以获取原始图片数据，分享到网上，从而实现截图效果，示例：</p>
		*
		*var htmlCanvas:HTMLCanvas=sprite.drawToCanvas(100,100,0,0);//把精灵绘制到canvas上面
		*var canvas:*=htmlCanvas.getCanvas();//获取原生的canvas对象
		*trace(canvas.toDataURL("image/png"));//打印图片base64信息，可以发给服务器或者保存为图片
		*
		*@param canvasWidth 画布宽度。
		*@param canvasHeight 画布高度。
		*@param x 绘制的 X 轴偏移量。
		*@param y 绘制的 Y 轴偏移量。
		*@return HTMLCanvas 对象。
		*/
		__proto.drawToCanvas=function(canvasWidth,canvasHeight,offsetX,offsetY){
			if (Render.isConchNode){
				var canvas=HTMLCanvas.create("2D");
				var context=new RenderContext(canvasWidth,canvasHeight,canvas);
				context.ctx.setCanvasType(1);
				this.conchModel.drawToCanvas(canvas.source,offsetX,offsetY);
				return canvas;
				}else {
				return RunDriver.drawToCanvas(this,this._renderType,canvasWidth,canvasHeight,offsetX,offsetY);
			}
		}

		/**
		*<p>自定义更新、呈现显示对象。一般用来扩展渲染模式，请合理使用，可能会导致在加速器上无法渲染。</p>
		*<p><b>注意</b>不要在此函数内增加或删除树节点，否则会对树节点遍历造成影响。</p>
		*@param context 渲染的上下文引用。
		*@param x X轴坐标。
		*@param y Y轴坐标。
		*/
		__proto.customRender=function(context,x,y){
			this._renderType |=0x400;
		}

		/**
		*@private
		*应用滤镜。
		*/
		__proto._applyFilters=function(){
			if (Render.isWebGL)return;
			var _filters;
			_filters=this._$P.filters;
			if (!_filters || _filters.length < 1)return;
			for (var i=0,n=_filters.length;i < n;i++){
				_filters[i].action.apply(this._$P.cacheCanvas);
			}
		}

		/**
		*@private
		*查看当前原件中是否包含发光滤镜。
		*@return 一个 Boolean 值，表示当前原件中是否包含发光滤镜。
		*/
		__proto._isHaveGlowFilter=function(){
			var i=0,len=0;
			if (this.filters){
				for (i=0;i < this.filters.length;i++){
					if (this.filters[i].type==0x08){
						return true;
					}
				}
			}
			for (i=0,len=this._childs.length;i < len;i++){
				if (this._childs[i]._isHaveGlowFilter()){
					return true;
				}
			}
			return false;
		}

		/**
		*把本地坐标转换为相对stage的全局坐标。
		*@param point 本地坐标点。
		*@param createNewPoint （可选）是否创建一个新的Point对象作为返回值，默认为false，使用输入的point对象返回，减少对象创建开销。
		*@return 转换后的坐标的点。
		*/
		__proto.localToGlobal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (createNewPoint===true){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			while (ele){
				if (ele==Laya.stage)break ;
				point=ele.toParentPoint(point);
				ele=ele.parent;
			}
			return point;
		}

		/**
		*把stage的全局坐标转换为本地坐标。
		*@param point 全局坐标点。
		*@param createNewPoint （可选）是否创建一个新的Point对象作为返回值，默认为false，使用输入的point对象返回，减少对象创建开销。
		*@return 转换后的坐标的点。
		*/
		__proto.globalToLocal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (createNewPoint){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			var list=[];
			while (ele){
				if (ele==Laya.stage)break ;
				list.push(ele);
				ele=ele.parent;
			};
			var i=list.length-1;
			while (i >=0){
				ele=list[i];
				point=ele.fromParentPoint(point);
				i--;
			}
			return point;
		}

		/**
		*将本地坐标系坐标转转换到父容器坐标系。
		*@param point 本地坐标点。
		*@return 转换后的点。
		*/
		__proto.toParentPoint=function(point){
			if (!point)return point;
			point.x-=this.pivotX;
			point.y-=this.pivotY;
			if (this.transform){
				this._transform.transformPoint(point);
			}
			point.x+=this._x;
			point.y+=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x-=scroll.x;
				point.y-=scroll.y;
			}
			return point;
		}

		/**
		*将父容器坐标系坐标转换到本地坐标系。
		*@param point 父容器坐标点。
		*@return 转换后的点。
		*/
		__proto.fromParentPoint=function(point){
			if (!point)return point;
			point.x-=this._x;
			point.y-=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x+=scroll.x;
				point.y+=scroll.y;
			}
			if (this.transform){
				this._transform.invertTransformPoint(point);
			}
			point.x+=this.pivotX;
			point.y+=this.pivotY;
			return point;
		}

		/**
		*<p>增加事件侦听器，以使侦听器能够接收事件通知。</p>
		*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args （可选）事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.on=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				this.mouseEnabled=true;
				this._setBit(0x2,true);
				if (this._parent){
					this._$2__onDisplay();
				}
				return this._createListener(type,caller,listener,args,false);
			}
			return _super.prototype.on.call(this,type,caller,listener,args);
		}

		/**
		*<p>增加事件侦听器，以使侦听器能够接收事件通知，此侦听事件响应一次后则自动移除侦听。</p>
		*<p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args （可选）事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.once=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				this.mouseEnabled=true;
				this._setBit(0x2,true);
				if (this._parent){
					this._$2__onDisplay();
				}
				return this._createListener(type,caller,listener,args,true);
			}
			return _super.prototype.once.call(this,type,caller,listener,args);
		}

		/**@private */
		__proto._$2__onDisplay=function(){
			if (this._mouseEnableState!==1){
				var ele=this;
				ele=ele.parent;
				while (ele && ele._mouseEnableState!==1){
					if (ele._getBit(0x2))break ;
					ele.mouseEnabled=true;
					ele._setBit(0x2,true);
					ele=ele.parent;
				}
			}
		}

		/**
		*<p>加载并显示一个图片。功能等同于graphics.loadImage方法。支持异步加载。</p>
		*<p>注意：多次调用loadImage绘制不同的图片，会同时显示。</p>
		*@param url 图片地址。
		*@param x （可选）显示图片的x位置。
		*@param y （可选）显示图片的y位置。
		*@param width （可选）显示图片的宽度，设置为0表示使用图片默认宽度。
		*@param height （可选）显示图片的高度，设置为0表示使用图片默认高度。
		*@param complete （可选）加载完成回调。
		*@return 返回精灵对象本身。
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			function loaded (tex){
				if (!_$this.destroyed){
					_$this.size(x+(width || tex.width),y+(height || tex.height));
					_$this.repaint();
					complete && complete.runWith(tex);
				}
			}
			this.graphics.loadImage(url,x,y,width,height,loaded);
			return this;
		}

		/**cacheAs后，设置自己和父对象缓存失效。*/
		__proto.repaint=function(){
			this.conchModel && this.conchModel.repaint && this.conchModel.repaint();
			if (this._repaint===0){
				this._repaint=1;
				this.parentRepaint();
			}
			if (this._$P && this._$P.maskParent){
				this._$P.maskParent.repaint();
			}
		}

		/**
		*@private
		*获取是否重新缓存。
		*@return 如果重新缓存值为 true，否则值为 false。
		*/
		__proto._needRepaint=function(){
			return (this._repaint!==0)&& this._$P.cacheCanvas && this._$P.cacheCanvas.reCache;
		}

		/**@private */
		__proto._childChanged=function(child){
			if (this._childs.length)this._renderType |=0x800;
			else this._renderType &=~0x800;
			if (child && this._get$P("hasZorder"))Laya.timer.callLater(this,this.updateZOrder);
			this.repaint();
		}

		/**cacheAs时，设置所有父对象缓存失效。 */
		__proto.parentRepaint=function(){
			var p=this._parent;
			if (p && p._repaint===0){
				p._repaint=1;
				p.parentRepaint();
			}
		}

		/**
		*开始拖动此对象。
		*@param area （可选）拖动区域，此区域为当前对象注册点活动区域（不包括对象宽高），可选。
		*@param hasInertia （可选）鼠标松开后，是否还惯性滑动，默认为false，可选。
		*@param elasticDistance （可选）橡皮筋效果的距离值，0为无橡皮筋效果，默认为0，可选。
		*@param elasticBackTime （可选）橡皮筋回弹时间，单位为毫秒，默认为300毫秒，可选。
		*@param data （可选）拖动事件携带的数据，可选。
		*@param disableMouseEvent （可选）禁用其他对象的鼠标检测，默认为false，设置为true能提高性能。
		*@param ratio （可选）惯性阻尼系数，影响惯性力度和时长。
		*/
		__proto.startDrag=function(area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio){
			(hasInertia===void 0)&& (hasInertia=false);
			(elasticDistance===void 0)&& (elasticDistance=0);
			(elasticBackTime===void 0)&& (elasticBackTime=300);
			(disableMouseEvent===void 0)&& (disableMouseEvent=false);
			(ratio===void 0)&& (ratio=0.92);
			this._$P.dragging || (this._set$P("dragging",new Dragging()));
			this._$P.dragging.start(this,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent,ratio);
		}

		/**停止拖动此对象。*/
		__proto.stopDrag=function(){
			this._$P.dragging && this._$P.dragging.stop();
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (!value){
				var cc=this._$P.cacheCanvas;
				if (cc && cc.ctx){
					Pool.recover("RenderContext",cc.ctx);
					cc.ctx.canvas.size(0,0);
					cc.ctx=null;
				};
				var fc=this._$P._filterCache;
				if (fc){
					fc.destroy();
					fc.recycle();
					this._set$P('_filterCache',null);
				}
				this._$P._isHaveGlowFilter && this._set$P('_isHaveGlowFilter',false);
			}
			_super.prototype._setDisplay.call(this,value);
		}

		/**
		*检测某个点是否在此对象内。
		*@param x 全局x坐标。
		*@param y 全局y坐标。
		*@return 表示是否在对象内。
		*/
		__proto.hitTestPoint=function(x,y){
			var point=this.globalToLocal(Point.TEMP.setTo(x,y));
			var rect=this._$P.hitArea ? this._$P.hitArea :Rectangle.TEMP.setTo(0,0,this._width,this._height);
			return rect.contains(point.x,point.y);
		}

		/**获得相对于本对象上的鼠标坐标信息。*/
		__proto.getMousePoint=function(){
			return this.globalToLocal(Point.TEMP.setTo(Laya.stage.mouseX,Laya.stage.mouseY));
		}

		/**@private */
		__proto._getWords=function(){
			return null;
		}

		/**@private */
		__proto._addChildsToLayout=function(out){
			var words=this._getWords();
			if (words==null && this._childs.length==0)return false;
			if (words){
				for (var i=0,n=words.length;i < n;i++){
					out.push(words[i]);
				}
			}
			this._childs.forEach(function(o,index,array){
				o._style._enableLayout()&& o._addToLayout(out);
			});
			return true;
		}

		/**@private */
		__proto._addToLayout=function(out){
			if (this._style.absolute)return;
			this._style.block ? out.push(this):(this._addChildsToLayout(out)&& (this.x=this.y=0));
		}

		/**@private */
		__proto._isChar=function(){
			return false;
		}

		/**@private */
		__proto._getCSSStyle=function(){
			return this._style.getCSSStyle();
		}

		/**
		*@private
		*设置指定属性名的属性值。
		*@param name 属性名。
		*@param value 属性值。
		*/
		__proto._setAttributes=function(name,value){
			switch (name){
				case 'x':
					this.x=parseFloat(value);
					break ;
				case 'y':
					this.y=parseFloat(value);
					break ;
				case 'width':
					this.width=parseFloat(value);
					break ;
				case 'height':
					this.height=parseFloat(value);
					break ;
				default :
					this[name]=value;
				}
		}

		/**
		*@private
		*/
		__proto._layoutLater=function(){
			this.parent && (this.parent)._layoutLater();
		}

		/**
		*<p>指定是否对使用了 scrollRect 的显示对象进行优化处理。默认为false(不优化)。</p>
		*<p>当值为ture时：将对此对象使用了scrollRect 设定的显示区域以外的显示内容不进行渲染，以提高性能(如果子对象有旋转缩放或者中心点偏移，则显示筛选会不精确)。</p>
		*/
		__getset(0,__proto,'optimizeScrollRect',function(){
			return this._optimizeScrollRect;
			},function(b){
			if (this._optimizeScrollRect !=b){
				this._optimizeScrollRect=b;
				this.conchModel && this.conchModel.optimizeScrollRect(b);
			}
		});

		/**
		*设置是否开启自定义渲染，只有开启自定义渲染，才能使用customRender函数渲染。
		*/
		__getset(0,__proto,'customRenderEnable',null,function(b){
			if (b){
				this._renderType |=0x400;
				if (Render.isConchNode){
					Sprite.CustomList.push(this);
					var canvas=new HTMLCanvas("2d");
					canvas._setContext(new CanvasRenderingContext2D());
					this.customContext=new RenderContext(0,0,canvas);
					canvas.context.setCanvasType && canvas.context.setCanvasType(2);
					this.conchModel.custom(canvas.context);
				}
			}
		});

		/**
		*指定显示对象是否缓存为静态图像。功能同cacheAs的normal模式。建议优先使用cacheAs代替。
		*/
		__getset(0,__proto,'cacheAsBitmap',function(){
			return this.cacheAs!=="none";
			},function(value){
			this.cacheAs=value ? (this._$P["hasFilter"] ? "none" :"normal"):"none";
		});

		/**
		*<p>指定显示对象是否缓存为静态图像，cacheAs时，子对象发生变化，会自动重新缓存，同时也可以手动调用reCache方法更新缓存。</p>
		*<p>
		*建议把不经常变化的“复杂内容”缓存为静态图像，能极大提高渲染性能。cacheAs有"none"，"normal"和"bitmap"三个值可选。
		*<li>默认为"none"，不做任何缓存。</li>
		*<li>当值为"normal"时，canvas模式下进行画布缓存，webgl模式下进行命令缓存。</li>
		*<li>当值为"bitmap"时，canvas模式下进行依然是画布缓存，webgl模式下使用renderTarget缓存。</li>
		*</p>
		*<p>
		*webgl下renderTarget缓存模式缺点：会额外创建renderTarget对象，增加内存开销，缓存面积有最大2048限制，不断重绘时会增加CPU开销。优点：大幅减少drawcall，渲染性能最高。
		*webgl下命令缓存模式缺点：只会减少节点遍历及命令组织，不会减少drawcall数，性能中等。优点：没有额外内存开销，无需renderTarget支持。
		*</p>
		*/
		__getset(0,__proto,'cacheAs',function(){
			return this._$P.cacheCanvas==null ? "none" :this._$P.cacheCanvas.type;
			},function(value){
			var cacheCanvas=this._$P.cacheCanvas;
			if (value===(cacheCanvas ? cacheCanvas.type :"none"))return;
			if (value!=="none"){
				if (!this._getBit(0x1))this._setUpNoticeType(0x1);
				cacheCanvas || (cacheCanvas=this._set$P("cacheCanvas",Pool.getItemByClass("cacheCanvas",Object)));
				cacheCanvas.type=value;
				cacheCanvas.reCache=true;
				this._renderType |=0x10;
				if (value=="bitmap")this.conchModel && this.conchModel.cacheAs(1);
				this._set$P("cacheForFilters",false);
				}else {
				if (this._$P["hasFilter"]){
					this._set$P("cacheForFilters",true);
					}else {
					if (cacheCanvas)Pool.recover("cacheCanvas",cacheCanvas);
					this._$P.cacheCanvas=null;
					this._renderType &=~0x10;
					this.conchModel && this.conchModel.cacheAs(0);
				}
			}
			this.repaint();
		});

		/**z排序，更改此值，则会按照值的大小对同一容器的所有对象重新排序。值越大，越靠上。默认为0，则根据添加顺序排序。*/
		__getset(0,__proto,'zOrder',function(){
			return this._zOrder;
			},function(value){
			if (this._zOrder !=value){
				this._zOrder=value;
				this.conchModel && this.conchModel.setZOrder && this.conchModel.setZOrder(value);
				if (this._parent){
					value && this._parent._set$P("hasZorder",true);
					Laya.timer.callLater(this._parent,this.updateZOrder);
				}
			}
		});

		/**旋转角度，默认值为0。以角度为单位。*/
		__getset(0,__proto,'rotation',function(){
			return this._style._tf.rotate;
			},function(value){
			var style=this.getStyle();
			if (style._tf.rotate!==value){
				style.setRotate(value);
				this._tfChanged=true;
				this.conchModel && this.conchModel.rotate(value);
				this._renderType |=0x04;
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
			}
		});

		/**
		*<p>显示对象的宽度，单位为像素，默认为0。</p>
		*<p>此宽度用于鼠标碰撞检测，并不影响显示对象图像大小。需要对显示对象的图像进行缩放，请使用scale、scaleX、scaleY。</p>
		*<p>可以通过getbounds获取显示对象图像的实际宽度。</p>
		*/
		__getset(0,__proto,'width',function(){
			if (!this.autoSize)return this._width;
			return this.getSelfBounds().width;
			},function(value){
			if (this._width!==value){
				this._width=value;
				this.conchModel && this.conchModel.size(value,this._height)
				this.repaint();
			}
		});

		/**表示显示对象相对于父容器的水平方向坐标值。*/
		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			if (this._x!==value){
				if (this.destroyed)return;
				this._x=value;
				this.conchModel && this.conchModel.pos(value,this._y);
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
				if (this._$P.maskParent && this._$P.maskParent._repaint===0){
					this._$P.maskParent._repaint=1;
					this._$P.maskParent.parentRepaint();
				}
			}
		});

		/**
		*获得相对于stage的全局Y轴缩放值（会叠加父亲节点的缩放值）。
		*/
		__getset(0,__proto,'globalScaleY',function(){
			var scale=1;
			var ele=this;
			while (ele){
				if (ele===Laya.stage)break ;
				scale *=ele.scaleX;
				ele=ele.parent;
			}
			return scale;
		});

		/**
		*<p>可以设置一个Rectangle区域作为点击区域，或者设置一个<code>HitArea</code>实例作为点击区域，HitArea内可以设置可点击和不可点击区域。</p>
		*<p>如果不设置hitArea，则根据宽高形成的区域进行碰撞。</p>
		*/
		__getset(0,__proto,'hitArea',function(){
			return this._$P.hitArea;
			},function(value){
			this._set$P("hitArea",value);
		});

		/**设置cacheAs为非空时此值才有效，staticCache=true时，子对象变化时不会自动更新缓存，只能通过调用reCache方法手动刷新。*/
		__getset(0,__proto,'staticCache',function(){
			return this._$P.staticCache;
			},function(value){
			this._set$P("staticCache",value);
			if (!value)this.reCache();
		});

		/**设置一个Texture实例，并显示此图片（如果之前有其他绘制，则会被清除掉）。等同于graphics.clear();graphics.drawTexture()*/
		__getset(0,__proto,'texture',function(){
			return this._texture;
			},function(value){
			if (this._texture !=value){
				this._texture=value;
				this.graphics.cleanByTexture(value,0,0);
			}
		});

		/**表示显示对象相对于父容器的垂直方向坐标值。*/
		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			if (this._y!==value){
				if (this.destroyed)return;
				this._y=value;
				this.conchModel && this.conchModel.pos(this._x,value);
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
				if (this._$P.maskParent && this._$P.maskParent._repaint===0){
					this._$P.maskParent._repaint=1;
					this._$P.maskParent.parentRepaint();
				}
			}
		});

		/**
		*<p>显示对象的高度，单位为像素，默认为0。</p>
		*<p>此高度用于鼠标碰撞检测，并不影响显示对象图像大小。需要对显示对象的图像进行缩放，请使用scale、scaleX、scaleY。</p>
		*<p>可以通过getbounds获取显示对象图像的实际高度。</p>
		*/
		__getset(0,__proto,'height',function(){
			if (!this.autoSize)return this._height;
			return this.getSelfBounds().height;
			},function(value){
			if (this._height!==value){
				this._height=value;
				this.conchModel && this.conchModel.size(this._width,value);
				this.repaint();
			}
		});

		/**指定要使用的混合模式。目前只支持"lighter"。*/
		__getset(0,__proto,'blendMode',function(){
			return this._style.blendMode;
			},function(value){
			this.getStyle().blendMode=value;
			this.conchModel && this.conchModel.blendMode(value);
			if (value && value !="source-over")this._renderType |=0x08;
			else this._renderType &=~0x08;
			this.parentRepaint();
		});

		/**X轴缩放值，默认值为1。设置为负数，可以实现水平反转效果，比如scaleX=-1。*/
		__getset(0,__proto,'scaleX',function(){
			return this._style._tf.scaleX;
			},function(value){
			var style=this.getStyle();
			if (style._tf.scaleX!==value){
				style.setScaleX(value);
				this._tfChanged=true;
				this.conchModel && this.conchModel.scale(value,style._tf.scaleY);
				this._renderType |=0x04;
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
			}
		});

		/**Y轴缩放值，默认值为1。设置为负数，可以实现垂直反转效果，比如scaleX=-1。*/
		__getset(0,__proto,'scaleY',function(){
			return this._style._tf.scaleY;
			},function(value){
			var style=this.getStyle();
			if (style._tf.scaleY!==value){
				style.setScaleY(value);
				this._tfChanged=true;
				this.conchModel && this.conchModel.scale(style._tf.scaleX,value);
				this._renderType |=0x04;
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
			}
		});

		/**对舞台 <code>stage</code> 的引用。*/
		__getset(0,__proto,'stage',function(){
			return Laya.stage;
		});

		/**水平倾斜角度，默认值为0。以角度为单位。*/
		__getset(0,__proto,'skewX',function(){
			return this._style._tf.skewX;
			},function(value){
			var style=this.getStyle();
			if (style._tf.skewX!==value){
				style.setSkewX(value);
				this._tfChanged=true;
				this._renderType |=0x04;
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
			}
		});

		/**
		*<p>显示对象的滚动矩形范围，具有裁剪效果(如果只想限制子对象渲染区域，请使用viewport)，设置optimizeScrollRect=true，可以优化裁剪区域外的内容不进行渲染。</p>
		*<p>
		*srollRect和viewport的区别：<br/>
		*1.srollRect自带裁剪效果，viewport只影响子对象渲染是否渲染，不具有裁剪效果（性能更高）。<br/>
		*2.设置rect的x,y属性均能实现区域滚动效果，但scrollRect会保持0,0点位置不变。
		*</p>
		*/
		__getset(0,__proto,'scrollRect',function(){
			return this._style.scrollRect;
			},function(value){
			this.getStyle().scrollRect=value;
			this.repaint();
			if (value){
				this._renderType |=0x80;
				this.conchModel && this.conchModel.scrollRect(value.x,value.y,value.width,value.height);
				}else {
				this._renderType &=~0x80;
				if (this.conchModel){
					if (Sprite.RUNTIMEVERION < "0.9.1")
						this.conchModel.removeType(0x40);
					else
					this.conchModel.removeType(0x80);
				}
			}
		});

		/**垂直倾斜角度，默认值为0。以角度为单位。*/
		__getset(0,__proto,'skewY',function(){
			return this._style._tf.skewY;
			},function(value){
			var style=this.getStyle();
			if (style._tf.skewY!==value){
				style.setSkewY(value);
				this._tfChanged=true;
				this.conchModel && this.conchModel.skew(style._tf.skewX,value);
				this._renderType |=0x04;
				var p=this._parent;
				if (p && p._repaint===0){
					p._repaint=1;
					p.parentRepaint();
				}
			}
		});

		/**
		*<p>对象的矩阵信息。通过设置矩阵可以实现节点旋转，缩放，位移效果。</p>
		*<p>矩阵更多信息请参考 <code>Matrix</code></p>
		*/
		__getset(0,__proto,'transform',function(){
			return this._tfChanged ? this._adjustTransform():this._transform;
			},function(value){
			this._tfChanged=false;
			this._transform=value;
			if (value){
				this._x=value.tx;
				this._y=value.ty;
				value.tx=value.ty=0;
				this.conchModel && this.conchModel.transform(value.a,value.b,value.c,value.d,this._x,this._y);
			}
			if (value)this._renderType |=0x04;
			else {
				this._renderType &=~0x04;
				this.conchModel && this.conchModel.removeType(0x04);
			}
			this.parentRepaint();
		});

		/**X轴 轴心点的位置，单位为像素，默认为0。轴心点会影响对象位置，缩放中心，旋转中心。*/
		__getset(0,__proto,'pivotX',function(){
			return this._style._tf.translateX;
			},function(value){
			this.getStyle().setTranslateX(value);
			this.conchModel && this.conchModel.pivot(value,this._style._tf.translateY);
			this.repaint();
		});

		/**Y轴 轴心点的位置，单位为像素，默认为0。轴心点会影响对象位置，缩放中心，旋转中心。*/
		__getset(0,__proto,'pivotY',function(){
			return this._style._tf.translateY;
			},function(value){
			this.getStyle().setTranslateY(value);
			this.conchModel && this.conchModel.pivot(this._style._tf.translateX,value);
			this.repaint();
		});

		/**透明度，值为0-1，默认值为1，表示不透明。更改alpha值会影响drawcall。*/
		__getset(0,__proto,'alpha',function(){
			return this._style.alpha;
			},function(value){
			if (this._style && this._style.alpha!==value){
				value=value < 0 ? 0 :(value > 1 ? 1 :value);
				this.getStyle().alpha=value;
				this.conchModel && this.conchModel.alpha(value);
				if (value!==1)this._renderType |=0x02;
				else this._renderType &=~0x02;
				this.parentRepaint();
			}
		});

		/**表示是否可见，默认为true。如果设置不可见，节点将不被渲染。*/
		__getset(0,__proto,'visible',function(){
			return this._style.visible;
			},function(value){
			if (this._style && this._style.visible!==value){
				this.getStyle().visible=value;
				this.conchModel && this.conchModel.visible(value);
				this.parentRepaint();
			}
		});

		/**绘图对象。封装了绘制位图和矢量图的接口，Sprite所有的绘图操作都通过Graphics来实现的。*/
		__getset(0,__proto,'graphics',function(){
			return this._graphics || (this.graphics=RunDriver.createGraphics());
			},function(value){
			if (this._graphics)this._graphics._sp=null;
			this._graphics=value;
			if (value){
				this._renderType &=~0x01;
				this._renderType |=0x200;
				value._sp=this;
				this.conchModel && this.conchModel.graphics(this._graphics);
				}else {
				this._renderType &=~0x200;
				this._renderType &=~0x01;
				if (this.conchModel){
					if (Sprite.RUNTIMEVERION < "0.9.1")
						this.conchModel.removeType(0x100);
					else
					this.conchModel.removeType(0x200);
				}
			}
			this.repaint();
		});

		/**滤镜集合。可以设置多个滤镜组合。*/
		__getset(0,__proto,'filters',function(){
			return this._$P.filters;
			},function(value){
			value && value.length===0 && (value=null);
			if (this._$P.filters==value)return;
			this._set$P("filters",value ? value.slice():null);
			if (Render.isConchApp){
				if (this.conchModel){
					if (Sprite.RUNTIMEVERION < "0.9.1")
						this.conchModel.removeType(0x10);
					else
					this.conchModel.removeType(0x20);
				}
				if (this._$P.filters && this._$P.filters.length==1){
					this._$P.filters[0].callNative(this);
				}
			}
			if (Render.isWebGL){
				if (value && value.length){
					this._renderType |=0x20;
					}else {
					this._renderType &=~0x20;
				}
			}
			if (value && value.length > 0){
				if (!this._getBit(0x1))this._setUpNoticeType(0x1);
				if (!(Render.isWebGL && value.length==1 && (((value[0])instanceof laya.filters.ColorFilter )))){
					if (this.cacheAs !="bitmap"){
						if (!Render.isConchNode)this.cacheAs="bitmap";
						this._set$P("cacheForFilters",true);
					}
					this._set$P("hasFilter",true);
				}
				}else {
				this._set$P("hasFilter",false);
				if (this._$P["cacheForFilters"] && this.cacheAs=="bitmap"){
					this.cacheAs="none";
				}
			}
			this.repaint();
		});

		__getset(0,__proto,'parent',_super.prototype._$get_parent,function(value){
			_super.prototype._$set_parent.call(this,value);
			if (value && this._getBit(0x2)){
				this._$2__onDisplay();
			}
		});

		/**
		*<p>遮罩，可以设置一个对象(支持位图和矢量图)，根据对象形状进行遮罩显示。</p>
		*<p>【注意】遮罩对象坐标系是相对遮罩对象本身的，和Flash机制不同</p>
		*/
		__getset(0,__proto,'mask',function(){
			return this._$P._mask;
			},function(value){
			if (value && this.mask && this.mask._$P.maskParent)return;
			if (value){
				this.cacheAs="bitmap";
				this._set$P("_mask",value);
				value._set$P("maskParent",this);
				}else {
				this.cacheAs="none";
				this.mask && this.mask._set$P("maskParent",null);
				this._set$P("_mask",value);
			}
			this.conchModel && this.conchModel.mask(value ? value.conchModel :null);
			this._renderType |=0x40;
			this.parentRepaint();
		});

		/**
		*是否接受鼠标事件。
		*默认为false，如果监听鼠标事件，则会自动设置本对象及父节点的属性 mouseEnable 的值都为 true（如果父节点手动设置为false，则不会更改）。
		**/
		__getset(0,__proto,'mouseEnabled',function(){
			return this._mouseEnableState > 1;
			},function(value){
			this._mouseEnableState=value ? 2 :1;
		});

		/**
		*获得相对于stage的全局X轴缩放值（会叠加父亲节点的缩放值）。
		*/
		__getset(0,__proto,'globalScaleX',function(){
			var scale=1;
			var ele=this;
			while (ele){
				if (ele===Laya.stage)break ;
				scale *=ele.scaleX;
				ele=ele.parent;
			}
			return scale;
		});

		/**
		*返回鼠标在此对象坐标系上的 X 轴坐标信息。
		*/
		__getset(0,__proto,'mouseX',function(){
			return this.getMousePoint().x;
		});

		/**
		*返回鼠标在此对象坐标系上的 Y 轴坐标信息。
		*/
		__getset(0,__proto,'mouseY',function(){
			return this.getMousePoint().y;
		});

		Sprite.fromImage=function(url){
			return new Sprite().loadImage(url);
		}

		Sprite.CustomList=[];
		__static(Sprite,
		['RUNTIMEVERION',function(){return this.RUNTIMEVERION=window.conch?conchConfig.getRuntimeVersion().substr(conchConfig.getRuntimeVersion().lastIndexOf('-')+1):'';}
		]);
		return Sprite;
	})(Node)


	//class laya.resource.Bitmap extends laya.resource.Resource
	var Bitmap=(function(_super){
		function Bitmap(){
			//this._source=null;
			//this._w=NaN;
			//this._h=NaN;
			this.useNum=0;
			Bitmap.__super.call(this);
			this._w=0;
			this._h=0;
		}

		__class(Bitmap,'laya.resource.Bitmap',_super);
		var __proto=Bitmap.prototype;
		/**
		*彻底清理资源。
		*/
		__proto.dispose=function(){
			this._resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		/***
		*宽度。
		*/
		__getset(0,__proto,'width',function(){
			return this._w;
		});

		/***
		*高度。
		*/
		__getset(0,__proto,'height',function(){
			return this._h;
		});

		/***
		*HTML Image 或 HTML Canvas 或 WebGL Texture 。
		*/
		__getset(0,__proto,'source',function(){
			return this._source;
		});

		return Bitmap;
	})(Resource)


	//class laya.debug.tools.enginehook.LoaderHook extends laya.net.LoaderManager
	var LoaderHook=(function(_super){
		function LoaderHook(){
			LoaderHook.__super.call(this);
		}

		__class(LoaderHook,'laya.debug.tools.enginehook.LoaderHook',_super);
		var __proto=LoaderHook.prototype;
		__proto.checkUrls=function(url){
			var tarUrl;
			if ((typeof url=='string')){
				tarUrl=url;
				}else{
				tarUrl=url.url;
			}
			if (LoaderHook.preFails[tarUrl]){
				if (LoaderHook.enableFailDebugger){
					debugger;
				}
			}
		}

		__proto.chekUrlList=function(urls){
			var i=0,len=0;
			len=urls.length;
			for (i=0;i < len;i++){
				this.checkUrls(urls[i]);
			}
		}

		__proto.load=function(url,complete,progress,type,priority,cache,group,ignoreCache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			(ignoreCache===void 0)&& (ignoreCache=false);
			if ((url instanceof Array)){
				this.chekUrlList(url);
				}else{
				this.checkUrls(url);
			}
			return _super.prototype.load.call(this,url,complete,progress,type,priority,cache,group,ignoreCache);
		}

		LoaderHook.init=function(){
			if (LoaderHook.isInited)return;
			LoaderHook.isInited=true;
			Laya.loader=new LoaderHook();
			Laya.loader.on("error",null,LoaderHook.onFail);
			LoaderHook.preFails=LocalStorage.getJSON("LoadFailItems");
			if (!LoaderHook.preFails)LoaderHook.preFails={};
		}

		LoaderHook.onFail=function(failFile){
			OutPutView.I.dTrace("LoadFail:"+failFile);
			LoaderHook.nowFails[failFile]=true;
			LocalStorage.setJSON("LoadFailItems",LoaderHook.nowFails);
		}

		LoaderHook.resetFails=function(){
			LoaderHook.nowFails={};
			LocalStorage.setJSON("LoadFailItems",LoaderHook.nowFails);
		}

		LoaderHook.preFails={};
		LoaderHook.nowFails={};
		LoaderHook.enableFailDebugger=true;
		LoaderHook.FailSign="LoadFailItems";
		LoaderHook.isInited=false;
		return LoaderHook;
	})(LoaderManager)


	//class laya.media.h5audio.AudioSoundChannel extends laya.media.SoundChannel
	var AudioSoundChannel=(function(_super){
		function AudioSoundChannel(audio){
			this._audio=null;
			this._onEnd=null;
			this._resumePlay=null;
			AudioSoundChannel.__super.call(this);
			this._onEnd=Utils.bind(this.__onEnd,this);
			this._resumePlay=Utils.bind(this.__resumePlay,this);
			audio.addEventListener("ended",this._onEnd);
			this._audio=audio;
		}

		__class(AudioSoundChannel,'laya.media.h5audio.AudioSoundChannel',_super);
		var __proto=AudioSoundChannel.prototype;
		__proto.__onEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
					this.completeHandler=null;
				}
				this.stop();
				this.event("complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		__proto.__resumePlay=function(){
			if(this._audio)this._audio.removeEventListener("canplay",this._resumePlay);
			try {
				this._audio.currentTime=this.startTime;
				Browser.container.appendChild(this._audio);
				this._audio.play();
				}catch (e){
				this.event("error");
			}
		}

		/**
		*播放
		*/
		__proto.play=function(){
			this.isStopped=false;
			try {
				this._audio.playbackRate=SoundManager.playbackRate;
				this._audio.currentTime=this.startTime;
				}catch (e){
				this._audio.addEventListener("canplay",this._resumePlay);
				return;
			}
			SoundManager.addChannel(this);
			Browser.container.appendChild(this._audio);
			if("play" in this._audio)
				this._audio.play();
		}

		/**
		*停止播放
		*
		*/
		__proto.stop=function(){
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
			if (!this._audio)
				return;
			if ("pause" in this._audio)
				if (Render.isConchApp){
				this._audio.stop();
			}
			this._audio.pause();
			this._audio.removeEventListener("ended",this._onEnd);
			this._audio.removeEventListener("canplay",this._resumePlay);
			if(!Browser.onIE)
				Pool.recover("audio:"+this.url,this._audio);
			Browser.removeElement(this._audio);
			this._audio=null;
		}

		__proto.pause=function(){
			this.isStopped=true;
			SoundManager.removeChannel(this);
			if("pause" in this._audio)
				this._audio.pause();
		}

		__proto.resume=function(){
			if (!this._audio)
				return;
			this.isStopped=false;
			SoundManager.addChannel(this);
			if("play" in this._audio)
				this._audio.play();
		}

		/**
		*当前播放到的位置
		*@return
		*
		*/
		__getset(0,__proto,'position',function(){
			if (!this._audio)
				return 0;
			return this._audio.currentTime;
		});

		/**
		*获取总时间。
		*/
		__getset(0,__proto,'duration',function(){
			if (!this._audio)
				return 0;
			return this._audio.duration;
		});

		/**
		*设置音量
		*@param v
		*
		*/
		/**
		*获取音量
		*@return
		*
		*/
		__getset(0,__proto,'volume',function(){
			if (!this._audio)return 1;
			return this._audio.volume;
			},function(v){
			if (!this._audio)return;
			this._audio.volume=v;
		});

		return AudioSoundChannel;
	})(SoundChannel)


	//class laya.media.webaudio.WebAudioSoundChannel extends laya.media.SoundChannel
	var WebAudioSoundChannel=(function(_super){
		function WebAudioSoundChannel(){
			this.audioBuffer=null;
			this.gain=null;
			this.bufferSource=null;
			this._currentTime=0;
			this._volume=1;
			this._startTime=0;
			this._pauseTime=0;
			this._onPlayEnd=null;
			this.context=WebAudioSound.ctx;
			WebAudioSoundChannel.__super.call(this);
			this._onPlayEnd=Utils.bind(this.__onPlayEnd,this);
			if (this.context["createGain"]){
				this.gain=this.context["createGain"]();
				}else {
				this.gain=this.context["createGainNode"]();
			}
		}

		__class(WebAudioSoundChannel,'laya.media.webaudio.WebAudioSoundChannel',_super);
		var __proto=WebAudioSoundChannel.prototype;
		/**
		*播放声音
		*/
		__proto.play=function(){
			SoundManager.addChannel(this);
			this.isStopped=false;
			this._clearBufferSource();
			if (!this.audioBuffer)return;
			var context=this.context;
			var gain=this.gain;
			var bufferSource=context.createBufferSource();
			this.bufferSource=bufferSource;
			bufferSource.buffer=this.audioBuffer;
			bufferSource.connect(gain);
			if (gain)
				gain.disconnect();
			gain.connect(context.destination);
			bufferSource.onended=this._onPlayEnd;
			if (this.startTime >=this.duration)this.startTime=0;
			this._startTime=Browser.now();
			this.gain.gain.value=this._volume;
			if (this.loops==0){
				bufferSource.loop=true;
			}
			bufferSource.playbackRate.value=SoundManager.playbackRate;
			bufferSource.start(0,this.startTime);
			this._currentTime=0;
		}

		__proto.__onPlayEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
					this.completeHandler=null;
				}
				this.stop();
				this.event("complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		__proto._clearBufferSource=function(){
			if (this.bufferSource){
				var sourceNode=this.bufferSource;
				if (sourceNode.stop){
					sourceNode.stop(0);
					}else {
					sourceNode.noteOff(0);
				}
				sourceNode.disconnect(0);
				sourceNode.onended=null;
				if (!WebAudioSoundChannel._tryCleanFailed)this._tryClearBuffer(sourceNode);
				this.bufferSource=null;
			}
		}

		__proto._tryClearBuffer=function(sourceNode){
			if (!Browser.onIOS){
				WebAudioSoundChannel._tryCleanFailed=true;
				return;
			}
			try {sourceNode.buffer=WebAudioSound._miniBuffer;}catch (e){WebAudioSoundChannel._tryCleanFailed=true;}
		}

		/**
		*停止播放
		*/
		__proto.stop=function(){
			this._clearBufferSource();
			this.audioBuffer=null;
			if (this.gain)
				this.gain.disconnect();
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
		}

		__proto.pause=function(){
			if (!this.isStopped){
				this._pauseTime=this.position;
			}
			this._clearBufferSource();
			if (this.gain)
				this.gain.disconnect();
			this.isStopped=true;
			SoundManager.removeChannel(this);
		}

		__proto.resume=function(){
			this.startTime=this._pauseTime;
			this.play();
		}

		/**
		*获取当前播放位置
		*/
		__getset(0,__proto,'position',function(){
			if (this.bufferSource){
				return (Browser.now()-this._startTime)/ 1000+this.startTime;
			}
			return 0;
		});

		__getset(0,__proto,'duration',function(){
			if (this.audioBuffer){
				return this.audioBuffer.duration;
			}
			return 0;
		});

		/**
		*设置音量
		*/
		/**
		*获取音量
		*/
		__getset(0,__proto,'volume',function(){
			return this._volume;
			},function(v){
			if (this.isStopped){
				return;
			}
			this._volume=v;
			this.gain.gain.value=v;
		});

		WebAudioSoundChannel._tryCleanFailed=false;
		return WebAudioSoundChannel;
	})(SoundChannel)


	//class laya.ui.Component extends laya.display.Sprite
	var Component=(function(_super){
		function Component(){
			this._comXml=null;
			this._dataSource=null;
			this._toolTip=null;
			this._tag=null;
			this._disabled=false;
			this._gray=false;
			this.layoutEnabled=true;
			Component.__super.call(this);
			this._layout=LayoutStyle.EMPTY;
			this.preinitialize();
			this.createChildren();
			this.initialize();
		}

		__class(Component,'laya.ui.Component',_super);
		var __proto=Component.prototype;
		Laya.imps(__proto,{"laya.ui.IComponent":true})
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._dataSource=this._layout=null;
			this._tag=null;
			this._toolTip=null;
		}

		/**
		*<p>预初始化。</p>
		*@internal 子类可在此函数内设置、修改属性默认值
		*/
		__proto.preinitialize=function(){}
		/**
		*<p>创建并添加控件子节点。</p>
		*@internal 子类可在此函数内创建并添加子节点。
		*/
		__proto.createChildren=function(){}
		/**
		*<p>控件初始化。</p>
		*@internal 在此子对象已被创建，可以对子对象进行修改。
		*/
		__proto.initialize=function(){}
		/**
		*<p>延迟运行指定的函数。</p>
		*<p>在控件被显示在屏幕之前调用，一般用于延迟计算数据。</p>
		*@param method 要执行的函数的名称。例如，functionName。
		*@param args 传递给 <code>method</code> 函数的可选参数列表。
		*
		*@see #runCallLater()
		*/
		__proto.callLater=function(method,args){
			Laya.timer.callLater(this,method,args);
		}

		/**
		*<p>如果有需要延迟调用的函数（通过 <code>callLater</code> 函数设置），则立即执行延迟调用函数。</p>
		*@param method 要执行的函数名称。例如，functionName。
		*@see #callLater()
		*/
		__proto.runCallLater=function(method){
			Laya.timer.runCallLater(this,method);
		}

		/**
		*<p>立即执行影响宽高度量的延迟调用函数。</p>
		*@internal <p>使用 <code>runCallLater</code> 函数，立即执行影响宽高度量的延迟运行函数(使用 <code>callLater</code> 设置延迟执行函数)。</p>
		*@see #callLater()
		*@see #runCallLater()
		*/
		__proto.commitMeasure=function(){}
		/**
		*<p>重新调整对象的大小。</p>
		*/
		__proto.changeSize=function(){
			this.event("resize");
		}

		/**
		*@private
		*<p>获取对象的布局样式。</p>
		*/
		__proto.getLayout=function(){
			this._layout===LayoutStyle.EMPTY && (this._layout=new LayoutStyle());
			return this._layout;
		}

		/**
		*@private
		*<p>指定对象是否可使用布局。</p>
		*<p>如果值为true,则此对象可以使用布局样式，否则不使用布局样式。</p>
		*@param value 一个 Boolean 值，指定对象是否可使用布局。
		*/
		__proto._setLayoutEnabled=function(value){
			if (this._layout && this._layout.enable !=value){
				this._layout.enable=value;
				this.on("added",this,this.onAdded);
				this.on("removed",this,this.onRemoved);
				if (this.parent){
					this.onAdded();
				}
			}
		}

		/**
		*对象从显示列表移除的事件侦听处理函数。
		*/
		__proto.onRemoved=function(){
			this.parent.off("resize",this,this.onCompResize);
		}

		/**
		*对象被添加到显示列表的事件侦听处理函数。
		*/
		__proto.onAdded=function(){
			this.parent.on("resize",this,this.onCompResize);
			this.resetLayoutX();
			this.resetLayoutY();
		}

		/**
		*父容器的 <code>Event.RESIZE</code> 事件侦听处理函数。
		*/
		__proto.onCompResize=function(){
			if (this._layout && this._layout.enable){
				this.resetLayoutX();
				this.resetLayoutY();
			}
		}

		/**
		*<p>重置对象的 <code>X</code> 轴（水平方向）布局。</p>
		*/
		__proto.resetLayoutX=function(){
			var layout=this._layout;
			if (!isNaN(layout.anchorX))this.pivotX=layout.anchorX *this.width;
			if (!this.layoutEnabled)return;
			var parent=this.parent;
			if (parent){
				if (!isNaN(layout.centerX)){
					this.x=Math.round((parent.width-this.displayWidth)*0.5+layout.centerX+this.pivotX *this.scaleX);
					}else if (!isNaN(layout.left)){
					this.x=Math.round(layout.left+this.pivotX *this.scaleX);
					if (!isNaN(layout.right)){
						this.width=(parent._width-layout.left-layout.right)/ (this.scaleX || 0.01);
					}
					}else if (!isNaN(layout.right)){
					this.x=Math.round(parent.width-this.displayWidth-layout.right+this.pivotX *this.scaleX);
				}
			}
		}

		/**
		*<p>重置对象的 <code>Y</code> 轴（垂直方向）布局。</p>
		*/
		__proto.resetLayoutY=function(){
			var layout=this._layout;
			if (!isNaN(layout.anchorY))this.pivotY=layout.anchorY *this.height;
			if (!this.layoutEnabled)return;
			var parent=this.parent;
			if (parent){
				if (!isNaN(layout.centerY)){
					this.y=Math.round((parent.height-this.displayHeight)*0.5+layout.centerY+this.pivotY *this.scaleY);
					}else if (!isNaN(layout.top)){
					this.y=Math.round(layout.top+this.pivotY *this.scaleY);
					if (!isNaN(layout.bottom)){
						this.height=(parent._height-layout.top-layout.bottom)/ (this.scaleY || 0.01);
					}
					}else if (!isNaN(layout.bottom)){
					this.y=Math.round(parent.height-this.displayHeight-layout.bottom+this.pivotY *this.scaleY);
				}
			}
		}

		/**
		*对象的 <code>Event.MOUSE_OVER</code> 事件侦听处理函数。
		*/
		__proto.onMouseOver=function(e){
			Laya.stage.event("showtip",this._toolTip);
		}

		/**
		*对象的 <code>Event.MOUSE_OUT</code> 事件侦听处理函数。
		*/
		__proto.onMouseOut=function(e){
			Laya.stage.event("hidetip",this._toolTip);
		}

		/**
		*<p>对象的显示宽度（以像素为单位）。</p>
		*/
		__getset(0,__proto,'displayWidth',function(){
			return this.width *this.scaleX;
		});

		/**
		*<p>表示显示对象的宽度，以像素为单位。</p>
		*<p><b>注：</b>当值为0时，宽度为自适应大小。</p>
		*/
		__getset(0,__proto,'width',function(){
			if (this._width)return this._width;
			return this.measureWidth;
			},function(value){
			if (this._width !=value){
				this._width=value;
				this.conchModel && this.conchModel.size(this._width,this._height);
				this.callLater(this.changeSize);
				if (this._layout.enable && (!isNaN(this._layout.centerX)|| !isNaN(this._layout.right)|| !isNaN(this._layout.anchorX)))this.resetLayoutX();
			}
		});

		/**
		*<p>显示对象的实际显示区域宽度（以像素为单位）。</p>
		*/
		__getset(0,__proto,'measureWidth',function(){
			var max=0;
			this.commitMeasure();
			for (var i=this.numChildren-1;i >-1;i--){
				var comp=this.getChildAt(i);
				if (comp.visible){
					max=Math.max(comp.x+comp.width *comp.scaleX,max);
				}
			}
			return max;
		});

		/**
		*<p>对象的显示高度（以像素为单位）。</p>
		*/
		__getset(0,__proto,'displayHeight',function(){
			return this.height *this.scaleY;
		});

		/**
		*<p>表示显示对象的高度，以像素为单位。</p>
		*<p><b>注：</b>当值为0时，高度为自适应大小。</p>
		*/
		__getset(0,__proto,'height',function(){
			if (this._height)return this._height;
			return this.measureHeight;
			},function(value){
			if (this._height !=value){
				this._height=value;
				this.conchModel && this.conchModel.size(this._width,this._height);
				this.callLater(this.changeSize);
				if (this._layout.enable && (!isNaN(this._layout.centerY)|| !isNaN(this._layout.bottom)|| !isNaN(this._layout.anchorY)))this.resetLayoutY();
			}
		});

		/**
		*<p>数据赋值，通过对UI赋值来控制UI显示逻辑。</p>
		*<p>简单赋值会更改组件的默认属性，使用大括号可以指定组件的任意属性进行赋值。</p>
		*@example
		//默认属性赋值
		dataSource={label1:"改变了label",checkbox1:true};//(更改了label1的text属性值，更改checkbox1的selected属性)。
		//任意属性赋值
		dataSource={label2:{text:"改变了label",size:14},checkbox2:{selected:true,x:10}};
		*/
		__getset(0,__proto,'dataSource',function(){
			return this._dataSource;
			},function(value){
			this._dataSource=value;
			for (var prop in this._dataSource){
				if (this.hasOwnProperty(prop)&& !((typeof (this[prop])=='function'))){
					this[prop]=this._dataSource[prop];
				}
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'scaleY',_super.prototype._$get_scaleY,function(value){
			if (_super.prototype._$get_scaleY.call(this)!=value){
				_super.prototype._$set_scaleY.call(this,value);
				this.callLater(this.changeSize);
				this._layout.enable && this.resetLayoutY();
			}
		});

		/**
		*<p>显示对象的实际显示区域高度（以像素为单位）。</p>
		*/
		__getset(0,__proto,'measureHeight',function(){
			var max=0;
			this.commitMeasure();
			for (var i=this.numChildren-1;i >-1;i--){
				var comp=this.getChildAt(i);
				if (comp.visible){
					max=Math.max(comp.y+comp.height *comp.scaleY,max);
				}
			}
			return max;
		});

		/**@inheritDoc */
		__getset(0,__proto,'scaleX',_super.prototype._$get_scaleX,function(value){
			if (_super.prototype._$get_scaleX.call(this)!=value){
				_super.prototype._$set_scaleX.call(this,value);
				this.callLater(this.changeSize);
				this._layout.enable && this.resetLayoutX();
			}
		});

		/**
		*<p>从组件顶边到其内容区域顶边之间的垂直距离（以像素为单位）。</p>
		*/
		__getset(0,__proto,'top',function(){
			return this._layout.top;
			},function(value){
			if (value !=this._layout.top){
				this.getLayout().top=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutY();
		});

		/**
		*<p>从组件底边到其内容区域底边之间的垂直距离（以像素为单位）。</p>
		*/
		__getset(0,__proto,'bottom',function(){
			return this._layout.bottom;
			},function(value){
			if (value !=this._layout.bottom){
				this.getLayout().bottom=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutY();
		});

		/**
		*<p>从组件左边到其内容区域左边之间的水平距离（以像素为单位）。</p>
		*/
		__getset(0,__proto,'left',function(){
			return this._layout.left;
			},function(value){
			if (value !=this._layout.left){
				this.getLayout().left=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutX();
		});

		/**
		*<p>从组件右边到其内容区域右边之间的水平距离（以像素为单位）。</p>
		*/
		__getset(0,__proto,'right',function(){
			return this._layout.right;
			},function(value){
			if (value !=this._layout.right){
				this.getLayout().right=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutX();
		});

		/**
		*<p>在父容器中，此对象的水平方向中轴线与父容器的水平方向中心线的距离（以像素为单位）。</p>
		*/
		__getset(0,__proto,'centerX',function(){
			return this._layout.centerX;
			},function(value){
			if (value !=this._layout.centerX){
				this.getLayout().centerX=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutX();
		});

		/**
		*<p>在父容器中，此对象的垂直方向中轴线与父容器的垂直方向中心线的距离（以像素为单位）。</p>
		*/
		__getset(0,__proto,'centerY',function(){
			return this._layout.centerY;
			},function(value){
			if (value !=this._layout.centerY){
				this.getLayout().centerY=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutY();
		});

		/**X轴锚点，值为0-1*/
		__getset(0,__proto,'anchorX',function(){
			return this._layout.anchorX;
			},function(value){
			if (value !=this._layout.anchorX){
				this.getLayout().anchorX=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutX();
		});

		/**Y轴锚点，值为0-1*/
		__getset(0,__proto,'anchorY',function(){
			return this._layout.anchorY;
			},function(value){
			if (value !=this._layout.anchorY){
				this.getLayout().anchorY=value;
				this._setLayoutEnabled(true);
			}
			this.resetLayoutY();
		});

		/**
		*<p>对象的标签。</p>
		*@internal 冗余字段，可以用来储存数据。
		*/
		__getset(0,__proto,'tag',function(){
			return this._tag;
			},function(value){
			this._tag=value;
		});

		/**
		*<p>鼠标悬停提示。</p>
		*<p>可以赋值为文本 <code>String</code> 或函数 <code>Handler</code> ，用来实现自定义样式的鼠标提示和参数携带等。</p>
		*@example
		*private var _testTips:TestTipsUI=new TestTipsUI();
		*private function testTips():void {
			//简单鼠标提示
			*btn2.toolTip="这里是鼠标提示&lt;b&gt;粗体&lt;/b&gt;&lt;br&gt;换行";
			//自定义的鼠标提示
			*btn1.toolTip=showTips1;
			//带参数的自定义鼠标提示
			*clip.toolTip=new Handler(this,showTips2,["clip"]);
			*}
		*private function showTips1():void {
			*_testTips.label.text="这里是按钮["+btn1.label+"]";
			*tip.addChild(_testTips);
			*}
		*private function showTips2(name:String):void {
			*_testTips.label.text="这里是"+name;
			*tip.addChild(_testTips);
			*}
		*/
		__getset(0,__proto,'toolTip',function(){
			return this._toolTip;
			},function(value){
			if (this._toolTip !=value){
				this._toolTip=value;
				if (value !=null){
					this.on("mouseover",this,this.onMouseOver);
					this.on("mouseout",this,this.onMouseOut);
					}else {
					this.off("mouseover",this,this.onMouseOver);
					this.off("mouseout",this,this.onMouseOut);
				}
			}
		});

		/**
		*XML 数据。
		*/
		__getset(0,__proto,'comXml',function(){
			return this._comXml;
			},function(value){
			this._comXml=value;
		});

		/**是否变灰。*/
		__getset(0,__proto,'gray',function(){
			return this._gray;
			},function(value){
			if (value!==this._gray){
				this._gray=value;
				UIUtils.gray(this,value);
			}
		});

		/**是否禁用页面，设置为true后，会变灰并且禁用鼠标。*/
		__getset(0,__proto,'disabled',function(){
			return this._disabled;
			},function(value){
			if (value!==this._disabled){
				this.gray=this._disabled=value;
				this.mouseEnabled=!value;
			}
		});

		return Component;
	})(Sprite)


	//class laya.debug.tools.comps.ArrowLine extends laya.display.Sprite
	var ArrowLine=(function(_super){
		function ArrowLine(sign){
			this.lineLen=160;
			this.arrowLen=10;
			this.sign="Y";
			this._targetChanger=null;
			this._isMoving=false;
			this.lenControl=new Rect();
			this.rotationControl=new Rect();
			this.lenChanger=ValueChanger.create(this,"lineLen");
			this.lenControlXChanger=ValueChanger.create(this.lenControl,"x");
			(sign===void 0)&& (sign="X");
			ArrowLine.__super.call(this);
			this.sign=sign;
			this.addChild(this.lenControl);
			this.addChild(this.rotationControl);
			this.lenControl.on("mousedown",this,this.controlMouseDown);
			this.drawMe();
		}

		__class(ArrowLine,'laya.debug.tools.comps.ArrowLine',_super);
		var __proto=ArrowLine.prototype;
		__proto.drawMe=function(){
			var g;
			g=this.graphics;
			g.clear();
			g.drawLine(0,0,this.lineLen,0,"#ffff00");
			g.drawLine(this.lineLen,0,this.lineLen-this.arrowLen,-this.arrowLen,"#ff0000");
			g.drawLine(this.lineLen,0,this.lineLen-this.arrowLen,this.arrowLen,"#ff0000");
			g.fillText(this.sign,50,-5,"","#ff0000","left");
			if(this._isMoving&&this._targetChanger){
				g.fillText(this._targetChanger.key+":"+this._targetChanger.value.toFixed(2),this.lineLen-15,-25,"","#ffff00","center");
			}
			this.lenControl.posTo(this.lineLen-15,0);
			this.rotationControl.posTo(this.lineLen+10,0);
			this.size(this.arrowLen,this.lineLen);
		}

		__proto.clearMoveEvents=function(){
			Laya.stage.off("mousemove",this,this.stageMouseMove);
			Laya.stage.off("mouseup",this,this.stageMouseUp);
		}

		__proto.controlMouseDown=function(e){
			this.clearMoveEvents();
			this.lenControlXChanger.record();
			this.lenChanger.record();
			if(this.targetChanger){
				this.targetChanger.record();
			}
			this._isMoving=true;
			Laya.stage.on("mousemove",this,this.stageMouseMove);
			Laya.stage.on("mouseup",this,this.stageMouseUp);
		}

		__proto.stageMouseMove=function(e){
			this.lenControlXChanger.value=this.mouseX;
			this.lenChanger.showValueByScale(this.lenControlXChanger.scaleValue);
			if(this.targetChanger){
				this.targetChanger.showValueByScale(this.lenControlXChanger.scaleValue);
			}
			this.drawMe();
		}

		__proto.stageMouseUp=function(e){
			this._isMoving=false;
			this.noticeChange();
			this.clearMoveEvents();
			this.lenControlXChanger.recover();
			this.lenChanger.recover();
			this.drawMe();
		}

		__proto.noticeChange=function(){
			var dLen=NaN;
			dLen=this.lenChanger.dValue;
			console.log("lenChange:",dLen);
		}

		__getset(0,__proto,'targetChanger',function(){
			return this._targetChanger;
			},function(changer){
			if(this._targetChanger){
				this._targetChanger.dispose();
			}
			this._targetChanger=changer;
		});

		return ArrowLine;
	})(Sprite)


	//class laya.debug.tools.comps.Axis extends laya.display.Sprite
	var Axis=(function(_super){
		function Axis(){
			this._target=null;
			this._lenType=
			[
			["width","height"],
			["scaleX","scaleY"]];
			this._type=1;
			this.xAxis=new ArrowLine("X");
			this.yAxis=new ArrowLine("Y");
			this.controlBox=new Rect();
			this._point=new Point();
			this.oPoint=new Point();
			this.myRotationChanger=ValueChanger.create(this,"rotation");
			this.targetRotationChanger=ValueChanger.create(null,"rotation");
			this.stageMouseRotationChanger=new ValueChanger();
			Axis.__super.call(this);
			this.mouseEnabled=true;
			this.size(1,1);
			this.initMe();
			this.xAxis.rotationControl.on("mousedown",this,this.controlMouseDown);
			this.yAxis.rotationControl.on("mousedown",this,this.controlMouseDown);
			this.controlBox.on("mousedown",this,this.controlBoxMouseDown);
			this.on("dragmove",this,this.dragging);
		}

		__class(Axis,'laya.debug.tools.comps.Axis',_super);
		var __proto=Axis.prototype;
		__proto.updateChanges=function(){
			if(this._target){
				var params;
				params=this._lenType[this._type];
				this.xAxis.targetChanger=ValueChanger.create(this._target,params[0]);
				this.yAxis.targetChanger=ValueChanger.create(this._target,params[1]);
			}
		}

		__proto.switchType=function(){
			this._type++;
			this._type=this._type%this._lenType.length;
			this.type=this._type;
		}

		__proto.controlBoxMouseDown=function(e){
			this.startDrag();
		}

		__proto.dragging=function(){
			if (this._target){
				this._point.setTo(this.x,this.y);
				DisControlTool.transPoint(this.parent,this._target.parent,this._point);
				this._target.pos(this._point.x,this._point.y);
			}
		}

		__proto.initMe=function(){
			this.addChild(this.xAxis);
			this.addChild(this.yAxis);
			this.yAxis.rotation=90;
			this.addChild(this.controlBox);
			this.controlBox.posTo(0,0);
		}

		__proto.clearMoveEvents=function(){
			Laya.stage.off("mousemove",this,this.stageMouseMove);
			Laya.stage.off("mouseup",this,this.stageMouseUp);
		}

		__proto.controlMouseDown=function(e){
			this.targetRotationChanger.target=this.target;
			this.clearMoveEvents();
			this.oPoint.setTo(0,0);
			this.myRotationChanger.record();
			this.oPoint=this.localToGlobal(this.oPoint);
			this.stageMouseRotationChanger.value=this.getStageMouseRatation();
			this.stageMouseRotationChanger.record();
			this.targetRotationChanger.record();
			Laya.stage.on("mousemove",this,this.stageMouseMove);
			Laya.stage.on("mouseup",this,this.stageMouseUp);
		}

		__proto.getStageMouseRatation=function(){
			return MathUtil.getRotation(this.oPoint.x,this.oPoint.y,Laya.stage.mouseX,Laya.stage.mouseY);
		}

		__proto.stageMouseMove=function(e){
			this.stageMouseRotationChanger.value=this.getStageMouseRatation();
			var dRotation=NaN;
			dRotation=-this.stageMouseRotationChanger.dValue;
			if(this.target){
				this.targetRotationChanger.showValueByAdd(dRotation);
				}else{
				this.myRotationChanger.showValueByAdd(dRotation);
			}
		}

		__proto.stageMouseUp=function(e){
			this.noticeChange();
			this.clearMoveEvents();
		}

		__proto.noticeChange=function(){
			console.log("rotate:",-this.stageMouseRotationChanger.dValue);
		}

		__getset(0,__proto,'target',function(){
			return this._target;
			},function(tar){
			this._target=tar;
			this.updateChanges();
		});

		__getset(0,__proto,'type',function(){
			return this._type;
			},function(lenType){
			this._type=lenType;
			this.updateChanges();
		});

		return Axis;
	})(Sprite)


	//class laya.debug.tools.comps.Rect extends laya.display.Sprite
	var Rect=(function(_super){
		function Rect(){
			this.recWidth=10;
			Rect.__super.call(this);
			this.drawMe();
		}

		__class(Rect,'laya.debug.tools.comps.Rect',_super);
		var __proto=Rect.prototype;
		__proto.drawMe=function(){
			var g;
			g=this.graphics;
			g.clear();
			g.drawRect(0,0,this.recWidth,this.recWidth,"#22ff22");
			this.size(this.recWidth,this.recWidth);
		}

		__proto.posTo=function(x,y){
			this.x=x-this.recWidth*0.5;
			this.y=y-this.recWidth*0.5;
		}

		return Rect;
	})(Sprite)


	//class laya.display.Text extends laya.display.Sprite
	var Text=(function(_super){
		function Text(){
			this._clipPoint=null;
			this._currBitmapFont=null;
			this._text=null;
			this._isChanged=false;
			this._textWidth=0;
			this._textHeight=0;
			this._lines=[];
			this._lineWidths=[];
			this._startX=NaN;
			this._startY=NaN;
			this._lastVisibleLineIndex=-1;
			this._words=null;
			this._charSize={};
			this.underline=false;
			this._underlineColor=null;
			Text.__super.call(this);
			this.overflow=Text.VISIBLE;
			this._style=new CSSStyle(this);
			(this._style).wordWrap=false;
		}

		__class(Text,'laya.display.Text',_super);
		var __proto=Text.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._lines=null;
			if (this._words){
				this._words.length=0;
				this._words=null;
			}
		}

		/**
		*@private
		*@inheritDoc
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec._getBoundPoints();
		}

		/**
		*@inheritDoc
		*/
		__proto.getGraphicBounds=function(realSize){
			(realSize===void 0)&& (realSize=false);
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec;
		}

		/**
		*@private
		*@inheritDoc
		*/
		__proto._getCSSStyle=function(){
			return this._style;
		}

		/**
		*<p>根据指定的文本，从语言包中取当前语言的文本内容。并对此文本中的{i}文本进行替换。</p>
		*<p>例如：
		*<li>（1）text 的值为“我的名字”，先取到这个文本对应的当前语言版本里的值“My name”，将“My name”设置为当前文本的内容。</li>
		*<li>（2）text 的值为“恭喜你赢得{0}个钻石，{1}经验。”，arg1 的值为100，arg2 的值为200。
		*则先取到这个文本对应的当前语言版本里的值“Congratulations on your winning {0}diamonds,{1}experience.”，
		*然后将文本里的{0}、{1}，依据括号里的数字从0开始替换为 arg1、arg2 的值。
		*将替换处理后的文本“Congratulations on your winning 100 diamonds,200 experience.”设置为当前文本的内容。
		*</li>
		*</p>
		*@param text 文本内容。
		*@param ...args 文本替换参数。
		*/
		__proto.lang=function(text,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10){
			text=Text.langPacks && Text.langPacks[text] ? Text.langPacks[text] :text;
			if (arguments.length < 2){
				this._text=text;
				}else {
				for (var i=0,n=arguments.length;i < n;i++){
					text=text.replace("{"+i+"}",arguments[i+1]);
				}
				this._text=text;
			}
		}

		/**
		*渲染文字。
		*@param begin 开始渲染的行索引。
		*@param visibleLineCount 渲染的行数。
		*/
		__proto.renderText=function(begin,visibleLineCount){
			var graphics=this.graphics;
			graphics.clear();
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.context.font=ctxFont;
			var padding=this.padding;
			var startX=padding[3];
			var textAlgin="left";
			var lines=this._lines;
			var lineHeight=this.leading+this._charSize.height;
			var tCurrBitmapFont=this._currBitmapFont;
			if (tCurrBitmapFont){
				lineHeight=this.leading+tCurrBitmapFont.getMaxHeight();
			};
			var startY=padding[0];
			if ((!tCurrBitmapFont)&& this._width > 0 && this._textWidth <=this._width){
				if (this.align=="right"){
					textAlgin="right";
					startX=this._width-padding[1];
					}else if (this.align=="center"){
					textAlgin="center";
					startX=this._width *0.5+padding[3]-padding[1];
				}
			}
			if (this._height > 0){
				var tempVAlign=(this._textHeight > this._height)? "top" :this.valign;
				if (tempVAlign==="middle")
					startY=(this._height-visibleLineCount *lineHeight)*0.5+padding[0]-padding[2];
				else if (tempVAlign==="bottom")
				startY=this._height-visibleLineCount *lineHeight-padding[2];
			};
			var style=this._style;
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var bitmapScale=tCurrBitmapFont.fontSize / this.fontSize;
			}
			if (this._clipPoint){
				graphics.save();
				if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
					var tClipWidth=0;
					var tClipHeight=0;
					this._width ? tClipWidth=(this._width-padding[3]-padding[1]):tClipWidth=this._textWidth;
					this._height ? tClipHeight=(this._height-padding[0]-padding[2]):tClipHeight=this._textHeight;
					tClipWidth *=bitmapScale;
					tClipHeight *=bitmapScale;
					graphics.clipRect(padding[3],padding[0],tClipWidth,tClipHeight);
					}else {
					graphics.clipRect(padding[3],padding[0],this._width ? (this._width-padding[3]-padding[1]):this._textWidth,this._height ? (this._height-padding[0]-padding[2]):this._textHeight);
				}
			};
			var password=style.password;
			if (("prompt" in this)&& this['prompt']==this._text)
				password=false;
			var x=0,y=0;
			var end=Math.min(this._lines.length,visibleLineCount+begin)|| 1;
			for (var i=begin;i < end;i++){
				var word=lines[i];
				var _word;
				if (password){
					var len=word.length;
					word="";
					for (var j=len;j > 0;j--){
						word+="●";
					}
				}
				x=startX-(this._clipPoint ? this._clipPoint.x :0);
				y=startY+lineHeight *i-(this._clipPoint ? this._clipPoint.y :0);
				this.underline && this.drawUnderline(textAlgin,x,y,i);
				if (tCurrBitmapFont){
					var tWidth=this.width;
					if (tCurrBitmapFont.autoScaleSize){
						tWidth=this.width *bitmapScale;
					}
					tCurrBitmapFont.drawText(word,this,x,y,this.align,tWidth);
					}else {
					if (Render.isWebGL){
						this._words || (this._words=[]);
						_word=this._words.length > (i-begin)? this._words[i-begin] :new WordText();
						_word.setText(word);
						}else {
						_word=word;
					}
					style.stroke ? graphics.fillBorderText(_word,x,y,ctxFont,this.color,style.strokeColor,style.stroke,textAlgin):graphics.fillText(_word,x,y,ctxFont,this.color,textAlgin);
				}
			}
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var tScale=1 / bitmapScale;
				this.scale(tScale,tScale);
			}
			if (this._clipPoint)
				graphics.restore();
			this._startX=startX;
			this._startY=startY;
		}

		/**
		*绘制下划线
		*@param x 本行坐标
		*@param y 本行坐标
		*@param lineIndex 本行索引
		*/
		__proto.drawUnderline=function(align,x,y,lineIndex){
			var lineWidth=this._lineWidths[lineIndex];
			switch (align){
				case 'center':
					x-=lineWidth / 2;
					break ;
				case 'right':
					x-=lineWidth;
					break ;
				case 'left':
				default :
					break ;
				}
			y+=this._charSize.height;
			this._graphics.drawLine(x,y,x+lineWidth,y,this.underlineColor || this.color,1);
		}

		/**
		*<p>排版文本。</p>
		*<p>进行宽高计算，渲染、重绘文本。</p>
		*/
		__proto.typeset=function(){
			this._isChanged=false;
			if (!this._text){
				this._clipPoint=null;
				this._textWidth=this._textHeight=0;
				this.graphics.clear();
				return;
			}
			Browser.context.font=this._getCSSStyle().font;
			this._lines.length=0;
			this._lineWidths.length=0;
			this.parseLines(this._text);
			this.evalTextSize();
			if (this.checkEnabledViewportOrNot())
				this._clipPoint || (this._clipPoint=new Point(0,0));
			else
			this._clipPoint=null;
			var lineCount=this._lines.length;
			if (this.overflow !=Text.VISIBLE){
				var func=this.overflow==Text.HIDDEN ? Math.floor :Math.ceil;
				lineCount=Math.min(lineCount,func((this.height-this.padding[0]-this.padding[2])/ (this.leading+this._charSize.height)));
			};
			var startLine=this.scrollY / (this._charSize.height+this.leading)| 0;
			this.renderText(startLine,lineCount);
			this.repaint();
		}

		__proto.evalTextSize=function(){
			var nw=NaN,nh=NaN;
			nw=Math.max.apply(this,this._lineWidths);
			if (this._currBitmapFont)
				nh=this._lines.length *(this._currBitmapFont.getMaxHeight()+this.leading)+this.padding[0]+this.padding[2];
			else
			nh=this._lines.length *(this._charSize.height+this.leading)+this.padding[0]+this.padding[2];
			if (nw !=this._textWidth || nh !=this._textHeight){
				this._textWidth=nw;
				this._textHeight=nh;
				if (!this._width || !this._height)
					this.conchModel && this.conchModel.size(this._width || this._textWidth,this._height || this._textHeight);
			}
		}

		__proto.checkEnabledViewportOrNot=function(){
			return this.overflow==Text.SCROLL && ((this._width > 0 && this._textWidth > this._width)|| (this._height > 0 && this._textHeight > this._height));
		}

		/**
		*<p>快速更改显示文本。不进行排版计算，效率较高。</p>
		*<p>如果只更改文字内容，不更改文字样式，建议使用此接口，能提高效率。</p>
		*@param text 文本内容。
		*/
		__proto.changeText=function(text){
			if (this._text!==text){
				this.lang(text+"");
				if (this._graphics && this._graphics.replaceText(this._text)){
					}else {
					this.typeset();
				}
			}
		}

		/**
		*@private
		*分析文本换行。
		*/
		__proto.parseLines=function(text){
			var needWordWrapOrTruncate=this.wordWrap || this.overflow==Text.HIDDEN;
			if (needWordWrapOrTruncate){
				var wordWrapWidth=this.getWordWrapWidth();
			}
			if (this._currBitmapFont){
				this._charSize.width=this._currBitmapFont.getMaxWidth();
				this._charSize.height=this._currBitmapFont.getMaxHeight();
				}else {
				var measureResult=Browser.context.measureText(Text._testWord);
				this._charSize.width=measureResult.width;
				this._charSize.height=(measureResult.height || this.fontSize);
			};
			var lines=text.replace(/\r\n/g,"\n").split("\n");
			for (var i=0,n=lines.length;i < n;i++){
				var line=lines[i];
				if (needWordWrapOrTruncate)
					this.parseLine(line,wordWrapWidth);
				else {
					this._lineWidths.push(this.getTextWidth(line));
					this._lines.push(line);
				}
			}
		}

		/**
		*@private
		*解析行文本。
		*@param line 某行的文本。
		*@param wordWrapWidth 文本的显示宽度。
		*/
		__proto.parseLine=function(line,wordWrapWidth){
			var ctx=Browser.context;
			var lines=this._lines;
			var maybeIndex=0;
			var execResult;
			var charsWidth=NaN;
			var wordWidth=NaN;
			var startIndex=0;
			charsWidth=this.getTextWidth(line);
			if (charsWidth <=wordWrapWidth){
				lines.push(line);
				this._lineWidths.push(charsWidth);
				return;
			}
			charsWidth=this._charSize.width;
			maybeIndex=Math.floor(wordWrapWidth / charsWidth);
			(maybeIndex==0)&& (maybeIndex=1);
			charsWidth=this.getTextWidth(line.substring(0,maybeIndex));
			wordWidth=charsWidth;
			for (var j=maybeIndex,m=line.length;j < m;j++){
				charsWidth=this.getTextWidth(line.charAt(j));
				wordWidth+=charsWidth;
				if (wordWidth > wordWrapWidth){
					if (this.wordWrap){
						var newLine=line.substring(startIndex,j);
						if (newLine.charCodeAt(newLine.length-1)< 255){
							execResult=/(?:\w|-)+$/.exec(newLine);
							if (execResult){
								j=execResult.index+startIndex;
								if (execResult.index==0)
									j+=newLine.length;
								else
								newLine=line.substring(startIndex,j);
							}
						}
						lines.push(newLine);
						this._lineWidths.push(wordWidth-charsWidth);
						startIndex=j;
						if (j+maybeIndex < m){
							j+=maybeIndex;
							charsWidth=this.getTextWidth(line.substring(startIndex,j));
							wordWidth=charsWidth;
							j--;
							}else {
							lines.push(line.substring(startIndex,m));
							this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
							startIndex=-1;
							break ;
						}
						}else if (this.overflow==Text.HIDDEN){
						lines.push(line.substring(0,j));
						this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
						return;
					}
				}
			}
			if (this.wordWrap && startIndex !=-1){
				lines.push(line.substring(startIndex,m));
				this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
			}
		}

		__proto.getTextWidth=function(text){
			if (this._currBitmapFont)
				return this._currBitmapFont.getTextWidth(text);
			else
			return Browser.context.measureText(text).width;
		}

		/**
		*获取换行所需的宽度。
		*/
		__proto.getWordWrapWidth=function(){
			var p=this.padding;
			var w=NaN;
			if (this._currBitmapFont && this._currBitmapFont.autoScaleSize)
				w=this._width *(this._currBitmapFont.fontSize / this.fontSize);
			else
			w=this._width;
			if (w <=0){
				w=this.wordWrap ? 100 :Browser.width;
			}
			w <=0 && (w=100);
			return w-p[3]-p[1];
		}

		/**
		*返回字符在本类实例的父坐标系下的坐标。
		*@param charIndex 索引位置。
		*@param out （可选）输出的Point引用。
		*@return Point 字符在本类实例的父坐标系下的坐标。如果out参数不为空，则将结果赋值给指定的Point对象，否则创建一个新的Point对象返回。建议使用Point.TEMP作为out参数，可以省去Point对象创建和垃圾回收的开销，尤其是在需要频繁执行的逻辑中，比如帧循环和MOUSE_MOVE事件回调函数里面。
		*/
		__proto.getCharPoint=function(charIndex,out){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			var len=0,lines=this._lines,startIndex=0;
			for (var i=0,n=lines.length;i < n;i++){
				len+=lines[i].length;
				if (charIndex < len){
					var line=i;
					break ;
				}
				startIndex=len;
			};
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.context.font=ctxFont;
			var width=this.getTextWidth(this._text.substring(startIndex,charIndex));
			var point=out || new Point();
			return point.setTo(this._startX+width-(this._clipPoint ? this._clipPoint.x :0),this._startY+line *(this._charSize.height+this.leading)-(this._clipPoint ? this._clipPoint.y :0));
		}

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'width',function(){
			if (this._width)
				return this._width;
			return this.textWidth+this.padding[1]+this.padding[3];
			},function(value){
			if (value !=this._width){
				_super.prototype._$set_width.call(this,value);
				this.isChanged=true;
			}
		});

		/**
		*表示文本的宽度，以像素为单位。
		*/
		__getset(0,__proto,'textWidth',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textWidth;
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'height',function(){
			if (this._height)return this._height;
			return this.textHeight+this.padding[0]+this.padding[2];
			},function(value){
			if (value !=this._height){
				_super.prototype._$set_height.call(this,value);
				this.isChanged=true;
			}
		});

		/**
		*表示文本的高度，以像素为单位。
		*/
		__getset(0,__proto,'textHeight',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textHeight;
		});

		/**
		*<p>边距信息。</p>
		*<p>数据格式：[上边距，右边距，下边距，左边距]（边距以像素为单位）。</p>
		*/
		__getset(0,__proto,'padding',function(){
			return this._getCSSStyle().padding;
			},function(value){
			this._getCSSStyle().padding=value;
			this.isChanged=true;
		});

		/**
		*<p>指定文本是否为粗体字。</p>
		*<p>默认值为 false，这意味着不使用粗体字。如果值为 true，则文本为粗体字。</p>
		*/
		__getset(0,__proto,'bold',function(){
			return this._getCSSStyle().bold;
			},function(value){
			this._getCSSStyle().bold=value;
			this.isChanged=true;
		});

		/**当前文本的内容字符串。*/
		__getset(0,__proto,'text',function(){
			return this._text || "";
			},function(value){
			if (this._text!==value){
				this.lang(value+"");
				this.isChanged=true;
				this.event("change");
			}
		});

		/**
		*<p>表示文本的颜色值。可以通过 <code>Text.defaultColor</code> 设置默认颜色。</p>
		*<p>默认值为黑色。</p>
		*/
		__getset(0,__proto,'color',function(){
			return this._getCSSStyle().color;
			},function(value){
			if (this._getCSSStyle().color !=value){
				this._getCSSStyle().color=value;
				if (!this._isChanged && this._graphics){
					this._graphics.replaceTextColor(this.color)
					}else {
					this.isChanged=true;
				}
			}
		});

		/**
		*<p>文本的字体名称，以字符串形式表示。</p>
		*<p>默认值为："Arial"，可以通过Font.defaultFont设置默认字体。</p>
		*@see laya.display.css.Font#defaultFamily
		*/
		__getset(0,__proto,'font',function(){
			return this._getCSSStyle().fontFamily;
			},function(value){
			if (this._currBitmapFont){
				this._currBitmapFont=null;
				this.scale(1,1);
			}
			if (Text._bitmapFonts && Text._bitmapFonts[value]){
				this._currBitmapFont=Text._bitmapFonts[value];
			}
			this._getCSSStyle().fontFamily=value;
			this.isChanged=true;
		});

		/**
		*<p>指定文本的字体大小（以像素为单位）。</p>
		*<p>默认为20像素，可以通过 <code>Text.defaultSize</code> 设置默认大小。</p>
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._getCSSStyle().fontSize;
			},function(value){
			this._getCSSStyle().fontSize=value;
			this.isChanged=true;
		});

		/**
		*<p>表示使用此文本格式的文本是否为斜体。</p>
		*<p>默认值为 false，这意味着不使用斜体。如果值为 true，则文本为斜体。</p>
		*/
		__getset(0,__proto,'italic',function(){
			return this._getCSSStyle().italic;
			},function(value){
			this._getCSSStyle().italic=value;
			this.isChanged=true;
		});

		/**
		*<p>表示文本的水平显示方式。</p>
		*<p><b>取值：</b>
		*<li>"left"： 居左对齐显示。</li>
		*<li>"center"： 居中对齐显示。</li>
		*<li>"right"： 居右对齐显示。</li>
		*</p>
		*/
		__getset(0,__proto,'align',function(){
			return this._getCSSStyle().align;
			},function(value){
			this._getCSSStyle().align=value;
			this.isChanged=true;
		});

		/**
		*<p>表示文本的垂直显示方式。</p>
		*<p><b>取值：</b>
		*<li>"top"： 居顶部对齐显示。</li>
		*<li>"middle"： 居中对齐显示。</li>
		*<li>"bottom"： 居底部对齐显示。</li>
		*</p>
		*/
		__getset(0,__proto,'valign',function(){
			return this._getCSSStyle().valign;
			},function(value){
			this._getCSSStyle().valign=value;
			this.isChanged=true;
		});

		/**
		*<p>表示文本是否自动换行，默认为false。</p>
		*<p>若值为true，则自动换行；否则不自动换行。</p>
		*/
		__getset(0,__proto,'wordWrap',function(){
			return this._getCSSStyle().wordWrap;
			},function(value){
			this._getCSSStyle().wordWrap=value;
			this.isChanged=true;
		});

		/**
		*垂直行间距（以像素为单位）。
		*/
		__getset(0,__proto,'leading',function(){
			return this._getCSSStyle().leading;
			},function(value){
			this._getCSSStyle().leading=value;
			this.isChanged=true;
		});

		/**
		*文本背景颜色，以字符串表示。
		*/
		__getset(0,__proto,'bgColor',function(){
			return this._getCSSStyle().backgroundColor;
			},function(value){
			this._getCSSStyle().backgroundColor=value;
			this.isChanged=true;
		});

		/**
		*文本边框背景颜色，以字符串表示。
		*/
		__getset(0,__proto,'borderColor',function(){
			return this._getCSSStyle().borderColor;
			},function(value){
			this._getCSSStyle().borderColor=value;
			this.isChanged=true;
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*<p>默认值0，表示不描边。<p>q
		*/
		__getset(0,__proto,'stroke',function(){
			return this._getCSSStyle().stroke;
			},function(value){
			this._getCSSStyle().stroke=value;
			this.isChanged=true;
		});

		/**
		*<p>描边颜色，以字符串表示。</p>
		*<p>默认值为 "#000000"（黑色）;</p>
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._getCSSStyle().strokeColor;
			},function(value){
			this._getCSSStyle().strokeColor=value;
			this.isChanged=true;
		});

		/**
		*一个布尔值，表示文本的属性是否有改变。若为true表示有改变。
		*/
		__getset(0,__proto,'isChanged',null,function(value){
			if (this._isChanged!==value){
				this._isChanged=value;
				value && Laya.timer.callLater(this,this.typeset);
			}
		});

		/**
		*<p>设置横向滚动量。</p>
		*<p>即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。</p>
		*/
		/**
		*获取横向滚动量。
		*/
		__getset(0,__proto,'scrollX',function(){
			if (!this._clipPoint)
				return 0;
			return this._clipPoint.x;
			},function(value){
			if (this.overflow !=Text.SCROLL || (this.textWidth < this._width || !this._clipPoint))
				return;
			value=value < this.padding[3] ? this.padding[3] :value;
			var maxScrollX=this._textWidth-this._width;
			value=value > maxScrollX ? maxScrollX :value;
			var visibleLineCount=this._height / (this._charSize.height+this.leading)| 0+1;
			this._clipPoint.x=value;
			this.renderText(this._lastVisibleLineIndex,visibleLineCount);
		});

		/**
		*设置纵向滚动量（px)。即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。
		*/
		/**
		*获取纵向滚动量。
		*/
		__getset(0,__proto,'scrollY',function(){
			if (!this._clipPoint)
				return 0;
			return this._clipPoint.y;
			},function(value){
			if (this.overflow !=Text.SCROLL || (this.textHeight < this._height || !this._clipPoint))
				return;
			value=value < this.padding[0] ? this.padding[0] :value;
			var maxScrollY=this._textHeight-this._height;
			value=value > maxScrollY ? maxScrollY :value;
			var startLine=value / (this._charSize.height+this.leading)| 0;
			this._lastVisibleLineIndex=startLine;
			var visibleLineCount=(this._height / (this._charSize.height+this.leading)| 0)+1;
			this._clipPoint.y=value;
			this.renderText(startLine,visibleLineCount);
		});

		/**
		*获取横向可滚动最大值。
		*/
		__getset(0,__proto,'maxScrollX',function(){
			return (this.textWidth < this._width)? 0 :this._textWidth-this._width;
		});

		/**
		*获取纵向可滚动最大值。
		*/
		__getset(0,__proto,'maxScrollY',function(){
			return (this.textHeight < this._height)? 0 :this._textHeight-this._height;
		});

		__getset(0,__proto,'lines',function(){
			if (this._isChanged)
				this.typeset();
			return this._lines;
		});

		__getset(0,__proto,'underlineColor',function(){
			return this._underlineColor;
			},function(value){
			this._underlineColor=value;
			this._isChanged=true;
			this.typeset();
		});

		Text.registerBitmapFont=function(name,bitmapFont){
			Text._bitmapFonts || (Text._bitmapFonts={});
			Text._bitmapFonts[name]=bitmapFont;
		}

		Text.unregisterBitmapFont=function(name,destroy){
			(destroy===void 0)&& (destroy=true);
			if (Text._bitmapFonts && Text._bitmapFonts[name]){
				var tBitmapFont=Text._bitmapFonts[name];
				if (destroy){
					tBitmapFont.destroy();
				}
				delete Text._bitmapFonts[name];
			}
		}

		Text._testWord="游";
		Text.langPacks=null
		Text.VISIBLE="visible";
		Text.SCROLL="scroll";
		Text.HIDDEN="hidden";
		Text._bitmapFonts=null
		return Text;
	})(Sprite)


	//class laya.debug.view.nodeInfo.DebugInfoLayer extends laya.display.Sprite
	var DebugInfoLayer=(function(_super){
		function DebugInfoLayer(){
			this.nodeRecInfoLayer=null;
			this.lineLayer=null;
			this.txtLayer=null;
			this.popLayer=null;
			this.graphicLayer=null;
			this.cacheViewLayer=null;
			DebugInfoLayer.__super.call(this);
			this.nodeRecInfoLayer=new Sprite();
			this.lineLayer=new Sprite();
			this.txtLayer=new Sprite();
			this.popLayer=new Sprite();
			this.graphicLayer=new Sprite();
			this.cacheViewLayer=new Sprite();
			this.nodeRecInfoLayer.name="nodeRecInfoLayer";
			this.lineLayer.name="lineLayer";
			this.txtLayer.name="txtLayer";
			this.popLayer.name="popLayer";
			this.graphicLayer.name="graphicLayer";
			this.cacheViewLayer.name="cacheViewLayer";
			this.addChild(this.lineLayer);
			this.addChild(this.cacheViewLayer);
			this.addChild(this.nodeRecInfoLayer);
			this.addChild(this.txtLayer);
			this.addChild(this.popLayer);
			this.addChild(this.graphicLayer);
			DebugInfoLayer.I=this;
			this.zOrder=999;
			Laya.stage.on("doubleclick",this,this.setTop);
		}

		__class(DebugInfoLayer,'laya.debug.view.nodeInfo.DebugInfoLayer',_super);
		var __proto=DebugInfoLayer.prototype;
		__proto.setTop=function(){
			DisControlTool.setTop(this);
		}

		__proto.isDebugItem=function(sprite){
			return DisControlTool.isInTree(this,sprite);
		}

		DebugInfoLayer.init=function(){
			if (!DebugInfoLayer.I){
				new DebugInfoLayer();
				Laya.stage.addChild(DebugInfoLayer.I);
			}
		}

		DebugInfoLayer.I=null
		return DebugInfoLayer;
	})(Sprite)


	//class laya.debug.view.nodeInfo.NodeInfoPanel extends laya.display.Sprite
	var NodeInfoPanel=(function(_super){
		function NodeInfoPanel(){
			this._stateDic={};
			this.isWorkState=false;
			NodeInfoPanel.__super.call(this);
		}

		__class(NodeInfoPanel,'laya.debug.view.nodeInfo.NodeInfoPanel',_super);
		var __proto=NodeInfoPanel.prototype;
		__proto.showDisInfo=function(node){
			this.recoverNodes();
			NodeInfosItem.showDisInfos(node);
			this.showOnly(node);
			this.isWorkState=true;
		}

		__proto.showOnly=function(node){
			if (!node)
				return;
			this.hideBrothers(node);
			this.showOnly(node.parent);
		}

		__proto.recoverNodes=function(){
			NodeInfosItem.hideAllInfos();
			var key;
			var data;
			var tTar;
			for (key in this._stateDic){
				data=this._stateDic[key];
				tTar=data["target"];
				if (tTar){
					try{
						tTar.visible=data.visible;
						}catch (e){
					}
				}
			}
			this.isWorkState=false;
		}

		__proto.hideOtherChain=function(node){
			if (!node)
				return;
			while (node){
				this.hideBrothers(node);
				node=node.parent;
			}
		}

		__proto.hideChilds=function(node){
			if (!node)
				return;
			var i=0,len=0;
			var cList;
			cList=node._childs;
			len=cList.length;
			var tChild;
			for (i=0;i < len;i++){
				tChild=cList[i];
				if (tChild==NodeInfosItem.NodeInfoContainer)continue ;
				this.saveNodeInfo(tChild);
				tChild.visible=false;
			}
		}

		__proto.hideBrothers=function(node){
			if (!node)
				return;
			var p;
			p=node.parent;
			if (!p)
				return;
			var i=0,len=0;
			var cList;
			cList=p._childs;
			len=cList.length;
			var tChild;
			for (i=0;i < len;i++){
				tChild=cList[i];
				if (tChild==NodeInfosItem.NodeInfoContainer)continue ;
				if (tChild !=node){
					this.saveNodeInfo(tChild);
					tChild.visible=false;
				}
			}
		}

		__proto.saveNodeInfo=function(node){
			IDTools.idObj(node);
			if(this._stateDic.hasOwnProperty(IDTools.getObjID(node)))return;
			var data;
			data={};
			data.target=node;
			data.visible=node.visible;
			this._stateDic[IDTools.getObjID(node)]=data;
		}

		__proto.recoverNodeInfo=function(node){
			IDTools.idObj(node);
			if (this._stateDic.hasOwnProperty(IDTools.getObjID(node))){
				var data;
				data=this._stateDic[IDTools.getObjID(node)];
				node["visible"]=data.visible;
			}
		}

		NodeInfoPanel.init=function(){
			if (!NodeInfoPanel.I){
				NodeInfoPanel.I=new NodeInfoPanel();
				NodeInfosItem.init();
				ToolPanel.init();
			}
		}

		NodeInfoPanel.I=null
		return NodeInfoPanel;
	})(Sprite)


	//class laya.debug.view.nodeInfo.NodeInfosItem extends laya.display.Sprite
	var NodeInfosItem=(function(_super){
		function NodeInfosItem(){
			this._infoTxt=null;
			this._tar=null;
			NodeInfosItem.__super.call(this);
			this._infoTxt=new Text();
			this._infoTxt.color="#ff0000";
			this._infoTxt.bgColor="#00ff00";
			this._infoTxt.fontSize=12;
		}

		__class(NodeInfosItem,'laya.debug.view.nodeInfo.NodeInfosItem',_super);
		var __proto=NodeInfosItem.prototype;
		__proto.removeSelf=function(){
			this._infoTxt.removeSelf();
			return laya.display.Node.prototype.removeSelf.call(this);
		}

		__proto.showToUI=function(){
			NodeInfosItem.NodeInfoContainer.nodeRecInfoLayer.addChild(this);
			this._infoTxt.removeSelf();
			NodeInfosItem.NodeInfoContainer.txtLayer.addChild(this._infoTxt);
			this.findOkPos();
		}

		__proto.randomAPos=function(r){
			this._infoTxt.x=this.x+Laya.stage.width*Math.random();
			this._infoTxt.y=this.y+r *Math.random();
		}

		__proto.findOkPos=function(){
			var len=0;
			len=20;
			this.randomAPos(len);
			return;
			var count=0;
			count=1;
			while (!this.isPosOk()){
				count++;
				if (count >=500){
					len+=10;
					count=0;
				}
				this.randomAPos(len);
			}
		}

		__proto.isPosOk=function(){
			var tParent;
			tParent=NodeInfosItem.NodeInfoContainer.nodeRecInfoLayer;
			var i=0,len=0;
			var cList;
			cList=tParent._childs;
			len=cList.length;
			var tChild;
			var mRec;
			mRec=this._infoTxt.getBounds();
			if (mRec.x < 0)return false;
			if (mRec.y < 0)return false;
			if (mRec.right > Laya.stage.width)return false;
			for (i=0;i < len;i++){
				tChild=cList[i];
				if (tChild==this._infoTxt)continue ;
				if (mRec.intersects(tChild.getBounds()))return false;
			}
			return true;
		}

		__proto.showInfo=function(node){
			this._tar=node;
			if (!node)return;
			NodeInfosItem._txts.length=0;
			var i=0,len=0;
			var tKey;
			len=NodeInfosItem.showValues.length;
			if (node.name){
				NodeInfosItem._txts.push(ClassTool.getClassName(node)+"("+node.name+")");
				}else{
				NodeInfosItem._txts.push(ClassTool.getClassName(node));
			}
			for (i=0;i < len;i++){
				tKey=NodeInfosItem.showValues[i];
				NodeInfosItem._txts.push(tKey+":"+NodeInfosItem.getNodeValue(node,tKey));
			}
			this._infoTxt.text=NodeInfosItem._txts.join("\n");
			this.graphics.clear();
			var pointList;
			pointList=node._getBoundPointsM(true);
			if(!pointList||pointList.length<1)return;
			pointList=GrahamScan.pListToPointList(pointList,true);
			WalkTools.walkArr(pointList,node.localToGlobal,node);
			pointList=GrahamScan.pointListToPlist(pointList);
			NodeInfosItem._disBoundRec=Rectangle._getWrapRec(pointList,NodeInfosItem._disBoundRec);
			this.graphics.drawRect(0,0,NodeInfosItem._disBoundRec.width,NodeInfosItem._disBoundRec.height,null,"#00ffff");
			this.pos(NodeInfosItem._disBoundRec.x,NodeInfosItem._disBoundRec.y);
		}

		__proto.fresh=function(){
			this.showInfo(this._tar);
		}

		__proto.clearMe=function(){
			this._tar=null;
		}

		__proto.recover=function(){
			Pool.recover("NodeInfosItem",this);
		}

		NodeInfosItem.init=function(){
			if (!NodeInfosItem.NodeInfoContainer){
				DebugInfoLayer.init();
				NodeInfosItem.NodeInfoContainer=DebugInfoLayer.I;
				Laya.stage.addChild(NodeInfosItem.NodeInfoContainer);
			}
		}

		NodeInfosItem.getNodeInfoByNode=function(node){
			IDTools.idObj(node);
			var key=0;
			key=IDTools.getObjID(node);
			if (!NodeInfosItem._nodeInfoDic[key]){
				NodeInfosItem._nodeInfoDic[key]=new NodeInfosItem();
			}
			return NodeInfosItem._nodeInfoDic[key];
		}

		NodeInfosItem.hideAllInfos=function(){
			var key;
			var tInfo;
			for (key in NodeInfosItem._nodeInfoDic){
				tInfo=NodeInfosItem._nodeInfoDic[key];
				tInfo.removeSelf();
			}
			NodeInfosItem.clearRelations();
		}

		NodeInfosItem.showNodeInfo=function(node){
			var nodeInfo;
			nodeInfo=NodeInfosItem.getNodeInfoByNode(node);
			nodeInfo.showInfo(node);
			nodeInfo.showToUI();
		}

		NodeInfosItem.showDisInfos=function(node){
			var _node;
			_node=node;
			if (!node)
				return;
			while (node){
				NodeInfosItem.showNodeInfo(node);
				node=node.parent;
			}
			DisControlTool.setTop(NodeInfosItem.NodeInfoContainer);
			NodeInfosItem.apdtTxtInfoPoss(_node);
			NodeInfosItem.updateRelations();
		}

		NodeInfosItem.apdtTxtInfoPoss=function(node){
			var disList;
			disList=[];
			while (node){
				disList.push(node);
				node=node.parent;
			};
			var i=0,len=0;
			var tInfo;
			var tTxt;
			len=disList.length;
			var xPos=NaN;
			xPos=Laya.stage.width-150;
			var heightLen=0;
			heightLen=100;
			node=disList[0];
			if (node){
				tInfo=NodeInfosItem.getNodeInfoByNode(node);
				if (tInfo){
					tTxt=tInfo._infoTxt;
					xPos=Laya.stage.width-tTxt.width-10;
					heightLen=tTxt.height+10;
				}
			}
			disList=disList.reverse();
			for (i=0;i < len;i++){
				node=disList[i];
				tInfo=NodeInfosItem.getNodeInfoByNode(node);
				if (tInfo){
					tTxt=tInfo._infoTxt;
					tTxt.pos(xPos,heightLen *i);
				}
			}
		}

		NodeInfosItem.clearRelations=function(){
			var g;
			g=NodeInfosItem.NodeInfoContainer.lineLayer.graphics;
			g.clear();
		}

		NodeInfosItem.updateRelations=function(){
			var g;
			g=NodeInfosItem.NodeInfoContainer.lineLayer.graphics;
			g.clear();
			var key;
			var tInfo;
			for (key in NodeInfosItem._nodeInfoDic){
				tInfo=NodeInfosItem._nodeInfoDic[key];
				if (tInfo.parent){
					g.drawLine(tInfo.x,tInfo.y,tInfo._infoTxt.x,tInfo._infoTxt.y,"#0000ff");
				}
			}
		}

		NodeInfosItem.getNodeValue=function(node,key){
			var rst;
			NodeInfosItem._nodePoint.setTo(0,0);
			switch(key){
				case "x":
					rst=node["x"]+" (g:"+node.localToGlobal(NodeInfosItem._nodePoint).x+")"
					break ;
				case "y":
					rst=node["y"]+" (g:"+node.localToGlobal(NodeInfosItem._nodePoint).y+")"
					break ;
				default :
					rst=node[key];
				}
			return rst;
		}

		NodeInfosItem.NodeInfoContainer=null
		NodeInfosItem._nodeInfoDic={};
		NodeInfosItem._txts=[];
		__static(NodeInfosItem,
		['showValues',function(){return this.showValues=["x","y","scaleX","scaleY","width","height","visible","mouseEnabled"];},'_disBoundRec',function(){return this._disBoundRec=new Rectangle();},'_nodePoint',function(){return this._nodePoint=new Point();}
		]);
		return NodeInfosItem;
	})(Sprite)


	//class laya.debug.view.nodeInfo.recinfos.NodeRecInfo extends laya.display.Sprite
	var NodeRecInfo=(function(_super){
		function NodeRecInfo(){
			this.txt=null;
			this._tar=null;
			this.recColor="#00ff00";
			NodeRecInfo.__super.call(this);
			this.txt=new Text();
			this.txt.color="#ff0000";
			this.txt.bgColor="#00ff00";
			this.txt.fontSize=12;
			this.addChild(this.txt);
		}

		__class(NodeRecInfo,'laya.debug.view.nodeInfo.recinfos.NodeRecInfo',_super);
		var __proto=NodeRecInfo.prototype;
		__proto.setInfo=function(str){
			this.txt.text=str;
		}

		__proto.setTarget=function(tar){
			this._tar=tar;
		}

		__proto.showInfo=function(node){
			this._tar=node;
			if (!node)return;
			if(!node._$P)return;
			this.graphics.clear();
			var pointList;
			pointList=node._getBoundPointsM(true);
			if(!pointList||pointList.length<1)return;
			pointList=GrahamScan.pListToPointList(pointList,true);
			WalkTools.walkArr(pointList,node.localToGlobal,node);
			pointList=GrahamScan.pointListToPlist(pointList);
			NodeRecInfo._disBoundRec=Rectangle._getWrapRec(pointList,NodeRecInfo._disBoundRec);
			this.graphics.drawRect(0,0,NodeRecInfo._disBoundRec.width,NodeRecInfo._disBoundRec.height,null,DebugConsts.RECACHE_REC_COLOR,2);
			this.pos(NodeRecInfo._disBoundRec.x,NodeRecInfo._disBoundRec.y);
		}

		__proto.fresh=function(){
			this.showInfo(this._tar);
		}

		__proto.clearMe=function(){
			this._tar=null;
		}

		__static(NodeRecInfo,
		['_disBoundRec',function(){return this._disBoundRec=new Rectangle();}
		]);
		return NodeRecInfo;
	})(Sprite)


	//class laya.debug.view.nodeInfo.ToolPanel extends laya.display.Sprite
	var ToolPanel=(function(_super){
		function ToolPanel(){
			ToolPanel.__super.call(this);
			Base64AtlasManager.base64.preLoad(Handler.create(this,this.showToolBar));
			ContextMenu.init();
			DisResizer.init();
			var tipManager;
			tipManager=new TipManagerForDebug();
		}

		__class(ToolPanel,'laya.debug.view.nodeInfo.ToolPanel',_super);
		var __proto=ToolPanel.prototype;
		//Laya.timer.once(1000,this,showToolBar);
		__proto.showToolBar=function(){
			DebugPanelView.I.show();
		}

		__proto.createViews=function(){
			ToolPanel.typeClassDic["Find"]=FindView;
			ToolPanel.typeClassDic["Filter"]=FilterView;
			ToolPanel.typeClassDic["TxtInfo"]=TxtInfoView;
			ToolPanel.typeClassDic["Tree"]=NodeTreeView;
		}

		__proto.switchShow=function(type){
			var view;
			view=this.getView(type);
			if (view){
				view.switchShow();
			}
		}

		__proto.getView=function(type){
			var view;
			view=ToolPanel.viewDic[type];
			if (!view && ToolPanel.typeClassDic[type]){
				view=ToolPanel.viewDic[type]=new ToolPanel.typeClassDic[type]();
			}
			return view;
		}

		__proto.showTxtInfo=function(txt){
			OutPutView.I.showTxt(txt);
		}

		__proto.showNodeTree=function(node){
			NodeTree.I.setDis(node);
			DebugPanelView.I.switchToTree();
		}

		__proto.showSelectInStage=function(node){
			NodeTree.I.showSelectInStage(node);
			DebugPanelView.I.switchToTree();
		}

		__proto.showSelectItems=function(selectList){
			DebugPanelView.I.swichToSelect();
			SelectInfosView.I.setSelectList(selectList);
		}

		ToolPanel.init=function(){
			if (!ToolPanel.I)ToolPanel.I=new ToolPanel();
		}

		ToolPanel.I=null
		ToolPanel.viewDic={};
		ToolPanel.Find="Find";
		ToolPanel.Filter="Filter";
		ToolPanel.TxtInfo="TxtInfo";
		ToolPanel.Tree="Tree";
		__static(ToolPanel,
		['typeClassDic',function(){return this.typeClassDic={
		};}

		]);
		return ToolPanel;
	})(Sprite)


	//class laya.display.AnimationPlayerBase extends laya.display.Sprite
	var AnimationPlayerBase=(function(_super){
		function AnimationPlayerBase(){
			this.loop=false;
			this.wrapMode=0;
			this._index=0;
			this._count=0;
			this._isPlaying=false;
			this._labels=null;
			this._isReverse=false;
			this._frameRateChanged=false;
			this._controlNode=null;
			this._actionName=null;
			AnimationPlayerBase.__super.call(this);
			this._interval=Config.animationInterval;
			this._setUpNoticeType(0x1);
		}

		__class(AnimationPlayerBase,'laya.display.AnimationPlayerBase',_super);
		var __proto=AnimationPlayerBase.prototype;
		/**
		*<p>开始播放动画。play(...)方法被设计为在创建实例后的任何时候都可以被调用，当相应的资源加载完毕、调用动画帧填充方法(set frames)或者将实例显示在舞台上时，会判断是否正在播放中，如果是，则进行播放。</p>
		*<p>配合wrapMode属性，可设置动画播放顺序类型。</p>
		*@param start （可选）指定动画播放开始的索引(int)或帧标签(String)。帧标签可以通过addLabel(...)和removeLabel(...)进行添加和删除。
		*@param loop （可选）是否循环播放。
		*@param name （可选）动画名称。
		*/
		__proto.play=function(start,loop,name){
			(start===void 0)&& (start=0);
			(loop===void 0)&& (loop=true);
			(name===void 0)&& (name="");
			this._isPlaying=true;
			this.index=((typeof start=='string'))? this._getFrameByLabel(start):start;
			this.loop=loop;
			this._actionName=name;
			this._isReverse=this.wrapMode==1;
			if (this.interval > 0){
				this.timerLoop(this.interval,this,this._frameLoop,null,true);
			}
		}

		/**@private */
		__proto._getFrameByLabel=function(label){
			var i=0;
			for (i=0;i < this._count;i++){
				if (this._labels[i] && (this._labels [i]).indexOf(label)>=0)return i;
			}
			return 0;
		}

		/**@private */
		__proto._frameLoop=function(){
			if (this._isReverse){
				this._index--;
				if (this._index < 0){
					if (this.loop){
						if (this.wrapMode==2){
							this._index=this._count > 0 ? 1 :0;
							this._isReverse=false;
							}else {
							this._index=this._count-1;
						}
						this.event("complete");
						}else {
						this._index=0;
						this.stop();
						this.event("complete");
						return;
					}
				}
				}else {
				this._index++;
				if (this._index >=this._count){
					if (this.loop){
						if (this.wrapMode==2){
							this._index=this._count-2 >=0 ? this._count-2 :0;
							this._isReverse=true;
							}else {
							this._index=0;
						}
						this.event("complete");
						}else {
						this._index--;
						this.stop();
						this.event("complete");
						return;
					}
				}
			}
			this.index=this._index;
		}

		/**@private */
		__proto._setControlNode=function(node){
			if (this._controlNode){
				this._controlNode.off("display",this,this._checkResumePlaying);
				this._controlNode.off("undisplay",this,this._checkResumePlaying);
			}
			this._controlNode=node;
			if (node && node !=this){
				node.on("display",this,this._checkResumePlaying);
				node.on("undisplay",this,this._checkResumePlaying);
			}
		}

		/**@private */
		__proto._setDisplay=function(value){
			_super.prototype._setDisplay.call(this,value);
			this._checkResumePlaying();
		}

		/**@private */
		__proto._checkResumePlaying=function(){
			if (this._isPlaying){
				if (this._controlNode.displayedInStage)this.play(this._index,this.loop,this._actionName);
				else this.clearTimer(this,this._frameLoop);
			}
		}

		/**
		*停止动画播放。
		*/
		__proto.stop=function(){
			this._isPlaying=false;
			this.clearTimer(this,this._frameLoop);
		}

		/**
		*增加一个帧标签到指定索引的帧上。当动画播放到此索引的帧时会派发Event.LABEL事件，派发事件是在完成当前帧画面更新之后。
		*@param label 帧标签名称
		*@param index 帧索引
		*/
		__proto.addLabel=function(label,index){
			if (!this._labels)this._labels={};
			if (!this._labels[index])this._labels[index]=[];
			this._labels[index].push(label);
		}

		/**
		*删除指定的帧标签。
		*@param label 帧标签名称。注意：如果为空，则删除所有帧标签！
		*/
		__proto.removeLabel=function(label){
			if (!label)this._labels=null;
			else if (this._labels){
				for (var name in this._labels){
					this._removeLabelFromLabelList(this._labels[name],label);
				}
			}
		}

		/**@private */
		__proto._removeLabelFromLabelList=function(list,label){
			if (!list)return;
			for (var i=list.length-1;i >=0;i--){
				if (list[i]==label){
					list.splice(i,1);
				}
			}
		}

		/**
		*将动画切换到指定帧并停在那里。
		*@param position 帧索引或帧标签
		*/
		__proto.gotoAndStop=function(position){
			this.index=((typeof position=='string'))? this._getFrameByLabel(position):position;
			this.stop();
		}

		/**
		*@private
		*显示到某帧
		*@param value 帧索引
		*/
		__proto._displayToIndex=function(value){}
		/**
		*停止动画播放，并清理对象属性。之后可存入对象池，方便对象复用。
		*/
		__proto.clear=function(){
			this.stop();
			this._labels=null;
		}

		/**
		*<p>动画播放的帧间隔时间(单位：毫秒)。默认值依赖于Config.animationInterval=50，通过Config.animationInterval可以修改默认帧间隔时间。</p>
		*<p>要想为某动画设置独立的帧间隔时间，可以使用set interval，注意：如果动画正在播放，设置后会重置帧循环定时器的起始时间为当前时间，也就是说，如果频繁设置interval，会导致动画帧更新的时间间隔会比预想的要慢，甚至不更新。</p>
		*/
		__getset(0,__proto,'interval',function(){
			return this._interval;
			},function(value){
			if (this._interval !=value){
				this._frameRateChanged=true;
				this._interval=value;
				if (this._isPlaying && value > 0){
					this.timerLoop(value,this,this._frameLoop,null,true);
				}
			}
		});

		/**
		*是否正在播放中。
		*/
		__getset(0,__proto,'isPlaying',function(){
			return this._isPlaying;
		});

		/**
		*动画当前帧的索引。
		*/
		__getset(0,__proto,'index',function(){
			return this._index;
			},function(value){
			this._index=value;
			this._displayToIndex(value);
			if (this._labels && this._labels[value]){
				var tArr=this._labels[value];
				for (var i=0,len=tArr.length;i < len;i++){
					this.event("label",tArr[i]);
				}
			}
		});

		/**
		*当前动画中帧的总数。
		*/
		__getset(0,__proto,'count',function(){
			return this._count;
		});

		AnimationPlayerBase.WRAP_POSITIVE=0;
		AnimationPlayerBase.WRAP_REVERSE=1;
		AnimationPlayerBase.WRAP_PINGPONG=2;
		return AnimationPlayerBase;
	})(Sprite)


	//class laya.display.Stage extends laya.display.Sprite
	var Stage=(function(_super){
		function Stage(){
			this.focus=null;
			this.frameRate="fast";
			this.designWidth=0;
			this.designHeight=0;
			this.canvasRotation=false;
			this.canvasDegree=0;
			this.renderingEnabled=true;
			this.screenAdaptationEnabled=true;
			this._screenMode="none";
			this._scaleMode="noscale";
			this._alignV="top";
			this._alignH="left";
			this._bgColor="black";
			this._mouseMoveTime=0;
			this._renderCount=0;
			this._safariOffsetY=0;
			this._frameStartTime=NaN;
			this._isFocused=false;
			this._isVisibility=false;
			this._scenes=null;
			this._wgColor=null;
			Stage.__super.call(this);
			this.offset=new Point();
			this._canvasTransform=new Matrix();
			this._previousOrientation=Browser.window.orientation;
			var _$this=this;
			this.transform=Matrix.create();
			this._scenes=[];
			this.mouseEnabled=true;
			this.hitTestPrior=true;
			this.autoSize=false;
			this._displayedInStage=true;
			this._isFocused=true;
			this._isVisibility=true;
			var window=Browser.window;
			var _this=this;
			window.addEventListener("focus",function(){
				_$this._isFocused=true;
				_this.event("focus");
				_this.event("focuschange");
			});
			window.addEventListener("blur",function(){
				_$this._isFocused=false;
				_this.event("blur");
				_this.event("focuschange");
				if (_this._isInputting())Input["inputElement"].target.focus=false;
			});
			var hidden="hidden",state="visibilityState",visibilityChange="visibilitychange";
			var document=window.document;
			if (typeof document.hidden!=="undefined"){
				visibilityChange="visibilitychange";
				state="visibilityState";
				}else if (typeof document.mozHidden!=="undefined"){
				visibilityChange="mozvisibilitychange";
				state="mozVisibilityState";
				}else if (typeof document.msHidden!=="undefined"){
				visibilityChange="msvisibilitychange";
				state="msVisibilityState";
				}else if (typeof document.webkitHidden!=="undefined"){
				visibilityChange="webkitvisibilitychange";
				state="webkitVisibilityState";
			}
			window.document.addEventListener(visibilityChange,visibleChangeFun);
			function visibleChangeFun (){
				if (Browser.document[state]=="hidden"){
					_$this._isVisibility=false;
					if (_this._isInputting())Input["inputElement"].target.focus=false;
					}else {
					_$this._isVisibility=true;
				}
				_this.event("visibilitychange");
			}
			window.addEventListener("resize",function(){
				var orientation=Browser.window.orientation;
				if (orientation !=null && orientation !=_$this._previousOrientation && _this._isInputting()){
					Input["inputElement"].target.focus=false;
				}
				_$this._previousOrientation=orientation;
				if (_this._isInputting())return;
				if (Browser.onSafari)
					_this._safariOffsetY=(Browser.window.__innerHeight || Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight)-Browser.window.innerHeight;
				_this._resetCanvas();
			});
			window.addEventListener("orientationchange",function(e){
				_this._resetCanvas();
			});
			this.on("mousemove",this,this._onmouseMove);
			if (Browser.onMobile)this.on("mousedown",this,this._onmouseMove);
		}

		__class(Stage,'laya.display.Stage',_super);
		var __proto=Stage.prototype;
		/**
		*@private
		*在移动端输入时，输入法弹出期间不进行画布尺寸重置。
		*/
		__proto._isInputting=function(){
			return (Browser.onMobile && Input.isInputting);
		}

		/**@private */
		__proto._changeCanvasSize=function(){
			this.setScreenSize(Browser.clientWidth *Browser.pixelRatio,Browser.clientHeight *Browser.pixelRatio);
		}

		/**@private */
		__proto._resetCanvas=function(){
			if (!this.screenAdaptationEnabled)return;
			var canvas=Render._mainCanvas;
			var canvasStyle=canvas.source.style;
			Laya.timer.once(100,this,this._changeCanvasSize);
		}

		/**
		*设置屏幕大小，场景会根据屏幕大小进行适配。可以动态调用此方法，来更改游戏显示的大小。
		*@param screenWidth 屏幕宽度。
		*@param screenHeight 屏幕高度。
		*/
		__proto.setScreenSize=function(screenWidth,screenHeight){
			var rotation=false;
			if (this._screenMode!=="none"){
				var screenType=screenWidth / screenHeight < 1 ? "vertical" :"horizontal";
				rotation=screenType!==this._screenMode;
				if (rotation){
					var temp=screenHeight;
					screenHeight=screenWidth;
					screenWidth=temp;
				}
			}
			this.canvasRotation=rotation;
			var canvas=Render._mainCanvas;
			var canvasStyle=canvas.source.style;
			var mat=this._canvasTransform.identity();
			var scaleMode=this._scaleMode;
			var scaleX=screenWidth / this.designWidth;
			var scaleY=screenHeight / this.designHeight;
			var canvasWidth=this.designWidth;
			var canvasHeight=this.designHeight;
			var realWidth=screenWidth;
			var realHeight=screenHeight;
			var pixelRatio=Browser.pixelRatio;
			this._width=this.designWidth;
			this._height=this.designHeight;
			switch (scaleMode){
				case "noscale":
					scaleX=scaleY=1;
					realWidth=this.designWidth;
					realHeight=this.designHeight;
					break ;
				case "showall":
					scaleX=scaleY=Math.min(scaleX,scaleY);
					canvasWidth=realWidth=Math.round(this.designWidth *scaleX);
					canvasHeight=realHeight=Math.round(this.designHeight *scaleY);
					break ;
				case "noborder":
					scaleX=scaleY=Math.max(scaleX,scaleY);
					realWidth=Math.round(this.designWidth *scaleX);
					realHeight=Math.round(this.designHeight *scaleY);
					break ;
				case "full":
					scaleX=scaleY=1;
					this._width=canvasWidth=screenWidth;
					this._height=canvasHeight=screenHeight;
					break ;
				case "fixedwidth":
					scaleY=scaleX;
					this._height=canvasHeight=Math.round(screenHeight / scaleX);
					break ;
				case "fixedheight":
					scaleX=scaleY;
					this._width=canvasWidth=Math.round(screenWidth / scaleY);
					break ;
				case "fixedauto":
					if ((screenWidth / screenHeight)< (this.designWidth / this.designHeight)){
						scaleY=scaleX;
						this._height=canvasHeight=Math.round(screenHeight / scaleX);
						}else {
						scaleX=scaleY;
						this._width=canvasWidth=Math.round(screenWidth / scaleY);
					}
					break ;
				}
			scaleX *=this.scaleX;
			scaleY *=this.scaleY;
			if (scaleX===1 && scaleY===1){
				this.transform.identity();
				}else {
				this.transform.a=this._formatData(scaleX / (realWidth / canvasWidth));
				this.transform.d=this._formatData(scaleY / (realHeight / canvasHeight));
				this.conchModel && this.conchModel.scale(this.transform.a,this.transform.d);
			}
			canvas.size(canvasWidth,canvasHeight);
			RunDriver.changeWebGLSize(canvasWidth,canvasHeight);
			mat.scale(realWidth / canvasWidth / pixelRatio,realHeight / canvasHeight / pixelRatio);
			if (this._alignH==="left")this.offset.x=0;
			else if (this._alignH==="right")this.offset.x=screenWidth-realWidth;
			else this.offset.x=(screenWidth-realWidth)*0.5 / pixelRatio;
			if (this._alignV==="top")this.offset.y=0;
			else if (this._alignV==="bottom")this.offset.y=screenHeight-realHeight;
			else this.offset.y=(screenHeight-realHeight)*0.5 / pixelRatio;
			this.offset.x=Math.round(this.offset.x);
			this.offset.y=Math.round(this.offset.y);
			mat.translate(this.offset.x,this.offset.y);
			if (this._safariOffsetY)mat.translate(0,this._safariOffsetY);
			this.canvasDegree=0;
			if (rotation){
				if (this._screenMode==="horizontal"){
					mat.rotate(Math.PI / 2);
					mat.translate(screenHeight / pixelRatio,0);
					this.canvasDegree=90;
					}else {
					mat.rotate(-Math.PI / 2);
					mat.translate(0,screenWidth / pixelRatio);
					this.canvasDegree=-90;
				}
			}
			mat.a=this._formatData(mat.a);
			mat.d=this._formatData(mat.d);
			mat.tx=this._formatData(mat.tx);
			mat.ty=this._formatData(mat.ty);
			canvasStyle.transformOrigin=canvasStyle.webkitTransformOrigin=canvasStyle.msTransformOrigin=canvasStyle.mozTransformOrigin=canvasStyle.oTransformOrigin="0px 0px 0px";
			canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="matrix("+mat.toString()+")";
			if (this._safariOffsetY)mat.translate(0,-this._safariOffsetY);
			mat.translate(parseInt(canvasStyle.left)|| 0,parseInt(canvasStyle.top)|| 0);
			this.visible=true;
			this._repaint=1;
			this.event("resize");
		}

		/**@private */
		__proto._formatData=function(value){
			if (Math.abs(value)< 0.000001)return 0;
			if (Math.abs(1-value)< 0.001)return value > 0 ? 1 :-1;
			return value;
		}

		/**@inheritDoc */
		__proto.getMousePoint=function(){
			return Point.TEMP.setTo(this.mouseX,this.mouseY);
		}

		/**@inheritDoc */
		__proto.repaint=function(){
			this._repaint=1;
		}

		/**@inheritDoc */
		__proto.parentRepaint=function(){}
		/**@private */
		__proto._loop=function(){
			this.render(Render.context,0,0);
			return true;
		}

		/**@private */
		__proto._onmouseMove=function(e){
			this._mouseMoveTime=Browser.now();
		}

		/**
		*<p>获得距当前帧开始后，过了多少时间，单位为毫秒。</p>
		*<p>可以用来判断函数内时间消耗，通过合理控制每帧函数处理消耗时长，避免一帧做事情太多，对复杂计算分帧处理，能有效降低帧率波动。</p>
		*/
		__proto.getTimeFromFrameStart=function(){
			return Browser.now()-this._frameStartTime;
		}

		/**@inheritDoc */
		__proto.render=function(context,x,y){
			if (this.frameRate==="sleep"){
				var now=Browser.now();
				if (now-this._frameStartTime >=1000)this._frameStartTime=now;
				else return;
			}
			this._renderCount++;
			Render.isFlash && this.repaint();
			if (!this._style.visible){
				if (this._renderCount % 5===0){
					Stat.loopCount++;
					MouseManager.instance.runEvent();
					Laya.timer._update();
				}
				return;
			}
			this._frameStartTime=Browser.now();
			var frameMode=this.frameRate==="mouse" ? (((this._frameStartTime-this._mouseMoveTime)< 2000)? "fast" :"slow"):this.frameRate;
			var isFastMode=(frameMode!=="slow");
			var isDoubleLoop=(this._renderCount % 2===0);
			Stat.renderSlow=!isFastMode;
			if (isFastMode || isDoubleLoop){
				Stat.loopCount++;
				MouseManager.instance.runEvent();
				Laya.timer._update();
				var scene;
				var i=0,n=0;
				if (Render.isConchNode){
					for (i=0,n=this._scenes.length;i < n;i++){
						scene=this._scenes[i];
						(scene)&& (scene._updateSceneConch());
					}
					}else {
					for (i=0,n=this._scenes.length;i < n;i++){
						scene=this._scenes[i];
						(scene)&& (scene._updateScene());
					}
				}
				if (Render.isConchNode){
					var customList=Sprite["CustomList"];
					for (i=0,n=customList.length;i < n;i++){
						var customItem=customList[i];
						customItem.customRender(customItem.customContext,0,0);
					}
					return;
				}
				if (Render.isWebGL && this.renderingEnabled){
					context.clear();
					_super.prototype.render.call(this,context,x,y);
				}
			}
			if (Render.isConchNode)return;
			if (this.renderingEnabled && (isFastMode || !isDoubleLoop)){
				if (Render.isWebGL){
					RunDriver.clear(this._bgColor);
					RunDriver.beginFlush();
					context.flush();
					RunDriver.endFinish();
					VectorGraphManager.instance && VectorGraphManager.getInstance().endDispose();
					}else {
					RunDriver.clear(this._bgColor);
					_super.prototype.render.call(this,context,x,y);
				}
			}
		}

		/**@private */
		__proto._requestFullscreen=function(){
			var element=Browser.document.documentElement;
			if (element.requestFullscreen){
				element.requestFullscreen();
				}else if (element.mozRequestFullScreen){
				element.mozRequestFullScreen();
				}else if (element.webkitRequestFullscreen){
				element.webkitRequestFullscreen();
				}else if (element.msRequestFullscreen){
				element.msRequestFullscreen();
			}
		}

		/**@private */
		__proto._fullScreenChanged=function(){
			Laya.stage.event("fullscreenchange");
		}

		/**退出全屏模式*/
		__proto.exitFullscreen=function(){
			var document=Browser.document;
			if (document.exitFullscreen){
				document.exitFullscreen();
				}else if (document.mozCancelFullScreen){
				document.mozCancelFullScreen();
				}else if (document.webkitExitFullscreen){
				document.webkitExitFullscreen();
			}
		}

		/**当前视窗由缩放模式导致的 Y 轴缩放系数。*/
		__getset(0,__proto,'clientScaleY',function(){
			return this._transform ? this._transform.getScaleY():1;
		});

		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			this.designWidth=value;
			_super.prototype._$set_width.call(this,value);
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*舞台是否获得焦点。
		*/
		__getset(0,__proto,'isFocused',function(){
			return this._isFocused;
		});

		/**
		*<p>水平对齐方式。默认值为"left"。</p>
		*<p><ul>取值范围：
		*<li>"left" ：居左对齐；</li>
		*<li>"center" ：居中对齐；</li>
		*<li>"right" ：居右对齐；</li>
		*</ul></p>
		*/
		__getset(0,__proto,'alignH',function(){
			return this._alignH;
			},function(value){
			this._alignH=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			this.designHeight=value;
			_super.prototype._$set_height.call(this,value);
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		__getset(0,__proto,'transform',function(){
			if (this._tfChanged)this._adjustTransform();
			return this._transform=this._transform|| Matrix.create();
		},_super.prototype._$set_transform);

		/**
		*舞台是否处于可见状态(是否进入后台)。
		*/
		__getset(0,__proto,'isVisibility',function(){
			return this._isVisibility;
		});

		//[Deprecated]
		__getset(0,__proto,'desginWidth',function(){
			console.debug("desginWidth已经弃用，请使用designWidth代替");
			return this.designWidth;
		});

		/**当前视窗由缩放模式导致的 X 轴缩放系数。*/
		__getset(0,__proto,'clientScaleX',function(){
			return this._transform ? this._transform.getScaleX():1;
		});

		//[Deprecated]
		__getset(0,__proto,'desginHeight',function(){
			console.debug("desginHeight已经弃用，请使用designHeight代替");
			return this.designHeight;
		});

		/**
		*<p>缩放模式。默认值为 "noscale"。</p>
		*<p><ul>取值范围：
		*<li>"noscale" ：不缩放；</li>
		*<li>"exactfit" ：全屏不等比缩放；</li>
		*<li>"showall" ：最小比例缩放；</li>
		*<li>"noborder" ：最大比例缩放；</li>
		*<li>"full" ：不缩放，stage的宽高等于屏幕宽高；</li>
		*<li>"fixedwidth" ：宽度不变，高度根据屏幕比缩放；</li>
		*<li>"fixedheight" ：高度不变，宽度根据屏幕比缩放；</li>
		*<li>"fixedauto" ：根据宽高比，自动选择使用fixedwidth或fixedheight；</li>
		*</ul></p>
		*/
		__getset(0,__proto,'scaleMode',function(){
			return this._scaleMode;
			},function(value){
			this._scaleMode=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*<p>垂直对齐方式。默认值为"top"。</p>
		*<p><ul>取值范围：
		*<li>"top" ：居顶部对齐；</li>
		*<li>"middle" ：居中对齐；</li>
		*<li>"bottom" ：居底部对齐；</li>
		*</ul></p>
		*/
		__getset(0,__proto,'alignV',function(){
			return this._alignV;
			},function(value){
			this._alignV=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**舞台的背景颜色，默认为黑色，null为透明。*/
		__getset(0,__proto,'bgColor',function(){
			return this._bgColor;
			},function(value){
			this._bgColor=value;
			this.conchModel && this.conchModel.bgColor(value);
			if (Render.isWebGL){
				if (value && value!=="black" && value!=="#000000"){
					this._wgColor=Color.create(value)._color;
					}else {
					this._wgColor=null;
				}
			}
			if (value){
				Render.canvas.style.background=value;
				}else {
				Render.canvas.style.background="none";
			}
		});

		/**鼠标在 Stage 上的 X 轴坐标。*/
		__getset(0,__proto,'mouseX',function(){
			return Math.round(MouseManager.instance.mouseX / this.clientScaleX);
		});

		/**鼠标在 Stage 上的 Y 轴坐标。*/
		__getset(0,__proto,'mouseY',function(){
			return Math.round(MouseManager.instance.mouseY / this.clientScaleY);
		});

		/**
		*<p>场景布局类型。</p>
		*<p><ul>取值范围：
		*<li>"none" ：不更改屏幕</li>
		*<li>"horizontal" ：自动横屏</li>
		*<li>"vertical" ：自动竖屏</li>
		*</ul></p>
		*/
		__getset(0,__proto,'screenMode',function(){
			return this._screenMode;
			},function(value){
			this._screenMode=value;
		});

		__getset(0,__proto,'visible',_super.prototype._$get_visible,function(value){
			if (this.visible!==value){
				_super.prototype._$set_visible.call(this,value);
				var style=Render._mainCanvas.source.style;
				style.visibility=value ? "visible" :"hidden";
			}
		});

		/**
		*<p>是否开启全屏，用户点击后进入全屏。</p>
		*<p>兼容性提示：部分浏览器不允许点击进入全屏，比如Iphone等。</p>
		*/
		__getset(0,__proto,'fullScreenEnabled',null,function(value){
			var document=Browser.document;
			var canvas=Render.canvas;
			if (value){
				canvas.addEventListener('mousedown',this._requestFullscreen);
				canvas.addEventListener('touchstart',this._requestFullscreen);
				document.addEventListener("fullscreenchange",this._fullScreenChanged);
				document.addEventListener("mozfullscreenchange",this._fullScreenChanged);
				document.addEventListener("webkitfullscreenchange",this._fullScreenChanged);
				document.addEventListener("msfullscreenchange",this._fullScreenChanged);
				}else {
				canvas.removeEventListener('mousedown',this._requestFullscreen);
				canvas.removeEventListener('touchstart',this._requestFullscreen);
				document.removeEventListener("fullscreenchange",this._fullScreenChanged);
				document.removeEventListener("mozfullscreenchange",this._fullScreenChanged);
				document.removeEventListener("webkitfullscreenchange",this._fullScreenChanged);
				document.removeEventListener("msfullscreenchange",this._fullScreenChanged);
			}
		});

		Stage.SCALE_NOSCALE="noscale";
		Stage.SCALE_EXACTFIT="exactfit";
		Stage.SCALE_SHOWALL="showall";
		Stage.SCALE_NOBORDER="noborder";
		Stage.SCALE_FULL="full";
		Stage.SCALE_FIXED_WIDTH="fixedwidth";
		Stage.SCALE_FIXED_HEIGHT="fixedheight";
		Stage.SCALE_FIXED_AUTO="fixedauto";
		Stage.ALIGN_LEFT="left";
		Stage.ALIGN_RIGHT="right";
		Stage.ALIGN_CENTER="center";
		Stage.ALIGN_TOP="top";
		Stage.ALIGN_MIDDLE="middle";
		Stage.ALIGN_BOTTOM="bottom";
		Stage.SCREEN_NONE="none";
		Stage.SCREEN_HORIZONTAL="horizontal";
		Stage.SCREEN_VERTICAL="vertical";
		Stage.FRAME_FAST="fast";
		Stage.FRAME_SLOW="slow";
		Stage.FRAME_MOUSE="mouse";
		Stage.FRAME_SLEEP="sleep";
		return Stage;
	})(Sprite)


	//class laya.ui.DialogManager extends laya.display.Sprite
	var DialogManager=(function(_super){
		function DialogManager(){
			this.lockLayer=null;
			this.popupEffect=function(dialog){
				dialog.scale(1,1);
				Tween.from(dialog,{x:Laya.stage.width / 2,y:Laya.stage.height / 2,scaleX:0,scaleY:0},300,Ease.backOut,Handler.create(this,this.doOpen,[dialog]));
			}
			this.closeEffect=function(dialog,type){
				Tween.to(dialog,{x:Laya.stage.width / 2,y:Laya.stage.height / 2,scaleX:0,scaleY:0},300,Ease.strongOut,Handler.create(this,this.doClose,[dialog,type]));
			}
			DialogManager.__super.call(this);
			this.maskLayer=new Sprite();
			this.popupEffectHandler=new Handler(this,this.popupEffect);
			this.closeEffectHandler=new Handler(this,this.closeEffect);
			this.mouseEnabled=this.maskLayer.mouseEnabled=true;
			this.zOrder=1000;
			Laya.stage.addChild(this);
			Laya.stage.on("resize",this,this._onResize);
			if (UIConfig.closeDialogOnSide)this.maskLayer.on("click",this,this._closeOnSide);
			this._onResize(null);
		}

		__class(DialogManager,'laya.ui.DialogManager',_super);
		var __proto=DialogManager.prototype;
		__proto._closeOnSide=function(){
			var dialog=this.getChildAt(this.numChildren-1);
			if ((dialog instanceof laya.ui.Dialog ))dialog.close("side");
		}

		/**设置锁定界面，如果为空则什么都不显示*/
		__proto.setLockView=function(value){
			if (!this.lockLayer){
				this.lockLayer=new Box();
				this.lockLayer.mouseEnabled=true;
				this.lockLayer.size(Laya.stage.width,Laya.stage.height);
			}
			this.lockLayer.removeChildren();
			if (value){
				value.centerX=value.centerY=0;
				this.lockLayer.addChild(value);
			}
		}

		/**@private */
		__proto._onResize=function(e){
			var width=this.maskLayer.width=Laya.stage.width;
			var height=this.maskLayer.height=Laya.stage.height;
			if (this.lockLayer)this.lockLayer.size(width,height);
			this.maskLayer.graphics.clear();
			this.maskLayer.graphics.drawRect(0,0,width,height,UIConfig.popupBgColor);
			this.maskLayer.alpha=UIConfig.popupBgAlpha;
			for (var i=this.numChildren-1;i >-1;i--){
				var item=this.getChildAt(i);
				if (item.popupCenter)this._centerDialog(item);
			}
		}

		__proto._centerDialog=function(dialog){
			dialog.x=Math.round(((Laya.stage.width-dialog.width)>> 1)+dialog.pivotX);
			dialog.y=Math.round(((Laya.stage.height-dialog.height)>> 1)+dialog.pivotY);
		}

		/**
		*显示对话框(非模式窗口类型)。
		*@param dialog 需要显示的对象框 <code>Dialog</code> 实例。
		*@param closeOther 是否关闭其它对话框，若值为ture，则关闭其它的对话框。
		*/
		__proto.open=function(dialog,closeOther){
			(closeOther===void 0)&& (closeOther=false);
			if (closeOther)this.removeChildren();
			if (dialog.popupCenter)this._centerDialog(dialog);
			this.addChild(dialog);
			if (dialog.isModal || this._$P["hasZorder"])this.timer.callLater(this,this._checkMask);
			if (dialog.popupEffect !=null)dialog.popupEffect.runWith(dialog);
			else this.doOpen(dialog);
			this.event("open");
		}

		/**
		*执行打开对话框。
		*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
		*@param type 关闭的类型，默认为空
		*/
		__proto.doOpen=function(dialog){
			dialog.onOpened();
		}

		/**
		*锁定所有层，显示加载条信息，防止双击
		*/
		__proto.lock=function(value){
			if (this.lockLayer){
				if (value)this.addChild(this.lockLayer);
				else this.lockLayer.removeSelf();
			}
		}

		/**
		*关闭对话框。
		*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
		*@param type 关闭的类型，默认为空
		*/
		__proto.close=function(dialog,type){
			if (dialog.closeEffect !=null)dialog.closeEffect.runWith([dialog,type]);
			else this.doClose(dialog,type);
			this.event("close");
		}

		/**
		*执行关闭对话框。
		*@param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
		*@param type 关闭的类型，默认为空
		*/
		__proto.doClose=function(dialog,type){
			dialog.removeSelf();
			dialog.isModal && this._checkMask();
			dialog.closeHandler && dialog.closeHandler.runWith(type);
			dialog.onClosed(type);
		}

		/**
		*关闭所有的对话框。
		*/
		__proto.closeAll=function(){
			this.removeChildren();
			this.event("close");
		}

		/**
		*根据组获取所有对话框
		*@param group 组名称
		*@return 对话框数组
		*/
		__proto.getDialogsByGroup=function(group){
			var arr=[];
			for (var i=this.numChildren-1;i >-1;i--){
				var item=this.getChildAt(i);
				if (item.group===group){
					arr.push(item);
				}
			}
			return arr;
		}

		/**
		*根据组关闭所有弹出框
		*@param group 需要关闭的组名称
		*@return 需要关闭的对话框数组
		*/
		__proto.closeByGroup=function(group){
			var arr=[];
			for (var i=this.numChildren-1;i >-1;i--){
				var item=this.getChildAt(i);
				if (item.group===group){
					item.close();
					arr.push(item);
				}
			}
			return arr;
		}

		/**@private 发生层次改变后，重新检查遮罩层是否正确*/
		__proto._checkMask=function(){
			this.maskLayer.removeSelf();
			for (var i=this.numChildren-1;i >-1;i--){
				var dialog=this.getChildAt(i);
				if (dialog && dialog.isModal){
					this.addChildAt(this.maskLayer,i);
					return;
				}
			}
		}

		return DialogManager;
	})(Sprite)


	//class laya.resource.FileBitmap extends laya.resource.Bitmap
	var FileBitmap=(function(_super){
		function FileBitmap(){
			this._src=null;
			this._onload=null;
			this._onerror=null;
			FileBitmap.__super.call(this);
		}

		__class(FileBitmap,'laya.resource.FileBitmap',_super);
		var __proto=FileBitmap.prototype;
		/**
		*文件路径全名。
		*/
		__getset(0,__proto,'src',function(){
			return this._src;
			},function(value){
			this._src=value;
		});

		/**
		*载入完成处理函数。
		*/
		__getset(0,__proto,'onload',null,function(value){
		});

		/**
		*错误处理函数。
		*/
		__getset(0,__proto,'onerror',null,function(value){
		});

		return FileBitmap;
	})(Bitmap)


	//class laya.resource.HTMLCanvas extends laya.resource.Bitmap
	var HTMLCanvas=(function(_super){
		function HTMLCanvas(type){
			//this._ctx=null;
			this._is2D=false;
			HTMLCanvas.__super.call(this);
			var _$this=this;
			this._source=this;
			if (type==="2D" || (type==="AUTO" && !Render.isWebGL)){
				this._is2D=true;
				this._source=Browser.createElement("canvas");
				var o=this;
				o.getContext=function (contextID,other){
					if (_$this._ctx)return _$this._ctx;
					var ctx=_$this._ctx=_$this._source.getContext(contextID,other);
					if (ctx){
						ctx._canvas=o;
						if(!Render.isFlash)ctx.size=function (w,h){
						};
					}
					return ctx;
				}
			}
		}

		__class(HTMLCanvas,'laya.resource.HTMLCanvas',_super);
		var __proto=HTMLCanvas.prototype;
		/**
		*清空画布内容。
		*/
		__proto.clear=function(){
			this._ctx && this._ctx.clear();
		}

		/**
		*销毁。
		*/
		__proto.destroy=function(){
			this._ctx && this._ctx.destroy();
			this._ctx=null;
		}

		/**
		*释放。
		*/
		__proto.release=function(){}
		/**
		*@private
		*设置 Canvas 渲染上下文。
		*@param context Canvas 渲染上下文。
		*/
		__proto._setContext=function(context){
			this._ctx=context;
		}

		/**
		*获取 Canvas 渲染上下文。
		*@param contextID 上下文ID.
		*@param other
		*@return Canvas 渲染上下文 Context 对象。
		*/
		__proto.getContext=function(contextID,other){
			return this._ctx ? this._ctx :(this._ctx=HTMLCanvas._createContext(this));
		}

		/**
		*获取内存大小。
		*@return 内存大小。
		*/
		__proto.getMemSize=function(){
			return 0;
		}

		/**
		*设置宽高。
		*@param w 宽度。
		*@param h 高度。
		*/
		__proto.size=function(w,h){
			if (this._w !=w || this._h !=h){
				this._w=w;
				this._h=h;
				this.memorySize=this._w *this._h *4;
				this._ctx && this._ctx.size(w,h);
				this._source && (this._source.height=h,this._source.width=w);
			}
		}

		__proto.getCanvas=function(){
			return this._source;
		}

		/**
		*Canvas 渲染上下文。
		*/
		__getset(0,__proto,'context',function(){
			return this._ctx;
		});

		/**
		*是否当作 Bitmap 对象。
		*/
		__getset(0,__proto,'asBitmap',null,function(value){
		});

		HTMLCanvas.create=function(type){
			return new HTMLCanvas(type);
		}

		HTMLCanvas.TYPE2D="2D";
		HTMLCanvas.TYPE3D="3D";
		HTMLCanvas.TYPEAUTO="AUTO";
		HTMLCanvas._createContext=null
		return HTMLCanvas;
	})(Bitmap)


	//class laya.ui.Box extends laya.ui.Component
	var Box=(function(_super){
		function Box(){Box.__super.call(this);;
		};

		__class(Box,'laya.ui.Box',_super);
		var __proto=Box.prototype;
		Laya.imps(__proto,{"laya.ui.IBox":true})
		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			for (var name in value){
				var comp=this.getChildByName(name);
				if (comp)comp.dataSource=value[name];
				else if (this.hasOwnProperty(name)&& !((typeof (this[name])=='function')))this[name]=value[name];
			}
		});

		return Box;
	})(Component)


	//class laya.debug.tools.resizer.AutoFillRec extends laya.ui.Component
	var AutoFillRec=(function(_super){
		function AutoFillRec(type){
			this.type=0;
			this.preX=NaN;
			this.preY=NaN;
			AutoFillRec.__super.call(this);
		}

		__class(AutoFillRec,'laya.debug.tools.resizer.AutoFillRec',_super);
		var __proto=AutoFillRec.prototype;
		//super(type);
		__proto.changeSize=function(){
			_super.prototype.changeSize.call(this);
			var g=this.graphics;
			g.clear();
			g.drawRect(0,0,this.width,this.height,"#33c5f5");
		}

		__proto.record=function(){
			this.preX=this.x;
			this.preY=this.y;
		}

		__proto.getDx=function(){
			return this.x-this.preX;
		}

		__proto.getDy=function(){
			return this.y-this.preY;
		}

		return AutoFillRec;
	})(Component)


	//class laya.debug.tools.TipManagerForDebug extends laya.ui.Component
	var TipManagerForDebug=(function(_super){
		function TipManagerForDebug(){
			this._tipBox=null;
			this._tipText=null;
			this._defaultTipHandler=null;
			TipManagerForDebug.__super.call(this);
			this._tipBox=new Component();
			this._tipBox.addChild(this._tipText=new Text());
			this._tipText.x=this._tipText.y=5;
			this._tipText.color=TipManagerForDebug.tipTextColor;
			this._defaultTipHandler=this.showDefaultTip;
			Laya.stage.on("showtip",this,this.onStageShowTip);
			Laya.stage.on("hidetip",this,this.onStageHideTip);
		}

		__class(TipManagerForDebug,'laya.debug.tools.TipManagerForDebug',_super);
		var __proto=TipManagerForDebug.prototype;
		__proto.onStageHideTip=function(e){
			Laya.timer.clear(this,this.showTip);
			this.closeAll();
			this.removeSelf();
		}

		__proto.onStageShowTip=function(data){
			Laya.timer.once(TipManagerForDebug.tipDelay,this,this.showTip,[data],true);
		}

		__proto.showTip=function(tip){
			if ((typeof tip=='string')){
				var text=String(tip);
				if (Boolean(text)){
					this._defaultTipHandler(text);
				}
				}else if ((tip instanceof laya.utils.Handler )){
				(tip).run();
				}else if ((typeof tip=='function')){
				(tip).apply();
			}
			if (true){
				Laya.stage.on("mousemove",this,this.onStageMouseMove);
				Laya.stage.on("mousedown",this,this.onStageMouseDown);
			}
			this.onStageMouseMove(null);
		}

		__proto.onStageMouseDown=function(e){
			this.closeAll();
		}

		__proto.onStageMouseMove=function(e){
			this.showToStage(this,TipManagerForDebug.offsetX,TipManagerForDebug.offsetY);
		}

		__proto.showToStage=function(dis,offX,offY){
			(offX===void 0)&& (offX=0);
			(offY===void 0)&& (offY=0);
			var rec=dis.getBounds();
			dis.x=Laya.stage.mouseX+offX;
			dis.y=Laya.stage.mouseY+offY;
			if (dis.x+rec.width > Laya.stage.width){
				dis.x-=rec.width+offX;
			}
			if (dis.y+rec.height > Laya.stage.height){
				dis.y-=rec.height+offY;
			}
		}

		/**关闭所有鼠标提示*/
		__proto.closeAll=function(){
			Laya.timer.clear(this,this.showTip);
			Laya.stage.off("mousemove",this,this.onStageMouseMove);
			Laya.stage.off("mousedown",this,this.onStageMouseDown);
			this.removeChildren();
		}

		__proto.showDisTip=function(tip){
			this.addChild(tip);
			this.showToStage(this);
			Laya.stage.addChild(this);
		}

		__proto.showDefaultTip=function(text){
			this._tipText.text=text;
			var g=this._tipBox.graphics;
			g.clear();
			g.drawRect(0,0,this._tipText.width+10,this._tipText.height+10,TipManagerForDebug.tipBackColor);
			this.addChild(this._tipBox);
			this.showToStage(this);
			Laya.stage.addChild(this);
		}

		/**默认鼠标提示函数*/
		__getset(0,__proto,'defaultTipHandler',function(){
			return this._defaultTipHandler;
			},function(value){
			this._defaultTipHandler=value;
		});

		TipManagerForDebug.offsetX=10;
		TipManagerForDebug.offsetY=15;
		TipManagerForDebug.tipTextColor="#ffffff";
		TipManagerForDebug.tipBackColor="#111111";
		TipManagerForDebug.tipDelay=200;
		return TipManagerForDebug;
	})(Component)


	//class laya.ui.Button extends laya.ui.Component
	var Button=(function(_super){
		function Button(skin,label){
			this.toggle=false;
			this._bitmap=null;
			this._text=null;
			this._strokeColors=null;
			this._state=0;
			this._selected=false;
			this._skin=null;
			this._autoSize=true;
			this._sources=null;
			this._clickHandler=null;
			this._stateChanged=false;
			Button.__super.call(this);
			this._labelColors=Styles.buttonLabelColors;
			this._stateNum=Styles.buttonStateNum;
			(label===void 0)&& (label="");
			this.skin=skin;
			this.label=label;
		}

		__class(Button,'laya.ui.Button',_super);
		var __proto=Button.prototype;
		Laya.imps(__proto,{"laya.ui.ISelect":true})
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._bitmap && this._bitmap.destroy();
			this._text && this._text.destroy(destroyChild);
			this._bitmap=null;
			this._text=null;
			this._clickHandler=null;
			this._labelColors=this._sources=this._strokeColors=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.graphics=this._bitmap=new AutoBitmap();
		}

		/**@private */
		__proto.createText=function(){
			if (!this._text){
				this._text=new Text();
				this._text.overflow=Text.HIDDEN;
				this._text.align="center";
				this._text.valign="middle";
				this._text.width=this._width;
				this._text.height=this._height;
			}
		}

		/**@inheritDoc */
		__proto.initialize=function(){
			if (this._mouseEnableState!==1){
				this.mouseEnabled=true;
				this._setBit(0x2,true);
			}
			this._createListener("mouseover",this,this.onMouse,null,false,false);
			this._createListener("mouseout",this,this.onMouse,null,false,false);
			this._createListener("mousedown",this,this.onMouse,null,false,false);
			this._createListener("mouseup",this,this.onMouse,null,false,false);
			this._createListener("click",this,this.onMouse,null,false,false);
		}

		/**
		*对象的 <code>Event.MOUSE_OVER、Event.MOUSE_OUT、Event.MOUSE_DOWN、Event.MOUSE_UP、Event.CLICK</code> 事件侦听处理函数。
		*@param e Event 对象。
		*/
		__proto.onMouse=function(e){
			if (this.toggle===false && this._selected)return;
			if (e.type==="click"){
				this.toggle && (this.selected=!this._selected);
				this._clickHandler && this._clickHandler.run();
				return;
			}
			!this._selected && (this.state=Button.stateMap[e.type]);
		}

		/**
		*@private
		*对象的资源切片发生改变。
		*/
		__proto.changeClips=function(){
			var img=Loader.getRes(this._skin);
			if (!img){
				console.log("lose skin",this._skin);
				return;
			};
			var width=img.sourceWidth;
			var height=img.sourceHeight / this._stateNum;
			img.$_GID || (img.$_GID=Utils.getGID());
			var key=img.$_GID+"-"+this._stateNum;
			var clips=AutoBitmap.getCache(key);
			if (clips)this._sources=clips;
			else {
				this._sources=[];
				if (this._stateNum===1){
					this._sources.push(img);
					}else {
					for (var i=0;i < this._stateNum;i++){
						this._sources.push(Texture.createFromTexture(img,0,height *i,width,height));
					}
				}
				AutoBitmap.setCache(key,this._sources);
			}
			if (this._autoSize){
				this._bitmap.width=this._width || width;
				this._bitmap.height=this._height || height;
				if (this._text){
					this._text.width=this._bitmap.width;
					this._text.height=this._bitmap.height;
				}
				}else {
				this._text && (this._text.x=width);
			}
		}

		/**
		*@private
		*改变对象的状态。
		*/
		__proto.changeState=function(){
			this._stateChanged=false;
			this.runCallLater(this.changeClips);
			var index=this._state < this._stateNum ? this._state :this._stateNum-1;
			this._sources && (this._bitmap.source=this._sources[index]);
			if (this.label){
				this._text.color=this._labelColors[index];
				if (this._strokeColors)this._text.strokeColor=this._strokeColors[index];
			}
		}

		/**@private */
		__proto._setStateChanged=function(){
			if (!this._stateChanged){
				this._stateChanged=true;
				this.callLater(this.changeState);
			}
		}

		/**
		*<p>描边颜色，以字符串表示。</p>
		*默认值为 "#000000"（黑色）;
		*@see laya.display.Text.strokeColor()
		*/
		__getset(0,__proto,'labelStrokeColor',function(){
			this.createText();
			return this._text.strokeColor;
			},function(value){
			this.createText();
			this._text.strokeColor=value
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'measureHeight',function(){
			this.runCallLater(this.changeClips);
			return this._text ? Math.max(this._bitmap.height,this._text.height):this._bitmap.height;
		});

		/**
		*<p>对象的皮肤资源地址。</p>
		*支持单态，两态和三态，用 <code>stateNum</code> 属性设置
		*<p>对象的皮肤地址，以字符串表示。</p>
		*@see #stateNum
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				this.callLater(this.changeClips);
				this._setStateChanged();
			}
		});

		/**
		*对象的状态值。
		*@see #stateMap
		*/
		__getset(0,__proto,'state',function(){
			return this._state;
			},function(value){
			if (this._state !=value){
				this._state=value;
				this._setStateChanged();
			}
		});

		/**
		*按钮文本标签 <code>Text</code> 控件。
		*/
		__getset(0,__proto,'text',function(){
			this.createText();
			return this._text;
		});

		/**
		*<p>指定对象的状态值，以数字表示。</p>
		*<p>默认值为3。此值决定皮肤资源图片的切割方式。</p>
		*<p><b>取值：</b>
		*<li>1：单态。图片不做切割，按钮的皮肤状态只有一种。</li>
		*<li>2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为
		*弹起状态皮肤、
		*按下和经过及选中状态皮肤。</li>
		*<li>3：三态。图片将以竖直方向被等比切割为3部分，从上向下，依次为
		*弹起状态皮肤、
		*经过状态皮肤、
		*按下和选中状态皮肤</li>
		*</p>
		*/
		__getset(0,__proto,'stateNum',function(){
			return this._stateNum;
			},function(value){
			if (this._stateNum !=value){
				this._stateNum=value < 1 ? 1 :value > 3 ? 3 :value;
				this.callLater(this.changeClips);
			}
		});

		/**
		*表示按钮各个状态下的描边颜色。
		*<p><b>格式:</b> "upColor,overColor,downColor,disableColor"。</p>
		*/
		__getset(0,__proto,'strokeColors',function(){
			return this._strokeColors ? this._strokeColors.join(","):"";
			},function(value){
			this._strokeColors=UIUtils.fillArray(Styles.buttonLabelColors,value,String);
			this._setStateChanged();
		});

		/**
		*表示按钮各个状态下的文本颜色。
		*<p><b>格式:</b> "upColor,overColor,downColor,disableColor"。</p>
		*/
		__getset(0,__proto,'labelColors',function(){
			return this._labelColors.join(",");
			},function(value){
			this._labelColors=UIUtils.fillArray(Styles.buttonLabelColors,value,String);
			this._setStateChanged();
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'measureWidth',function(){
			this.runCallLater(this.changeClips);
			if (this._autoSize)return this._bitmap.width;
			this.runCallLater(this.changeState);
			return this._bitmap.width+(this._text ? this._text.width :0);
		});

		/**
		*按钮的文本内容。
		*/
		__getset(0,__proto,'label',function(){
			return this._text ? this._text.text :null;
			},function(value){
			if (!this._text && !value)return;
			this.createText();
			if (this._text.text !=value){
				value && !this._text.parent && this.addChild(this._text);
				this._text.text=(value+"").replace(/\\n/g,"\n");
				this._setStateChanged();
			}
		});

		/**
		*表示按钮的选中状态。
		*<p>如果值为true，表示该对象处于选中状态。否则该对象处于未选中状态。</p>
		*/
		__getset(0,__proto,'selected',function(){
			return this._selected;
			},function(value){
			if (this._selected !=value){
				this._selected=value;
				this.state=this._selected ? 2 :0;
				this.event("change");
			}
		});

		/**
		*表示按钮文本标签的边距。
		*<p><b>格式：</b>"上边距,右边距,下边距,左边距"。</p>
		*/
		__getset(0,__proto,'labelPadding',function(){
			this.createText();
			return this._text.padding.join(",");
			},function(value){
			this.createText();
			this._text.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
		});

		/**
		*表示按钮文本标签的字体大小。
		*@see laya.display.Text.fontSize()
		*/
		__getset(0,__proto,'labelSize',function(){
			this.createText();
			return this._text.fontSize;
			},function(value){
			this.createText();
			this._text.fontSize=value
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*@see laya.display.Text.stroke()
		*/
		__getset(0,__proto,'labelStroke',function(){
			this.createText();
			return this._text.stroke;
			},function(value){
			this.createText();
			this._text.stroke=value
		});

		/**
		*表示按钮文本标签是否为粗体字。
		*@see laya.display.Text.bold()
		*/
		__getset(0,__proto,'labelBold',function(){
			this.createText();
			return this._text.bold;
			},function(value){
			this.createText();
			this._text.bold=value;
		});

		/**
		*表示按钮文本标签的字体名称，以字符串形式表示。
		*@see laya.display.Text.font()
		*/
		__getset(0,__proto,'labelFont',function(){
			this.createText();
			return this._text.font;
			},function(value){
			this.createText();
			this._text.font=value;
		});

		/**标签对齐模式，默认为居中对齐。*/
		__getset(0,__proto,'labelAlign',function(){
			this.createText()
			return this._text.align;
			},function(value){
			this.createText()
			this._text.align=value;
		});

		/**
		*对象的点击事件处理器函数（无默认参数）。
		*/
		__getset(0,__proto,'clickHandler',function(){
			return this._clickHandler;
			},function(value){
			this._clickHandler=value;
		});

		/**
		*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"</li></ul></p>
		*@see laya.ui.AutoBitmap.sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			if (this._bitmap.sizeGrid)return this._bitmap.sizeGrid.join(",");
			return null;
			},function(value){
			this._bitmap.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
		});

		/**@inheritDoc */
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			if (this._autoSize){
				this._bitmap.width=value;
				this._text && (this._text.width=value);
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			if (this._autoSize){
				this._bitmap.height=value;
				this._text && (this._text.height=value);
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if ((typeof value=='number')|| (typeof value=='string'))this.label=value+"";
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**图标x,y偏移，格式：100,100*/
		__getset(0,__proto,'iconOffset',function(){
			return this._bitmap._offset ? this._bitmap._offset.join(","):null;
			},function(value){
			if (value)this._bitmap._offset=UIUtils.fillArray([1,1],value,Number);
			else this._bitmap._offset=[];
		});

		__static(Button,
		['stateMap',function(){return this.stateMap={"mouseup":0,"mouseover":1,"mousedown":2,"mouseout":0};}
		]);
		return Button;
	})(Component)


	//class laya.debug.view.nodeInfo.views.UIViewBase extends laya.ui.Component
	var UIViewBase=(function(_super){
		function UIViewBase(){
			this.minHandler=null;
			this.maxHandler=null;
			this.isFirstShow=true;
			this.dis=null;
			UIViewBase.__super.call(this);
			this.dis=this;
			this.minHandler=new Handler(this,this.close);
			this.maxHandler=new Handler(this,this.show);
			this.createPanel();
			if (this.dis){
				this.dis.on("mousedown",this,this.bringToTop);
				this.dis.cacheAsBitmap=true;
			}
		}

		__class(UIViewBase,'laya.debug.view.nodeInfo.views.UIViewBase',_super);
		var __proto=UIViewBase.prototype;
		__proto.show=function(){
			DebugInfoLayer.I.setTop();
			DebugInfoLayer.I.popLayer.addChild(this.dis);
			if (this.isFirstShow){
				this.firstShowFun();
				this.isFirstShow=false;
			}
		}

		__proto.firstShowFun=function(){
			this.dis.x=(Laya.stage.width-this.dis.width)*0.5;
			this.dis.y=(Laya.stage.height-this.dis.height)*0.5;
			DisControlTool.intFyDisPos(this.dis);
		}

		__proto.bringToTop=function(){
			DisControlTool.setTop(this.dis);
		}

		__proto.switchShow=function(){
			if (this.dis.parent){
				this.close();
				}else{
				this.show();
			}
		}

		__proto.close=function(){
			this.dis.removeSelf();
		}

		__proto.createPanel=function(){}
		__proto.getInput=function(){
			var input;
			input=new DInput();
			input.size(200,30);
			input.fontSize=30;
			return input;
		}

		__proto.getButton=function(){
			var btn;
			btn=new DButton();
			btn.size(40,30);
			btn.fontSize=30;
			return btn;
		}

		return UIViewBase;
	})(Component)


	//class laya.ui.Clip extends laya.ui.Component
	var Clip=(function(_super){
		function Clip(url,clipX,clipY){
			this._sources=null;
			this._bitmap=null;
			this._skin=null;
			this._clipX=1;
			this._clipY=1;
			this._clipWidth=0;
			this._clipHeight=0;
			this._autoPlay=false;
			this._interval=50;
			this._complete=null;
			this._isPlaying=false;
			this._index=0;
			this._clipChanged=false;
			this._group=null;
			Clip.__super.call(this);
			(clipX===void 0)&& (clipX=1);
			(clipY===void 0)&& (clipY=1);
			this._clipX=clipX;
			this._clipY=clipY;
			this.skin=url;
		}

		__class(Clip,'laya.ui.Clip',_super);
		var __proto=Clip.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,true);
			this._bitmap && this._bitmap.destroy();
			this._bitmap=null;
			this._sources=null;
		}

		/**
		*销毁对象并释放加载的皮肤资源。
		*/
		__proto.dispose=function(){
			this.destroy(true);
			Laya.loader.clearRes(this._skin);
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.graphics=this._bitmap=new AutoBitmap();
		}

		/**@private */
		__proto._onDisplay=function(e){
			if (this._isPlaying){
				if (this._displayedInStage)this.play();
				else this.stop();
				}else if (this._autoPlay){
				this.play();
			}
		}

		/**
		*@private
		*改变切片的资源、切片的大小。
		*/
		__proto.changeClip=function(){
			this._clipChanged=false;
			if (!this._skin)return;
			var img=Loader.getRes(this._skin);
			if (img){
				this.loadComplete(this._skin,img);
				}else {
				Laya.loader.load(this._skin,Handler.create(this,this.loadComplete,[this._skin]));
			}
		}

		/**
		*@private
		*加载切片图片资源完成函数。
		*@param url 资源地址。
		*@param img 纹理。
		*/
		__proto.loadComplete=function(url,img){
			if (url===this._skin && img){
				var w=this._clipWidth || Math.ceil(img.sourceWidth / this._clipX);
				var h=this._clipHeight || Math.ceil(img.sourceHeight / this._clipY);
				var key=this._skin+w+h;
				var clips=AutoBitmap.getCache(key);
				if (clips)this._sources=clips;
				else {
					this._sources=[];
					for (var i=0;i < this._clipY;i++){
						for (var j=0;j < this._clipX;j++){
							this._sources.push(Texture.createFromTexture(img,w *j,h *i,w,h));
						}
					}
					AutoBitmap.setCache(key,this._sources);
				}
				this.index=this._index;
				this.event("loaded");
				this.onCompResize();
			}
		}

		/**
		*播放动画。
		*/
		__proto.play=function(){
			this._isPlaying=true;
			this.index=0;
			this._index++;
			Laya.timer.loop(this.interval,this,this._loop);
			this.on("display",this,this._onDisplay);
			this.on("undisplay",this,this._onDisplay);
		}

		/**
		*@private
		*/
		__proto._loop=function(){
			if (this._style.visible && this._sources){
				this.index=this._index,this._index++;
				this._index >=this._sources.length && (this._index=0);
			}
		}

		/**
		*停止动画。
		*/
		__proto.stop=function(){
			this._isPlaying=false;
			Laya.timer.clear(this,this._loop);
		}

		/**@private */
		__proto._setClipChanged=function(){
			if (!this._clipChanged){
				this._clipChanged=true;
				this.callLater(this.changeClip);
			}
		}

		/**
		*表示动画播放间隔时间(以毫秒为单位)。
		*/
		__getset(0,__proto,'interval',function(){
			return this._interval;
			},function(value){
			if (this._interval !=value){
				this._interval=value;
				if (this._isPlaying)this.play();
			}
		});

		/**
		*@copy laya.ui.Image#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				if (value){
					this._setClipChanged()
					}else {
					this._bitmap.source=null;
				}
			}
		});

		/**
		*源数据。
		*/
		__getset(0,__proto,'sources',function(){
			return this._sources;
			},function(value){
			this._sources=value;
			this.index=this._index;
			this.event("loaded");
		});

		/**X轴（横向）切片数量。*/
		__getset(0,__proto,'clipX',function(){
			return this._clipX;
			},function(value){
			this._clipX=value || 1;
			this._setClipChanged()
		});

		/**Y轴(竖向)切片数量。*/
		__getset(0,__proto,'clipY',function(){
			return this._clipY;
			},function(value){
			this._clipY=value || 1;
			this._setClipChanged()
		});

		/**
		*切片动画的总帧数。
		*/
		__getset(0,__proto,'total',function(){
			this.runCallLater(this.changeClip);
			return this._sources ? this._sources.length :0;
		});

		/**
		*横向分割时每个切片的宽度，与 <code>clipX</code> 同时设置时优先级高于 <code>clipX</code> 。
		*/
		__getset(0,__proto,'clipWidth',function(){
			return this._clipWidth;
			},function(value){
			this._clipWidth=value;
			this._setClipChanged()
		});

		/**
		*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"</li></ul></p>
		*@see laya.ui.AutoBitmap.sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			if (this._bitmap.sizeGrid)return this._bitmap.sizeGrid.join(",");
			return null;
			},function(value){
			this._bitmap.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
		});

		/**
		*资源分组。
		*/
		__getset(0,__proto,'group',function(){
			return this._group;
			},function(value){
			if (value && this._skin)Loader.setGroup(this._skin,value);
			this._group=value;
		});

		/**
		*竖向分割时每个切片的高度，与 <code>clipY</code> 同时设置时优先级高于 <code>clipY</code> 。
		*/
		__getset(0,__proto,'clipHeight',function(){
			return this._clipHeight;
			},function(value){
			this._clipHeight=value;
			this._setClipChanged()
		});

		/**@inheritDoc */
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this._bitmap.width=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this._bitmap.height=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureWidth',function(){
			this.runCallLater(this.changeClip);
			return this._bitmap.width;
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureHeight',function(){
			this.runCallLater(this.changeClip);
			return this._bitmap.height;
		});

		/**
		*当前帧索引。
		*/
		__getset(0,__proto,'index',function(){
			return this._index;
			},function(value){
			this._index=value;
			this._bitmap && this._sources && (this._bitmap.source=this._sources[value]);
			this.event("change");
		});

		/**
		*表示是否自动播放动画，若自动播放值为true,否则值为false;
		*<p>可控制切片动画的播放、停止。</p>
		*/
		__getset(0,__proto,'autoPlay',function(){
			return this._autoPlay;
			},function(value){
			if (this._autoPlay !=value){
				this._autoPlay=value;
				value ? this.play():this.stop();
			}
		});

		/**
		*表示动画的当前播放状态。
		*如果动画正在播放中，则为true，否则为flash。
		*/
		__getset(0,__proto,'isPlaying',function(){
			return this._isPlaying;
			},function(value){
			this._isPlaying=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.index=parseInt(value);
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**
		*<code>AutoBitmap</code> 位图实例。
		*/
		__getset(0,__proto,'bitmap',function(){
			return this._bitmap;
		});

		return Clip;
	})(Component)


	//class laya.ui.ColorPicker extends laya.ui.Component
	var ColorPicker=(function(_super){
		function ColorPicker(){
			this.changeHandler=null;
			this._gridSize=11;
			this._bgColor="#ffffff";
			this._borderColor="#000000";
			this._inputColor="#000000";
			this._inputBgColor="#efefef";
			this._colorPanel=null;
			this._colorTiles=null;
			this._colorBlock=null;
			this._colorInput=null;
			this._colorButton=null;
			this._colors=[];
			this._selectedColor="#000000";
			this._panelChanged=false;
			ColorPicker.__super.call(this);
		}

		__class(ColorPicker,'laya.ui.ColorPicker',_super);
		var __proto=ColorPicker.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._colorPanel && this._colorPanel.destroy(destroyChild);
			this._colorButton && this._colorButton.destroy(destroyChild);
			this._colorPanel=null;
			this._colorTiles=null;
			this._colorBlock=null;
			this._colorInput=null;
			this._colorButton=null;
			this._colors=null;
			this.changeHandler=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._colorButton=new Button());
			this._colorPanel=new Box();
			this._colorPanel.size(230,166);
			this._colorPanel.addChild(this._colorTiles=new Sprite());
			this._colorPanel.addChild(this._colorBlock=new Sprite());
			this._colorPanel.addChild(this._colorInput=new Input());
		}

		/**@inheritDoc */
		__proto.initialize=function(){
			this._colorButton.on("click",this,this.onColorButtonClick);
			this._colorBlock.pos(5,5);
			this._colorInput.pos(60,5);
			this._colorInput.size(60,20);
			this._colorInput.on("change",this,this.onColorInputChange);
			this._colorInput.on("keydown",this,this.onColorFieldKeyDown);
			this._colorTiles.pos(5,30);
			this._colorTiles.on("mousemove",this,this.onColorTilesMouseMove);
			this._colorTiles.on("click",this,this.onColorTilesClick);
			this._colorTiles.size(20 *this._gridSize,12 *this._gridSize);
			this._colorPanel.on("mousedown",this,this.onPanelMouseDown);
			this.bgColor=this._bgColor;
		}

		__proto.onPanelMouseDown=function(e){
			e.stopPropagation();
		}

		/**
		*改变颜色样本列表面板。
		*/
		__proto.changePanel=function(){
			this._panelChanged=false;
			var g=this._colorPanel.graphics;
			g.clear();
			g.drawRect(0,0,230,166,this._bgColor,this._borderColor);
			this.drawBlock(this._selectedColor);
			this._colorInput.borderColor=this._borderColor;
			this._colorInput.bgColor=this._inputBgColor;
			this._colorInput.color=this._inputColor;
			g=this._colorTiles.graphics;
			g.clear();
			var mainColors=[0x000000,0x333333,0x666666,0x999999,0xCCCCCC,0xFFFFFF,0xFF0000,0x00FF00,0x0000FF,0xFFFF00,0x00FFFF,0xFF00FF];
			for (var i=0;i < 12;i++){
				for (var j=0;j < 20;j++){
					var color=0;
					if (j===0)color=mainColors[i];
					else if (j===1)color=0x000000;
					else color=(((i *3+j / 6)% 3 << 0)+((i / 6)<< 0)*3)*0x33 << 16 | j % 6 *0x33 << 8 | (i << 0)% 6 *0x33;
					var strColor=UIUtils.toColor(color);
					this._colors.push(strColor);
					var x=j *this._gridSize;
					var y=i *this._gridSize;
					g.drawRect(x,y,this._gridSize,this._gridSize,strColor,"#000000");
				}
			}
		}

		/**
		*颜色样本列表面板的显示按钮的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
		*/
		__proto.onColorButtonClick=function(e){
			if (this._colorPanel.parent)this.close();
			else this.open();
		}

		/**
		*打开颜色样本列表面板。
		*/
		__proto.open=function(){
			var p=this.localToGlobal(new Point());
			var px=p.x+this._colorPanel.width <=Laya.stage.width ? p.x :Laya.stage.width-this._colorPanel.width;
			var py=p.y+this._colorButton.height;
			py=py+this._colorPanel.height <=Laya.stage.height ? py :p.y-this._colorPanel.height;
			this._colorPanel.pos(px,py);
			this._colorPanel.zOrder=1001;
			Laya._currentStage.addChild(this._colorPanel);
			Laya.stage.on("mousedown",this,this.removeColorBox);
		}

		/**
		*关闭颜色样本列表面板。
		*/
		__proto.close=function(){
			Laya.stage.off("mousedown",this,this.removeColorBox);
			this._colorPanel.removeSelf();
		}

		/**
		*舞台的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
		*/
		__proto.removeColorBox=function(e){
			this.close();
		}

		/**
		*小格子色块的 <code>Event.KEY_DOWN</code> 事件侦听处理函数。
		*/
		__proto.onColorFieldKeyDown=function(e){
			if (e.keyCode==13){
				if (this._colorInput.text)this.selectedColor=this._colorInput.text;
				else this.selectedColor=null;
				this.close();
				e.stopPropagation();
			}
		}

		/**
		*颜色值输入框 <code>Event.CHANGE</code> 事件侦听处理函数。
		*/
		__proto.onColorInputChange=function(e){
			if (this._colorInput.text)this.drawBlock(this._colorInput.text);
			else this.drawBlock("#FFFFFF");
		}

		/**
		*小格子色块的 <code>Event.CLICK</code> 事件侦听处理函数。
		*/
		__proto.onColorTilesClick=function(e){
			this.selectedColor=this.getColorByMouse();
			this.close();
		}

		/**
		*@private
		*小格子色块的 <code>Event.MOUSE_MOVE</code> 事件侦听处理函数。
		*/
		__proto.onColorTilesMouseMove=function(e){
			this._colorInput.focus=false;
			var color=this.getColorByMouse();
			this._colorInput.text=color;
			this.drawBlock(color);
		}

		/**
		*通过鼠标位置取对应的颜色块的颜色值。
		*/
		__proto.getColorByMouse=function(){
			var point=this._colorTiles.getMousePoint();
			var x=Math.floor(point.x / this._gridSize);
			var y=Math.floor(point.y / this._gridSize);
			return this._colors[y *20+x];
		}

		/**
		*绘制颜色块。
		*@param color 需要绘制的颜色块的颜色值。
		*/
		__proto.drawBlock=function(color){
			var g=this._colorBlock.graphics;
			g.clear();
			var showColor=color ? color :"#ffffff";
			g.drawRect(0,0,50,20,showColor,this._borderColor);
			color || g.drawLine(0,0,50,20,"#ff0000");
		}

		/**
		*改变颜色。
		*/
		__proto.changeColor=function(){
			var g=this.graphics;
			g.clear();
			var showColor=this._selectedColor || "#000000";
			g.drawRect(0,0,this._colorButton.width,this._colorButton.height,showColor);
		}

		/**@private */
		__proto._setPanelChanged=function(){
			if (!this._panelChanged){
				this._panelChanged=true;
				this.callLater(this.changePanel);
			}
		}

		/**
		*表示颜色输入框的背景颜色值。
		*/
		__getset(0,__proto,'inputBgColor',function(){
			return this._inputBgColor;
			},function(value){
			this._inputBgColor=value;
			this._setPanelChanged();
		});

		/**
		*表示选择的颜色值。
		*/
		__getset(0,__proto,'selectedColor',function(){
			return this._selectedColor;
			},function(value){
			if (this._selectedColor !=value){
				this._selectedColor=this._colorInput.text=value;
				this.drawBlock(value);
				this.changeColor();
				this.changeHandler && this.changeHandler.runWith(this._selectedColor);
				this.event("change",Event.EMPTY.setTo("change",this,this));
			}
		});

		/**
		*@copy laya.ui.Button#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._colorButton.skin;
			},function(value){
			this._colorButton.skin=value;
			this.changeColor();
		});

		/**
		*表示颜色样本列表面板的背景颜色值。
		*/
		__getset(0,__proto,'bgColor',function(){
			return this._bgColor;
			},function(value){
			this._bgColor=value;
			this._setPanelChanged();
		});

		/**
		*表示颜色样本列表面板的边框颜色值。
		*/
		__getset(0,__proto,'borderColor',function(){
			return this._borderColor;
			},function(value){
			this._borderColor=value;
			this._setPanelChanged();
		});

		/**
		*表示颜色样本列表面板选择或输入的颜色值。
		*/
		__getset(0,__proto,'inputColor',function(){
			return this._inputColor;
			},function(value){
			this._inputColor=value;
			this._setPanelChanged();
		});

		return ColorPicker;
	})(Component)


	//class laya.ui.ComboBox extends laya.ui.Component
	var ComboBox=(function(_super){
		function ComboBox(skin,labels){
			this._visibleNum=6;
			this._button=null;
			this._list=null;
			this._isOpen=false;
			this._itemSize=12;
			this._labels=[];
			this._selectedIndex=-1;
			this._selectHandler=null;
			this._itemHeight=NaN;
			this._listHeight=NaN;
			this._listChanged=false;
			this._itemChanged=false;
			this._scrollBarSkin=null;
			this._isCustomList=false;
			this.itemRender=null;
			ComboBox.__super.call(this);
			this._itemColors=Styles.comboBoxItemColors;
			this.skin=skin;
			this.labels=labels;
		}

		__class(ComboBox,'laya.ui.ComboBox',_super);
		var __proto=ComboBox.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._button && this._button.destroy(destroyChild);
			this._list && this._list.destroy(destroyChild);
			this._button=null;
			this._list=null;
			this._itemColors=null;
			this._labels=null;
			this._selectHandler=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._button=new Button());
			this._button.text.align="left";
			this._button.labelPadding="0,0,0,5";
			this._button.on("mousedown",this,this.onButtonMouseDown);
		}

		__proto._createList=function(){
			this._list=new List();
			if (this._scrollBarSkin)this._list.vScrollBarSkin=this._scrollBarSkin;
			this._setListEvent(this._list);
		}

		__proto._setListEvent=function(list){
			this._list.selectEnable=true;
			this._list.on("mousedown",this,this.onListDown);
			this._list.mouseHandler=Handler.create(this,this.onlistItemMouse,null,false);
			if (this._list.scrollBar)this._list.scrollBar.on("mousedown",this,this.onScrollBarDown);
		}

		/**
		*@private
		*/
		__proto.onListDown=function(e){
			e.stopPropagation();
		}

		__proto.onScrollBarDown=function(e){
			e.stopPropagation();
		}

		__proto.onButtonMouseDown=function(e){
			this.callLater(this.switchTo,[!this._isOpen]);
		}

		/**
		*@private
		*/
		__proto.changeList=function(){
			this._listChanged=false;
			var labelWidth=this.width-2;
			var labelColor=this._itemColors[2];
			this._itemHeight=this._itemSize+6;
			this._list.itemRender=this.itemRender || {type:"Box",child:[{type:"Label",props:{name:"label",x:1,padding:"3,3,3,3",width:labelWidth,height:this._itemHeight,fontSize:this._itemSize,color:labelColor}}]};
			this._list.repeatY=this._visibleNum;
			this._list.refresh();
		}

		/**
		*@private
		*下拉列表的鼠标事件响应函数。
		*/
		__proto.onlistItemMouse=function(e,index){
			var type=e.type;
			if (type==="mouseover" || type==="mouseout"){
				if (this._isCustomList)return;
				var box=this._list.getCell(index);
				if (!box)return;
				var label=box.getChildByName("label");
				if (label){
					if (type==="mouseover"){
						label.bgColor=this._itemColors[0];
						label.color=this._itemColors[1];
						}else {
						label.bgColor=null;
						label.color=this._itemColors[2];
					}
				}
				}else if (type==="click"){
				this.selectedIndex=index;
				this.isOpen=false;
			}
		}

		/**
		*@private
		*/
		__proto.switchTo=function(value){
			this.isOpen=value;
		}

		/**
		*更改下拉列表的打开状态。
		*/
		__proto.changeOpen=function(){
			this.isOpen=!this._isOpen;
		}

		/**
		*更改下拉列表。
		*/
		__proto.changeItem=function(){
			this._itemChanged=false;
			this._listHeight=this._labels.length > 0 ? Math.min(this._visibleNum,this._labels.length)*this._itemHeight :this._itemHeight;
			if (!this._isCustomList){
				var g=this._list.graphics;
				g.clear();
				g.drawRect(0,0,this.width-1,this._listHeight,this._itemColors[4],this._itemColors[3]);
			};
			var a=this._list.array || [];
			a.length=0;
			for (var i=0,n=this._labels.length;i < n;i++){
				a.push({label:this._labels[i]});
			}
			this._list.height=this._listHeight;
			this._list.array=a;
		}

		__proto.changeSelected=function(){
			this._button.label=this.selectedLabel;
		}

		/**
		*关闭下拉列表。
		*/
		__proto.removeList=function(e){
			this.isOpen=false;
		}

		/**
		*表示选择的下拉列表项的索引。
		*/
		__getset(0,__proto,'selectedIndex',function(){
			return this._selectedIndex;
			},function(value){
			if (this._selectedIndex !=value){
				this._selectedIndex=value;
				if (this._labels.length > 0)this.changeSelected();
				else this.callLater(this.changeSelected);
				this.event("change",[Event.EMPTY.setTo("change",this,this)]);
				this._selectHandler && this._selectHandler.runWith(this._selectedIndex);
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureHeight',function(){
			return this._button.height;
		});

		/**
		*@copy laya.ui.Button#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._button.skin;
			},function(value){
			if (this._button.skin !=value){
				this._button.skin=value;
				this._listChanged=true;
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureWidth',function(){
			return this._button.width;
		});

		/**@inheritDoc */
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this._button.width=this._width;
			this._itemChanged=true;
			this._listChanged=true;
		});

		/**
		*表示选择的下拉列表项的的标签。
		*/
		__getset(0,__proto,'selectedLabel',function(){
			return this._selectedIndex >-1 && this._selectedIndex < this._labels.length ? this._labels[this._selectedIndex] :null;
			},function(value){
			this.selectedIndex=this._labels.indexOf(value);
		});

		/**
		*标签集合字符串。
		*/
		__getset(0,__proto,'labels',function(){
			return this._labels.join(",");
			},function(value){
			if (this._labels.length > 0)this.selectedIndex=-1;
			if (value)this._labels=value.split(",");
			else this._labels.length=0;
			this._itemChanged=true;
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this._button.height=this._height;
		});

		/**
		*改变下拉列表的选择项时执行的处理器(默认返回参数index:int)。
		*/
		__getset(0,__proto,'selectHandler',function(){
			return this._selectHandler;
			},function(value){
			this._selectHandler=value;
		});

		/**
		*获取或设置没有滚动条的下拉列表中可显示的最大行数。
		*/
		__getset(0,__proto,'visibleNum',function(){
			return this._visibleNum;
			},function(value){
			this._visibleNum=value;
			this._listChanged=true;
		});

		/**
		*表示按钮文本标签是否为粗体字。
		*@see laya.display.Text#bold
		*/
		__getset(0,__proto,'labelBold',function(){
			return this._button.text.bold;
			},function(value){
			this._button.text.bold=value
		});

		/**
		*下拉列表项颜色。
		*<p><b>格式：</b>"悬停或被选中时背景颜色,悬停或被选中时标签颜色,标签颜色,边框颜色,背景颜色"</p>
		*/
		__getset(0,__proto,'itemColors',function(){
			return String(this._itemColors)
			},function(value){
			this._itemColors=UIUtils.fillArray(this._itemColors,value,String);
			this._listChanged=true;
		});

		/**
		*下拉列表项标签的字体大小。
		*/
		__getset(0,__proto,'itemSize',function(){
			return this._itemSize;
			},function(value){
			this._itemSize=value;
			this._listChanged=true;
		});

		/**
		*获取对 <code>ComboBox</code> 组件所包含的 <code>VScrollBar</code> 滚动条组件的引用。
		*/
		__getset(0,__proto,'scrollBar',function(){
			return this.list.scrollBar;
		});

		/**
		*表示下拉列表的打开状态。
		*/
		__getset(0,__proto,'isOpen',function(){
			return this._isOpen;
			},function(value){
			if (this._isOpen !=value){
				this._isOpen=value;
				this._button.selected=this._isOpen;
				if (this._isOpen){
					this._list || this._createList();
					this._listChanged && !this._isCustomList && this.changeList();
					this._itemChanged && this.changeItem();
					var p=this.localToGlobal(Point.TEMP.setTo(0,0));
					var py=p.y+this._button.height;
					py=py+this._listHeight <=Laya.stage.height ? py :p.y-this._listHeight;
					this._list.pos(p.x,py);
					this._list.zOrder=1001;
					Laya._currentStage.addChild(this._list);
					Laya.stage.once("mousedown",this,this.removeList);
					this._list.selectedIndex=this._selectedIndex;
					}else {
					this._list && this._list.removeSelf();
				}
			}
		});

		/**
		*滚动条皮肤。
		*/
		__getset(0,__proto,'scrollBarSkin',function(){
			return this._scrollBarSkin;
			},function(value){
			this._scrollBarSkin=value;
		});

		/**
		*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"</li></ul></p>
		*@see laya.ui.AutoBitmap.sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			return this._button.sizeGrid;
			},function(value){
			this._button.sizeGrid=value;
		});

		/**
		*获取对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的引用。
		*/
		__getset(0,__proto,'button',function(){
			return this._button;
		});

		/**
		*获取对 <code>ComboBox</code> 组件所包含的 <code>List</code> 列表组件的引用。
		*/
		__getset(0,__proto,'list',function(){
			this._list || this._createList();
			return this._list;
			},function(value){
			if (value){
				value.removeSelf();
				this._isCustomList=true;
				this._list=value;
				this._setListEvent(value);
				this._itemHeight=value.getCell(0).height+value.spaceY;
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
			else if ((value instanceof Array))this.labels=(value).join(",");
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**
		*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的文本标签颜色。
		*<p><b>格式：</b>upColor,overColor,downColor,disableColor</p>
		*/
		__getset(0,__proto,'labelColors',function(){
			return this._button.labelColors;
			},function(value){
			if (this._button.labelColors !=value){
				this._button.labelColors=value;
			}
		});

		/**
		*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的文本边距。
		*<p><b>格式：</b>上边距,右边距,下边距,左边距</p>
		*/
		__getset(0,__proto,'labelPadding',function(){
			return this._button.text.padding.join(",");
			},function(value){
			this._button.text.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
		});

		/**
		*获取或设置对 <code>ComboBox</code> 组件所包含的 <code>Button</code> 组件的标签字体大小。
		*/
		__getset(0,__proto,'labelSize',function(){
			return this._button.text.fontSize;
			},function(value){
			this._button.text.fontSize=value
		});

		/**
		*表示按钮文本标签的字体名称，以字符串形式表示。
		*@see laya.display.Text#font
		*/
		__getset(0,__proto,'labelFont',function(){
			return this._button.text.font;
			},function(value){
			this._button.text.font=value
		});

		/**
		*表示按钮的状态值。
		*@see laya.ui.Button#stateNum
		*/
		__getset(0,__proto,'stateNum',function(){
			return this._button.stateNum;
			},function(value){
			this._button.stateNum=value
		});

		return ComboBox;
	})(Component)


	//class laya.ui.ScrollBar extends laya.ui.Component
	var ScrollBar=(function(_super){
		function ScrollBar(skin){
			this.rollRatio=0.95;
			this.changeHandler=null;
			this.scaleBar=true;
			this.autoHide=false;
			this.elasticDistance=0;
			this.elasticBackTime=500;
			this.upButton=null;
			this.downButton=null;
			this.slider=null;
			this._scrollSize=1;
			this._skin=null;
			this._thumbPercent=1;
			this._target=null;
			this._lastPoint=null;
			this._lastOffset=0;
			this._checkElastic=false;
			this._isElastic=false;
			this._value=NaN;
			this._hide=false;
			this._clickOnly=true;
			this._offsets=null;
			ScrollBar.__super.call(this);
			this._showButtons=UIConfig.showButtons;
			this._touchScrollEnable=UIConfig.touchScrollEnable;
			this._mouseWheelEnable=UIConfig.mouseWheelEnable;
			this.skin=skin;
			this.max=1;
		}

		__class(ScrollBar,'laya.ui.ScrollBar',_super);
		var __proto=ScrollBar.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this.stopScroll();
			this.target=null;
			_super.prototype.destroy.call(this,destroyChild);
			this.upButton && this.upButton.destroy(destroyChild);
			this.downButton && this.downButton.destroy(destroyChild);
			this.slider && this.slider.destroy(destroyChild);
			this.upButton=this.downButton=null;
			this.slider=null;
			this.changeHandler=null;
			this._offsets=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this.slider=new Slider());
			this.addChild(this.upButton=new Button());
			this.addChild(this.downButton=new Button());
		}

		/**@inheritDoc */
		__proto.initialize=function(){
			this.slider.showLabel=false;
			this.slider.on("change",this,this.onSliderChange);
			this.slider.setSlider(0,0,0);
			this.upButton.on("mousedown",this,this.onButtonMouseDown);
			this.downButton.on("mousedown",this,this.onButtonMouseDown);
		}

		/**
		*@private
		*滑块位置发生改变的处理函数。
		*/
		__proto.onSliderChange=function(){
			this.value=this.slider.value;
		}

		/**
		*@private
		*向上和向下按钮的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
		*/
		__proto.onButtonMouseDown=function(e){
			var isUp=e.currentTarget===this.upButton;
			this.slide(isUp);
			Laya.timer.once(Styles.scrollBarDelayTime,this,this.startLoop,[isUp]);
			Laya.stage.once("mouseup",this,this.onStageMouseUp);
		}

		/**@private */
		__proto.startLoop=function(isUp){
			Laya.timer.frameLoop(1,this,this.slide,[isUp]);
		}

		/**@private */
		__proto.slide=function(isUp){
			if (isUp)this.value-=this._scrollSize;
			else this.value+=this._scrollSize;
		}

		/**
		*@private
		*舞台的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
		*/
		__proto.onStageMouseUp=function(e){
			Laya.timer.clear(this,this.startLoop);
			Laya.timer.clear(this,this.slide);
		}

		/**
		*@private
		*更改对象的皮肤及位置。
		*/
		__proto.changeScrollBar=function(){
			this.upButton.visible=this._showButtons;
			this.downButton.visible=this._showButtons;
			if (this._showButtons){
				this.upButton.skin=this._skin.replace(".png","$up.png");
				this.downButton.skin=this._skin.replace(".png","$down.png");
			}
			if (this.slider.isVertical)this.slider.y=this._showButtons ? this.upButton.height :0;
			else this.slider.x=this._showButtons ? this.upButton.width :0;
			this.resetPositions();
		}

		/**@inheritDoc */
		__proto.changeSize=function(){
			_super.prototype.changeSize.call(this);
			this.resetPositions();
			this.event("change");
			this.changeHandler && this.changeHandler.runWith(this.value);
		}

		/**@private */
		__proto.resetPositions=function(){
			if (this.slider.isVertical)this.slider.height=this.height-(this._showButtons ? (this.upButton.height+this.downButton.height):0);
			else this.slider.width=this.width-(this._showButtons ? (this.upButton.width+this.downButton.width):0);
			this.resetButtonPosition();
		}

		/**@private */
		__proto.resetButtonPosition=function(){
			if (this.slider.isVertical)this.downButton.y=this.slider.y+this.slider.height;
			else this.downButton.x=this.slider.x+this.slider.width;
		}

		/**
		*设置滚动条信息。
		*@param min 滚动条最小位置值。
		*@param max 滚动条最大位置值。
		*@param value 滚动条当前位置值。
		*/
		__proto.setScroll=function(min,max,value){
			this.runCallLater(this.changeSize);
			this.slider.setSlider(min,max,value);
			this.slider.bar.visible=max > 0;
			if (!this._hide && this.autoHide)this.visible=false;
		}

		/**@private */
		__proto.onTargetMouseWheel=function(e){
			this.value-=e.delta *this._scrollSize;
			this.target=this._target;
		}

		/**@private */
		__proto.onTargetMouseDown=function(e){
			this._clickOnly=true;
			this._lastOffset=0;
			this._checkElastic=false;
			this._lastPoint || (this._lastPoint=new Point());
			this._lastPoint.setTo(Laya.stage.mouseX,Laya.stage.mouseY);
			Laya.timer.clear(this,this.tweenMove);
			Tween.clearTween(this);
			Laya.stage.once("mouseup",this,this.onStageMouseUp2);
			Laya.stage.once("mouseout",this,this.onStageMouseUp2);
			Laya.timer.frameLoop(1,this,this.loop);
		}

		/**@private */
		__proto.loop=function(){
			var mouseY=Laya.stage.mouseY;
			var mouseX=Laya.stage.mouseX;
			this._lastOffset=this.isVertical ? (mouseY-this._lastPoint.y):(mouseX-this._lastPoint.x);
			if (this._clickOnly){
				if (Math.abs(this._lastOffset *(this.isVertical ? Laya.stage._canvasTransform.getScaleY():Laya.stage._canvasTransform.getScaleX()))> 1){
					this._clickOnly=false;
					this._offsets || (this._offsets=[]);
					this._offsets.length=0;
					this._target.mouseEnabled=false;
					if (!this.hide && this.autoHide){
						this.alpha=1;
						this.visible=true;
					}
					this.event("start");
				}else return;
			}
			this._offsets.push(this._lastOffset);
			this._lastPoint.x=mouseX;
			this._lastPoint.y=mouseY;
			if (this._lastOffset===0)return;
			if (!this._checkElastic){
				if (this.elasticDistance > 0){
					if (!this._checkElastic && this._lastOffset !=0){
						if ((this._lastOffset > 0 && this._value <=this.min)|| (this._lastOffset < 0 && this._value >=this.max)){
							this._isElastic=true;
							this._checkElastic=true;
							}else {
							this._isElastic=false;
						}
					}
					}else {
					this._checkElastic=true;
				}
			}
			if (this._isElastic){
				if (this._value <=this.min){
					this.value-=this._lastOffset *Math.max(0,(1-((this.min-this._value)/ this.elasticDistance)));
					}else if (this._value >=this.max){
					this.value-=this._lastOffset *Math.max(0,(1-((this._value-this.max)/ this.elasticDistance)));
				}
				}else {
				this.value-=this._lastOffset;
			}
		}

		/**@private */
		__proto.onStageMouseUp2=function(e){
			Laya.stage.off("mouseup",this,this.onStageMouseUp2);
			Laya.stage.off("mouseout",this,this.onStageMouseUp2);
			Laya.timer.clear(this,this.loop);
			if (this._clickOnly)return;
			this._target.mouseEnabled=true;
			if (this._isElastic){
				if (this._value < this.min){
					Tween.to(this,{value:this.min},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
					}else if (this._value > this.max){
					Tween.to(this,{value:this.max},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
				}
				}else {
				if (!this._offsets)return;
				if (this._offsets.length < 1){
					this._offsets[0]=this.isVertical ? Laya.stage.mouseY-this._lastPoint.y :Laya.stage.mouseX-this._lastPoint.x;
				};
				var offset=0;
				var n=Math.min(this._offsets.length,3);
				for (var i=0;i < n;i++){
					offset+=this._offsets[this._offsets.length-1-i];
				}
				this._lastOffset=offset / n;
				offset=Math.abs(this._lastOffset);
				if (offset < 2){
					this.event("end");
					return;
				}
				if (offset > 60)this._lastOffset=this._lastOffset > 0 ? 60 :-60;
				Laya.timer.frameLoop(1,this,this.tweenMove);
			}
		}

		/**@private */
		__proto.elasticOver=function(){
			this._isElastic=false;
			if (!this.hide && this.autoHide){
				Tween.to(this,{alpha:0},500);
			}
			this.event("end");
		}

		/**@private */
		__proto.tweenMove=function(){
			this._lastOffset *=this.rollRatio;
			var tarSpeed=NaN;
			if (this.elasticDistance > 0){
				if (this._lastOffset > 0 && this.value <=this.min){
					this._isElastic=true;
					tarSpeed=-(this.min-this.elasticDistance-this.value)*0.5;
					if (this._lastOffset > tarSpeed)this._lastOffset=tarSpeed;
					}else if (this._lastOffset<0&&this.value>=this.max){
					this._isElastic=true;
					tarSpeed=-(this.max+this.elasticDistance-this.value)*0.5;
					if (this._lastOffset < tarSpeed)this._lastOffset=tarSpeed;
				}
			}
			this.value-=this._lastOffset;
			if (Math.abs(this._lastOffset)< 1){
				Laya.timer.clear(this,this.tweenMove);
				if (this._isElastic){
					if (this._value < this.min){
						Tween.to(this,{value:this.min},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
						}else if (this._value > this.max){
						Tween.to(this,{value:this.max},this.elasticBackTime,Ease.sineOut,Handler.create(this,this.elasticOver));
						}else{
						this.elasticOver();
					}
					return;
				}
				this.event("end");
				if (!this.hide && this.autoHide){
					Tween.to(this,{alpha:0},500);
				}
			}
		}

		/**
		*停止滑动。
		*/
		__proto.stopScroll=function(){
			this.onStageMouseUp2(null);
			Laya.timer.clear(this,this.tweenMove);
			Tween.clearTween(this);
		}

		/**@inheritDoc */
		__getset(0,__proto,'measureHeight',function(){
			if (this.slider.isVertical)return 100;
			return this.slider.height;
		});

		/**
		*@copy laya.ui.Image#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				this.slider.skin=this._skin;
				this.callLater(this.changeScrollBar);
			}
		});

		/**
		*获取或设置表示最高滚动位置的数字。
		*/
		__getset(0,__proto,'max',function(){
			return this.slider.max;
			},function(value){
			this.slider.max=value;
		});

		/**一个布尔值，指定是否显示向上、向下按钮，默认值为true。*/
		__getset(0,__proto,'showButtons',function(){
			return this._showButtons;
			},function(value){
			this._showButtons=value;
			this.callLater(this.changeScrollBar);
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureWidth',function(){
			if (this.slider.isVertical)return this.slider.width;
			return 100;
		});

		/**
		*获取或设置表示最低滚动位置的数字。
		*/
		__getset(0,__proto,'min',function(){
			return this.slider.min;
			},function(value){
			this.slider.min=value;
		});

		/**
		*获取或设置表示当前滚动位置的数字。
		*/
		__getset(0,__proto,'value',function(){
			return this._value;
			},function(v){
			if (v!==this._value){
				if (this._isElastic)this._value=v;
				else {
					this.slider.value=v;
					this._value=this.slider.value;
				}
				this.event("change");
				this.changeHandler && this.changeHandler.runWith(this.value);
			}
		});

		/**
		*一个布尔值，指示滚动条是否为垂直滚动。如果值为true，则为垂直滚动，否则为水平滚动。
		*<p>默认值为：true。</p>
		*/
		__getset(0,__proto,'isVertical',function(){
			return this.slider.isVertical;
			},function(value){
			this.slider.isVertical=value;
		});

		/**
		*<p>当前实例的 <code>Slider</code> 实例的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"</li></ul></p>
		*@see laya.ui.AutoBitmap.sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			return this.slider.sizeGrid;
			},function(value){
			this.slider.sizeGrid=value;
		});

		/**获取或设置一个值，该值表示按下滚动条轨道时页面滚动的增量。 */
		__getset(0,__proto,'scrollSize',function(){
			return this._scrollSize;
			},function(value){
			this._scrollSize=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if ((typeof value=='number')|| (typeof value=='string'))this.value=Number(value);
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**获取或设置一个值，该值表示滑条长度比例，值为：（0-1）。 */
		__getset(0,__proto,'thumbPercent',function(){
			return this._thumbPercent;
			},function(value){
			this.runCallLater(this.changeScrollBar);
			this.runCallLater(this.changeSize);
			value=value >=1 ? 0.99 :value;
			this._thumbPercent=value;
			if (this.scaleBar){
				if (this.slider.isVertical)this.slider.bar.height=Math.max(this.slider.height *value,Styles.scrollBarMinNum);
				else this.slider.bar.width=Math.max(this.slider.width *value,Styles.scrollBarMinNum);
			}
		});

		/**
		*设置滚动对象。
		*@see laya.ui.TouchScroll#target
		*/
		__getset(0,__proto,'target',function(){
			return this._target;
			},function(value){
			if (this._target){
				this._target.off("mousewheel",this,this.onTargetMouseWheel);
				this._target.off("mousedown",this,this.onTargetMouseDown);
			}
			this._target=value;
			if (value){
				this._mouseWheelEnable && this._target.on("mousewheel",this,this.onTargetMouseWheel);
				this._touchScrollEnable && this._target.on("mousedown",this,this.onTargetMouseDown);
			}
		});

		/**是否隐藏滚动条，不显示滚动条，但是可以正常滚动，默认为false。*/
		__getset(0,__proto,'hide',function(){
			return this._hide;
			},function(value){
			this._hide=value;
			this.visible=!value;
		});

		/**一个布尔值，指定是否开启触摸，默认值为true。*/
		__getset(0,__proto,'touchScrollEnable',function(){
			return this._touchScrollEnable;
			},function(value){
			this._touchScrollEnable=value;
			this.target=this._target;
		});

		/**一个布尔值，指定是否滑轮滚动，默认值为true。*/
		__getset(0,__proto,'mouseWheelEnable',function(){
			return this._mouseWheelEnable;
			},function(value){
			this._mouseWheelEnable=value;
		});

		/**
		*滚动的刻度值，滑动数值为tick的整数倍。默认值为1。
		*/
		__getset(0,__proto,'tick',function(){
			return this.slider.tick;
			},function(value){
			this.slider.tick=value;
		});

		return ScrollBar;
	})(Component)


	//class laya.ui.Slider extends laya.ui.Component
	var Slider=(function(_super){
		function Slider(skin){
			this.changeHandler=null;
			this.isVertical=true;
			this.showLabel=true;
			this._allowClickBack=false;
			this._max=100;
			this._min=0;
			this._tick=1;
			this._value=0;
			this._skin=null;
			this._bg=null;
			this._progress=null;
			this._bar=null;
			this._tx=NaN;
			this._ty=NaN;
			this._maxMove=NaN;
			this._globalSacle=null;
			Slider.__super.call(this);
			this.skin=skin;
		}

		__class(Slider,'laya.ui.Slider',_super);
		var __proto=Slider.prototype;
		/**
		*@inheritDoc
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._bg && this._bg.destroy(destroyChild);
			this._bar && this._bar.destroy(destroyChild);
			this._progress && this._progress.destroy(destroyChild);
			this._bg=null;
			this._bar=null;
			this._progress=null;
			this.changeHandler=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._bg=new Image());
			this.addChild(this._bar=new Button());
		}

		/**@inheritDoc */
		__proto.initialize=function(){
			this._bar.on("mousedown",this,this.onBarMouseDown);
			this._bg.sizeGrid=this._bar.sizeGrid="4,4,4,4,0";
			if (this._progress)this._progress.sizeGrid=this._bar.sizeGrid;
			this.allowClickBack=true;
		}

		/**
		*@private
		*滑块的的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
		*/
		__proto.onBarMouseDown=function(e){
			this._globalSacle || (this._globalSacle=new Point());
			this._globalSacle.setTo(this.globalScaleX || 0.01,this.globalScaleY || 0.01);
			this._maxMove=this.isVertical ? (this.height-this._bar.height):(this.width-this._bar.width);
			this._tx=Laya.stage.mouseX;
			this._ty=Laya.stage.mouseY;
			Laya.stage.on("mousemove",this,this.mouseMove);
			Laya.stage.once("mouseup",this,this.mouseUp);
			this.showValueText();
		}

		/**
		*@private
		*显示标签。
		*/
		__proto.showValueText=function(){
			if (this.showLabel){
				var label=laya.ui.Slider.label;
				this.addChild(label);
				label.textField.changeText(this._value+"");
				if (this.isVertical){
					label.x=this._bar.x+20;
					label.y=(this._bar.height-label.height)*0.5+this._bar.y;
					}else {
					label.y=this._bar.y-20;
					label.x=(this._bar.width-label.width)*0.5+this._bar.x;
				}
			}
		}

		/**
		*@private
		*隐藏标签。
		*/
		__proto.hideValueText=function(){
			laya.ui.Slider.label && laya.ui.Slider.label.removeSelf();
		}

		/**
		*@private
		*/
		__proto.mouseUp=function(e){
			Laya.stage.off("mousemove",this,this.mouseMove);
			this.sendChangeEvent("changed");
			this.hideValueText();
		}

		/**
		*@private
		*/
		__proto.mouseMove=function(e){
			var oldValue=this._value;
			if (this.isVertical){
				this._bar.y+=(Laya.stage.mouseY-this._ty)/ this._globalSacle.y;
				if (this._bar.y > this._maxMove)this._bar.y=this._maxMove;
				else if (this._bar.y < 0)this._bar.y=0;
				this._value=this._bar.y / this._maxMove *(this._max-this._min)+this._min;
				if(this._progress)this._progress.height=this._bar.y+0.5*this._bar.height;
				}else {
				this._bar.x+=(Laya.stage.mouseX-this._tx)/ this._globalSacle.x;
				if (this._bar.x > this._maxMove)this._bar.x=this._maxMove;
				else if (this._bar.x < 0)this._bar.x=0;
				this._value=this._bar.x / this._maxMove *(this._max-this._min)+this._min;
				if(this._progress)this._progress.width=this._bar.x+0.5*this._bar.width;
			}
			this._tx=Laya.stage.mouseX;
			this._ty=Laya.stage.mouseY;
			var pow=Math.pow(10,(this._tick+"").length-1);
			this._value=Math.round(Math.round(this._value / this._tick)*this._tick *pow)/ pow;
			if (this._value !=oldValue){
				this.sendChangeEvent();
			}
			this.showValueText();
		}

		/**
		*@private
		*/
		__proto.sendChangeEvent=function(type){
			(type===void 0)&& (type="change");
			this.event(type);
			this.changeHandler && this.changeHandler.runWith(this._value);
		}

		/**
		*@private
		*设置滑块的位置信息。
		*/
		__proto.setBarPoint=function(){
			if (this.isVertical)this._bar.x=Math.round((this._bg.width-this._bar.width)*0.5);
			else this._bar.y=Math.round((this._bg.height-this._bar.height)*0.5);
		}

		/**@inheritDoc */
		__proto.changeSize=function(){
			_super.prototype.changeSize.call(this);
			if (this.isVertical)this._bg.height=this.height;
			else this._bg.width=this.width;
			this.setBarPoint();
			this.changeValue();
		}

		/**
		*设置滑动条的信息。
		*@param min 滑块的最小值。
		*@param max 滑块的最小值。
		*@param value 滑块的当前值。
		*/
		__proto.setSlider=function(min,max,value){
			this._value=-1;
			this._min=min;
			this._max=max > min ? max :min;
			this.value=value < min ? min :value > max ? max :value;
		}

		/**
		*@private
		*改变滑块的位置值。
		*/
		__proto.changeValue=function(){
			var pow=Math.pow(10,(this._tick+"").length-1);
			this._value=Math.round(Math.round(this._value / this._tick)*this._tick *pow)/ pow;
			this._value=this._value > this._max ? this._max :this._value < this._min ? this._min :this._value;
			var num=this._max-this._min;
			if (num===0)num=1;
			if (this.isVertical){
				this._bar.y=(this._value-this._min)/ num *(this.height-this._bar.height);
				if(this._progress)this._progress.height=this._bar.y+0.5*this._bar.height;
			}
			else{
				this._bar.x=(this._value-this._min)/ num *(this.width-this._bar.width);
				if(this._progress)this._progress.width=this._bar.x+0.5*this._bar.width;
			}
		}

		/**
		*@private
		*滑动条的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
		*/
		__proto.onBgMouseDown=function(e){
			var point=this._bg.getMousePoint();
			if (this.isVertical)this.value=point.y / (this.height-this._bar.height)*(this._max-this._min)+this._min;
			else this.value=point.x / (this.width-this._bar.width)*(this._max-this._min)+this._min;
		}

		/**@inheritDoc */
		__getset(0,__proto,'measureHeight',function(){
			return Math.max(this._bg.height,this._bar.height);
		});

		/**
		*@copy laya.ui.Image#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				this._bg.skin=this._skin;
				this._bar.skin=this._skin.replace(".png","$bar.png");
				var progressSkin=this._skin.replace(".png","$progress.png");
				if (Loader.getRes(progressSkin)){
					if (!this._progress){
						this.addChild(this._progress=new Image());
						this._progress.sizeGrid=this._bar.sizeGrid;
						this.setChildIndex(this._progress,1);
					}
					this._progress.skin=progressSkin;
				}
				this.setBarPoint();
				this.callLater(this.changeValue);
			}
		});

		/**
		*一个布尔值，指定是否允许通过点击滑动条改变 <code>Slider</code> 的 <code>value</code> 属性值。
		*/
		__getset(0,__proto,'allowClickBack',function(){
			return this._allowClickBack;
			},function(value){
			if (this._allowClickBack !=value){
				this._allowClickBack=value;
				if (value)this._bg.on("mousedown",this,this.onBgMouseDown);
				else this._bg.off("mousedown",this,this.onBgMouseDown);
			}
		});

		/**
		*获取或设置表示最高位置的数字。 默认值为100。
		*/
		__getset(0,__proto,'max',function(){
			return this._max;
			},function(value){
			if (this._max !=value){
				this._max=value;
				this.callLater(this.changeValue);
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureWidth',function(){
			return Math.max(this._bg.width,this._bar.width);
		});

		/**
		*滑动的刻度值，滑动数值为tick的整数倍。默认值为1。
		*/
		__getset(0,__proto,'tick',function(){
			return this._tick;
			},function(value){
			if (this._tick !=value){
				this._tick=value;
				this.callLater(this.changeValue);
			}
		});

		/**
		*<p>当前实例的背景图（ <code>Image</code> ）和滑块按钮（ <code>Button</code> ）实例的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"</li></ul></p>
		*@see laya.ui.AutoBitmap.sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			return this._bg.sizeGrid;
			},function(value){
			this._bg.sizeGrid=value;
			this._bar.sizeGrid=value;
		});

		/**
		*获取或设置表示最低位置的数字。 默认值为0。
		*/
		__getset(0,__proto,'min',function(){
			return this._min;
			},function(value){
			if (this._min !=value){
				this._min=value;
				this.callLater(this.changeValue);
			}
		});

		/**
		*获取或设置表示当前滑块位置的数字。
		*/
		__getset(0,__proto,'value',function(){
			return this._value;
			},function(num){
			if (this._value !=num){
				var oldValue=this._value;
				this._value=num;
				this.changeValue();
				if (this._value !=oldValue){
					this.sendChangeEvent();
				}
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if ((typeof value=='number')|| (typeof value=='string'))this.value=Number(value);
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**
		*表示滑块按钮的引用。
		*/
		__getset(0,__proto,'bar',function(){
			return this._bar;
		});

		__static(Slider,
		['label',function(){return this.label=new Label();}
		]);
		return Slider;
	})(Component)


	//class laya.ui.Image extends laya.ui.Component
	var Image=(function(_super){
		function Image(skin){
			this._bitmap=null;
			this._skin=null;
			this._group=null;
			Image.__super.call(this);
			this.skin=skin;
		}

		__class(Image,'laya.ui.Image',_super);
		var __proto=Image.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,true);
			this._bitmap && this._bitmap.destroy();
			this._bitmap=null;
		}

		/**
		*销毁对象并释放加载的皮肤资源。
		*/
		__proto.dispose=function(){
			this.destroy(true);
			Laya.loader.clearRes(this._skin);
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.graphics=this._bitmap=new AutoBitmap();
			this._bitmap.autoCacheCmd=false;
		}

		/**
		*@private
		*设置皮肤资源。
		*/
		__proto.setSource=function(url,img){
			if (url===this._skin && img){
				this.source=img
				this.onCompResize();
			}
		}

		/**
		*@copy laya.ui.AutoBitmap#source
		*/
		__getset(0,__proto,'source',function(){
			return this._bitmap.source;
			},function(value){
			if (!this._bitmap)return;
			this._bitmap.source=value;
			this.event("loaded");
			this.repaint();
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if ((typeof value=='string'))this.skin=value;
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureHeight',function(){
			return this._bitmap.height;
		});

		/**
		*<p>对象的皮肤地址，以字符串表示。</p>
		*<p>如果资源未加载，则先加载资源，加载完成后应用于此对象。</p>
		*<b>注意：</b>资源加载完成后，会自动缓存至资源库中。
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				if (value){
					var source=Loader.getRes(value);
					if (source){
						this.source=source;
						this.onCompResize();
					}else Laya.loader.load(this._skin,Handler.create(this,this.setSource,[this._skin]),null,"image",1,true,this._group);
					}else {
					this.source=null;
				}
			}
		});

		/**
		*资源分组。
		*/
		__getset(0,__proto,'group',function(){
			return this._group;
			},function(value){
			if (value && this._skin)Loader.setGroup(this._skin,value);
			this._group=value;
		});

		/**
		*<p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"。</li></ul></p>
		*@see laya.ui.AutoBitmap#sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			if (this._bitmap.sizeGrid)return this._bitmap.sizeGrid.join(",");
			return null;
			},function(value){
			this._bitmap.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureWidth',function(){
			return this._bitmap.width;
		});

		/**@inheritDoc */
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this._bitmap.width=value==0 ? 0.0000001 :value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this._bitmap.height=value==0 ? 0.0000001 :value;
		});

		return Image;
	})(Component)


	//class laya.ui.Label extends laya.ui.Component
	var Label=(function(_super){
		function Label(text){
			this._tf=null;
			Label.__super.call(this);
			(text===void 0)&& (text="");
			Font.defaultColor=Styles.labelColor;
			this.text=text;
		}

		__class(Label,'laya.ui.Label',_super);
		var __proto=Label.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._tf=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._tf=new Text());
		}

		/**@copy laya.display.Text#changeText()
		**/
		__proto.changeText=function(text){
			this._tf.changeText(text);
		}

		/**
		*<p>边距信息</p>
		*<p>"上边距，右边距，下边距 , 左边距（边距以像素为单位）"</p>
		*@see laya.display.Text.padding
		*/
		__getset(0,__proto,'padding',function(){
			return this._tf.padding.join(",");
			},function(value){
			this._tf.padding=UIUtils.fillArray(Styles.labelPadding,value,Number);
		});

		/**
		*@copy laya.display.Text#bold
		*/
		__getset(0,__proto,'bold',function(){
			return this._tf.bold;
			},function(value){
			this._tf.bold=value;
		});

		/**
		*@copy laya.display.Text#align
		*/
		__getset(0,__proto,'align',function(){
			return this._tf.align;
			},function(value){
			this._tf.align=value;
		});

		/**
		*当前文本内容字符串。
		*@see laya.display.Text.text
		*/
		__getset(0,__proto,'text',function(){
			return this._tf.text;
			},function(value){
			if (this._tf.text !=value){
				if(value)
					value=UIUtils.adptString(value+"");
				this._tf.text=value;
				this.event("change");
			}
		});

		/**
		*@copy laya.display.Text#italic
		*/
		__getset(0,__proto,'italic',function(){
			return this._tf.italic;
			},function(value){
			this._tf.italic=value;
		});

		/**
		*@copy laya.display.Text#wordWrap
		*/
		/**
		*@copy laya.display.Text#wordWrap
		*/
		__getset(0,__proto,'wordWrap',function(){
			return this._tf.wordWrap;
			},function(value){
			this._tf.wordWrap=value;
		});

		/**
		*@copy laya.display.Text#font
		*/
		__getset(0,__proto,'font',function(){
			return this._tf.font;
			},function(value){
			this._tf.font=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if ((typeof value=='number')|| (typeof value=='string'))this.text=value+"";
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**
		*@copy laya.display.Text#color
		*/
		__getset(0,__proto,'color',function(){
			return this._tf.color;
			},function(value){
			this._tf.color=value;
		});

		/**
		*@copy laya.display.Text#valign
		*/
		__getset(0,__proto,'valign',function(){
			return this._tf.valign;
			},function(value){
			this._tf.valign=value;
		});

		/**
		*@copy laya.display.Text#leading
		*/
		__getset(0,__proto,'leading',function(){
			return this._tf.leading;
			},function(value){
			this._tf.leading=value;
		});

		/**
		*@copy laya.display.Text#fontSize
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._tf.fontSize;
			},function(value){
			this._tf.fontSize=value;
		});

		/**
		*@copy laya.display.Text#bgColor
		*/
		__getset(0,__proto,'bgColor',function(){
			return this._tf.bgColor
			},function(value){
			this._tf.bgColor=value;
		});

		/**
		*@copy laya.display.Text#borderColor
		*/
		__getset(0,__proto,'borderColor',function(){
			return this._tf.borderColor
			},function(value){
			this._tf.borderColor=value;
		});

		/**
		*@copy laya.display.Text#stroke
		*/
		__getset(0,__proto,'stroke',function(){
			return this._tf.stroke;
			},function(value){
			this._tf.stroke=value;
		});

		/**
		*@copy laya.display.Text#strokeColor
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._tf.strokeColor;
			},function(value){
			this._tf.strokeColor=value;
		});

		/**
		*文本控件实体 <code>Text</code> 实例。
		*/
		__getset(0,__proto,'textField',function(){
			return this._tf;
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'measureWidth',function(){
			return this._tf.width;
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'measureHeight',function(){
			return this._tf.height;
		});

		/**
		*@inheritDoc
		*/
		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'width',function(){
			if (this._width || this._tf.text)return _super.prototype._$get_width.call(this);
			return 0;
			},function(value){
			_super.prototype._$set_width.call(this,value);
			this._tf.width=value;
		});

		/**
		*@inheritDoc
		*/
		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'height',function(){
			if (this._height || this._tf.text)return _super.prototype._$get_height.call(this);
			return 0;
			},function(value){
			_super.prototype._$set_height.call(this,value);
			this._tf.height=value;
		});

		/**
		*@copy laya.display.Text#overflow
		*/
		/**
		*@copy laya.display.Text#overflow
		*/
		__getset(0,__proto,'overflow',function(){
			return this._tf.overflow;
			},function(value){
			this._tf.overflow=value;
		});

		/**
		*@copy laya.display.Text#underline
		*/
		/**
		*@copy laya.display.Text#underline
		*/
		__getset(0,__proto,'underline',function(){
			return this._tf.underline;
			},function(value){
			this._tf.underline=value;
		});

		/**
		*@copy laya.display.Text#underlineColor
		*/
		/**
		*@copy laya.display.Text#underlineColor
		*/
		__getset(0,__proto,'underlineColor',function(){
			return this._tf.underlineColor;
			},function(value){
			this._tf.underlineColor=value;
		});

		return Label;
	})(Component)


	//class laya.ui.ProgressBar extends laya.ui.Component
	var ProgressBar=(function(_super){
		function ProgressBar(skin){
			this.changeHandler=null;
			this._bg=null;
			this._bar=null;
			this._skin=null;
			this._value=0.5;
			ProgressBar.__super.call(this);
			this.skin=skin;
		}

		__class(ProgressBar,'laya.ui.ProgressBar',_super);
		var __proto=ProgressBar.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._bg && this._bg.destroy(destroyChild);
			this._bar && this._bar.destroy(destroyChild);
			this._bg=this._bar=null;
			this.changeHandler=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._bg=new Image());
			this.addChild(this._bar=new Image());
			this._bar._bitmap.autoCacheCmd=false;
		}

		/**
		*@private
		*更改进度值的显示。
		*/
		__proto.changeValue=function(){
			if (this.sizeGrid){
				var grid=this.sizeGrid.split(",");
				var left=Number(grid[3]);
				var right=Number(grid[1]);
				var max=this.width-left-right;
				var sw=max *this._value;
				this._bar.width=left+right+sw;
				this._bar.visible=this._bar.width > left+right;
				}else {
				this._bar.width=this.width *this._value;
			}
		}

		/**@inheritDoc */
		__getset(0,__proto,'measureHeight',function(){
			return this._bg.height;
		});

		/**
		*@copy laya.ui.Image#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				this._bg.skin=this._skin;
				this._bar.skin=this._skin.replace(".png","$bar.png");
				this.callLater(this.changeValue);
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'measureWidth',function(){
			return this._bg.width;
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this._bg.height=this._height;
			this._bar.height=this._height;
		});

		/**
		*获取进度条对象。
		*/
		__getset(0,__proto,'bar',function(){
			return this._bar;
		});

		/**
		*当前的进度量。
		*<p><b>取值：</b>介于0和1之间。</p>
		*/
		__getset(0,__proto,'value',function(){
			return this._value;
			},function(num){
			if (this._value !=num){
				num=num > 1 ? 1 :num < 0 ? 0 :num;
				this._value=num;
				this.callLater(this.changeValue);
				this.event("change");
				this.changeHandler && this.changeHandler.runWith(num);
			}
		});

		/**
		*获取背景条对象。
		*/
		__getset(0,__proto,'bg',function(){
			return this._bg;
		});

		/**
		*<p>当前 <code>ProgressBar</code> 实例的进度条背景位图（ <code>Image</code> 实例）的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"</li></ul></p>
		*@see laya.ui.AutoBitmap.sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			return this._bg.sizeGrid;
			},function(value){
			this._bg.sizeGrid=this._bar.sizeGrid=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this._bg.width=this._width;
			this.callLater(this.changeValue);
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if ((typeof value=='number')|| (typeof value=='string'))this.value=Number(value);
			else _super.prototype._$set_dataSource.call(this,value);
		});

		return ProgressBar;
	})(Component)


	//class laya.ui.TipManager extends laya.ui.Component
	var TipManager=(function(_super){
		function TipManager(){
			this._tipBox=null;
			this._tipText=null;
			this._defaultTipHandler=null;
			TipManager.__super.call(this);
			this._tipBox=new Component();
			this._tipBox.addChild(this._tipText=new Text());
			this._tipText.x=this._tipText.y=5;
			this._tipText.color=TipManager.tipTextColor;
			this._defaultTipHandler=this._showDefaultTip;
			Laya.stage.on("showtip",this,this._onStageShowTip);
			Laya.stage.on("hidetip",this,this._onStageHideTip);
			this.zOrder=1100
		}

		__class(TipManager,'laya.ui.TipManager',_super);
		var __proto=TipManager.prototype;
		/**
		*@private
		*/
		__proto._onStageHideTip=function(e){
			Laya.timer.clear(this,this._showTip);
			this.closeAll();
			this.removeSelf();
		}

		/**
		*@private
		*/
		__proto._onStageShowTip=function(data){
			Laya.timer.once(TipManager.tipDelay,this,this._showTip,[data],true);
		}

		/**
		*@private
		*/
		__proto._showTip=function(tip){
			if ((typeof tip=='string')){
				var text=String(tip);
				if (Boolean(text)){
					this._defaultTipHandler(text);
				}
				}else if ((tip instanceof laya.utils.Handler )){
				(tip).run();
				}else if ((typeof tip=='function')){
				(tip).apply();
			}
			if (true){
				Laya.stage.on("mousemove",this,this._onStageMouseMove);
				Laya.stage.on("mousedown",this,this._onStageMouseDown);
			}
			this._onStageMouseMove(null);
		}

		/**
		*@private
		*/
		__proto._onStageMouseDown=function(e){
			this.closeAll();
		}

		/**
		*@private
		*/
		__proto._onStageMouseMove=function(e){
			this._showToStage(this,TipManager.offsetX,TipManager.offsetY);
		}

		/**
		*@private
		*/
		__proto._showToStage=function(dis,offX,offY){
			(offX===void 0)&& (offX=0);
			(offY===void 0)&& (offY=0);
			var rec=dis.getBounds();
			dis.x=Laya.stage.mouseX+offX;
			dis.y=Laya.stage.mouseY+offY;
			if (dis.x+rec.width > Laya.stage.width){
				dis.x-=rec.width+offX;
			}
			if (dis.y+rec.height > Laya.stage.height){
				dis.y-=rec.height+offY;
			}
		}

		/**关闭所有鼠标提示*/
		__proto.closeAll=function(){
			Laya.timer.clear(this,this._showTip);
			Laya.stage.off("mousemove",this,this._onStageMouseMove);
			Laya.stage.off("mousedown",this,this._onStageMouseDown);
			this.removeChildren();
		}

		/**
		*显示显示对象类型的tip
		*/
		__proto.showDislayTip=function(tip){
			this.addChild(tip);
			this._showToStage(this);
			Laya._currentStage.addChild(this);
		}

		/**
		*@private
		*/
		__proto._showDefaultTip=function(text){
			this._tipText.text=text;
			var g=this._tipBox.graphics;
			g.clear();
			g.drawRect(0,0,this._tipText.width+10,this._tipText.height+10,TipManager.tipBackColor);
			this.addChild(this._tipBox);
			this._showToStage(this);
			Laya._currentStage.addChild(this);
		}

		/**默认鼠标提示函数*/
		__getset(0,__proto,'defaultTipHandler',function(){
			return this._defaultTipHandler;
			},function(value){
			this._defaultTipHandler=value;
		});

		TipManager.offsetX=10;
		TipManager.offsetY=15;
		TipManager.tipTextColor="#ffffff";
		TipManager.tipBackColor="#111111";
		TipManager.tipDelay=200;
		return TipManager;
	})(Component)


	//class laya.debug.tools.debugUI.DButton extends laya.display.Text
	var DButton=(function(_super){
		function DButton(){
			DButton.__super.call(this);
			this.bgColor="#ffff00";
			this.wordWrap=false;
			this.mouseEnabled=true;
		}

		__class(DButton,'laya.debug.tools.debugUI.DButton',_super);
		return DButton;
	})(Text)


	//class laya.display.Input extends laya.display.Text
	var Input=(function(_super){
		function Input(){
			this._focus=false;
			this._multiline=false;
			this._editable=true;
			this._restrictPattern=null;
			this._type="text";
			this._prompt='';
			this._promptColor="#A9A9A9";
			this._originColor="#000000";
			this._content='';
			Input.__super.call(this);
			this._maxChars=1E5;
			this._width=100;
			this._height=20;
			this.multiline=false;
			this.overflow=Text.SCROLL;
			this.on("mousedown",this,this._onMouseDown);
			this.on("undisplay",this,this._onUnDisplay);
		}

		__class(Input,'laya.display.Input',_super);
		var __proto=Input.prototype;
		/**
		*设置光标位置和选取字符。
		*@param startIndex 光标起始位置。
		*@param endIndex 光标结束位置。
		*/
		__proto.setSelection=function(startIndex,endIndex){
			laya.display.Input.inputElement.selectionStart=startIndex;
			laya.display.Input.inputElement.selectionEnd=endIndex;
		}

		__proto._onUnDisplay=function(e){
			this.focus=false;
		}

		__proto._onMouseDown=function(e){
			this.focus=true;
		}

		/**@inheritDoc*/
		__proto.render=function(context,x,y){
			laya.display.Sprite.prototype.render.call(this,context,x,y);
		}

		/**
		*在输入期间，如果 Input 实例的位置改变，调用_syncInputTransform同步输入框的位置。
		*/
		__proto._syncInputTransform=function(){
			var inputElement=this.nativeInput;
			var transform=Utils.getTransformRelativeToWindow(this,this.padding[3],this.padding[0]);
			var inputWid=this._width-this.padding[1]-this.padding[3];
			var inputHei=this._height-this.padding[0]-this.padding[2];
			if (Render.isConchApp){
				inputElement.setScale(transform.scaleX,transform.scaleY);
				inputElement.setSize(inputWid,inputHei);
				inputElement.setPos(transform.x,transform.y);
				}else {
				Input.inputContainer.style.transform=Input.inputContainer.style.webkitTransform="scale("+transform.scaleX+","+transform.scaleY+") rotate("+(Laya.stage.canvasDegree)+"deg)";
				inputElement.style.width=inputWid+'px';
				inputElement.style.height=inputHei+'px';
				Input.inputContainer.style.left=transform.x+'px';
				Input.inputContainer.style.top=transform.y+'px';
			}
		}

		/**选中当前实例的所有文本。*/
		__proto.select=function(){
			this.nativeInput.select();
		}

		__proto._setInputMethod=function(){
			Input.input.parentElement && (Input.inputContainer.removeChild(Input.input));
			Input.area.parentElement && (Input.inputContainer.removeChild(Input.area));
			Input.inputElement=(this._multiline ? Input.area :Input.input);
			Input.inputContainer.appendChild(Input.inputElement);
		}

		__proto._focusIn=function(){
			laya.display.Input.isInputting=true;
			var input=this.nativeInput;
			this._focus=true;
			var cssStyle=input.style;
			cssStyle.whiteSpace=(this.wordWrap ? "pre-wrap" :"nowrap");
			this._setPromptColor();
			input.readOnly=!this._editable;
			if (Render.isConchApp){
				input.setForbidEdit(!this._editable);
			}
			input.maxLength=this._maxChars;
			var padding=this.padding;
			input.type=this._type;
			input.value=this._content;
			input.placeholder=this._prompt;
			Laya.stage.off("keydown",this,this._onKeyDown);
			Laya.stage.on("keydown",this,this._onKeyDown);
			Laya.stage.focus=this;
			this.event("focus");
			if (Browser.onPC)input.focus();
			var temp=this._text;
			this._text=null;
			this.typeset();
			input.setColor(this._originColor);
			input.setFontSize(this.fontSize);
			input.setFontFace(this.font);
			if (Render.isConchApp){
				input.setMultiAble && input.setMultiAble(this._multiline);
			}
			cssStyle.lineHeight=(this.leading+this.fontSize)+"px";
			cssStyle.fontStyle=(this.italic ? "italic" :"normal");
			cssStyle.fontWeight=(this.bold ? "bold" :"normal");
			cssStyle.textAlign=this.align;
			cssStyle.padding="0 0";
			this._syncInputTransform();
			if (!Render.isConchApp && Browser.onPC)
				Laya.timer.frameLoop(1,this,this._syncInputTransform);
		}

		// 设置DOM输入框提示符颜色。
		__proto._setPromptColor=function(){
			Input.promptStyleDOM=Browser.getElementById("promptStyle");
			if (!Input.promptStyleDOM){
				Input.promptStyleDOM=Browser.createElement("style");
				Input.promptStyleDOM.setAttribute("id","promptStyle");
				Browser.document.head.appendChild(Input.promptStyleDOM);
			}
			Input.promptStyleDOM.innerText="input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {"+"color:"+this._promptColor+"}"+"input:-moz-placeholder, textarea:-moz-placeholder {"+"color:"+this._promptColor+"}"+"input::-moz-placeholder, textarea::-moz-placeholder {"+"color:"+this._promptColor+"}"+"input:-ms-input-placeholder, textarea:-ms-input-placeholder {"+"color:"+this._promptColor+"}";
		}

		/**@private */
		__proto._focusOut=function(){
			laya.display.Input.isInputting=false;
			this._focus=false;
			this._text=null;
			this._content=this.nativeInput.value;
			if (!this._content){
				_super.prototype._$set_text.call(this,this._prompt);
				_super.prototype._$set_color.call(this,this._promptColor);
				}else {
				_super.prototype._$set_text.call(this,this._content);
				_super.prototype._$set_color.call(this,this._originColor);
			}
			Laya.stage.off("keydown",this,this._onKeyDown);
			Laya.stage.focus=null;
			this.event("blur");
			if (Render.isConchApp)this.nativeInput.blur();
			Browser.onPC && Laya.timer.clear(this,this._syncInputTransform);
		}

		/**@private */
		__proto._onKeyDown=function(e){
			if (e.keyCode===13){
				if (Browser.onMobile && !this._multiline)
					this.focus=false;
				this.event("enter");
			}
		}

		__proto.changeText=function(text){
			this._content=text;
			if (this._focus){
				this.nativeInput.value=text || '';
				this.event("change");
			}else
			_super.prototype.changeText.call(this,text);
		}

		/**@inheritDoc */
		__getset(0,__proto,'color',_super.prototype._$get_color,function(value){
			if (this._focus)
				this.nativeInput.setColor(value);
			_super.prototype._$set_color.call(this,this._content?value:this._promptColor);
			this._originColor=value;
		});

		//[Deprecated]
		__getset(0,__proto,'inputElementYAdjuster',function(){
			console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementYAdjuster已弃用。");
			return 0;
			},function(value){
			console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementYAdjuster已弃用。");
		});

		/**表示是否是多行输入框。*/
		__getset(0,__proto,'multiline',function(){
			return this._multiline;
			},function(value){
			this._multiline=value;
			this.valign=value ? "top" :"middle";
		});

		/**
		*<p>字符数量限制，默认为10000。</p>
		*<p>设置字符数量限制时，小于等于0的值将会限制字符数量为10000。</p>
		*/
		__getset(0,__proto,'maxChars',function(){
			return this._maxChars;
			},function(value){
			if (value <=0)
				value=1E5;
			this._maxChars=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'text',function(){
			if (this._focus)
				return this.nativeInput.value;
			else
			return this._content || "";
			},function(value){
			_super.prototype._$set_color.call(this,this._originColor);
			value+='';
			if (this._focus){
				this.nativeInput.value=value || '';
				this.event("change");
				}else {
				if (!this._multiline)
					value=value.replace(/\r?\n/g,'');
				this._content=value;
				if (value)
					_super.prototype._$set_text.call(this,value);
				else {
					_super.prototype._$set_text.call(this,this._prompt);
					_super.prototype._$set_color.call(this,this.promptColor);
				}
			}
		});

		/**
		*获取对输入框的引用实例。
		*/
		__getset(0,__proto,'nativeInput',function(){
			return this._multiline ? Input.area :Input.input;
		});

		/**
		*设置输入提示符。
		*/
		__getset(0,__proto,'prompt',function(){
			return this._prompt;
			},function(value){
			if (!this._text && value)
				_super.prototype._$set_color.call(this,this._promptColor);
			this.promptColor=this._promptColor;
			if (this._text)
				_super.prototype._$set_text.call(this,(this._text==this._prompt)?value:this._text);
			else
			_super.prototype._$set_text.call(this,value);
			this._prompt=Text.langPacks && Text.langPacks[value] ? Text.langPacks[value] :value;
		});

		// 因此 调用focus接口是无法都在移动平台立刻弹出键盘的
		/**
		*表示焦点是否在此实例上。
		*/
		__getset(0,__proto,'focus',function(){
			return this._focus;
			},function(value){
			var input=this.nativeInput;
			if (this._focus!==value){
				if (value){
					if (input.target){
						input.target._focusOut();
						}else {
						this._setInputMethod();
					}
					input.target=this;
					this._focusIn();
					}else {
					input.target=null;
					this._focusOut();
					input.blur();
					if (Render.isConchApp){
						input.setPos(-10000,-10000);
					}else if (Input.inputContainer.contains(input))
					Input.inputContainer.removeChild(input);
				}
			}
		});

		/**限制输入的字符。*/
		__getset(0,__proto,'restrict',function(){
			if (this._restrictPattern){
				return this._restrictPattern.source;
			}
			return "";
			},function(pattern){
			if (pattern){
				pattern="[^"+pattern+"]";
				if (pattern.indexOf("^^")>-1)
					pattern=pattern.replace("^^","");
				this._restrictPattern=new RegExp(pattern,"g");
			}else
			this._restrictPattern=null;
		});

		/**
		*是否可编辑。
		*/
		__getset(0,__proto,'editable',function(){
			return this._editable;
			},function(value){
			this._editable=value;
			if (Render.isConchApp){
				Input.input.setForbidEdit(!value);
			}
		});

		/**
		*设置输入提示符颜色。
		*/
		__getset(0,__proto,'promptColor',function(){
			return this._promptColor;
			},function(value){
			this._promptColor=value;
			if (!this._content)_super.prototype._$set_color.call(this,value);
		});

		/**
		*<p>输入框类型为Input静态常量之一。</p>
		*<ul>
		*<li>TYPE_TEXT</li>
		*<li>TYPE_PASSWORD</li>
		*<li>TYPE_EMAIL</li>
		*<li>TYPE_URL</li>
		*<li>TYPE_NUMBER</li>
		*<li>TYPE_RANGE</li>
		*<li>TYPE_DATE</li>
		*<li>TYPE_MONTH</li>
		*<li>TYPE_WEEK</li>
		*<li>TYPE_TIME</li>
		*<li>TYPE_DATE_TIME</li>
		*<li>TYPE_DATE_TIME_LOCAL</li>
		*</ul>
		*<p>平台兼容性参见http://www.w3school.com.cn/html5/html_5_form_input_types.asp。</p>
		*/
		__getset(0,__proto,'type',function(){
			return this._type;
			},function(value){
			if (value=="password")
				this._getCSSStyle().password=true;
			else
			this._getCSSStyle().password=false;
			this._type=value;
		});

		/**
		*<p>原生输入框 X 轴调整值，用来调整输入框坐标。</p>
		*<p>由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementXAdjuster已弃用。</p>
		*@deprecated
		*/
		__getset(0,__proto,'inputElementXAdjuster',function(){
			console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementXAdjuster已弃用。");
			return 0;
			},function(value){
			console.warn("deprecated: 由于即使设置了该值，在各平台和浏览器之间也不一定一致，inputElementXAdjuster已弃用。");
		});

		//[Deprecated(replacement="Input.type")]
		__getset(0,__proto,'asPassword',function(){
			return this._getCSSStyle().password;
			},function(value){
			this._getCSSStyle().password=value;
			this._type="password";
			console.warn("deprecated: 使用type=\"password\"替代设置asPassword, asPassword将在下次重大更新时删去");
			this.isChanged=true;
		});

		Input.__init__=function(){
			Input._createInputElement();
			if (Browser.onMobile)
				Render.canvas.addEventListener(Input.IOS_IFRAME ? "click" :"touchend",Input._popupInputMethod);
		}

		Input._popupInputMethod=function(e){
			if (!laya.display.Input.isInputting)return;
			var input=laya.display.Input.inputElement;
			input.focus();
		}

		Input._createInputElement=function(){
			Input._initInput(Input.area=Browser.createElement("textarea"));
			Input._initInput(Input.input=Browser.createElement("input"));
			Input.inputContainer=Browser.createElement("div");
			Input.inputContainer.style.position="absolute";
			Input.inputContainer.style.zIndex=1E5;
			Browser.container.appendChild(Input.inputContainer);
			Input.inputContainer.setPos=function (x,y){Input.inputContainer.style.left=x+'px';Input.inputContainer.style.top=y+'px';};
		}

		Input._initInput=function(input){
			var style=input.style;
			style.cssText="position:absolute;overflow:hidden;resize:none;transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-o-transform-origin:0 0;";
			style.resize='none';
			style.backgroundColor='transparent';
			style.border='none';
			style.outline='none';
			style.zIndex=1;
			input.addEventListener('input',Input._processInputting);
			input.addEventListener('mousemove',Input._stopEvent);
			input.addEventListener('mousedown',Input._stopEvent);
			input.addEventListener('touchmove',Input._stopEvent);
			input.setFontFace=function (fontFace){input.style.fontFamily=fontFace;};
			if(!Render.isConchApp){
				input.setColor=function (color){input.style.color=color;};
				input.setFontSize=function (fontSize){input.style.fontSize=fontSize+'px';};
			}
		}

		Input._processInputting=function(e){
			var input=laya.display.Input.inputElement.target;
			if (!input)return;
			var value=laya.display.Input.inputElement.value;
			if (input._restrictPattern){
				value=value.replace(/\u2006|\x27/g,"");
				if (input._restrictPattern.test(value)){
					value=value.replace(input._restrictPattern,"");
					laya.display.Input.inputElement.value=value;
				}
			}
			input._text=value;
			input.event("input");
		}

		Input._stopEvent=function(e){
			if (e.type=='touchmove')
				e.preventDefault();
			e.stopPropagation && e.stopPropagation();
		}

		Input.TYPE_TEXT="text";
		Input.TYPE_PASSWORD="password";
		Input.TYPE_EMAIL="email";
		Input.TYPE_URL="url";
		Input.TYPE_NUMBER="number";
		Input.TYPE_RANGE="range";
		Input.TYPE_DATE="date";
		Input.TYPE_MONTH="month";
		Input.TYPE_WEEK="week";
		Input.TYPE_TIME="time";
		Input.TYPE_DATE_TIME="datetime";
		Input.TYPE_DATE_TIME_LOCAL="datetime-local";
		Input.TYPE_SEARCH="search";
		Input.input=null
		Input.area=null
		Input.inputElement=null
		Input.inputContainer=null
		Input.confirmButton=null
		Input.promptStyleDOM=null
		Input.inputHeight=45;
		Input.isInputting=false;
		Input.stageMatrix=null
		__static(Input,
		['IOS_IFRAME',function(){return this.IOS_IFRAME=(Browser.onIOS && Browser.window.top !=Browser.window.self);}
		]);
		return Input;
	})(Text)


	//class laya.debug.view.nodeInfo.recinfos.ReCacheRecInfo extends laya.debug.view.nodeInfo.recinfos.NodeRecInfo
	var ReCacheRecInfo=(function(_super){
		function ReCacheRecInfo(){
			this.isWorking=false;
			this.count=0;
			this.mTime=0;
			ReCacheRecInfo.__super.call(this);
			this.txt.fontSize=12;
		}

		__class(ReCacheRecInfo,'laya.debug.view.nodeInfo.recinfos.ReCacheRecInfo',_super);
		var __proto=ReCacheRecInfo.prototype;
		__proto.addCount=function(time){
			(time===void 0)&& (time=0);
			this.count++;
			this.mTime+=time;
			if (!this.isWorking){
				this.working=true;
			}
		}

		__proto.updates=function(){
			if (!this._tar["displayedInStage"]){
				this.working=false;
				this.removeSelf();
			}
			this.txt.text=ClassTool.getNodeClassAndName(this._tar)+"\n"+"reCache:"+this.count+"\ntime:"+this.mTime;
			if (this.count > 0){
				this.fresh();
				Laya.timer.clear(this,this.removeSelfLater);
				}else{
				this.working=false;
				Laya.timer.once(3000,this,this.removeSelfLater);
			}
			this.count=0;
			this.mTime=0;
		}

		__proto.removeSelfLater=function(){
			this.working=false;
			this.removeSelf();
		}

		__getset(0,__proto,'working',null,function(v){
			this.isWorking=v;
			if (v){
				Laya.timer.loop(1000,this,this.updates);
				}else{
				Laya.timer.clear(this,this.updates);
			}
		});

		ReCacheRecInfo.showTime=3000;
		return ReCacheRecInfo;
	})(NodeRecInfo)


	//class laya.display.Animation extends laya.display.AnimationPlayerBase
	var Animation$1=(function(_super){
		function Animation(){
			this._frames=null;
			this._url=null;
			Animation.__super.call(this);
			this._setControlNode(this);
		}

		__class(Animation,'laya.display.Animation',_super,'Animation$1');
		var __proto=Animation.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this.stop();
			laya.display.Sprite.prototype.destroy.call(this,destroyChild);
			this._frames=null;
			this._labels=null;
		}

		/**
		*<p>开始播放动画。会在动画模版缓存池中查找key值为name的动画模版，存在则用此动画模版初始化当前序列帧， 如果不存在，则使用当前序列帧。</p>
		*<p>play(...)方法被设计为在创建实例后的任何时候都可以被调用，调用后就处于播放状态，当相应的资源加载完毕、调用动画帧填充方法(set frames)或者将实例显示在舞台上时，会判断是否处于播放状态，如果是，则开始播放。</p>
		*<p>配合wrapMode属性，可设置动画播放顺序类型。</p>
		*@param start （可选）指定动画播放开始的索引(int)或帧标签(String)。帧标签可以通过addLabel(...)和removeLabel(...)进行添加和删除。
		*@param loop （可选）是否循环播放。
		*@param name （可选）动画模板在动画模版缓存池中的key，也可认为是动画名称。如果name为空，则播放当前动画序列帧；如果不为空，则在动画模版缓存池中寻找key值为name的动画模版，如果存在则用此动画模版初始化当前序列帧并播放，如果不存在，则仍然播放当前动画序列帧；如果没有当前动画的帧数据，则不播放，但该实例仍然处于播放状态。
		*/
		__proto.play=function(start,loop,name){
			(start===void 0)&& (start=0);
			(loop===void 0)&& (loop=true);
			(name===void 0)&& (name="");
			if (name)this._setFramesFromCache(name);
			this._isPlaying=true;
			this.index=((typeof start=='string'))? this._getFrameByLabel(start):start;
			this.loop=loop;
			this._actionName=name;
			this._isReverse=this.wrapMode==1;
			if (this._frames && this.interval > 0){
				this.timerLoop(this.interval,this,this._frameLoop,null,true);
			}
		}

		/**@private */
		__proto._setFramesFromCache=function(name){
			var showWarn=name !="";
			if (this._url)name=this._url+"#"+name;
			if (name && Animation.framesMap[name]){
				var tAniO;
				tAniO=Animation.framesMap[name];
				if ((tAniO instanceof Array)){
					this._frames=Animation.framesMap[name];
					this._count=this._frames.length;
					}else {
					if (tAniO.nodeRoot){
						Animation.framesMap[name]=this._parseGraphicAnimationByData(tAniO);
						tAniO=Animation.framesMap[name];
					}
					this._frames=tAniO.frames;
					this._count=this._frames.length;
					if (!this._frameRateChanged)this._interval=tAniO.interval;
					this._labels=this._copyLabels(tAniO.labels);
				}
				return true;
				}else {
				if (showWarn)console.log("ani not found:",name);
			}
			return false;
		}

		/**@private */
		__proto._copyLabels=function(labels){
			if (!labels)return null;
			var rst;
			rst={};
			var key;
			for (key in labels){
				rst[key]=Utils.copyArray([],labels[key]);
			}
			return rst;
		}

		/**@private */
		__proto._frameLoop=function(){
			if (this._style.visible && this._style.alpha > 0.01){
				_super.prototype._frameLoop.call(this);
			}
		}

		/**@private */
		__proto._displayToIndex=function(value){
			if (this._frames)this.graphics=this._frames[value];
		}

		/**
		*停止动画播放，并清理对象属性。之后可存入对象池，方便对象复用。
		*/
		__proto.clear=function(){
			this.stop();
			this.graphics=null;
			this._frames=null;
			this._labels=null;
		}

		/**
		*<p>根据指定的动画模版初始化当前动画序列帧。选择动画模版的过程如下：1. 动画模版缓存池中key为cacheName的动画模版；2. 如果不存在，则加载指定的图片集合并创建动画模版。注意：只有指定不为空的cacheName，才能将创建好的动画模版以此为key缓存到动画模版缓存池，否则不进行缓存。<p/>
		*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
		*<p>因为返回值为Animation对象本身，所以可以使用如下语法：loadImages(...).loadImages(...).play(...);。</p>
		*@param urls 图片路径集合。需要创建动画模版时，会以此为数据源。参数形如：[url1,url2,url3,...]。
		*@param cacheName （可选）动画模板在动画模版缓存池中的key。如果此参数不为空，表示使用动画模版缓存池。如果动画模版缓存池中存在key为cacheName的动画模版，则使用此模版。否则，创建新的动画模版，如果cacheName不为空，则以cacheName为key缓存到动画模版缓存池中，如果cacheName为空，不进行缓存。
		*@return 返回Animation对象本身。
		*/
		__proto.loadImages=function(urls,cacheName){
			(cacheName===void 0)&& (cacheName="");
			this._url="";
			if (!this._setFramesFromCache(cacheName)){
				this.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(urls,cacheName);
			}
			return this;
		}

		/**
		*<p>根据指定的动画模版初始化当前动画序列帧。选择动画模版的过程如下：1. 动画模版缓存池中key为cacheName的动画模版；2. 如果不存在，则加载指定的图集并创建动画模版。</p>
		*<p>注意：只有指定不为空的cacheName，才能将创建好的动画模版以此为key缓存到动画模版缓存池，否则不进行缓存。<p/>
		*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
		*<p>因为返回值为Animation对象本身，所以可以使用如下语法：loadAtlas(...).loadAtlas(...).play(...);。</p>
		*@param url 图集路径。需要创建动画模版时，会以此为数据源。
		*@param loaded （可选）使用指定图集初始化动画完毕的回调。
		*@param cacheName （可选）动画模板在动画模版缓存池中的key。如果此参数不为空，表示使用动画模版缓存池。如果动画模版缓存池中存在key为cacheName的动画模版，则使用此模版。否则，创建新的动画模版，如果cacheName不为空，则以cacheName为key缓存到动画模版缓存池中，如果cacheName为空，不进行缓存。
		*@return 返回动画本身。
		*/
		__proto.loadAtlas=function(url,loaded,cacheName){
			(cacheName===void 0)&& (cacheName="");
			this._url="";
			var _this=this;
			if (!_this._setFramesFromCache(cacheName)){
				function onLoaded (loadUrl){
					if (url===loadUrl){
						_this.frames=Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] :Animation.createFrames(url,cacheName);
						if (loaded)loaded.run();
					}
				}
				if (Loader.getAtlas(url))onLoaded(url);
				else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,"atlas");
			}
			return this;
		}

		/**
		*<p>加载并解析由LayaAir IDE制作的动画文件，此文件中可能包含多个动画。默认帧率为在IDE中设计的帧率，如果调用过set interval，则使用此帧间隔对应的帧率。加载后创建动画模版，并缓存到动画模版缓存池，key "url#动画名称" 对应相应动画名称的动画模板，key "url#" 对应动画模版集合的默认动画模版。</p>
		*<p>注意：如果调用本方法前，还没有预加载动画使用的图集，请将atlas参数指定为对应的图集路径，否则会导致动画创建失败。</p>
		*<p>动画模版缓存池是以一定的内存开销来节省CPU开销，当相同的动画模版被多次使用时，相比于每次都创建新的动画模版，使用动画模版缓存池，只需创建一次，缓存之后多次复用，从而节省了动画模版创建的开销。</p>
		*<p>因为返回值为Animation对象本身，所以可以使用如下语法：loadAnimation(...).loadAnimation(...).play(...);。</p>
		*@param url 动画文件路径。可由LayaAir IDE创建并发布。
		*@param loaded （可选）使用指定动画资源初始化动画完毕的回调。
		*@param atlas （可选）动画用到的图集地址（可选）。
		*@return 返回动画本身。
		*/
		__proto.loadAnimation=function(url,loaded,atlas){
			this._url=url;
			var _this=this;
			if (!this._actionName)this._actionName="";
			if (!_this._setFramesFromCache("")){
				if (!atlas || Loader.getAtlas(atlas)){
					this._loadAnimationData(url,loaded,atlas);
					}else {
					Laya.loader.load(atlas,Handler.create(this,this._loadAnimationData,[url,loaded,atlas]),null,"atlas")
				}
				}else {
				_this._setFramesFromCache(this._actionName);
				if (loaded)loaded.run();
			}
			return this;
		}

		/**@private */
		__proto._loadAnimationData=function(url,loaded,atlas){
			var _$this=this;
			if (atlas && !Loader.getAtlas(atlas)){
				console.warn("atlas load fail:"+atlas);
				return;
			};
			var _this=this;
			function onLoaded (loadUrl){
				if (!Loader.getRes(loadUrl))return;
				if (url===loadUrl){
					var tAniO;
					if (!Animation.framesMap[url+"#"]){
						var aniData=_this._parseGraphicAnimation(Loader.getRes(url));
						if (!aniData)return;
						var aniList=aniData.animationList;
						var i=0,len=aniList.length;
						var defaultO;
						for (i=0;i < len;i++){
							tAniO=aniList[i];
							Animation.framesMap[url+"#"+tAniO.name]=tAniO;
							if (!defaultO)defaultO=tAniO;
						}
						if (defaultO){
							Animation.framesMap[url+"#"]=defaultO;
							_this._setFramesFromCache(_$this._actionName);
							_$this.index=0;
						}
						_$this._checkResumePlaying();
						}else {
						_this._setFramesFromCache(_$this._actionName);
						_$this.index=0;
						_$this._checkResumePlaying();
					}
					if (loaded)loaded.run();
				}
			}
			if (Loader.getRes(url))onLoaded(url);
			else Laya.loader.load(url,Handler.create(null,onLoaded,[url]),null,"json");
			Loader.clearRes(url);
		}

		/**@private */
		__proto._parseGraphicAnimation=function(animationData){
			return GraphicAnimation.parseAnimationData(animationData)
		}

		/**@private */
		__proto._parseGraphicAnimationByData=function(animationObject){
			return GraphicAnimation.parseAnimationByData(animationObject);
		}

		/**
		*当前动画的帧图像数组。本类中，每个帧图像是一个Graphics对象，而动画播放就是定时切换Graphics对象的过程。
		*/
		__getset(0,__proto,'frames',function(){
			return this._frames;
			},function(value){
			this._frames=value;
			if (value){
				this._count=value.length;
				if (this._isPlaying)this.play(this._index,this.loop,this._actionName);
				else this.index=this._index;
			}
		});

		/**
		*是否自动播放，默认为false。如果设置为true，则动画被创建并添加到舞台后自动播放。
		*/
		__getset(0,__proto,'autoPlay',null,function(value){
			if (value)this.play();
			else this.stop();
		});

		/**
		*<p>动画数据源。</p>
		*<p>
		*类型如下：<br/>
		*1. LayaAir IDE动画文件路径：使用此类型需要预加载所需的图集资源，否则会创建失败，如果不想预加载或者需要创建完毕的回调，请使用loadAnimation(...)方法；<br/>
		*2. 图集路径：使用此类型创建的动画模版不会被缓存到动画模版缓存池中，如果需要缓存或者创建完毕的回调，请使用loadAtlas(...)方法；<br/>
		*3. 图片路径集合：使用此类型创建的动画模版不会被缓存到动画模版缓存池中，如果需要缓存，请使用loadImages(...)方法。
		*</p>
		*@param value 数据源。比如：图集："xx/a1.atlas"；图片集合："a1.png,a2.png,a3.png"；LayaAir IDE动画"xx/a1.ani"。
		*/
		__getset(0,__proto,'source',null,function(value){
			if (value.indexOf(".ani")>-1)this.loadAnimation(value);
			else if (value.indexOf(".json")>-1 || value.indexOf("als")>-1 || value.indexOf("atlas")>-1)this.loadAtlas(value);
			else this.loadImages(value.split(","));
		});

		/**
		*设置自动播放的动画名称，在LayaAir IDE中可以创建的多个动画组成的动画集合，选择其中一个动画名称进行播放。
		*/
		__getset(0,__proto,'autoAnimation',null,function(value){
			this.play(0,true,value);
		});

		Animation.createFrames=function(url,name){
			var arr;
			if ((typeof url=='string')){
				var atlas=Loader.getAtlas(url);
				if (atlas && atlas.length){
					arr=[];
					for (var i=0,n=atlas.length;i < n;i++){
						var g=new Graphics();
						g.drawTexture(Loader.getRes(atlas[i]),0,0);
						arr.push(g);
					}
				}
				}else if ((url instanceof Array)){
				arr=[];
				for (i=0,n=url.length;i < n;i++){
					g=new Graphics();
					g.loadImage(url[i],0,0);
					arr.push(g);
				}
			}
			if (name)Animation.framesMap[name]=arr;
			return arr;
		}

		Animation.clearCache=function(key){
			var cache=Animation.framesMap;
			var val;
			var key2=key+"#";
			for (val in cache){
				if (val===key || val.indexOf(key2)==0){
					delete Animation.framesMap[val];
				}
			}
		}

		Animation.framesMap={};
		return Animation;
	})(AnimationPlayerBase)


	//class laya.display.FrameAnimation extends laya.display.AnimationPlayerBase
	var FrameAnimation=(function(_super){
		function FrameAnimation(){
			this._targetDic=null;
			this._animationData=null;
			this._animationNewFrames=null;
			FrameAnimation.__super.call(this);
			if (FrameAnimation._sortIndexFun==null){
				FrameAnimation._sortIndexFun=MathUtil.sortByKey("index",false,true);
			}
		}

		__class(FrameAnimation,'laya.display.FrameAnimation',_super);
		var __proto=FrameAnimation.prototype;
		/**
		*@private
		*初始化动画数据
		*@param targetDic 对象表
		*@param animationData 动画数据
		*
		*/
		__proto._setUp=function(targetDic,animationData){
			this._labels=null;
			this._animationNewFrames=null;
			this._targetDic=targetDic;
			this._animationData=animationData;
			this.interval=1000 / animationData.frameRate;
			if (animationData.parsed){
				this._count=animationData.count;
				this._labels=animationData.labels;
				this._animationNewFrames=animationData.animationNewFrames;
				}else {
				this._animationNewFrames=[];
				this._calculateDatas();
			}
			animationData.parsed=true;
			animationData.labels=this._labels;
			animationData.count=this._count;
			animationData.animationNewFrames=this._animationNewFrames;
		}

		/**@inheritDoc */
		__proto.clear=function(){
			_super.prototype.clear.call(this);
			this._targetDic=null;
			this._animationData=null;
		}

		/**@inheritDoc */
		__proto._displayToIndex=function(value){
			if (!this._animationData)return;
			if (value < 0)value=0;
			if (value > this._count)value=this._count;
			var nodes=this._animationData.nodes,i=0,len=nodes.length;
			for (i=0;i < len;i++){
				this._displayNodeToFrame(nodes[i],value);
			}
		}

		/**
		*@private
		*将节点设置到某一帧的状态
		*@param node 节点ID
		*@param frame
		*@param targetDic 节点表
		*
		*/
		__proto._displayNodeToFrame=function(node,frame,targetDic){
			if (!targetDic)targetDic=this._targetDic;
			var target=targetDic[node.target];
			if (!target){
				return;
			};
			var frames=node.frames,key,propFrames,value;
			var keys=node.keys,i=0,len=keys.length;
			for (i=0;i < len;i++){
				key=keys[i];
				propFrames=frames[key];
				if (propFrames.length > frame){
					value=propFrames[frame];
					}else {
					value=propFrames[propFrames.length-1];
				}
				target[key]=value;
			}
		}

		/**
		*@private
		*计算帧数据
		*
		*/
		__proto._calculateDatas=function(){
			if (!this._animationData)return;
			var nodes=this._animationData.nodes,i=0,len=nodes.length,tNode;
			this._count=0;
			for (i=0;i < len;i++){
				tNode=nodes[i];
				this._calculateNodeKeyFrames(tNode);
			}
			this._count+=1;
		}

		/**
		*@private
		*计算某个节点的帧数据
		*@param node
		*
		*/
		__proto._calculateNodeKeyFrames=function(node){
			var keyFrames=node.keyframes,key,tKeyFrames,target=node.target;
			if (!node.frames){
				node.frames={};
			}
			if (!node.keys){
				node.keys=[];
				}else {
				node.keys.length=0;
			}
			if (!node.initValues){
				node.initValues={};
			}
			for (key in keyFrames){
				tKeyFrames=keyFrames[key];
				if (!node.frames[key]){
					node.frames[key]=[];
				}
				if (this._targetDic && this._targetDic[target]){
					node.initValues[key]=this._targetDic[target][key];
				}
				tKeyFrames.sort(FrameAnimation._sortIndexFun);
				node.keys.push(key);
				this._calculateNodePropFrames(tKeyFrames,node.frames[key],key,target);
			}
		}

		/**
		*将动画控制对象还原到动画控制之前的状态
		*/
		__proto.resetToInitState=function(){
			if (!this._targetDic)return;
			if (!this._animationData)return;
			var nodes=this._animationData.nodes,i=0,len=nodes.length;
			var tNode;
			var initValues;
			for (i=0;i < len;i++){
				tNode=nodes[i];
				initValues=tNode.initValues;
				if (!initValues)continue ;
				var target=this._targetDic[tNode.target];
				if (!target)continue ;
				var key;
				for (key in initValues){
					target[key]=initValues[key];
				}
			}
		}

		/**
		*@private
		*计算节点某个属性的帧数据
		*@param keyframes
		*@param frames
		*@param key
		*@param target
		*
		*/
		__proto._calculateNodePropFrames=function(keyframes,frames,key,target){
			var i=0,len=keyframes.length-1;
			frames.length=keyframes[len].index+1;
			for (i=0;i < len;i++){
				this._dealKeyFrame(keyframes[i]);
				this._calculateFrameValues(keyframes[i],keyframes[i+1],frames);
			}
			if (len==0){
				frames[0]=keyframes[0].value;
				if (this._animationNewFrames)
					this._animationNewFrames[keyframes[0].index]=true;
			}
			this._dealKeyFrame(keyframes[i]);
		}

		/**
		*@private
		*
		*/
		__proto._dealKeyFrame=function(keyFrame){
			if (keyFrame.label && keyFrame.label !="")this.addLabel(keyFrame.label,keyFrame.index);
		}

		/**
		*@private
		*计算两个关键帧直接的帧数据
		*@param startFrame
		*@param endFrame
		*@param result
		*
		*/
		__proto._calculateFrameValues=function(startFrame,endFrame,result){
			var i=0,easeFun;
			var start=startFrame.index,end=endFrame.index;
			var startValue=startFrame.value;
			var dValue=endFrame.value-startFrame.value;
			var dLen=end-start;
			if (end > this._count)this._count=end;
			if (startFrame.tween){
				easeFun=Ease[startFrame.tweenMethod];
				if (easeFun==null){
					easeFun=Ease.linearNone;
				}
				for (i=start;i < end;i++){
					result[i]=easeFun(i-start,startValue,dValue,dLen);
					if (this._animationNewFrames){
						this._animationNewFrames[i]=true;
					}
				}
				}else {
				for (i=start;i < end;i++){
					result[i]=startValue;
				}
			}
			if (this._animationNewFrames){
				this._animationNewFrames[startFrame.index]=true;
				this._animationNewFrames[endFrame.index]=true;
			}
			result[endFrame.index]=endFrame.value;
		}

		FrameAnimation._sortIndexFun=null
		return FrameAnimation;
	})(AnimationPlayerBase)


	//class laya.resource.HTMLImage extends laya.resource.FileBitmap
	var HTMLImage=(function(_super){
		function HTMLImage(src,def){
			this._recreateLock=false;
			this._needReleaseAgain=false;
			HTMLImage.__super.call(this);
			this._init_(src,def);
		}

		__class(HTMLImage,'laya.resource.HTMLImage',_super);
		var __proto=HTMLImage.prototype;
		__proto._init_=function(src,def){
			this._src=src;
			this._source=new Browser.window.Image();
			if (def){
				def.onload && (this.onload=def.onload);
				def.onerror && (this.onerror=def.onerror);
				def.onCreate && def.onCreate(this);
			}
			if (src.indexOf("data:image")!=0)this._source.crossOrigin="";
			(src)&& (this._source.src=src);
		}

		/**
		*@inheritDoc
		*/
		__proto.recreateResource=function(){
			var _$this=this;
			if (this._src==="")
				throw new Error("src no null！");
			this._needReleaseAgain=false;
			if (!this._source){
				this._recreateLock=true;
				this.startCreate();
				var _this=this;
				this._source=new Browser.window.Image();
				this._source.crossOrigin="";
				this._source.onload=function (){
					if (_this._needReleaseAgain){
						_this._needReleaseAgain=false;
						_this._source.onload=null;
						_this._source=null;
						return;
					}
					_this._source.onload=null;
					_this.memorySize=_$this._w *_$this._h *4;
					_this._recreateLock=false;
					_this.completeCreate();
				};
				this._source.src=this._src;
				}else {
				if (this._recreateLock)
					return;
				this.startCreate();
				this.memorySize=this._w *this._h *4;
				this._recreateLock=false;
				this.completeCreate();
			}
		}

		/**
		*@inheritDoc
		*/
		__proto.detoryResource=function(){
			if (this._recreateLock)
				this._needReleaseAgain=true;
			(this._source)&& (this._source=null,this.memorySize=0);
		}

		/***调整尺寸。*/
		__proto.onresize=function(){
			this._w=this._source.width;
			this._h=this._source.height;
		}

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'onload',null,function(value){
			var _$this=this;
			this._onload=value;
			this._source && (this._source.onload=this._onload !=null ? (function(){
				_$this.onresize();
				_$this._onload();
			}):null);
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'onerror',null,function(value){
			var _$this=this;
			this._onerror=value;
			this._source && (this._source.onerror=this._onerror !=null ? (function(){
				_$this._onerror()
			}):null);
		});

		HTMLImage.create=function(src,def){
			return new HTMLImage(src,def);
		}

		return HTMLImage;
	})(FileBitmap)


	//class laya.ui.View extends laya.ui.Box
	var View=(function(_super){
		function View(){
			this._idMap=null;
			this._aniList=null;
			View.__super.call(this);
		}

		__class(View,'laya.ui.View',_super);
		var __proto=View.prototype;
		/**
		*@private
		*通过视图数据创建视图。
		*@param uiView 视图数据信息。
		*/
		__proto.createView=function(uiView){
			if (uiView.animations && !this._idMap)this._idMap={};
			View.createComp(uiView,this,this);
			if (uiView.animations){
				var anilist=[];
				var animations=uiView.animations;
				var i=0,len=animations.length;
				var tAni;
				var tAniO;
				for (i=0;i < len;i++){
					tAni=new FrameAnimation();
					tAniO=animations[i];
					tAni._setUp(this._idMap,tAniO);
					this[tAniO.name]=tAni;
					tAni._setControlNode(this);
					switch (tAniO.action){
						case 1:
							tAni.play(0,false);
							break ;
						case 2:
							tAni.play(0,true);
							break ;
						}
					anilist.push(tAni);
				}
				this._aniList=anilist;
			}
			if (this._width > 0 && uiView.props.hitTestPrior==null && !this.mouseThrough)this.hitTestPrior=true;
		}

		/**
		*@private
		*装载UI视图。用于加载模式。
		*@param path UI资源地址。
		*/
		__proto.loadUI=function(path){
			var uiView=View.uiMap[path];
			uiView && this.createView(uiView);
		}

		/**
		*<p>销毁此对象。</p>
		*@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			if (this._aniList)this._aniList.length=0;
			this._idMap=null;
			this._aniList=null;
			laya.ui.Component.prototype.destroy.call(this,destroyChild);
		}

		View._regs=function(){
			var key;
			for (key in View.uiClassMap){
				ClassUtils.regClass(key,View.uiClassMap[key]);
			}
		}

		View.createComp=function(uiView,comp,view){
			comp=comp || View.getCompInstance(uiView);
			if (!comp){
				console.warn("can not create:"+uiView.type);
				return null;
			};
			var child=uiView.child;
			if (child){
				for (var i=0,n=child.length;i < n;i++){
					var node=child[i];
					if (comp.hasOwnProperty("itemRender")&& (node.props.name=="render" || node.props.renderType==="render")){
						(comp).itemRender=node;
						}else if (node.type=="Graphic"){
						ClassUtils.addGraphicsToSprite(node,comp);
						}else if (ClassUtils.isDrawType(node.type)){
						ClassUtils.addGraphicToSprite(node,comp,true);
						}else {
						var tChild=View.createComp(node,null,view);
						if (node.type=="Script"){
							if ("owner" in tChild){
								tChild["owner"]=comp;
								}else if ("target" in tChild){
								tChild["target"]=comp;
							}
							}else if (node.props.renderType=="mask" || node.props.name=="mask"){
							comp.mask=tChild;
							}else {(
							tChild instanceof laya.display.Sprite )&& comp.addChild(tChild);
						}
					}
				}
			};
			var props=uiView.props;
			for (var prop in props){
				var value=props[prop];
				View.setCompValue(comp,prop,value,view);
			}
			if (Laya.__typeof(comp,'laya.ui.IItem'))(comp).initItems();
			if (uiView.compId && view && view._idMap){
				view._idMap[uiView.compId]=comp;
			}
			return comp;
		}

		View.setCompValue=function(comp,prop,value,view){
			if (prop==="var" && view){
				view[value]=comp;
				}else {
				comp[prop]=(value==="true" ? true :(value==="false" ? false :value))
			}
		}

		View.getCompInstance=function(json){
			var runtime=json.props?json.props.runtime:null;
			var compClass;
			compClass=runtime ? (View.viewClassMap[runtime] || View.uiClassMap[runtime]|| Laya["__classmap"][runtime]):View.uiClassMap[json.type];
			if (json.props && json.props.hasOwnProperty("renderType")&& json.props["renderType"]=="instance")return compClass["instance"];
			return compClass ? new compClass():null;
		}

		View.regComponent=function(key,compClass){
			View.uiClassMap[key]=compClass;
			ClassUtils.regClass(key,compClass);
		}

		View.regViewRuntime=function(key,compClass){
			View.viewClassMap[key]=compClass;
		}

		View.uiMap={};
		View.viewClassMap={};
		__static(View,
		['uiClassMap',function(){return this.uiClassMap={"ViewStack":ViewStack,"LinkButton":Button,"TextArea":TextArea,"ColorPicker":ColorPicker,"Box":Box,"Button":Button,"CheckBox":CheckBox,"Clip":Clip,"ComboBox":ComboBox,"Component":Component,"HScrollBar":HScrollBar,"HSlider":HSlider,"Image":Image,"Label":Label,"List":List,"Panel":Panel,"ProgressBar":ProgressBar,"Radio":Radio,"RadioGroup":RadioGroup,"ScrollBar":ScrollBar,"Slider":Slider,"Tab":Tab,"TextInput":TextInput,"View":View,"VScrollBar":VScrollBar,"VSlider":VSlider,"Tree":Tree,"HBox":HBox,"VBox":VBox,"Sprite":Sprite,"Animation":Animation$1,"Text":Text,"FontClip":FontClip};}
		]);
		View.__init$=function(){
			View._regs()
		}

		return View;
	})(Box)


	//class laya.debug.uicomps.ContextMenu extends laya.ui.Box
	var ContextMenu=(function(_super){
		function ContextMenu(){
			this._tY=0;
			ContextMenu.__super.call(this);
			StyleConsts.setViewScale(this);
		}

		__class(ContextMenu,'laya.debug.uicomps.ContextMenu',_super);
		var __proto=ContextMenu.prototype;
		__proto.addItem=function(item){
			this.addChild(item);
			item.y=this._tY;
			this._tY+=item.height;
			item.on("mousedown",this,this.onClick);
		}

		__proto.onClick=function(e){
			this.event("select",e);
			this.removeSelf();
		}

		__proto.show=function(posX,posY){
			(posX===void 0)&& (posX=-999);
			(posY===void 0)&& (posY=-999);
			Laya.timer.once(100,this,ContextMenu.showMenu,[this,posX,posY]);
		}

		ContextMenu.init=function(){
			Laya.stage.on("click",null,ContextMenu.cleanMenu);
		}

		ContextMenu.cleanMenu=function(e){
			var i=0;
			var len=0;
			len=ContextMenu._menuList.length;
			for(i=0;i<len;i++){
				if(ContextMenu._menuList[i]){
					ContextMenu._menuList[i].removeSelf();
				}
			}
			ContextMenu._menuList.length=0;
		}

		ContextMenu.showMenu=function(menu,posX,posY){
			(posX===void 0)&& (posX=-999);
			(posY===void 0)&& (posY=-999);
			ContextMenu.cleanMenu();
			ContextMenu.adptMenu(menu);
			Laya.stage.addChild(menu);
			DisControlTool.showToStage(menu);
			if (posX !=-999 && posY !=-999){
				menu.pos(posX,posY);
			}
			ContextMenu._menuList.push(menu);
		}

		ContextMenu.createMenu=function(__args){
			var args=arguments;
			return ContextMenu.createMenuByArray(args);
		}

		ContextMenu.createMenuByArray=function(args){
			var menu=new ContextMenu();
			var separatorBefore=false;
			var item;
			for (var i=0,n=args.length;i < n;i++){
				var obj=args[i];
				var info={};
				if ((typeof obj=='string')){
					info.label=obj;
					}else {
					info=obj;
				}
				if (info.label !=""){
					item=new ContextMenuItem(info.label,separatorBefore);
					item.data=obj;
					menu.addItem(item);
					separatorBefore=false;
					}else {
					item=new ContextMenuItem("",separatorBefore);
					item.data=obj;
					menu.addItem(item);
					separatorBefore=true;
				}
			}
			menu.zOrder=9999;
			return menu;
		}

		ContextMenu.adptMenu=function(menu){
			var tWidth=80;
			var maxWidth=80;
			var i=0,len=menu.numChildren;
			for (i=0;i < len;i++){
				tWidth=(menu.getChildAt(i)).width;
				if (maxWidth < tWidth){
					maxWidth=tWidth;
				}
			}
			for (i=0;i < len;i++){
				(menu.getChildAt(i)).width=maxWidth;
			}
		}

		ContextMenu._menuList=[];
		return ContextMenu;
	})(Box)


	//class laya.ui.List extends laya.ui.Box
	var List=(function(_super){
		function List(){
			this.selectHandler=null;
			this.renderHandler=null;
			this.mouseHandler=null;
			this.selectEnable=false;
			this.totalPage=0;
			this._content=null;
			this._scrollBar=null;
			this._itemRender=null;
			this._repeatX=0;
			this._repeatY=0;
			this._repeatX2=0;
			this._repeatY2=0;
			this._spaceX=0;
			this._spaceY=0;
			this._array=null;
			this._startIndex=0;
			this._selectedIndex=-1;
			this._page=0;
			this._isVertical=true;
			this._cellSize=20;
			this._cellOffset=0;
			this._isMoved=false;
			this.cacheContent=false;
			this._createdLine=0;
			this._cellChanged=false;
			List.__super.call(this);
			this._cells=[];
			this._offset=new Point();
		}

		__class(List,'laya.ui.List',_super);
		var __proto=List.prototype;
		Laya.imps(__proto,{"laya.ui.IRender":true,"laya.ui.IItem":true})
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this._content && this._content.destroy(destroyChild);
			this._scrollBar && this._scrollBar.destroy(destroyChild);
			laya.ui.Component.prototype.destroy.call(this,destroyChild);
			this._content=null;
			this._scrollBar=null;
			this._itemRender=null;
			this._cells=null;
			this._array=null;
			this.selectHandler=this.renderHandler=this.mouseHandler=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._content=new Box());
		}

		__proto.onScrollStart=function(){
			this._$P.cacheAs || (this._$P.cacheAs=_super.prototype._$get_cacheAs.call(this));
			_super.prototype._$set_cacheAs.call(this,"none");
			this._scrollBar.once("end",this,this.onScrollEnd);
		}

		__proto.onScrollEnd=function(){
			_super.prototype._$set_cacheAs.call(this,this._$P.cacheAs);
		}

		__proto._removePreScrollBar=function(){
			var preNode=this.removeChildByName("scrollBar");
			if (preNode)preNode.destroy(true);
		}

		/**
		*@private
		*更改单元格的信息。
		*@internal 在此销毁、创建单元格，并设置单元格的位置等属性。相当于此列表内容发送改变时调用此函数。
		*/
		__proto.changeCells=function(){
			this._cellChanged=false;
			if (this._itemRender){
				this.scrollBar=this.getChildByName("scrollBar");
				var cell=this._getOneCell();
				var cellWidth=(cell.width+this._spaceX)|| 1;
				var cellHeight=(cell.height+this._spaceY)|| 1;
				if (this._width > 0)this._repeatX2=this._isVertical ? Math.round(this._width / cellWidth):Math.ceil(this._width / cellWidth);
				if (this._height > 0)this._repeatY2=this._isVertical ? Math.ceil(this._height / cellHeight):Math.round(this._height / cellHeight);
				var listWidth=this._width ? this._width :(cellWidth *this.repeatX-this._spaceX);
				var listHeight=this._height ? this._height :(cellHeight *this.repeatY-this._spaceY);
				this._cellSize=this._isVertical ? cellHeight :cellWidth;
				this._cellOffset=this._isVertical ? (cellHeight *Math.max(this._repeatY2,this._repeatY)-listHeight-this._spaceY):(cellWidth *Math.max(this._repeatX2,this._repeatX)-listWidth-this._spaceX);
				if (this._isVertical && this._scrollBar)this._scrollBar.height=listHeight;
				else if (!this._isVertical && this._scrollBar)this._scrollBar.width=listWidth;
				this.setContentSize(listWidth,listHeight);
				var numX=this._isVertical ? this.repeatX :this.repeatY;
				var numY=(this._isVertical ? this.repeatY :this.repeatX)+(this._scrollBar ? 1 :0);
				this._createItems(0,numX,numY);
				this._createdLine=numY;
				if (this._array){
					this.array=this._array;
					this.runCallLater(this.renderItems);
				}
			}
		}

		__proto._getOneCell=function(){
			if (this._cells.length===0){
				var item=this.createItem();
				this._offset.setTo(item.x,item.y);
				this._cells.push(item);
			}
			return this._cells[0];
		}

		__proto._createItems=function(startY,numX,numY){
			var box=this._content;
			var cell=this._getOneCell();
			var cellWidth=cell.width+this._spaceX;
			var cellHeight=cell.height+this._spaceY;
			if (this.cacheContent){
				var cacheBox=new Box();
				cacheBox.cacheAsBitmap=true;
				cacheBox.pos((this._isVertical ? 0 :startY)*cellWidth,(this._isVertical ? startY :0)*cellHeight);
				this._content.addChild(cacheBox);
				this._content.optimizeScrollRect=true;
				box=cacheBox;
			};
			var arr=[];
			for (var i=this._cells.length-1;i >-1;i--){
				var item=this._cells[i];
				item.removeSelf();
				arr.push(item);
			}
			this._cells.length=0;
			for (var k=startY;k < numY;k++){
				for (var l=0;l < numX;l++){
					if (arr.length){
						cell=arr.pop();
						}else {
						cell=this.createItem();
					}
					cell.x=(this._isVertical ? l :k)*cellWidth-box.x;
					cell.y=(this._isVertical ? k :l)*cellHeight-box.y;
					cell.name="item"+(k *numX+l);
					box.addChild(cell);
					this.addCell(cell);
				}
			}
		}

		__proto.createItem=function(){
			return (typeof this._itemRender=='function')? new this._itemRender():View.createComp(this._itemRender);
		}

		/**
		*@private
		*添加单元格。
		*@param cell 需要添加的单元格对象。
		*/
		__proto.addCell=function(cell){
			cell.on("click",this,this.onCellMouse);
			cell.on("rightclick",this,this.onCellMouse);
			cell.on("mouseover",this,this.onCellMouse);
			cell.on("mouseout",this,this.onCellMouse);
			cell.on("mousedown",this,this.onCellMouse);
			cell.on("mouseup",this,this.onCellMouse);
			this._cells.push(cell);
		}

		/**
		*初始化单元格信息。
		*/
		__proto.initItems=function(){
			if (!this._itemRender && this.getChildByName("item0")!=null){
				this.repeatX=1;
				var count=0;
				count=0;
				for (var i=0;i < 10000;i++){
					var cell=this.getChildByName("item"+i);
					if (cell){
						this.addCell(cell);
						count++;
						continue ;
					}
					break ;
				}
				this.repeatY=count;
			}
		}

		/**
		*设置可视区域大小。
		*<p>以（0，0，width参数，height参数）组成的矩形区域为可视区域。</p>
		*@param width 可视区域宽度。
		*@param height 可视区域高度。
		*/
		__proto.setContentSize=function(width,height){
			this._content.width=width;
			this._content.height=height;
			if (this._scrollBar||this._offset.x!=0||this._offset.y!=0){
				this._content.scrollRect || (this._content.scrollRect=new Rectangle());
				this._content.scrollRect.setTo(-this._offset.x,-this._offset.y,width,height);
				this._content.conchModel && this._content.conchModel.scrollRect(-this._offset.x,-this._offset.y,width,height);
			}
			this.event("resize");
		}

		/**
		*@private
		*单元格的鼠标事件侦听处理函数。
		*/
		__proto.onCellMouse=function(e){
			if (e.type==="mousedown")this._isMoved=false;
			var cell=e.currentTarget;
			var index=this._startIndex+this._cells.indexOf(cell);
			if (index < 0)return;
			if (e.type==="click" || e.type==="rightclick"){
				if (this.selectEnable && !this._isMoved)this.selectedIndex=index;
				else this.changeCellState(cell,true,0);
				}else if ((e.type==="mouseover" || e.type==="mouseout")&& this._selectedIndex!==index){
				this.changeCellState(cell,e.type==="mouseover",0);
			}
			this.mouseHandler && this.mouseHandler.runWith([e,index]);
		}

		/**
		*@private
		*改变单元格的可视状态。
		*@param cell 单元格对象。
		*@param visable 是否显示。
		*@param index 单元格的属性 <code>index</code> 值。
		*/
		__proto.changeCellState=function(cell,visable,index){
			var selectBox=cell.getChildByName("selectBox");
			if (selectBox){
				this.selectEnable=true;
				selectBox.visible=visable;
				selectBox.index=index;
			}
		}

		/**@inheritDoc */
		__proto.changeSize=function(){
			laya.ui.Component.prototype.changeSize.call(this);
			this.setContentSize(this.width,this.height);
			if (this._scrollBar)this.callLater(this.onScrollBarChange);
		}

		/**
		*@private
		*滚动条的 <code>Event.CHANGE</code> 事件侦听处理函数。
		*/
		__proto.onScrollBarChange=function(e){
			this.runCallLater(this.changeCells);
			var scrollValue=this._scrollBar.value;
			var lineX=(this._isVertical ? this.repeatX :this.repeatY);
			var lineY=(this._isVertical ? this.repeatY :this.repeatX);
			var scrollLine=Math.floor(scrollValue / this._cellSize);
			if (!this.cacheContent){
				var index=scrollLine *lineX;
				var num=0;
				if (index > this._startIndex){
					num=index-this._startIndex;
					var down=true;
					var toIndex=this._startIndex+lineX *(lineY+1);
					this._isMoved=true;
					}else if (index < this._startIndex){
					num=this._startIndex-index;
					down=false;
					toIndex=this._startIndex-1;
					this._isMoved=true;
				}
				for (var i=0;i < num;i++){
					if (down){
						var cell=this._cells.shift();
						this._cells[this._cells.length]=cell;
						var cellIndex=toIndex+i;
						}else {
						cell=this._cells.pop();
						this._cells.unshift(cell);
						cellIndex=toIndex-i;
					};
					var pos=Math.floor(cellIndex / lineX)*this._cellSize;
					this._isVertical ? cell.y=pos :cell.x=pos;
					this.renderItem(cell,cellIndex);
				}
				this._startIndex=index;
				this.changeSelectStatus();
				}else {
				num=(lineY+1);
				if (this._createdLine-scrollLine < num){
					this._createItems(this._createdLine,lineX,this._createdLine+num);
					this._createdLine+=num;
					this.renderItems(this._createdLine *lineX,0);
				}
			};
			var r=this._content.scrollRect;
			if (this._isVertical){
				r.y=scrollValue-this._offset.y;
				r.x=-this._offset.x;
				}else {
				r.y=-this._offset.y;
				r.x=scrollValue-this._offset.x;
			}
			this._content.conchModel && this._content.conchModel.scrollRect(r.x,r.y,r.width,r.height);
			this.repaint();
		}

		__proto.posCell=function(cell,cellIndex){
			if (!this._scrollBar)return;
			var lineX=(this._isVertical ? this.repeatX :this.repeatY);
			var lineY=(this._isVertical ? this.repeatY :this.repeatX);
			var pos=Math.floor(cellIndex / lineX)*this._cellSize;
			this._isVertical ? cell.y=pos :cell.x=pos;
		}

		/**
		*@private
		*改变单元格的选择状态。
		*/
		__proto.changeSelectStatus=function(){
			for (var i=0,n=this._cells.length;i < n;i++){
				this.changeCellState(this._cells[i],this._selectedIndex===this._startIndex+i,1);
			}
		}

		/**
		*@private
		*渲染单元格列表。
		*/
		__proto.renderItems=function(from,to){
			(from===void 0)&& (from=0);
			(to===void 0)&& (to=0);
			for (var i=from,n=to || this._cells.length;i < n;i++){
				this.renderItem(this._cells[i],this._startIndex+i);
			}
			this.changeSelectStatus();
		}

		/**
		*渲染一个单元格。
		*@param cell 需要渲染的单元格对象。
		*@param index 单元格索引。
		*/
		__proto.renderItem=function(cell,index){
			if (this._array&&index >=0 && index < this._array.length){
				cell.visible=true;
				cell.dataSource=this._array[index];
				if (!this.cacheContent){
					this.posCell(cell,index);
				}
				if (this.hasListener("render"))this.event("render",[cell,index]);
				if (this.renderHandler)this.renderHandler.runWith([cell,index]);
				}else {
				cell.visible=false;
				cell.dataSource=null;
			}
		}

		/**
		*刷新列表数据源。
		*/
		__proto.refresh=function(){
			this.startIndex=this._startIndex;
		}

		/**
		*获取单元格数据源。
		*@param index 单元格索引。
		*/
		__proto.getItem=function(index){
			if (index >-1 && index < this._array.length){
				return this._array[index];
			}
			return null;
		}

		/**
		*修改单元格数据源。
		*@param index 单元格索引。
		*@param source 单元格数据源。
		*/
		__proto.changeItem=function(index,source){
			if (index >-1 && index < this._array.length){
				this._array[index]=source;
				if (index >=this._startIndex && index < this._startIndex+this._cells.length){
					this.renderItem(this.getCell(index),index);
				}
			}
		}

		/**
		*设置单元格数据源。
		*@param index 单元格索引。
		*@param source 单元格数据源。
		*/
		__proto.setItem=function(index,source){
			this.changeItem(index,source);
		}

		/**
		*添加单元格数据源。
		*@param souce 数据源。
		*/
		__proto.addItem=function(souce){
			this._array.push(souce);
			this.array=this._array;
		}

		/**
		*添加单元格数据源到对应的数据索引处。
		*@param souce 单元格数据源。
		*@param index 索引。
		*/
		__proto.addItemAt=function(souce,index){
			this._array.splice(index,0,souce);
			this.array=this._array;
		}

		/**
		*通过数据源索引删除单元格数据源。
		*@param index 需要删除的数据源索引值。
		*/
		__proto.deleteItem=function(index){
			this._array.splice(index,1);
			this.array=this._array;
		}

		/**
		*通过可视单元格索引，获取单元格。
		*@param index 可视单元格索引。
		*@return 单元格对象。
		*/
		__proto.getCell=function(index){
			this.runCallLater(this.changeCells);
			if (index >-1 && this._cells){
				return this._cells[(index-this._startIndex)% this._cells.length];
			}
			return null;
		}

		/**
		*<p>滚动列表，以设定的数据索引对应的单元格为当前可视列表的第一项。</p>
		*@param index 单元格在数据列表中的索引。
		*/
		__proto.scrollTo=function(index){
			if (this._scrollBar){
				var numX=this._isVertical ? this.repeatX :this.repeatY;
				this._scrollBar.value=Math.floor(index / numX)*this._cellSize;
				}else {
				this.startIndex=index;
			}
		}

		/**
		*<p>缓动滚动列表，以设定的数据索引对应的单元格为当前可视列表的第一项。</p>
		*@param index 单元格在数据列表中的索引。
		*@param time 缓动时间。
		*@param complete 缓动结束回掉
		*/
		__proto.tweenTo=function(index,time,complete){
			(time===void 0)&& (time=200);
			if (this._scrollBar){
				var numX=this._isVertical ? this.repeatX :this.repeatY;
				Tween.to(this._scrollBar,{value:Math.floor(index / numX)*this._cellSize},time,null,complete,0,true);
				}else {
				this.startIndex=index;
				if (complete)complete.run();
			}
		}

		/**@private */
		__proto._setCellChanged=function(){
			if (!this._cellChanged){
				this._cellChanged=true;
				this.callLater(this.changeCells);
			}
		}

		__proto.commitMeasure=function(){
			this.runCallLater(this.changeCells);
		}

		/**@inheritDoc */
		__getset(0,__proto,'cacheAs',_super.prototype._$get_cacheAs,function(value){
			_super.prototype._$set_cacheAs.call(this,value);
			if (this._scrollBar){
				this._$P.cacheAs=null;
				if (value!=="none")this._scrollBar.on("start",this,this.onScrollStart);
				else this._scrollBar.off("start",this,this.onScrollStart);
			}
		});

		/**
		*获取对 <code>List</code> 组件所包含的内容容器 <code>Box</code> 组件的引用。
		*/
		__getset(0,__proto,'content',function(){
			return this._content;
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			if (value !=this._height){
				_super.prototype._$set_height.call(this,value);
				this._setCellChanged();
			}
		});

		/**
		*单元格渲染器。
		*<p><b>取值：</b>
		*<ol>
		*<li>单元格类对象。</li>
		*<li> UI 的 JSON 描述。</li>
		*</ol></p>
		*/
		__getset(0,__proto,'itemRender',function(){
			return this._itemRender;
			},function(value){
			if (this._itemRender !=value){
				this._itemRender=value;
				for (var i=this._cells.length-1;i >-1;i--){
					this._cells[i].destroy();
				}
				this._cells.length=0;
				this._setCellChanged();
			}
		});

		/**
		*垂直方向滚动条皮肤。
		*/
		__getset(0,__proto,'vScrollBarSkin',function(){
			return this._scrollBar ? this._scrollBar.skin :null;
			},function(value){
			this._removePreScrollBar();
			var scrollBar=new VScrollBar();
			scrollBar.name="scrollBar";
			scrollBar.right=0;
			if (value && value !=" ")
				scrollBar.skin=value;
			this.scrollBar=scrollBar;
			this.addChild(scrollBar);
			this._setCellChanged();
		});

		/**
		*列表的当前页码。
		*/
		__getset(0,__proto,'page',function(){
			return this._page;
			},function(value){
			this._page=value
			if (this._array){
				this._page=value > 0 ? value :0;
				this._page=this._page < this.totalPage ? this._page :this.totalPage-1;
				this.startIndex=this._page *this.repeatX *this.repeatY;
			}
		});

		/**
		*水平方向滚动条皮肤。
		*/
		__getset(0,__proto,'hScrollBarSkin',function(){
			return this._scrollBar ? this._scrollBar.skin :null;
			},function(value){
			this._removePreScrollBar();
			var scrollBar=new HScrollBar();
			scrollBar.name="scrollBar";
			scrollBar.bottom=0;
			if (value && value !=" ")
				scrollBar.skin=value;
			this.scrollBar=scrollBar;
			this.addChild(scrollBar);
			this._setCellChanged();
		});

		/**
		*水平方向显示的单元格数量。
		*/
		__getset(0,__proto,'repeatX',function(){
			return this._repeatX > 0 ? this._repeatX :this._repeatX2 > 0 ? this._repeatX2 :1;
			},function(value){
			this._repeatX=value;
			this._setCellChanged();
		});

		/**
		*获取对 <code>List</code> 组件所包含的滚动条 <code>ScrollBar</code> 组件的引用。
		*/
		__getset(0,__proto,'scrollBar',function(){
			return this._scrollBar;
			},function(value){
			if (this._scrollBar !=value){
				this._scrollBar=value;
				if (value){
					this._isVertical=this._scrollBar.isVertical;
					this.addChild(this._scrollBar);
					this._scrollBar.on("change",this,this.onScrollBarChange);
				}
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			if (value !=this._width){
				_super.prototype._$set_width.call(this,value);
				this._setCellChanged();
			}
		});

		/**
		*垂直方向显示的单元格数量。
		*/
		__getset(0,__proto,'repeatY',function(){
			return this._repeatY > 0 ? this._repeatY :this._repeatY2 > 0 ? this._repeatY2 :1;
			},function(value){
			this._repeatY=value;
			this._setCellChanged();
		});

		/**
		*水平方向显示的单元格之间的间距（以像素为单位）。
		*/
		__getset(0,__proto,'spaceX',function(){
			return this._spaceX;
			},function(value){
			this._spaceX=value;
			this._setCellChanged();
		});

		/**
		*垂直方向显示的单元格之间的间距（以像素为单位）。
		*/
		__getset(0,__proto,'spaceY',function(){
			return this._spaceY;
			},function(value){
			this._spaceY=value;
			this._setCellChanged();
		});

		/**
		*表示当前选择的项索引。selectedIndex值更改会引起list重新渲染
		*/
		__getset(0,__proto,'selectedIndex',function(){
			return this._selectedIndex;
			},function(value){
			if (this._selectedIndex !=value){
				this._selectedIndex=value;
				this.changeSelectStatus();
				this.event("change");
				this.selectHandler && this.selectHandler.runWith(value);
				this.startIndex=this._startIndex;
			}
		});

		/**
		*当前选中的单元格数据源。
		*/
		__getset(0,__proto,'selectedItem',function(){
			return this._selectedIndex !=-1 ? this._array[this._selectedIndex] :null;
			},function(value){
			this.selectedIndex=this._array.indexOf(value);
		});

		/**
		*列表的数据总个数。
		*/
		__getset(0,__proto,'length',function(){
			return this._array ? this._array.length :0;
		});

		/**
		*获取或设置当前选择的单元格对象。
		*/
		__getset(0,__proto,'selection',function(){
			return this.getCell(this._selectedIndex);
			},function(value){
			this.selectedIndex=this._startIndex+this._cells.indexOf(value);
		});

		/**
		*当前显示的单元格列表的开始索引。
		*/
		__getset(0,__proto,'startIndex',function(){
			return this._startIndex;
			},function(value){
			this._startIndex=value > 0 ? value :0;
			this.callLater(this.renderItems);
		});

		/**
		*列表数据源。
		*/
		__getset(0,__proto,'array',function(){
			return this._array;
			},function(value){
			this.runCallLater(this.changeCells);
			this._array=value || [];
			var length=this._array.length;
			this.totalPage=Math.ceil(length / (this.repeatX *this.repeatY));
			this._selectedIndex=this._selectedIndex < length ? this._selectedIndex :length-1;
			this.startIndex=this._startIndex;
			if (this._scrollBar){
				this._scrollBar.stopScroll();
				var numX=this._isVertical ? this.repeatX :this.repeatY;
				var numY=this._isVertical ? this.repeatY :this.repeatX;
				var lineCount=Math.ceil(length / numX);
				var total=this._cellOffset > 0 ? this.totalPage+1 :this.totalPage;
				if (total > 1){
					this._scrollBar.scrollSize=this._cellSize;
					this._scrollBar.thumbPercent=numY / lineCount;
					this._scrollBar.setScroll(0,(lineCount-numY)*this._cellSize+this._cellOffset,this._scrollBar.value);
					this._scrollBar.target=this._content;
					}else {
					this._scrollBar.setScroll(0,0,0);
					this._scrollBar.target=this._content;
				}
			}
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
			else if ((value instanceof Array))this.array=value
			else _super.prototype._$set_dataSource.call(this,value);
		});

		/**
		*单元格集合。
		*/
		__getset(0,__proto,'cells',function(){
			this.runCallLater(this.changeCells);
			return this._cells;
		});

		return List;
	})(Box)


	//class laya.ui.Tree extends laya.ui.Box
	var Tree=(function(_super){
		function Tree(){
			this._list=null;
			this._source=null;
			this._renderHandler=null;
			this._spaceLeft=10;
			this._spaceBottom=0;
			this._keepStatus=true;
			Tree.__super.call(this);
			this.width=this.height=200;
		}

		__class(Tree,'laya.ui.Tree',_super);
		var __proto=Tree.prototype;
		Laya.imps(__proto,{"laya.ui.IRender":true})
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			laya.ui.Component.prototype.destroy.call(this,destroyChild);
			this._list && this._list.destroy(destroyChild);
			this._list=null;
			this._source=null;
			this._renderHandler=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._list=new List());
			this._list.renderHandler=Handler.create(this,this.renderItem,null,false);
			this._list.repeatX=1;
			this._list.on("change",this,this.onListChange);
		}

		/**
		*@private
		*此对象包含的<code>List</code>实例的<code>Event.CHANGE</code>事件侦听处理函数。
		*/
		__proto.onListChange=function(e){
			this.event("change");
		}

		/**
		*@private
		*获取数据源集合。
		*/
		__proto.getArray=function(){
			var arr=[];
			var item;
			for(var $each_item in this._source){
				item=this._source[$each_item];
				if (this.getParentOpenStatus(item)){
					item.x=this._spaceLeft *this.getDepth(item);
					arr.push(item);
				}
			}
			return arr;
		}

		/**
		*@private
		*获取项对象的深度。
		*/
		__proto.getDepth=function(item,num){
			(num===void 0)&& (num=0);
			if (item.nodeParent==null)return num;
			else return this.getDepth(item.nodeParent,num+1);
		}

		/**
		*@private
		*获取项对象的上一级的打开状态。
		*/
		__proto.getParentOpenStatus=function(item){
			var parent=item.nodeParent;
			if (parent==null){
				return true;
				}else {
				if (parent.isOpen){
					if (parent.nodeParent !=null)return this.getParentOpenStatus(parent);
					else return true;
					}else {
					return false;
				}
			}
		}

		/**
		*@private
		*渲染一个项对象。
		*@param cell 一个项对象。
		*@param index 项的索引。
		*/
		__proto.renderItem=function(cell,index){
			var item=cell.dataSource;
			if (item){
				cell.left=item.x;
				var arrow=cell.getChildByName("arrow");
				if (arrow){
					if (item.hasChild){
						arrow.visible=true;
						arrow.index=item.isOpen ? 1 :0;
						arrow.tag=index;
						arrow.off("click",this,this.onArrowClick);
						arrow.on("click",this,this.onArrowClick);
						}else {
						arrow.visible=false;
					}
				};
				var folder=cell.getChildByName("folder");
				if (folder){
					if (folder.clipY==2){
						folder.index=item.isDirectory ? 0 :1;
						}else {
						folder.index=item.isDirectory ? item.isOpen ? 1 :0 :2;
					}
				}
				this._renderHandler && this._renderHandler.runWith([cell,index]);
			}
		}

		/**
		*@private
		*/
		__proto.onArrowClick=function(e){
			var arrow=e.currentTarget;
			var index=arrow.tag;
			this._list.array[index].isOpen=!this._list.array[index].isOpen;
			this.event("open");
			this._list.array=this.getArray();
		}

		/**
		*设置指定项索引的项对象的打开状态。
		*@param index 项索引。
		*@param isOpen 是否处于打开状态。
		*/
		__proto.setItemState=function(index,isOpen){
			if (!this._list.array[index])return;
			this._list.array[index].isOpen=isOpen;
			this._list.array=this.getArray();
		}

		/**
		*刷新项列表。
		*/
		__proto.fresh=function(){
			this._list.array=this.getArray();
			this.repaint();
		}

		/**
		*@private
		*解析并处理XML类型的数据源。
		*/
		__proto.parseXml=function(xml,source,nodeParent,isRoot){
			var obj;
			var list=xml.childNodes;
			var childCount=list.length;
			if (!isRoot){
				obj={};
				var list2=xml.attributes;
				var attrs;
				for(var $each_attrs in list2){
					attrs=list2[$each_attrs];
					var prop=attrs.nodeName;
					var value=attrs.nodeValue;
					obj[prop]=value=="true" ? true :value=="false" ? false :value;
				}
				obj.nodeParent=nodeParent;
				if (childCount > 0)obj.isDirectory=true;
				obj.hasChild=childCount > 0;
				source.push(obj);
			}
			for (var i=0;i < childCount;i++){
				var node=list[i];
				this.parseXml(node,source,obj,false);
			}
		}

		/**
		*@private
		*处理数据项的打开状态。
		*/
		__proto.parseOpenStatus=function(oldSource,newSource){
			for (var i=0,n=newSource.length;i < n;i++){
				var newItem=newSource[i];
				if (newItem.isDirectory){
					for (var j=0,m=oldSource.length;j < m;j++){
						var oldItem=oldSource[j];
						if (oldItem.isDirectory && this.isSameParent(oldItem,newItem)&& newItem.label==oldItem.label){
							newItem.isOpen=oldItem.isOpen;
							break ;
						}
					}
				}
			}
		}

		/**
		*@private
		*判断两个项对象在树结构中的父节点是否相同。
		*@param item1 项对象。
		*@param item2 项对象。
		*@return 如果父节点相同值为true，否则值为false。
		*/
		__proto.isSameParent=function(item1,item2){
			if (item1.nodeParent==null && item2.nodeParent==null)return true;
			else if (item1.nodeParent==null || item2.nodeParent==null)return false
			else {
				if (item1.nodeParent.label==item2.nodeParent.label)return this.isSameParent(item1.nodeParent,item2.nodeParent);
				else return false;
			}
		}

		/**
		*更新项列表，显示指定键名的数据项。
		*@param key 键名。
		*/
		__proto.filter=function(key){
			if (Boolean(key)){
				var result=[];
				this.getFilterSource(this._source,result,key);
				this._list.array=result;
				}else {
				this._list.array=this.getArray();
			}
		}

		/**
		*@private
		*获取数据源中指定键名的值。
		*/
		__proto.getFilterSource=function(array,result,key){
			key=key.toLocaleLowerCase();
			var item;
			for(var $each_item in array){
				item=array[$each_item];
				if (!item.isDirectory && String(item.label).toLowerCase().indexOf(key)>-1){
					item.x=0;
					result.push(item);
				}
				if (item.child && item.child.length > 0){
					this.getFilterSource(item.child,result,key);
				}
			}
		}

		/**
		*每一项之间的间隔距离（以像素为单位）。
		*/
		__getset(0,__proto,'spaceBottom',function(){
			return this._list.spaceY;
			},function(value){
			this._list.spaceY=value;
		});

		/**
		*数据源发生变化后，是否保持之前打开状态，默认为true。
		*<p><b>取值：</b>
		*<li>true：保持之前打开状态。</li>
		*<li>false：不保持之前打开状态。</li>
		*</p>
		*/
		__getset(0,__proto,'keepStatus',function(){
			return this._keepStatus;
			},function(value){
			this._keepStatus=value;
		});

		/**
		*此对象包含的<code>List</code>实例的单元格渲染器。
		*<p><b>取值：</b>
		*<ol>
		*<li>单元格类对象。</li>
		*<li> UI 的 JSON 描述。</li>
		*</ol></p>
		*/
		__getset(0,__proto,'itemRender',function(){
			return this._list.itemRender;
			},function(value){
			this._list.itemRender=value;
		});

		/**
		*列表数据源，只包含当前可视节点数据。
		*/
		__getset(0,__proto,'array',function(){
			return this._list.array;
			},function(value){
			if (this._keepStatus && this._list.array && value){
				this.parseOpenStatus(this._list.array,value);
			}
			this._source=value;
			this._list.array=this.getArray();
		});

		/**
		*单元格鼠标事件处理器。
		*<p>默认返回参数（e:Event,index:int）。</p>
		*/
		__getset(0,__proto,'mouseHandler',function(){
			return this._list.mouseHandler;
			},function(value){
			this._list.mouseHandler=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			_super.prototype._$set_dataSource.call(this,value);
		});

		/**
		*数据源，全部节点数据。
		*/
		__getset(0,__proto,'source',function(){
			return this._source;
		});

		/**滚动条*/
		__getset(0,__proto,'scrollBar',function(){
			return this._list.scrollBar;
		});

		/**
		*此对象包含的<code>List</code>实例对象。
		*/
		__getset(0,__proto,'list',function(){
			return this._list;
		});

		/**
		*滚动条皮肤。
		*/
		__getset(0,__proto,'scrollBarSkin',function(){
			return this._list.vScrollBarSkin;
			},function(value){
			this._list.vScrollBarSkin=value;
		});

		/**
		*<code>Tree</code> 实例的渲染处理器。
		*/
		__getset(0,__proto,'renderHandler',function(){
			return this._renderHandler;
			},function(value){
			this._renderHandler=value;
		});

		/**
		*表示当前选择的项索引。
		*/
		__getset(0,__proto,'selectedIndex',function(){
			return this._list.selectedIndex;
			},function(value){
			this._list.selectedIndex=value;
		});

		/**
		*左侧缩进距离（以像素为单位）。
		*/
		__getset(0,__proto,'spaceLeft',function(){
			return this._spaceLeft;
			},function(value){
			this._spaceLeft=value;
		});

		/**
		*当前选中的项对象的数据源。
		*/
		__getset(0,__proto,'selectedItem',function(){
			return this._list.selectedItem;
			},function(value){
			this._list.selectedItem=value;
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this._list.width=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this._list.height=value;
		});

		/**
		*xml结构的数据源。
		*/
		__getset(0,__proto,'xml',null,function(value){
			var arr=[];
			this.parseXml(value.childNodes[0],arr,null,true);
			this.array=arr;
		});

		/**
		*表示选择的树节点项的<code>path</code>属性值。
		*/
		__getset(0,__proto,'selectedPath',function(){
			if (this._list.selectedItem){
				return this._list.selectedItem.path;
			}
			return null;
		});

		return Tree;
	})(Box)


	//class laya.ui.LayoutBox extends laya.ui.Box
	var LayoutBox=(function(_super){
		function LayoutBox(){
			this._space=0;
			this._align="none";
			this._itemChanged=false;
			LayoutBox.__super.call(this);
		}

		__class(LayoutBox,'laya.ui.LayoutBox',_super);
		var __proto=LayoutBox.prototype;
		/**@inheritDoc */
		__proto.addChild=function(child){
			child.on("resize",this,this.onResize);
			this._setItemChanged();
			return laya.display.Node.prototype.addChild.call(this,child);
		}

		__proto.onResize=function(e){
			this._setItemChanged();
		}

		/**@inheritDoc */
		__proto.addChildAt=function(child,index){
			child.on("resize",this,this.onResize);
			this._setItemChanged();
			return laya.display.Node.prototype.addChildAt.call(this,child,index);
		}

		/**@inheritDoc */
		__proto.removeChild=function(child){
			child.off("resize",this,this.onResize);
			this._setItemChanged();
			return laya.display.Node.prototype.removeChild.call(this,child);
		}

		/**@inheritDoc */
		__proto.removeChildAt=function(index){
			this.getChildAt(index).off("resize",this,this.onResize);
			this._setItemChanged();
			return laya.display.Node.prototype.removeChildAt.call(this,index);
		}

		/**刷新。*/
		__proto.refresh=function(){
			this._setItemChanged();
		}

		/**
		*改变子对象的布局。
		*/
		__proto.changeItems=function(){
			this._itemChanged=false;
		}

		/**
		*排序项目列表。可通过重写改变默认排序规则。
		*@param items 项目列表。
		*/
		__proto.sortItem=function(items){
			if (items)items.sort(function(a,b){return a.y-b.y;});
		}

		__proto._setItemChanged=function(){
			if (!this._itemChanged){
				this._itemChanged=true;
				this.callLater(this.changeItems);
			}
		}

		/**子对象的间隔。*/
		__getset(0,__proto,'space',function(){
			return this._space;
			},function(value){
			this._space=value;
			this._setItemChanged();
		});

		/**子对象对齐方式。*/
		__getset(0,__proto,'align',function(){
			return this._align;
			},function(value){
			this._align=value;
			this._setItemChanged();
		});

		return LayoutBox;
	})(Box)


	//class laya.ui.Panel extends laya.ui.Box
	var Panel=(function(_super){
		function Panel(){
			this._content=null;
			this._vScrollBar=null;
			this._hScrollBar=null;
			this._scrollChanged=false;
			Panel.__super.call(this);
			this.width=this.height=100;
			this._content.optimizeScrollRect=true;
		}

		__class(Panel,'laya.ui.Panel',_super);
		var __proto=Panel.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			laya.ui.Component.prototype.destroy.call(this,destroyChild);
			this._content && this._content.destroy(destroyChild);
			this._vScrollBar && this._vScrollBar.destroy(destroyChild);
			this._hScrollBar && this._hScrollBar.destroy(destroyChild);
			this._vScrollBar=null;
			this._hScrollBar=null;
			this._content=null;
		}

		/**@inheritDoc */
		__proto.destroyChildren=function(){
			this._content.destroyChildren();
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			laya.display.Node.prototype.addChild.call(this,this._content=new Box());
		}

		/**@inheritDoc */
		__proto.addChild=function(child){
			child.on("resize",this,this.onResize);
			this._setScrollChanged();
			return this._content.addChild(child);
		}

		/**
		*@private
		*子对象的 <code>Event.RESIZE</code> 事件侦听处理函数。
		*/
		__proto.onResize=function(){
			this._setScrollChanged();
		}

		/**@inheritDoc */
		__proto.addChildAt=function(child,index){
			child.on("resize",this,this.onResize);
			this._setScrollChanged();
			return this._content.addChildAt(child,index);
		}

		/**@inheritDoc */
		__proto.removeChild=function(child){
			child.off("resize",this,this.onResize);
			this._setScrollChanged();
			return this._content.removeChild(child);
		}

		/**@inheritDoc */
		__proto.removeChildAt=function(index){
			this.getChildAt(index).off("resize",this,this.onResize);
			this._setScrollChanged();
			return this._content.removeChildAt(index);
		}

		/**@inheritDoc */
		__proto.removeChildren=function(beginIndex,endIndex){
			(beginIndex===void 0)&& (beginIndex=0);
			(endIndex===void 0)&& (endIndex=0x7fffffff);
			for (var i=this._content.numChildren-1;i >-1;i--){
				this._content.removeChildAt(i);
			}
			this._setScrollChanged();
			return this;
		}

		/**@inheritDoc */
		__proto.getChildAt=function(index){
			return this._content.getChildAt(index);
		}

		/**@inheritDoc */
		__proto.getChildByName=function(name){
			return this._content.getChildByName(name);
		}

		/**@inheritDoc */
		__proto.getChildIndex=function(child){
			return this._content.getChildIndex(child);
		}

		/**@private */
		__proto.changeScroll=function(){
			this._scrollChanged=false;
			var contentW=this.contentWidth || 1;
			var contentH=this.contentHeight || 1;
			var vscroll=this._vScrollBar;
			var hscroll=this._hScrollBar;
			var vShow=vscroll && contentH > this._height;
			var hShow=hscroll && contentW > this._width;
			var showWidth=vShow ? this._width-vscroll.width :this._width;
			var showHeight=hShow ? this._height-hscroll.height :this._height;
			if (vscroll){
				vscroll.x=this._width-vscroll.width;
				vscroll.y=0;
				vscroll.height=this._height-(hShow ? hscroll.height :0);
				vscroll.scrollSize=Math.max(this._height *0.033,1);
				vscroll.thumbPercent=showHeight / contentH;
				vscroll.setScroll(0,contentH-showHeight,vscroll.value);
			}
			if (hscroll){
				hscroll.x=0;
				hscroll.y=this._height-hscroll.height;
				hscroll.width=this._width-(vShow ? vscroll.width :0);
				hscroll.scrollSize=Math.max(this._width *0.033,1);
				hscroll.thumbPercent=showWidth / contentW;
				hscroll.setScroll(0,contentW-showWidth,hscroll.value);
			}
		}

		/**@inheritDoc */
		__proto.changeSize=function(){
			laya.ui.Component.prototype.changeSize.call(this);
			this.setContentSize(this._width,this._height);
		}

		/**
		*@private
		*设置内容的宽度、高度（以像素为单位）。
		*@param width 宽度。
		*@param height 高度。
		*/
		__proto.setContentSize=function(width,height){
			var content=this._content;
			content.width=width;
			content.height=height;
			content.scrollRect || (content.scrollRect=new Rectangle());
			content.scrollRect.setTo(0,0,width,height);
			content.conchModel&&content.conchModel.scrollRect(0,0,width,height);
		}

		/**
		*@private
		*滚动条的<code><code>Event.MOUSE_DOWN</code>事件侦听处理函数。</code>事件侦听处理函数。
		*@param scrollBar 滚动条对象。
		*@param e Event 对象。
		*/
		__proto.onScrollBarChange=function(scrollBar){
			var rect=this._content.scrollRect;
			if (rect){
				var start=Math.round(scrollBar.value);
				scrollBar.isVertical ? rect.y=start :rect.x=start;
				this._content.conchModel&&this._content.conchModel.scrollRect(rect.x,rect.y,rect.width,rect.height);
			}
		}

		/**
		*<p>滚动内容容器至设定的垂直、水平方向滚动条位置。</p>
		*@param x 水平方向滚动条属性value值。滚动条位置数字。
		*@param y 垂直方向滚动条属性value值。滚动条位置数字。
		*/
		__proto.scrollTo=function(x,y){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			if (this.vScrollBar)this.vScrollBar.value=y;
			if (this.hScrollBar)this.hScrollBar.value=x;
		}

		/**
		*刷新滚动内容。
		*/
		__proto.refresh=function(){
			this.changeScroll();
		}

		__proto.onScrollStart=function(){
			this._$P.cacheAs || (this._$P.cacheAs=_super.prototype._$get_cacheAs.call(this));
			_super.prototype._$set_cacheAs.call(this,"none");
			this._hScrollBar && this._hScrollBar.once("end",this,this.onScrollEnd);
			this._vScrollBar && this._vScrollBar.once("end",this,this.onScrollEnd);
		}

		__proto.onScrollEnd=function(){
			_super.prototype._$set_cacheAs.call(this,this._$P.cacheAs);
		}

		/**@private */
		__proto._setScrollChanged=function(){
			if (!this._scrollChanged){
				this._scrollChanged=true;
				this.callLater(this.changeScroll);
			}
		}

		/**@inheritDoc */
		__getset(0,__proto,'numChildren',function(){
			return this._content.numChildren;
		});

		/**
		*水平方向滚动条皮肤。
		*/
		__getset(0,__proto,'hScrollBarSkin',function(){
			return this._hScrollBar ? this._hScrollBar.skin :null;
			},function(value){
			if (this._hScrollBar==null){
				laya.display.Node.prototype.addChild.call(this,this._hScrollBar=new HScrollBar());
				this._hScrollBar.on("change",this,this.onScrollBarChange,[this._hScrollBar]);
				this._hScrollBar.target=this._content;
				this._setScrollChanged();
			}
			this._hScrollBar.skin=value;
		});

		/**
		*@private
		*获取内容宽度（以像素为单位）。
		*/
		__getset(0,__proto,'contentWidth',function(){
			var max=0;
			for (var i=this._content.numChildren-1;i >-1;i--){
				var comp=this._content.getChildAt(i);
				max=Math.max(comp.x+comp.width *comp.scaleX,max);
			}
			return max;
		});

		/**
		*@private
		*获取内容高度（以像素为单位）。
		*/
		__getset(0,__proto,'contentHeight',function(){
			var max=0;
			for (var i=this._content.numChildren-1;i >-1;i--){
				var comp=this._content.getChildAt(i);
				max=Math.max(comp.y+comp.height *comp.scaleY,max);
			}
			return max;
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this._setScrollChanged();
		});

		/**
		*水平方向滚动条对象。
		*/
		__getset(0,__proto,'hScrollBar',function(){
			return this._hScrollBar;
		});

		/**
		*获取内容容器对象。
		*/
		__getset(0,__proto,'content',function(){
			return this._content;
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this._setScrollChanged();
		});

		/**
		*垂直方向滚动条皮肤。
		*/
		__getset(0,__proto,'vScrollBarSkin',function(){
			return this._vScrollBar ? this._vScrollBar.skin :null;
			},function(value){
			if (this._vScrollBar==null){
				laya.display.Node.prototype.addChild.call(this,this._vScrollBar=new VScrollBar());
				this._vScrollBar.on("change",this,this.onScrollBarChange,[this._vScrollBar]);
				this._vScrollBar.target=this._content;
				this._setScrollChanged();
			}
			this._vScrollBar.skin=value;
		});

		/**
		*垂直方向滚动条对象。
		*/
		__getset(0,__proto,'vScrollBar',function(){
			return this._vScrollBar;
		});

		/**@inheritDoc */
		__getset(0,__proto,'cacheAs',_super.prototype._$get_cacheAs,function(value){
			_super.prototype._$set_cacheAs.call(this,value);
			this._$P.cacheAs=null;
			if (value!=="none"){
				this._hScrollBar && this._hScrollBar.on("start",this,this.onScrollStart);
				this._vScrollBar && this._vScrollBar.on("start",this,this.onScrollStart);
				}else {
				this._hScrollBar && this._hScrollBar.off("start",this,this.onScrollStart);
				this._vScrollBar && this._vScrollBar.off("start",this,this.onScrollStart);
			}
		});

		return Panel;
	})(Box)


	//class laya.ui.UIGroup extends laya.ui.Box
	var UIGroup=(function(_super){
		function UIGroup(labels,skin){
			this.selectHandler=null;
			this._items=null;
			this._selectedIndex=-1;
			this._skin=null;
			this._direction="horizontal";
			this._space=0;
			this._labels=null;
			this._labelColors=null;
			this._labelFont=null;
			this._labelStrokeColor=null;
			this._strokeColors=null;
			this._labelStroke=NaN;
			this._labelSize=0;
			this._labelBold=false;
			this._labelPadding=null;
			this._labelAlign=null;
			this._stateNum=0;
			this._labelChanged=false;
			UIGroup.__super.call(this);
			this.skin=skin;
			this.labels=labels;
		}

		__class(UIGroup,'laya.ui.UIGroup',_super);
		var __proto=UIGroup.prototype;
		Laya.imps(__proto,{"laya.ui.IItem":true})
		/**@inheritDoc */
		__proto.preinitialize=function(){
			this.mouseEnabled=true;
		}

		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			laya.ui.Component.prototype.destroy.call(this,destroyChild);
			this._items && (this._items.length=0);
			this._items=null;
			this.selectHandler=null;
		}

		/**
		*添加一个项对象，返回此项对象的索引id。
		*
		*@param item 需要添加的项对象。
		*@param autoLayOut 是否自动布局，如果为true，会根据 <code>direction</code> 和 <code>space</code> 属性计算item的位置。
		*@return
		*/
		__proto.addItem=function(item,autoLayOut){
			(autoLayOut===void 0)&& (autoLayOut=true);
			var display=item;
			var index=this._items.length;
			display.name="item"+index;
			this.addChild(display);
			this.initItems();
			if (autoLayOut && index > 0){
				var preItem=this._items [index-1];
				if (this._direction=="horizontal"){
					display.x=preItem.x+preItem.width+this._space;
					}else {
					display.y=preItem.y+preItem.height+this._space;
				}
				}else {
				if (autoLayOut){
					display.x=0;
					display.y=0;
				}
			}
			return index;
		}

		/**
		*删除一个项对象。
		*@param item 需要删除的项对象。
		*@param autoLayOut 是否自动布局，如果为true，会根据 <code>direction</code> 和 <code>space</code> 属性计算item的位置。
		*/
		__proto.delItem=function(item,autoLayOut){
			(autoLayOut===void 0)&& (autoLayOut=true);
			var index=this._items.indexOf(item);
			if (index !=-1){
				var display=item;
				this.removeChild(display);
				for (var i=index+1,n=this._items.length;i < n;i++){
					var child=this._items [i];
					child.name="item"+(i-1);
					if (autoLayOut){
						if (this._direction=="horizontal"){
							child.x-=display.width+this._space;
							}else {
							child.y-=display.height+this._space;
						}
					}
				}
				this.initItems();
				if (this._selectedIndex >-1){
					var newIndex=0;
					newIndex=this._selectedIndex < this._items.length ? this._selectedIndex :(this._selectedIndex-1);
					this._selectedIndex=-1;
					this.selectedIndex=newIndex;
				}
			}
		}

		/**
		*初始化项对象们。
		*/
		__proto.initItems=function(){
			this._items || (this._items=[]);
			this._items.length=0;
			for (var i=0;i < 10000;i++){
				var item=this.getChildByName("item"+i);
				if (item==null)break ;
				this._items.push(item);
				item.selected=(i===this._selectedIndex);
				item.clickHandler=Handler.create(this,this.itemClick,[i],false);
			}
		}

		/**
		*@private
		*项对象的点击事件侦听处理函数。
		*@param index 项索引。
		*/
		__proto.itemClick=function(index){
			this.selectedIndex=index;
		}

		/**
		*@private
		*通过对象的索引设置项对象的 <code>selected</code> 属性值。
		*@param index 需要设置的项对象的索引。
		*@param selected 表示项对象的选中状态。
		*/
		__proto.setSelect=function(index,selected){
			if (this._items && index >-1 && index < this._items.length)this._items[index].selected=selected;
		}

		/**
		*@private
		*创建一个项显示对象。
		*@param skin 项对象的皮肤。
		*@param label 项对象标签。
		*/
		__proto.createItem=function(skin,label){
			return null;
		}

		/**
		*@private
		*更改项对象的属性值。
		*/
		__proto.changeLabels=function(){
			this._labelChanged=false;
			if (this._items){
				var left=0
				for (var i=0,n=this._items.length;i < n;i++){
					var btn=this._items [i];
					this._skin && (btn.skin=this._skin);
					this._labelColors && (btn.labelColors=this._labelColors);
					this._labelSize && (btn.labelSize=this._labelSize);
					this._labelStroke && (btn.labelStroke=this._labelStroke);
					this._labelStrokeColor && (btn.labelStrokeColor=this._labelStrokeColor);
					this._strokeColors && (btn.strokeColors=this._strokeColors);
					this._labelBold && (btn.labelBold=this._labelBold);
					this._labelPadding && (btn.labelPadding=this._labelPadding);
					this._labelAlign && (btn.labelAlign=this._labelAlign);
					this._stateNum && (btn.stateNum=this._stateNum);
					this._labelFont && (btn.labelFont=this._labelFont);
					if (this._direction==="horizontal"){
						btn.y=0;
						btn.x=left;
						left+=btn.width+this._space;
						}else {
						btn.x=0;
						btn.y=left;
						left+=btn.height+this._space;
					}
				}
			}
			this.changeSize();
		}

		/**@inheritDoc */
		__proto.commitMeasure=function(){
			this.runCallLater(this.changeLabels);
		}

		/**@private */
		__proto._setLabelChanged=function(){
			if (!this._labelChanged){
				this._labelChanged=true;
				this.callLater(this.changeLabels);
			}
		}

		/**
		*<p>描边颜色，以字符串表示。</p>
		*默认值为 "#000000"（黑色）;
		*@see laya.display.Text.strokeColor()
		*/
		__getset(0,__proto,'labelStrokeColor',function(){
			return this._labelStrokeColor;
			},function(value){
			if (this._labelStrokeColor !=value){
				this._labelStrokeColor=value;
				this._setLabelChanged();
			}
		});

		/**
		*@copy laya.ui.Image#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				this._setLabelChanged();
			}
		});

		/**
		*表示当前选择的项索引。默认值为-1。
		*/
		__getset(0,__proto,'selectedIndex',function(){
			return this._selectedIndex;
			},function(value){
			if (this._selectedIndex !=value){
				this.setSelect(this._selectedIndex,false);
				this._selectedIndex=value;
				this.setSelect(value,true);
				this.event("change");
				this.selectHandler && this.selectHandler.runWith(this._selectedIndex);
			}
		});

		/**
		*标签集合字符串。以逗号做分割，如"item0,item1,item2,item3,item4,item5"。
		*/
		__getset(0,__proto,'labels',function(){
			return this._labels;
			},function(value){
			if (this._labels !=value){
				this._labels=value;
				this.removeChildren();
				this._setLabelChanged();
				if (this._labels){
					var a=this._labels.split(",");
					for (var i=0,n=a.length;i < n;i++){
						var item=this.createItem(this._skin,a[i]);
						item.name="item"+i;
						this.addChild(item);
					}
				}
				this.initItems();
			}
		});

		/**
		*<p>表示各个状态下的描边颜色。</p>
		*@see laya.display.Text.strokeColor()
		*/
		__getset(0,__proto,'strokeColors',function(){
			return this._strokeColors;
			},function(value){
			if (this._strokeColors !=value){
				this._strokeColors=value;
				this._setLabelChanged();
			}
		});

		/**
		*@copy laya.ui.Button#labelColors()
		*/
		__getset(0,__proto,'labelColors',function(){
			return this._labelColors;
			},function(value){
			if (this._labelColors !=value){
				this._labelColors=value;
				this._setLabelChanged();
			}
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*@see laya.display.Text.stroke()
		*/
		__getset(0,__proto,'labelStroke',function(){
			return this._labelStroke;
			},function(value){
			if (this._labelStroke !=value){
				this._labelStroke=value;
				this._setLabelChanged();
			}
		});

		/**
		*表示按钮文本标签的字体大小。
		*/
		__getset(0,__proto,'labelSize',function(){
			return this._labelSize;
			},function(value){
			if (this._labelSize !=value){
				this._labelSize=value;
				this._setLabelChanged();
			}
		});

		/**
		*表示按钮的状态值，以数字表示，默认为3态。
		*@see laya.ui.Button#stateNum
		*/
		__getset(0,__proto,'stateNum',function(){
			return this._stateNum;
			},function(value){
			if (this._stateNum !=value){
				this._stateNum=value;
				this._setLabelChanged();
			}
		});

		/**
		*表示按钮文本标签是否为粗体字。
		*/
		__getset(0,__proto,'labelBold',function(){
			return this._labelBold;
			},function(value){
			if (this._labelBold !=value){
				this._labelBold=value;
				this._setLabelChanged();
			}
		});

		/**
		*表示按钮文本标签的字体名称，以字符串形式表示。
		*@see laya.display.Text.font()
		*/
		__getset(0,__proto,'labelFont',function(){
			return this._labelFont;
			},function(value){
			if (this._labelFont !=value){
				this._labelFont=value;
				this._setLabelChanged();
			}
		});

		/**
		*表示按钮文本标签的边距。
		*<p><b>格式：</b>"上边距,右边距,下边距,左边距"。</p>
		*/
		__getset(0,__proto,'labelPadding',function(){
			return this._labelPadding;
			},function(value){
			if (this._labelPadding !=value){
				this._labelPadding=value;
				this._setLabelChanged();
			}
		});

		/**
		*布局方向。
		*<p>默认值为"horizontal"。</p>
		*<p><b>取值：</b>
		*<li>"horizontal"：表示水平布局。</li>
		*<li>"vertical"：表示垂直布局。</li>
		*</p>
		*/
		__getset(0,__proto,'direction',function(){
			return this._direction;
			},function(value){
			this._direction=value;
			this._setLabelChanged();
		});

		/**
		*项对象们之间的间隔（以像素为单位）。
		*/
		__getset(0,__proto,'space',function(){
			return this._space;
			},function(value){
			this._space=value;
			this._setLabelChanged();
		});

		/**
		*项对象们的存放数组。
		*/
		__getset(0,__proto,'items',function(){
			return this._items;
		});

		/**
		*获取或设置当前选择的项对象。
		*/
		__getset(0,__proto,'selection',function(){
			return this._selectedIndex >-1 && this._selectedIndex < this._items.length ? this._items[this._selectedIndex] :null;
			},function(value){
			this.selectedIndex=this._items.indexOf(value);
		});

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string'))this.selectedIndex=parseInt(value);
			else if ((value instanceof Array))this.labels=(value).join(",");
			else _super.prototype._$set_dataSource.call(this,value);
		});

		return UIGroup;
	})(Box)


	//class laya.ui.ViewStack extends laya.ui.Box
	var ViewStack=(function(_super){
		function ViewStack(){
			this._items=null;
			this._selectedIndex=0;
			ViewStack.__super.call(this);
			this._setIndexHandler=Handler.create(this,this.setIndex,null,false);
		}

		__class(ViewStack,'laya.ui.ViewStack',_super);
		var __proto=ViewStack.prototype;
		Laya.imps(__proto,{"laya.ui.IItem":true})
		/**
		*批量设置视图对象。
		*@param views 视图对象数组。
		*/
		__proto.setItems=function(views){
			this.removeChildren();
			var index=0;
			for (var i=0,n=views.length;i < n;i++){
				var item=views[i];
				if (item){
					item.name="item"+index;
					this.addChild(item);
					index++;
				}
			}
			this.initItems();
		}

		/**
		*添加视图。
		*@internal 添加视图对象，并设置此视图对象的<code>name</code> 属性。
		*@param view 需要添加的视图对象。
		*/
		__proto.addItem=function(view){
			view.name="item"+this._items.length;
			this.addChild(view);
			this.initItems();
		}

		/**
		*初始化视图对象集合。
		*/
		__proto.initItems=function(){
			this._items=[];
			for (var i=0;i < 10000;i++){
				var item=this.getChildByName("item"+i);
				if (item==null){
					break ;
				}
				this._items.push(item);
				item.visible=(i==this._selectedIndex);
			}
		}

		/**
		*@private
		*通过对象的索引设置项对象的 <code>selected</code> 属性值。
		*@param index 需要设置的对象的索引。
		*@param selected 表示对象的选中状态。
		*/
		__proto.setSelect=function(index,selected){
			if (this._items && index >-1 && index < this._items.length){
				this._items[index].visible=selected;
			}
		}

		/**
		*@private
		*设置属性<code>selectedIndex</code>的值。
		*@param index 选中项索引值。
		*/
		__proto.setIndex=function(index){
			this.selectedIndex=index;
		}

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if (((typeof value=='number')&& Math.floor(value)==value)|| (typeof value=='string')){
				this.selectedIndex=parseInt(value);
				}else {
				for (var prop in this._dataSource){
					if (this.hasOwnProperty(prop)){
						this[prop]=this._dataSource[prop];
					}
				}
			}
		});

		/**
		*表示当前视图索引。
		*/
		__getset(0,__proto,'selectedIndex',function(){
			return this._selectedIndex;
			},function(value){
			if (this._selectedIndex !=value){
				this.setSelect(this._selectedIndex,false);
				this._selectedIndex=value;
				this.setSelect(this._selectedIndex,true);
			}
		});

		/**
		*获取或设置当前选择的项对象。
		*/
		__getset(0,__proto,'selection',function(){
			return this._selectedIndex >-1 && this._selectedIndex < this._items.length ? this._items[this._selectedIndex] :null;
			},function(value){
			this.selectedIndex=this._items.indexOf(value);
		});

		/**
		*视图集合数组。
		*/
		__getset(0,__proto,'items',function(){
			return this._items;
		});

		/**
		*索引设置处理器。
		*<p>默认回调参数：index:int</p>
		*/
		__getset(0,__proto,'setIndexHandler',function(){
			return this._setIndexHandler;
			},function(value){
			this._setIndexHandler=value;
		});

		return ViewStack;
	})(Box)


	//class laya.debug.uicomps.ContextMenuItem extends laya.ui.Button
	var ContextMenuItem=(function(_super){
		function ContextMenuItem(txt,isSeparator){
			this.data=null;
			this.img=null;
			ContextMenuItem.__super.call(this);
			if(!this.img)this.img=new Image();
			if(txt!=""){
				this.label=txt;
				this.name=txt;
				}else{
				this.label="------";
				this.height=5;
				this.mouseEnabled=false;
				this.img.skin=Base64AtlasManager.base64.getAdptUrl("comp/line2.png");
				this.img.sizeGrid="0,2,0,2";
				this.addChild(this.img);
			}
			this.labelColors="#000000,#000000,#000000,#000000";
			this._text.x=10;
			this._text.padding=[-2,0,0,0];
			this._text.align="left";
			this._text.wordWrap=false;
			this._text.typeset();
			this.width=this._text.width+25;
			this.sizeGrid="3,3,3,3";
			this.skin=Base64AtlasManager.base64.getAdptUrl("comp/button1.png");
		}

		__class(ContextMenuItem,'laya.debug.uicomps.ContextMenuItem',_super);
		var __proto=ContextMenuItem.prototype;
		__getset(0,__proto,'width',_super.prototype._$get_width,function(v){
			_super.prototype._$set_width.call(this,v);
			this.img.width=this.width;
			this.img.x=0;
		});

		return ContextMenuItem;
	})(Button)


	//class laya.debug.view.nodeInfo.views.CacheRankView extends laya.debug.view.nodeInfo.views.UIViewBase
	var CacheRankView=(function(_super){
		function CacheRankView(){
			this.view=null;
			CacheRankView.__super.call(this);
		}

		__class(CacheRankView,'laya.debug.view.nodeInfo.views.CacheRankView',_super);
		var __proto=CacheRankView.prototype;
		__proto.createPanel=function(){
			this.view=new Rank();
			this.view.top=this.view.bottom=this.view.left=this.view.right=0;
			this.addChild(this.view);
			NodeMenu.I.setNodeListAction(this.view.itemList);
			this.view.closeBtn.on("click",this,this.close);
			this.view.freshBtn.on("click",this,this.fresh);
			this.view.itemList.scrollBar.hide=true;
			this.view.autoUpdate.on("change",this,this.onAutoUpdateChange);
			this.dis=this;
			this.view.itemList.array=[];
			this.onAutoUpdateChange();
			this.fresh();
		}

		__proto.onRightClick=function(){
			var list;
			list=this.view.itemList;
			if (list.selectedItem){
				var tarNode;
				tarNode=list.selectedItem.path;
				NodeMenu.I.objRightClick(tarNode);
			}
		}

		__proto.onAutoUpdateChange=function(){
			this.autoUpdate=this.view.autoUpdate.selected;
		}

		__proto.fresh=function(){
			CacheAnalyser.counter.updates();
			this.view.title.text="ReCache排行";
			if (!DebugTool.enableCacheAnalyse){
				this.view.title.text="ReCache排行(未开启)";
				this.view.title.toolTip="DebugTool.init(true)可开启该功能";
			};
			var nodeDic;
			nodeDic=CacheAnalyser.counter.resultNodeDic;
			var key;
			var tNode;
			var tData;
			var dataList;
			dataList=[];
			for (key in nodeDic){
				tNode=nodeDic[key];
				if (CacheRankView.filterDebugNodes && DisControlTool.isInTree(DebugInfoLayer.I,tNode))continue ;
				if (CacheAnalyser.counter.getCount(tNode)<=0)continue ;
				tData={};
				tData.time=CacheAnalyser.counter.getCount(tNode);
				tData.path=tNode;
				tData.label=ClassTool.getNodeClassAndName(tNode)+":"+tData.time;
				dataList.push(tData);
			}
			dataList.sort(MathTools.sortByKey("time",true,true));
			this.view.itemList.array=dataList;
		}

		__getset(0,__proto,'autoUpdate',null,function(v){
			Laya.timer.clear(this,this.fresh);
			if (v){
				this.fresh();
				Laya.timer.loop(NodeConsts.RenderCostMaxTime,this,this.fresh);
			}
		});

		__getset(1,CacheRankView,'I',function(){
			if (!CacheRankView._I)
				CacheRankView._I=new CacheRankView();
			return CacheRankView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		CacheRankView._I=null
		CacheRankView.filterDebugNodes=true;
		return CacheRankView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.DebugPanelView extends laya.debug.view.nodeInfo.views.UIViewBase
	var DebugPanelView=(function(_super){
		function DebugPanelView(){
			this.view=null;
			this.dragIcon=null;
			this.tSelectTar=null;
			this._selectTip=new Sprite();
			DebugPanelView.__super.call(this);
			this._selectTip.setBounds(new Rectangle(0,0,0,0));
		}

		__class(DebugPanelView,'laya.debug.view.nodeInfo.views.DebugPanelView',_super);
		var __proto=DebugPanelView.prototype;
		__proto.createPanel=function(){
			this.view=new DebugPage();
			this.dis=this.view;
			this.view.minBtn.minHandler=this.minHandler;
			this.view.minBtn.maxHandler=this.maxHandler;
			this.view.minBtn.tar=this.view;
			DisControlTool.setDragingItem(this.view.bg,this.view);
			DisControlTool.setDragingItem(this.view.tab,this.view);
			DisControlTool.setDragingItem(this.view.clearBtn,this.view);
			this.clickSelectChange();
			this.view.selectWhenClick.on("change",this,this.clickSelectChange);
			Notice.listen("ItemClicked",this,this.itemClicked);
			StyleConsts.setViewScale(this.view);
			this.dragIcon=this.view.dragIcon;
			this.dragIcon.removeSelf();
			this.view.mouseAnalyseBtn.on("mousedown",this,this.mouseAnalyserMouseDown);
			this.dragIcon.on("dragend",this,this.mouseAnalyserDragEnd);
			this.view.clearBtn.on("mousedown",this,this.clearBtnClick);
		}

		__proto.clearBtnClick=function(){
			DebugTool.clearDebugLayer();
		}

		__proto.mouseAnalyserMouseDown=function(){
			var gPos=DebugPanelView.tempPos;
			gPos.setTo(0,0);
			gPos=this.view.mouseAnalyseBtn.localToGlobal(gPos);
			this.dragIcon.pos(gPos.x,gPos.y);
			this.dragIcon.mouseEnabled=false;
			Laya.stage.addChild(this.dragIcon);
			this.dragIcon.startDrag();
		}

		__proto.mouseAnalyserDragEnd=function(){
			this.dragIcon.removeSelf();
			this.selectTarget(DisplayHook.instance.getDisUnderMouse());
			NodeToolView.I.showByNode(DisplayHook.instance.getDisUnderMouse(),false);
		}

		//}
		__proto.switchToTree=function(){
			this.view.tab.selectedIndex=0;
		}

		__proto.swichToSelect=function(){
			this.view.tab.selectedIndex=1;
		}

		__proto.itemClicked=function(tar){
			if (!DebugPanelView.isClickSelectState)return;
			if (DebugPanelView.ignoreDebugTool){
				if (DebugInfoLayer.I.isDebugItem(tar))return;
			}
			if ((tar instanceof laya.debug.uicomps.ContextMenuItem )|| (tar.parent instanceof laya.debug.uicomps.ContextMenuItem )){
				return;
			}
			ToolPanel.I.showSelectInStage(tar);
			NodeToolView.I.showByNode(tar,false);
			this.view.selectWhenClick.selected=false;
			DebugTool.showDisBound(tar);
			this.clickSelectChange();
		}

		__proto.selectTarget=function(tar){
			if (!tar)return;
			ToolPanel.I.showSelectInStage(tar);
			DebugTool.showDisBound(tar);
		}

		__proto.clickSelectChange=function(){
			DebugPanelView.isClickSelectState=this.view.selectWhenClick.selected;
			if (!Browser.onPC)return;
			this.tSelectTar=null;
			this.clearSelectTip();
			if (DebugPanelView.isClickSelectState){
				Laya.timer.loop(200,this,this.updateSelectTar,null,true);
				}else{
				Laya.timer.clear(this,this.updateSelectTar);
			}
		}

		__proto.clearSelectTip=function(){
			this._selectTip.removeSelf();
		}

		__proto.updateSelectTar=function(){
			this.clearSelectTip();
			this.tSelectTar=DisplayHook.instance.getDisUnderMouse();
			if (!this.tSelectTar){
				return;
			}
			if (DebugInfoLayer.I.isDebugItem(this.tSelectTar))return;
			var g;
			g=this._selectTip.graphics;
			g.clear();
			var rec;
			rec=NodeUtils.getGRec(this.tSelectTar);
			DebugInfoLayer.I.popLayer.addChild(this._selectTip);
			g.drawRect(0,0,rec.width,rec.height,null,"#00ffff",2);
			this._selectTip.pos(rec.x,rec.y);
		}

		__getset(1,DebugPanelView,'I',function(){
			if (!DebugPanelView._I)DebugPanelView._I=new DebugPanelView();
			return DebugPanelView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		DebugPanelView._I=null
		DebugPanelView.ignoreDebugTool=true;
		DebugPanelView.isClickSelectState=false;
		__static(DebugPanelView,
		['tempPos',function(){return this.tempPos=new Point();}
		]);
		return DebugPanelView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.FilterView extends laya.debug.view.nodeInfo.views.UIViewBase
	var FilterView=(function(_super){
		function FilterView(){
			this.input=null;
			FilterView.__super.call(this);
		}

		__class(FilterView,'laya.debug.view.nodeInfo.views.FilterView',_super);
		var __proto=FilterView.prototype;
		__proto.createPanel=function(){
			this.input=new Input();
			this.input.size(400,500);
			this.input.multiline=true;
			this.input.bgColor="#ff00ff";
			this.input.fontSize=24;
			this.addChild(this.input);
		}

		__proto.show=function(){
			this.input.text=NodeInfosItem.showValues.join("\n");
			_super.prototype.show.call(this);
		}

		__proto.close=function(){
			_super.prototype.close.call(this);
			NodeInfosItem.showValues=this.input.text.split("\n");
		}

		return FilterView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.FindSmallView extends laya.debug.view.nodeInfo.views.UIViewBase
	var FindSmallView=(function(_super){
		function FindSmallView(){
			this.view=null;
			FindSmallView.__super.call(this);
		}

		__class(FindSmallView,'laya.debug.view.nodeInfo.views.FindSmallView',_super);
		var __proto=FindSmallView.prototype;
		__proto.createPanel=function(){
			this.view=new FindNodeSmall();
			StyleConsts.setViewScale(this.view);
			DisControlTool.setDragingItem(this.view.bg,this.view);
			this.view.typeSelect.selectedIndex=1;
			this.view.closeBtn.on("click",this,this.close);
			this.view.findBtn.on("click",this,this.onFind);
			this.dis=this.view;
		}

		__proto.onFind=function(){
			var key;
			key=this.view.findTxt.text;
			key=StringTool.trimSide(key);
			var nodeList;
			if (this.view.typeSelect.selectedIndex==0){
				nodeList=DebugTool.findNameHas(key,false);
				}else{
				nodeList=DebugTool.findClassHas(Laya.stage,key);
			}
			ToolPanel.I.showSelectItems(nodeList);
			this.close();
		}

		__getset(1,FindSmallView,'I',function(){
			if (!FindSmallView._I)FindSmallView._I=new FindSmallView();
			return FindSmallView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		FindSmallView._I=null
		return FindSmallView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.FindView extends laya.debug.view.nodeInfo.views.UIViewBase
	var FindView=(function(_super){
		function FindView(){
			this.view=null;
			FindView.__super.call(this);
		}

		__class(FindView,'laya.debug.view.nodeInfo.views.FindView',_super);
		var __proto=FindView.prototype;
		__proto.createPanel=function(){
			this.view=new FindNode();
			DisControlTool.setDragingItem(this.view.bg,this.view);
			this.view.result.scrollBar.hide=true;
			this.view.result.array=[];
			this.view.typeSelect.selectedIndex=1;
			this.view.closeBtn.on("click",this,this.close);
			this.view.findBtn.on("click",this,this.onFind);
			NodeMenu.I.setNodeListAction(this.view.result);
			this.dis=this.view;
		}

		__proto.onRightClick=function(){
			var list;
			list=this.view.result;
			if (list.selectedItem){
				var tarNode;
				tarNode=list.selectedItem.path;
				NodeMenu.I.objRightClick(tarNode);
			}
		}

		//}
		__proto.onFind=function(){
			var key;
			key=this.view.findTxt.text;
			key=StringTool.trimSide(key);
			var nodeList;
			if (this.view.typeSelect.selectedIndex==0){
				nodeList=DebugTool.findNameHas(key,false);
				}else{
				nodeList=DebugTool.findClassHas(Laya.stage,key);
			}
			this.showFindResult(nodeList);
		}

		__proto.showFindResult=function(nodeList){
			if (!nodeList)return;
			var i=0,len=0;
			len=nodeList.length;
			var showList;
			showList=[];
			var tData;
			var tSprite;
			for (i=0;i < len;i++){
				tSprite=nodeList[i];
				tData={};
				tData.label=ClassTool.getNodeClassAndName(tSprite);
				tData.path=tSprite;
				showList.push(tData);
			}
			this.view.result.array=showList;
		}

		__getset(1,FindView,'I',function(){
			if (!FindView._I)FindView._I=new FindView();
			return FindView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		FindView._I=null
		return FindView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.NodeListPanelView extends laya.debug.view.nodeInfo.views.UIViewBase
	var NodeListPanelView=(function(_super){
		function NodeListPanelView(){
			this.view=null;
			NodeListPanelView.__super.call(this);
		}

		__class(NodeListPanelView,'laya.debug.view.nodeInfo.views.NodeListPanelView',_super);
		var __proto=NodeListPanelView.prototype;
		__proto.createPanel=function(){
			this.view=new NodeListPanel();
			this.addChild(this.view);
			DisControlTool.setDragingItem(this.view.bg,this.view);
			NodeMenu.I.setNodeListAction(this.view.itemList);
			this.view.closeBtn.on("click",this,this.close);
			this.view.itemList.scrollBar.hide=true;
			this.dis=this;
			this.view.itemList.array=[];
		}

		//fresh();
		__proto.showList=function(list){
			this.view.itemList.array=list;
			this.show();
		}

		__getset(1,NodeListPanelView,'I',function(){
			if (!NodeListPanelView._I)
				NodeListPanelView._I=new NodeListPanelView();
			return NodeListPanelView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		NodeListPanelView._I=null
		NodeListPanelView.filterDebugNodes=true;
		return NodeListPanelView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.NodeToolView extends laya.debug.view.nodeInfo.views.UIViewBase
	var NodeToolView=(function(_super){
		function NodeToolView(){
			this.view=null;
			this.dragIcon=null;
			this._tar=null;
			NodeToolView.__super.call(this);
		}

		__class(NodeToolView,'laya.debug.view.nodeInfo.views.NodeToolView',_super);
		var __proto=NodeToolView.prototype;
		__proto.show=function(){
			this.showByNode();
		}

		__proto.createPanel=function(){
			this.view=new NodeTool();
			this.addChild(this.view);
			this.view.on("click",this,this.onBtnClick);
			this.view.closeBtn.on("click",this,this.onCloseBtn);
			DisControlTool.setDragingItem(this.view.bg,this.view);
			this.dis=this.view;
			this.view.freshBtn.on("click",this,this.onFreshBtn);
			this.dragIcon=this.view.dragIcon;
			this.dragIcon.removeSelf();
			this.dragIcon.on("dragend",this,this.mouseAnalyserDragEnd);
			this.view.mouseAnalyseBtn.on("mousedown",this,this.mouseAnalyserMouseDown);
		}

		__proto.mouseAnalyserMouseDown=function(){
			var gPos=NodeToolView.tempPos;
			gPos.setTo(0,0);
			gPos=this.view.mouseAnalyseBtn.localToGlobal(gPos);
			this.dragIcon.pos(gPos.x,gPos.y);
			this.dragIcon.mouseEnabled=false;
			Laya.stage.addChild(this.dragIcon);
			this.dragIcon.startDrag();
		}

		__proto.mouseAnalyserDragEnd=function(){
			this.dragIcon.removeSelf();
			if (laya.debug.view.nodeInfo.views.NodeToolView.I.target){
				MouseEventAnalyser.analyseNode(laya.debug.view.nodeInfo.views.NodeToolView.I.target);
			}
		}

		__proto.onFreshBtn=function(){
			if (!this._tar)return;
			this._tar.reCache();
			this._tar.repaint();
		}

		__proto.onCloseBtn=function(){
			this.close();
		}

		__proto.onBtnClick=function(e){
			if (!this._tar)return;
			var tar;
			tar=e.target;
			console.log("onBtnClick:",tar);
			var txt;
			txt=(tar).label;
			switch(txt){
				case "父链":
					DebugTool.showParentChain(this._tar);
					SelectInfosView.I.setSelectList(DebugTool.selectedNodes);
					break ;
				case "子":
					DebugTool.showAllChild(this._tar);
					SelectInfosView.I.setSelectList(DebugTool.selectedNodes);
					break ;
				case "兄弟":
					DebugTool.showAllBrother(this._tar);
					SelectInfosView.I.setSelectList(DebugTool.selectedNodes);
					break ;
				case "Enable链":
					OutPutView.I.dTrace(DebugTool.traceDisMouseEnable(this._tar));
					SelectInfosView.I.setSelectList(DebugTool.selectedNodes);
					break ;
				case "Size链":
					OutPutView.I.dTrace(DebugTool.traceDisSizeChain(this._tar));
					SelectInfosView.I.setSelectList(DebugTool.selectedNodes);
					break ;
				case "隐藏旁支":
					NodeInfoPanel.I.recoverNodes();
					NodeInfoPanel.I.hideOtherChain(this._tar);
					break ;
				case "隐藏兄弟":
					NodeInfoPanel.I.recoverNodes();
					NodeInfoPanel.I.hideBrothers(this._tar);
					break ;
				case "隐藏子":
					NodeInfoPanel.I.recoverNodes();
					NodeInfoPanel.I.hideChilds(this._tar);
					break ;
				case "恢复":
					NodeInfoPanel.I.recoverNodes();
					break ;
				case "节点树定位":
					ToolPanel.I.showSelectInStage(this._tar);
					break ;
				case "显示边框":
					DebugTool.showDisBound(this._tar);
					break ;
				case "输出到控制台":
					console.log(this._tar);
					break ;
				case "显示切换":
					this._tar.visible=!this._tar.visible;
					break ;
				}
		}

		__proto.showByNode=function(node,ifShow){
			(ifShow===void 0)&& (ifShow=true);
			if (!node)node=Laya.stage;
			if(ifShow)
				_super.prototype.show.call(this);
			this._tar=node;
			this.fresh();
		}

		__proto.fresh=function(){
			if (!this._tar)return;
			this.view.tarTxt.text=ClassTool.getNodeClassAndName(this._tar);
		}

		__getset(0,__proto,'target',function(){
			return this._tar;
		});

		__getset(1,NodeToolView,'I',function(){
			if (!NodeToolView._I)NodeToolView._I=new NodeToolView();
			return NodeToolView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		NodeToolView._I=null
		__static(NodeToolView,
		['tempPos',function(){return this.tempPos=new Point();}
		]);
		return NodeToolView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.NodeTreeSettingView extends laya.debug.view.nodeInfo.views.UIViewBase
	var NodeTreeSettingView=(function(_super){
		function NodeTreeSettingView(){
			this.view=null;
			this._handler=null;
			NodeTreeSettingView.__super.call(this);
		}

		__class(NodeTreeSettingView,'laya.debug.view.nodeInfo.views.NodeTreeSettingView',_super);
		var __proto=NodeTreeSettingView.prototype;
		__proto.createPanel=function(){
			_super.prototype.createPanel.call(this);
			this.view=new NodeTreeSetting();
			StyleConsts.setViewScale(this.view);
			this.addChild(this.view);
			this.inits();
			this.dis=this.view;
		}

		__proto.show=function(){
			_super.prototype.show.call(this);
		}

		__proto.showSetting=function(filters,callBack,tar){
			if ((tar instanceof laya.display.Node )){
				this.view.showTxt.text=NodeConsts.defaultFitlerStr.split(",").join("\n");
				}else{
				this.view.showTxt.text=filters.join("\n");
			}
			this._handler=callBack;
			this.show();
		}

		__proto.inits=function(){
			this.view.okBtn.on("click",this,this.onOkBtn);
			this.view.closeBtn.on("click",this,this.onCloseBtn);
			DisControlTool.setDragingItem(this.view.bg,this.view);
			this.dis=this.view;
		}

		__proto.onCloseBtn=function(){
			this.close();
		}

		__proto.onOkBtn=function(){
			this.close();
			var showArr;
			showArr=this.view.showTxt.text.split("\n");
			if (this._handler){
				this._handler.runWith([showArr]);
				this._handler=null
			}
		}

		__getset(1,NodeTreeSettingView,'I',function(){
			if (!NodeTreeSettingView._I)NodeTreeSettingView._I=new NodeTreeSettingView();
			return NodeTreeSettingView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		NodeTreeSettingView._I=null
		return NodeTreeSettingView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.NodeTreeView extends laya.debug.view.nodeInfo.views.UIViewBase
	var NodeTreeView=(function(_super){
		function NodeTreeView(){
			this.nodeTree=null;
			NodeTreeView.__super.call(this);
		}

		__class(NodeTreeView,'laya.debug.view.nodeInfo.views.NodeTreeView',_super);
		var __proto=NodeTreeView.prototype;
		__proto.show=function(){
			this.showByNode();
		}

		__proto.showByNode=function(node){
			if (!node)node=Laya.stage;
			this.nodeTree.setDis(node);
		}

		//super.show();
		__proto.createPanel=function(){
			_super.prototype.createPanel.call(this);
			if (!this.nodeTree)this.nodeTree=new NodeTree();
			this.dis=null;
			var view;
			view=this.nodeTree;
			view.top=view.bottom=view.left=view.right=0;
			this.addChild(view);
			this.showByNode(Laya.stage);
		}

		__proto.showSelectInStage=function(node){
			this.showByNode(Laya.stage);
			this.nodeTree.selectByNode(node);
		}

		return NodeTreeView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.ObjectCreateView extends laya.debug.view.nodeInfo.views.UIViewBase
	var ObjectCreateView=(function(_super){
		function ObjectCreateView(){
			this.view=null;
			this._menu=null;
			this._menuItems=["统计详情","增量详情"];
			this._tSelectKey=null;
			this.preInfo={};
			ObjectCreateView.__super.call(this);
			ObjectCreateView._I=this;
		}

		__class(ObjectCreateView,'laya.debug.view.nodeInfo.views.ObjectCreateView',_super);
		var __proto=ObjectCreateView.prototype;
		__proto.createPanel=function(){
			this.view=new ObjectCreate();
			this.view.top=this.view.bottom=this.view.left=this.view.right=0;
			this.addChild(this.view);
			this.view.itemList.on(DebugTool.getMenuShowEvent(),this,this.onRightClick);
			this.view.closeBtn.on("click",this,this.close);
			this.view.freshBtn.on("click",this,this.fresh);
			this.view.itemList.scrollBar.hide=true;
			this._menu=ContextMenu.createMenuByArray(this._menuItems);
			this._menu.on("select",this,this.onEmunSelect);
			this.fresh();
		}

		__proto.onEmunSelect=function(e){
			if (!this._tSelectKey)return;
			var data=(e.target).data;
			if ((typeof data=='string')){
				var key;
				key=data;
				var count;
				switch (key){
					case "统计详情":
						count=RunProfile.getRunInfo(this._tSelectKey);
						if (count){
							OutPutView.I.showTxt(this._tSelectKey+" createInfo:\n"+count.traceSelfR());
						}
						break ;
					case "增量详情":
						count=RunProfile.getRunInfo(this._tSelectKey);
						if (count){
							OutPutView.I.showTxt(this._tSelectKey+" createInfo:\n"+count.traceSelfR(count.changeO));
						}
						break ;
					}
			}
		}

		__proto.onRightClick=function(){
			var list;
			list=this.view.itemList;
			if (list.selectedItem){
				var tarNode;
				tarNode=list.selectedItem.path;
				this._tSelectKey=tarNode;
				if (this._tSelectKey){
					this._menu.show();
				}
			}
		}

		__proto.show=function(){
			this.fresh();
		}

		__proto.fresh=function(){
			var dataO;
			dataO=ClassCreateHook.I.createInfo;
			var key;
			var dataList;
			dataList=[];
			var tData;
			var count;
			for (key in dataO){
				if (!this.preInfo[key])
					this.preInfo[key]=0;
				tData={};
				tData.path=key;
				tData.count=dataO[key];
				tData.add=dataO[key]-this.preInfo[key];
				if (tData.add > 0){
					tData.label=key+":"+dataO[key]+" +"+tData.add;
				}
				else{
					tData.label=key+":"+dataO[key];
				}
				count=RunProfile.getRunInfo(key);
				if (count){
					count.record();
				}
				tData.rank=tData.add *1000+tData.count;
				this.preInfo[key]=dataO[key];
				dataList.push(tData);
			}
			dataList.sort(MathTools.sortByKey("rank",true,true));
			this.view.itemList.array=dataList;
		}

		__getset(1,ObjectCreateView,'I',function(){
			if (!ObjectCreateView._I)
				ObjectCreateView._I=new ObjectCreateView();
			return ObjectCreateView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		ObjectCreateView._I=null
		return ObjectCreateView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.ObjectInfoView extends laya.debug.view.nodeInfo.views.UIViewBase
	var ObjectInfoView=(function(_super){
		function ObjectInfoView(){
			this.view=null;
			this.showKeys=["x","y","width","height","renderCost"];
			this._closeSettingHandler=null;
			this._tar=null;
			ObjectInfoView.__super.call(this);
		}

		__class(ObjectInfoView,'laya.debug.view.nodeInfo.views.ObjectInfoView',_super);
		var __proto=ObjectInfoView.prototype;
		__proto.createPanel=function(){
			_super.prototype.createPanel.call(this);
			this.view=new ObjectInfo();
			StyleConsts.setViewScale(this.view);
			this.addChild(this.view);
			this.inits();
		}

		__proto.inits=function(){
			this.view.closeBtn.on("click",this,this.close);
			this.view.settingBtn.on("click",this,this.onSettingBtn);
			this.view.autoUpdate.on("change",this,this.onAutoUpdateChange);
			DisControlTool.setDragingItem(this.view.bg,this.view);
			DisControlTool.setResizeAbleEx(this.view);
			this._closeSettingHandler=new Handler(this,this.closeSetting);
			this.dis=this.view;
		}

		__proto.onAutoUpdateChange=function(){
			this.autoUpdate=this.view.autoUpdate.selected;
		}

		__proto.onSettingBtn=function(){
			NodeTreeSettingView.I.showSetting(this.showKeys,this._closeSettingHandler,this._tar);
		}

		__proto.reset=function(){
			this.showKeys=["x","y","width","height","renderCost"];
		}

		__proto.closeSetting=function(newKeys){
			this.showKeys=newKeys;
			this.fresh();
		}

		__proto.showObjectInfo=function(obj){
			this._tar=obj;
			this.fresh();
			this.show();
			this.onAutoUpdateChange();
		}

		__proto.fresh=function(){
			if (!this._tar){
				this.view.showTxt.text="";
				this.view.title.text="未选中对象";
			}
			else{
				this.view.title.text=ClassTool.getNodeClassAndName(this._tar);
				this.view.showTxt.text=ObjectInfoView.getObjValueStr(this._tar,this.showKeys,false);
			}
		}

		__proto.freshKeyInfos=function(){
			this.fresh();
		}

		__proto.close=function(){
			_super.prototype.close.call(this);
			this.autoUpdate=false;
			Pool.recover("ObjectInfoView",this);
		}

		__proto.show=function(){
			_super.prototype.show.call(this);
		}

		__getset(0,__proto,'autoUpdate',null,function(v){
			Laya.timer.clear(this,this.freshKeyInfos);
			if (v){
				Laya.timer.loop(2000,this,this.freshKeyInfos);
			}
		});

		ObjectInfoView.getObjValueStr=function(obj,keys,withTitle){
			(withTitle===void 0)&& (withTitle=true);
			var i=0,len=0;
			var tKey;
			ObjectInfoView._txts.length=0;
			len=keys.length;
			if (withTitle){
				if (obj.name){
					ObjectInfoView._txts.push(ClassTool.getClassName(obj)+"("+obj.name+")");
				}
				else{
					ObjectInfoView._txts.push(ClassTool.getClassName(obj));
				}
			}
			for (i=0;i < len;i++){
				tKey=keys[i];
				ObjectInfoView._txts.push(tKey+":"+ObjectInfoView.getNodeValue(obj,tKey));
			}
			return ObjectInfoView._txts.join("\n");
		}

		ObjectInfoView.getNodeValue=function(node,key){
			var rst;
			if ((node instanceof laya.display.Sprite )){
				var tNode;
				tNode=node;
				switch (key){
					case "gRec":
						rst=NodeUtils.getGRec(tNode).toString();
						break ;
					case "gAlpha":
						rst=NodeUtils.getGAlpha(tNode)+"";
						break ;
					case "cmdCount":
						rst=NodeUtils.getNodeCmdCount(tNode)+"";
						break ;
					case "cmdAll":
						rst=NodeUtils.getNodeCmdTotalCount(tNode)+"";
						break ;
					case "nodeAll":
						rst=""+NodeUtils.getNodeCount(tNode);
						break ;
					case "nodeVisible":
						rst=""+NodeUtils.getNodeCount(tNode,true);
						break ;
					case "nodeRender":
						rst=""+NodeUtils.getRenderNodeCount(tNode);
						break ;
					case "nodeReCache":
						rst=""+NodeUtils.getReFreshRenderNodeCount(tNode);
						break ;
					case "renderCost":
						rst=""+RenderAnalyser.I.getTime(tNode);
						break ;
					case "renderCount":
						rst=""+RenderAnalyser.I.getCount(tNode);
						break ;
					default :
						rst=node[key]+"";
					}
			}
			else{
				rst=node[key]+"";
			}
			return rst;
		}

		ObjectInfoView.showObject=function(obj){
			var infoView;
			infoView=Pool.getItemByClass("ObjectInfoView",ObjectInfoView);
			infoView.reset();
			infoView.showObjectInfo(obj);
		}

		ObjectInfoView._txts=[];
		return ObjectInfoView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.OutPutView extends laya.debug.view.nodeInfo.views.UIViewBase
	var OutPutView=(function(_super){
		function OutPutView(){
			this.view=null;
			OutPutView.__super.call(this);
			DebugTool._logFun=OutPutView.log;
		}

		__class(OutPutView,'laya.debug.view.nodeInfo.views.OutPutView',_super);
		var __proto=OutPutView.prototype;
		__proto.createPanel=function(){
			this.view=new OutPut();
			DisControlTool.setDragingItem(this.view.txt,this.view);
			DisControlTool.setDragingItem(this.view.bg,this.view);
			StyleConsts.setViewScale(this.view);
			this.view.txt.textField.overflow=Text.SCROLL;
			this.view.txt.textField.wordWrap=true;
			this.view.on("mousewheel",this,this.mouseWheel);
			this.view.txt.text="";
			DisControlTool.setResizeAbleEx(this.view);
			this.view.closeBtn.on("click",this,this.close);
			this.view.clearBtn.on("click",this,this.onClearBtn);
			this.dis=this.view;
		}

		__proto.onClearBtn=function(){
			this.clearText();
		}

		__proto.mouseWheel=function(e){
			this.view.txt.textField.scrollY-=e.delta*10;
		}

		__proto.showTxt=function(str){
			this.view.txt.text=str;
			this.show();
			this.view.txt.textField.scrollY=this.view.txt.textField.maxScrollY;
		}

		__proto.clearText=function(){
			this.view.txt.text="";
		}

		__proto.dTrace=function(__arg){
			var arg=arguments;
			if (this.view.txt.textField.scrollY > 1000){
				this.view.txt.text="";
			};
			var str;
			var i=0,len=0;
			len=arg.length;
			str=arg[0];
			for (i=1;i < len;i++){
				str+=" "+arg[i];
			}
			this.addStr(str);
		}

		__proto.addStr=function(str){
			this.view.txt.text+="\n"+str;
			this.show();
			this.view.txt.textField.scrollY=this.view.txt.textField.maxScrollY;
		}

		__getset(1,OutPutView,'I',function(){
			if (!OutPutView._I)OutPutView._I=new OutPutView();
			return OutPutView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		OutPutView.log=function(str){
			OutPutView.I.addStr(str);
		}

		OutPutView._I=null
		return OutPutView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.RenderCostRankView extends laya.debug.view.nodeInfo.views.UIViewBase
	var RenderCostRankView=(function(_super){
		function RenderCostRankView(){
			this.view=null;
			RenderCostRankView.__super.call(this);
		}

		__class(RenderCostRankView,'laya.debug.view.nodeInfo.views.RenderCostRankView',_super);
		var __proto=RenderCostRankView.prototype;
		__proto.createPanel=function(){
			this.view=new Rank();
			this.view.top=this.view.bottom=this.view.left=this.view.right=0;
			this.addChild(this.view);
			NodeMenu.I.setNodeListAction(this.view.itemList);
			this.view.closeBtn.on("click",this,this.close);
			this.view.freshBtn.on("click",this,this.fresh);
			this.view.itemList.scrollBar.hide=true;
			this.view.autoUpdate.on("change",this,this.onAutoUpdateChange);
			this.dis=this;
			this.view.itemList.array=[];
			this.onAutoUpdateChange();
			this.fresh();
			Laya.timer.once(5000,this,this.fresh);
		}

		__proto.onRightClick=function(){
			var list;
			list=this.view.itemList;
			if (list.selectedItem){
				var tarNode;
				tarNode=list.selectedItem.path;
				NodeMenu.I.objRightClick(tarNode);
			}
		}

		__proto.onAutoUpdateChange=function(){
			this.autoUpdate=this.view.autoUpdate.selected;
		}

		__proto.fresh=function(){
			this.view.title.text="渲染用时排行("+NodeConsts.RenderCostMaxTime+"ms)";
			var nodeDic;
			nodeDic=RenderAnalyser.I.nodeDic;
			var key;
			var tNode;
			var tData;
			var dataList;
			dataList=[];
			for (key in nodeDic){
				tNode=nodeDic[key];
				if (RenderCostRankView.filterDebugNodes && DisControlTool.isInTree(DebugInfoLayer.I,tNode))continue ;
				if (RenderAnalyser.I.getTime(tNode)<=0)continue ;
				tData={};
				tData.time=RenderAnalyser.I.getTime(tNode);
				if (RenderCostRankView.filterDebugNodes && tNode==Laya.stage){
					tData.time-=RenderAnalyser.I.getTime(DebugInfoLayer.I);
				}
				tData.path=tNode;
				tData.label=ClassTool.getNodeClassAndName(tNode)+":"+tData.time;
				dataList.push(tData);
			}
			dataList.sort(MathTools.sortByKey("time",true,true));
			this.view.itemList.array=dataList;
		}

		__getset(0,__proto,'autoUpdate',null,function(v){
			Laya.timer.clear(this,this.fresh);
			if (v){
				this.fresh();
				Laya.timer.loop(NodeConsts.RenderCostMaxTime,this,this.fresh);
			}
		});

		__getset(1,RenderCostRankView,'I',function(){
			if (!RenderCostRankView._I)
				RenderCostRankView._I=new RenderCostRankView();
			return RenderCostRankView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		RenderCostRankView._I=null
		RenderCostRankView.filterDebugNodes=true;
		return RenderCostRankView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.ResRankView extends laya.debug.view.nodeInfo.views.UIViewBase
	var ResRankView=(function(_super){
		function ResRankView(){
			this.view=null;
			ResRankView.__super.call(this);
		}

		__class(ResRankView,'laya.debug.view.nodeInfo.views.ResRankView',_super);
		var __proto=ResRankView.prototype;
		__proto.createPanel=function(){
			this.view=new Rank();
			this.view.top=this.view.bottom=this.view.left=this.view.right=0;
			this.addChild(this.view);
			this.view.closeBtn.on("click",this,this.close);
			this.view.freshBtn.on("click",this,this.fresh);
			this.view.itemList.scrollBar.hide=true;
			this.view.autoUpdate.on("change",this,this.onAutoUpdateChange);
			this.dis=this;
			this.view.itemList.array=[];
			this.view.itemList.on("rightclick",this,this.onRightClick);
			this.onAutoUpdateChange();
			this.fresh();
		}

		__proto.onRightClick=function(){
			var list;
			list=this.view.itemList;
			if (list.selectedItem){
				console.log(list.selectedItem["url"]);
			}
		}

		__proto.onAutoUpdateChange=function(){
			this.autoUpdate=this.view.autoUpdate.selected;
		}

		__proto.fresh=function(){
			this.view.title.text="图片缓存列表";
			var resList;
			resList=ResTools.getCachedResList();
			var key;
			var tNode;
			var tData;
			var dataList;
			dataList=[];
			var i=0,len=0;
			len=resList.length;
			for (i=0;i < len;i++){
				tData={};
				var tUrl;
				tUrl=resList[i];
				tUrl=tUrl.replace(URL.rootPath,"")
				tData.label=tUrl;
				tData.url=tUrl;
				dataList.push(tData);
			}
			this.view.itemList.array=dataList;
		}

		__getset(0,__proto,'autoUpdate',null,function(v){
			Laya.timer.clear(this,this.fresh);
			if (v){
				this.fresh();
				Laya.timer.loop(NodeConsts.RenderCostMaxTime,this,this.fresh);
			}
		});

		__getset(1,ResRankView,'I',function(){
			if (!ResRankView._I)
				ResRankView._I=new ResRankView();
			return ResRankView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		ResRankView._I=null
		ResRankView.filterDebugNodes=true;
		return ResRankView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.SelectInfosView extends laya.debug.view.nodeInfo.views.UIViewBase
	var SelectInfosView=(function(_super){
		function SelectInfosView(){
			this.showKeys=[];
			this.view=null;
			this.fliterTxt=null;
			this.itemList=null;
			SelectInfosView.__super.call(this);
			SelectInfosView._I=this;
			this.setSelectList(null);
		}

		__class(SelectInfosView,'laya.debug.view.nodeInfo.views.SelectInfosView',_super);
		var __proto=SelectInfosView.prototype;
		__proto.createPanel=function(){
			this.view=new SelectInfos();
			this.addChild(this.view);
			this.view.top=this.view.bottom=this.view.left=this.view.right=0;
			NodeMenu.I.setNodeListAction(this.view.selectList);
			this.view.closeBtn.on("click",this,this.close);
			this.view.selectList.scrollBar.hide=true;
			this.dis=null;
			this.view.findBtn.on("click",this,this.onFindBtn);
			this.fliterTxt=this.view.fliterTxt;
			this.view.fliterTxt.on("enter",this,this.onFliterTxtChange);
			this.view.fliterTxt.on("blur",this,this.onFliterTxtChange);
		}

		__proto.onFliterTxtChange=function(e){
			var key;
			key=this.fliterTxt.text;
			if (key==""){
				if (this.showKeys.length !=0){
					this.showKeys.length=0;
					this.fresh();
				}
			}else
			if (key !=this.showKeys.join(",")){
				this.showKeys=key.split(",");
				this.fresh();
			}
		}

		__proto.onFindBtn=function(){
			FindSmallView.I.show();
		}

		__proto.onRightClick=function(){
			var list;
			list=this.view.selectList;
			if (list.selectedItem){
				var tarNode;
				tarNode=list.selectedItem.path;
				NodeMenu.I.objRightClick(tarNode);
			}
		}

		//}
		__proto.setSelectTarget=function(node){
			if (!node)return;
			this.setSelectList([node]);
		}

		__proto.setSelectList=function(list){
			this.itemList=list;
			this.fresh();
		}

		//show();
		__proto.fresh=function(){
			var list;
			list=this.itemList;
			if (!list || list.length < 1){
				this.view.selectList.array=[];
				return;
			};
			var i=0,len=0;
			var tDis;
			var tData;
			len=list.length;
			var disList;
			disList=[];
			for (i=0;i < len;i++){
				tDis=list[i];
				tData={};
				tData.label=this.getLabelTxt(tDis);
				tData.path=tDis;
				disList.push(tData);
			}
			this.view.selectList.array=disList;
		}

		__proto.getLabelTxt=function(item){
			var rst;
			rst=ClassTool.getNodeClassAndName(item);
			var i=0,len=0;
			len=this.showKeys.length;
			for (i=0;i < len;i++){
				rst+=","+ObjectInfoView.getNodeValue(item,this.showKeys[i]);
			}
			return rst;
		}

		__getset(1,SelectInfosView,'I',function(){
			if (!SelectInfosView._I)SelectInfosView._I=new SelectInfosView();
			return SelectInfosView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		SelectInfosView._I=null
		return SelectInfosView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.ToolBarView extends laya.debug.view.nodeInfo.views.UIViewBase
	var ToolBarView=(function(_super){
		function ToolBarView(){
			this.view=null;
			ToolBarView.__super.call(this);
		}

		__class(ToolBarView,'laya.debug.view.nodeInfo.views.ToolBarView',_super);
		var __proto=ToolBarView.prototype;
		__proto.createPanel=function(){
			this.view=new ToolBar();
			this.addChild(this.view);
			DisControlTool.setDragingItem(this.view.bg,this.view);
			this.view.on("click",this,this.onBtnClick);
			this.view.minBtn.minHandler=this.minHandler;
			this.view.minBtn.maxHandler=this.maxHandler;
			this.view.minBtn.tar=this.view;
			this.clickSelectChange();
			this.view.selectWhenClick.on("change",this,this.clickSelectChange);
			Notice.listen("ItemClicked",this,this.itemClicked);
			this.dis=this.view;
		}

		__proto.itemClicked=function(tar){
			if (!ToolBarView.isClickSelectState)return;
			if (DisControlTool.isInTree(this.view.selectWhenClick,tar))return;
			if (ToolBarView.ignoreDebugTool){
				if (DebugInfoLayer.I.isDebugItem(tar))return;
			}
		}

		__proto.clickSelectChange=function(){
			ToolBarView.isClickSelectState=this.view.selectWhenClick.selected;
		}

		__proto.firstShowFun=function(){
			this.dis.x=Laya.stage.width-this.dis.width-20;
			this.dis.y=5;
		}

		__proto.onBtnClick=function(e){
			switch(e.target){
				case this.view.treeBtn:
					ToolPanel.I.switchShow("Tree");
					break ;
				case this.view.findBtn:
					ToolPanel.I.switchShow("Find");
					break ;
				case this.view.clearBtn:
					DebugTool.clearDebugLayer();
					break ;
				case this.view.rankBtn:
					RenderCostRankView.I.show();
					break ;
				case this.view.nodeRankBtn:
					ObjectCreateView.I.show();
					break ;
				case this.view.cacheBtn:
					NodeUtils.showCachedSpriteRecs();
					break ;
				}
		}

		__getset(1,ToolBarView,'I',function(){
			if (!ToolBarView._I)ToolBarView._I=new ToolBarView();
			return ToolBarView._I;
		},laya.debug.view.nodeInfo.views.UIViewBase._$SET_I);

		ToolBarView._I=null
		ToolBarView.ignoreDebugTool=true;
		ToolBarView.isClickSelectState=false;
		return ToolBarView;
	})(UIViewBase)


	//class laya.debug.view.nodeInfo.views.TxtInfoView extends laya.debug.view.nodeInfo.views.UIViewBase
	var TxtInfoView=(function(_super){
		function TxtInfoView(){
			this.input=null;
			this.btn=null;
			TxtInfoView.__super.call(this);
		}

		__class(TxtInfoView,'laya.debug.view.nodeInfo.views.TxtInfoView',_super);
		var __proto=TxtInfoView.prototype;
		__proto.createPanel=function(){
			this.input=new Input();
			this.input.size(200,400);
			this.input.multiline=true;
			this.input.bgColor="#ff00ff";
			this.input.fontSize=12;
			this.input.wordWrap=true;
			this.addChild(this.input);
			this.btn=this.getButton();
			this.btn.text="关闭";
			this.btn.size(50,20);
			this.btn.align="center";
			this.btn.on("mousedown",this,this.onCloseBtn);
			this.btn.pos(5,this.input.height+5);
			this.addChild(this.btn);
		}

		__proto.showInfo=function(txt){
			this.input.text=txt;
			this.show();
		}

		__proto.show=function(){
			DebugInfoLayer.I.setTop();
			DebugInfoLayer.I.popLayer.addChild(this);
			this.x=(Laya.stage.width-this.width);
			this.y=0;
		}

		__proto.onCloseBtn=function(){
			this.close();
		}

		return TxtInfoView;
	})(UIViewBase)


	//class laya.debug.tools.debugUI.DInput extends laya.display.Input
	var DInput=(function(_super){
		function DInput(){
			DInput.__super.call(this);
			this.bgColor="#11ff00";
		}

		__class(DInput,'laya.debug.tools.debugUI.DInput',_super);
		return DInput;
	})(Input)


	//class laya.ui.CheckBox extends laya.ui.Button
	var CheckBox=(function(_super){
		/**
		*创建一个新的 <code>CheckBox</code> 组件实例。
		*@param skin 皮肤资源地址。
		*@param label 文本标签的内容。
		*/
		function CheckBox(skin,label){
			(label===void 0)&& (label="");
			CheckBox.__super.call(this,skin,label);
		}

		__class(CheckBox,'laya.ui.CheckBox',_super);
		var __proto=CheckBox.prototype;
		/**@inheritDoc */
		__proto.preinitialize=function(){
			laya.ui.Component.prototype.preinitialize.call(this);
			this.toggle=true;
			this._autoSize=false;
		}

		/**@inheritDoc */
		__proto.initialize=function(){
			_super.prototype.initialize.call(this);
			this.createText();
			this._text.align="left";
			this._text.valign="top";
			this._text.width=0;
		}

		/**@inheritDoc */
		__getset(0,__proto,'dataSource',_super.prototype._$get_dataSource,function(value){
			this._dataSource=value;
			if ((typeof value=='boolean'))this.selected=value;
			else if ((typeof value=='string'))this.selected=value==="true";
			else _super.prototype._$set_dataSource.call(this,value);
		});

		return CheckBox;
	})(Button)


	//class laya.ui.Radio extends laya.ui.Button
	var Radio=(function(_super){
		function Radio(skin,label){
			this._value=null;
			(label===void 0)&& (label="");
			Radio.__super.call(this,skin,label);
		}

		__class(Radio,'laya.ui.Radio',_super);
		var __proto=Radio.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._value=null;
		}

		/**@inheritDoc */
		__proto.preinitialize=function(){
			laya.ui.Component.prototype.preinitialize.call(this);
			this.toggle=false;
			this._autoSize=false;
		}

		/**@inheritDoc */
		__proto.initialize=function(){
			_super.prototype.initialize.call(this);
			this.createText();
			this._text.align="left";
			this._text.valign="top";
			this._text.width=0;
			this.on("click",this,this.onClick);
		}

		/**
		*@private
		*对象的<code>Event.CLICK</code>事件侦听处理函数。
		*/
		__proto.onClick=function(e){
			this.selected=true;
		}

		/**
		*获取或设置 <code>Radio</code> 关联的可选用户定义值。
		*/
		__getset(0,__proto,'value',function(){
			return this._value !=null ? this._value :this.label;
			},function(obj){
			this._value=obj;
		});

		return Radio;
	})(Button)


	//class laya.ui.FontClip extends laya.ui.Clip
	var FontClip=(function(_super){
		function FontClip(skin,sheet){
			this._valueArr=null;
			this._indexMap=null;
			this._sheet=null;
			this._direction="horizontal";
			this._spaceX=0;
			this._spaceY=0;
			FontClip.__super.call(this);
			if (skin)this.skin=skin;
			if (sheet)this.sheet=sheet;
		}

		__class(FontClip,'laya.ui.FontClip',_super);
		var __proto=FontClip.prototype;
		__proto.createChildren=function(){
			this._bitmap=new AutoBitmap();
			this.on("loaded",this,this._onClipLoaded);
		}

		/**
		*资源加载完毕
		*/
		__proto._onClipLoaded=function(){
			this.callLater(this.changeValue);
		}

		/**渲染数值*/
		__proto.changeValue=function(){
			if (!this._sources)return;
			if (!this._valueArr)return;
			this.graphics.clear();
			var texture;
			var isHorizontal=(this._direction==="horizontal");
			for (var i=0,sz=this._valueArr.length;i < sz;i++){
				var index=this._indexMap[this._valueArr[i]];
				if (!this.sources[index])continue ;
				texture=this.sources[index];
				if (isHorizontal)this.graphics.drawTexture(texture,i *(texture.width+this.spaceX),0,texture.width,texture.height);
				else this.graphics.drawTexture(texture,0,i *(texture.height+this.spaceY),texture.width,texture.height);
			}
			if (!texture)return;
			if (isHorizontal)this.size(this._valueArr.length *(texture.width+this.spaceX),texture.height);
			else this.size(texture.width,(texture.height+this.spaceY)*this._valueArr.length);
		}

		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this._valueArr=null;
			this._indexMap=null;
			this._indexMap=null;
			this.graphics.clear();
			this.removeSelf();
			this.off("loaded",this,this._onClipLoaded);
			_super.prototype.destroy.call(this,destroyChild);
		}

		/**
		*设置位图字体内容，空格代表换行。比如"abc123 456"，代表第一行对应的文字为"abc123"，第二行为"456"
		*/
		__getset(0,__proto,'sheet',function(){
			return this._sheet;
			},function(value){
			value+="";
			this._sheet=value;
			var arr=value.split(" ");
			this._clipX=String(arr[0]).length;
			this.clipY=arr.length;
			this._indexMap={};
			for (var i=0;i < this._clipY;i++){
				var line=arr[i].split("");
				for (var j=0,n=line.length;j < n;j++){
					this._indexMap[line[j]]=i *this._clipX+j;
				}
			}
		});

		/**
		*布局方向。
		*<p>默认值为"horizontal"。</p>
		*<p><b>取值：</b>
		*<li>"horizontal"：表示水平布局。</li>
		*<li>"vertical"：表示垂直布局。</li>
		*</p>
		*/
		__getset(0,__proto,'direction',function(){
			return this._direction;
			},function(value){
			this._direction=value;
			this.callLater(this.changeValue);
		});

		/**
		*设置位图字体的显示内容
		*/
		__getset(0,__proto,'value',function(){
			if (!this._valueArr)return "";
			return this._valueArr.join("");
			},function(value){
			value+="";
			this._valueArr=value.split("");
			this.callLater(this.changeValue);
		});

		/**X方向文字间隙*/
		__getset(0,__proto,'spaceX',function(){
			return this._spaceX;
			},function(value){
			this._spaceX=value;
			if (this._direction==="horizontal")this.callLater(this.changeValue);
		});

		/**Y方向文字间隙*/
		__getset(0,__proto,'spaceY',function(){
			return this._spaceY;
			},function(value){
			this._spaceY=value;
			if (!(this._direction==="horizontal"))this.callLater(this.changeValue);
		});

		return FontClip;
	})(Clip)


	//class laya.ui.HScrollBar extends laya.ui.ScrollBar
	var HScrollBar=(function(_super){
		function HScrollBar(){HScrollBar.__super.call(this);;
		};

		__class(HScrollBar,'laya.ui.HScrollBar',_super);
		var __proto=HScrollBar.prototype;
		/**@inheritDoc */
		__proto.initialize=function(){
			_super.prototype.initialize.call(this);
			this.slider.isVertical=false;
		}

		return HScrollBar;
	})(ScrollBar)


	//class laya.ui.HSlider extends laya.ui.Slider
	var HSlider=(function(_super){
		/**
		*创建一个 <code>HSlider</code> 类实例。
		*@param skin 皮肤。
		*/
		function HSlider(skin){
			HSlider.__super.call(this,skin);
			this.isVertical=false;
		}

		__class(HSlider,'laya.ui.HSlider',_super);
		return HSlider;
	})(Slider)


	//class laya.ui.VScrollBar extends laya.ui.ScrollBar
	var VScrollBar=(function(_super){
		function VScrollBar(){VScrollBar.__super.call(this);;
		};

		__class(VScrollBar,'laya.ui.VScrollBar',_super);
		return VScrollBar;
	})(ScrollBar)


	//class laya.ui.TextInput extends laya.ui.Label
	var TextInput=(function(_super){
		function TextInput(text){
			this._bg=null;
			this._skin=null;
			TextInput.__super.call(this);
			(text===void 0)&& (text="");
			this.text=text;
			this.skin=this.skin;
		}

		__class(TextInput,'laya.ui.TextInput',_super);
		var __proto=TextInput.prototype;
		/**@inheritDoc */
		__proto.preinitialize=function(){
			this.mouseEnabled=true;
		}

		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._bg && this._bg.destroy();
			this._bg=null;
		}

		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._tf=new Input());
			this._tf.padding=Styles.inputLabelPadding;
			this._tf.on("input",this,this._onInput);
			this._tf.on("enter",this,this._onEnter);
			this._tf.on("blur",this,this._onBlur);
			this._tf.on("focus",this,this._onFocus);
		}

		/**
		*@private
		*/
		__proto._onFocus=function(){
			this.event("focus",this);
		}

		/**
		*@private
		*/
		__proto._onBlur=function(){
			this.event("blur",this);
		}

		/**
		*@private
		*/
		__proto._onInput=function(){
			this.event("input",this);
		}

		/**
		*@private
		*/
		__proto._onEnter=function(){
			this.event("enter",this);
		}

		/**@inheritDoc */
		__proto.initialize=function(){
			this.width=128;
			this.height=22;
		}

		/**选中输入框内的文本。*/
		__proto.select=function(){
			(this._tf).select();
		}

		__proto.setSelection=function(startIndex,endIndex){
			(this._tf).setSelection(startIndex,endIndex);
		}

		/**
		*当前文本内容字符串。
		*@see laya.display.Text.text
		*/
		__getset(0,__proto,'text',_super.prototype._$get_text,function(value){
			if (this._tf.text !=value){
				value=value+"";
				this._tf.text=value;
				this.event("change");
			}
		});

		/**
		*表示此对象包含的文本背景 <code>AutoBitmap</code> 组件实例。
		*/
		__getset(0,__proto,'bg',function(){
			return this._bg;
			},function(value){
			this.graphics=this._bg=value;
		});

		/**
		*设置原生input输入框的y坐标偏移。
		*/
		__getset(0,__proto,'inputElementYAdjuster',function(){
			return (this._tf).inputElementYAdjuster;
			},function(value){
			(this._tf).inputElementYAdjuster=value;
		});

		/**
		*<p>指示当前是否是文本域。</p>
		*值为true表示当前是文本域，否则不是文本域。
		*/
		__getset(0,__proto,'multiline',function(){
			return (this._tf).multiline;
			},function(value){
			(this._tf).multiline=value;
		});

		/**
		*@copy laya.ui.Image#skin
		*/
		__getset(0,__proto,'skin',function(){
			return this._skin;
			},function(value){
			if (this._skin !=value){
				this._skin=value;
				this._bg || (this.graphics=this._bg=new AutoBitmap());
				this._bg.source=Loader.getRes(this._skin);
				this._width && (this._bg.width=this._width);
				this._height && (this._bg.height=this._height);
			}
		});

		/**
		*<p>当前实例的背景图（ <code>AutoBitmap</code> ）实例的有效缩放网格数据。</p>
		*<p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		*<ul><li>例如："4,4,4,4,1"</li></ul></p>
		*@see laya.ui.AutoBitmap.sizeGrid
		*/
		__getset(0,__proto,'sizeGrid',function(){
			return this._bg && this._bg.sizeGrid ? this._bg.sizeGrid.join(","):null;
			},function(value){
			this._bg || (this.graphics=this._bg=new AutoBitmap());
			this._bg.sizeGrid=UIUtils.fillArray(Styles.defaultSizeGrid,value,Number);
		});

		/**
		*设置原生input输入框的x坐标偏移。
		*/
		__getset(0,__proto,'inputElementXAdjuster',function(){
			return (this._tf).inputElementXAdjuster;
			},function(value){
			(this._tf).inputElementXAdjuster=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this._bg && (this._bg.width=value);
		});

		/**@inheritDoc */
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this._bg && (this._bg.height=value);
		});

		/**
		*设置可编辑状态。
		*/
		__getset(0,__proto,'editable',function(){
			return (this._tf).editable;
			},function(value){
			(this._tf).editable=value;
		});

		/**限制输入的字符。*/
		__getset(0,__proto,'restrict',function(){
			return (this._tf).restrict;
			},function(pattern){
			(this._tf).restrict=pattern;
		});

		/**
		*@copy laya.display.Input#prompt
		*/
		__getset(0,__proto,'prompt',function(){
			return (this._tf).prompt;
			},function(value){
			(this._tf).prompt=value;
		});

		/**
		*@copy laya.display.Input#promptColor
		*/
		__getset(0,__proto,'promptColor',function(){
			return (this._tf).promptColor;
			},function(value){
			(this._tf).promptColor=value;
		});

		/**
		*@copy laya.display.Input#maxChars
		*/
		__getset(0,__proto,'maxChars',function(){
			return (this._tf).maxChars;
			},function(value){
			(this._tf).maxChars=value;
		});

		/**
		*@copy laya.display.Input#focus
		*/
		__getset(0,__proto,'focus',function(){
			return (this._tf).focus;
			},function(value){
			(this._tf).focus=value;
		});

		/**
		*@copy laya.display.Input#type
		*/
		__getset(0,__proto,'type',function(){
			return (this._tf).type;
			},function(value){
			(this._tf).type=value;
		});

		/**
		*@copy laya.display.Input#asPassword
		*/
		__getset(0,__proto,'asPassword',function(){
			return (this._tf).asPassword;
			},function(value){
			(this._tf).asPassword=value;
		});

		return TextInput;
	})(Label)


	//class laya.ui.VSlider extends laya.ui.Slider
	var VSlider=(function(_super){
		function VSlider(){VSlider.__super.call(this);;
		};

		__class(VSlider,'laya.ui.VSlider',_super);
		return VSlider;
	})(Slider)


	//class laya.utils.GraphicAnimation extends laya.display.FrameAnimation
	var GraphicAnimation=(function(_super){
		var GraphicNode;
		function GraphicAnimation(){
			this.animationList=null;
			this.animationDic=null;
			this._nodeList=null;
			this._nodeDefaultProps=null;
			this._gList=null;
			this._nodeIDAniDic={};
			this._rootNode=null;
			this._nodeGDic=null;
			GraphicAnimation.__super.call(this);
		}

		__class(GraphicAnimation,'laya.utils.GraphicAnimation',_super);
		var __proto=GraphicAnimation.prototype;
		/**
		*@private
		*/
		__proto._parseNodeList=function(uiView){
			if (!this._nodeList){
				this._nodeList=[];
			}
			this._nodeDefaultProps[uiView.compId]=uiView.props;
			if (uiView.compId)
				this._nodeList.push(uiView.compId);
			var childs=uiView.child;
			if (childs){
				var i=0,len=childs.length;
				for (i=0;i < len;i++){
					this._parseNodeList(childs[i]);
				}
			}
		}

		/**
		*@private
		*/
		__proto._calGraphicData=function(aniData){
			this._setUp(null,aniData);
			this._createGraphicData();
		}

		/**
		*@private
		*/
		__proto._createGraphicData=function(){
			var gList=[];
			var i=0,len=this.count;
			var animationDataNew=this._animationNewFrames;
			if (!animationDataNew)animationDataNew=[];
			var preGraphic;
			for (i=0;i < len;i++){
				if (animationDataNew[i] || !preGraphic){
					preGraphic=this._createFrameGraphic(i);
				}
				gList.push(preGraphic);
			}
			this._gList=gList;
		}

		/**
		*@private
		*/
		__proto._createFrameGraphic=function(frame){
			var g=new Graphics();
			if (!GraphicAnimation._rootMatrix)
				GraphicAnimation._rootMatrix=new Matrix();
			this._updateNodeGraphic(this._rootNode,frame,GraphicAnimation._rootMatrix,g);
			return g;
		}

		__proto._updateNodeGraphic=function(node,frame,parentTransfrom,g,alpha){
			(alpha===void 0)&& (alpha=1);
			var tNodeG;
			tNodeG=this._nodeGDic[node.compId]=this._getNodeGraphicData(node.compId,frame,this._nodeGDic[node.compId]);
			if (!tNodeG.resultTransform)
				tNodeG.resultTransform=new Matrix();
			var tResultTransform;
			tResultTransform=tNodeG.resultTransform;
			Matrix.mul(tNodeG.transform,parentTransfrom,tResultTransform);
			var tTex;
			var tGraphicAlpha=tNodeG.alpha *alpha;
			if (tGraphicAlpha < 0.01)return;
			if (tNodeG.skin){
				tTex=this._getTextureByUrl(tNodeG.skin);
				if (tTex){
					if (tResultTransform._checkTransform()){
						g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height,tResultTransform,tGraphicAlpha);
						tNodeG.resultTransform=null;
						}else {
						g.drawTexture(tTex,tResultTransform.tx,tResultTransform.ty,tNodeG.width,tNodeG.height,null,tGraphicAlpha);
					}
				}
			};
			var childs;
			childs=node.child;
			if (!childs)
				return;
			var i=0,len=0;
			len=childs.length;
			for (i=0;i < len;i++){
				this._updateNodeGraphic(childs[i],frame,tResultTransform,g,tGraphicAlpha);
			}
		}

		__proto._updateNoChilds=function(tNodeG,g){
			if (!tNodeG.skin)
				return;
			var tTex=this._getTextureByUrl(tNodeG.skin);
			if (!tTex)
				return;
			var tTransform=tNodeG.transform;
			tTransform._checkTransform();
			var onlyTranslate=false;
			onlyTranslate=!tTransform.bTransform;
			if (!onlyTranslate){
				g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height,tTransform.clone(),tNodeG.alpha);
				}else {
				g.drawTexture(tTex,tTransform.tx,tTransform.ty,tNodeG.width,tNodeG.height,null,tNodeG.alpha);
			}
		}

		__proto._updateNodeGraphic2=function(node,frame,g){
			var tNodeG;
			tNodeG=this._nodeGDic[node.compId]=this._getNodeGraphicData(node.compId,frame,this._nodeGDic[node.compId]);
			if (!node.child){
				this._updateNoChilds(tNodeG,g);
				return;
			};
			var tTransform=tNodeG.transform;
			tTransform._checkTransform();
			var onlyTranslate=false;
			onlyTranslate=!tTransform.bTransform;
			var hasTrans=false;
			hasTrans=onlyTranslate && (tTransform.tx !=0 || tTransform.ty !=0);
			var ifSave=false;
			ifSave=(tTransform.bTransform)|| tNodeG.alpha !=1;
			if (ifSave){
				g.save();
			}
			if (tNodeG.alpha !=1){
				g.alpha(tNodeG.alpha);
			}
			if (!onlyTranslate){
				g.transform(tTransform.clone());
				}else if (hasTrans){
				g.translate(tTransform.tx,tTransform.ty);
			};
			var childs;
			childs=node.child;
			var tTex;
			if (tNodeG.skin){
				tTex=this._getTextureByUrl(tNodeG.skin);
				if (tTex){
					g.drawTexture(tTex,0,0,tNodeG.width,tNodeG.height);
				}
			}
			if (childs){
				var i=0,len=0;
				len=childs.length;
				for (i=0;i < len;i++){
					this._updateNodeGraphic2(childs[i],frame,g);
				}
			}
			if (ifSave){
				g.restore();
				}else {
				if (!onlyTranslate){
					g.transform(tTransform.clone().invert());
					}else if (hasTrans){
					g.translate(-tTransform.tx,-tTransform.ty);
				}
			}
		}

		/**
		*@private
		*/
		__proto._calculateNodeKeyFrames=function(node){
			_super.prototype._calculateNodeKeyFrames.call(this,node);
			this._nodeIDAniDic[node.target]=node;
		}

		/**
		*@private
		*/
		__proto.getNodeDataByID=function(nodeID){
			return this._nodeIDAniDic[nodeID];
		}

		/**
		*@private
		*/
		__proto._getParams=function(obj,params,frame,obj2){
			var rst=GraphicAnimation._temParam;
			rst.length=params.length;
			var i=0,len=params.length;
			for (i=0;i < len;i++){
				rst[i]=this._getObjVar(obj,params[i][0],frame,params[i][1],obj2);
			}
			return rst;
		}

		/**
		*@private
		*/
		__proto._getObjVar=function(obj,key,frame,noValue,obj2){
			if (obj.hasOwnProperty(key)){
				var vArr=obj[key];
				if (frame >=vArr.length)
					frame=vArr.length-1;
				return obj[key][frame];
			}
			if (obj2.hasOwnProperty(key)){
				return obj2[key];
			}
			return noValue;
		}

		__proto._getNodeGraphicData=function(nodeID,frame,rst){
			if (!rst)
				rst=new GraphicNode();
			if (!rst.transform){
				rst.transform=new Matrix();
				}else {
				rst.transform.identity();
			};
			var node=this.getNodeDataByID(nodeID);
			if (!node)
				return rst;
			var frameData=node.frames;
			var params=this._getParams(frameData,GraphicAnimation._drawTextureCmd,frame,this._nodeDefaultProps[nodeID]);
			var url=params[0];
			var width=NaN,height=NaN;
			var px=params[5],py=params[6];
			var aX=params[13],aY=params[14];
			var sx=params[7],sy=params[8];
			var rotate=params[9];
			var skewX=params[11],skewY=params[12]
			width=params[3];
			height=params[4];
			var tex;
			rst.skin=url;
			rst.width=width;
			rst.height=height;
			if (url){
				tex=this._getTextureByUrl(url);
				if (tex){
					if (!width)
						width=tex.sourceWidth;
					if (!height)
						height=tex.sourceHeight;
					}else {
					console.warn("lost skin:",url,",you may load pics first");
				}
			}
			rst.alpha=params[10];
			var m;
			m=rst.transform;
			if (aX !=0){
				px=aX *width;
			}
			if (aY !=0){
				py=aY *height;
			}
			if (px !=0 || py !=0){
				m.translate(-px,-py);
			};
			var tm=null;
			if (rotate || sx!==1 || sy!==1 || skewX || skewY){
				tm=GraphicAnimation._tempMt;
				tm.identity();
				tm.bTransform=true;
				var skx=(rotate-skewX)*0.0174532922222222;
				var sky=(rotate+skewY)*0.0174532922222222;
				var cx=Math.cos(sky);
				var ssx=Math.sin(sky);
				var cy=Math.sin(skx);
				var ssy=Math.cos(skx);
				tm.a=sx *cx;
				tm.b=sx *ssx;
				tm.c=-sy *cy;
				tm.d=sy *ssy;
				tm.tx=tm.ty=0;
			}
			if (tm){
				m=Matrix.mul(m,tm,m);
			}
			m.translate(params[1],params[2]);
			return rst;
		}

		/**
		*@private
		*/
		__proto._getTextureByUrl=function(url){
			return Loader.getRes(url);
		}

		/**
		*@private
		*/
		__proto.setAniData=function(uiView,aniName){
			if (uiView.animations){
				this._nodeDefaultProps={};
				this._nodeGDic={};
				if (this._nodeList)
					this._nodeList.length=0;
				this._rootNode=uiView;
				this._parseNodeList(uiView);
				var aniDic={};
				var anilist=[];
				var animations=uiView.animations;
				var i=0,len=animations.length;
				var tAniO;
				for (i=0;i < len;i++){
					tAniO=animations[i];
					this._labels=null;
					if (aniName && aniName !=tAniO.name){
						continue ;
					}
					if (!tAniO)
						continue ;
					try {
						this._calGraphicData(tAniO);
						}catch (e){
						console.warn("parse animation fail:"+tAniO.name+",empty animation created");
						this._gList=[];
					};
					var frameO={};
					frameO.interval=1000 / tAniO["frameRate"];
					frameO.frames=this._gList;
					frameO.labels=this._labels;
					frameO.name=tAniO.name;
					anilist.push(frameO);
					aniDic[tAniO.name]=frameO;
				}
				this.animationList=anilist;
				this.animationDic=aniDic;
			}
			GraphicAnimation._temParam.length=0;
		}

		__proto.parseByData=function(aniData){
			var rootNode,aniO;
			rootNode=aniData.nodeRoot;
			aniO=aniData.aniO;
			delete aniData.nodeRoot;
			delete aniData.aniO;
			this._nodeDefaultProps={};
			this._nodeGDic={};
			if (this._nodeList)
				this._nodeList.length=0;
			this._rootNode=rootNode;
			this._parseNodeList(rootNode);
			this._labels=null;
			try {
				this._calGraphicData(aniO);
				}catch (e){
				console.warn("parse animation fail:"+aniO.name+",empty animation created");
				this._gList=[];
			};
			var frameO=aniData;
			frameO.interval=1000 / aniO["frameRate"];
			frameO.frames=this._gList;
			frameO.labels=this._labels;
			frameO.name=aniO.name;
			return frameO;
		}

		/**
		*@private
		*/
		__proto.setUpAniData=function(uiView){
			if (uiView.animations){
				var aniDic={};
				var anilist=[];
				var animations=uiView.animations;
				var i=0,len=animations.length;
				var tAniO;
				for (i=0;i < len;i++){
					tAniO=animations[i];
					if (!tAniO)
						continue ;
					var frameO={};
					frameO.name=tAniO.name;
					frameO.aniO=tAniO;
					frameO.nodeRoot=uiView;
					anilist.push(frameO);
					aniDic[tAniO.name]=frameO;
				}
				this.animationList=anilist;
				this.animationDic=aniDic;
			}
		}

		/**
		*@private
		*/
		__proto._clear=function(){
			this.animationList=null;
			this.animationDic=null;
			this._gList=null;
			this._nodeGDic=null;
		}

		GraphicAnimation.parseAnimationByData=function(animationObject){
			if (!GraphicAnimation._I)
				GraphicAnimation._I=new GraphicAnimation();
			var rst;
			rst=GraphicAnimation._I.parseByData(animationObject);
			GraphicAnimation._I._clear();
			return rst;
		}

		GraphicAnimation.parseAnimationData=function(aniData){
			if (!GraphicAnimation._I)
				GraphicAnimation._I=new GraphicAnimation();
			GraphicAnimation._I.setUpAniData(aniData);
			var rst;
			rst={};
			rst.animationList=GraphicAnimation._I.animationList;
			rst.animationDic=GraphicAnimation._I.animationDic;
			GraphicAnimation._I._clear();
			return rst;
		}

		GraphicAnimation._temParam=[];
		GraphicAnimation._I=null
		GraphicAnimation._rootMatrix=null
		__static(GraphicAnimation,
		['_drawTextureCmd',function(){return this._drawTextureCmd=[["skin",null],["x",0],["y",0],["width",0],["height",0],["pivotX",0],["pivotY",0],["scaleX",1],["scaleY",1],["rotation",0],["alpha",1],["skewX",0],["skewY",0],["anchorX",0],["anchorY",0]];},'_tempMt',function(){return this._tempMt=new Matrix();}
		]);
		GraphicAnimation.__init$=function(){
			//class GraphicNode
			GraphicNode=(function(){
				function GraphicNode(){
					this.skin=null;
					this.transform=null;
					this.resultTransform=null;
					this.width=NaN;
					this.height=NaN;
					this.alpha=1;
				}
				__class(GraphicNode,'');
				return GraphicNode;
			})()
		}

		return GraphicAnimation;
	})(FrameAnimation)


	//class ui.circle.CircleUI extends laya.ui.View
	var CircleUI=(function(_super){
		function CircleUI(){
			this.m_list=null;
			CircleUI.__super.call(this);
		}

		__class(CircleUI,'ui.circle.CircleUI',_super);
		var __proto=CircleUI.prototype;
		__proto.createChildren=function(){
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(CircleUI.uiView);
		}

		CircleUI.uiView={"type":"View","props":{"width":375,"height":667},"child":[{"type":"Image","props":{"y":0,"x":1,"width":377,"skin":"comp/bg.png","sizeGrid":"28,5,5,4","height":666}},{"type":"Image","props":{"y":0,"x":-4,"width":385,"skin":"schedule/dizuo.png","sizeGrid":"10,13,15,16","height":134}},{"type":"TextInput","props":{"y":4,"x":129,"width":124,"text":"圈子","height":32,"fontSize":25,"font":"Microsoft YaHei","bold":true,"align":"center"}},{"type":"TextInput","props":{"y":9,"x":324,"width":45,"text":"发布","height":22,"fontSize":18,"font":"Microsoft YaHei","color":"#3d599f","bold":true,"align":"center"}},{"type":"TextInput","props":{"y":51,"x":26,"width":128,"text":"结伴","height":31,"fontSize":20,"font":"Microsoft YaHei","align":"center"}},{"type":"TextInput","props":{"y":51,"x":210,"width":128,"text":"记录","height":31,"fontSize":20,"font":"Microsoft YaHei","align":"center"}},{"type":"TextInput","props":{"y":95,"x":17,"width":68,"text":"出发时间","promptColor":"#36569a","height":22,"fontSize":15,"font":"Microsoft YaHei","color":"#3a9da6"}},{"type":"List","props":{"y":134,"x":5,"width":366,"var":"m_list","vScrollBarSkin":"comp/vscroll.png","repeatY":7,"repeatX":1,"height":529},"child":[{"type":"Box","props":{"y":0,"x":0,"width":364,"name":"render","height":215,"alpha":1},"child":[{"type":"TextInput","props":{"x":73,"text":"幸福人生","fontSize":18,"font":"Microsoft YaHei"}},{"type":"TextInput","props":{"y":28,"x":79,"width":69,"text":"2017.1.14","height":22,"color":"#605d5d"}},{"type":"TextInput","props":{"y":27,"x":164,"width":55,"text":"深圳出发","height":22,"color":"#4ba473","bgColor":"#c7d4c2","alpha":0.7,"align":"center"}},{"type":"Image","props":{"y":7,"x":16,"width":56,"skin":"schedule/car.png","height":56}},{"type":"TextInput","props":{"y":-1,"x":271,"width":58,"text":"1小时前","height":22,"color":"#716262"}},{"type":"TextInput","props":{"y":69,"x":15,"width":351,"text":"6月7号深圳出发上海有结伴一起出发的","height":22,"fontSize":18,"font":"Microsoft YaHei"}},{"type":"Image","props":{"y":180,"x":27,"width":20,"skin":"circle/biaozhu.png","height":22}},{"type":"TextInput","props":{"y":179,"x":51,"width":66,"text":"深圳","height":22}},{"type":"Image","props":{"y":102,"x":19,"width":105,"skin":"comp/image.png","height":66}},{"type":"TextInput","props":{"y":179,"x":106,"width":36,"text":"删除","height":22,"color":"#4a7f74"}},{"type":"Label","props":{"y":186,"x":288,"text":"1","name":"thumbs_up"}},{"type":"Label","props":{"y":186,"x":333,"text":"1"}},{"type":"Image","props":{"y":180,"x":261,"width":20,"skin":"circle/zanl_icon.png","height":20}},{"type":"Image","props":{"y":180,"x":303,"width":20,"skin":"circle/talk.png","height":20}}]}]}]};
		return CircleUI;
	})(View)


	//class ui.schedule.ScheduleUI extends laya.ui.View
	var ScheduleUI=(function(_super){
		function ScheduleUI(){
			this.search=null;
			this.searchInput=null;
			this.searchCombox=null;
			this.car=null;
			this.overview=null;
			this.start=null;
			this.end=null;
			this.man=null;
			ScheduleUI.__super.call(this);
		}

		__class(ScheduleUI,'ui.schedule.ScheduleUI',_super);
		var __proto=ScheduleUI.prototype;
		__proto.createChildren=function(){
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ScheduleUI.uiView);
		}

		ScheduleUI.uiView={"type":"View","props":{"width":750,"height":1334},"child":[{"type":"Box","props":{"y":61,"x":24,"var":"search"},"child":[{"type":"Image","props":{"width":702,"skin":"schedule/dizuo.png","sizeGrid":"13,19,22,21","height":96}},{"type":"TextInput","props":{"y":7,"x":195,"width":460,"var":"searchInput","text":"搜索景点","height":76,"fontSize":33,"color":"#a19999"}},{"type":"Image","props":{"y":28,"x":644,"skin":"schedule/ser.png"}},{"type":"ComboBox","props":{"y":4,"x":29,"width":120,"var":"searchCombox","skin":"comp/combobox.png","sizeGrid":"-1,0,0,-4","selectedIndex":0,"labels":"宝安区,福田区","labelSize":34,"labelColors":"0x00","height":76}}]},{"type":"Image","props":{"y":1050,"x":584,"var":"car","skin":"schedule/car.png"}},{"type":"Box","props":{"y":300,"x":640,"var":"overview"},"child":[{"type":"Image","props":{"width":79,"skin":"schedule/dizuo.png","sizeGrid":"11,23,18,21","height":120}},{"type":"TextInput","props":{"y":41,"x":16,"wordWrap":true,"width":52,"text":"赛程总览","skin":"comp/textinput.png","height":60,"fontSize":20,"color":"#060404","bold":true}}]},{"type":"Image","props":{"y":598,"x":476,"var":"start","skin":"schedule/start.png"}},{"type":"Image","props":{"y":256,"x":228,"var":"end","skin":"schedule/end.png"}},{"type":"Image","props":{"y":306,"x":480,"var":"man","skin":"schedule/xingzou.png"}}]};
		return ScheduleUI;
	})(View)


	//class ui.test.TestPageUI extends laya.ui.View
	var TestPageUI=(function(_super){
		function TestPageUI(){
			this.btn=null;
			this.clip=null;
			this.combobox=null;
			this.tab=null;
			this.list=null;
			this.btn2=null;
			this.check=null;
			this.radio=null;
			this.box=null;
			TestPageUI.__super.call(this);
		}

		__class(TestPageUI,'ui.test.TestPageUI',_super);
		var __proto=TestPageUI.prototype;
		__proto.createChildren=function(){
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(TestPageUI.uiView);
		}

		TestPageUI.uiView={"type":"View","child":[{"props":{"x":0,"y":0,"skin":"comp/bg.png","sizeGrid":"30,4,4,4","width":600,"height":400},"type":"Image"},{"props":{"x":41,"y":56,"skin":"comp/button.png","label":"点我赋值","width":150,"height":37,"sizeGrid":"4,4,4,4","var":"btn"},"type":"Button"},{"props":{"x":401,"y":56,"skin":"comp/clip_num.png","clipX":10,"var":"clip"},"type":"Clip"},{"props":{"x":220,"y":143,"skin":"comp/combobox.png","labels":"select1,select2,selecte3","selectedIndex":1,"sizeGrid":"4,20,4,4","width":200,"height":23,"var":"combobox"},"type":"ComboBox"},{"props":{"x":220,"y":96,"skin":"comp/tab.png","labels":"tab1,tab2,tab3","var":"tab"},"type":"Tab"},{"props":{"x":259,"y":223,"skin":"comp/vscroll.png","height":150},"type":"VScrollBar"},{"props":{"x":224,"y":223,"skin":"comp/vslider.png","height":150},"type":"VSlider"},{"type":"List","child":[{"type":"Box","child":[{"props":{"skin":"comp/label.png","text":"this is a list","x":26,"y":5,"width":78,"height":20,"fontSize":14,"name":"label"},"type":"Label"},{"props":{"x":0,"y":2,"skin":"comp/clip_num.png","clipX":10,"name":"clip"},"type":"Clip"}],"props":{"name":"render","x":0,"y":0,"width":112,"height":30}}],"props":{"x":452,"y":68,"width":128,"height":299,"vScrollBarSkin":"comp/vscroll.png","repeatX":1,"var":"list"}},{"props":{"x":563,"y":4,"skin":"comp/btn_close.png","name":"close"},"type":"Button"},{"props":{"x":41,"y":112,"skin":"comp/button.png","label":"点我赋值","width":150,"height":66,"sizeGrid":"4,4,4,4","labelSize":30,"labelBold":true,"var":"btn2"},"type":"Button"},{"props":{"x":220,"y":188,"skin":"comp/checkbox.png","label":"checkBox1","var":"check"},"type":"CheckBox"},{"props":{"x":220,"y":61,"skin":"comp/radiogroup.png","labels":"radio1,radio2,radio3","var":"radio"},"type":"RadioGroup"},{"type":"Panel","child":[{"props":{"skin":"comp/image.png"},"type":"Image"}],"props":{"x":299,"y":223,"width":127,"height":150,"vScrollBarSkin":"comp/vscroll.png"}},{"props":{"x":326,"y":188,"skin":"comp/checkbox.png","label":"checkBox2","labelColors":"#ff0000"},"type":"CheckBox"},{"type":"Box","child":[{"props":{"y":70,"skin":"comp/progress.png","width":150,"height":14,"sizeGrid":"4,4,4,4","name":"progress"},"type":"ProgressBar"},{"props":{"y":103,"skin":"comp/label.png","text":"This is a Label","width":137,"height":26,"fontSize":20,"name":"label"},"type":"Label"},{"props":{"y":148,"skin":"comp/textinput.png","text":"textinput","width":150,"name":"input"},"type":"TextInput"},{"props":{"skin":"comp/hslider.png","width":150,"name":"slider"},"type":"HSlider"},{"props":{"y":34,"skin":"comp/hscroll.png","width":150,"name":"scroll"},"type":"HScrollBar"}],"props":{"x":41,"y":197,"var":"box"}}],"props":{"width":600,"height":400}};
		return TestPageUI;
	})(View)


	//class laya.debug.ui.debugui.comps.ListItemUI extends laya.ui.View
	var ListItemUI=(function(_super){
		function ListItemUI(){
			ListItemUI.__super.call(this);
		}

		__class(ListItemUI,'laya.debug.ui.debugui.comps.ListItemUI',_super);
		var __proto=ListItemUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ListItemUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(ListItemUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"base64pic":true,"width":244,"height":19},"child":[{"type":"Clip","props":{"y":-1,"skin":"comp/clip_selectBox.png","clipY":2,"height":19,"name":"selectBox","left":2,"right":2,"x":0}},{"type":"Label","props":{"x":25,"text":"render","color":"#dcea36","width":77,"height":17,"name":"label","y":2,"fontSize":12}},{"type":"Clip","props":{"skin":"comp/clip_tree_arrow.png","clipY":2,"name":"arrow","x":8,"y":4,"mouseEnabled":false}}]};}
		]);
		return ListItemUI;
	})(View)


	//class laya.debug.ui.debugui.comps.RankListItemUI extends laya.ui.View
	var RankListItemUI=(function(_super){
		function RankListItemUI(){
			RankListItemUI.__super.call(this);
		}

		__class(RankListItemUI,'laya.debug.ui.debugui.comps.RankListItemUI',_super);
		var __proto=RankListItemUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RankListItemUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(RankListItemUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"y":-1,"skin":"comp/clip_selectBox.png","clipY":2,"height":19,"name":"selectBox","left":0,"right":0,"x":0},"type":"Clip"},{"props":{"text":"render","color":"#a0a0a0","height":15,"name":"label","y":2,"left":11,"right":5,"fontSize":12,"x":11,"width":163},"type":"Label"}],"props":{"width":179,"height":19}};}
		]);
		return RankListItemUI;
	})(View)


	//class laya.debug.ui.debugui.DebugPanelUI extends laya.ui.View
	var DebugPanelUI=(function(_super){
		function DebugPanelUI(){
			this.bg=null;
			this.minBtn=null;
			this.treePanel=null;
			this.selectWhenClick=null;
			this.profilePanel=null;
			this.resizeBtn=null;
			this.mouseAnalyseBtn=null;
			this.dragIcon=null;
			this.clearBtn=null;
			this.selectPanel=null;
			this.tab=null;
			DebugPanelUI.__super.call(this);
		}

		__class(DebugPanelUI,'laya.debug.ui.debugui.DebugPanelUI',_super);
		var __proto=DebugPanelUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(DebugPanelUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.view.nodeInfo.nodetree.MinBtnComp",MinBtnComp);
			View.regComponent("laya.debug.view.nodeInfo.views.NodeTreeView",NodeTreeView);
			View.regComponent("laya.debug.view.nodeInfo.nodetree.Profile",Profile);
			View.regComponent("laya.debug.view.nodeInfo.views.SelectInfosView",SelectInfosView);
		}

		__static(DebugPanelUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"base64pic":true,"width":260,"height":400},"child":[{"type":"Image","props":{"x":205,"y":254,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"}},{"type":"Image","props":{"y":0,"skin":"view/bg_top.png","left":0,"right":0}},{"type":"MinBtnComp","props":{"y":-3,"var":"minBtn","runtime":"laya.debug.view.nodeInfo.nodetree.MinBtnComp","right":-3,"x":207}},{"type":"NodeTree","props":{"left":0,"right":0,"top":32,"bottom":0,"name":"节点树","var":"treePanel","runtime":"laya.debug.view.nodeInfo.views.NodeTreeView"}},{"type":"CheckBox","props":{"x":8,"y":9,"skin":"view/clickselect.png","toolTip":"点击选取","var":"selectWhenClick","mouseEnabled":true,"width":14,"height":14}},{"type":"Profile","props":{"name":"性能","top":32,"right":0,"left":0,"bottom":0,"var":"profilePanel","runtime":"laya.debug.view.nodeInfo.nodetree.Profile"}},{"type":"Button","props":{"x":169,"y":247,"skin":"view/resize.png","right":2,"bottom":2,"name":"resizeBtn","var":"resizeBtn","stateNum":3}},{"type":"Clip","props":{"y":9,"skin":"view/clickanalyse.png","var":"mouseAnalyseBtn","toolTip":"拖动选取","left":33,"x":33,"clipY":3}},{"type":"Clip","props":{"y":0,"skin":"view/clickanalyse.png","var":"dragIcon","x":33,"clipY":3}},{"type":"Button","props":{"y":7,"skin":"view/res.png","stateNum":2,"toolTip":"清除边框","var":"clearBtn","right":34,"x":184}},{"type":"SelectInfos","props":{"top":32,"left":0,"right":0,"bottom":0,"name":"选中","var":"selectPanel","runtime":"laya.debug.view.nodeInfo.views.SelectInfosView"}},{"type":"Tab","props":{"x":59,"y":0,"name":"tab","var":"tab","selectedIndex":0},"child":[{"type":"Button","props":{"skin":"view/tab_panel.png","label":"节点","width":42,"height":32,"name":"item0","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":42,"skin":"view/tab_panel.png","label":"查询","width":42,"height":32,"name":"item1","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":84,"skin":"view/tab_panel.png","label":"性能","width":42,"height":32,"name":"item2","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}}]}]};}
		]);
		return DebugPanelUI;
	})(View)


	//class laya.debug.ui.debugui.FindNodeSmallUI extends laya.ui.View
	var FindNodeSmallUI=(function(_super){
		function FindNodeSmallUI(){
			this.bg=null;
			this.closeBtn=null;
			this.title=null;
			this.typeSelect=null;
			this.findTxt=null;
			this.findBtn=null;
			FindNodeSmallUI.__super.call(this);
		}

		__class(FindNodeSmallUI,'laya.debug.ui.debugui.FindNodeSmallUI',_super);
		var __proto=FindNodeSmallUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(FindNodeSmallUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(FindNodeSmallUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":185,"y":234,"skin":"view/bg_tool.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg"},"type":"Image"},{"props":{"x":185,"y":15,"skin":"view/btn_close.png","var":"closeBtn","top":2,"right":2},"type":"Button"},{"props":{"x":6,"y":4,"text":"查找对象","width":67,"height":20,"color":"#288edf","var":"title"},"type":"Label"},{"props":{"x":60,"y":81,"skin":"comp/combobox.png","labels":"name,class","width":63,"height":21,"var":"typeSelect","sizeGrid":"5,35,5,5","labelColors":"#a0a0a0,#fffff,#ffffff#fffff"},"type":"ComboBox"},{"props":{"x":27,"y":83,"text":"类型","width":27,"height":20,"color":"#288edf","align":"right"},"type":"Label"},{"props":{"x":7,"y":40,"text":"包含内容","width":47,"height":20,"color":"#288edf","align":"right"},"type":"Label"},{"props":{"x":60,"y":37,"skin":"comp/textinput.png","text":"Sprite","width":164,"height":22,"var":"findTxt","sizeGrid":"5,5,5,5","color":"#a0a0a0"},"type":"TextInput"},{"props":{"x":158,"y":79,"skin":"comp/button.png","label":"查找","width":65,"height":23,"var":"findBtn","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"},"type":"Button"}],"props":{"base64pic":true,"width":233,"height":120}};}
		]);
		return FindNodeSmallUI;
	})(View)


	//class laya.debug.ui.debugui.FindNodeUI extends laya.ui.View
	var FindNodeUI=(function(_super){
		function FindNodeUI(){
			this.bg=null;
			this.closeBtn=null;
			this.title=null;
			this.typeSelect=null;
			this.findTxt=null;
			this.result=null;
			this.findBtn=null;
			FindNodeUI.__super.call(this);
		}

		__class(FindNodeUI,'laya.debug.ui.debugui.FindNodeUI',_super);
		var __proto=FindNodeUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(FindNodeUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.uicomps.RankListItem",RankListItem);
		}

		__static(FindNodeUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":185,"y":234,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"x":185,"y":15,"skin":"view/btn_close.png","var":"closeBtn","top":2,"right":2},"type":"Button"},{"props":{"x":6,"y":4,"text":"查找对象","width":67,"height":20,"color":"#88ef19","var":"title"},"type":"Label"},{"props":{"x":52,"y":75,"skin":"comp/combobox.png","labels":"name,class","width":63,"height":21,"var":"typeSelect","sizeGrid":"5,35,5,5","labelColors":"#a0a0a0,#fffff,#ffffff#fffff"},"type":"ComboBox"},{"props":{"x":10,"y":77,"text":"类型","width":27,"height":20,"color":"#88ef19","align":"right"},"type":"Label"},{"props":{"x":7,"y":34,"text":"包含内容","width":47,"height":20,"color":"#88ef19","align":"right"},"type":"Label"},{"props":{"x":59,"y":31,"skin":"comp/textinput.png","text":"Sprite","width":131,"height":22,"var":"findTxt","sizeGrid":"5,5,5,5","color":"#a0a0a0"},"type":"TextInput"},{"type":"List","child":[{"type":"RankListItem","props":{"y":30,"left":5,"right":5,"name":"render","x":30,"runtime":"laya.debug.uicomps.RankListItem"}}],"props":{"x":6,"y":106,"width":188,"height":180,"vScrollBarSkin":"comp/vscroll.png","var":"result"}},{"props":{"x":125,"y":73,"skin":"comp/button.png","label":"查找","width":65,"height":23,"var":"findBtn","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"},"type":"Button"}],"props":{"width":200,"height":300,"base64pic":true}};}
		]);
		return FindNodeUI;
	})(View)


	//class laya.debug.ui.debugui.MinBtnCompUI extends laya.ui.View
	var MinBtnCompUI=(function(_super){
		function MinBtnCompUI(){
			this.minBtn=null;
			this.maxUI=null;
			this.bg=null;
			this.maxBtn=null;
			MinBtnCompUI.__super.call(this);
		}

		__class(MinBtnCompUI,'laya.debug.ui.debugui.MinBtnCompUI',_super);
		var __proto=MinBtnCompUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MinBtnCompUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(MinBtnCompUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":7,"y":8,"skin":"comp/minBtn.png","stateNum":"3","var":"minBtn","width":22,"height":20,"toolTip":"最小化"},"type":"Button"},{"type":"Box","child":[{"props":{"x":0,"y":0,"skin":"view/bg_panel.png","var":"bg","width":36,"height":36,"sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"x":6,"y":8,"skin":"view/zoom_out.png","stateNum":"2","var":"maxBtn"},"type":"Button"}],"props":{"var":"maxUI"}}],"props":{"width":36,"height":36,"base64pic":true}};}
		]);
		return MinBtnCompUI;
	})(View)


	//class laya.debug.ui.debugui.NodeListPanelUI extends laya.ui.View
	var NodeListPanelUI=(function(_super){
		function NodeListPanelUI(){
			this.bg=null;
			this.closeBtn=null;
			this.title=null;
			this.itemList=null;
			NodeListPanelUI.__super.call(this);
		}

		__class(NodeListPanelUI,'laya.debug.ui.debugui.NodeListPanelUI',_super);
		var __proto=NodeListPanelUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(NodeListPanelUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.uicomps.RankListItem",RankListItem);
		}

		__static(NodeListPanelUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":235,"y":284,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"x":204,"y":32,"skin":"view/btn_close.png","var":"closeBtn","top":2,"right":2,"visible":true},"type":"Button"},{"props":{"x":10,"y":6,"text":"节点信息","width":147,"height":16,"color":"#288edf","var":"title"},"type":"Label"},{"type":"List","child":[{"type":"RankListItem","props":{"left":5,"right":5,"name":"render","runtime":"laya.debug.uicomps.RankListItem"}}],"props":{"vScrollBarSkin":"comp/vscroll.png","var":"itemList","left":2,"right":2,"top":26,"bottom":0,"repeatX":1,"x":20}}],"props":{"width":200,"height":300}};}
		]);
		return NodeListPanelUI;
	})(View)


	//class laya.debug.ui.debugui.NodeToolUI extends laya.ui.View
	var NodeToolUI=(function(_super){
		function NodeToolUI(){
			this.bg=null;
			this.closeBtn=null;
			this.tarTxt=null;
			this.freshBtn=null;
			this.mouseAnalyseBtn=null;
			this.dragIcon=null;
			NodeToolUI.__super.call(this);
		}

		__class(NodeToolUI,'laya.debug.ui.debugui.NodeToolUI',_super);
		var __proto=NodeToolUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(NodeToolUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(NodeToolUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"base64pic":true,"width":200,"height":341},"child":[{"type":"Image","props":{"x":195,"y":244,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"}},{"type":"Label","props":{"x":9,"y":5,"text":"当前选中对象","width":67,"height":16,"color":"#a0a0a0"}},{"type":"Button","props":{"x":195,"y":25,"skin":"view/btn_close.png","var":"closeBtn","top":2,"right":2}},{"type":"Label","props":{"x":10,"y":25,"text":"当前对象","width":67,"height":16,"color":"#a0a0a0","var":"tarTxt"}},{"type":"Button","props":{"x":15,"y":65,"skin":"comp/button.png","label":"父链","width":39,"height":23,"mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":66,"y":65,"skin":"comp/button.png","label":"子","width":35,"height":23,"mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":112,"y":65,"skin":"comp/button.png","label":"兄弟","width":49,"height":23,"mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":13,"y":117,"skin":"comp/button.png","label":"Enable链","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":100,"y":117,"skin":"comp/button.png","label":"Size链","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Label","props":{"x":14,"y":97,"text":"节点链信息","width":67,"height":16,"color":"#a0a0a0"}},{"type":"Label","props":{"x":15,"y":45,"text":"对象选取","width":67,"height":16,"color":"#a0a0a0"}},{"type":"Label","props":{"x":16,"y":145,"text":"节点显示","width":67,"height":16,"color":"#a0a0a0"}},{"type":"Button","props":{"x":13,"y":164,"skin":"comp/button.png","label":"隐藏旁支","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":100,"y":164,"skin":"comp/button.png","label":"隐藏兄弟","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":13,"y":197,"skin":"comp/button.png","label":"隐藏子","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":99,"y":197,"skin":"comp/button.png","label":"恢复","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Label","props":{"x":15,"y":228,"text":"其他","width":67,"height":16,"color":"#a0a0a0"}},{"type":"Button","props":{"x":12,"y":247,"skin":"comp/button.png","label":"节点树定位","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":99,"y":247,"skin":"comp/button.png","label":"显示边框","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Label","props":{"x":12,"y":315,"text":"Alt+A分析鼠标能否够点中对象","width":173,"height":16,"color":"#a0a0a0"}},{"type":"Button","props":{"x":156,"y":1,"skin":"view/refresh2.png","var":"freshBtn","left":156,"toolTip":"recache节点"}},{"type":"Button","props":{"x":12,"y":279,"skin":"comp/button.png","label":"输出到控制台","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Button","props":{"x":99,"y":279,"skin":"comp/button.png","label":"显示切换","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"}},{"type":"Clip","props":{"y":44,"skin":"view/clickanalyse.png","var":"mouseAnalyseBtn","toolTip":"拖动到对象上方判断是否能够点中","left":84,"x":84,"clipY":3}},{"type":"Clip","props":{"y":35,"skin":"view/clickanalyse.png","var":"dragIcon","x":94,"clipY":3}}]};}
		]);
		return NodeToolUI;
	})(View)


	//class laya.debug.ui.debugui.NodeTreeSettingUI extends laya.ui.View
	var NodeTreeSettingUI=(function(_super){
		function NodeTreeSettingUI(){
			this.bg=null;
			this.showTxt=null;
			this.okBtn=null;
			this.closeBtn=null;
			NodeTreeSettingUI.__super.call(this);
		}

		__class(NodeTreeSettingUI,'laya.debug.ui.debugui.NodeTreeSettingUI',_super);
		var __proto=NodeTreeSettingUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(NodeTreeSettingUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(NodeTreeSettingUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":0,"y":0,"skin":"view/bg_panel.png","left":0,"top":0,"bottom":0,"right":0,"var":"bg","width":200,"height":300,"sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"x":9,"y":7,"text":"要显示的属性","width":76,"height":16,"color":"#ffffff","align":"left"},"type":"Label"},{"props":{"x":6,"y":29,"skin":"comp/textinput.png","text":"x\\ny\\nwidth\\nheight","width":188,"height":230,"multiline":true,"var":"showTxt","color":"#a0a0a0","sizeGrid":"5,5,5,5"},"type":"TextInput"},{"props":{"x":57,"y":269,"skin":"comp/button.png","label":"确定","var":"okBtn","mouseEnabled":"true","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff"},"type":"Button"},{"props":{"x":175,"y":5,"skin":"view/btn_close.png","var":"closeBtn"},"type":"Button"}],"props":{"base64pic":true,"width":200,"height":300}};}
		]);
		return NodeTreeSettingUI;
	})(View)


	//class laya.debug.ui.debugui.NodeTreeUI extends laya.ui.View
	var NodeTreeUI=(function(_super){
		function NodeTreeUI(){
			this.nodeTree=null;
			this.controlBar=null;
			this.settingBtn=null;
			this.freshBtn=null;
			this.fliterTxt=null;
			this.closeBtn=null;
			this.ifShowProps=null;
			NodeTreeUI.__super.call(this);
		}

		__class(NodeTreeUI,'laya.debug.ui.debugui.NodeTreeUI',_super);
		var __proto=NodeTreeUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(NodeTreeUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.uicomps.TreeListItem",TreeListItem);
		}

		__static(NodeTreeUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":200,"height":260,"base64pic":true},"child":[{"type":"Image","props":{"x":-22,"y":-47,"skin":"view/bg_panel.png","width":211,"height":206,"left":0,"right":0,"top":0,"bottom":0,"sizeGrid":"5,5,5,5"}},{"props":{"y":0,"skin":"view/bg_tool.png","left":0,"right":0},"type":"Image"},{"type":"Tree","props":{"x":0,"scrollBarSkin":"comp/vscroll.png","width":195,"height":229,"var":"nodeTree","left":0,"right":0,"top":38,"bottom":20},"child":[{"type":"ListItem","props":{"y":0,"name":"render","left":0,"right":0,"runtime":"laya.debug.uicomps.TreeListItem"}}]},{"type":"Box","props":{"x":3,"y":5,"var":"controlBar","left":3,"right":3,"top":5,"height":23},"child":[{"type":"Button","props":{"x":6,"skin":"view/setting.png","stateNum":3,"var":"settingBtn","toolTip":"设置显示的属性","y":6}},{"type":"Button","props":{"y":6,"skin":"view/refresh.png","var":"freshBtn","left":30,"toolTip":"刷新数据"}},{"type":"TextInput","props":{"y":0,"skin":"view/bg_top.png","height":22,"var":"fliterTxt","left":53,"right":0,"color":"#a0a0a0"}},{"type":"Button","props":{"x":172,"y":2,"skin":"view/btn_close.png","var":"closeBtn","right":1,"visible":false}}]},{"props":{"y":243,"skin":"comp/checkbox.png","label":"显示属性","var":"ifShowProps","bottom":3,"selected":true,"visible":true,"x":2,"width":70,"height":14,"labelColors":"#a0a0a0,#fffff,#ffffff,#fffff"},"type":"CheckBox"}]};}
		]);
		return NodeTreeUI;
	})(View)


	//class laya.debug.ui.debugui.ObjectCreateUI extends laya.ui.View
	var ObjectCreateUI=(function(_super){
		function ObjectCreateUI(){
			this.bg=null;
			this.closeBtn=null;
			this.itemList=null;
			this.freshBtn=null;
			ObjectCreateUI.__super.call(this);
		}

		__class(ObjectCreateUI,'laya.debug.ui.debugui.ObjectCreateUI',_super);
		var __proto=ObjectCreateUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ObjectCreateUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.uicomps.RankListItem",RankListItem);
		}

		__static(ObjectCreateUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":215,"y":264,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"x":184,"y":12,"skin":"view/btn_close.png","var":"closeBtn","top":2,"right":2,"visible":false},"type":"Button"},{"props":{"x":11,"y":5,"text":"对象创建统计","width":83,"height":16,"color":"#288edf"},"type":"Label"},{"type":"List","child":[{"type":"RankListItem","props":{"y":0,"left":5,"right":5,"name":"render","runtime":"laya.debug.uicomps.RankListItem"}}],"props":{"vScrollBarSkin":"comp/vscroll.png","var":"itemList","top":26,"bottom":5,"left":5,"right":5,"repeatX":1}},{"props":{"y":1,"skin":"view/refresh2.png","var":"freshBtn","toolTip":"刷新数据","right":1,"x":178},"type":"Button"}],"props":{"width":200,"height":300,"base64pic":true}};}
		]);
		return ObjectCreateUI;
	})(View)


	//class laya.debug.ui.debugui.ObjectInfoUI extends laya.ui.View
	var ObjectInfoUI=(function(_super){
		function ObjectInfoUI(){
			this.bg=null;
			this.title=null;
			this.showTxt=null;
			this.closeBtn=null;
			this.autoUpdate=null;
			this.settingBtn=null;
			ObjectInfoUI.__super.call(this);
		}

		__class(ObjectInfoUI,'laya.debug.ui.debugui.ObjectInfoUI',_super);
		var __proto=ObjectInfoUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ObjectInfoUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(ObjectInfoUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":-1,"y":0,"skin":"view/bg_panel.png","left":-1,"right":1,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"x":7,"y":5,"text":"对象类型","width":67,"height":20,"color":"#ffffff","var":"title","left":7,"right":6},"type":"Label"},{"props":{"x":2,"skin":"comp/textinput.png","text":"属性内容","width":196,"height":228,"left":2,"right":2,"var":"showTxt","top":25,"bottom":20,"editable":false,"multiline":true,"sizeGrid":"5,5,5,5","color":"#a0a0a0"},"type":"TextArea"},{"props":{"x":178,"y":4,"skin":"view/btn_close.png","var":"closeBtn","top":4,"right":2},"type":"Button"},{"props":{"skin":"comp/checkbox.png","label":"自动刷新属性","var":"autoUpdate","bottom":2,"x":3,"labelColors":"#a0a0a0,#fffff,#ffffff,#fffff"},"type":"CheckBox"},{"props":{"x":164,"skin":"view/setting.png","stateNum":"3","var":"settingBtn","y":6,"top":6,"right":24,"toolTip":"设置显示属性"},"type":"Button"},{"props":{"x":179,"y":257,"skin":"view/resize.png","right":2,"bottom":2,"name":"resizeBtn","stateNum":3},"type":"Button"}],"props":{"base64pic":true,"width":200,"height":200}};}
		]);
		return ObjectInfoUI;
	})(View)


	//class laya.debug.ui.debugui.OutPutUI extends laya.ui.View
	var OutPutUI=(function(_super){
		function OutPutUI(){
			this.bg=null;
			this.txt=null;
			this.closeBtn=null;
			this.clearBtn=null;
			OutPutUI.__super.call(this);
		}

		__class(OutPutUI,'laya.debug.ui.debugui.OutPutUI',_super);
		var __proto=OutPutUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(OutPutUI.uiView);
		}

		__proto.viewMapRegists=function(){}
		__static(OutPutUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":300,"height":200,"base64pic":true},"child":[{"type":"Image","props":{"x":205,"y":254,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"}},{"type":"Label","props":{"skin":"comp/textarea.png","text":"TextArea","color":"#a0a0a0","var":"txt","left":5,"right":5,"top":22,"bottom":5,"mouseEnabled":true,"sizeGrid":"3,3,3,3"}},{"type":"Button","props":{"x":185,"y":15,"skin":"view/btn_close.png","var":"closeBtn","top":2,"right":2}},{"props":{"x":253,"y":1,"skin":"view/re.png","stateNum":"2","var":"clearBtn","right":25},"type":"Button"},{"props":{"x":169,"y":247,"skin":"view/resize.png","right":2,"bottom":2,"name":"resizeBtn","stateNum":3},"type":"Button"}]};}
		]);
		return OutPutUI;
	})(View)


	//class laya.debug.ui.debugui.ProfileUI extends laya.ui.View
	var ProfileUI=(function(_super){
		function ProfileUI(){
			this.renderPanel=null;
			this.createPanel=null;
			this.cachePanel=null;
			this.tab=null;
			this.resPanel=null;
			ProfileUI.__super.call(this);
		}

		__class(ProfileUI,'laya.debug.ui.debugui.ProfileUI',_super);
		var __proto=ProfileUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ProfileUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.view.nodeInfo.views.RenderCostRankView",RenderCostRankView);
			View.regComponent("laya.debug.view.nodeInfo.views.ObjectCreateView",ObjectCreateView);
			View.regComponent("laya.debug.view.nodeInfo.views.CacheRankView",CacheRankView);
			View.regComponent("laya.debug.view.nodeInfo.views.ResRankView",ResRankView);
		}

		__static(ProfileUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":260,"height":329,"base64pic":true},"child":[{"type":"Image","props":{"y":0,"skin":"view/bg_tool.png","right":0,"left":0}},{"type":"Rank","props":{"var":"renderPanel","top":29,"runtime":"laya.debug.view.nodeInfo.views.RenderCostRankView","right":0,"name":"渲染用时","left":0,"bottom":0}},{"type":"ObjectCreate","props":{"var":"createPanel","top":29,"runtime":"laya.debug.view.nodeInfo.views.ObjectCreateView","right":0,"name":"对象创建统计","left":0,"bottom":0}},{"type":"Rank","props":{"x":10,"var":"cachePanel","top":29,"runtime":"laya.debug.view.nodeInfo.views.CacheRankView","right":0,"name":"cache用时","left":0,"bottom":0}},{"type":"Tab","props":{"y":9,"x":7,"width":191,"var":"tab","selectedIndex":0,"height":19},"child":[{"type":"CheckBox","props":{"y":0,"x":0,"width":50,"skin":"view/create.png","name":"item0","labelColors":"#a0a0a0,#ffffff,#ffffff,#ffffff","label":"  对象","height":17}},{"type":"CheckBox","props":{"y":0,"x":55,"width":50,"skin":"view/rendertime.png","name":"item1","labelColors":"#a0a0a0,#ffffff,#ffffff,#ffffff","label":" 渲染","height":19}},{"type":"CheckBox","props":{"y":0,"x":110,"width":50,"skin":"view/cache.png","name":"item2","labelColors":"#a0a0a0,#ffffff,#ffffff,#ffffff","label":" 重绘","height":16}},{"type":"CheckBox","props":{"y":0,"x":165,"width":50,"skin":"view/cache.png","name":"item3","labelColors":"#a0a0a0,#ffffff,#ffffff,#ffffff","label":" 资源","height":16}}]},{"type":"Rank","props":{"y":40,"x":50,"var":"resPanel","top":29,"runtime":"laya.debug.view.nodeInfo.views.ResRankView","right":0,"name":"资源缓存","left":0,"bottom":0}}]};}
		]);
		return ProfileUI;
	})(View)


	//class laya.debug.ui.debugui.RankUI extends laya.ui.View
	var RankUI=(function(_super){
		function RankUI(){
			this.bg=null;
			this.closeBtn=null;
			this.title=null;
			this.itemList=null;
			this.autoUpdate=null;
			this.freshBtn=null;
			RankUI.__super.call(this);
		}

		__class(RankUI,'laya.debug.ui.debugui.RankUI',_super);
		var __proto=RankUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RankUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.uicomps.RankListItem",RankListItem);
		}

		__static(RankUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":225,"y":274,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"x":194,"y":22,"skin":"view/btn_close.png","var":"closeBtn","top":2,"right":2,"visible":false},"type":"Button"},{"props":{"x":8,"y":5,"text":"渲染用时表(3000ms)","width":109,"height":16,"color":"#288edf","var":"title"},"type":"Label"},{"type":"List","child":[{"type":"RankListItem","props":{"left":5,"right":5,"name":"render","runtime":"laya.debug.uicomps.RankListItem"}}],"props":{"vScrollBarSkin":"comp/vscroll.png","var":"itemList","left":2,"right":2,"top":26,"bottom":25,"repeatX":1,"x":10,"y":10}},{"props":{"skin":"comp/checkbox.png","label":"自动刷新属性","var":"autoUpdate","bottom":3,"selected":false,"visible":true,"left":2,"labelColors":"#a0a0a0,#fffff,#ffffff,#fffff"},"type":"CheckBox"},{"props":{"y":1,"skin":"view/refresh2.png","var":"freshBtn","toolTip":"刷新数据","right":1},"type":"Button"}],"props":{"width":200,"height":300}};}
		]);
		return RankUI;
	})(View)


	//class laya.debug.ui.debugui.SelectInfosUI extends laya.ui.View
	var SelectInfosUI=(function(_super){
		function SelectInfosUI(){
			this.bg=null;
			this.closeBtn=null;
			this.selectList=null;
			this.findBtn=null;
			this.fliterTxt=null;
			SelectInfosUI.__super.call(this);
		}

		__class(SelectInfosUI,'laya.debug.ui.debugui.SelectInfosUI',_super);
		var __proto=SelectInfosUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(SelectInfosUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.uicomps.RankListItem",RankListItem);
		}

		__static(SelectInfosUI,
		['uiView',function(){return this.uiView={"type":"View","child":[{"props":{"x":205,"y":254,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"},"type":"Image"},{"props":{"skin":"view/btn_close.png","var":"closeBtn","top":32,"visible":false,"right":2},"type":"Button"},{"props":{"x":7,"y":36,"text":"当前选中列表","width":83,"height":16,"color":"#288edf"},"type":"Label"},{"type":"List","child":[{"type":"RankListItem","props":{"left":5,"right":5,"name":"render","runtime":"laya.debug.uicomps.RankListItem"}}],"props":{"vScrollBarSkin":"comp/vscroll.png","var":"selectList","left":5,"right":5,"top":56,"bottom":25,"repeatX":1,"x":20}},{"props":{"x":6,"text":"Alt+V选取鼠标下的对象","width":189,"height":16,"color":"#a0a0a0","bottom":3},"type":"Label"},{"type":"Image","props":{"y":0,"skin":"view/bg_tool.png","left":0,"right":0}},{"type":"Clip","props":{"y":6,"skin":"view/search.png","clipY":2,"var":"findBtn","right":5,"toolTip":"查找","x":174}},{"type":"TextInput","props":{"y":6,"skin":"view/bg_top.png","height":22,"var":"fliterTxt","left":8,"right":45,"color":"#a0a0a0","x":8,"width":147}}],"props":{"width":200,"height":300,"base64pic":true}};}
		]);
		return SelectInfosUI;
	})(View)


	//class laya.debug.ui.debugui.ToolBarUI extends laya.ui.View
	var ToolBarUI=(function(_super){
		function ToolBarUI(){
			this.bg=null;
			this.treeBtn=null;
			this.findBtn=null;
			this.minBtn=null;
			this.selectWhenClick=null;
			this.clearBtn=null;
			this.rankBtn=null;
			this.nodeRankBtn=null;
			this.cacheBtn=null;
			ToolBarUI.__super.call(this);
		}

		__class(ToolBarUI,'laya.debug.ui.debugui.ToolBarUI',_super);
		var __proto=ToolBarUI.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(ToolBarUI.uiView);
		}

		__proto.viewMapRegists=function(){
			View.regComponent("laya.debug.view.nodeInfo.nodetree.MinBtnComp",MinBtnComp);
		}

		__static(ToolBarUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"base64pic":true,"width":250,"height":30},"child":[{"type":"Image","props":{"x":195,"y":244,"skin":"view/bg_panel.png","left":0,"right":0,"top":0,"bottom":0,"var":"bg","sizeGrid":"5,5,5,5"}},{"type":"Button","props":{"x":2,"y":6,"skin":"view/save.png","stateNum":2,"var":"treeBtn","toolTip":"节点树"}},{"type":"Button","props":{"x":25,"y":6,"skin":"view/save.png","stateNum":2,"var":"findBtn","toolTip":"查找面板"}},{"type":"MinBtnComp","props":{"x":218,"y":-3,"var":"minBtn","runtime":"laya.debug.view.nodeInfo.nodetree.MinBtnComp"}},{"type":"CheckBox","props":{"x":124,"y":8,"skin":"comp/checkbox.png","label":"点击选取","var":"selectWhenClick","labelColors":"#a0a0a0,#fffff,#ffffff,#fffff"}},{"type":"Button","props":{"x":193,"y":5,"skin":"view/res.png","stateNum":2,"toolTip":"清除边框","var":"clearBtn"}},{"type":"Button","props":{"x":49,"y":6,"skin":"view/save.png","stateNum":2,"var":"rankBtn","toolTip":"渲染用时排行"}},{"type":"Button","props":{"x":72,"y":6,"skin":"view/save.png","stateNum":2,"var":"nodeRankBtn","toolTip":"创建对象排行"}},{"type":"Button","props":{"x":94,"y":6,"skin":"view/save.png","stateNum":2,"var":"cacheBtn","toolTip":"cache对象"}}]};}
		]);
		return ToolBarUI;
	})(View)


	//class laya.ui.Dialog extends laya.ui.View
	var Dialog=(function(_super){
		function Dialog(){
			this.popupCenter=true;
			this.closeHandler=null;
			this.popupEffect=null;
			this.closeEffect=null;
			this.group=null;
			this.isModal=false;
			this._dragArea=null;
			Dialog.__super.call(this);
		}

		__class(Dialog,'laya.ui.Dialog',_super);
		var __proto=Dialog.prototype;
		/**@inheritDoc */
		__proto.initialize=function(){
			this.popupEffect=Dialog.manager.popupEffectHandler;
			this.closeEffect=Dialog.manager.closeEffectHandler;
			this._dealDragArea();
			this.on("click",this,this._onClick);
		}

		/**@private */
		__proto._dealDragArea=function(){
			var dragTarget=this.getChildByName("drag");
			if (dragTarget){
				this.dragArea=dragTarget.x+","+dragTarget.y+","+dragTarget.width+","+dragTarget.height;
				dragTarget.removeSelf();
			}
		}

		/**
		*@private (protected)
		*对象的 <code>Event.CLICK</code> 点击事件侦听处理函数。
		*/
		__proto._onClick=function(e){
			var btn=e.target;
			if (btn){
				switch (btn.name){
					case "close":
					case "cancel":
					case "sure":
					case "no":
					case "ok":
					case "yes":
						this.close(btn.name);
						break ;
					}
			}
		}

		/**
		*显示对话框（以非模式窗口方式显示）。
		*@param closeOther 是否关闭其它的对话框。若值为true则关闭其它对话框。
		*/
		__proto.show=function(closeOther){
			(closeOther===void 0)&& (closeOther=false);
			this._open(false,closeOther);
		}

		/**
		*显示对话框（以模式窗口方式显示）。
		*@param closeOther 是否关闭其它的对话框。若值为true则关闭其它对话框。
		*/
		__proto.popup=function(closeOther){
			(closeOther===void 0)&& (closeOther=false);
			this._open(true,closeOther);
		}

		/**@private */
		__proto._open=function(modal,closeOther){
			Dialog.manager.lock(false);
			this.isModal=modal;
			Dialog.manager.open(this,closeOther);
		}

		/**打开完成后，调用此方法（如果有弹出动画，则在动画完成后执行）*/
		__proto.onOpened=function(){}
		/**
		*关闭对话框。
		*@param type 如果是点击默认关闭按钮触发，则传入关闭按钮的名字(name)，否则为null。
		*/
		__proto.close=function(type){
			Dialog.manager.close(this,type);
		}

		/**关闭完成后，调用此方法（如果有关闭动画，则在动画完成后执行）
		*@param type 如果是点击默认关闭按钮触发，则传入关闭按钮的名字(name)，否则为null。
		*/
		__proto.onClosed=function(type){}
		/**@private */
		__proto._onMouseDown=function(e){
			var point=this.getMousePoint();
			if (this._dragArea.contains(point.x,point.y))this.startDrag();
			else this.stopDrag();
		}

		/**
		*用来指定对话框的拖拽区域。默认值为"0,0,0,0"。
		*<p><b>格式：</b>构成一个矩形所需的 x,y,width,heith 值，用逗号连接为字符串。
		*例如："0,0,100,200"。
		*</p>
		*
		*@see #includeExamplesSummary 请参考示例
		*/
		__getset(0,__proto,'dragArea',function(){
			if (this._dragArea)return this._dragArea.toString();
			return null;
			},function(value){
			if (value){
				var a=UIUtils.fillArray([0,0,0,0],value,Number);
				this._dragArea=new Rectangle(a[0],a[1],a[2],a[3]);
				this.on("mousedown",this,this._onMouseDown);
				}else {
				this._dragArea=null;
				this.off("mousedown",this,this._onMouseDown);
			}
		});

		/**
		*弹出框的显示状态；如果弹框处于显示中，则为true，否则为false;
		*/
		__getset(0,__proto,'isPopup',function(){
			return this.parent !=null;
		});

		__getset(0,__proto,'zOrder',_super.prototype._$get_zOrder,function(value){
			_super.prototype._$set_zOrder.call(this,value);
			Dialog.manager._checkMask();
		});

		/**对话框管理容器，所有的对话框都在该容器内，并且受管理器管，可以自定义自己的管理器，来更改窗口管理的流程。
		*任意对话框打开和关闭，都会触发管理类的open和close事件*/
		__getset(1,Dialog,'manager',function(){
			return Dialog._manager=Dialog._manager|| new DialogManager();
			},function(value){
			Dialog._manager=value;
		});

		Dialog.setLockView=function(view){
			Dialog.manager.setLockView(view);
		}

		Dialog.lock=function(value){
			Dialog.manager.lock(value);
		}

		Dialog.closeAll=function(){
			Dialog.manager.closeAll();
		}

		Dialog.getDialogsByGroup=function(group){
			return Dialog.manager.getDialogsByGroup(group);
		}

		Dialog.closeByGroup=function(group){
			return Dialog.manager.closeByGroup(group);
		}

		Dialog.CLOSE="close";
		Dialog.CANCEL="cancel";
		Dialog.SURE="sure";
		Dialog.NO="no";
		Dialog.OK="ok";
		Dialog.YES="yes";
		Dialog._manager=null
		return Dialog;
	})(View)


	//class laya.debug.uicomps.ListBase extends laya.ui.List
	var ListBase=(function(_super){
		function ListBase(){
			ListBase.__super.call(this);
		}

		__class(ListBase,'laya.debug.uicomps.ListBase',_super);
		var __proto=ListBase.prototype;
		__getset(0,__proto,'selectedIndex',_super.prototype._$get_selectedIndex,function(value){
			if (this._selectedIndex !=value){
				this._selectedIndex=value;
				this.changeSelectStatus();
				this.event("change");
				this.selectHandler && this.selectHandler.runWith(value);
			}
			if (this.selectEnable && this._scrollBar){
				var numX=this._isVertical ? this.repeatX :this.repeatY;
				if (value < this._startIndex || (value+numX > this._startIndex+this.repeatX *this.repeatY)){
					this.scrollTo(value);
				}
			}
		});

		return ListBase;
	})(List)


	//class laya.debug.uicomps.TreeBase extends laya.ui.Tree
	var TreeBase=(function(_super){
		function TreeBase(){
			TreeBase.__super.call(this);
		}

		__class(TreeBase,'laya.debug.uicomps.TreeBase',_super);
		var __proto=TreeBase.prototype;
		/**@inheritDoc */
		__proto.createChildren=function(){
			this.addChild(this._list=new ListBase());
			this._list.renderHandler=Handler.create(this,this.renderItem,null,false);
			this._list.repeatX=1;
			this._list.on("change",this,this.onListChange);
		}

		return TreeBase;
	})(Tree)


	//class laya.ui.HBox extends laya.ui.LayoutBox
	var HBox=(function(_super){
		function HBox(){HBox.__super.call(this);;
		};

		__class(HBox,'laya.ui.HBox',_super);
		var __proto=HBox.prototype;
		/**@inheritDoc */
		__proto.sortItem=function(items){
			if (items)items.sort(function(a,b){return a.x-b.x;});
		}

		/**@inheritDoc */
		__proto.changeItems=function(){
			this._itemChanged=false;
			var items=[];
			var maxHeight=0;
			for (var i=0,n=this.numChildren;i < n;i++){
				var item=this.getChildAt(i);
				if (item&&item.layoutEnabled){
					items.push(item);
					maxHeight=this._height?this._height:Math.max(maxHeight,item.height *item.scaleY);
				}
			}
			this.sortItem(items);
			var left=0;
			for (i=0,n=items.length;i < n;i++){
				item=items[i];
				item.x=left;
				left+=item.width *item.scaleX+this._space;
				if (this._align=="top"){
					item.y=0;
					}else if (this._align=="middle"){
					item.y=(maxHeight-item.height *item.scaleY)*0.5;
					}else if (this._align=="bottom"){
					item.y=maxHeight-item.height *item.scaleY;
				}
			}
			this.changeSize();
		}

		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			if (this._height !=value){
				_super.prototype._$set_height.call(this,value);
				this.callLater(this.changeItems);
			}
		});

		HBox.NONE="none";
		HBox.TOP="top";
		HBox.MIDDLE="middle";
		HBox.BOTTOM="bottom";
		return HBox;
	})(LayoutBox)


	//class laya.ui.VBox extends laya.ui.LayoutBox
	var VBox=(function(_super){
		function VBox(){VBox.__super.call(this);;
		};

		__class(VBox,'laya.ui.VBox',_super);
		var __proto=VBox.prototype;
		/**@inheritDoc */
		__proto.changeItems=function(){
			this._itemChanged=false;
			var items=[];
			var maxWidth=0;
			for (var i=0,n=this.numChildren;i < n;i++){
				var item=this.getChildAt(i);
				if (item&&item.layoutEnabled){
					items.push(item);
					maxWidth=this._width?this._width:Math.max(maxWidth,item.width *item.scaleX);
				}
			}
			this.sortItem(items);
			var top=0;
			for (i=0,n=items.length;i < n;i++){
				item=items[i];
				item.y=top;
				top+=item.height *item.scaleY+this._space;
				if (this._align=="left"){
					item.x=0;
					}else if (this._align=="center"){
					item.x=(maxWidth-item.width *item.scaleX)*0.5;
					}else if (this._align=="right"){
					item.x=maxWidth-item.width *item.scaleX;
				}
			}
			this.changeSize();
		}

		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			if (this._width !=value){
				_super.prototype._$set_width.call(this,value);
				this.callLater(this.changeItems);
			}
		});

		VBox.NONE="none";
		VBox.LEFT="left";
		VBox.CENTER="center";
		VBox.RIGHT="right";
		return VBox;
	})(LayoutBox)


	//class laya.ui.RadioGroup extends laya.ui.UIGroup
	var RadioGroup=(function(_super){
		function RadioGroup(){RadioGroup.__super.call(this);;
		};

		__class(RadioGroup,'laya.ui.RadioGroup',_super);
		var __proto=RadioGroup.prototype;
		/**@inheritDoc */
		__proto.createItem=function(skin,label){
			return new Radio(skin,label);
		}

		return RadioGroup;
	})(UIGroup)


	//class laya.ui.Tab extends laya.ui.UIGroup
	var Tab=(function(_super){
		function Tab(){Tab.__super.call(this);;
		};

		__class(Tab,'laya.ui.Tab',_super);
		var __proto=Tab.prototype;
		/**
		*@private
		*@inheritDoc
		*/
		__proto.createItem=function(skin,label){
			return new Button(skin,label);
		}

		return Tab;
	})(UIGroup)


	//class laya.ui.TextArea extends laya.ui.TextInput
	var TextArea=(function(_super){
		function TextArea(text){
			this._vScrollBar=null;
			this._hScrollBar=null;
			(text===void 0)&& (text="");
			TextArea.__super.call(this,text);
		}

		__class(TextArea,'laya.ui.TextArea',_super);
		var __proto=TextArea.prototype;
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._vScrollBar && this._vScrollBar.destroy();
			this._hScrollBar && this._hScrollBar.destroy();
			this._vScrollBar=null;
			this._hScrollBar=null;
		}

		__proto.initialize=function(){
			this.width=180;
			this.height=150;
			this._tf.wordWrap=true;
			this.multiline=true;
		}

		__proto.onVBarChanged=function(e){
			if (this._tf.scrollY !=this._vScrollBar.value){
				this._tf.scrollY=this._vScrollBar.value;
			}
		}

		__proto.onHBarChanged=function(e){
			if (this._tf.scrollX !=this._hScrollBar.value){
				this._tf.scrollX=this._hScrollBar.value;
			}
		}

		__proto.changeScroll=function(){
			var vShow=this._vScrollBar && this._tf.maxScrollY > 0;
			var hShow=this._hScrollBar && this._tf.maxScrollX > 0;
			var showWidth=vShow ? this._width-this._vScrollBar.width :this._width;
			var showHeight=hShow ? this._height-this._hScrollBar.height :this._height;
			var padding=this._tf.padding || Styles.labelPadding;
			this._tf.width=showWidth;
			this._tf.height=showHeight;
			if (this._vScrollBar){
				this._vScrollBar.x=this._width-this._vScrollBar.width-padding[2];
				this._vScrollBar.y=padding[1];
				this._vScrollBar.height=this._height-(hShow ? this._hScrollBar.height :0)-padding[1]-padding[3];
				this._vScrollBar.scrollSize=1;
				this._vScrollBar.thumbPercent=showHeight / Math.max(this._tf.textHeight,showHeight);
				this._vScrollBar.setScroll(1,this._tf.maxScrollY,this._tf.scrollY);
				this._vScrollBar.visible=vShow;
			}
			if (this._hScrollBar){
				this._hScrollBar.x=padding[0];
				this._hScrollBar.y=this._height-this._hScrollBar.height-padding[3];
				this._hScrollBar.width=this._width-(vShow ? this._vScrollBar.width :0)-padding[0]-padding[2];
				this._hScrollBar.scrollSize=Math.max(showWidth *0.033,1);
				this._hScrollBar.thumbPercent=showWidth / Math.max(this._tf.textWidth,showWidth);
				this._hScrollBar.setScroll(0,this.maxScrollX,this.scrollX);
				this._hScrollBar.visible=hShow;
			}
		}

		/**滚动到某个位置*/
		__proto.scrollTo=function(y){
			this.commitMeasure();
			this._tf.scrollY=y;
		}

		/**垂直滚动值*/
		__getset(0,__proto,'scrollY',function(){
			return this._tf.scrollY;
		});

		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			_super.prototype._$set_width.call(this,value);
			this.callLater(this.changeScroll);
		});

		/**水平滚动条实体*/
		__getset(0,__proto,'hScrollBar',function(){
			return this._hScrollBar;
		});

		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			_super.prototype._$set_height.call(this,value);
			this.callLater(this.changeScroll);
		});

		/**水平滚动最大值*/
		__getset(0,__proto,'maxScrollX',function(){
			return this._tf.maxScrollX;
		});

		/**垂直滚动条皮肤*/
		__getset(0,__proto,'vScrollBarSkin',function(){
			return this._vScrollBar ? this._vScrollBar.skin :null;
			},function(value){
			if (this._vScrollBar==null){
				this.addChild(this._vScrollBar=new VScrollBar());
				this._vScrollBar.on("change",this,this.onVBarChanged);
				this._vScrollBar.target=this._tf;
				this.callLater(this.changeScroll);
			}
			this._vScrollBar.skin=value;
		});

		/**水平滚动条皮肤*/
		__getset(0,__proto,'hScrollBarSkin',function(){
			return this._hScrollBar ? this._hScrollBar.skin :null;
			},function(value){
			if (this._hScrollBar==null){
				this.addChild(this._hScrollBar=new HScrollBar());
				this._hScrollBar.on("change",this,this.onHBarChanged);
				this._hScrollBar.mouseWheelEnable=false;
				this._hScrollBar.target=this._tf;
				this.callLater(this.changeScroll);
			}
			this._hScrollBar.skin=value;
		});

		/**垂直滚动条实体*/
		__getset(0,__proto,'vScrollBar',function(){
			return this._vScrollBar;
		});

		/**垂直滚动最大值*/
		__getset(0,__proto,'maxScrollY',function(){
			return this._tf.maxScrollY;
		});

		/**水平滚动值*/
		__getset(0,__proto,'scrollX',function(){
			return this._tf.scrollX;
		});

		return TextArea;
	})(TextInput)


	//class view.TestView extends ui.test.TestPageUI
	var TestView=(function(_super){
		function TestView(){
			TestView.__super.call(this);
			this.btn.on("click",this,this.onBtnClick);
			this.btn2.on("click",this,this.onBtn2Click);
		}

		__class(TestView,'view.TestView',_super);
		var __proto=TestView.prototype;
		__proto.onBtnClick=function(e){
			this.radio.selectedIndex=1;
			this.clip.index=8;
			this.tab.selectedIndex=2;
			this.combobox.selectedIndex=0;
			this.check.selected=true;
		}

		__proto.onBtn2Click=function(e){
			this.box.dataSource={slider:50,scroll:80,progress:0.2,input:"This is a input",label:{color:"#ff0000",text:"Hello LayaAir"}};
			var arr=[];
			for (var i=0;i < 100;i++){
				arr.push({label:"item "+i,clip:i % 9});
			}
			this.list.array=arr;
		}

		//list.renderHandler=new Handler(this,onListRender);
		__proto.onListRender=function(item,index){
			var label=item.getChildByName("label");
			if (index % 2){
				label.color="#ff0000";
				}else {
				label.color="#000000";
			}
		}

		return TestView;
	})(TestPageUI)


	//class laya.debug.uicomps.RankListItem extends laya.debug.ui.debugui.comps.RankListItemUI
	var RankListItem=(function(_super){
		function RankListItem(){
			RankListItem.__super.call(this);
			Base64AtlasManager.replaceRes(RankListItemUI.uiView);
			this.createView(RankListItemUI.uiView);
		}

		__class(RankListItem,'laya.debug.uicomps.RankListItem',_super);
		var __proto=RankListItem.prototype;
		__proto.createChildren=function(){}
		return RankListItem;
	})(RankListItemUI)


	//class laya.debug.uicomps.TreeListItem extends laya.debug.ui.debugui.comps.ListItemUI
	var TreeListItem=(function(_super){
		function TreeListItem(){
			TreeListItem.__super.call(this);
			Base64AtlasManager.replaceRes(ListItemUI.uiView);
			this.createView(ListItemUI.uiView);
		}

		__class(TreeListItem,'laya.debug.uicomps.TreeListItem',_super);
		var __proto=TreeListItem.prototype;
		__proto.createChildren=function(){}
		return TreeListItem;
	})(ListItemUI)


	//class laya.debug.view.nodeInfo.nodetree.DebugPage extends laya.debug.ui.debugui.DebugPanelUI
	var DebugPage=(function(_super){
		function DebugPage(){
			this.views=null;
			DebugPage.__super.call(this);
			this.msRec=new Rectangle();
			Base64AtlasManager.replaceRes(DebugPanelUI.uiView);
			this.createView(DebugPanelUI.uiView);
			DisControlTool.setResizeAbleEx(this);
			this.views=[this.treePanel,this.selectPanel,this.profilePanel];
			this.tab.selectedIndex=0;
			this.tabChange();
			this.tab.on("change",this,this.tabChange);
			this.changeSize();
		}

		__class(DebugPage,'laya.debug.view.nodeInfo.nodetree.DebugPage',_super);
		var __proto=DebugPage.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		__proto.tabChange=function(){
			DisControlTool.addOnlyByIndex(this.views,this.tab.selectedIndex,this);
			DisControlTool.setTop(this.resizeBtn);
		}

		__proto.changeSize=function(){
			if (this.width < 245){
				this.width=245;
			}
			if (this.height < 100){
				this.height=200;
			}
			laya.ui.Component.prototype.changeSize.call(this);
			this.msRec.setTo(0,0,this.width,this.height);
			this.scrollRect=this.msRec;
		}

		return DebugPage;
	})(DebugPanelUI)


	//class laya.debug.view.nodeInfo.nodetree.FindNode extends laya.debug.ui.debugui.FindNodeUI
	var FindNode=(function(_super){
		function FindNode(){
			FindNode.__super.call(this);
			Base64AtlasManager.replaceRes(FindNodeUI.uiView);
			this.createView(FindNodeUI.uiView);
		}

		__class(FindNode,'laya.debug.view.nodeInfo.nodetree.FindNode',_super);
		var __proto=FindNode.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		return FindNode;
	})(FindNodeUI)


	//class laya.debug.view.nodeInfo.nodetree.FindNodeSmall extends laya.debug.ui.debugui.FindNodeSmallUI
	var FindNodeSmall=(function(_super){
		function FindNodeSmall(){
			FindNodeSmall.__super.call(this);
			Base64AtlasManager.replaceRes(FindNodeSmallUI.uiView);
			this.createView(FindNodeSmallUI.uiView);
		}

		__class(FindNodeSmall,'laya.debug.view.nodeInfo.nodetree.FindNodeSmall',_super);
		var __proto=FindNodeSmall.prototype;
		__proto.createChildren=function(){}
		return FindNodeSmall;
	})(FindNodeSmallUI)


	//class laya.debug.view.nodeInfo.nodetree.MinBtnComp extends laya.debug.ui.debugui.MinBtnCompUI
	var MinBtnComp=(function(_super){
		function MinBtnComp(){
			this.tar=null;
			this.minHandler=null;
			this.maxHandler=null;
			this.prePos=new Point();
			MinBtnComp.__super.call(this);
			Base64AtlasManager.replaceRes(MinBtnCompUI.uiView);
			this.createView(MinBtnCompUI.uiView);
			this.init();
		}

		__class(MinBtnComp,'laya.debug.view.nodeInfo.nodetree.MinBtnComp',_super);
		var __proto=MinBtnComp.prototype;
		__proto.createChildren=function(){}
		__proto.init=function(){
			this.minBtn.on("click",this,this.onMinBtn);
			this.maxBtn.on("click",this,this.onMaxBtn);
			this.minState=false;
			this.maxUI.removeSelf();
			DisControlTool.setDragingItem(this.bg,this.maxUI);
		}

		__proto.onMaxBtn=function(){
			this.maxUI.removeSelf();
			if (this.maxHandler){
				this.maxHandler.run();
			}
			if (this.tar){
				this.tar.x+=this.maxUI.x-this.prePos.x;
				this.tar.y+=this.maxUI.y-this.prePos.y;
			}
		}

		__proto.onMinBtn=function(){
			if (!this.displayedInStage)return;
			var tPos;
			tPos=Point.TEMP;
			tPos.setTo(0,0);
			tPos=this.localToGlobal(tPos);
			tPos=DebugInfoLayer.I.popLayer.globalToLocal(tPos);
			this.maxUI.pos(tPos.x,tPos.y);
			DebugInfoLayer.I.popLayer.addChild(this.maxUI);
			if (this.tar){
				this.prePos.setTo(tPos.x,tPos.y);
			}
			if (this.minHandler){
				this.minHandler.run();
			}
		}

		__getset(0,__proto,'minState',null,function(v){
		});

		return MinBtnComp;
	})(MinBtnCompUI)


	//class laya.debug.view.nodeInfo.nodetree.NodeListPanel extends laya.debug.ui.debugui.NodeListPanelUI
	var NodeListPanel=(function(_super){
		function NodeListPanel(){
			NodeListPanel.__super.call(this);
			Base64AtlasManager.replaceRes(NodeListPanelUI.uiView);
			this.createView(NodeListPanelUI.uiView);
		}

		__class(NodeListPanel,'laya.debug.view.nodeInfo.nodetree.NodeListPanel',_super);
		var __proto=NodeListPanel.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		return NodeListPanel;
	})(NodeListPanelUI)


	//class laya.debug.view.nodeInfo.nodetree.NodeTool extends laya.debug.ui.debugui.NodeToolUI
	var NodeTool=(function(_super){
		function NodeTool(){
			NodeTool.__super.call(this);
			Base64AtlasManager.replaceRes(NodeToolUI.uiView);
			this.createView(NodeToolUI.uiView);
		}

		__class(NodeTool,'laya.debug.view.nodeInfo.nodetree.NodeTool',_super);
		var __proto=NodeTool.prototype;
		__proto.createChildren=function(){}
		return NodeTool;
	})(NodeToolUI)


	//class laya.debug.view.nodeInfo.nodetree.NodeTreeSetting extends laya.debug.ui.debugui.NodeTreeSettingUI
	var NodeTreeSetting=(function(_super){
		function NodeTreeSetting(){
			NodeTreeSetting.__super.call(this);
			Base64AtlasManager.replaceRes(NodeTreeSettingUI.uiView);
			this.createView(NodeTreeSettingUI.uiView);
		}

		__class(NodeTreeSetting,'laya.debug.view.nodeInfo.nodetree.NodeTreeSetting',_super);
		var __proto=NodeTreeSetting.prototype;
		//inits();
		__proto.createChildren=function(){}
		return NodeTreeSetting;
	})(NodeTreeSettingUI)


	//class laya.debug.view.nodeInfo.nodetree.NodeTree extends laya.debug.ui.debugui.NodeTreeUI
	var NodeTree=(function(_super){
		function NodeTree(){
			this.showProps=false;
			this._closeSettingHandler=null;
			this._tar=null;
			NodeTree.__super.call(this);
			Base64AtlasManager.replaceRes(NodeTreeUI.uiView);
			View.regComponent("Tree",TreeBase);
			this.createView(NodeTreeUI.uiView);
			View.regComponent("Tree",Tree);
			this.inits();
			NodeTree.I=this;
		}

		__class(NodeTree,'laya.debug.view.nodeInfo.nodetree.NodeTree',_super);
		var __proto=NodeTree.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		__proto.inits=function(){
			this.nodeTree.list.scrollBar.hide=true;
			this.nodeTree.list.selectEnable=true;
			this.settingBtn.on("click",this,this.onSettingBtn);
			this.freshBtn.on("click",this,this.fresh);
			this.closeBtn.on("click",this,this.onCloseBtn);
			this.fliterTxt.on("enter",this,this.onFliterTxtChange);
			this.fliterTxt.on("blur",this,this.onFliterTxtChange);
			NodeMenu.I.setNodeListAction(this.nodeTree.list);
			this.nodeTree.list.on("click",this,this.onListClick,[this.nodeTree.list]);
			this.nodeTree.renderHandler=new Handler(this,this.treeRender);
			this._closeSettingHandler=new Handler(this,this.closeSetting);
			this.onIfShowPropsChange();
			this.ifShowProps.on("change",this,this.onIfShowPropsChange);
		}

		__proto.onIfShowPropsChange=function(){
			this.showProps=this.ifShowProps.selected;
			this.fresh();
		}

		__proto.onListClick=function(list){
			if (list.selectedItem){
				if (list.selectedItem.isDirectory){
					list.selectedItem.isOpen=!list.selectedItem.isOpen;
					this.nodeTree.fresh();
				}
			}
		}

		//}
		__proto.onFindBtn=function(){
			FindSmallView.I.show();
		}

		__proto.onCloseBtn=function(){
			this.removeSelf();
		}

		__proto.onTreeDoubleClick=function(e){
			if (this.nodeTree.selectedItem){
				var tarNode;
				tarNode=this.nodeTree.selectedItem.path;
				NodeMenu.I.objRightClick(tarNode);
			}
		}

		//}
		__proto.onTreeRightMouseDown=function(e){
			if (this.nodeTree.selectedItem){
				var tarNode;
				tarNode=this.nodeTree.selectedItem.path;
				NodeMenu.I.objRightClick(tarNode);
			}
		}

		//}
		__proto.onSettingBtn=function(){
			NodeTreeSettingView.I.showSetting(NodeTree.showKeys,this._closeSettingHandler,this._tar);
		}

		__proto.closeSetting=function(newKeys){
			NodeTree.showKeys=newKeys;
			this.fresh();
		}

		__proto.onFliterTxtChange=function(e){
			var key;
			key=this.fliterTxt.text;
			if (key=="")return;
			if (key !=NodeTree.showKeys.join(",")){
				NodeTree.showKeys=key.split(",");
				this.fresh();
			}
			return;
			this.selecteByFile(key);
		}

		__proto.selecteByFile=function(key){
			var arr;
			arr=this.nodeTree.source;
			var rsts;
			rsts=DebugTool.findNameHas(key,false);
			if (rsts && rsts.length > 0){
				var tar;
				tar=rsts[0];
				this.parseOpen(arr,tar);
			}
		}

		__proto.showSelectInStage=function(node){
			this.setDis(Laya.stage);
			this.selectByNode(node);
		}

		__proto.selectByNode=function(node){
			if (!node)return;
			var arr;
			arr=this.nodeTree.source;
			this.parseOpen(arr,node);
		}

		__proto.showNodeList=function(nodeList){
			if (!nodeList)return;
			var i=0,len=0;
			len=nodeList.length;
			var showList;
			showList=[];
			var tData;
			var tSprite;
			for (i=0;i < len;i++){
				tSprite=nodeList[i];
				tData={};
				tData.label=ClassTool.getNodeClassAndName(tSprite);
				tData.path=tSprite;
				showList.push(tData);
			}
			this.nodeTree.array=showList;
		}

		__proto.parseOpen=function(tree,node){
			if (tree.length < 1)return;
			if (!node)return;
			var i=0,len=0;
			len=tree.length;
			var tItem;
			for(i=0;i<len;i++){
				tItem=tree[i];
				if(tItem.path==node){
					var sItem;
					sItem=tItem;
					while (tItem){
						tItem.isOpen=true;
						this.nodeTree.fresh();
						tItem=tItem.nodeParent;
					}
					this.nodeTree.selectedItem=sItem;
					return;
				}
			}
		}

		/**
		*@private
		*获取数据源中指定键名的值。
		*/
		__proto.getFilterSource=function(array,result,key){
			key=key.toLocaleLowerCase();
			var item;
			for(var $each_item in array){
				item=array[$each_item];
				if (item.isDirectory && String(item.label).toLowerCase().indexOf(key)>-1){
					item.x=0;
					result.push(item);
				}
				if (item.child && item.child.length > 0){
					this.getFilterSource(item.child,result,key);
				}
			}
		}

		__proto.onControlDown=function(){
			this.startDrag();
		}

		__proto.setDis=function(sprite){
			this._tar=sprite;
			this.fresh();
		}

		__proto.fresh=function(){
			var preTar;
			if (this.nodeTree.selectedItem){
				var tItem;
				tItem=this.nodeTree.selectedItem;
				while (tItem && (! (tItem.path instanceof laya.display.Sprite ))){
					tItem=tItem.nodeParent;
				}
				if (tItem && tItem.path){
					preTar=tItem.path;
				}
			}
			if (!this._tar){
				this.nodeTree.array=[];
				}else{
				this.nodeTree.array=NodeUtils.getNodeTreeData(this._tar,this.showProps?NodeTree.showKeys:NodeTree.emptyShowKey);
			}
			if (preTar){
				this.selectByNode(preTar);
			}
		}

		__proto.treeRender=function(cell,index){
			var item=cell.dataSource;
			if (item){
				var isDirectory=item.child || item.isDirectory;
				var label=cell.getChildByName("label");
				if ((item.path instanceof laya.display.Node )){
					label.color="#09a4f6";
					}else{
					if (item.isChilds){
						label.color="#00ff11";
						}else{
						label.color="#838bc5";
					}
				}
			}
		}

		NodeTree.I=null
		NodeTree.emptyShowKey=[];
		__static(NodeTree,
		['showKeys',function(){return this.showKeys=["x","y","width","height","renderCost"];}
		]);
		return NodeTree;
	})(NodeTreeUI)


	//class laya.debug.view.nodeInfo.nodetree.ObjectCreate extends laya.debug.ui.debugui.ObjectCreateUI
	var ObjectCreate=(function(_super){
		function ObjectCreate(){
			ObjectCreate.__super.call(this);
			Base64AtlasManager.replaceRes(ObjectCreateUI.uiView);
			this.createView(ObjectCreateUI.uiView);
		}

		__class(ObjectCreate,'laya.debug.view.nodeInfo.nodetree.ObjectCreate',_super);
		var __proto=ObjectCreate.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		return ObjectCreate;
	})(ObjectCreateUI)


	//class laya.debug.view.nodeInfo.nodetree.ObjectInfo extends laya.debug.ui.debugui.ObjectInfoUI
	var ObjectInfo=(function(_super){
		function ObjectInfo(){
			ObjectInfo.__super.call(this);
			Base64AtlasManager.replaceRes(ObjectInfoUI.uiView);
			this.createView(ObjectInfoUI.uiView);
		}

		__class(ObjectInfo,'laya.debug.view.nodeInfo.nodetree.ObjectInfo',_super);
		var __proto=ObjectInfo.prototype;
		__proto.createChildren=function(){}
		return ObjectInfo;
	})(ObjectInfoUI)


	//class laya.debug.view.nodeInfo.nodetree.OutPut extends laya.debug.ui.debugui.OutPutUI
	var OutPut=(function(_super){
		function OutPut(){
			OutPut.__super.call(this);
			Base64AtlasManager.replaceRes(OutPutUI.uiView);
			this.createView(OutPutUI.uiView);
		}

		__class(OutPut,'laya.debug.view.nodeInfo.nodetree.OutPut',_super);
		var __proto=OutPut.prototype;
		__proto.createChildren=function(){}
		return OutPut;
	})(OutPutUI)


	//class laya.debug.view.nodeInfo.nodetree.Profile extends laya.debug.ui.debugui.ProfileUI
	var Profile=(function(_super){
		function Profile(){
			this.views=null;
			Profile.__super.call(this);
			Base64AtlasManager.replaceRes(ProfileUI.uiView);
			this.createView(ProfileUI.uiView);
			this.views=[this.createPanel,this.renderPanel,this.cachePanel,this.resPanel];
			this.tab.selectedIndex=0;
			this.tabChange();
			this.tab.on("change",this,this.tabChange);
		}

		__class(Profile,'laya.debug.view.nodeInfo.nodetree.Profile',_super);
		var __proto=Profile.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		__proto.tabChange=function(){
			DisControlTool.addOnlyByIndex(this.views,this.tab.selectedIndex,this);
		}

		return Profile;
	})(ProfileUI)


	//class laya.debug.view.nodeInfo.nodetree.Rank extends laya.debug.ui.debugui.RankUI
	var Rank=(function(_super){
		function Rank(){
			Rank.__super.call(this);
			Base64AtlasManager.replaceRes(RankUI.uiView);
			this.createView(RankUI.uiView);
		}

		__class(Rank,'laya.debug.view.nodeInfo.nodetree.Rank',_super);
		var __proto=Rank.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		return Rank;
	})(RankUI)


	//class laya.debug.view.nodeInfo.nodetree.SelectInfos extends laya.debug.ui.debugui.SelectInfosUI
	var SelectInfos=(function(_super){
		function SelectInfos(){
			SelectInfos.__super.call(this);
			Base64AtlasManager.replaceRes(SelectInfosUI.uiView);
			this.createView(SelectInfosUI.uiView);
		}

		__class(SelectInfos,'laya.debug.view.nodeInfo.nodetree.SelectInfos',_super);
		var __proto=SelectInfos.prototype;
		__proto.createChildren=function(){
			this.viewMapRegists();
		}

		return SelectInfos;
	})(SelectInfosUI)


	//class laya.debug.view.nodeInfo.nodetree.ToolBar extends laya.debug.ui.debugui.ToolBarUI
	var ToolBar=(function(_super){
		function ToolBar(){
			ToolBar.__super.call(this);
			Base64AtlasManager.replaceRes(ToolBarUI.uiView);
			this.createView(ToolBarUI.uiView);
		}

		__class(ToolBar,'laya.debug.view.nodeInfo.nodetree.ToolBar',_super);
		var __proto=ToolBar.prototype;
		__proto.createChildren=function(){}
		return ToolBar;
	})(ToolBarUI)


	//class laya.ui.AsynDialog extends laya.ui.Dialog
	var AsynDialog=(function(_super){
		function AsynDialog(){
			this._uiView=null;
			this.isCloseOther=false;
			AsynDialog.__super.call(this);
		}

		__class(AsynDialog,'laya.ui.AsynDialog',_super);
		var __proto=AsynDialog.prototype;
		/**@private */
		__proto.createView=function(uiView){
			this._uiView=uiView;
		}

		__proto._open=function(modal,closeOther){
			this.isModal=modal;
			this.isCloseOther=closeOther;
			Dialog.manager.lock(true);
			if (this._uiView)this.onCreated();
			else this.onOpen();
		}

		/**
		*在页面未创建时执行一次，再次打开页面不会再执行，适合写一些只执行一次的逻辑，比如资源加载，节点事件监听
		*/
		__proto.onCreated=function(){
			this.createUI();
			this.onOpen();
		}

		/**根据节点数据创建UI*/
		__proto.createUI=function(){
			laya.ui.View.prototype.createView.call(this,this._uiView);
			this._uiView=null;
			this._dealDragArea();
		}

		/**
		*在页面每次打开都会执行，适合做一些每次都需要处理的事情，比如消息请求，根据数据初始化页面
		*/
		__proto.onOpen=function(){
			Dialog.manager.open(this,this.isCloseOther);
			Dialog.manager.lock(false);
		}

		__proto.close=function(type){
			Dialog.manager.close(this);
			this.onClose();
		}

		/**
		*在每次关闭的时候调用，适合关闭时停止动画，网络消息监听等逻辑
		*/
		__proto.onClose=function(){}
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			laya.ui.View.prototype.destroy.call(this,destroyChild);
			this._uiView=null;
			this.onDestroy();
		}

		/**
		*在页面被销毁的时候调用，适合置空引用对象
		*/
		__proto.onDestroy=function(){}
		return AsynDialog;
	})(Dialog)


	Laya.__init([Browser,LoaderManager,EventDispatcher,Render,View,Timer,GraphicAnimation,LocalStorage]);
	new LayaUISample();

})(window,document,Laya);
