// 此文件用于加载sdk前的预处理
 


var config = require('./config');
var util = require('./util');


util.get(config.getSettings, {param: ''}, function (data) {
	if(data.success) {
		util.loadCSS(config.sdkcss);
		util.loadJS(config.sdkjs);
	}
});


module.exports = {};
