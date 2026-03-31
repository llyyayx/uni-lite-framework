<template>
	<view class="lite__operation" :style="{ '--zIndex': zIndex }">
		<!-- 占位 -->
		<view class="lite__operation-skn" :style="{ '--height': height }"></view>
		<view class="lite__operation-flex">
			<view :class="['operation__select', select[0] ? 'lite__checkbox-active' : 'lite__checkbox']" v-if="selectAll">
				<uv-checkbox-group iconSize="34rpx" labelColor="#333333" v-model="select" @change="_selectCheckbox">
					<uv-checkbox :checked="select[0]" shape="square" :name="true" label="全选"></uv-checkbox>
				</uv-checkbox-group>
			</view>
			<view class="operation__btns">
				<slot></slot>
			</view>
		</view>
		<uv-safe-bottom></uv-safe-bottom>
	</view>
</template>

<script>
import props from './props.js'
export default {
	name: 'lite-operation',
	mixins: [props],
	data() {
		return {
			// 全选状态
			select: [false],
			// 占位高度
			height: 0,
		}
	},
	watch: {
		cardRefs: {
			handler(obj) {
				if (this.cardRefs && this.cardRefs.length > 0) {
					// 与列表卡片做全选状态关联-加载就先执行一次
					this.select[0] = this.cardRefs.every(ref => {
						ref = ref.value || ref
						return ref.isSelect()
					})
					this.cardRefs.forEach((ref, index) => {
						ref = ref.value || ref
						ref._operationLinkage = () => {
							// 与列表卡片做全选状态关联
							this.select[0] = this.cardRefs.every(ref => {
								ref = ref.value || ref
								return ref.isSelect()
							})
						}
					})
				}
			},
			immediate: true
		}
	},
	mounted() {
		this._skeletonHeight()
	},
	methods: {
		// 获取占位高度
		_skeletonHeight() {
			const query = uni.createSelectorQuery().in(this)
			query.selectAll('.lite__operation-flex').boundingClientRect(rects => {
				if (rects && rects.length > 0) {
					let max = 0
					rects.forEach(rect => {
						if (rect.height > max) {
							max = Math.round(rect.height)
						}
					})
					this.height = max + 'px'
				} else {
					console.error(new Error('未找到.key节点'))
				}
			}).exec()
		},
		// 勾选事件
		_selectCheckbox(e) {
			if (this.cardRefs && this.cardRefs.length > 0) {
				this.cardRefs.forEach((ref, index) => {
					ref = ref.value || ref
					if (ref.setSelect) {
						ref.setSelect(e[0] || false)
					}
				})
				this.$emit('all')
			}
		},
		
		// 获取勾选的卡片
		getCheckData() {
			if (this.cardRefs && this.cardRefs.length > 0) {
				const listData = []
				const indexs = []
				this.cardRefs.forEach((ref, index) => {
					ref = ref.value || ref
					if (ref.isSelect()) {
						listData.push(ref.getCardData())
						indexs.push(index)
					}
				})
				return { listData, indexs }
			}
			return null
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__operation {
	.lite__operation-flex {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: var(--zIndex);
		padding: 12rpx $lite-margin $lite-margin;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		font-family: $lite-font-family;
		.operation__select {
			flex-shrink: 0;
			flex-grow: 0;
			margin-right: $lite-margin;
		}
		.operation__btns {
			flex-shrink: 1;
			flex-grow: 1;
			height: max-content;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			box-sizing: border-box;
		}
	}
	.lite__operation-skn {
		height: var(--height);
		background-color: transparent;
	}
}
</style>