import config from '/config/index'

/**
 * @desc: app基座注入用户信息
 * @author xujiale
 * @return null
*/
export const injectUserInfo = () => {
	// #ifdef H5
		const params = new URLSearchParams(window.location.href.split('?')[1])
		let data = Object.fromEntries(params.entries())
		let infoData = { data }
	// #endif
	// #ifndef H5
		let infoData = null
		// 兼容鸿蒙
		let launchParams = uni.getLaunchOptionsSync()
		if (launchParams && launchParams.referrerInfo && launchParams.referrerInfo.extraData) {
			const extraData = launchParams.referrerInfo.extraData
			const keys = Object.keys(extraData) || []
			if (keys.length > 0) {
				infoData = extraData
			}
		}
		// android与ios
		if (infoData == null) { infoData = JSON.parse(plus.runtime.arguments) }
	// #endif
	if (infoData) {
		uni.setStorageSync('userInfo', infoData.data)
	}
}

/**
 * @desc: 模拟用户数据
 * @author xujiale
 * @return null
*/
export const mockUserInfo = () => {
	const userInfo = {
		userSid: 1,
		username: 'testUser',
		usernameCn: '测试用户',
		userType: 0,
		orgId: 10,
		companyId: 10001,
		companyName: '测试数据服务有限公司',
		permissions: [],
		token: config.devToken,
	}
	uni.setStorageSync('userInfo', userInfo)
	return userInfo
}