<template>
	<view class="container">
		<view class="header">
			<text class="title">Settings</text>
			<text class="save-btn">Save</text>
		</view>
		
		<!-- 用户信息区域 -->
		<view class="user-info-section">
			<view class="user-card">
				<view class="user-avatar" @click="updateUserAvatar">
					<image :src="userInfo.avatarUrl || '/static/default-avatar.png'" mode="aspectFill" class="avatar-img"></image>
					<view class="change-overlay">
						<text class="overlay-text">点击更换头像</text>
					</view>
				</view>
				<view class="user-details" @click="updateUserNickname">
					<text class="username">{{ userInfo.nickName || '点击设置昵称' }}</text>
					<text class="user-id">ID: {{ userInfo.openId || '未登录' }}</text>
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

export default {
	data() {
		return {
			userInfo: {
				nickName: '',
				avatarUrl: '',
				openId: ''
			}
		}
	},
	onLoad() {
		this.loadUserInfo()
	},
	methods: {
		/**
		 * 加载用户信息
		 */
		loadUserInfo() {
			const userInfo = uni.getStorageSync('userInfo') || {}
			this.userInfo = {
				nickName: userInfo.nickName || '',
				avatarUrl: userInfo.avatarUrl || '',
				openId: userInfo.openId || userInfo.userId || ''
			}
		},

		/**
		 * 更新用户头像
		 */
		async updateUserAvatar() {
			try {
				// 获取用户微信头像
				const userInfo = await this.getWechatUserInfo()
				
				if (userInfo) {
					// 更新本地状态
					this.userInfo.avatarUrl = userInfo.avatarUrl
					
					// 准备发送到后端的数据
					const payload = {
						UserId: this.userInfo.openId,
						AvatarUrl: userInfo.avatarUrl,
						NickName: this.userInfo.nickName || userInfo.nickName
					}
					
					// 发送到后端
					await updateUserProfile(payload)
					uni.showToast({ title: '头像更新成功', icon: 'success' })
				}
			} catch (error) {
				console.error('更新头像失败:', error)
				uni.showToast({ title: '更新失败', icon: 'none' })
			}
		},

		/**
		 * 更新用户昵称
		 */
		async updateUserNickname() {
			try {
				// 获取用户微信昵称
				const userInfo = await this.getWechatUserInfo()
				
				if (userInfo) {
					// 更新本地状态
					this.userInfo.nickName = userInfo.nickName
					
					// 准备发送到后端的数据
					const payload = {
						UserId: this.userInfo.openId,
						AvatarUrl: this.userInfo.avatarUrl || userInfo.avatarUrl,
						NickName: userInfo.nickName
					}
					
					// 发送到后端
					await updateUserProfile(payload)
					uni.showToast({ title: '昵称更新成功', icon: 'success' })
				}
			} catch (error) {
				console.error('更新昵称失败:', error)
				uni.showToast({ title: '更新失败', icon: 'none' })
			}
		},

		/**
		 * 获取微信用户信息
		 */
		getWechatUserInfo() {
			return new Promise((resolve, reject) => {
				// 需要用户授权才能获取用户信息
				uni.getUserProfile({
					desc: '用于完善用户资料',
					success: (res) => {
						const userInfo = res.userInfo
						resolve({
							nickName: userInfo.nickName,
							avatarUrl: userInfo.avatarUrl
						})
					},
					fail: (error) => {
						console.error('获取用户信息失败:', error)
						uni.showModal({
							title: '提示',
							content: '需要授权才能获取您的用户信息',
							showCancel: false
						})
						reject(error)
					}
				})
			})
		}
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx 32rpx;
	background-color: #F8F9FA;
	min-height: 100vh;
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}
.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #1A1A1A;
}
.save-btn {
	color: #2563EB;
	font-size: 32rpx;
}
.content {
	padding: 40rpx;
	text-align: center;
}
.placeholder {
	color: #9CA3AF;
	font-size: 28rpx;
}

/* 新增的用户信息样式 */
.user-info-section {
	margin-bottom: 40rpx;
}

.user-card {
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 40rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	overflow: hidden;
	position: relative;
	margin-right: 30rpx;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.change-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	opacity: 0;
	transition: opacity 0.3s;
}

.user-avatar:hover .change-overlay {
	opacity: 1;
}

.overlay-text {
	color: white;
	font-size: 24rpx;
	text-align: center;
}

.user-details {
	flex: 1;
}

.username {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #1A1A1A;
	margin-bottom: 10rpx;
}

.user-id {
	display: block;
	font-size: 28rpx;
	color: #6B7280;
}
</style>