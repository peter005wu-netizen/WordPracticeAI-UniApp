<template>
	
	<view class="container">
		<view class="header">
			<text class="title">My Word Bank</text>
			<text class="select-btn">Select</text>
		</view>
		<view class="search-box">
			<text class="search-icon">🔍</text>
			<text class="search-text">Search 1,284 words...</text>
		</view>
		<view class="content">
			<text class="placeholder">Library page content</text>
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
.select-btn {
	color: #2563EB;
	font-size: 32rpx;
}
.search-box {
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 24rpx 32rpx;
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
}
.search-icon {
	margin-right: 16rpx;
	font-size: 32rpx;
}
.search-text {
	color: #9CA3AF;
	font-size: 28rpx;
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
