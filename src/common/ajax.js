function ajax(options) {
	return new Promise((resolve, reject)=>{
		options = options || {};
		options.method = (options.method || "GET").toUpperCase();
		options.dataType = options.dataType || "json";

		var params = formatParams(options.data);
	
		//创建 - 非IE6 - 第一步
		if (window.XMLHttpRequest) {
			var xhr = new XMLHttpRequest();
		} else { //IE6及其以下版本浏览器
			var xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
	
		//接收 - 第三步
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				var status = xhr.status;
				if (status >= 200 && status < 300) {
					resolve(JSON.parse(xhr.responseText))
				} else {
					reject(status)
				}
			}
		}
	
		//连接 和 发送 - 第二步
		if (options.method == "GET") {
			xhr.open("GET", options.url + "?" + params, true);
			xhr.send(null);
		} else if (options.method == "POST") {
			xhr.open("POST", options.url, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(params);
		}
	})
}

//格式化参数
function formatParams(data) {
	var arr = [];
	for (var name in data) {
		arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
	}
	arr.push(("v=" + Math.random()).replace(".",""));
	return arr.join("&");
}

export default ajax

