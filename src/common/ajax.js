import axios from 'axios'
import { allport, readLocal } from './utils'

const axiosAjax = axios.create({
	baseURL: allport(), // api的base_url
	timeout: 5000, // request timeout
	withCredentials: false,
	headers: {
		// 'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Origin': "*"
	}
})

// axiosAjax.interceptors.request.use(config => {
// 	var userInfo = readLocal('userInfo');
// 	if (userInfo && userInfo.session) {
// 		config.headers["Access-Control-Allow-Origin"] = "*";
// 		config.headers['userId'] = userInfo.userId;
// 		config.headers['userSiteId'] = userInfo.siteId;
// 	};
// 	// Do something before request is sent
// 	return config
// }, error => {
// 	// Do something with request error
// 	console.log(error) // for debug
// 	Promise.reject(error)
// })

// axiosAjax.interceptors.response.use(function (response) {
// 	//对返回的数据进行一些处理
// 	let data = response.data;
// 	let obj = {
// 		code: data.code,
// 		data: data.data,
// 		success: data.success,
// 		message: data.message
// 	};
// 	return obj;
// }, function (error) {
// 	//对返回的错误进行一些处理
// 	return Promise.reject(error);
// });

var ajaxFun = function (option) {
	return new Promise(function (resolve, reject) {
		axiosAjax(option).then((response) => {
			resolve(response);
		}).catch((error) => {
			console.log(error);
			reject(error);
		});
	})
}

export default ajaxFun

