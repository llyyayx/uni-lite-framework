<template>
	<view class="lite__slot__info">
		<view class="info__title">{{ title }}</view>
		<view class="info__box">
			<view class="info__box-item" v-for="(item, index) in items" :key="index">
				<view class="item__label">{{ item.label || '--' }}</view>
				<view class="item__value">{{ item.value || 0 }}</view>
				<view class="item__unit" v-if="item.unit">{{ item.unit }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import props from './props.js'
export default {
	name: 'lite-slot-info',
	mixins: [props],
	data() {
		return {
			
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__slot__info {
	margin: $lite-margin;
	padding: $lite-margin;
	font-family: $lite-font-family;
	font-size: $lite-font-size;
	background-color: #FFFFFF;
	border-radius: $lite-border-radius;
	.info__title {
		margin-bottom: $lite-margin;
		font-size: 32rpx;
		color: $lite-font-color;
		font-weight: 600;
	}
	.info__box {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-auto-rows: max-content;
		grid-gap: $lite-margin;
		.info__box-item {
			display: grid;
			grid-template-columns: 100%;
			grid-auto-rows: max-content;
			grid-row-gap: 20rpx;
			padding: 48rpx 32rpx;
			background-color: #F3F9FF;
			border-radius: $lite-border-radius;
			color: $lite-font-routine-color;
			font-size: $lite-font-size;
			text-align: center;
			line-height: 42rpx;
			border: 2rpx solid #D6E8FF;
			.item__value {
				line-height: 56rpx;
				font-size: 60rpx;
				color: #0091FF;
				font-weight: 600;
				@include lite-mixin-line('1');
			}
			.item__label {
				@include lite-mixin-line('1');
			}
			.item__unit {
				line-height: 36rpx;
				font-size: 26rpx;
				color: #999999;
				@include lite-mixin-line('1');
			}
		}
	}
}
</style>