<template>
	<view 
		:class="['lite__card', highlight && 'card__highlight']"
		:style="{
			'--width': width,
			'--bottom': bottom,
			'--maxLabelWidth': maxLabelWidth,
			'--statusBgColor': statusBgColor,
			'--statusColor': statusColor,
			'--hgBgColor': hgBgColor,
			'--hgBorderColor': hgBorderColor,
		}"
	>
		<view class="lite__card-title" @click="_selectCard" v-if="showTitle">
			<view :class="['title__select', select[0] ? 'lite__checkbox-active' : 'lite__checkbox']" v-if="checkbox">
				<uv-checkbox-group iconSize="34rpx" v-model="select">
					<uv-checkbox :checked="select[0]" shape="square" :name="true"></uv-checkbox>
				</uv-checkbox-group>
			</view>
			<view class="title__name">
				<template v-if="$slots.title">
					<slot name="title" :itemData="cardData"></slot>
				</template>
				<text v-else>{{ titleLabel }}{{ cardData[titleKey] }}</text>
			</view>
			<view class="title__status" v-if="$slots.status">
				<slot name="status" :itemData="cardData"></slot>
			</view>
			<view class="title__right" v-if="$slots.titleRight">
				<slot name="titleRight" :itemData="cardData"></slot>
			</view>
		</view>
		<view :class="['lite__card-box', !showTitle && 'no__title']" @click="_selectCard">
			<view class="box__item" v-for="(item, index) in fieldList" :key="index">
				<template v-if="Array.isArray(item)">
					<view 
						:class="['box__item-index', idx >= 1 && 'index__other']"
						v-show="child.show ? child.show(cardData) : true"
						v-for="(child, idx) in item"
						:key="idx"
					>
						<span 
							:class="['index__label', idx >= 1 && 'index__label__other']"
							:style="child.labelStyle ? child.labelStyle(cardData) : {}"
						>
							{{ child.label }}
						</span>
						<span
							class="index__value"
							:style="child.valueStyle ? child.valueStyle(cardData) : {}"
							v-if="!child.slotName"
						>
							{{ child.format ? child.format(cardData) : cardData[child.key] }}
						</span>
						<span
							class="index__value"
							:style="child.valueStyle ? child.valueStyle(cardData) : {}"
							v-if="child.slotName"
						>
							<slot :name="child.slotName" :itemData="cardData"></slot>
						</span>
					</view>
				</template>
				<template v-else>
					<view class="box__item-index" v-show="item.show ? item.show(cardData) : true">
						<span class="index__label" :style="item.labelStyle ? item.labelStyle(cardData) : {}">
							{{ item.label }}
						</span>
						<span class="index__value" :style="item.valueStyle ? item.valueStyle(cardData) : {}" v-if="!item.slotName">
							{{ item.format ? item.format(cardData) : cardData[item.key] }}
						</span>
						<span class="index__value" :style="item.valueStyle ? item.valueStyle(cardData) : {}" v-if="item.slotName">
							<slot :name="item.slotName" :itemData="cardData"></slot>
						</span>
					</view>
				</template>
			</view>
		</view>
		<view class="lite__card-footer" v-if="$slots.footer">
			<slot name="footer" :itemData="cardData"></slot>
		</view>
		<view class="lite__card-jump" v-if="jump && !$slots.footer" @click="_jump(cardData)">
			<view class="jump__label">{{ jumpLabel }}</view>
			<view class="jump__btn">{{ jumpBtnName }}</view>
		</view>
		<!-- 供悬浮提示使用 -->
		<slot name="tips" :itemData="cardData"></slot>
	</view>
</template>

