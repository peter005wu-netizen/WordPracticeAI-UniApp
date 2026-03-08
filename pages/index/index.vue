<template>
	<view class="page">
		<!-- Custom Navigation Bar -->
		<view class="custom-navbar">
			<view class="navbar-content">
				<view class="user-info">
					<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="avatar-btn">
						<image class="avatar" :src="avatarUrl || '/static/avatar.png'" mode="aspectFill"></image>
					</button>
					<view class="user-text">
						<input
							type="nickname"
							class="user-name-input"
							:value="userName"
							placeholder="点击输入昵称"
							@blur="onNicknameChange"
						/>
						<text class="user-level">ACADEMIC LEVEL: SENIOR</text>
					</view>
				</view>
				<view class="notification-icon">
					<text class="icon">🔔</text>
				</view>
			</view>
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

			<!-- Bottom Spacing for TabBar -->
			<view style="height: 40rpx;"></view>
		</scroll-view>
	</view>
</template>

<script>
import { updateUserProfile } from '@/api/user.js'
import config from '@/config/index.js'

export default {
	data() {
		return {
			userName: '未登录',
			avatarUrl: ''
		}
	},
	onShow() {
		// 每次页面显示时从缓存读取用户信息dd
		const info = uni.getStorageSync('userInfo');
		if (info && info.nickName) {
			this.userName = info.nickName;
			this.avatarUrl = info.avatarUrl || '';
		} else {
			const app = getApp();
			if (app && app.globalData && app.globalData.userInfo) {
				this.userName = app.globalData.userInfo.nickName || '未登录';
				this.avatarUrl = app.globalData.userInfo.avatarUrl || '';
			}
		}
	},
	methods: {
		/**
		 * 昵称输入完成事件
		 */
		async onNicknameChange(e) {
			const newNickname = e.detail.value.trim();

			if (!newNickname) {
				uni.showToast({
					title: '昵称不能为空',
					icon: 'none'
				});
				return;
			}

			// 更新显示
			this.userName = newNickname;

			// 获取用户 openid
			const app = getApp();
			const userId = uni.getStorageSync('openid') || (app && app.globalData && app.globalData.openid);

			// 保存到本地缓存
			const userInfo = {
				nickName: newNickname,
				avatarUrl: this.avatarUrl
			};
			uni.setStorageSync('userInfo', userInfo);

			// 同步到全局数据
			if (app && app.globalData) {
				app.globalData.userInfo = userInfo;
			}

			// 如果有 userId，同步到服务器
			if (userId) {
				try {
					await updateUserProfile({
						userId: userId,
						nickName: newNickname,
						avatarUrl: null // 头像不变
					});
					uni.showToast({
						title: '昵称已保存',
						icon: 'success'
					});
				} catch (error) {
					console.error('保存昵称到服务器失败:', error);
t				// 显示友好的错误提示，但不阻断用户操作
					uni.showToast({
						title: '同步到服务器失败，数据已保存到本地',
						icon: 'none',
						duration: 2000
					});
				}
			}
		},

		/**
		 * 上传头像到服务器
		 * @param {String} tempFilePath - 临时文件路径
		 * @returns {Promise<String>} 返回服务器返回的头像 URL
		 */
		async uploadAvatarToServer(tempFilePath) {
			return new Promise((resolve, reject) => {
				// 从本地存储获取token
				const token = uni.getStorageSync('token');

				if (!token) {
					reject(new Error('未登录'));
					return;
				}

				// 获取 openid
				const app = getApp();
				const openid = uni.getStorageSync('openid') ||
				               (app && app.globalData && app.globalData.openid);

				if (!openid) {
					reject(new Error('未获取到用户ID'));
					return;
				}

				const uploadUrl = `${config.BASE_URL}/api/user/avatar`;
				console.log('准备上传到:', uploadUrl);
				uni.uploadFile({
					url: uploadUrl,
					filePath: tempFilePath,
					name: 'file',
					formData: {
						openid: openid  // 传递 openid，服务器端用作文件名
					},
					header: {
						'Authorization': `Bearer ${token}`
					},
					success: (res) => {
						console.log('上传成功，状态码:', res.statusCode);
						console.log('响应数据:', res.data);
						if (res.statusCode === 200) {
							const data = JSON.parse(res.data);
							resolve(data.avatarUrl);
							reject(new Error('登录已过期，请重新登录'));
						} else {
							reject(new Error(`上传失败，状态码: ${res.statusCode}`));
						}
					},
					fail: (err) => {
						console.error('=== 上传失败 ===');
						console.error('错误对象:', JSON.stringify(err));
						console.error('请求 URL:', uploadUrl);
						console.error('文件路径:', tempFilePath);
						console.error('token:', token ? '已设置' : '未设置');
						console.error('openid:', openid);
						console.error('config.BASE_URL:', config.BASE_URL);
						reject(err);
					}
				});
			});
		},

		async onChooseAvatar(e) {

			// 用户选择头像
			const tempAvatarUrl = e.detail.avatarUrl;

			// 先用临时路径做页面预览
			this.avatarUrl = tempAvatarUrl;

			// 获取用户的 token
			const token = uni.getStorageSync('token');


			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}

			try {
				uni.showLoading({ title: '上传中...' });

				// 1. 上传到服务器，获取永久 URL
				const permanentUrl = await this.uploadAvatarToServer(tempAvatarUrl);

				// 2. 使用永久 URL 更新本地显示
				this.avatarUrl = permanentUrl;

				// 3. 持久化到本地缓存
				uni.setStorageSync('userInfo', {
					nickName: this.userName,
					avatarUrl: permanentUrl
				});

				// 4. 同步到全局数据
				const app = getApp();
				if (app && app.globalData) {
					app.globalData.userInfo = {
						nickName: this.userName,
						avatarUrl: permanentUrl
					};
				}

				// 5. 保存头像URL到后端数据库
				const userId = uni.getStorageSync('openid') || (app && app.globalData && app.globalData.openid);
				if (userId) {
					try {
					await updateUserProfile({
							userId: userId,
							nickName: null, // 昵称不变
							avatarUrl: permanentUrl // 更新头像URL
						});
					} catch (error) {
						console.error('保存头像URL到服务器失败:', error);
					// 显示友好的错误提示，但不阻断用户操作
						uni.showToast({
							title: '同步到服务器失败，数据已保存到本地',
							icon: 'none',
							duration: 2000
						});

t			}
				uni.hideLoading();
				uni.showToast({
					title: '头像更新成功',
					icon: 'success'
				});
			} catch (error) {
				uni.hideLoading();
				console.error('更新头像失败:', error);
				uni.showToast({
					title: error.message || '头像更新失败',
					icon: 'none'
				});
			}
		},
		handleAvatarClick() {
			console.log('=== handleAvatarClick 被调用（备用方案）===');
			// 如果 open-type="chooseAvatar" 不工作，使用传统方式
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					console.log('chooseImage 成功:', res);
					// 模拟 chooseavatar 事件的数据结构
					this.onChooseAvatar({
						detail: {
							avatarUrl: res.tempFilePaths[0]
						}
					});
				},
				fail: (err) => {
					console.error('chooseImage 失败:', err);
					uni.showToast({
						title: '选择图片失败',
						icon: 'none'
					});
				}
			});
		},
		handleCameraScan() {
			// 使用相机拍照
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'], // 只使用相机
				success: (res) => {
					const imagePath = res.tempFilePaths[0];
					// 拍照后直接跳转到词汇识别页面
					uni.navigateTo({
						url: `/pages/scan/RecognitionPage?image=${encodeURIComponent(imagePath)}`
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
}

.navbar-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 32rpx;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.avatar-btn {
	padding: 0;
	border: none;
	background: none;
	width: 96rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	background-color: #E5E7EB;
}

.user-text {
	display: flex;
	flex-direction: column;
}

.user-name-input {
	font-size: 36rpx;
	font-weight: bold;
	color: #1A1A1A;
	margin-bottom: 4rpx;
	padding: 8rpx 0;
}

.user-level {
	font-size: 22rpx;
	color: #6B7280;
	letter-spacing: 0.5px;
}

.notification-icon {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.notification-icon .icon {
	font-size: 44rpx;
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
