<template>
  <el-row :gutter="10">
    <el-col :span="8" :offset="8">
      <el-form label-position="left" label-width="80px" :model="formData">
        <el-form-item label="Account">
          <el-input v-model="formData.account"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="formData.passwd" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submit" :loading="isLoading">Login</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import request from '@/request/request';
import {mapMutations} from 'vuex';
import {UPDATE_USER_INFO} from '@/store/actionType';
import md5 from 'md5';

export default {
  name: "Login",
  data() {
    return {
      formData: {
        account: '',
        passwd: '',
      },
      isLoading: false,
    }
  },
  methods: {
    ...mapMutations({
      updateUserInfo: UPDATE_USER_INFO,
    }),
    submit: function () {
      let email = this.formData.account;
      let password = this.formData.passwd;
      if (!email || !password) {
        this.$message({
          message: '邮箱或密码不能为空',
          type: 'warning',
        })
        return;
      }
      this.isLoading = true;
      request.post('/login', {
        email: this.formData.account,
        md5_password: md5(this.formData.passwd),
      }).then(({data}) => {
        if (data.code === 200) {
          const {id, userName, vipType, viptypeVersion, anonimousUser} = data.account;
          // gender  0-男性  1-女性
          // follows 关注的人
          // followeds 自己被多少人关注
          const {avatarUrl, nickname, gender, followeds, follows} = data.profile;
          const token = data.token;
          const account = {id, userName, vipType, viptypeVersion, anonimousUser};
          const profile = {avatarUrl, nickname, gender, followeds, follows};
          // 将用户信息保存到 store 中
          this.updateUserInfo({account, profile, token});
          // 将当前用户的id保存到localStorage
          localStorage.setItem('curId', id);
          // 跳转路由
          this.$router.push({
            name: 'Home',
          })
        } else {
          this.$message({
            message: data.msg,
            type: 'error',
          })
        }
      }).catch(err => {
        console.group('Login submit');
        console.log(err);
        console.groupEnd('Login submit');
      }).finally(() => {
        this.isLoading = false;
      })
    }
  }

}
</script>

<style lang="scss" scoped>

</style>