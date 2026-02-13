<template>
	<view class="container">
		<view class="content-area">
			<!-- 调试信息 -->
			<view class="debug-info" v-if="imagePath">
				<text>路径: {{ imagePath }}</text>
			</view>

			<view class="image-container" v-if="imagePath">
				<image
					class="captured-image"
					:src="imagePath"
					mode="aspectFit"
					@error="imageError"
					@load="imageLoad"
				></image>
			</view>

			<view class="no-image" v-else>
				<text class="no-image-text">没有图片</text>
			</view>
		</view>

		<view class="button-group">
			
			<button class="btn-back" @tap="retake">重新拍照</button>
			<button class="btn-retake"  @tap="goRecognition">识别词汇</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imagePath: ''
		}
	},
	onLoad(options) {
		if (options.image) {
			this.imagePath = decodeURIComponent(options.image);
			console.log('Received image path:', this.imagePath);
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		goRecognition() {
			// 跳转到词汇识别页面，传递图片路径
			uni.navigateTo({
				url: `/pages/scan/RecognitionPage?image=${encodeURIComponent(this.imagePath)}`
			});
		},
		retake() {
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],
				success: (res) => {
					this.imagePath = res.tempFilePaths[0];
					console.log('New image path:', this.imagePath);
				},
				fail: () => {
					uni.showToast({
						title: '拍照失败',
						icon: 'none'
					});
				}
			});
		},
		imageLoad() {
			console.log('Image loaded successfully');
		},
		imageError(e) {
			console.error('Image load error:', e);
			uni.showToast({
				title: '图片加载失败',
				icon: 'none'
			});
		}
	}
}
</script>

<style scoped>
.container {
	background-color: #F8F9FA;
	height: 100vh;
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
}

.content-area {
	flex: 1;
	padding: 16rpx;
	padding-bottom: 140rpx; /* 为按钮区域留出空间 */
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.debug-info {
	background-color: #FFF3CD;
	padding: 16rpx;
	margin-bottom: 16rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	word-break: break-all;
}

.image-container {
	flex: 1;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 16rpx;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.captured-image {
	width: 100%;
	height: 100%;
	border-radius: 16rpx;
}

.no-image {
	flex: 1;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 120rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.no-image-text {
	font-size: 32rpx;
	color: #9CA3AF;
}

.button-group {
	position: fixed;
	bottom: 16rpx; /* 靠近屏幕底部 */
	left: 32rpx;
	right: 32rpx;
	display: flex;
	gap: 24rpx;
	z-index: 999;
}

.btn-back,
.btn-retake {
	flex: 1;
	height: 88rpx;
	border-radius: 16rpx;
	font-size: 32rpx;
	font-weight: 500;
}

.btn-back {
	background-color: #FFFFFF;
	color: #2563EB;
	border: 2rpx solid #2563EB;
}

.btn-retake {
	background-color: #2563EB;
	color: #FFFFFF;
}

button::after {
	border: none;
}
</style>
