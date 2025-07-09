<template>
	<view class="navbar__container" :style="{'--textColor': textColor}">
		<uv-navbar
			:leftText="leftText"
			:title="title"
			:bgColor="bgColor"
			:fixed="fixed"
			:safeAreaInsetTop="true"
			:titleStyle="{
				color: textColor,
				fontSize: titleSize,
			}"
			class="custom__navbar"
		>
			<template v-slot:left>
				<view class="custom__navbar-slot">
					<uv-icon name="arrow-left" size="20" :color="textColor" @click="goBack"></uv-icon>
					<uv-line
						direction="column"
						:hairline="false"
						length="16"
						margin="0 16rpx"
					></uv-line>
					<uv-icon name="home" size="24" :color="textColor" @click="goHome"></uv-icon>
				</view>
			</template>
			<template v-slot:right>
				<slot name="right"></slot>
			</template>
		</uv-navbar>
	</view>
</template>

<script setup>
/* 默认导航栏是否固定在顶部(fixed选项控制)，页面内请预留顶部padding值!!!!!! */
/* 导航栏高度: calc(44px + var(--status-bar-height)) */
/* 推荐在APP.vue的style标签内, 定义全局css变量, 然后页面内使用 */
const props = defineProps({
	// 左边的提示文字
	leftText: {
		type: String,
		require: false,
		default: '返回'
	},
	// 标题
	title: {
		type: String,
		require: false,
		default: ''
	},
	// 标题字号
	titleSize: {
		type: String,
		require: false,
		default: '30rpx'
	},
	// 导航栏背景设置
	bgColor: {
		type: String,
		require: false,
		default: '#337eff'
	},
	// 文本及图标颜色
	textColor: {
		type: String,
		require: false,
		default: '#ffffff'
	},
	// 导航栏是否固定在顶部
	fixed: {
		type: Boolean,
		require: false,
		default: true
	},
	// 首页url
	home: {
		type: String,
		require: false,
		default: '/pages/index/index'
	},
})

const emits = defineEmits(['back', 'home'])
// 返回上一页
const goBack = () => {
	uni.navigateBack()
	emits('back')
}
// 返回首页
const goHome = () => {
	uni.redirectTo({ url: props.home })
	emits('home')
}
</script>

<style lang="scss" scoped>
.navbar__container {
	.custom__navbar-slot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-width: 0.5px;
		border-style: solid;
		border-radius: 200rpx;
		border-color: var(--textColor);
		padding: 6rpx 14rpx;
		opacity: 0.8;
	}
}
</style>