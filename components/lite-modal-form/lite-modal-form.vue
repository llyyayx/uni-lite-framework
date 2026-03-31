<template>
	<view class="lite__modal__form">
		<uv-modal
			width="650rpx"
			:title="title"
			:zIndex="zIndex"
			:confirmText="confirmText"
			:cancelText="cancelText"
			:showCancelButton="showCancelButton"
			:asyncClose="true"
			ref="liteModalForm"
			@confirm="_confirm"
			@cancel="_cancel"
		>
			<lite-form v-bind="formAttr" ref="liteForm"></lite-form>
		</uv-modal>
	</view>
</template>

<script>
import props from './props.js'
import fromProps from '../lite-form/props.js'
import liteForm from '../lite-form/lite-form.vue'
export default {
	name: 'lite-modal-form',
	mixins: [props],
	components: {
		liteForm,
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
				labelPosition: 'top',
				textAlign: 'left',
				mode: 'frame'
			}
		}
	},
	data() {
		return {
			// 回调函数
			callback: null
		}
	},
	methods: {
		// 点击确认
		_confirm() {
			this.$refs.liteForm.submit().then(formData => {
				if (this.callback && typeof this.callback === 'function') {
					this.callback(formData)
				}
				this.$refs.liteModalForm.closeLoading()
				this.$refs.liteModalForm.close()
				this.$emit('confirm', formData)
				this.reset()
			}).catch(() => {
				this.$refs.liteModalForm.closeLoading()
			})
		},
		// 点击取消 
		_cancel() {
			this.$emit('cancel')
			this.reset()
		},
		
		// 打开弹出表单
		open(callback = null) {
			this.callback = callback
			this.$refs.liteModalForm.open()
		},
		// 关闭弹出表单
		close() {
			this.$refs.liteModalForm.close()
		},
		// 重置
		reset() {
			this.$refs.liteForm.resetFields()
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

.lite__modal__form {
	background-color: #FFFFFF;
	font-family: $lite-font-family;
	:deep(.uv-modal) {
		.uv-modal__title {
			color: $lite-font-color;
		}
		.uv-modal__content {
			padding: $lite-margin 0 !important;
			.lite__form {
				width: 100%;
			}
		}
		.uv-modal__button-group__wrapper__text {
			color: $lite-font-routine-color !important;
		}
		.uv-modal__button-group__wrapper--confirm {
			.uv-modal__button-group__wrapper__text {
				color: $lite-theme !important;
			}
		}
	}
	@include panel-from;
}
</style>