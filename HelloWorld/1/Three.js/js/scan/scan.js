/**
 * 二维码扫描
 */
function Scan(){
	var that = this;
	that.scan = new plus.barcode.Barcode('bcid');
	that.scan.onmarked = onmarked; 
	function onmarked( type, result ) {
	var text = '未知: ';
	switch(type){
		case plus.barcode.QR:
		text = 'QR: ';
		break;
		case plus.barcode.EAN13:
		text = 'EAN13: ';
		break;
		case plus.barcode.EAN8:
		text = 'EAN8: ';
		break;
	}
	alert( text+result );
	}
}

/**
 * 开始扫描
 */
Scan.prototype.startScan = function(){
	var that = this;
	that.scan.start();
}
Scan.prototype.cancelScan = function() {
	var that = this;
	that.scan.cancel();
}
Scan.prototype.setFlash = function() {
	var that = this;
	that.scan.setFlash();
}
Scan.prototype.closeScan = function() {
	var that = this;
	that.scan.close();
}