<script>
	export default {
		data() {
			return {
				isLogining: false
			}
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
			 * 发送授权码到后端
			 * @param {String} code - 微信授权码
			 */
			sendCodeToServer(code) {
				//TODO: 调用后端接口，使用 code 换取 session_key 和 openid
				//示例：
				uni.request({
				  url: 'http://localhost:5007/api/login',
				  method: 'POST',
				  data: { code },
				  success: (res) => {
				    console.log('登录结果:', res.data)
				    // 保存 token 或 session
				  }
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
