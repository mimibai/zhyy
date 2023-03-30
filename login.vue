<template>
  <div class="login">
    <div class="login-container">
      <div class="login-container-codebox">
        <el-row
          type="flex"
          justify="space-around"
          class="login-box"
        >
          <el-col
            v-if="isOpenWeiXinLogin"
            v-loading="qrCodeLoading"
            :span="10"
          >
            <div class="">
              <h4 class="login-container-codebox-tite">
                微信登录
              </h4>
              <div class="login-container-codebox-code">
                <div class="login-container-codebox-imgcon">
                  <img
                    :src="qrCodeUrl"
                    alt="微信扫一扫登录"
                  >
                </div>
              </div>
              <div class="login-container-codebox-desc">
                <p>请使用微信扫描二维码登录</p>
                <p>智慧医院</p>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <el-tabs v-model="LoginName">
              <el-tab-pane label="普通登录" name="patientFirst">
                <el-form
                  ref="loginForm"
                  class="login-form"
                  auto-complete="on"
                  label-position="left"
                  :rules="rules"
                  :model="loginForm"
                >
                  <el-form-item prop="userName">
                    <!-- <span class="svg-container">
                      <svg-icon icon-class="user" />
                    </span>-->
                    <el-input
                      ref="username"
                      v-model="loginForm.userName"
                      placeholder="用户名"
                      name="username"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <!-- <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>-->
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="loginForm.password"
                      :type="passwordType"
                      placeholder="密码"
                      name="password"
                      tabindex="2"
                      auto-complete="on"
                      @keyup.enter.native="handleLogin"
                    />
                    <!-- <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
                    </span>-->
                  </el-form-item>

                  <el-button
                    :loading="loading"
                    type="primary"
                    style="width: 100%; margin-bottom: 30px"
                    @click.native.prevent="handleLogin"
                  >
                    登录
                  </el-button>
                  <div class="tips">
                    <span>
                      <router-link key="register" to="/register">注册</router-link>
                    </span>
                  </div>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="手机号码登录" name="patientSecond">
                <el-form
                  ref="loginMobileForm"
                  :model="loginMobileForm"
                  :rules="rules"
                  class="login-form"
                  auto-complete="on"
                  label-position="left"
                >
                  <el-form-item prop="mobileNumber">
                    <!-- <span class="svg-container">
                      <svg-icon icon-class="phone" />
                    </span>-->
                    <el-input
                      ref="mobileNumber"
                      v-model="loginMobileForm.mobileNumber"
                      placeholder="手机号"
                      name="mobileNumber"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="DynamicCode">
                    <!-- <span class="svg-container">
                      <svg-icon icon-class="password" />
                    </span>-->
                    <el-input
                      ref="DynamicCode"
                      v-model="loginMobileForm.DynamicCode"
                      placeholder="验证码"
                      name="DynamicCode"
                      type="text"
                      tabindex="1"
                      auto-complete="on"
                      maxlength="6"
                    />
                  </el-form-item>
                  <el-button
                    type="primary"
                    style="width: 100%;
                    margin-bottom: 20px"
                    :disabled="codeDisabled"
                    @click.native.prevent="handleMobileCode"
                  >
                    {{ codeText }}
                  </el-button>
                  <el-button
                    :loading="loading"
                    type="primary"
                    style="width: 100%; margin-bottom: 30px; margin-left: 0"
                    @click.native.prevent="handleMobileLogin"
                  >
                    登录
                  </el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

import { Message } from 'element-ui'
import {
  validUsername,
  validPassword,
  validMobileNumber,
  validcode
} from '@/utils/vaildata'

