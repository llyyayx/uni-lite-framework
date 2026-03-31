<template>
	<view class="lite__navbar">
		<uv-navbar
			:leftText="leftText"
			:title="title"
			:bgColor="bgColor"
			:fixed="fixed"
			:autoBack="autoBack"
			:safeAreaInsetTop="true"
			:titleStyle="{
				color: textColor,
				fontSize: titleSize,
			}"
			leftIconColor="#FFFFFF"
			leftIconSize="36rpx"
			:style="{ '--zIndex': zIndex }"
			class="custom__navbar"
			@leftClick="_leftClick"
		>
			<template v-slot:right>
				<view class="right__icon" @click="_openSearch" v-if="showSearch">
					<image src="./image/search.png"></image>
				</view>
				<slot name="right"></slot>
			</template>
		</uv-navbar>
	</view>
</template>

<script>
import props from './props.js'
export default {
	name: 'lite-navbar',
	mixins: [props],
	data() {
		return {}
	},
	methods: {
		// 点击左侧返回按钮
		_leftClick() {
			if (!this.autoBack) {
				this.$emit('left')
			}
		},
		// 打开搜索框
		_openSearch() {
			const searchRef = this.searchRef && (this.searchRef.value || this.searchRef)
			if (searchRef && searchRef.open) {
				searchRef.open()
			}
			this.$emit('right')
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__navbar {
	font-family: $lite-font-family;
	.custom__navbar {
		height: calc(44px + var(--status-bar-height));
		:deep(.uv-navbar--fixed) {
			z-index: var(--zIndex);
		}
		:deep(.uv-navbar__content__left) {
			padding-left: 30rpx;
		}
		:deep(.uv-navbar__content__right) {
			padding-right: 30rpx;
		}
	}
	.right__icon {
		width: 36rpx;
		height: 36rpx;
		image {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}
}
</style>