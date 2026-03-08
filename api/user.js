import config from '@/config/index.js'

/**
 * 上传头像文件
 * @param {String} filePath - 本地文件路径
 * @param {String} userId - 用户ID (OpenID)
 */
export function uploadAvatar(filePath, userId) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${config.BASE_URL}/api/user/avatar`,
      filePath: filePath,
      name: 'avatar',
      formData: {
        userId: userId
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          resolve(data)
        } else {
          reject(new Error(`Upload failed with status ${res.statusCode}`))
        }
      },
      fail: (err) => {
        console.error('上传头像失败:', err)
        reject(err)
      }
    })
  })
}

/**
 * 更新用户资料
 * @param {Object} data - 用户资料对象
 * @param {String} data.userId - 用户ID (必填)
 * @param {String|null} data.avatarUrl - 头像URL (null 表示不更新)
 * @param {String|null} data.nickName - 昵称 (null 表示不更新)
 * @returns {Promise<Object>} 返回更新后的用户信息
 *
 * @note 后端 API 约定：传递 null 值表示不更新该字段
 */
export function updateUserProfile(data) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${config.BASE_URL}/api/user/profile`,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('更新用户信息成功:', res.data)
          resolve(res.data)
        } else {
          reject(new Error(`Update failed with status ${res.statusCode}`))
        }
      },
      fail: (err) => {
        console.error('更新用户信息失败:', err)
        reject(err)
      }
    })
  })
}