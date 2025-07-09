/**
 * @module 自动化管理移动中台api
 * @time 2025-04-21
 * @author xujiale
 * @tip 使用前请阅读README.md文档
*/
const fs = require('fs')
const path = require('path')
const config = require('./config')
const { post } = require('./utils')
const addTask = require('./add')
const editTask = require('./edit')
const delTask = require('./del')

// 创建接口地址
const createUrl = '/madp-app/msGw/apiDefine/create'
// 查询创建数据接口地址
const getUrl = '/madp-app/msGw/apiDefine/list-of-app'
// 保存数据接口地址
const saveUrl = '/madp-app/msGw/apiDefine/save'
// 删除数据接口地址
const delUrl = '/madp-app/msGw/apiDefine/delete'

// 执行添加任务
const addTaskLog = []
const executeAddTask = async () => {
	for (let i = 0; i < addTask.length; i++) {
		console.log('add任务当前执行index...:' + i)
		try {
			// 已完添加的跳过, 防止二次调用浪费资源
			if (addTask[i]['done'] == true) { 
				addTaskLog.push({
					apiId: addTask[i]['apiId'],
					apiName: addTask[i]['apiName'],
					msg: '接口已被添加, 如需再次添加请将done标识字段置为false'
				})
				continue
			} 
			// 1、创建接口
			const createJson = await post(config.host, createUrl, JSON.stringify({
				data: {
					data_0: {
						apiId: addTask[i]['apiId'],
						apiName: addTask[i]['apiName'],
						appCode: config.appCode,
						appSid: config.appSid
					},
				}
			}), config.port, config.protocol)
			const createObj = JSON.parse(createJson)
			if (createObj.status != 0) {
				addTaskLog.push({
					apiId: addTask[i]['apiId'],
					apiName: addTask[i]['apiName'],
					msg: createObj.msg + ',添加失败'
				})
				continue
			}
			// 2、查询创建的详细信息
			const resultJson = await post(config.host, getUrl, JSON.stringify({
				data: {
					param_0: {
						apiIdConditionLike: addTask[i]['apiId'],
						appCode: config.appCode,
						appSid: config.appSid,
						pageinfo: {page: 1, start: 0, limit: 10}
					}
				}
			}), config.port, config.protocol)
			const resultObj = JSON.parse(resultJson)
			const result = resultObj.data.data_0.items[0]
			if (!result) {
				addTaskLog.push({
					apiId: addTask[i]['apiId'],
					apiName: addTask[i]['apiName'],
					msg: resultObj.msg + ',创建完成后,查询时遇到问题,添加失败'
				})
				continue
			}
			// 3、配置相关信息
			const setingJson = await post(config.host, saveUrl, JSON.stringify({
				data: {
					data_0: {
						apiId: addTask[i]['apiId'],
						apiName: addTask[i]['apiName'],
						groupId: config.groupId,
						path: addTask[i]['apiUrl'],
						qequestMethod: addTask[i]['method'] ? addTask[i]['method'].toUpperCase() : 'POST',
						requestType: '0',
						coding: 'UTF-8',
						describe: addTask[i]['describe'] ? addTask[i]['describe'] : '',
						sid: result.sid,
						appCode: config.appCode,
						appSid: config.appSid,
					}
				}
			}), config.port, config.protocol)
			const setingObj = JSON.parse(setingJson)
			if (setingObj.status == 1) {
				addTask[i]['done'] = true
				addTaskLog.push({
					apiId: addTask[i]['apiId'],
					apiName: addTask[i]['apiName'],
					msg: '添加成功'
				})
			} else {
				addTaskLog.push({
					apiId: addTask[i]['apiId'],
					apiName: addTask[i]['apiName'],
					msg: setingObj.msg + ',添加失败'
				})
			}
		} catch(e) {
			addTaskLog.push({
				apiId: addTask[i]['apiId'],
				apiName: addTask[i]['apiName'],
				msg: e.message + ',添加失败'
			})
		}
	}
	console.log('添加任务执行完成,日志如下:\r\n')
	console.log(addTaskLog)
	writeFile(addTask, 'add.js')
}

// 执行修改任务
const editTaskLog = []
const executeEditTask = async () => {
	for (let i = 0; i < editTask.length; i++) {
		console.log('edit任务当前执行index...:' + i)
		try {
			// 1、查询api信息
			const resultJson = await post(config.host, getUrl, JSON.stringify({
				data: {
					param_0: {
						apiIdConditionLike: editTask[i]['apiId'],
						appCode: config.appCode,
						appSid: config.appSid,
						pageinfo: {page: 1, start: 0, limit: 10}
					}
				}
			}), config.port, config.protocol)
			const resultObj = JSON.parse(resultJson)
			const result = resultObj.data.data_0.items[0]
			if (!result) {
				editTaskLog.push({
					apiId: editTask[i]['apiId'],
					afterApiName: editTask[i]['afterApiName'],
					msg: resultObj.msg + ',未查询到数据,修改失败'
				})
				continue
			}
			// 2、修改配置相关信息
			const setingJson = await post(config.host, saveUrl, JSON.stringify({
				data: {
					data_0: {
						apiId: editTask[i]['apiId'],
						apiName: editTask[i]['afterApiName'],
						groupId: config.groupId,
						path: editTask[i]['afterApiUrl'],
						qequestMethod: editTask[i]['afterMethod'] ? editTask[i]['afterMethod'].toUpperCase() : 'POST',
						requestType: '0',
						coding: 'UTF-8',
						describe: editTask[i]['afterDescribe'] ? editTask[i]['afterDescribe'] : '',
						sid: result.sid,
						appCode: config.appCode,
						appSid: config.appSid,
					}
				}
			}), config.port, config.protocol)
			const setingObj = JSON.parse(setingJson)
			if (setingObj.status == 1) {
				editTaskLog.push({
					apiId: editTask[i]['apiId'],
					afterApiName: editTask[i]['afterApiName'],
					msg: '修改成功'
				})
			} else {
				editTaskLog.push({
					apiId: editTask[i]['apiId'],
					afterApiName: editTask[i]['afterApiName'],
					msg: setingObj.msg + ',修改失败'
				})
			}
		} catch(e) {
			editTaskLog.push({
				apiId: editTask[i]['apiId'],
				afterApiName: editTask[i]['afterApiName'],
				msg: e.message + ',修改失败'
			})
		}
	}
	console.log('修改任务执行完成,日志如下:\r\n')
	console.log(editTaskLog)
}

