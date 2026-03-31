export default {
	props: {
		// 按钮文字
		text: {
			type: String,
			required: true,
		},
		// 颜色类型[primary、success、info、warning、error]
		type: {
			type: String,
			required: false,
			default: 'primary'
		},
		// 是否镂空
		plain: {
			type: Boolean,
			required: false,
			default: false
		},
		// 自定义的按钮颜色
		bgColor: {
			type: String,
			required: false
		},
		// 按钮宽度
		width: {
			type: String,
			required: false,
			default: '150rpx'
		},
		// 按钮高度
		height: {
			type: String,
			required: false,
			default: '64rpx'
		},
		// 按钮左边距
		left: {
			type: String,
			required: false,
			default: '0rpx'
		},
		// 按钮右边距
		right: {
			type: String,
			required: false,
			default: '16rpx'
		},
	},
}