import ajax from '../common/ajax'

//登录
export function login(params) {
    return ajax({
		url: '/api/user/login',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//获取二维码uid
export function getQruuid() {
    return ajax({
		url: '/api/web/getQruuid',
		method: 'get',
		data: {},
	})
}

//二维码登录
export function checkQruuid(params) {
    return ajax({
		url: '/api/web/checkQruuid',
		method: 'get',
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
		url: '/api/System/getmygroup',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}
