<template>
	<view class="page" >
		<!-- 统计信息区域 -->
		<view class="stats-section">
			<view class="stats-header">
				<view class="total-words">
					<text class="stats-label">Total Identified Words</text>
					<text class="stats-number">{{ selectedCount }}</text>
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
						<text class="word-title">{{ word.word }}</text>
						<text v-if="word.phonetic" class="phonetic-text">{{ word.phonetic }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 练习类型选择 -->
		<view class="exercise-types">
			<text class="types-label">Exercise Types:</text>
			<view class="types-options">
				<checkbox-group class="types-grid" @change="exerciseTypeChange">
					<label class="type-option">
						<checkbox value="cn2en" :checked="exerciseTypes.cn2en" />
						<text>默写题</text>
					</label>					
					<label class="type-option">
						<checkbox value="fillBlank" :checked="exerciseTypes.fillBlank" />
						<text>填空题</text>
					</label>
					<label class="type-option">
						<checkbox value="reading" :checked="exerciseTypes.reading" />
						<text>阅读题</text>
					</label>
					<label class="type-option">
						<checkbox value="matching" :checked="exerciseTypes.matching" />
						<text>连线题</text>
					</label>
					<label class="type-option">
						<checkbox value="single-choice" :checked="exerciseTypes.singleChoice" />
						<text>选择题</text>
					</label>
					<label class="type-option">
						<checkbox value="translation" :checked="exerciseTypes.translation" />
						<text>翻译句子</text>
					</label>
				</checkbox-group>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-action">
			<button class="generate-btn" @tap="generateExercises">
				<text class="btn-icon">✨</text>
				<text>Generate Exercises </text>
			</button>
		</view>
	</view>
</template>

<script>
import { analyzeImage as analyzeImageAPI, generateExercises as generateExercisesAPI } from '../../api/image.js';

export default {
	data() {
		return {
			imagePath: '',
			imageTitle: '',
			totalWords: 0,
			scanDuration: 0,
			allSelected: true,
			selectedCount: 0,
			exerciseTypes: {
				cn2en: true,
				en2cn: true,
				fillBlank: true,
				reading: true,
				matching: true,
				singleChoice: true,
				translation: true
			},
			words: []
		}
	},
	onLoad(options) {
		console.log('RecognitionPage onLoad called');
		console.log('Options received:', options);
		console.log('options.image:', options.image);

		// 从缓存中加载用户上次的练习类型选择
		try {
			const savedExerciseTypes = uni.getStorageSync('exerciseTypes');
			if (savedExerciseTypes) {
				this.exerciseTypes = savedExerciseTypes;
				console.log('Loaded saved exercise types:', savedExerciseTypes);
			}
		} catch (e) {
			console.error('Failed to load exercise types from storage:', e);
		}

		if (options.image) {
			this.imagePath = decodeURIComponent(options.image);
			console.log('Image path for recognition:', this.imagePath);
			// 调用 AI 识别 API
			this.analyzeImage();
		} else {
			console.warn('No image parameter received in onLoad');
			uni.showToast({
				title: 'No image provided',
				icon: 'none',
				duration: 2000
			});
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		exerciseTypeChange(e) {
			const values = e.detail.value;
			this.exerciseTypes = {
				cn2en: values.includes('cn2en'),
				en2cn: values.includes('en2cn'),
				fillBlank: values.includes('fillBlank'),
				reading: values.includes('reading'),
				matching: values.includes('matching'),
				singleChoice: values.includes('single-choice'),
				translation: values.includes('translation')
			};

			// 保存用户的选择到缓存
			try {
				uni.setStorageSync('exerciseTypes', this.exerciseTypes);
				console.log('Saved exercise types to storage:', this.exerciseTypes);
			} catch (e) {
				console.error('Failed to save exercise types to storage:', e);
			}
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

			// 收集选中的单词
			const selectedWords = this.words.filter(word => word.selected);

			// 提取单词字符串数组
			const wordsArray = selectedWords.map(w => w.word);

			// 显示加载提示
			uni.showLoading({
				title: '正在生成练习题，请稍候...',
				mask: true
			});

			// 调用 API 生成练习题
			generateExercisesAPI(wordsArray, this.exerciseTypes, this.imageTitle)
				.then((result) => {
					uni.hideLoading();

					console.log('=== Generate exercises success ===');
					console.log('Response:', result);

					// 验证响应数据是否包含练习题
					if (result.data && (result.data.PdfUrl || result.data.Content)) {
						uni.showToast({
							title: '练习题生成成功',
							icon: 'success',
							duration: 2000
						});

						// TODO: 处理 PDF URL 或跳转到练习页面
						if (result.data.PdfUrl) {
							console.log('PDF URL:', result.data.PdfUrl);
						}
					} else {
						console.error('Invalid response: missing PdfUrl or Content');
						uni.showToast({
							title: '生成失败，请重试',
							icon: 'none',
							duration: 2000
						});
					}
				})
				.catch((error) => {
					uni.hideLoading();

					console.error('Generate exercises failed:', error);

					uni.showToast({
						title: error.message || '生成练习题失败，请重试',
						icon: 'none',
						duration: 2000
					});
				});
		},
		analyzeImage() {
			// 显示加载提示
			uni.showLoading({
				title: 'Analyzing image...',
				mask: true
			});

			// 调用 API 分析图片
			analyzeImageAPI(this.imagePath)
				.then((result) => {
					uni.hideLoading();

					console.log('=== API Response Debug ===');
					console.log('Full result:', JSON.stringify(result));
					console.log('result.data:', result.data);
					console.log('result.data.data:', result.data ? result.data.data : 'undefined');
					console.log('detected_words:', result.data && result.data.data ? result.data.data.detected_words : 'undefined');

					// 更新扫描时长
					this.scanDuration = result.duration;

					// 处理服务器返回的词汇数据
					// 服务器返回格式: { data: { image_title: "...", detected_words: [...] }, usage: {...} }
					if (result.data && result.data.data && result.data.data.detected_words) {
						const detectedWords = result.data.data.detected_words;
						const image_title = result.data.data.image_title;

						// 保存 image_title
						this.imageTitle = image_title || '';

						console.log('Detected words array:', detectedWords);
						console.log('Array length:', detectedWords.length);
						console.log('Image title:', this.imageTitle);

						this.words = detectedWords.map(word => ({
							word: word,
							phonetic: '',
							selected: true
						}));

						console.log('Mapped words:', this.words);
						console.log('this.words length:', this.words.length);

						this.updateSelectedCount();
						this.totalWords = this.words.length;

						console.log('selectedCount:', this.selectedCount);
						console.log('totalWords:', this.totalWords);
					} else {
						console.error('Data structure mismatch!');
						console.error('result.data exists?', !!result.data);
						console.error('result.data.data exists?', result.data ? !!result.data.data : false);
						console.error('detected_words exists?', result.data && result.data.data ? !!result.data.data.detected_words : false);
					}

					uni.showToast({
						title: 'Analysis complete',
						icon: 'success',
						duration: 1500
					});
				})
				.catch((error) => {
					uni.hideLoading();

					console.error('Image analysis failed:', error);

					uni.showToast({
						title: error.message || 'Analysis failed',
						icon: 'none',
						duration: 2000
					});
				});
		}
	}
}
</script>

<style scoped>
.page {
	background-color: #F8F9FA;
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

/* 统计区域 */
.stats-section {
	background-color: #FFFFFF;
	padding: 32rpx;
	margin: 16rpx 32rpx 0;
	border-radius: 24rpx;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
	flex-shrink: 0;
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
	font-size: 32rpx;
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
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.list-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
	flex-shrink: 0;
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
	flex: 1;
	height: 0;
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
	display: flex;
	align-items: center;
	gap: 16rpx;
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
	color: #6B7280;
}

.speaker-icon {
	font-size: 28rpx;
}

.word-definition {
	font-size: 28rpx;
	color: #6B7280;
	line-height: 1.6;
}

/* 练习类型选择 */
.exercise-types {
	background-color: #FFFFFF;
	padding: 24rpx 32rpx;
	margin: 16rpx 32rpx 0;
	border-radius: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	flex-shrink: 0;
}

.types-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}

.types-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.type-option {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 28rpx;
	color: #374151;
}

/* 底部按钮 */
.bottom-action {
	padding: 24rpx 32rpx;
	background-color: #F8F9FA;
	border-top: 1rpx solid #E5E7EB;
	flex-shrink: 0;
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
