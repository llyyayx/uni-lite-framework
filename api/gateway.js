import config from '/config/index'
import { request, uploadFile } from './request'

/**
 * @desc 使用移动中台/移动网关代理请求
 * @author xujiale
 * @param { String } obj.apiId 移动网关operationType
 * @param { String } obj.data 提交的数据
 * @param { String } obj.serveKey? 服务名称 [默认取配置文件内的]
 * @param { Object } obj.header? http header
 * @param { Boolean } obj.oldFormat? 是否采用老版传参 [默认false]
 * @param { String } obj.responseType? 响应的数据类型 [text/arraybuffer, 默认text]
 * @param { Boolean } obj.formData? 是否代理传输formData格式参数 [默认false, oldFormat为true时生效]
 * @returns { Object } 请求结果
*/
export const gatewayRequest = (obj) => {
	const serveKey = obj.serveKey || config.serveKey
	const oldFormat = obj.oldFormat !== true ? false : true
	obj.formData = obj.formData == undefined ? false : obj.formData
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
				appCode: config.appCode,
				apiId: obj.apiId,
				apiHeader: [{
					headerKey: 'Authorization',
					value: uni.getStorageSync('userInfo').token
				}],
				body: obj.data
			}
			if (obj.header && typeof obj.header === 'object') {
				Object.keys(obj.header).forEach(key => {
					data.apiHeader.push({
						headerKey: key,
						value: obj.header[key]
					})
				})
			}
			if (obj.formData) {
				data.contentType = 1
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

/**
 * @desc 使用移动中台/移动网关代理上传文件
 * @author xujiale
 * @param { String } obj.filePath 要上传文件资源的路径
 * @param { String } obj.apiId 移动网关operationType
 * @param { String } obj.name? 文件对应的key,默认file
 * @param { String } obj.data? formData里额外的数据,默认{}
 * @param { String } obj.serveKey? 服务名称 [默认取配置文件内的]
 * @param { Object } obj.header? http header
 * @returns { Object } 请求结果
*/
export const gatewayUploadFile = (obj) => {
	const serveKey = obj.serveKey || config.serveKey
	// 组装移动中台上传所需的参数格式
	const params = JSON.stringify({
		appCode: config.appCode,
		apiId: obj.apiId,
		headers: {
			Authorization: uni.getStorageSync('userInfo').token,
			...obj.header
		},
		body: obj.data || {}
	})
	return new Promise((resolve, reject) => {
		uploadFile({
			serveKey,
			// 移动网关代理api url配置在config->serve.servekey.upLoadBaseUrl, 所以这里置空就可以
			url: '',
			filePath: obj.filePath,
			name: obj.name || 'file',
			formData: { params },
			gateway: true
		}).then(e => {
			resolve(e)
		}).catch(err => {
			reject(err)
		})
	})
}