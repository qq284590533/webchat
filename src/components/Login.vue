<template>
  <div class="login">
	  <label for="userName">账号</label>
	  <input id="userName" v-model="username" type="text" placeholder="请输入账号">
	  <label for="passWord">密码</label>
	  <input id="passWord" v-model="password" type="password" placeholder="请输入密码">
	  <button @click="loginHandle">登录</button>
  </div>
</template>

<script>
import {login} from '../api'
export default {
	name: 'Login',
	data () {
		return {
		username:'',
		password:''
		}
	},
	methods:{
		async loginHandle(){
			let params = {
				mobile: this.username,
				password: this.password
			}
			let data = await login(params);
			console.log(data);
		}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
