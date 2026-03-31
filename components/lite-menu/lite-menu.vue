<template>
	<view class="lite__menu">
		<lite-navbar :title="title" :autoBack="false" @left="_backApp"></lite-navbar>
		<view class="main__box">
			<view class="main__box-banner">
				<image :src="bannerPath" mode="widthFix"></image>
			</view>
			<view class="main__box-block" v-for="item in menuList" :key="item.resId">
				<view class="block__title">{{ item.resName }}</view>
				<view class="block__menu">
					<view class="block__menu-item" v-for="menu in item.items" @click="_toPage(menu)">
						<image :src="_getIconUrl(menu.iconCls)" mode="widthFix"></image>
						<view class="item__name">{{ menu.resName }}</view>
					</view>
				</view>
			</view>
		</view>
		<uv-safe-bottom></uv-safe-bottom>
	</view>
</template>

<script>
import props from './props.js'
import liteNavbar from '../lite-navbar/lite-navbar.vue'
export default {
	name: 'lite-menu',
	mixins: [props],
	components: {
		liteNavbar,
	},
	data() {
		return {}
	},
	methods: {
		// 获取菜单图标
		_getIconUrl(name) {
			let path = ''
			if (name) {
				path = this.basePath + name
			}
			return path
		},
		// 点击菜单按钮-跳转页面
		_toPage(item) {
			this.$emit('toPage', item)
		},
		// 返回主应用
		_backApp() {
			// #ifdef APP-PLUS
				uni.sendNativeEvent('clickGoBack', {
					msg: 'clickGoBack'
				})
			// #endif
		},
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__menu {
	height: 100%;
	background-color: #f3f4f6;
	font-family: $lite-font-family;
	.main__box {
		padding: 20rpx 30rpx 30rpx;
		box-sizing: border-box;
		.main__box-banner {
			width: 100%;
			image {
				display: block;
				width: 100%;
			}
		}
		.main__box-block {
			margin-top: 20rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
			padding: 24rpx 30rpx;
			box-sizing: border-box;
			.block__title {
				font-size: 30rpx;
				line-height: 34rpx;
				margin-bottom: 24rpx;
				color: #273142;
				font-weight: 600;
			}
			.block__menu {
				display: grid;
				grid-template-columns: repeat(4, 108rpx);
				grid-auto-rows: auto;
				grid-row-gap: 30rpx;
				justify-content: space-between;
				.block__menu-item {
					image {
						display: block;
						width: 40px;
						height: 40px;
						object-fit: cover;
						margin: 0 auto;
					} 
					.item__name {
						line-height: 30rpx;
						margin-top: 20rpx;
						font-size: 26rpx;
						text-align: center;
						color: #333333;
						font-weight: 400;
					}
				}
			}
		}
	}
}
</style>