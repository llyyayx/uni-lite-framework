export default {
	props: {
		// 左边的提示文字
		leftText: {
			type: String,
			require: false,
			default: ''
		},
		// 标题
		title: {
			type: String,
			require: false,
			default: ''
		},
		// 标题字号
		titleSize: {
			type: String,
			require: false,
			default: '36rpx'
		},
		// 导航栏背景设置
		bgColor: {
			type: String,
			require: false,
			default: '#1890FF'
		},
		// 文本及图标颜色
		textColor: {
			type: String,
			require: false,
			default: '#FFFFFF'
		},
		// 导航栏是否固定在顶部
		fixed: {
			type: Boolean,
			require: false,
			default: true
		},
		// index层级
		zIndex: {
			type: [String, Number],
			required: false,
			default: 99999,
		},
		// 搜索弹出ref
		searchRef: {
			type: Object,
			required: false,
			default: () => {}
		},
		// 显示右侧搜索按钮
		showSearch: {
			type: Boolean,
			required: false,
			default: false
		},
		// 是否自动返回上一页
		autoBack: {
			type: Boolean,
			required: false,
			default: true
		},
	},
}