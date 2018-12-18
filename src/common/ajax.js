let basicURL = "http://39.108.179.211"
// let basicURL = ""

function ajax(options) {
	return new Promise((resolve, reject)=>{
		options = options || {};
		options.method = (options.method || "GET").toUpperCase();
		options.dataType = options.dataType || "json";

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
					if(xhr.responseText){
						resolve(JSON.parse(xhr.responseText))
					}else{
						resolve('null')
					}
				} else {
					reject(status)
				}
			}
		}

		//连接 和 发送 - 第二步
		if (options.method == "GET") {
			let params = formatParams(options.data);
			xhr.open("GET", options.url + "?" + params, true);
			xhr.send(null);
		} else if (options.method == "POST") {
			let params;
			xhr.open("POST", basicURL+options.url, true);
			if(options.headers){
				for (let key in options.headers){
					xhr.setRequestHeader(key, options.headers[key]);
				}
				if(options.headers['Content-Type']&&options.headers['Content-Type']=='application/json'){
					params =options.data
				}
			}else{
				params = formatParams(options.data)
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			}
			// console.log(params)
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

