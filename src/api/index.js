import ajax from '../common/ajax'

//登录
export function login(params) {
	console.log(params)
    return ajax({
		url: '/api/user/login',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//添加好友
export function addFriends(params) {
	return ajax({
		url: '/api/user/setFriends',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//获取好友
export function getFriendsList(params) {
	return ajax({
		url: '/api/user/getContactList',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//获取群列表
export function getGroupList(params) {
	return ajax({
		url: '/rest/adhoc/muc@muc.app.im',
		method: 'post',
		dataType: "jsonp",
		data:  JSON.stringify(params),
		headers:{
			'Content-Type':'application/json',
			'Authorization': 'Basic YWRtaW5AYXBwLmltOjEyMzQ1NkBhcHA=',
			'None-AES': '1'
		}
	})
}