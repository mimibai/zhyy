<template>
  <div class="login-box1 ">
    <el-steps :active="active" align-center class="tabcom">
      <el-step title="身份验证" />
      <el-step title="密码重置" />
      <el-step title="重置完成" />
    </el-steps>
    <div v-show="active == 1">
      <el-form ref="forgetpwdform" label-width="120px" :model="forgetpwdform" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item prop="phone" label="手机号：">
              <el-input v-model="forgetpwdform.phone" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button :disabled="codeDisabled" @click="sendcodeMsg">
              {{ sendcode }}
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item prop="code" label="验证码：">
              <el-input v-model="forgetpwdform.code" maxlength="6" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button v-if="active < 4" style="margin-top: 12px" @click="next">
        下一步
      </el-button>
      <el-button v-if="active > 1" style="margin-top: 12px" @click="pre">
        上一步
      </el-button>
    </div>
    <div v-show="active == 2">
      <el-form ref="forgetpwdforms" label-width="120px" :model="forgetpwdforms" :rules="ss">
        <el-form-item prop="newpassword" label="新密码">
          <el-input v-model="forgetpwdforms.newpassword" type="password" show-password />
        </el-form-item>
        <el-form-item prop="repeatpassword" label="确认密码">
          <el-input v-model="forgetpwdforms.repeatpassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <el-button v-if="active < 4" style="margin-top: 12px" @click="next1">
        下一步
      </el-button>
      <el-button v-if="active > 1" style="margin-top: 12px" @click="pre">
        上一步
      </el-button>
    </div>

    <div v-show="active == 3">
      <div class="text-center">
        <p>密码已从新修改啦~</p>
        <el-button color="primary" @click="login">
          重新登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  validcode,
  validPassword,
  validMobileNumber
} from '@/utils/vaildata'
export default {
  name: 'ResetPasswordNew',
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
    const validatecode = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else if (!validcode(value)) {
        callback(new Error('请输入正确验证码'))
      } else {
        callback()
      }
    }
    const validateNewpassword = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的密码'))
      } else if (!validPassword(value)) {
        callback(new Error('密码不能少于8位且必须包含字母、数字、特殊字符'))
      } else {
        callback()
      }
    }
    const validatePassword = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的密码'))
      } else if (value !== this.forgetpwdforms.newpassword) {
        callback(new Error('与新密码不同!'))
      } else if (!validPassword(value)) {
        callback(new Error('密码不能少于8位且必须包含字母、数字、特殊字符'))
      } else {
        callback()
      }
    }
    return {
      active: 1,
      getCode: '',
      sendcode: '发送验证码',
      codeDisabled: false,
      forgetpwdform: {
        phone: '',
        code: ''
      },
      forgetpwdforms: {
        newpassword: '',
        repeatpassword: ''
      },
      rules: {
        phone: [
          { required: true, trigger: 'blur', validator: validateMobileNumber }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validatecode }
        ]

      },
      ss: {
        newpassword: [
          { required: true, trigger: 'blur', validator: validateNewpassword }
        ],
        repeatpassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  methods: {
    next () {
      const that = this
      that.$refs.forgetpwdform.validate((valid) => {
        if (valid) {
          if (that.active++ > 3) { that.active = 1 }
        }
      })
      // that.$refs.forgetpwdforms.validate((valid) => {
      //   if (valid) {
      //     if (that.active++ > 3) { that.active = 1 }
      //   }
      // })qwert@#123
    },
    next1 () {
      const that = this
      that.$refs.forgetpwdforms.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (that.forgetpwdform.code == that.getCode) {
            Message({
              message: '修改密码成功',
              type: 'success',
              duration: 2 * 1000
            })
          } else {
            Message({
              message: '接口验证失败！',
              type: 'error',
              duration: 2 * 1000
            })
          }
          if (that.active++ > 3) { that.active = 1 }
        }
      })
    },
    pre () {
      if (this.active-- < 2) { this.active = 1 }
    },
    sendcodeMsg () {
      const that = this
      if (that.forgetpwdform.phone !== '') {
        this.$request.login.GeneratePhonecode(this.forgetpwdform.phone)
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
      } else {
        Message({
          message: '请输入手机号',
          type: 'error',
          duration: 2 * 1000
        })
      }
    },
    login () {
      this.$router.push({ path: '/login' })
    }
  }
}

</script>

<style scoped lang="scss">
.login-box1 {
  border: 1px solid #dcdfe6;
  width: 500px;
  height: 340px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;

  .tabcom {
    margin-bottom: 30px;
  }

  .last-item {
    margin-top: 20px;
    margin-bottom: 0px;
  }

  .Save {
    background: #0081a3;
  }

  .text-center {
    text-align: center;
    color: #0081a3;
    font-size: 20px;

    p {
      padding-bottom: 30px;
      padding-top: 15px;
    }

    button {
      background: #0081a3;
      color: #fff;
      cursor: pointer;
    }
  }

  .el-step__head.is-finish {
    color: #0081a3 !important;
    border-color: #0081a3 !important;
  }

  .el-step__title.is-finish {
    color: #0081a3 !important;
  }
}</style>
