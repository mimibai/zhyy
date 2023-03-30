<template>
  <el-form class="login-box1" ref="loginForm" :model="loginForm" :rules="rules" label-width="100px">
    <h3 class="login-title">修改密码</h3>
    <el-form-item label="原密码" prop="oldpassword">
      <el-input
        type="password"
        v-model="loginForm.oldpassword"
        show-password
        auto-complete="off"
        placeholder="请输入原密码"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input
        type="password"
        show-password
        auto-complete="off"
        placeholder="请设置新密码"
        v-model="loginForm.password"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input
        type="password"
        show-password
        auto-complete="off"
        placeholder="请确认新密码"
        v-model="loginForm.password2"
      />
    </el-form-item>
    <el-form-item style="float:right">
      <el-button
        type="primary"
        class="Save"
        @click.native.prevent="handleLogin">保存</el-button>
      <el-button @click="$refs['loginForm'].resetFields()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { Message } from 'element-ui'
import {
  validPassword
} from '@/utils/vaildata'

export default {
  name: 'ResetPassword',
  data () {
    const validateNewPassword = (_rule, value, callback) => {
      if (value === this.loginForm.oldpassword) {
        callback(new Error('新密码不能与原密码相同'))
      } else if (!validPassword(value)) {
        callback(new Error('密码不能少于8位且必须包含字母、数字、特殊字符'))
      } else {
        callback()
      }
    }
    const validateNewPassword2 = (_rule, value, callback) => {
      if (value !== this.loginForm.password) {
        callback(new Error('与新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        empNum: '',
        empName: '',
        oldpassword: '',
        password: '',
        password2: ''
      },
      // 表单校验
      rules: {
        oldpassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请设置新密码', trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateNewPassword2, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // this.getCookie()
  },
  methods: {
    /** 提交按钮 */
    handleLogin () {
      const that = this
      that.$refs.loginForm.validate().then((valid) => {
        if (valid) {
          that.updateSecondpwd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async updateSecondpwd () {
      await this.$request.login.updateSecondpwd(this.loginForm.password)
        .then((result) => {
          // eslint-disable-next-line no-undef
          Message({
            message: '修改密码成功',
            type: 'success',
            duration: 2 * 1000
          })
          console.log('res', result)
          // this.$router.push('/home')
        })
        .catch((err) => {
          Message({
            message: '接口不对！修改密码失败！',
            type: 'error',
            duration: 2 * 1000
          })
          console.log('res', err)
        })
    }
  }
}
</script>
  <style lang="scss">
.user-account-key {
  width: 500px;
  margin: 100px auto;
}
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
  .Save{
    background: #0081a3;
  }
}
.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>
