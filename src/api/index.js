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