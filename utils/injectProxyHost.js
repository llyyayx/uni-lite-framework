import config from '/config/index'

/**
 * @desc: app基座注入主机地址
 * @author xujiale
 * @return null
*/
export default function () {
	// #ifdef APP-PLUS || H5
		const injectKeys = config.injectKeys
		if (injectKeys) {
			// #ifdef APP-PLUS
				let infoData = JSON.parse(plus.runtime.arguments)
			// #endif
			// #ifdef H5
				const params = new URLSearchParams(window.location.href.split('?')[1])
				let data = Object.fromEntries(params.entries())
				let infoData = { data }
			// #endif
			if (infoData && infoData.data && infoData.data.host) {
				if (Array.isArray(injectKeys)) {
					injectKeys.forEach(key => {
						config['serve'][key]['host'] = infoData.data.host
					})
				} else if(typeof injectKeys == 'string') {
					config['serve'][injectKeys]['host'] = infoData.data.host
				} else {
					uni.showToast({title: '错误：注入点类型错误!', icon: 'none', duration: 2000})
				}
			} else {
				uni.showToast({title: '错误：代理地址注入失败!', icon: 'none', duration: 2000})
			}
		} else {
			uni.showToast({title: '错误：未设置注入点!', icon: 'none', duration: 2000})
		}
	// #endif
}