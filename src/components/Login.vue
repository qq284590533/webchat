<template>
	<div class="login">
		<div class="login-box">
			<p>
				<label for="userName">账号</label>
				<input id="userName" v-model="username" type="text" placeholder="请输入账号">
			</p>
			<p>
				<label for="passWord">密码</label>
				<input id="passWord" v-model="password" type="password" placeholder="请输入密码">
			</p>
			<button @click="loginHandle">登录</button>
		</div>
	</div>
</template>

<script>
import { saveLocal } from '../common/utils'
import { login } from '../api'
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
			let _this = this;
			let params = {
				mobile: this.username,
				password: this.password
			}
			let data = await login(params)
			if(data.code==1){
				saveLocal('user',data.user)
				this.$router.push({name:'index'})
			}else{
				alert('登录失败！')
			}
		}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
	.login
		width 100%
		height 100%
		display flex
		justify-content center
		align-items center
		font-size 14px
		line-height 30px
		.login-box
			background #ffffff
			border-radius 4px
			padding 20px 30px
			p
				margin-bottom 10px
			input
				border 1px solid #ddd
				border-radius 4px
				padding 4px 5px
			button
				border none
				background #4c8bff
				color #ffffff
				width 100%
				line-height 30px
				text-align center
				margin-top 10px
				border-radius 3px
</style>

