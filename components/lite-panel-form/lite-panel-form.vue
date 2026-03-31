<template>
	<view class="lite__panel__form">
		<lite-form v-bind="formAttr" :labelWidth="maxLabelWidth" ref="liteForm"></lite-form>
		<view class="lite__panel-operation" v-if="operation">
			<lite-button text="重置" :plain="true" right="20rpx" @click="_reset"></lite-button>
			<lite-button text="查询" @click="_search"></lite-button>
		</view>
		<slot name="footer"></slot>
	</view>
</template>

<script>
import props from './props.js'
import fromProps from '../lite-form/props.js'
import liteForm from '../lite-form/lite-form.vue'
import liteButton from '../lite-button/lite-button.vue'
export default {
	name: 'lite-panel-form',
	mixins: [props],
	components: {
		liteForm,
		liteButton,
	},
	computed: {
		formAttr() {
			const keys = Object.keys(fromProps.props)
			const props = {}
			keys.forEach(key => {
				if (this.$props[key] != undefined) {
					props[key] = this.$props[key] 
				}
			})
			return {
				...this.$attrs,
				...props,
				textAlign: 'left',
				mode: 'frame',
				suffixIcon: 'arrow-down'
			}
		}
	},
	data() {
		return {
			// 最大label宽度
			maxLabelWidth: 'auto',
		}
	},
	mounted() {
		this._setMaxLabelWidth()
	},
	methods: {
		// 设置label的最大宽度
		_setMaxLabelWidth() {
			const query = uni.createSelectorQuery().in(this)
			query.selectAll('.uv-form-item__body__left').boundingClientRect(rects => {
				if (rects && rects.length > 0) {
					let max = 0
					rects.forEach(rect => {
						if (rect.width > max) {
							// 额外加值防止高清屏换行
							max = Math.ceil(rect.width) + 2
						}
					})
					this.maxLabelWidth = max + 'px'
				} else {
					console.error(new Error('未找到.key节点'))
				}
			}).exec()
		},
		// 重置
		_reset() {
			this.$refs.liteForm.resetFields()
			this.$emit('reset', this.formData)
		},
		// 查询
		_search() {
			this.$refs.liteForm.submit().then(formData => {
				this.$emit('search', formData)
			})
		},
		// 回显label
		initLabel() {
			this.$refs.liteForm.initLabel()
		},
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__panel__form {
	padding: $lite-margin 0;
	box-sizing: border-box;
	background-color: #FFFFFF;
	font-family: $lite-font-family;
	@include panel-from;
	.lite__panel-operation {
		height: max-content;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: $lite-margin $lite-margin 0;
		box-sizing: border-box;
	}
}
</style>