<template>
	<view class="lite__form">
		<uv-form
			:model="formData"
			errorType="toast"
			:rules="rules"
			:labelPosition="labelPosition"
			:labelWidth="labelWidth || 'auto'"
			ref="liteForm"
			:class="[
				'lite-uv-form-text-aligin-' + textAlign,
				'lite-uv-form-mode-' + mode
			]"
		>
			<template v-for="item in formItem" :key="item.key">
				<uv-form-item
					:class="[_required(item.key) && 'required__item', item.type == 'upload' && 'upImage']"
					:required="_required(item.key)"
					:label="item.label"
					:prop="item.key"
				>
					<!-- 输入框 -->
					<uv-input
						v-model="formData[item.key]"
						:type="item.type || 'text'"
						:border="mode == 'frame' ? 'surround' : 'none'"
						:inputAlign="textAlign"
						:clearable="item.clearable === false ? false : true"
						:placeholder="item.placeholder || '请输入'"
						@input="_changeInput"
						@blur="_blurInput"
						v-if="item.type == 'input'"
					/>
					<!-- 弹出选择 -->
					<uv-input
						:value="pickerLabels[item.key]"
						:border="mode == 'frame' ? 'surround' : 'none'"
						:inputAlign="textAlign"
						:suffixIcon="suffixIcon || labelPosition == 'top' ? 'arrow-down' : 'arrow-right'"
						disabled
						:placeholder="item.placeholder || '请选择'"
						@click="_openPicker(item)"
						v-if="item.type == 'select'"
					/>
					<!-- 时间选择 -->
					<uv-input
						:value="formData[item.key]"
						:border="mode == 'frame' ? 'surround' : 'none'"
						:inputAlign="textAlign"
						:suffixIcon="suffixIcon || labelPosition == 'top' ? 'arrow-down' : 'arrow-right'"
						disabled
						:placeholder="item.placeholder || '请选择'"
						@click="_openTime(item)"
						v-if="item.type == 'time'"
					/>
					<!-- 多选选择 -->
					<uv-input
						:value="multipleLabels[item.key]"
						:border="mode == 'frame' ? 'surround' : 'none'"
						:inputAlign="textAlign"
						:suffixIcon="suffixIcon || labelPosition == 'top' ? 'arrow-down' : 'arrow-right'"
						disabled
						:placeholder="item.placeholder || '请选择'"
						@click="_openMultiple(item)"
						v-if="item.type == 'multipleSelect'"
					/>
					<!-- 跳转页面去选择 -->
					<uv-input
						:value="formData[item.key]"
						:border="mode == 'frame' ? 'surround' : 'none'"
						:inputAlign="textAlign"
						:suffixIcon="suffixIcon || labelPosition == 'top' ? 'arrow-down' : 'arrow-right'"
						disabled
						:placeholder="item.placeholder || '请选择'"
						@click="_toPage(item)"
						v-if="item.type == 'toPage'"
					/>
					<!-- 上传 -->
					<uv-upload
						ref="upload"
						:fileList="fileList"
						:maxCount="item.maxCount || 1"
						:maxSize="item.maxSize || 20 * 1024 * 1024"
						:name="item.name || 'file'"
						:width="85"
						:height="85"
						:multiple="true"
						@afterRead="_upAfterRead($event, item)"
						@delete="_upRemoveDel($event, item)"
						v-if="item.type == 'upload'"
					/>
					<!-- 自定义插槽 -->
					<slot :name="item.slotName" :key="item.key" v-if="item.type === 'slot'" />
				</uv-form-item>
			</template>
		</uv-form>
		<!-- 弹出选择 -->
		<uv-picker
			ref="pickerRef"
			:columns="pickerOptions"
			keyName="label"
			cancelColor="#666666"
			confirmColor="#0074FF"
			@confirm="_selectConfirm"
			@close="_closePicker"
		></uv-picker>
		<!-- 时间选择 -->
		<uv-datetime-picker
			ref="datetimePicker"
			:value="currentTimeData || Number(new Date())"
			:mode="timeMode"
			cancelColor="#666666"
			confirmColor="#0074FF"
			@confirm="_timeConfirm"
			@close="_closeTime"
		></uv-datetime-picker>
		<!-- 多选选择 -->
		<multiple-picker
			:defaultIndex="currentMultipleData"
			:show="multipleShow"
			:columns="multipleOptions"
			@cancel="_multipleCancel"
			@confirm="_multipleConfirm"
		></multiple-picker>
	</view>
