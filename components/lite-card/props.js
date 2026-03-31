export default {
	props: {
		// 卡片数据
		cardData: {
			type: Object,
			required: true
		},
		// 字段列表
		fieldList: {
			type: Array,
			required: true
		},
		// 卡片标题名称
		titleLabel: {
			type: String,
			required: false,
			default: 'id'
		},
		// 卡片标题对应的key
		titleKey: {
			type: String,
			required: false,
			default: 'sid'
		},
		// 卡片标题是否显示
		showTitle: {
			type: Boolean,
			required: false,
			default: true
		},
		// 卡片宽度
		width: {
			type: String,
			required: false,
			default: '690rpx'
		},
		// 卡片下边距
		bottom: {
			type: String,
			required: false,
			default: '30rpx'
		},
		// 是否可勾选
		checkbox: {
			type: Boolean,
			required: false,
			default: false
		},
		// 状态标签背景颜色
		statusBgColor: {
			type: String,
			required: false,
			default: '#FFF2EA'
		},
		// 状态标签文字颜色
		statusColor: {
			type: String,
			required: false,
			default: '#FA6400'
		},
		// 是否展示跳转操作栏
		jump: {
			type: Boolean,
			required: false,
			default: false
		},
		// 跳转栏左侧label
		jumpLabel: {
			type: String,
			required: false,
			default: '内容详情'
		},
		// 跳转栏按钮名称
		jumpBtnName: {
			type: String,
			required: false,
			default: '查看'
		},
		// 默认勾选状态
		defaultChecked: {
			type: Boolean,
			required: false,
			default: false
		},
		// 卡片高亮
		highlight: {
			type: Boolean,
			required: false,
			default: false
		},
		// 高亮的背景色
		hgBgColor: {
			type: String,
			required: false,
			default: '#FFF8EA'
		},
		// 高亮的边框色
		hgBorderColor: {
			type: String,
			required: false,
			default: '#F7B500'
		}
	},
}