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

//上传聊天记录
export function webUploadMessage(params) {
	return ajax({
		url: '/web/api/webUploadMessage',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//获取群聊记录
export function getMsgByTimestamp(params) {
	return ajax({
		url: '/web/api/getMsgByTimestamp',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//撤回消息
export function withdrawMessage(params) {
	return ajax({
		url: '/web/api/withdrawMessage',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}

//撤回消息
export function getmucMembers(params) {
	return ajax({
		url: '/web/api/getmucMembers',
		method: 'post',
		dataType: "jsonp",
		data: params,
	})
}
