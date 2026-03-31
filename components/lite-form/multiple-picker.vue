<template>
	<view class="popup" v-show="show">
		<view class="bg" @tap="cancelMultiple"></view>
	    <view class="selectMultiple" :animation="animationData">
	    	<view class="multipleBody">
	    		<view class="title">
	    			<view class="close" @tap="cancelMultiple">取消</view>
	    			<view class="name">{{title}}</view>
	    			<view class="confirm" @tap="confirmMultiple">确认</view>
	    		</view>
	    		<view class="list">
					<view class="mask mask-top"></view>
					<view class="mask mask-bottom"></view>
	    			<scroll-view class="diet-list" scroll-y="true">
	    				<view v-for="(item, index) in list" :class="['item', item.selected ? 'checked' : '']" @tap="onChange(index, item)">
	    					<span>{{item.label}}</span>
	    					<view class="icon" v-show="item.selected">
								<icon type="success_no_circle" size="16" color="#2D8DFF"/>
	    					</view>
	    				</view>
	    			</scroll-view>
	    		</view>
	    	</view>
	    </view>
	</view>
</template>

<script>
export default {
	name:"multiple-picker",
	data() {
		return {
			// 选中值
			value: [],
			// 选中列表
			selected: [],
			// 列表数据
			list: [],
			// 出场动画
			animationData: {},
		};
	},
	props: {
		// 是否显示
		show: {
			type: Boolean,
			default: false
		},
		// 标题
		title: {
			type: String,
			default: ''
		},
		//数据列表
		columns: {
			type: Array,
			default: []
		},
		// 默认选中
		defaultIndex: {
			type: Array,
			default: [],
		}
	},
	watch: {
		// 监听是否显示
		show(val) {
			if(val) {
				this.openMultiple()
			}
		}
	},
	methods: {
		// 列点击事件
		onChange(index, item) {
			// 是否已选中
			if(this.value.indexOf(item.value.toString()) >= 0) {
				this.list[index].selected = false
			}
			else {
				this.list[index].selected = true
			}
			
			// 筛选已勾选数据
			this.value = [];
			this.selected = [];
			this.list.forEach((col_item, col_index) => {
				if(col_item.selected) {
					this.value.push(col_item.value.toString())
					this.selected.push({
						label: col_item.label,
						value: col_item.value,
					})
				}
			})
			this.$emit("change", {selected: this.selected, value: this.value})
		},
		// 弹出框开启触发事件
		openMultiple() {
			// 初始化列表数据,默认勾选数据
			this.value = this.defaultIndex;
			this.columns.forEach((item, index) => {
				this.$set(item, "selected", false);
				if(this.value.indexOf(item.value.toString()) >= 0) {
					item.selected = true;
				}
			})
			this.list = Object.assign([], this.columns)
			// 弹出动画
			this.openAnimation()
		},
		// 确认
		confirmMultiple() {
			this.$emit("confirm", {selected: this.selected, value: this.value})
		},
		// 关闭/取消
		cancelMultiple() {
			this.$emit("cancel")
		},
		// 展开动画
		openAnimation() {
			var animation = uni.createAnimation()
			animation.translate(0, 300).step({ duration: 0 })
			this.animationData = animation.export()
			this.$nextTick(() => {
				animation.translate(0, 0).step({ duration: 300, timingFunction: 'ease' })
				this.animationData = animation.export()
			})
		},
	}
}
</script>

<style scoped lang="scss">
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.popup {
	width: 100%;
	height: 100vh;
	position: fixed;
	z-index: 100001;
	left: 0;
	bottom: 0;
	.bg {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
}
.selectMultiple {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	background-color: #ffffff;
	font-family: $lite-font-family;
	.multipleBody {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		padding-bottom: 80rpx;
		.title {
			font-size: 28rpx;
			display: flex;
			flex-direction: row;
			.close {
				font-size: 32rpx;
				color: #666666;
				width: 80rpx;
			}
			.name {
				width: 530rpx;
				text-align: center;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:1;
			}
			.confirm {
				width: 80rpx;
				text-align: right;
				font-size: 32rpx;
				color: #0074FF;
			}
		}
		.list {
			width: 100%;
			padding-top: 30rpx;
			position: relative;
			.mask {
				width: 100%;
				height: 120rpx;
				position: absolute;
				left: 0;
				z-index: 2;
				pointer-events: none;
				
				&.mask-top {
					top: 30rpx;
					background-image: linear-gradient(to bottom, #fff, rgba(#fff, 0));
				}
				&.mask-bottom {
					bottom: 0;
					background-image: linear-gradient(to bottom, rgba(#fff, 0), #fff);
				}
			}
			.diet-list {
				max-height: 400rpx;
				:deep(.uni-scroll-view) {
					&::-webkit-scrollbar {
						width: 0px;
					}
				}
			}
			.item {
				position: relative;
				width: 100%;
				line-height: 50rpx;
				border-bottom: 1px solid rgba($color: #000000, $alpha: .05);
				padding: 20rpx 0;
				font-size: 32rpx;
				box-sizing: border-box;
				text-align: center;
				color: #0D1523;
				span {
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:1;
					padding: 0 40rpx;
				}
				.icon {
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-50%);
					height: 16px;
				}
				&.checked {
					color: #1890FF;
				}
				&:last-child {
					border-bottom: none;
					margin-bottom: 60rpx;
				}
				&:first-child {
					margin-top: 60rpx;
				}
			}
		}
	}
}
</style>
