const qiniu = require("../index.js");
const proc = require("process");

var bucket = "human";//proc.env.QINIU_TEST_BUCKET;
var accessKey = "M1spBip8g7In9gUpkZhDfG8ipZ2Sq0ID_d6CwmLx";//proc.env.QINIU_ACCESS_KEY;
var secretKey = "OTArkBlSIbUu1LQMuwOFNlkOVsx67ZFq-_yzwes7";//proc.env.QINIU_SECRET_KEY;
console.log('七牛：',proc.env.QINIU_TEST_BUCKET,proc.env.QINIU_ACCESS_KEY,proc.env.QINIU_SECRET_KEY);
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
  scope: bucket,
}
var putPolicy = new qiniu.rs.PutPolicy(options);

var uploadToken = putPolicy.uploadToken(mac);
var config = new qiniu.conf.Config();
var localFile = "/home/node/node-v4.2.1-linux-x64/bin/qs/websocket/human/1/Three.js/avatar/";
//config.zone = qiniu.zone.Zone_z0;
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

//bytes
var upLoadByBytes = function(){
		formUploader.put(uploadToken, null, "hello", null, function(respErr,
		  respBody, respInfo) {
		  if (respErr) {
		    throw respErr;
		  }
		
		  if (respInfo.statusCode == 200) {
		    console.log(respBody);
		  } else {
		    console.log(respInfo.statusCode);
		    console.log(respBody);
		  }
	});
}


//file
var upLoadByFile = function(fileUrl,_callBack){
	 console.log('开始进入七牛云上传图片');
		formUploader.putFile(uploadToken, null, fileUrl, putExtra, function(respErr,
		  respBody, respInfo) {
		  if (respErr) {
		    throw respErr;
		  }
		
		  if (respInfo.statusCode == 200) {
		    console.log(respBody);
		  } else {
		    console.log(respInfo.statusCode);
		    console.log(respBody);
		  }
		  if(typeof _callBack == 'function')
		  _callBack(respInfo.statusCode,respBody);
		  
	});
}

exports.upLoadByBytes = upLoadByBytes;
exports.upLoadByFile = upLoadByFile;