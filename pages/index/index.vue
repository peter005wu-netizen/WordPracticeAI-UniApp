<template>
	<view class="page">
		<!-- Custom Navigation Bar -->
		<view class="custom-navbar">
			
				<text class="app-title">智练单词</text>
		</view>

		<!-- Main Content -->
		<scroll-view class="content" scroll-y>
			<!-- Scan & Upload Card -->
			<view class="scan-card">
				<text class="card-title">Scan & Upload</text>
				<text class="card-subtitle">Convert learning materials to smart sets</text>
				<view class="scan-options">
					<view class="scan-option" @tap="handleCameraScan">
						<view class="option-icon camera-icon">
							<text class="icon">📷</text>
						</view>
						<text class="option-text">Camera Scan</text>
					</view>
					<view class="scan-option">
						<view class="option-icon pdf-icon">
							<text class="icon">📄</text>
						</view>
						<text class="option-text">PDF/Image</text>
					</view>
					<view class="scan-option">
						<view class="option-icon voice-icon">
							<text class="icon">🎤</text>
						</view>
						<text class="option-text">Voice Input</text>
					</view>
				</view>
			</view>

			<!-- Stats Row -->
			<view class="stats-row">
				<view class="stat-item streak">
					<text class="stat-icon">🔥</text>
					<view class="stat-info">
						<text class="stat-label">STREAK</text>
						<text class="stat-value">12 Days</text>
					</view>
				</view>
				<view class="stat-item library">
					<text class="stat-icon">📚</text>
					<view class="stat-info">
						<text class="stat-label">LIBRARY</text>
						<text class="stat-value">48 Sets</text>
					</view>
				</view>
			</view>

			<!-- Recent Scans Section -->
			<view class="section-header">
				<text class="section-title">Recent Scans</text>
				<text class="see-all">See All ></text>
			</view>

			<view class="recent-list">
				<view class="recent-item">
					<view class="item-icon">
						<text class="icon">📄</text>
					</view>
					<view class="item-content">
						<text class="item-title">Cell Biology Lecture 4</text>
						<view class="item-meta">
							<text class="meta-text">Oct 24 · PDF · </text>
							<text class="meta-highlight">12 Cards</text>
						</view>
					</view>
					<text class="item-menu">⋮</text>
				</view>

				<view class="recent-item">
					<view class="item-icon">
						<text class="icon">📝</text>
					</view>
					<view class="item-content">
						<text class="item-title">Microeconomics Midterm</text>
						<view class="item-meta">
							<text class="meta-text">Oct 23 · Scan · </text>
							<text class="meta-highlight">32 Words</text>
						</view>
					</view>
					<text class="item-menu">⋮</text>
				</view>

				<view class="recent-item analyzing">
					<view class="item-icon">
						<text class="icon">⭕</text>
					</view>
					<view class="item-content">
						<text class="item-title italic">Psychology 101 Notes</text>
						<view class="item-meta">
							<text class="meta-text">Just now · Analyzing...</text>
						</view>
					</view>
					<view class="progress-icon">⏳</view>
				</view>
			</view>

			<!-- Study Insight Card -->
			<view class="insight-card">
				<text class="insight-label">STUDY INSIGHT</text>
				<text class="insight-title">Boost Active Recall</text>
				<text class="insight-desc">Improve retention by 40%</text>
				<view class="insight-icon">✨</view>
			</view>

			
		</scroll-view>
	</view>
</template>

<style scoped>
.page {
	background-color: #F8F9FA;
	min-height: 100vh;
	width: 100%;
}

/* Custom Navigation Bar */
.custom-navbar {
	background-color: #FFFFFF;
	padding-top: 44px; /* Status bar height */
	width: 100%;
	text-align: center;
}

.navbar-content {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 24rpx 32rpx;
}

.app-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #1A1A1A;
}

/* Main Content */
.content {
	width: 100%;
	padding: 32rpx;
	height: calc(100vh - 160px);
	box-sizing: border-box;
}

/* Scan & Upload Card */
.scan-card {
	background-color: #FFFFFF;
	border-radius: 32rpx;
	padding: 48rpx 40rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
	width: 100%;
	box-sizing: border-box;
}

.card-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #1A1A1A;
	display: block;
	margin-bottom: 8rpx;
}

.card-subtitle {
	font-size: 28rpx;
	color: #6B7280;
	display: block;
	margin-bottom: 48rpx;
}

