import fromProps from '../lite-form/props.js'
export default {
	props: {
		...fromProps.props,
		zIndex: {
			type: [String, Number],
			required: false,
			default: 9999999,
		},
	},
}