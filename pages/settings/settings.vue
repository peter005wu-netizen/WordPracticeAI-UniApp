<template>
	<view class="container">
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
			</view>
		</view>

		<view class="content">
			<text class="placeholder">Settings page content</text>
		</view>
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
		// 每次页面显示时从缓存读取用户信息
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
					// 显示友好的错误提示，但不阻断用户操作
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
					}
				}
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
		}
	}
}
</script>

<style scoped>
.container {
	background-color: #F8F9FA;
	min-height: 100vh;
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

.content {
	padding: 40rpx;
	text-align: center;
}

.placeholder {
	color: #9CA3AF;
	font-size: 28rpx;
}
</style>