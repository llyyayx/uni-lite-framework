<template>
	<movable-area class="scan__container">
		<!-- 扫码悬浮框 -->
		<movable-view class="suspend__box" direction="all" x="370" y="400">
			<slot></slot>
			<view class="icon">
				<image src="./icon/scan.png" mode="widthFix" @click="scanCode"></image>
			</view>
		</movable-view>
	</movable-area>
</template>

<script>
	export default {
		name:"scan-area",
		data() {
			return {
				
			};
		},
		methods: {
			scanCode() {
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['barCode', 'qrCode'],
					success: (e) => {
						// 请与手持激光扫码枪返回的格式保持一致
						this.$emit('scan', { data: e.result })
					},
					fail: (err) => {
						uni.showToast({ title: '未识别', icon: 'none' })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.scan__container {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 9;
	display: flex;
	flex-direction: column;
	padding: 16rpx;
	box-sizing: border-box;
	pointer-events: none;
	.suspend__box {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
		background-color: #337EFE;
		box-shadow: 0 0 23rpx 6rpx rgba(90,143,254,.46);
		position: fixed;
		z-index: 99;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: all;
		.icon {
			width: 40rpx;
			height: max-content;
			line-height: 0;
			box-sizing: content-box;
			image {
				width: 100%;
				height: auto;
			}
		}
	}
}
</style>