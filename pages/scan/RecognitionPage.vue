<template>
	<view class="page">
		<!-- 统计信息区域 -->
		<view class="stats-section">
			<view class="stats-header">
				<view class="total-words">
					<text class="stats-label">Total Identified Words</text>
					<text class="stats-number">{{ totalWords }}</text>
				</view>
				<view class="scan-status">
					<text class="status-badge">AI SCAN COMPLETE</text>
					<text class="scan-time">Scan duration: {{ scanDuration }}s</text>
				</view>
			</view>
		</view>

		<!-- 词汇列表区域 -->
		<view class="words-section">
			<!-- 全选和排序 -->
			<view class="list-controls">
				<checkbox-group @change="selectAllChange">
					<label class="select-all">
						<checkbox value="all" :checked="allSelected" />
						<text>Select All ({{ selectedCount }})</text>
					</label>
				</checkbox-group>
				<view class="sort-buttons">
					<text class="sort-icon">☰</text>
					<text class="sort-icon">☰</text>
				</view>
			</view>

			<!-- 词汇列表 -->
			<scroll-view class="word-list" scroll-y>
				<view
					v-for="(word, index) in words"
					:key="index"
					class="word-card"
				>
					<checkbox-group @change="wordSelectChange(index)">
						<label class="word-checkbox">
							<checkbox :value="index.toString()" :checked="word.selected" />
						</label>
					</checkbox-group>

					<view class="word-content">
						<view class="word-header">
							<text class="word-title">{{ word.word }}</text>
							<text class="word-tag" :class="word.tagClass">{{ word.tag }}</text>
						</view>
						<view class="word-phonetic">
							<text class="phonetic-text">{{ word.phonetic }}</text>
							<text class="speaker-icon" @tap="playPronunciation(word)">🔊</text>
						</view>
						<text class="word-definition">{{ word.definition }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-action">
			<button class="generate-btn" @tap="generateExercises">
				<text class="btn-icon">✨</text>
				<text>Generate Exercises ({{ selectedCount }})</text>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imagePath: '',
			totalWords: 48,
			scanDuration: 1.2,
			allSelected: false,
			selectedCount: 12,
			words: [
				{
					word: 'Sustainability',
					phonetic: '/səˌsteɪnəˈbɪləti/',
					definition: 'The ability to be maintained at a certain rate or level; ecological balance.',
					tag: 'IELTS',
					tagClass: 'tag-ielts',
					selected: true
				},
				{
					word: 'Comprehensive',
					phonetic: '/ˌkɒmprɪˈhensɪv/',
					definition: 'Complete and including everything that is necessary.',
					tag: 'PET',
					tagClass: 'tag-pet',
					selected: true
				},
				{
					word: 'Innovation',
					phonetic: '/ˌɪnəˈveɪʃən/',
					definition: 'A new method, idea, product, etc. resulting in improvement.',
					tag: 'KET',
					tagClass: 'tag-ket',
					selected: true
				},
				{
					word: 'Contextual',
					phonetic: '/kənˈtekstʃuəl/',
					definition: 'Relating to or depending on the context.',
					tag: 'NEW',
					tagClass: 'tag-new',
					selected: false
				}
			]
		}
	},
	onLoad(options) {
		if (options.image) {
			this.imagePath = decodeURIComponent(options.image);
			console.log('Image path for recognition:', this.imagePath);
			// TODO: 调用 AI 识别 API
			this.mockRecognition();
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		selectAllChange(e) {
			this.allSelected = !this.allSelected;
			this.words.forEach(word => {
				word.selected = this.allSelected;
			});
			this.updateSelectedCount();
		},
		wordSelectChange(index) {
			this.words[index].selected = !this.words[index].selected;
			this.updateSelectedCount();
			this.allSelected = this.words.every(word => word.selected);
		},
		updateSelectedCount() {
			this.selectedCount = this.words.filter(word => word.selected).length;
		},
		playPronunciation(word) {
			console.log('Play pronunciation for:', word.word);
			uni.showToast({
				title: '播放发音',
				icon: 'none'
			});
		},
		generateExercises() {
			if (this.selectedCount === 0) {
				uni.showToast({
					title: '请先选择词汇',
					icon: 'none'
				});
				return;
			}
			uni.showToast({
				title: `生成 ${this.selectedCount} 个词汇的练习`,
				icon: 'success'
			});
		},
		mockRecognition() {
			// 模拟 AI 识别过程
			console.log('Mock AI recognition completed');
		}
	}
}
</script>

<style scoped>
.page {
	background-color: #F8F9FA;
	min-height: 100vh;
	padding-top: 16rpx;
	padding-bottom: 160rpx;
}

/* 统计区域 */
.stats-section {
	background-color: #FFFFFF;
	padding: 32rpx;
	margin: 16rpx 32rpx;
	border-radius: 24rpx;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.stats-header {
	display: flex;
	justify-content: space-between;
}

.total-words {
	display: flex;
	flex-direction: column;
}

.stats-label {
	font-size: 24rpx;
	color: #6B7280;
	margin-bottom: 8rpx;
}

.stats-number {
	font-size: 72rpx;
	font-weight: bold;
	color: #2563EB;
}

.scan-status {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.status-badge {
	background-color: #DBEAFE;
	color: #2563EB;
	font-size: 22rpx;
	font-weight: 600;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	margin-bottom: 8rpx;
}

.scan-time {
	font-size: 24rpx;
	color: #9CA3AF;
}

/* 词汇列表区域 */
.words-section {
	margin: 0 32rpx;
}

.list-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.select-all {
	display: flex;
	align-items: center;
	gap: 16rpx;
	font-size: 28rpx;
	color: #1A1A1A;
	font-weight: 600;
}

.sort-buttons {
	display: flex;
	gap: 16rpx;
}

.sort-icon {
	font-size: 32rpx;
	color: #9CA3AF;
}

.word-list {
	height: calc(100vh - 600rpx);
}

.word-card {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 32rpx;
	margin-bottom: 16rpx;
	display: flex;
	gap: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.word-checkbox {
	padding-top: 8rpx;
}

.word-content {
	flex: 1;
}

.word-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.word-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1A1A1A;
}

.word-tag {
	font-size: 22rpx;
	font-weight: 600;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
}

.tag-ielts {
	background-color: #D1FAE5;
	color: #059669;
}

.tag-pet {
	background-color: #DBEAFE;
	color: #2563EB;
}

.tag-ket {
	background-color: #FEF3C7;
	color: #D97706;
}

.tag-new {
	background-color: #F3F4F6;
	color: #6B7280;
}

.word-phonetic {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 12rpx;
}

.phonetic-text {
	font-size: 28rpx;
	color: #2563EB;
}

.speaker-icon {
	font-size: 28rpx;
}

.word-definition {
	font-size: 28rpx;
	color: #6B7280;
	line-height: 1.6;
}

/* 底部按钮 */
.bottom-action {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 24rpx 32rpx;
	background-color: #F8F9FA;
	border-top: 1rpx solid #E5E7EB;
}

.generate-btn {
	background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
	color: #FFFFFF;
	height: 96rpx;
	border-radius: 20rpx;
	font-size: 32rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
}

.btn-icon {
	font-size: 36rpx;
}

button::after {
	border: none;
}
</style>
