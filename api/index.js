import config from '/config/index'
// 普通请求
import { request, uploadFile } from '/api/request'
// 移动网关代理请求
import { gatewayRequest } from '/api/gateway'

/**
 * @module 请求驱动
 * @time 2025-04-21
 * @author xujiale
 * @tip 使用前请阅读README.md文档
*/
export default {
	gatewayRequest: {
		/**
		 * @desc 移动网关包装请求参数
		 * @param { Object } task automation/proxy-api/add.js的数据格式
		 * 					@param { String } task.apiId operationType
		 * @param { String } serveKey? 服务名称, 默认取配置文件的(就是使用哪个后台服务地址)
		 * @param { Object } data 请求参数
		 * @param { Object } obj.header? http header
		 * @param { Boolean } obj.oldFormat? 是否采用老版传参 [默认false]
		 * @param { String } obj.responseType? 响应的数据类型[text/arraybuffer, 默认text]
		 */
		pack(obj) {
			const { task, serveKey, data, header, oldFormat, responseType } = obj
			return {
				serveKey: serveKey || config.serveKey,
				apiId: task.apiId,
				data,
				header,
				oldFormat,
				responseType,
			}
		},
		/**
		 * @desc 移动网关请求
		 * @param { Object } params 使用pack方法生成的参数
		 */
		run(params) {
			return gatewayRequest(params)
		}
	},
	request: {
		/**
		 * @desc 包装请求参数
		 * @param { Object } task automation/proxy-api/add.js的数据格式
		 * 					@param { String } task.method 请求类型
		 * 					@param { String } task.apiUrl 接口url 
		 * @param { String } serveKey? 服务名称, 默认取配置文件的(就是使用哪个后台服务地址)
		 * @param { Object } data 请求参数
		 * @param { Object } obj.header? http header
		 * @param { String } obj.responseType? 响应的数据类型[text/arraybuffer, 默认text]
		 */
		pack(obj) {
			const { task, serveKey, data, header, responseType } = obj
			return {
				serveKey: serveKey || config.serveKey,
				url: task.apiUrl,
				method: task.method,
				data,
				header,
				responseType
			}
		},
		/**
		 * @desc 发送请求
		 * @param { Object } params 使用pack方法生成的参数
		 */
		run(params) {
			return request(params)
		}
	},
	uploadFile: {
	   /**
	    * @desc 文件上传包装请求参数
	    * @param { Object } task automation/proxy-api/add.js的数据格式
	    * 					@param { String } task.apiUrl 接口url 
	    * @param { String } serveKey? 服务名称, 默认取配置文件的(就是使用哪个后台服务地址)
	    * @param { String } filePath 要上传文件资源的路径
		* @param { String } name? 文件对应的key,默认file
		* @param { Object } formData? 额外的数据,默认{}
		* @param { Object } obj.header? http header
	    */
		pack(obj) {
			const { task, serveKey, filePath, name, formData, header } = obj
			return {
				serveKey: serveKey || config.serveKey,
				url: task.apiUrl,
				filePath,
				name,
				formData,
				header
			}
		},
		/**
		 * @desc 文件上传
		 * @param { Object } params 使用pack方法生成的参数
		 */
		run(params) {
			return uploadFile(params)
		}
	}
}