// 执行删除任务
const delTaskLog = []
const executeDelTask = async () => {
	for (let i = 0; i < delTask.length; i++) {
		console.log('del任务当前执行index...:' + i)
		try {
			// 1、查询api信息
			const resultJson = await post(config.host, getUrl, JSON.stringify({
				data: {
					param_0: {
						apiIdConditionLike: delTask[i]['apiId'],
						appCode: config.appCode,
						appSid: config.appSid,
						pageinfo: {page: 1, start: 0, limit: 10}
					}
				}
			}), config.port, config.protocol)
			const resultObj = JSON.parse(resultJson)
			const result = resultObj.data.data_0.items[0]
			if (!result) {
				delTaskLog.push({
					apiId: delTask[i]['apiId'],
					msg: resultObj.msg + ',未查询到数据,删除失败'
				})
				continue
			}
			// 2、删除
			const delJson = await post(config.host, delUrl, JSON.stringify({
				data: {
					data_0: {
						sid: result.sid,
						apiId: delTask[i]['apiId'],
						appCode: config.appCode,
						appSid: config.appSid,
					}
				}
			}), config.port, config.protocol)
			const delObj = JSON.parse(delJson)
			if (delObj.status == 1) {
				// 更正add任务的标记状态
				addTask.forEach(item => {
					if (item.apiId == delTask[i]['apiId']) {
						item.done = false
					}
				})
				delTaskLog.push({
					apiId: delTask[i]['apiId'],
					msg: '删除成功'
				})
			} else {
				delTaskLog.push({
					apiId: delTask[i]['apiId'],
					msg: setingObj.msg + ',删除失败'
				})
			}
		} catch(e) {
			delTaskLog.push({
				apiId: delTask[i]['apiId'],
				msg: e.message + ',删除失败'
			})
		}
	}
	console.log('删除任务执行完成,日志如下:\r\n')
	console.log(delTaskLog)
	writeFile(addTask, 'add.js')
}

// 写入任务完成标识 
const writeFile = (dataArray, fileName) => {
	const addPath = path.join(__dirname, fileName)
	fs.readFile(addPath, 'utf8', (err, content) => {
		if (err) throw err
		// 解析数组, 将key的双引号去除, 将value的双引号改成单引号
		let jsonString = JSON.stringify(dataArray, null, 4)
			.replace(/"(\w+)":/g, '$1:') /*移除键名引号*/
			.replace(/"/g, "'")
		// 将多行对象文本合并成一行
		jsonString = jsonString.replace(/({[\s\S]*?})(?=,|\n|$)/g, (match) => {
			return match
				.replace(/\s+/g, ' ') /*合并连续空格*/
				.replace(/{ /g, '{ ') /*左花括号后空格*/
				.replace(/ }/g, ' }') /*右花括号前空格*/
				.replace(/, /g, ', ') /*逗号后空格*/
				.trim()
		})
		// 替换导出部分（正则匹配）
		const newContent = content.replace(/(.*exports.*=.*)(\[.*\])/s, `$1${ jsonString}`)
		// 写入文件
		fs.writeFile(addPath, newContent, err => {
			if (err) throw err
		})
	})
}

// 写入add.mjs用于前端api导入
const createAddMjs = () => {
	const addPath = path.join(__dirname, 'add.mjs')
	// 解析数组, 将key的双引号去除, 将value的双引号改成单引号
	let jsonString = JSON.stringify(addTask, null, 4)
		.replace(/"(\w+)":/g, '$1:') /*移除键名引号*/
		.replace(/"/g, "'")
	// 将多行对象文本合并成一行
	jsonString = jsonString.replace(/({[\s\S]*?})(?=,|\n|$)/g, (match) => {
		return match
			.replace(/\s+/g, ' ') /*合并连续空格*/
			.replace(/{ /g, '{ ') /*左花括号后空格*/
			.replace(/ }/g, ' }') /*右花括号前空格*/
			.replace(/, /g, ', ') /*逗号后空格*/
			.trim()
	})
	// 写入文件
	fs.writeFile(addPath, 'export default ' + jsonString, err => {
		if (err) throw err
	})
	console.log('创建成功')
}

// 取运行参数
const runFunctionName = process.argv[2]

if (runFunctionName == 'executeAddTask') {
	executeAddTask()
} else if (runFunctionName == 'executeEditTask') {
	executeEditTask()
} else if (runFunctionName == 'executeDelTask') {
	executeDelTask()
} else if (runFunctionName == 'createAddMjs') {
	createAddMjs()
} else {
	console.log('没有可执行的方法')
}