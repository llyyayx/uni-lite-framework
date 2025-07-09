/**
 * @desc 获取格式化后的当前时间
 * @param { String } format 格式，默认'YYYY-MM-DD hh:mm:ss'
 * @returns { String } 格式化后的时间字符串
 */
export const getCurrentTime = (format = 'YYYY-MM-DD hh:mm:ss') => {
	const date = new Date()
	return formatDate(date, format)
}

/**
 * @desc 获取前后N天的日期
 * @param { Number } n 天数（正数后N天，负数前N天）
 * @param { String } format 返回格式
 * @returns { String } 格式化后的日期
 */
export const getOffsetDate = (n = 0, format = 'YYYY-MM-DD') => {
	const date = new Date()
	date.setDate(date.getDate() + n)
	return formatDate(date, format)
}

/**
 * @desc 日期格式化函数
 * @param { Date|String } date 日期对象或可解析的日期字符串
 * @param { String } format 格式字符串
 * @returns { String } 格式化后的日期
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
	if (!(date instanceof Date)) {
		date = new Date(date)
	}
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	return format
	.replace('YYYY', year)
	.replace('MM', month)
	.replace('DD', day)
	.replace('hh', hours)
	.replace('mm', minutes)
	.replace('ss', seconds)
}

/**
 * @desc 计算两个日期之间的天数差
 * @param { String|Date } date1 起始日期
 * @param { String|Date } date2 结束日期
 * @returns { Number } 天数差
 */
export const getDaysDiff = (date1, date2) => {
	const d1 = new Date(date1).getTime()
	const d2 = new Date(date2).getTime()
	return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

/**
 * @desc 判断是否为闰年
 * @param { Number } year 年份
 * @returns { Boolean }
 */
export const isLeapYear = (year) => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * @desc 获取当月第一天
 * @param { String } format 返回格式
 * @returns { String }
 */
export const getFirstDayOfMonth = (format = 'YYYY-MM-DD') => {
	const date = new Date()
	date.setDate(1)
	return formatDate(date, format)
}

/**
 * @desc 获取当月最后一天
 * @param { String } format 返回格式
 * @returns { String }
 */
export const getLastDayOfMonth = (format = 'YYYY-MM-DD') => {
	const date = new Date()
	date.setMonth(date.getMonth() + 1)
	date.setDate(0)
	return formatDate(date, format)
}

/**
 * @desc 时间戳转日期
 * @param { Number } timestamp - 时间戳（秒或毫秒）
 * @param { String } format - 格式
 * @returns { String }
 */
export const timestampToDate = (timestamp, format = 'YYYY-MM-DD hh:mm:ss') => {
	// 处理秒级时间戳
	if (timestamp.toString().length === 10) {
		timestamp *= 1000
	}
	return formatDate(new Date(timestamp), format)
}

/**
 * @desc 跳转到内页(保留当前页面)
 * @param { String } url 页面地址
 * @returns null
*/
export const jumpTo = (url) => {
	uni.navigateTo({ url })
}

/**
 * @desc 跳转页面(关闭当前页面)
 * @param { String } url 页面地址
 * @returns null
*/
export const redirectTo = (url) => {
	uni.redirectTo({ url })
}

/**
 * @desc 信息提示
 * @param { String } title 标题
 * @param { String } content 内容
*/
export const openModal = (title, content) => {
	uni.showModal({ title, content, showCancel: false })
}

/**
 * @desc: 消息提示框
 * @param { String } content 提示的内容
 * @param { Boolean } cancel 是否显示取消按钮
 * @param { Function } success 确认回调函数
 * @param { Function } fail 取消回调函数
*/
export const showTips = (content, cancel = true, success, fail) => {
    uni.showModal({
		title: '提示',
		content: content || '',
		showCancel: cancel,
		success: (res) => {
			if (res.confirm) {
				success && success()
			} else if (res.cancel) {
				fail && fail()
			}
		}
    })
}

// 判断是否是流返回
export const isStream = (contentType) => {
	return 	contentType.includes('image/png') || 
			contentType.includes('image/jpeg') || 
			contentType.includes('image/jpg') || 
			contentType.includes('image/webp') || 
			contentType.includes('image/gif') || 
			contentType.includes('image/tiff') || 
			contentType.includes('stream')
}

/**
 * @desc 防抖函数
 * @param { Function } func - 需要防抖的函数
 * @param { Number } delay - 延迟时间（毫秒）
 * @param { Boolean } immediate - 是否立即执行
 * @returns { Function } 包装后的防抖函数
 */
export const debounce = (func, delay = 300, immediate = false) => {
	let timer = null
	const debounced = function(...args) {
		const context = this
		if (timer) clearTimeout(timer)
		if (immediate && !timer) {
			func.apply(context, args)
		}
		timer = setTimeout(() => {
			timer = null
			if (!immediate) {
				func.apply(context, args)
			}
		}, delay)
	}
	// 添加取消方法
	debounced.cancel = () => {
		clearTimeout(timer)
		timer = null
	}
	return debounced
}

/**
 * @desc 节流函数（时间戳 + 定时器混合版）
 * @param { Function } func - 需要节流的函数
 * @param { Number } wait - 间隔时间（毫秒）
 * @param { Boolean } trailing - 是否在最后额外触发一次
 * @returns { Function } 包装后的节流函数
 */
export const throttle = (func, wait = 300, trailing = true) => {
	let previous = 0
	let timer = null
	const throttled = function(...args) {
		const context = this
		const now = Date.now()
		const remaining = wait - (now - previous)
		if (remaining <= 0) {
			if (timer) {
				clearTimeout(timer)
				timer = null
			}
			func.apply(context, args)
			previous = now
		} else if (!timer && trailing) {
			timer = setTimeout(() => {
				func.apply(context, args)
				previous = Date.now()
				timer = null
			}, remaining)
		}
	}
	// 添加取消方法
	throttled.cancel = () => {
		clearTimeout(timer)
		timer = null
		previous = 0
	}
	return throttled
}

/**
 * @desc 获取请求任务数组中的指定项
 * @param { Array } task - 间隔时间（毫秒）
 * @param { String } apiId - apiId
 * @returns { Object } taskItem
 */
export const findTask = (task, apiId) => {
	return task.find(item => item.apiId === apiId)
}

/**
 * @desc 获取当前api模块的全部api任务
 * @param { Array } allTask - /automation/proxy-api/add.mjs中的全部api任务列表
 * @param { Array } apiIds - 当前模块包含的apiId集合
 * @returns { Array } 当前只属于模块的api任务列表
 */
export const getModuleTask = (allTask, apiIds) => {
	return allTask.filter(item => apiIds.includes(item.apiId))
}