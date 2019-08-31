/**
 * 项目结果的返回值，统一化
 */
module.exports = {
  /**
   * 判断某些字段的值不为undefined或空
   * @return 如果有空值 
   *  有空值 {String} 某个字段为空
   *  没有空值 {Boolean} false
   */
  checkExist(jsonObj) {
    for (let [key, value] of Object.entries(jsonObj)) {
      if (value === undefined || value === '') {
        return key + '字段为空';
      }
    }
    return false;
  },

  /**
   * 返回值
   * @param {*} 返回值
   * @param {Number} 返回status
   *  {status: code, data: 返回值}
   */
  _result(data = '成功', code = 200) {
    return {
      status: code,
      data: data
    }
  }
};
