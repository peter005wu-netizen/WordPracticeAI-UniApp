import config from '../config/index.js';

/**
 * 分析图片中的词汇
 * @param {string} imagePath - 图片文件路径
 * @returns {Promise} 返回包含词汇列表和请求时长的Promise
 */
export function analyzeImage(imagePath) {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();

		// 获取 token
		const token = uni.getStorageSync('token');
		if (!token) {
			reject({
				error: 'No token',
				message: '请先登录'
			});
			return;
		}

		// 读取图片文件并转换为 base64
		const fs = uni.getFileSystemManager();
		fs.readFile({
			filePath: imagePath,
			encoding: 'base64',
			success: (res) => {
				const base64Data = res.data;
				console.log('Image converted to base64, length:', base64Data.length);

				// 发送到服务器
				uni.request({
					url: `${config.BASE_URL}/analyze-image`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: {
						imageUrl: null,
						base64Data: base64Data
					},
					success: (response) => {
						const endTime = Date.now();
						const duration = ((endTime - startTime) / 1000).toFixed(2);

						console.log('Server response:', response.data);
						console.log('Request duration:', duration, 'seconds');

						resolve({
							data: response.data,
							duration: duration
						});
					},
					fail: (err) => {
						const endTime = Date.now();
						const duration = ((endTime - startTime) / 1000).toFixed(2);

						console.error('Request failed:', err);
						console.log('Request duration:', duration, 'seconds');

						reject({
							error: err,
							duration: duration
						});
					}
				});
			},
			fail: (err) => {
				console.error('Failed to read image:', err);
				reject({
					error: err,
					message: 'Failed to read image file'
				});
			}
		});
	});
}

/**
 * 生成练习题
 * @param {Array} words - 单词数组
 * @param {Object} exerciseTypes - 练习类型对象
 * @param {string} imageTitle - 图片标题
 * @returns {Promise} 返回生成的练习题
 */
export function generateExercises(words, exerciseTypes, imageTitle) {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();

		// 获取 token
		const token = uni.getStorageSync('token');
		console.log('=== Token Debug ===');
		console.log('Token retrieved:', token);
		console.log('Token type:', typeof token);
		console.log('Token length:', token ? token.length : 0);

		if (!token) {
			reject({
				error: 'No token',
				message: '请先登录'
			});
			return;
		}

		// 转换 exerciseTypes 对象为数组
		const exerciseTypesArray = Object.keys(exerciseTypes).filter(key => exerciseTypes[key]);

		console.log('=== Sending generate exercises request ===');
		console.log('Words:', words);
		console.log('Exercise types:', exerciseTypesArray);
		console.log('Image title:', imageTitle);
		console.log('Authorization header:', `Bearer ${token}`);

		// 发送到服务器
		uni.request({
			url: `${config.BASE_URL}/generate-exercises`,
			method: 'POST',
			timeout: 60000, // 60秒超时
			header: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			data: {
				words: words,
				exerciseTypes: exerciseTypesArray,
				language: '中文',
				customRequirements: null
			},
			success: (response) => {
				const endTime = Date.now();
				const duration = ((endTime - startTime) / 1000).toFixed(2);

				console.log('Generate exercises response:', response.data);
				console.log('Request duration:', duration, 'seconds');

				resolve({
					data: response.data,
					duration: duration
				});
			},
			fail: (err) => {
				const endTime = Date.now();
				const duration = ((endTime - startTime) / 1000).toFixed(2);

				console.error('Generate exercises failed:', err);
				console.log('Request duration:', duration, 'seconds');

				reject({
					error: err,
					duration: duration,
					message: 'Failed to generate exercises'
				});
			}
		});
	});
}
