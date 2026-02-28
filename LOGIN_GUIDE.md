# 小程序登录系统使用说明

## 功能特性

✅ 应用启动时自动触发登录  
✅ 防并发机制（锁），避免重复调用  
✅ 无需用户授权，静默调用 `wx.login`  
✅ 支持自定义后端服务集成  

## 登录流程

```
App.vue onLaunch
    ↓
this.login() - 执行登录
    ↓
uni.login() 获取授权码 (code)
    ↓
sendCodeToServer(code) - 发送到后端
    ↓
后端使用 code 换取 session_key 和 openid
    ↓
返回 token/结果到前端
```

## 方式 1: 直接在 App.vue 使用（当前实现）

App.vue 中已配置：
- `isLogining`: 防并发的锁
- `login()`: 登录方法
- `sendCodeToServer()`: 发送授权码到后端

### 配置后端接口

修改 `App.vue` 中的 `sendCodeToServer` 方法：

```javascript
sendCodeToServer(code) {
  uni.request({
    url: 'https://your-server.com/api/login',
    method: 'POST',
    data: { code },
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      console.log('登录成功:', res.data)
      // 保存返回的用户信息或 token
      uni.setStorageSync('userToken', res.data.token)
      uni.setStorageSync('userInfo', res.data)
    },
    fail: (err) => {
      console.error('请求失败:', err)
    }
  })
}
```

## 方式 2: 使用独立登录管理器（utils/login.js）

如果需要在其他页面重新调用登录或管理登录状态：

```javascript
// 在任何页面引入
import loginManager from '@/utils/login.js'

// 执行登录
loginManager.login().then((res) => {
  console.log('授权码:', res.code)
  // 发送到后端
  return loginManager.sendCodeToServer(res.code, 'https://your-server.com/api/login')
}).then((data) => {
  console.log('登录完成:', data)
}).catch((err) => {
  console.error('登录失败:', err)
})

// 或使用 async/await
async function handleLogin() {
  try {
    const res = await loginManager.login()
    const result = await loginManager.sendCodeToServer(res.code, serverUrl)
    console.log('用户登录成功:', result)
  } catch (error) {
    console.error('登录出错:', error)
  }
}
```

## 后端接入示例（Node.js/Express）

```javascript
const axios = require('axios')

app.post('/api/login', async (req, res) => {
  const { code } = req.body
  const appid = 'your_app_id'
  const secret = 'your_app_secret'

  try {
    // 调用微信接口获取 session_key 和 openid
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    })

    const { session_key, openid, errcode, errmsg } = response.data

    if (errcode) {
      return res.status(400).json({ errcode, errmsg })
    }

    // 这里可以：
    // 1. 创建或更新数据库中的用户记录
    // 2. 生成 JWT token
    const token = generateToken(openid)

    res.json({
      token,
      openid,
      sessionKey: session_key,
      message: '登录成功'
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ message: '登录失败' })
  }
})
```

## 常见问题

### Q: code 可以重复使用吗？
A: 不可以。每次 `wx.login()` 返回的 code 只能使用一次，有效期 5 分钟。

### Q: 如何在登录后获取用户信息（头像、昵称等）？
A: 需要用户授权调用 `wx.getUserProfile()` 或 `uni.getUserProfile()`

### Q: 能否跳过登录直接访问页面？
A: 可以。根据后端返回结果判断，如果无效则重新登录。

### Q: 多个页面如何共享登录状态？
A: 使用 Pinia/Vuex 状态管理，或通过 `uni.setStorageSync()` 保存 token

## 相关资料

- [微信API: wx.login](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)
- [Uni-app: uni.login](https://uniapp.dcloud.io/api/plugins/login.html)
