export default {
	props: {
		// 表单数据
		formData: {
			type: Object,
			required: true
		},
		// 表单项
		formItem: {
			type: Array,
			required: true
		},
		 // 规则
		rules: {
			type: Object,
			required: false,
			default: () => ({})
		},
		// label文件位置[left、top]
		labelPosition: {
			type: String,
			required: false,
			default: 'left'
		},
		// 录入对齐方式[left、right]
		textAlign: {
			type: String,
			required: false,
			default: 'right'
		},
		// 录入展示形式[line、frame]
		mode: {
			type: String,
			required: false,
			default: 'line'
		},
		// 后置图标
		suffixIcon: {
			type: String,
			required: false,
			default: ''
		},
		// label宽度 
		labelWidth: {
			type: String,
			required: false,
			default: ''
		},
	},
}