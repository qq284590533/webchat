/**
 * 图片上传模块
 *  */

 
let VM,imgUpload;
function creatUploader(vm){
	VM = vm;
	console.log(VM.$refs.addImg)
	console.log(VM.$refs.container)
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
				console.log('初始化')
			},
			FilesAdded: function (up, files) {
				// getOssSign(files);
				console.log('添加图片')
				createDataURL(up, files)
			},
			BeforeUpload: function (up, file) {
				console.log('开始上传图片')
				// ossBeforeUploadAction(up, file, _this);
				return;
			},
			UploadProgress: function (up, file) {
				console.log('上传图片中……')
			},
			FileUploaded: function (up, file, info) {
				// imgfileSucesse(file)
				console.log('图片上传完成！')
				up.refresh();
			},
			Error: function (up, error) {
				up.refresh();
			}
		}
	});
	imgUpload.init()
	console.log(imgUpload)

}

function createDataURL ( up, files) {
	// var _this = this;
	plupload.each(files, function (file) {
		//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
		if (file.type == 'image/gif') { 
			var fr = new mOxie.FileReader();
			fr.onload = function () {
				file.imgsrc = fr.result;
				// var div = _this.createBlock(file, up)
				// _this.addImgHandle( div, file, up)
			}
			fr.readAsDataURL(file.getSource());
		} else {
			var preloader = new mOxie.Image();
			preloader.onload = function () {
				var imgsrc = preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
				file.imgsrc = imgsrc;
				preloader.destroy();
				preloader = null;
				// var div = _this.createBlock(file, up)
				// _this.addImgHandle( div, file, up)
			};
			preloader.load(file.getSource());
		}
		console.log(file)
	});
}



export {
	creatUploader,
}