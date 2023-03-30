<template>
  <el-form ref="forgetpwdform" label-width="120px" :model="forgetpwdform" :rules="rules" class="login-box1 ">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-form-item prop="phone" label="手机号：">
          <el-input v-model="forgetpwdform.phone" maxlength="11" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
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
    <el-form-item prop="newpassword" label="新密码">
      <el-input v-model="forgetpwdform.newpassword" type="password" />
    </el-form-item>
    <el-form-item prop="repeatpassword" label="确认密码">
      <el-input v-model="forgetpwdform.repeatpassword" type="password" />
    </el-form-item>
    <el-form-item class="last-item">
      <el-button type="primary" class="Save" @click="handleSubmit">
        提交
      </el-button>
      <el-button type="default" @click="handleClose">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import qs from 'qs'
import { Message } from 'element-ui'
import {
  validcode,
  validPassword,
  validMobileNumber
} from '@/utils/vaildata'
export default {
  name: 'Forgetpwd',
  layout: 'default',
  // eslint-disable-next-line vue/require-prop-types
  props: ['centerDialogVisibleSecond'],
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
      } else if (value !== this.forgetpwdform.newpassword) {
        callback(new Error('与新密码不同!'))
      } else if (!validPassword(value)) {
        callback(new Error('密码不能少于8位且必须包含字母、数字、特殊字符'))
      } else {
        callback()
      }
    }
    return {
      getCode: '',
      sendcode: '发送验证码',
      codeDisabled: false,
      forgetpwdform: {
        phone: '',
        code: '',
        newpassword: '',
        repeatpassword: ''
      },
      rules: {
        phone: [
          { required: true, trigger: 'blur', validator: validateMobileNumber }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validatecode }
        ],
        newpassword: [
          { required: true, trigger: 'blur', validator: validateNewpassword }
        ],
        repeatpassword: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  watch: {
    centerDialogVisibleSecond (newValue, oldValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.centerDialogVisibleSecond = newValue
    }
  },
  methods: {
    // 发送验证码
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

    // 关闭页面
    handleClose () {
      // eslint-disable-next-line vue/no-mutating-props
      this.centerDialogVisibleSecond = false
      this.$emit('tyonke', this.centerDialogVisibleSecond)
    },

    // 表单提交
    handleSubmit () {
      const that = this
      that.$refs.forgetpwdform.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line eqeqeq
          if (that.forgetpwdform.code == that.getCode) {
            Message({
              message: '修改密码成功',
              type: 'success',
              duration: 2 * 1000
            })
            this.$router.push('/home')
          } else {
            Message({
              message: '接口验证失败！',
              type: 'error',
              duration: 2 * 1000
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
  .last-item{
    margin-top: 20px;
    margin-bottom: 0px;
  }
  .Save{
    background: #0081a3;
  }
}
</style>
