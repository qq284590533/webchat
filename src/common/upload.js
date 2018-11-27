/**
 * 图片上传模块
 *  */

import base64 from './base64'
let Base64 = new base64()
let host = "http://htmessage.oss-cn-hangzhou.aliyuncs.com/";
let accessid = 'LTAIBUjHs9ZYoo3t';
let accesskey = "93OfZok7hnT2b3ecXVndKAua35vVC9";
let filename = '';
// accessKeyId = "LTAIBUjHs9ZYoo3t";
// accessKeySecret = "93OfZok7hnT2b3ecXVndKAua35vVC9";

let VM,imgUpload;
function creatUploader(vm){
	VM = vm;
	imgUpload = new plupload.Uploader({
		runtimes: 'html5,flash,silverlight,html4',
		browse_button: VM.$refs.addImg,
		url: 'http://oss.aliyuncs.com',
		container:VM.$refs.container,
		filters: {
			mime_types: [{
				title: "Image files",
				extensions: "jpeg,jpg,gif,png"
			}],
			max_file_size: '5mb', //最大只能上传5mb的文件
			prevent_duplicates: false //不允许选取重复文件
		},
		init: {
			PostInit: function () { //上传初始化的操作函数
				console.log('上传模块初始化')
			},
			FilesAdded: function (up, files) {
				console.log('添加图片')
				up.start()
			},
			BeforeUpload: function (up, file) {
				console.log('开始上传图片')
				set_upload_param(up, file.name);
				return;
			},
			UploadProgress: function (up, file) {
				console.log('上传图片中……')
			},
			FileUploaded: function (up, file, info) {
				console.log('图片上传完成！')
				// VM.sendMsg(2002,file);
				set_upload_sucesse()
				up.refresh();
			},
			Error: function (up, error) {
				up.refresh();
			}
		}
	});
	imgUpload.init()
}

var policyText = {
    "expiration": "2030-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "conditions": [
    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};

var policyBase64 = Base64.encode(JSON.stringify(policyText))
let message = policyBase64
var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
var signature = Crypto.util.bytesToBase64(bytes);

function set_upload_param(up, filename)
{
	filename = filename;
    let new_multipart_params = {
        'key' : '/',
        'policy': policyBase64,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

function set_upload_sucesse(){
	console.log(filename);
}


export {
	creatUploader,
}