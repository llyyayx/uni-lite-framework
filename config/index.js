export default {
	// appCode [移动中台获取, 没有使用移动中台空着就行]
	appCode: '7732486935',
	// 后台服务配置
	serve: {
		// 服务名称
		madp: {
			// 中文备注
			name: '移动中台测试环境下的代理地址',
			// 主机地址
			host: 'https://madp.sgai.cn',
			// 请求前缀
			baseUrl: '/madp-app/msGw/apiDefine/callApiUnauth',
		},
		lwlims: {
			name: 'limis后台服务地址',
			host: 'http://10.168.114.160:31043',
			baseUrl: '/iiot-lwlims-app',
		}
	},
	// [HBuilderX中NODE_ENV, 点击"运行"编译出来的代码是开发环境, 点击"发行"编译出来的代码是生产环境]
	// 使用的主后台服务名称 [应用中使用多个服务host时, 请手动config.serve[key]]
	serveKey: process.env.NODE_ENV == 'development' ? 'madpDev' : 'madp',
	// 主要请求驱动方式 [枚举: gatewayRequest移动网关/request普通请求/uploadFile文件上传]
	reqDrive: 'gatewayRequest',
	// 接受app注入主机地址的服务名称 [理论应该包含serveKey的设置]
	injectKeys: ['madp'],
	// 是否接受app基座注入主机地址 [生产环境下]
	injectHost: true,
	// 测试token [将通过utils/userInfo.js写入至缓存]
	devToken: '',
	
	/* --------------------非重要配置项------------------- */
	// 在本地(开发)运行时用户信息来源 [枚举: mock模拟/inject注入]
	devUserInfo: 'mock',
	// 在本地(开发)运行时是否接受app基座注入主机地址
	devInjectHost: false,
	// 是否开启应用级扫码监听 [一般是手持设备上, 红外扫码器扫码事件]
	appScanCode: true,
	// 是否开启nfc读卡功能
	appReadNfc: false,
	// 是否开启应用更新检测
	openUpdate: false,
	// 普通请求成功状态码
	successCode: ['0', '1'],
	// 移动网关代理成功状态码
	gatewaySuccessCode: ['1'],
	// 应用更新地址
	updateUrl: 'https://madp.sgai.cn:30201',
}