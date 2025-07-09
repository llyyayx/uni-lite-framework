// 根据自己项目appid,开发版必需配置
/**************应用的appid***************/
const appId = uni.getSystemInfoSync().appId;
 /**************应用的appcode***************/
import config from '@/config/index.js'
const APPCODE = appId;
const token = uni.getStorageSync('userInfo').token;
/***************************************/
// 热更新请求地址
const appUpdateUrl = config.updateUrl;

// const appUpdateUrl = "http://10.3.182.6"
class EsayInfo {
	constructor() {
		this.num = 0
		this.appCode = 'MPLAT'
		this.id = "99u8239"
		this.data = {
			// appCode:'MPLAT'
		}
	}
	add(val,type) {
		if( type ){
			if( type && type == "list" ){
				this.data['data_'+this.num] = val
				this.num++;
			}
			if( type && type == "obj" ){
				this.data['data_'+this.num] = val
				this.num++;
			}
		}else{
			this.data['param_'+this.num] = val
			this.num++;
		}
	}
}
// 设备信息
const platform = uni.getSystemInfoSync().platform;
// 热更新请求
import $http from '@/utils/sgAppUpdate/js_sdk/http.js';
export default {
	// 弹窗主颜色
	appUpdateColor: "457CE9",
	// 弹窗图标（不填显示默认图标，链接配置示例如： '/static/scaffold/demo/ic_attention.png'）
	appUpdateIcon: '',
	// 热更新地址
	appUpdateUrl:appUpdateUrl,
	// 发起ajax请求获取服务端版本号
	getServerNo: (version, isPrompt = false, callback) => {
		let httpData = {
			version: version.versionCode,
			// 版本名称
			versionName: version.versionName,
			// setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
			setupPage: isPrompt,
			appId:APPCODE
			// appId:process.env.NODE_ENV == 'development' ? appId : plus.runtime.appid
		};
		if (platform == "android") {
			httpData.type = 1101;
			httpData.osType = 'Android';
		} else {
			httpData.type = 1102;
			httpData.osType = 'IOS'
		}
		/* 接口入参说明
		 * version: 应用当前版本号（已自动获取）
		 * versionName: 应用当前版本名称（已自动获取）
		 * type：平台（1101是安卓，1102是IOS）
		 */
		/****************以下是示例*******************/
		// 可以用自己项目的请求方法（接口自己找后台要，插件不提供）
		try {
			$http.request({
				url: `/iiot-lims-app/app/release-management-app/findUniVersion`,
				data: {
					appId: APPCODE,
					osType: httpData.osType
				}
				// url:`/msMgt/ReleaseOffline/offlineUpdate?appcode=${APPCODE}&osType=${httpData.osType}`
				// url: `/madp-app/madp/noAuthority/findAppReleaseUpdate?appId=${httpData.appId}&osType=${httpData.osType}`,
			}).then(res => {
				if( res && res.data && res.data['data_0'] && res.data['data_0']['sid']){
					let info = res.data['data_0'];
					if( info.releaseVersion == version.versionName ){
						if (isPrompt) {
							uni.showToast({
								title: "已经是最新版本~",
								icon: "none"
							});
						}
						return;
					}
					let suffix = 'apk'
					if (/.*\.wgt/.test(info.packagesPath)) {
						suffix = 'wgt'
					}
					let obj = {
						versionCode:info.releaseVersion,
						versionName:info.appVersion,
						versionInfo:info.invalidReason,
						// 提示更新
						updateType:'solicit',
						downloadUrl:appUpdateUrl + "/iiot-lims-app/iiot/download/filepath?filePath="+encodeURIComponent(info.packagesPath)+'&Authorization='+token+'&fileName='+info.appId+'.'+suffix
					}
					if (info.packagesPath.indexOf('.ipa') != -1) {
						obj.downloadUrl = appUpdateUrl+"/h5/?appId=" + httpData.appId
					}
					if (info.releaseType == 1) {
						// 强制更新
						obj.updateType = 'forcibly'
					}
					if (res && res.status == 0) {
						// 兼容之前的版本（updateType是新版才有的参数）
						callback && callback(obj);
					} else if (isPrompt) {
						uni.showToast({
							title: "暂无新版本",
							icon: "none"
						});
					}
				}else{
					console.log("异常，或者没有发布版本");
				}
			})
		} catch (e) {
			console.log(e);
		}
	},
}
