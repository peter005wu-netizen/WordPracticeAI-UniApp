/**
 * 获取存储的 token
 */
export const getToken = () => uni.getStorageSync('token');

/**
 * 获取用户 ID (openid)
 */
export const getUserId = () => {
	const app = getApp();
	return uni.getStorageSync('openid') || app?.globalData?.openid;
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
	const cached = uni.getStorageSync('userInfo');
	if (cached) return cached;

	const app = getApp();
	return app?.globalData?.userInfo;
};

/**
 * 保存用户信息到缓存和全局
 */
export const saveUserInfo = (userInfo) => {
	uni.setStorageSync('userInfo', userInfo);
	const app = getApp();
	if (app?.globalData) {
		app.globalData.userInfo = userInfo;
	}
};
