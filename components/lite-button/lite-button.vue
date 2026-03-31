<template>
	<view
		:class="['lite__button', type, plain && 'plain']"
		:style="{
			'--width': width,
			'--height': height,
			'--left': left,
			'--right': right,
		}"
	>
		<uv-button type="primary" :text="text" :color="bgColor"></uv-button>
	</view>
</template>

<script>
import props from './props.js'
export default {
	name: 'lite-button',
	mixins: [props],
	data() {
		return {}
	},
	methods: {}
}
</script>

<style lang="scss" scoped>
@import '@/components/lite-ui-tool/libs/css/variable.scss';
@import '@/components/lite-ui-tool/libs/css/common.scss';

.lite__button {
	width: var(--width);
	height: var(--height);
	margin-left: var(--left);
	margin-right: var(--right);
	cursor: pointer;
	&:nth-last-child(1) {
		margin-right: 0;
		margin-left: 0;
	}
	:deep(.uv-button-wrapper) {
		width: 100%;
		height: 100%;
		.uv-button {
			width: 100%;
			height: 100%;
			border-radius: $lite-border-radius !important;
			.uv-button__text {
				font-family: $lite-font-family !important;
				font-size: 28rpx !important;
			}
		}
	}
}

.lite__button.primary {
	:deep(.uv-button-wrapper) {
		.uv-button {
			background-color: $lite-button-primary;
			border-color: $lite-button-primary;
		}
	}
}
.lite__button.success {
	:deep(.uv-button-wrapper) {
		.uv-button {
			background-color: $lite-button-success;
			border-color: $lite-button-success;
		}
	}
}
.lite__button.error {
	:deep(.uv-button-wrapper) {
		.uv-button {
			background-color: $lite-button-error;
			border-color: $lite-button-error;
		}
	}
}
.lite__button.warning {
	:deep(.uv-button-wrapper) {
		.uv-button {
			background-color: $lite-button-warning;
			border-color: $lite-button-warning;
		}
	}
}
.lite__button.info {
	:deep(.uv-button-wrapper) {
		.uv-button {
			background-color: $lite-button-info;
			border-color: $lite-button-info;
		}
	}
}

.lite__button.plain {
	:deep(.uv-button-wrapper) {
		.uv-button {
			background-color: transparent;
		}
	}
}
.lite__button.plain.primary {
	:deep(.uv-button-wrapper) {
		.uv-button {
			color: $lite-button-primary;
		}
	}
}
.lite__button.plain.success {
	:deep(.uv-button-wrapper) {
		.uv-button {
			color: $lite-button-success;
		}
	}
}
.lite__button.plain.error {
	:deep(.uv-button-wrapper) {
		.uv-button {
			color: $lite-button-error;
		}
	}
}
.lite__button.plain.warning {
	:deep(.uv-button-wrapper) {
		.uv-button {
			color: $lite-button-warning;
		}
	}
}
.lite__button.plain.info {
	:deep(.uv-button-wrapper) {
		.uv-button {
			color: $lite-button-info;
		}
	}
}
</style>