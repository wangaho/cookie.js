(function(w, d){
	
	
	/**
	 * cookie('key','value',{expire:有效时间,path:路径,...}) 设置cookie
	 * cookie('key') 获取cookie
	 * cookie('key',null) 删除cookie
	 * cookie() 获取所有cookie
	 * cookie(null) 清空所有cookie
	 */
	function cookie(){
		if( arguments.length >1 ){
			//判断是不是字符串
			//将键强制转换为字符串
			if(typeof arguments[0] != 'string'){
				arguments[0] = String(arguments[0]);
				if( !arguments[0] ){
					return false;
					}
				}
			//判断是不是删除 === null
			if( arguments[1] === null ){
				return cookie.prototype.remove(arguments[0]);
				}
			if(!arguments[2] || typeof arguments[2] != 'object'){
				arguments[2] = new Object();//默认空对象
				}
			return cookie.prototype.set(arguments[0], arguments[1], arguments[2]);
		}else{
			
			//只有一个参数是获取cookie。没有参数则是获取所有的cookie键值信息
			if( arguments.length == 1 ){
				
				//清空所有的cookie
				if(arguments[0] === null){
					return cookie.prototype.remove(arguments[0]);
					}
				
				return cookie.prototype.get(arguments[0]);//获取指定的cookie值
				}else{
					return cookie.prototype.get();//获取所有的cookie值，返回的是一个对象
					}
				
			}
		
	}
	
	
	cookie.prototype = {
		
		
		constructor : cookie,
		
		
		
		/**
		 * 设置cookie
		 * 成功返回true 失败返回false
		 * encodeURIComponent(decodeURIComponent(encodeURI(v)))
		 * 
		 * @param {String} n	键
		 * @param {String} v	值
		 * @param {String} c	配置信息
		 */
		set : function(n, v , c){
			if(typeof v != 'string'){
				v = String(v);
				}
			//配置信息
			var options = {
				'expire' : null,//有效时间，默认不设置(秒)
				'path' : null,//有效路径，默认是不设置
				'domain' : null,//设置作用域(域名)
				'secure ' : null,//设置安全措施，为 true 则直接设置
				};
			//传入的参数单位是（秒）。*1000是转为毫秒。
			if(typeof c.expire !== 'undefined'){
				c.expire = parseInt(c.expire);
				var exp = new Date(); 
				exp.setTime(exp.getTime() + (c.expire*1000)); //exp过期时间 = 当前时间 +过期时间(秒)
				options.expire = 'expires='+exp.toGMTString();
				}
			if(typeof c.path !== 'undefined'){
				options.path = 'path='+c.path;
				}
			if(typeof c.domain !== 'undefined'){
				options.domain = 'domain='+c.domain;
				}
			//Secure – 安全。指定cookie的值通过网络如何在用户和WEB服务器之间传递。这个属性的值或者是“secure”，或者为空。缺省情况下，该属性为空，也就是使用不安全的HTTP连接传递数据。如果一个 cookie 标记为secure，那么，它与WEB服务器之间就通过HTTPS或者其它安全协议传递数据。不过，设置了secure属性不代表其他人不能看到你机器本地保存的cookie。换句话说，把cookie设置为secure，只保证cookie与WEB服务器之间的数据传输过程加密，而保存在本地的cookie文件并不加密。如果想让本地cookie也加密，得自己加密数据。
			if( c.secure ){
				options.secure = 'secure';
				}
			var cookies = n+'='+encodeURIComponent(decodeURIComponent(encodeURI(v)));
			for(var i in options){
				if( options[i] !== null ){
					cookies += '; '+options[i];
					}
				}
			//设置
			document.cookie = cookies;
			return true;
		},
		
		
		
		/**
		 * 获取指定键的cookie值。返回 === null代表不存在
		 * n如果为空，则是返回所有的cookie键值，返回的是一个对象
		 * decodeURIComponent
		 * 
		 *  @param {String} n
		 */
		get : function(n){
			if( typeof n == 'string' ){
				var reg = new RegExp("(^| )"+n+"=([^;]*)(;|$)");
				var	a = document.cookie.match(reg);
			    if(a){
			    	return decodeURIComponent(a[2]); 
				    }else{
				    	return null;//返回空
				   		}
				}else{
					if( document.cookie.length == 0 ){
						return null;//返回空
						}
					var o = new Object();
					//返回所有的cookie键值
					var cookies = document.cookie.split("; "); 
					for(var i in cookies){
						var reg = /([^\=]+)\=(.*)/;
						var	a = cookies[i].match(reg);
						if(a){
							o[a[1]] = decodeURIComponent(a[2]);
							}
						}
					return o;
					}
				
		},
		
		
		
		
		/**
		 * 删除cookie
		 * 
		 * @param {Object} n
		 */
		remove : function(n){
			var exp = new Date(); 
			exp.setTime(exp.getTime() - 1); //将date设置为过去的时间
			if( n !== null ){
				//说明是指定删除
			    var cookie = this.get(n); 
			    if( cookie !== null ){
			    	document.cookie = n+"="+cookie+";expires="+exp.toGMTString();
			    	}
				}else{
					//否则是说明是清空所有的cookie
					var cookies = this.get();
					if( cookies !== null ){
						for(var i in cookies ){
							document.cookie = i+"="+cookies[i]+";expires="+exp.toGMTString();
							}
						}
				}
				
		},		
		
		
	};
	
	
	
	w.cookie = cookie;
	w.cookie.v = 'v1';//版本号



})(window, document);	