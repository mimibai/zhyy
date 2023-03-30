
// api/models/user.js
export default ($axios) => {
  return {
    // signIn 密码登录
    login (data) {
      return $axios.post('/sign_in', data)
    },
    // 修改密码
    getSecondpwd (data) {
      return $axios.post('/api/getSecondpwd', data)
    },

    updateSecondpwd (data) {
      return $axios.post('/api/updateSecondpwd', data)
    },
    // 手机号登录
    mobileLogin (data) {
      // return $axios.post('/api/mobileLogin', data)
      return $axios.post('/api/mobileLogin', data)
    },
    // 生成手机动态码（手机号登录或通过手机号绑定时使用）
    GeneratePhonecode (data) {
      return $axios.post('/api/GeneratePhonecode', data)
    },
    // 获取系统支持登录方式
    getLogonType (data) {
      return $axios.post('/api/getLogonType', data)
    },
    // 获取登录二维码
    getWeiChatQrCode (data) {
      return $axios.post('/api/WeiXin_GetQrCode', data)
    },
    // 二维码扫描
    checkScanResult (data) {
      return $axios.post('/api/WeiXin_GetQrCode', data)
    }
    // // 生成手机动态码（手机号登录或通过手机号绑定时使用）
    // Generatecode (data) {
    //   return $axios.post('/api/Generatecode', data)
    // }
  }
}
