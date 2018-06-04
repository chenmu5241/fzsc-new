(function(window, mui) {
	/*window.basePath = "http://192.168.1.154:8080/fz-app/";
	window.baseUpload = "http://192.168.1.154:8080/fz-upload/"; //全局记录服务器端地址*/
	window.basePath = "http://192.168.2.100:8080/fz-app/";
	window.baseUpload = "http://192.168.2.100:8080/fz-upload/"; //

	//封装localStorage
	window.myLocalStorage = {};
	myLocalStorage.setItem = function(key, value) {
		if(value instanceof String) {
			localStorage.setItem(key, value)
		} else {
			localStorage.setItem(key, JSON.stringify(value))
		}
	}

	myLocalStorage.getItem = function(key) {
		var value = localStorage.getItem(key);
		try {
			value = JSON.parse(value)
		} catch(e) {}
		return value;
	}
	myLocalStorage.removeItem = function(key) {
		localStorage.removeItem(key);
	}

	//封装sessionStorage
	window.mySessionStorage = {};
	mySessionStorage.setItem = function(key, value) {
		if(value instanceof String) {
			sessionStorage.setItem(key, value)
		} else {
			sessionStorage.setItem(key, JSON.stringify(value))
		}
	}

	mySessionStorage.getItem = function(key) {
		var value = sessionStorage.getItem(key);
		try {
			value = JSON.parse(value)
		} catch(e) {
			value = sessionStorage.getItem(key);
		}
		return value;
	}

	//请求拦截
	/*    $.ajaxSetup({
	        type: "POST",
	        beforeSend: function (evt, request, settings) {
	            request.url = bgBaseUrl + request.url;
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        	mui.toast("请求数据异常！")
	        }
	    });*/

	window.initView = function() {
		mui("body").on("tap", "a", function() {
			if(this.href != "" && !$(this).hasClass("mui-action-back") && !this.href.indexOf("javascript") > -1) {
				mui.openWindow({
					url: this.href
				})
			}
		})
	}

	window.isLogin = function() {
		if(myLocalStorage.getItem("user") == null) {
			return false;
		} else {
			return true;
		}
	}

	//刷新角标数据
	window.refreshCartNum = function(num) {
		$(".cartNum").text(num)
	}
	//刷新角标数据
	window.refreshChatNum = function(num) {
		$(".chatNum").text(num)
	}

	/** 
	 * 得到一个数组不重复的元素集合<br/> 
	 * 唯一化一个数组 
	 * @returns {Array} 由不重复元素构成的数组 
	 */
	Array.prototype.uniquelize = function() {
		var ra = new Array();
		for(var i = 0; i < this.length; i++) {
			if(!ra.contains(this[i])) {
				ra.push(this[i]);
			}
		}
		return ra;
	};
	/*
	 * @param {Function} fn 进行迭代判定的函数
	 * @param more ... 零个或多个可选的用户自定义参数 
	 * @returns {Array} 结果集，如果没有结果，返回空集 
	 */
	Array.prototype.each = function(fn) {
		fn = fn || Function.K;
		var a = [];
		var args = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < this.length; i++) {
			var res = fn.apply(this, [this[i], i].concat(args));
			if(res != null) a.push(res);
		}
		return a;
	};
	/**
	 * 包含
	 * @param {Object} val
	 */
	Array.prototype.contains = function(val) {
		var arr = this;
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] == val)
				return true;
		}
		return false;
	}

	/**
	 * 得到两个数组的交集
	 * @param arry a
	 * @param arry b
	 */
	Array.intersect = function(a, b) {
		return a.uniquelize().each(function(o) {
			return b.contains(o) ? o : null
		});
	};

	mui.app_refresh = function(pageId) {
		var _page = plus.webview.getWebviewById(pageId);
		if(_page) {
			_page.reload(true);
		}
	}
	mui.firePageEvent = function(id, event, jsonParam) {
		try {
			var page = plus.webview.getWebviewById(id);
			mui.fire(page, event, jsonParam);
		} catch(e) {}
	}

	//加载config数据
	if(myLocalStorage.getItem("config") == null) {
		$.ajax({
			dataType: "json",
			type: "post",
			url: basePath + "loadConfig",
			success: function(result) {
				if(result.success) {
					console.log(result.data);
					myLocalStorage.setItem("config", result.data);
				} else {
					mui.toast(result.message)
				}
			},
			error: function(result) {}
		});
	}

}(window, mui))