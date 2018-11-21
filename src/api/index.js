import ajaxFun from '../common/ajax'

export function login(params) {
    return ajaxFun({
		url: '/user/login',
		method: 'post',
		body: params
	})
}