export default {
  name: 'Login',
  data () {
    const validateMobileNumber = (_rule, value, callback) => {
      if (!validMobileNumber(value)) {
        callback(new Error('请输入正确的手机号'))
        this.codeDisabled = true
      } else {
        this.codeDisabled = false
        callback()
      }
    }
    const validateUsername = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else if (!validUsername(value)) {
        callback(new Error('用户名不能少于4位且不能多于16位'))
      } else {
        callback()
      }
    }
    const validatePassword = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的密码'))
      } else if (!validPassword(value)) {
        callback(new Error('密码不能少于8位且必须包含字母、数字、特殊字符'))
      } else {
        callback()
      }
    }
    const validatecode = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else if (!validcode(value)) {
        callback(new Error('请输入正确验证码'))
      } else {
        callback()
      }
    }
    return {
      getCode: '',
      LoginName: 'patientFirst',
      loginForm: {
        userName: 'qian',
        password: 'qian123@',
        logonTypeId: 1
      },
      loginMobileForm: {
        logonTypeId: 2, // 普通登录1 手机号登录2
        mobileNumber: '',
        DynamicCode: ''
      },
      rules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        mobileNumber: [
          { required: true, trigger: 'blur', validator: validateMobileNumber }
        ],
        DynamicCode: [
          { required: true, trigger: 'blur', validator: validatecode }
        ]
      },
      codeText: '获取动态验证码',
      codeDisabled: false, // 发送验证码按钮是否禁用
      isOpenWeiXinLogin: true, // 是否开启微信登录
      qrCodeLoading: false,
      qrCodeSuccess: true,
      isOpenMobileNumberLogin: true, // 是否开启手机号登录
      qrCodeUrl: require('@/assets/imgs/default/wechatPublic.png'), // 微信二维码
      qrFrequency: 300, // 扫码轮询次数
      qrTime: 2000, // 扫码轮询间隔
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      intervalId: ''
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    // if (this.$auth.loggedIn) {
    //   this.$router.push('/')
    // }
  },

  // beforeDestroy () {
  //   // 页面跳转后清除计时器
  //   clearInterval(this.intervalId)
  // },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    // 获取验证码
    handleMobileCode () {
      const that = this
      if (that.loginMobileForm.mobileNumber !== '') {
        this.$request.login.GeneratePhonecode(this.loginMobileForm.mobileNumber)
          .then((res) => {
            let num = 6
            // eslint-disable-next-line no-var
            var timer = setInterval(function () {
              num--
              that.codeDisabled = true
              that.sendcode = num + '秒后重新获取'
              if (num === 0) {
                that.sendcode = '获取验证码'
                that.codeDisabled = false
                clearInterval(timer)
              }
            }, 1000)
            console.log(res)
            that.getCode = res
          })
          .catch((error) => {
            Message({
              message: '手机号未注册！',
              type: 'error',
              duration: 2 * 1000
            })
            console.log(error + '手机号未注册')
          })
        // this.GeneratePhonecode()
      } else {
        Message({
          message: '请输入手机号',
          type: 'error',
          duration: 2 * 1000
        })
      }
    },
    // async GeneratePhonecode () {
    //   await this.$request.login.GeneratePhonecode(this.loginMobileForm.DynamicCode)
    //     .then((r) => {
    //       Message({
    //         message: '获取验证码成功！',
    //         type: 'success',
    //         duration: 2 * 1000
    //       })
    //       this.getCode = r
    //       console.log('res', r)
    //     })
    //     .catch((err) => {
    //       Message({
    //         message: '获取验证码失败！',
    //         type: 'error',
    //         duration: 2 * 1000
    //       })
    //       console.log('res', err)
    //     })
    // },

    // 手机号码登录
    handleMobileLogin () {
      const that = this
      that.$refs.loginMobileForm.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          this.$request.login.mobileLogin(this.loginMobileForm.mobileNumber)
            .then((res) => {
              Message({
                message: '登录成功',
                type: 'success',
                duration: 2 * 1000
              })
            })
            .catch((error) => {
              Message({
                message: '接口问题！登陆失败',
                type: 'error',
                duration: 2 * 1000
              })
              console.log(error + '接口问题！登陆失败')
            })
        // eslint-disable-next-line eqeqeq
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async mobileLogin () {
      await this.$request.login.mobileLogin(this.loginMobileForm.mobileNumber)
        .then((result) => {
          // eslint-disable-next-line no-undef
          Message({
            message: '登录成功',
            type: 'success',
            duration: 2 * 1000
          })
          console.log('res', result)
        })
        .catch((err) => {
          Message({
            message: '手机号未注册！',
            type: 'error',
            duration: 2 * 1000
          })
          console.log('res', err)
        })
    },

    // 获取支持登录类型
    getLogonType () {
      const that = this
      that.getLogonType()
    },

    // eslint-disable-next-line no-dupe-keys, vue/no-dupe-keys
    async getLogonType () {
      await this.$request.login.checkScanResult()
        .then((response) => {
          const { isOpenMobileNumberLogin, isOpenWeiXinLogin } = response.Data
          this.isOpenMobileNumberLogin = isOpenMobileNumberLogin
          this.isOpenWeiXinLogin = isOpenWeiXinLogin
          // 如果开启微信登录，则调取二维码
          // eslint-disable-next-line eqeqeq
          if (this.isOpenWeiXinLogin == true) {
            this.getWeiChatQrCode()
          }
          // eslint-disable-next-line eqeqeq
          if (this.isOpenMobileNumberLogin == true) {
            this.mobileLogin()
          }
        })
        .catch((err) => {
          Message({
            message: '登陆失败',
            type: 'error',
            duration: 2 * 1000
          })
          console.log('res', err)
        })
    },

    // 获取二维码
    getWeiChatQrCode () {
      const that = this
      that.getWeiChatQrCode()
    },

    // eslint-disable-next-line no-dupe-keys, vue/no-dupe-keys
    async getWeiChatQrCode () {
      await this.$request.login.getWeiChatQrCode()
        .then((response) => {
          const { Data } = response
          const { code, wid, qrCodeUrl } = Data
          this.qrCodeUrl = qrCodeUrl
          // 获取二维码成功后，轮询扫码验证
          const param = {
            code,
            wid
          }
          this.qrCodeLoading = false
          this.checkScanResult(param)
        })
        .catch((err) => {
          Message({
            message: '登陆失败',
            type: 'error',
            duration: 2 * 1000
          })
          console.log('res', err)
        })
    },

    // 扫码验证
    checkScanResult (param) {
      const that = this
      // 此处作为全局变量，便于页面跳转、刷新时重置定时器
      this.intervalId = setInterval(() => {
        that.qrFrequency--
        if (that.qrFrequency >= 0) {
          that.checkScanResult(param)
            .then((response) => {
              const { Data } = response
              const { resultCode, openId, wxUserId, sessionKey, refreshToken } =
                Data
              // 如果为-1扫描未成功，继续刷新
              // 如果为0扫描成功，并登录成功
              // eslint-disable-next-line eqeqeq
              if (resultCode == 0) {
                // 清除计时器,获取用户信息
                clearInterval(that.intervalId)
                // 将返回的token保存在本地
                that.$store.dispatch('user/wechatLogin', {
                  sessionKey,
                  refreshToken
                })
                Message({
                  message: '登录成功',
                  type: 'success',
                  duration: 5 * 1000
                })
                this.checkLoginJunmTo()
                // this.$router.push({ path: this.redirect || '/' })
              }
              // 如果为2扫描成功，但登录失败
              // eslint-disable-next-line eqeqeq
              if (resultCode == 2) {
                Message({
                  message: '登录失败，请稍后重新扫描',
                  type: 'error',
                  duration: 5 * 1000
                })
                that.qrCodeSuccess = false
              }
              // 如果为3跳转至绑定页绑定
              // eslint-disable-next-line eqeqeq
              if (resultCode == 3) {
                Message({
                  message: '扫码成功，前往绑定已有账户',
                  type: 'success',
                  duration: 5 * 1000
                })
                clearInterval(that.intervalId)
                that.$router.push({
                  path: '/home',
                  query: { openId, wxUserId }
                })
              }
            })
        } else {
          that.qrCodeSuccess = false
          clearInterval(that.intervalId)
        }
      }, this.qrTime)
    },

    // eslint-disable-next-line no-dupe-keys, vue/no-dupe-keys
    async checkScanResult () {
      const a = await this.$request.login.checkScanResult(this.param)
      console.log('res', a)
    },
    // 密码登录
    handleLogin () {
      const that = this
      that.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$auth.loginWith('local', this.loginForm)
            .then(() => {
              // eslint-disable-next-line no-undef
              Message({
                message: '登录成功',
                type: 'success',
                duration: 2 * 1000
              })
              // this.$router.push('/home')
            })
            .catch((_err) => {
              // eslint-disable-next-line no-undef
              Message({
                message: '登陆失败',
                type: 'error',
                duration: 2 * 1000
              })
            })
        } else {
          // eslint-disable-next-line no-console
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style lang="scss">
@import "../assets/styles/login.scss";
</style>
