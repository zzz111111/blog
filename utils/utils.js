/**
 * 项目工具包
 */
const crypto = require('crypto');

/**
 * 密码的加密
 * @param {String} 要加密的字符串
 * 
 * @return {String} 返回加密结果
 */
exports.encryption = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
};


/**
 * 返回格式化时间
 */

