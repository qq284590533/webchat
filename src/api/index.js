import ajax from '../common/ajax'

//登录
export function login(params) {
    return ajax({
		url: '/web/api/login',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//获取二维码uid
export function getQruuid() {
    return ajax({
		url: '/web/api/getQruuid',
		method: 'get',
		data: {},
	})
}

//二维码登录
export function checkQruuid(params) {
    return ajax({
		url: '/web/api/checkQruuid',
		method: 'get',
		data: params,
	})
}

//添加好友
export function addFriends(params) {
	return ajax({
		url: '/web/api/setFriends',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//获取好友
export function getFriendsList(params) {
	return ajax({
		url: '/web/api/getContactList',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//获取群列表
export function getGroupList(params) {
	return ajax({
		url: '/web/api/getmygroup',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}
