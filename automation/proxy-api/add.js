/**
 * @desc 移动中台-移动网关/api自动化添加
 * @author xujiale
 * @time 2025-04-21
 * @param { String } apiId operationType
 * @param { String } apiName 接口名称
 * @param { String } method 请求类型
 * @param { String } apiUrl 接口url
 * @param { String } describe? 接口描述-选填
 * @param { Boolean } done? 是否添加完成-选填
 * @tip apiId已存在的会默认跳过,无需担心二次执行重复添加的问题
 */
module.exports = [
	// 示例: { apiId: 'lwlims.mat.add', apiName: '物料添加接口', method: 'post', apiUrl: '/mat/add' }
]