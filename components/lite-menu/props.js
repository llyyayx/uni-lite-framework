export default {
	props: {
		// 菜单列表
		menuList: {
			type: Array,
			require: true,
		},
		// 标题
		title: {
			type: String,
			require: false,
			default: 'MES系统'
		},
		// 存放图标的文件夹路径(不加@符号)
		basePath: {
			type: String,
			require: false,
			default: '/static/workbenchIcon/'
		},
		// banner图片路径(不加@符号)
		bannerPath: {
			type: String,
			require: false,
			default: '/static/workbenchIcon/mes_banner.png'
		}
	},
}