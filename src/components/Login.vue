<template>
	<div class="login">
		<div class="llogo"><img src="/static/images/llogo.png"></div>
		<span v-if="!loginWithId" class="loginWithId" @click="loginWithId=true">账号登录</span>
		<span v-else class="loginWithId" @click="loginWithId=false">二维码登录</span>
		<div class="login-box">
			<div v-if="loginWithId" class="id-login-box">
				<p>
					<label for="userName">账号：</label>
					<input id="userName" v-model="username" type="text" placeholder="请输入账号">
				</p>
				<p>
					<label for="passWord">密码：</label>
					<input id="passWord" v-model="password" type="password" placeholder="请输入密码">
				</p>
				<button @click="loginHandle">登录</button>
			</div>
			<div v-else class="qrcode-login-box">
				<div ref="qrcodeBox" class="qrcode-box"></div>
				<p class="sub_title">使用手机版扫码登录</p>
				<p class="sub_desc">网页版需要配合手机使用</p>	
			</div>
		</div>
		<div class="lang">
			<a>微信PC版</a>
			<span class="sep"></span>
			<a>中文</a>
			<span class="sep"></span>
			<a>繁体</a>
			<span class="sep"></span>
			<a>English</a>
		</div>
		<div class="copyright">
			<p>© 1998 - 2017 Tencent Inc. All Rights Reserved</p>
		</div>
	</div>
</template>

<script>
import { saveLocal } from '../common/utils'
import { login, getQruuid, checkQruuid } from '../api'

var interval;
export default {
	name: 'Login',
	data () {
		return {
			username:'',
			password:'',
			URL:'http://api.yichatsystem.com/api/web/webLogin?qruuid=',
			qruid:'',
			multi:false,
			loginWithId:false
		}
	},
	watch:{
		loginWithId(newval,oldval){
			if(!newval){
				this.getQruuid();
			}else{
				clearInterval(interval);
			}
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
				let user = data.user
				if(this.multi){
					saveLocal('user_'+user.userId,user)
					this.$router.push({name:'indexWithId',params: { userId: user.userId }})
				}else{
					saveLocal('user',user)
					this.$router.push({name:'index'})
				}
			}else{
				alert('登录失败！')
			}
		},
		async getQruuid(){
			let result = await getQruuid();
			// console.log(result)
			if(result.code==1){
				$(this.$refs.qrcodeBox).qrcode(this.URL + result.data);
				this.qruid = result.data;
				interval = setInterval(this.checkQruuid,1000);
			}
		},
		async checkQruuid(){
			let params = {
				'qruuid': this.qruid
			}
			let result = await checkQruuid(params);
				// console.log(params)
			if (result.code == 1) {
				$(".sub_title").html("扫码成功，进行跳转.....");
				let user = result.data
				// console.log(user)
				clearInterval(interval);
				if(this.multi){
					saveLocal('user_'+user.userId,user)
					this.$router.push({name:'indexWithId',params: { userId: user.userId }})
				}else{
					saveLocal('user',user)
					this.$router.push({name:'index'})
				}
			}else if(result.code == 300){
				alert('无此后台用户！');
				window.clearInterval(interval);
				window.location.reload()
			}
		},
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			if(to.query&&to.query.multi){
				vm.multi = true;
			}else{
				vm.multi = false;
			}
		})
	},
	mounted(){
		this.getQruuid()
		if(this.$route.query&&this.$route.query.multi=='true'){
			this.multi = true;
		}else{
			this.multi = false;
		}
	},
	beforeDestroy(){
		clearInterval(interval)
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
		.sub_desc
			text-align: center;
			color: #a3a3a3;
			font-size: 15px;
			line-height: 1.8;
		.lang 
			position: absolute;
			bottom: 60px;
			left: 60px;
			a 
				text-decoration: none;
				font-size: 12px;
				color: #d3d3d3;
				cursor: pointer;
			.sep 
				display: inline-block;
				height: 12px;
				vertical-align: middle;
				margin: 0 10px;
				border-right: 1px solid #d3d3d3;
		.copyright
			position: absolute;
			bottom: 60px;
			right: 60px;
			color: #d3d3d3;
			font-size: 12px;
		.llogo
			position absolute
			left 60px
			top 60px
			img 
				width 36px
				height 28px
		.login-box
			background #ffffff
			border-radius 4px
			padding 42px 55px
			box-sizing border-box
			.qrcode-box
				width 270px
				height 270px
				canvas 
					width 100%
					height 100%
			.sub_title
				text-align center
				font-size 20px
				color #353535
				margin-bottom 23px
				margin-top 20px
		.loginWithId
			position absolute
			right 60px
			top 60px
			font-size: 12px;
			color: #f3f3f3;
			cursor: pointer;
		.id-login-box
			p
				font-size 16px
				color #666
				line-height 40px
				margin-bottom 10px
				input 
					border 1px solid #ddd
					padding 4px 10px
					border-radius 4px
			button 
				width 100%
				border none
				border-radius 4px
				background #3c8eea
				height 40px
				font-size 16px
				color #fff
				margin-top 20px
				&:hover
					background #227fe8
</style>

