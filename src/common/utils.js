
// 根据环境区分接口地址
export function allport() {
	let allport = '';
	if (process.env.API_ROOT !== '' && process.env.API_ROOT !== 'undefined') {
		// 正式环境地址
		allport = process.env.API_ROOT;
	} else {
		// 测试环境地址
		allport = 'http://47.92.234.68/api/';
	}
	return allport;
}

// 写缓存本地
export function saveLocal(key, value) {
	if (key != "") {
		let jsonData = JSON.stringify(value);
		localStorage.setItem(key, jsonData);
	} else {
		console.log('key不能为空');
	}
}

// 读本地缓存
export function readLocal(key) {
	if (key != '') {
		var datajson = window.localStorage.getItem(key);
		datajson = JSON.parse(datajson);
		return datajson;
	} else {
		console.log('key不能为空');
	}
}