<script>
import props from './props.js'
export default {
	name: 'lite-card',
	mixins: [props],
	data() {
		return {
			// 最大label宽度
			maxLabelWidth: '128rpx',
			// 选择状态
			select: [false],
		}
	},
	watch: {
		defaultChecked: {
			handler(value) {
				this.select[0] = value
			},
			immediate: true
		}
	},
	mounted() {
		this._setMaxLabelWidth()
	},
	methods: {
		// 设置label的最大宽度
		_setMaxLabelWidth() {
			const query = uni.createSelectorQuery().in(this)
			query.selectAll('.index__label').boundingClientRect(rects => {
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
		// 切换卡片选中状态
		_selectCard() {
			if (this.checkbox) {
				this.select[0] = !this.select[0]
				this.$emit('selectChange', this.select[0])
				// 特殊函数，用于lite-operation或者其他关联组件进行关联操作(勾选状态)，只能兄弟组件内ref._operationLinkage设置
				this._operationLinkage && this._operationLinkage()
			}
		},
		// 跳转详情
		_jump(cardData) {
			this.$emit('jump', cardData)
		},
		
		// 手动设置选中状态
		setSelect(e) {
			this.select[0] = e
		},
		// 返回选中状态
		isSelect() {
			return this.select[0]
		},
		// 返回卡片数据
		getCardData() {
			return this.cardData
		},
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__card {
	width: var(--width);
	margin: 0 auto var(--bottom);
	padding: 20rpx;
	border-radius: $lite-border-radius;
	box-sizing: border-box;
	font-family: $lite-font-family;
	font-size: $lite-card-font-size;
	color: $lite-card-font-color;
	background-color: $lite-card-bg-color;
	cursor: pointer;
	position: relative;
	.lite__card-title {
		display: flex;
		align-items: center;
		padding: 0 10rpx 20rpx;
		border-bottom: 1px solid $lite-card-border-color;
		.title__select {
			flex-grow: 0;
			flex-shrink: 0;
			margin-right: 10rpx;
		}
		.title__name {
			flex-grow: 1;
			flex-shrink: 1;
			line-height: 1.54;
			font-weight: 600;
			@include lite-mixin-line('1');
			* {
				@include lite-mixin-line('1');
			}
		}
		.title__status {
			margin-left: 10rpx;
			flex-grow: 0;
			flex-shrink: 0;
			font-size: $lite-status-font-size;
			font-weight: 600;
			height: 54rpx;
			line-height: 54rpx;
			padding: 0 16rpx 0 34rpx;
			background-color: var(--statusBgColor);
			color: var(--statusColor);
			border-radius: $lite-border-radius-sm;
			position: relative;
			&::before {
				content: '';
				width: 10rpx;
				height: 10rpx;
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 16rpx;
				transform: translateY(-50%);
				background-color: var(--statusColor);
			}
		}
		.title__right {
			flex-grow: 0;
			flex-shrink: 0;
			width: max-content;
			font-size: $lite-status-font-size;
			position: relative;
		}
	}
	.lite__card-box {
		padding: 18rpx 10rpx 0 10rpx;
		.box__item {
			line-height: 1.4;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			overflow: hidden;
			&:nth-last-child(1) {
				margin-bottom: 0;
			}
			.box__item-index {
				width: 0;
				flex-shrink: 1;
				flex-grow: 1;
				display: flex;
				align-items: center;
				margin-right: 20rpx;
				&:nth-last-child(1) {
					margin-right: 0;
				}
				.index__label {
					display: inline-block;
					min-width: var(--maxLabelWidth);
					flex-shrink: 0;
					margin-right: 16rpx;
					color: $lite-card-label-font-color;
				}
				.index__label__other {
					min-width: max-content;
				}
				.index__value {
					display: inline-block;
					flex-shrink: 1;
					flex-grow: 0;
					@include lite-mixin-line('1');
				}
			}
			.index__other {
				justify-content: flex-end;
			}
		}
	}
	.lite__card-footer {
		position: relative;
		display: flex;
		justify-content: flex-end;
		height: max-content;
		margin-top: 20rpx;
		padding: 18rpx 10rpx 0 10rpx;
		border-top: 1px solid $lite-card-border-color;
	}
	.lite__card-jump {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
		padding: 18rpx 10rpx 0 10rpx;
		border-top: 1px solid $lite-card-border-color;
		font-size: 26rpx;
		cursor: pointer;
		.jump__label {
			color: #545A60;
		}
		.jump__btn {
			padding-right: 24rpx;
			color: #0091FF;
			position: relative;
			&::after {
				content: '';
				width: 20rpx;
				height: 20rpx;
				background-image: url('./image/arrow.png');
				background-repeat: no-repeat;
				background-size: contain;
				position: absolute;
				top: 50%;
				right: 0;
				transform: translateY(-50%);
			}
		}
	}
	.no__title {
		padding-top: 0;
		margin-top: 0;
	}
}
.card__highlight {
	background-color: var(--hgBgColor);
	border: 2rpx solid var(--hgBorderColor);
}
</style>