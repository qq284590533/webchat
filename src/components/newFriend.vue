<template>
  <div class="new-friend-tip" v-show="isShow">
    <div class="shade"></div>
    <div class="tipcontent">
			<h3 class="title">新的朋友</h3>
			<p class="nick">{{friendData.nick}}：</p>
			<p class="reason">{{friendData.reason}}</p>
			<div class="btn-box">
				<button class="ok" @click="ok">接受</button>
				<button class="cancel" @click="cancel">忽略</button>
			</div>
    </div>
  </div>
</template>

<script>
export default {
	data(){
		return {

		}
	},
	props:{
		friendData:{
			type:Object,
			default: () => {}
		},
		isShow: {
			type: Boolean,
			default: false
		},
	},
	methods:{
		ok() {
      this.$emit("onensure");
    },
    cancel() {
      this.$emit("oncancel");
    },
	}
}
</script>
<style lang="stylus" scoped>
.new-friend-tip {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 10000;

  .shade {
    position: absolute;
    width: 100%;
    height: 100%;
		background: #000;
		opacity: 0.2;
  }
  .tipcontent{
		position: relative;
	  width: 300px;
	  background #fff;
		border-radius: 5px;
		box-shadow: 0 0 15px #aaa;
		z-index: 1;
		.title{
			font-size: 18px;
			text-align: center;
			line-height: 40px;
		}
		p{
			padding: 0 20px;
			font-size: 12px;
			line-height 20px;
		}
		.nick{
			font-size: 14px;
			line-height 30px;
			color #000
		}
		.reason{
			text-indent: 2em;
		}
		.btn-box{
			padding 0 20px
			margin-top 20px
			text-align center 
			padding-bottom 10px
			button{
				width 48px
				height 24px
				margin 0 10px
				border-radius 3px
				border none
				color #666
			}
			.ok{
				color #fff
				background #56bd54
				&:hover{
					background #0bbb07
				}
			}
			.cancel{
				background #ddd
				&:hover{
					background #ccc
				}
			}
		}
  }
}


</style>

