export default {
	props: {
		title: {
			type: String,
			required: false,
			default: '目标垛位信息',
		},
		items: {
			// [{ label, value, unit }]
			type: Array,
			required: false,
			default: () => [],
		}
	},
}