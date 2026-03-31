export default {
	props: {
		// index层级
		zIndex: {
			type: [String, Number],
			required: false,
			default: 99,
		},
		// 是否展示全选
		selectAll: {
			type: Boolean,
			required: false,
			default: false
		},
		// 列表卡片的refs
		cardRefs: {
			type: Array,
			required: false,
			default: () => []
		},
	},
}