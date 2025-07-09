'use strict'
import config from './componentConfig.js'
export default {
	request(reqParams) {
		return new Promise((resolve, reject) => {
			let	userInfo = uni.getStorageSync('userInfo')
			uni.request({
				url:config.appUpdateUrl + reqParams.url,
				data:reqParams.data,
				dataType:'json',
				// 正式token
				header:{
					Authorization: userInfo.token,
				},
				method: "POST",
				success: (res) => {
					if( res.statusCode == 200 ){
						resolve(res.data)
						return;
					}
				},
				fail: (res) => {
					console.log('错误',res)
					reject(res);
				},
				complete: (res) => {
					console.log("未找到当前应用",res);
				},
			})
		})
	}
}
