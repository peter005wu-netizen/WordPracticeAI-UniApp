/**
 * 登录管理模块
 * 处理小程序的登录逻辑
 */

class LoginManager {
	constructor() {
		this.isLogining = false
		this.loginCode = null
		this.loginTime = null
	}

	/**
	 * 执行登录
	 * @returns {Promise} 返回 Promise，包含授权码
	 */
	login() {
		return new Promise((resolve, reject) => {
			// 防止并发调用
			if (this.isLogining) {
				console.warn('正在登录中，请勿重复调用')
				reject(new Error('正在登录中'))
				return
			}

			this.isLogining = true

			uni.login({
				success: (res) => {
					console.log('登录成功，code:', res.code)
					this.loginCode = res.code
					this.loginTime = Date.now()
					resolve(res)
				},
				fail: (err) => {
					console.error('登录失败:', err)
					reject(err)
				},
				complete: () => {
					this.isLogining = false
				}
			})
		})
	}

	/**
	 * 发送授权码到后端服务器
	 * @param {String} code - 微信授权码
	 * @param {String} serverUrl - 后端服务器地址
	 * @returns {Promise}
	 */
	async sendCodeToServer(code, serverUrl) {
		try {
			const response = await uni.request({
				url: serverUrl,
				method: 'POST',
				data: { code },
				header: {
					'Content-Type': 'application/json'
				}
			})

			console.log('登录请求结果:', response)
			
			if (response[1] && response[1].data) {
				// 保存返回的数据（如 token、openid 等）
				uni.setStorageSync('userInfo', response[1].data)
				return response[1].data
			}
			throw new Error('登录失败')
		} catch (error) {
			console.error('发送登录请求失败:', error)
			throw error
		}
	}

	/**
	 * 获取当前的授权码
	 * @returns {String|null}
	 */
	getCode() {
		return this.loginCode
	}

	/**
	 * 检查登录码是否过期（5分钟有效期）
	 * @returns {Boolean}
	 */
	isCodeExpired() {
		if (!this.loginTime) return true
		const now = Date.now()
		return (now - this.loginTime) > 5 * 60 * 1000
	}

	/**
	 * 重置登录状态
	 */
	reset() {
		this.isLogining = false
		this.loginCode = null
		this.loginTime = null
	}
}

// 导出单例
export default new LoginManager()