.scan-options {
	display: flex;
	justify-content: space-between;
	gap: 24rpx;
}

.scan-option {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.option-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 56rpx;
}

.camera-icon {
	background-color: #EFF6FF;
}

.pdf-icon {
	background-color: #EFF6FF;
}

.voice-icon {
	background-color: #EFF6FF;
}

.option-text {
	font-size: 24rpx;
	color: #2563EB;
	font-weight: 500;
	text-align: center;
}

/* Stats Row */
.stats-row {
	display: flex;
	gap: 24rpx;
	margin-bottom: 40rpx;
	width: 100%;
	box-sizing: border-box;
}

.stat-item {
	flex: 1;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	box-sizing: border-box;
}

.stat-icon {
	font-size: 48rpx;
}

.stat-info {
	display: flex;
	flex-direction: column;
}

.stat-label {
	font-size: 22rpx;
	color: #6B7280;
	font-weight: 600;
	letter-spacing: 0.5px;
	margin-bottom: 4rpx;
}

.stat-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #1A1A1A;
}

/* Section Header */
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
	width: 100%;
}

.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1A1A1A;
}

.see-all {
	font-size: 28rpx;
	color: #2563EB;
}

/* Recent List */
.recent-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	margin-bottom: 32rpx;
	width: 100%;
}

.recent-item {
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	width: 100%;
	box-sizing: border-box;
}

.recent-item.analyzing {
	opacity: 0.7;
}

.item-icon {
	width: 96rpx;
	height: 96rpx;
	background-color: #F3F4F6;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48rpx;
}

.item-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.item-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.item-title.italic {
	font-style: italic;
}

.item-meta {
	display: flex;
	align-items: center;
}

.meta-text {
	font-size: 24rpx;
	color: #6B7280;
}

.meta-highlight {
	font-size: 24rpx;
	color: #2563EB;
	font-weight: 600;
}

.item-menu {
	font-size: 48rpx;
	color: #9CA3AF;
	line-height: 1;
}

.progress-icon {
	font-size: 40rpx;
}

/* Study Insight Card */
.insight-card {
	background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);
	border-radius: 32rpx;
	padding: 48rpx 40rpx;
	position: relative;
	overflow: hidden;
	width: 100%;
	box-sizing: border-box;
}

.insight-label {
	font-size: 22rpx;
	color: #93C5FD;
	font-weight: 600;
	letter-spacing: 1px;
	display: block;
	margin-bottom: 8rpx;
}

.insight-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #FFFFFF;
	display: block;
	margin-bottom: 8rpx;
}

.insight-desc {
	font-size: 28rpx;
	color: #DBEAFE;
	display: block;
}

.insight-icon {
	position: absolute;
	right: 40rpx;
	bottom: 40rpx;
	font-size: 64rpx;
	opacity: 0.5;
}
</style>
<script>
export default {
	data() {
		return {}
	},
	onShow() {
		// 从 RecognitionPage 返回时接收数据
		const exerciseData = uni.getStorageSync('exerciseData');
		if (exerciseData) {
			console.log('=== Received exercise data from RecognitionPage ===');
			console.log('Words:', exerciseData.words);
			console.log('Exercise Types:', exerciseData.exerciseTypes);
			console.log('Image Title:', exerciseData.imageTitle);
			console.log('Total selected words:', exerciseData.words.length);

			// 清除缓存
			uni.removeStorageSync('exerciseData');
		}
	},
	methods: {
		handleCameraScan() {
			console.log('Camera scan button clicked');
			// 使用相机拍照
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'], // 只使用相机
				success: (res) => {
					const imagePath = res.tempFilePaths[0];
					console.log('Image captured:', imagePath);
					// 拍照后直接跳转到词汇识别页面
					const targetUrl = `/pages/scan/RecognitionPage?image=${encodeURIComponent(imagePath)}`;
					console.log('Navigating to:', targetUrl);
					uni.navigateTo({
						url: targetUrl,
						success: () => {
							console.log('Navigation successful');
						},
						fail: (err) => {
							console.error('Navigation failed:', err);
						}
					});
				},
				fail: (err) => {
					uni.showToast({
						title: '拍照失败',
						icon: 'none'
					});
					console.error('Camera error:', err);
				}
			});
		}
	}
}
</script>

