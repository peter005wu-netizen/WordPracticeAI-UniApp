<template>
	<view class="container">
		<view class="header">
			<text class="title">Settings</text>
			<text class="save-btn">Save</text>
		</view>
		<view class="content">
			<text class="placeholder">Settings page content</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
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
</style>
