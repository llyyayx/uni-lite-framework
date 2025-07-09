// 导入获取指定api任务的工具函数
import { getModuleTask, findTask } from '/utils/index'
// 导入自动化添加的api任务列表(add完一定记得npm run gateway:create生成)
import allTask from '/automation/proxy-api/add.mjs'
// 导入配置信息
import config from '/config/index'
// 导入请求发送的驱动对象
import reqDrive from '/api/index'

// 获取请求驱动
const publicRequest = reqDrive[config.reqDrive]

// 当前模块的api任务列表
// 方式一: 从自动化添加处获取(推荐)
const task = getModuleTask(allTask, ['lwlims.mat.add'])

// 方式二: 直接定义，格式遵循/automation/proxy-api/add.js
// const task = [
// 	{ apiId: 'lwlims.mat.add', apiName: '物料添加接口', method: 'post', apiUrl: '/mat/add' }
// ]

export default {
	// 示例: 使用默认serveKey
	findMenu(data) {
		return publicRequest.run(publicRequest.pack({
			task: findTask(task, 'lwlims.mat.add'),
			data: data
		}))
	},
	// 示例: 使用其他serveKey
	findMenu2(data) {
		return publicRequest.run(publicRequest.pack({
			task: findTask(task, 'lwlims.mat.add'),
			serveKey: 'madpDev',
			data: data
		}))
	}
}