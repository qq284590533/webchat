
let Vue
function setVue(vm){
    Vue = vm
    console.log(Vue)
}

let imgUpload = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: document.getElementById('addImg'),
    url: 'http://oss.aliyuncs.com',
    container: document.getElementById('container'),
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
        },
        FilesAdded: function (up, files) {
            // getOssSign(files);
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


export {
    setVue,
}