</template>

<script>
import props from './props.js'
import { timeFormat } from '@/uni_modules/uv-ui-tools/libs/function/index.js'
import multiplePicker from './multiple-picker.vue'
export default {
	name: 'lite-form',
	mixins: [props],
	components: {
		multiplePicker,
	},
	data() {
		return {
			// 二次确认的字段键[如: select、time]
			operateKey: '',
			
			// 弹出选择选项
			pickerOptions: [],
			// 弹出选择label集合
			pickerLabels: {},
			
			// 时间选择模式
			timeMode: 'date',
			// 当前打开项的时间值
			currentTimeData: null,
			
			// 多选弹出控制
			multipleShow: false,
			// 多选选择选项
			multipleOptions: [],
			// 多选选择label集合
			multipleLabels: {},
			// 当前打开项的多选值
			currentMultipleData: [],
			
			// 文件(图片)列表
			fileList: [],
		}
	},
	watch: {
		formItem: {
			handler(obj) {
				// 防止formData是空对象
				if (obj) {
					obj.forEach(item => {
						if (this.formData[item.key] == undefined) {
							this.formData[item.key] = ''
						}
					})
				}
			},
			deep: true,
			immediate: true
		},
	},
	mounted() {
		this.initLabel()
	},
	methods: {
		// 判断表单项是否必填
		_required(key) {
			let result = false
			if (this.rules[key]) {
				const array = this.rules[key]
				array.forEach(item => {
					if (item.required) {
						result = true
					}
				})
			}
			return result
		},
		
		// 输入框录入
		_changeInput(e) {
			this.$emit('changeInput', e)
		},
		// 输入框失去焦点
		_blurInput(e) {
			this.$emit('blurInput', e)
		},
		
		// 弹出选择打开
		_openPicker(item) {
			this.pickerOptions = [item.options]
			this.operateKey = item.key
			const value = this.formData[item.key]
			if (value != '' && value != undefined) {
				const index = item.options.findIndex(option => option.value == value)
				this.$refs.pickerRef.setIndexs([index])
			} else {
				this.$refs.pickerRef.setIndexs([0])
			}
			this.$emit('openPicker', this.operateKey)
			this.$refs.pickerRef.open()
		},
		// 弹出选择关闭事件
		_closePicker() {
			this.$emit('closePicker', this.operateKey)
		},
		// 弹出选择确认
		_selectConfirm(e) {
			if (this.operateKey) {
				this.formData[this.operateKey] = e.value[0]['value']
				this.pickerLabels[this.operateKey] = e.value[0]['label']
			}
			this.$emit('changeSelect', this.operateKey, e)
		},
		
		// 时间选择打开
		_openTime(item) {
			if (item.mode) {
				this.timeMode = item.mode
			}
			this.operateKey = item.key
			this.currentTimeData = this.formData[item.key]
			this.$emit('openTime', this.operateKey)
			this.$refs.datetimePicker.open()
		},
		// 时间选择关闭
		_closeTime() {
			this.$emit('closeTime', this.operateKey)
		},
		// 时间选择确认
		_timeConfirm(e) {
			if (this.timeMode == 'datetime') {
				this.formData[this.operateKey] = timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
				return
			}
			if (this.timeMode == 'date') {
				this.formData[this.operateKey] = timeFormat(e.value, 'yyyy-mm-dd')
				return
			}
			if (this.timeMode == 'year-month') {
				this.formData[this.operateKey] = timeFormat(e.value, 'yyyy-mm')
				return
			}
			if (this.timeMode == 'year') {
				this.formData[this.operateKey] = timeFormat(e.value, 'yyyy')
				return
			}
			this.formData[this.operateKey] = e.value
			this.$emit('changeTime', this.operateKey, e)
		},
		
		// 多选选择打开
		_openMultiple(item) {
			this.multipleOptions = item.options
			this.operateKey = item.key
			this.currentMultipleData = this.formData[item.key] || []
			this.$emit('openMultiple', this.operateKey)
			this.multipleShow = true
		},
		// 多选选择取消
		_multipleCancel() {
			this.multipleShow = false
			this.$emit('closeMultiple', this.operateKey)
		},
		// 多选选择确认
		_multipleConfirm(e) {
			this.multipleShow = false
			if (this.operateKey) {
				this.formData[this.operateKey] = e.value
				this.multipleLabels[this.operateKey] = e.selected.map(item => item.label).join()
			}
			this.$emit('changeMultiple', this.operateKey, e)
		},
		
		// 跳转页面去选择
		_toPage(item) {
			this.$emit('toPage', item)
		},
		
		// 上传文件
		async _upAfterRead(event, item) {
			// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
			let lists = []
			if (Array.isArray(event.file)) {
				lists = [].concat(event.file)
			} else {
				lists.push(event.file)
			}
			
			let fileListLen = this.fileList.length
			lists.map((item) => {
				this.fileList.push({
					...item,
					status: 'uploading',
					message: '上传中'
				})
			})
			for (let i = 0; i < lists.length; i++) {
				const result = await item.upload(lists[i])
				let item = this.fileList[fileListLen]
				this.fileList.splice(fileListLen, 1, Object.assign(item, {
					status: 'success',
					message: '',
					...result
				}))
				this.formData[item.key] = this.fileList
				fileListLen++
			}
		},
		// 删除文件
		async _upRemoveDel({ file, index }, item) {
			try {
				await item.uploadDel(file)
				uni.showToast({ title: '删除成功', icon: 'success' })
				this.fileList.splice(index, 1)
				this.formData[item.key] = this.fileList
			} catch(e) {
				uni.showToast({ title: '删除失败', icon: 'error' })
			}
		},
		
		// 日期格式化
		timeFormat(time, format) {
			return timeFormat(time, format)
		},
		// 清空校验结果
		clearValidate() {
			this.$refs.liteForm.clearValidate()
		},
		// 重置表单(同时会清空校验结果)
		resetFields() {
			this.pickerLabels = {}
			this.multipleLabels = {}
			this.fileList = []
			this.$refs.liteForm.resetFields()
			Object.keys(this.formData).forEach(key => {
				this.formData[key] = ''
			})
		},
		// 校验表单并返回数据-异步
		submit() {
			return new Promise((resolve, reject) => {
				this.$refs.liteForm.validate().then(res => {
					resolve(this.formData)
				}).catch(errors => {
					reject()
					uni.showToast({ icon: 'error', title: '请完善表单' })
				})
			})
		},
		// 回显弹出label(select、multipleSelect有默认值时，手动调用)
		initLabel() {
			const obj = this.formData
			this.formItem.forEach(item => {
				// 回显select label
				if (item.type == 'select' && item.options && obj[item.key] != '' && obj[item.key] != undefined && obj[item.key] != null) {
					const selectItem = item.options.find(option => option.value == obj[item.key])
					this.pickerLabels[item.key] = selectItem ? selectItem.label : ''
				}
				if (item.type == 'select' && !obj[item.key] && obj[item.key] !== 0) {
					this.pickerLabels[item.key] = ''
				}
				// 回显multipleSelect label
				if (item.type == 'multipleSelect' && item.options && Array.isArray(obj[item.key])) {
					const selectItems = []
					item.options.forEach(option => {
						const array = obj[item.key]
						let result = false
						for (let i = 0; i < array.length; i++) {
							if (array[i] == option.value) {
								result = true
							}
						}
						if (result) {
							selectItems.push(option)
						}
					})
					if (selectItems && selectItems.length > 0) {
						this.multipleLabels[item.key] = selectItems.map(item => item.label).join()
					}
				}
				if (item.type == 'multipleSelect' && Array.isArray(obj[item.key]) === false) {
					this.multipleLabels[item.key] = ''
				}
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

$border-color: #EAEAEA;
.lite__form {
	padding: 0 $lite-margin;
	box-sizing: border-box;
	background-color: #FFFFFF;
	font-family: $lite-font-family;
	.uv-form {
		:deep(.uv-form-item) {
			.uv-form-item__body {
				height: 124rpx;
				padding: 0;
				border-bottom: 1rpx solid $border-color;
				.uv-form-item__body__left {
					width: auto;
					flex-shrink: 0;
					flex-grow: 0;
					margin-right: 20rpx;
					.uv-form-item__body__left__content__label {
						font-size: 32rpx;
						color: #333333;
						font-weight: normal;
					}
				}
				.uv-form-item__body__right {
					flex: 1;
					text-align: right;
					.uv-input {
						background-color: transparent !important;
						.uv-input__content__field-wrapper__field {
							font-size: 32rpx !important;
							color: $lite-font-color !important;
						}
						.uv-input__content__subfix-icon {
							.uv-icon__icon {
								color: #DADADA !important;
							}
						}
					}
				}
			}
			&:last-child {
				.uv-form-item__body {
					border-bottom: none;
				}
			}
			&:nth-child(1) {
				.uv-form-item__body {
					border-bottom: 1rpx solid $border-color;
				}
			}
		}
		:deep(.required__item) {
			.uv-form-item__body {
				.uv-form-item__body__left {
					padding-left: 18rpx;
				}
			}
		}
		:deep(.upImage) {
			.uv-form-item__body {
				height: max-content !important;
				.uv-form-item__body__right__content__slot {
					justify-content: flex-end;
					.uv-upload, .uv-upload__wrap {
						flex-grow: 0;
						flex-shrink: 0;
						width: max-content;
						.uv-upload__button, .uv-upload__wrap__preview {
							margin: 12rpx;
							&:nth-last-child(1) {
								margin-right: 0;
							}
						}
					}
				}
			}
		}
	}
	.lite-uv-form-text-aligin-left {
		:deep(.uv-form-item) {
			.uv-form-item__body {
				height: max-content;
				.uv-form-item__body__right {
					text-align: left;
					.uv-input {
						.uv-input__content__field-wrapper__field {
						 	text-align: left !important;
						}
					}
				}
			}
		}
		:deep(.upImage) {
			.uv-form-item__body {
				.uv-form-item__body__right__content__slot {
					justify-content: flex-start;
				}
			}
		}
	}
	.lite-uv-form-mode-frame {
		:deep(.uv-form-item) {
			margin-bottom: 24rpx;
			&:nth-last-child(1) {
				margin-bottom: 0;
			}
			.uv-form-item__body {
				border-bottom: none !important;
				.uv-form-item__body__right {
					.uv-input {
						background-color: #F0F2F5 !important;
						border-color: #EEEEEE !important;
						border-radius: $lite-border-radius;
						padding: 10rpx 20rpx !important;
						.uv-input__content {
							height: 48rpx;
							line-height: 48rpx;
						}
						.uv-input__content__subfix-icon {
							.uv-icon__icon {
								color: #999999 !important;
							}
						}
					}
				}
			}
		}
	}
	:deep(.uv-picker__view__column__item) {
		color: #0D1523;
	}
	:deep(.uv-toolbar__wrapper__cancel) {
		font-size: 32rpx;
	}
	:deep(.uv-toolbar__wrapper__confirm) {
		font-size: 32rpx;
	}
}
</style>