<template>
	<uv-popup 
		ref="searchShow"
		:safeAreaInsetBottom="true"
		mode="right"
		:duration="duration"
		:zIndex="zIndex"
		:class="[!effect && 'effect-popup']"
		@change="_changeEffect"
		@maskClick="_maskClick"
	>
		<view class="lite__search">
			<view class="lite__search-back" @click="close">
				<view class="back__icon">
					<image src="./image/back.png"></image>
				</view>
				<view class="back__name">返回</view>
			</view>
			<view class="lite__search-title">
				<view class="title__icon">
					<image src="./image/search.png"></image>
				</view>
				<view class="title__name">搜索条件</view>
			</view>
			<view class="lite__search-form">
				<lite-form v-bind="formAttr" ref="liteForm"></lite-form>
			</view>
			<view class="lite__search-operation">
				<lite-button text="重置" :plain="true" right="20rpx" @click="_reset"></lite-button>
				<lite-button text="查询" @click="_search"></lite-button>
			</view>
		</view>
	</uv-popup>
</template>

<script>
import props from './props.js'
import fromProps from '../lite-form/props.js'
import liteForm from '../lite-form/lite-form.vue'
import liteButton from '../lite-button/lite-button.vue'
export default {
	name: 'lite-search',
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
				labelPosition: 'top',
				textAlign: 'left',
				mode: 'frame'
			}
		}
	},
	data() {
		return {
			// 控制开启对表单弹出选择的影响(true影响false不影响)
			effect: true,
			// 动画时长
			duration: 300,
		}
	},
	methods: {
		// 开启或关闭popup影响弹出的要素
		_changeEffect(e) {
			if (e.show) {
				// 此时弹出打开
				setTimeout(() => {
					// 关闭影响
					this.effect = false
				}, parseInt(this.duration) + 200)
			} else {
				// 立即开启影响
				this.effect = true
			}
		},
		// 点击遮罩
		_maskClick() {
			// 立即开启影响
			this.effect = true
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
				this.close()
			})
		},
		
		// 打开弹框
		open() {
			this.$refs.searchShow.open()
		},
		// 关闭弹框
		close() {
			this.$refs.searchShow.close()
		},
		// 回显label
		initLabel() {
			if (this.$refs.liteForm) {
				this.$refs.liteForm.initLabel()
			}
		},
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__search {
	width: 85vw;
	height: 100%;
	display: flex;
	flex-direction: column;
	font-family: $lite-font-family;
	font-size: $lite-font-size;
	overflow: hidden;
	.lite__search-back {
		flex-shrink: 0;
		padding-left: $lite-margin;
		padding-top: 44px;
		padding-bottom: 24rpx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid $lite-border-color;
		.back__icon {
			width: 32rpx;
			height: 32rpx;
			image {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
		.back__name {
			height: 44rpx;
			line-height: 44rpx;
			margin-left: 10rpx;
			color: $lite-theme;
		}
	}
	.lite__search-title {
		flex-shrink: 0;
		padding-top: 22rpx;
		padding-left: $lite-margin;
		padding-right: $lite-margin;
		display: flex;
		align-items: center;
		.title__icon {
			width: 32rpx;
			height: 32rpx;
			image {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
		.title__name {
			height: 44rpx;
			line-height: 44rpx;
			margin-left: 4rpx;
			color: $lite-theme;
			color: #9CB2CD;
		}
	}
	.lite__search-form {
		margin-top: 24rpx;
		padding-bottom: 24rpx;
		flex-shrink: 1;
		flex-grow: 1;
		overflow: auto;
		overflow-x: hidden;
		box-sizing: border-box;
		&::-webkit-scrollbar {
			width: 0px;
		}
		:deep(.uv-form) {
			.uv-form-item {
				.uv-form-item__body {
					.uv-form-item__body__left {
						.uv-form-item__body__left__content__label {
							font-size: 30rpx;
							color: #545A60;
							font-weight: normal;
						}
					}
					.uv-form-item__body__right {
						.uv-input {
							.uv-input__content__field-wrapper__field {
								font-size: 30rpx !important;
							}
							.uv-input__content {
								height: 46rpx;
								line-height: 46rpx;
							}
						}
					}
				}
			}
		}
	}
	.lite__search-operation {
		flex-shrink: 0;
		height: max-content;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 28rpx $lite-margin 88rpx;
		border-top: 1px solid $lite-border-color;
		box-sizing: border-box;
	}
}
.effect-popup {
	>:nth-child(1) {
		>:nth-child(2) {
			transform: none !important;
		}
	}
}
</style>