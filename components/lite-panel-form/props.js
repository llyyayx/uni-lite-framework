import fromProps from '../lite-form/props.js'
export default {
	props: {
		...fromProps.props,
		// 是否展示操作按钮
		operation: {
			type: Boolean,
			required: false,
			default: true
		},
	},
}