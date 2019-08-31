/**
 * 项目结果的返回值，统一化
 */
module.exports = {
  /**
   * 判断某些字段的值不为undefined或空
   * @return 如果有空值 
   *  有空值 true
   *  没有空值 false
   */
  isUndefined(jsonObj){
    console.log('查看jsonObj');

    console.log(jsonObj);
    
  },

  /**
   * 返回值
   */
  _result(code= 200, data){

  }
};

 