<script>
import config from './config/index'
import { injectUserInfo, mockUserInfo } from './utils/userInfo'
import injectProxyHost from './utils/injectProxyHost'
// #ifdef APP
import APPUpdate from './utils/sgAppUpdate/js_sdk/appUpdate'
// #endif
export default {
	// 应用初始化完成
	onLaunch: function() {
		// [HBuilderX中, 点击"运行"编译出来的代码是开发环境, 点击"发行"编译出来的代码是生产环境]
		if (process.env.NODE_ENV == 'development') {
			// 开发环境-设置用户身份信息
			if (config.devUserInfo == 'mock') {
				mockUserInfo()
			} else {
				injectUserInfo()
			}
			// 开发环境-app基座注入主机地址
			if (config.devInjectHost) {
				injectProxyHost()
			}
		}
		if (process.env.NODE_ENV == 'production') {
			// 生产环境-设置用户身份信息
			injectUserInfo()
			// 生产环境-app基座注入主机地址
			if (config.injectHost) {
				injectProxyHost()
			}
			// 应用检测更新
			// #ifdef APP
				if (config.openUpdate) {
					APPUpdate()
				}
			// #endif
		}
		// app应用级事件 [该文件中全局注册, 防止在页面中, 可能的多次注册]
		if (config.appScanCode) {
			// #ifdef APP
				uni.sendNativeEvent('scanInput')
			// #endif
		}
		if (config.appReadNfc) {
			// #ifdef APP
				uni.sendNativeEvent('nfc', {flag: 1})
			// #endif
		}
		uni.onNativeEventReceive((event, data) => {
			// 页面生命周期内使用: uni.$on('scanInputResult', () => {})
			if (event == 'scanInputResult') {
				uni.$emit('scanInputResult', data)
			}
			if (event == 'nfcData') {
				uni.$emit('nfcData', data)
			}
		})
	},
	// 启动或从后台进入前台显示
	onShow: function() {},
	// 从前台进入后台
	onHide: function() {}
}
</script>

<style lang="scss">
/*每个页面公共css */
</style>