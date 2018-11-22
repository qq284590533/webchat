
// 根据环境区分接口地址
export function allport() {
	let allport = '';
	if (process.env.API_ROOT !== '' && process.env.API_ROOT !== 'undefined') {
		// 正式环境地址
		allport = process.env.API_ROOT;
	} else {
		// 测试环境地址
		allport = 'http://api.yichatsystem.com/';
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

export function sortChinese (arr, dataLeven) { 
	function getValue (option) { 
		if (!dataLeven) return option
		var data = option
		dataLeven.split('.').filter(function (item) {
			data = data[item]
		})
		return data + ''
	}
	arr.sort(function (item1, item2) {
		return getValue(item1).localeCompare(getValue(item2), 'zh-CN');
	})
}

export function objSortFun(arr,key){
	console.log(arr)
	arr.forEach(item => {
		if(item[key]){
			let code = stringDiscern(item[key][0])
			console.log(item[key])
			switch(code){
				case 1:
					console.log('中文');
					break;
				case 2:
					console.log('英文');
					break;
				case 3:
					console.log('数字');
					break;
				case 4:
					console.log('特殊字符');
					break;
				default:
					break;
			}
		}
	});
}

function stringDiscern(str){
	let pattern1 = new RegExp("[\u4E00-\u9FA5]+");
	let pattern2 = new RegExp("[A-Za-z]+");
	let pattern3 = new RegExp("[0-9]+");
	if(pattern1.test(str)){
		return 1
	}else{
		if(pattern2.test(str)){
			return 2
		}else{
			if(pattern3.test(str)){
				return 3
			}else{
				return 4
			}
		}
	}
}
