import fromProps from '../lite-form/props.js'
export default {
	props: {
		...fromProps.props,
		// 标题名称
		title: {
			type: String,
			required: false,
			default: '请录入信息',
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			required: false,
			default: '确认'
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			required: false,
			default: '取消'
		},
		// 是否显示取消按钮
		showCancelButton: {
			type: Boolean,
			required: false,
			default: true
		},
		// index层级
		zIndex: {
			type: [String, Number],
			required: false,
			default: 100,
		},
	}
}