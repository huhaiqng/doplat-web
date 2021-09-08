<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template>
        <span v-if="username!=null" class="right-menu-item"><strong>{{ username }}</strong></span>
        <span v-else class="right-menu-item" style="padding-right: 30px;">
          <a :href="loginurl"><strong>登录</strong></a>
        </span>
        <el-dropdown v-if="username!=null" class="right-menu-item">
          <div class="right-menu-item hover-effect el-dropdown-link" style="padding-right: 20px;">
            <svg-icon icon-class="user" />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleResetPassword">更改密码</el-dropdown-item>
            <el-dropdown-item @click.native="gotoAdmin">Django 管理</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" :modal-append-to-body="false" width="30%">
      <el-form ref="userTemp" :model="userTemp" :rules="formRules" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="旧密码" prop="old_password">
          <el-input ref="old_password" v-model="userTemp.old_password" type="password" placeholder="******" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input ref="password" v-model="userTemp.password" type="password" placeholder="******" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input ref="confirm_password" v-model="userTemp.confirm_password" type="password" placeholder="******" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handelCancel('userTemp')">
          取消
        </el-button>
        <el-button size="medium" type="primary" @click="updateData('userTemp')">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getUserName, removeToken } from '@/utils/auth'
import { validPassword } from '@/utils/validate'
import { resetPassword } from '@/api/authperm/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码必须是6到12位，包含数字和大小写字母'))
      } else if (this.userTemp.old_password === value) {
        callback(new Error('新旧密码不能一样'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.userTemp.password) {
        callback(new Error('2次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      username: getUserName(),
      userTemp: {
        old_password: null,
        password: null,
        confirm_password: null
      },
      dialogVisible: false,
      formRules: {
        password: [{ trigger: 'blur', validator: validatePassword }],
        confirm_password: [{ trigger: 'blur', validator: validateConfirmPassword }]
      },
      loginurl: `#/login?redirect=${this.$route.fullPath}`
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    gotoAdmin() {
      if (process.env.NODE_ENV === 'development') {
        window.open(process.env.VUE_APP_ADMIN_URL, '_blank')
      } else if (process.env.NODE_ENV === 'production') {
        var ADMIN_URL = window.location.protocol + '//' + window.location.host + '/admin'
        window.open(ADMIN_URL, '_blank')
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      location.reload()
    },
    handleResetPassword() {
      this.dialogVisible = true
      this.resetUserTemp()
    },
    updateData(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          resetPassword(this.userTemp).then(() => {
            this.dialogVisible = false
            removeToken()
            this.$notify({
              title: '成功',
              message: '密码修改完成！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handelCancel(form) {
      this.$refs[form].resetFields()
      this.dialogVisible = false
    },
    resetUserTemp() {
      this.userTemp = {
        old_password: null,
        password: null,
        confirm_password: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
