<script>
	import config from '@/config/index.js'

	export default {
		data() {
			return {
				isLogining: false
			}
		},
		// 全局变量，可以通过 getApp().globalData 访问
		globalData: {
			openid: '',
			token: '',
			userInfo: null
		},
		onLaunch: function() {
			console.log('App Launch')
			this.login()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			/**
			 * 小程序登录
			 * 无需用户授权，静默调用
			 * code 有效期 5 分钟，只能使用一次
			 */
			login() {
				// 加锁，防止并发调用
				if (this.isLogining) {
					console.log('正在登录中，请勿重复调用')
					return
				}

				this.isLogining = true

				uni.login({
					success: (res) => {
						console.log('登录成功，code:', res.code)
						// 这里发送 code 到后端服务器
						this.sendCodeToServer(res.code)
					},
					fail: (err) => {
						console.error('登录失败:', err)
					},
					complete: () => {
						// 完成后解除锁
						this.isLogining = false
					}
				})
			},

			/**
			 * 发送授权码到后端，换取 token 和 openId
			 * @param {String} code - 微信授权码
			 */
			sendCodeToServer(code) {
				uni.request({
					url: `${config.BASE_URL}/api/login`,
					method: 'POST',
					data: { code },
					success: (res) => {
						console.log('登录结果:', res.data)
						const data = res.data
						if (data && data.token) {
							uni.setStorageSync('token', data.token)
							this.globalData.token = data.token
						}
						if (data && data.openId) {
							uni.setStorageSync('openid', data.openId)
							this.globalData.openid = data.openId
						}

						// 保存用户信息（头像和昵称）
						if (data && data.userData && data.userData.attributeColumns) {
							const attrs = data.userData.attributeColumns
							const userInfo = {
								nickName: attrs.NickName?.value || '未登录',
								avatarUrl: attrs.AvatarUrl?.value || ''
							}
							console.log('保存用户信息:', userInfo)
							uni.setStorageSync('userInfo', userInfo)
							this.globalData.userInfo = userInfo
						}
					},
					fail: (err) => {
						console.error('发送code到服务器失败:', err)
					}
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
