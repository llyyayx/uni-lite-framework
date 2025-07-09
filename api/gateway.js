import config from '/config/index'
import { request } from './request'

/**
 * @desc 使用移动中台/移动网关代理请求
 * @author xujiale
 * @param { String } obj.apiId 移动网关operationType
 * @param { String } obj.data 提交的数据
 * @param { String } obj.serveKey? 服务名称 [默认取配置文件内的]
 * @param { Object } obj.header? http header
 * @param { Boolean } obj.oldFormat? 是否采用老版传参 [默认false]
 * @param { String } obj.responseType? 响应的数据类型 [text/arraybuffer, 默认text]
 * @returns { Object } 请求结果
*/
export const gatewayRequest = (obj) => {
	const serveKey = obj.serveKey || config.serveKey
	const oldFormat = obj.oldFormat !== true ? false : true
	return new Promise((resolve, reject) => {
		// 最新移动中台传参格式
		let data = {
			appCode: config.appCode,
			apiId: obj.apiId,
			headers: {
				Authorization: uni.getStorageSync('userInfo').token,
				...obj.header
			},
			requestData: obj.data
		}
		// 兼容老版传参格式
		if (oldFormat) {
			data = {
				body: obj.data,
				apiHeader: [{
					headerKey: 'Authorization',
					value: uni.getStorageSync('userInfo').token
				}],
				apiId: obj.apiId
			}
			if (obj.header && typeof obj.header === 'object') {
				Object.keys(obj.header).forEach(key => {
					data.apiHeader.push({
						headerKey: key,
						value: obj.header[key]
					})
				})
			}
		}
		request({
			serveKey,
			// 移动网关代理api url配置在config->serve.servekey.baseUrl, 所以这里置空就可以
			url: '',
			responseType: obj.responseType,
			data: data,
			method: 'POST',
			gateway: true
		}).then(e => {
			resolve(e)
		}).catch(err => {
			reject(err)
		})
	})
}