import config from '/config/index'
import { openModal, isStream } from '/utils/index'

/**
 * @desc 发起网络请求
 * @author xujiale
 * @param { String } obj.url 请求地址
 * @param { String } obj.data 提交的数据
 * @param { Object } obj.method 请求方式
 * @param { String } obj.serveKey? 服务名称 [默认取配置文件内的]
 * @param { Object } obj.header? http header
 * @param { String } obj.responseType? 响应的数据类型 [text/arraybuffer, 默认text]
 * @param { Boolean } obj.gateway? 是否是移动网关代理访问 [默认false]
 * @returns { Object } 请求结果
*/
export const request = (obj) => {
	const serveKey = obj.serveKey || config.serveKey
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.serve[serveKey]['host'] + config.serve[serveKey]['baseUrl'] + obj.url,
			header: {
				'content-type': 'application/json',
				'Authorization': uni.getStorageSync('userInfo').token,
				...obj.header
			},
			responseType: obj.responseType ? obj.responseType : 'text',
			method: obj.method || 'GET',
			data: obj.data || '',
			success: function (res) {
				const contentType = res['header']['content-type'] || ''
				if (isStream(contentType)) {
					// 流式返回
					resolve(res.data)
				} else {
					/**
					 * tip: 返回结构声明
					 * 正常请求: res.data这后台返回的结构体, 例如可能包含{status,data}
					 * 移动网关: res.data.data这后台返回的结构体, 例如可能包含{status,data}
					 * 为了通用性我们直接返回后台返回结构体，不做深层处理
					*/
					if (res.data.errorCode === '999') {
						reject(res.data)
						openModal('提示', '身份认证过期')
					} else {
						if (obj.gateway) {
							// 处理移动网关请求
							if (config.gatewaySuccessCode.includes(res.data.status) && config.successCode.includes(res.data.data.status)) {
								resolve(res.data.data)
							} else {
								reject(res.data.data)
								openModal('提示', res.data.data.msg || res.data.data.message || res.data.msg || res.data.message)
							}
						} else {
							// 处理普通请求
							if (config.successCode.includes(res.data.status)) {
								resolve(res.data)
							} else {
								reject(res.data)
								openModal('提示', res.data.msg || res.data.message)
							}
						}
					}
				}
			},
			fail: function (e) {
				reject(e)
				openModal('提示', '网络错误，请重试')
			}
		})
	})
}

/**
 * @desc 文件上传
 * @author xujiale
 * @param { String } obj.url 上传文件地址
 * @param { String } obj.filePath 要上传文件资源的路径
 * @param { String } obj.name? 文件对应的key,默认file
 * @param { Object } obj.formData? 额外的数据,默认{}
 * @param { Object } obj.header? http header
 * @returns { Object } 上传结果
*/
export const uploadFile = (obj) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: obj.url,
			header: {
				'Authorization': uni.getStorageSync('userInfo').token,
				...obj.header
			},
			filePath: obj.filePath,
			name: obj.name || 'file',
			formData: obj.formData || {},
			success(res) {
				const contentType = res['header']['content-type'] || ''
				if (isStream(contentType)) {
					// 流式返回
					resolve(res.data)
				} else {
					/**
					 * tip: 返回结构声明
					 * 正常请求: res.data这后台返回的结构体, 例如可能包含{status,data}
					 * 移动网关: res.data.data这后台返回的结构体, 例如可能包含{status,data}
					 * 为了通用性我们直接返回后台返回结构体，不做深层处理
					*/
					if (res.data.errorCode === '999') {
						reject(res.data)
						openModal('提示', '身份认证过期')
					} else {
						if (obj.gateway) {
							// 处理移动网关请求
							if (config.gatewaySuccessCode.includes(res.data.status) && config.successCode.includes(res.data.data.status)) {
								resolve(res.data.data)
							} else {
								reject(res.data.data)
								openModal('提示', res.data.data.msg || res.data.msg)
							}
						} else {
							// 处理普通请求
							if (config.successCode.includes(res.data.status)) {
								resolve(res.data)
							} else {
								reject(res.data)
								openModal('提示', res.data.msg)
							}
						}
					}
				}
			},
			fail(e) {
				reject(e)
				openModal('提示', '网络错误，请重试')
			}
		})
	})
}