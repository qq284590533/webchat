<template>
    <div class="wechat">
        <div class="sidestrip">
			<div class="am-dropdown" data-am-dropdown>
				<!--头像插件-->
				<div class="own_head am-dropdown-toggle">
                    <img :src="user.avatar" alt="" />
                </div>
				<div class="am-dropdown-content">
					<div class="own_head_top">
						<div class="own_head_top_text">
							<p class="own_name">{{user.nick}}<img src="/static/images/icon/head.png" alt="" /></p>
							<p class="own_numb">微信号：{{user.tel}}</p>
						</div>
						<img :src="user.avatar" alt="" />
					</div>
					<div class="own_head_bottom">
						<p><span>地区</span>江西 九江</p>
						<div class="own_head_bottom_img">
							<a href=""><img src="/static/images/icon/head_1.png"/></a>
							<a href=""><img src="/static/images/icon/head_2.png"/></a>
						</div>
					</div>
				</div>
			</div>
			<!--三图标-->
			<div class="sidestrip_icon">
				<a id="si_1" :class="{on:tabActive==1}" @click="tabActive=1"></a>
				<a id="si_2" :class="{on:tabActive==2}" @click="tabActive=2"></a>
				<!-- <a id="si_3" :class="{on:tabActive==3}" @click="tabActive=3"></a> -->
			</div>
			
			<!--底部扩展键-->
			<div id="doc-dropdown-justify-js">
				<div class="am-dropdown" id="doc-dropdown-js" style="position: initial;">
					<!-- <div class="sidestrip_bc am-dropdown-toggle"></div> -->
					<ul class="am-dropdown-content" style="">
						<li>
							<a href="#" data-am-modal="{target: '#doc-modal-1', closeViaDimmer: 0, width: 400, height: 225}">意见反馈</a>
							<div class="am-modal am-modal-no-btn" tabindex="-1" id="doc-modal-1">
							  <div class="am-modal-dialog">
								<div class="am-modal-hd">Modal 标题
								  <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>
								</div>
								<div class="am-modal-bd">
								  Modal 内容。本 Modal 无法通过遮罩层关闭。
								</div>
							  </div>
							</div>
						</li>
						
						<li><a href="#">备份与恢复</a></li>
						<li><a href="#">设置</a></li>
					</ul>
				</div>	
			</div>	
		</div>
		
		<!--聊天列表-->
		<div v-show="tabActive==1" class="middle">
			<div class="wx_search">
				<input type="text" placeholder="搜索"/>
				<button>+</button>
			</div>
			<div class="office_text">
				<ul class="user_list" id="talk_list">
					<li :class="{'user_active':judge(msg).active}" v-for="(msg,index) in talkList" :key="index" @click="changeObject(judge(msg).uid)">
						<div class="user_head"><img :src="judge(msg).avatar"/></div>
						<div class="user_text">
							<p class="user_name">{{ judge(msg).nick }}</p>
							<p class="user_message">{{ judge(msg).content }}</p>
						</div>
						<div class="user_time">{{ judge(msg).time | formatDate }}</div>
					</li>
				</ul>
			</div>	
		</div>
		
		<!--好友列表-->
		<div v-show="tabActive==2" class="middle">
			<div class="wx_search">
				<input type="text" placeholder="搜索"/>
				<button>+</button>
			</div>
			<div class="office_text">
				<ul class="friends_list">
					<li class="friends-item">
						<p class="">新的朋友</p>
						<div class="item-box">
							<img src="/static/images/head/1.jpg"/>
							<p class="user_name">新的朋友</p>
						</div>
					</li>
					<li class="friends-item" v-for="(friend, index) in friendsList" :key="index" @click="changeObject(friend.userId)">
						<div class="item-box">
							<img :src="friend.avatar=='false'||friend.avatar==''?'/static/images/contact.png':friend.avatar" alt="">
							<p>{{friend.nick}}</p>
						</div>
					</li>
				</ul>
			</div>	
		</div>
		
		<!--程序列表-->
		<div  v-show="tabActive==3" class="middle">
			<div class="wx_search">
				<input type="text" placeholder="搜索收藏内容"/>
				<button>+</button>
			</div>
			<div class="office_text">
				<ul class="icon_list">
					<li class="icon_active">
						<div class="icon"><img src="/static/images/icon/icon.png" alt="" /></div>
						<span>全部收藏</span>
					</li>
					<li>
						<div class="icon"><img src="/static/images/icon/icon1.png" alt="" /></div>
						<span>链接</span>
					</li>
					<li>
						<div class="icon"><img src="/static/images/icon/icon2.png" alt="" /></div>
						<span>相册</span>
					</li>
					<li>
						<div class="icon"><img src="/static/images/icon/icon3.png" alt="" /></div>
						<span>笔记</span>
					</li>
					<li>
						<div class="icon"><img src="/static/images/icon/icon4.png" alt="" /></div>
						<span>文件</span>
					</li>
					<li>
						<div class="icon"><img src="/static/images/icon/icon5.png" alt="" /></div>
						<span>音乐</span>
					</li>
					<li>
						<div class="icon"><img src="/static/images/icon/icon6.png" alt="" /></div>
						<span>标签</span>
					</li>
				</ul>
			</div>	
		</div>
	
		<!--聊天窗口-->
		<div class="talk_window">
			<div class="windows_top">
				<div class="windows_top_box">
					<span id="fridesTop">{{activeObject.nick}}</span>
					<ul class="window_icon">
						<li><a href=""><img src="/static/images/icon/icon7.png"/></a></li>
						<li><a href=""><img src="/static/images/icon/icon8.png"/></a></li>
						<li><a href=""><img src="/static/images/icon/icon9.png"/></a></li>
						<li><a href=""><img src="/static/images/icon/icon10.png"/></a></li>
					</ul>
					<div class="extend" data-am-offcanvas="{target: '#doc-oc-demo3'}"></div>
					<!-- 侧边栏内容 -->
					<div id="doc-oc-demo3" class="am-offcanvas">
						<div class="am-offcanvas-bar am-offcanvas-bar-flip">
							<div class="am-offcanvas-content">
								<p><a href="http://music.163.com/#/song?id=385554" target="_blank"></a></p>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!--聊天内容-->
			<div class="windows_body">
				<div class="office_text message_view" style="height: 100%;">
					<ul ref="officeText"  class="content" id="chatbox">
						<li :class="[message.sender_uid==user.userId?'me':'other']" v-for="(message,index) in messageJson[activeMessageView]" :key="index"><img :src="message.sender_avatar=='false'?'/static/images/contact.png':message.sender_avatar" :title="message.sender_nick"><span>{{message.content}}</span></li>
					</ul>
				</div>
			</div>
			
			<div class="windows_input" id="talkbox">
				<div class="input_icon">
					<!-- <a href="javascript:;"></a> -->
					<a href="javascript:;"   position:absolute=""><input onchange="FirstImg()" name="firstImg" style="opacity:0;position:absolute" type="file" id="FirstfileImg" multiple=""></a><!-- 
					<a href="javascript:;"></a>
					<a href="javascript:;"></a> -->
				</div>
				<div class="input_box">
					<textarea ref="inputBox" contentEditable="true" name="" rows="" cols="" id="input_box" ></textarea>
					<button id="send" @click="sendMsg">发送（S）</button>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
import 'jquery'
import 'amazeui'
import dayjs from 'dayjs'
import ajax from '../common/ajax'
import { readLocal, sortChinese, objSortFun, saveLocal} from '../common/utils'
import * as strophe from '../common/strophe.js'
import * as API from '../api/index.js'
export default {
    data(){
        return {
			user:null,
			userInfo:null,
            status:null,
            tabActive:1,
            talkList:[{
				sender_uid:'',
				sender_avatar:'',
				sender_nick:'',
				content:'',
				time:''

			}],
			talkListKey:[],
			talkListJson:{},
			chatFriend:'',
			friendsJson:{},
			friendsList:[],
			messageJson:{},
			activeMessageList:[],
			activeMessageView:'',
			activeObject:{}
        }
	},
	filters:{
		formatDate(val){
			let now = dayjs()
			let n_m = now.month();
			let n_d = now.date();
			let M = dayjs(val).month('MM');
			let D = dayjs(val).date('DD');
			let H = dayjs(val).hour('H');
			let m = dayjs(val).minute('mm');
			if(M==n_m){
				if(D==n_d){
					return  H+':'+m
				}else if(n_d-D==1){
					return  '昨天'
				}
			}else{
				return  M+'月'+D+'日 '
			}
		}
	},
    watch:{
		activeMessageView(newval,oldval){
			this.buildTalkView(newval)
			this.activeObject=this.friendsJson[newval]
		},
    },
    methods:{
		judge(msg){
			let suid,avatar,nick;
			if(msg.sender_uid==this.user.userId){
				suid = msg.msg.data.to;
				if(this.friendsJson[suid].avatar==''||this.friendsJson[suid].avatar=='false'){
					avatar = '/static/images/contact.png';
				}else{
					avatar = this.friendsJson[suid].avatar;
				}
				nick = this.friendsJson[suid].nick;
			}else{
				suid = msg.sender_uid;
				if(msg.sender_avatar==''||msg.sender_avatar=='false'){
					avatar = '/static/images/contact.png';
				}else{
					avatar = msg.sender_avatar;
				}
				nick = msg.sender_nick;
			}
			let active = suid==this.activeMessageView
			let data = {
				active:active,
				uid:suid,
				avatar:avatar,
				nick:nick,
				time:msg.time,
				content:msg.content
			}
			return data
		},
		changeObject(uid){
			this.activeMessageView = uid;
			// this.activeObject = this.friendsJson[uid];
		},
		buildTalkView(uid){
			let _this = this;
			this.activeMessageList = this.messageJson[uid];
			setTimeout(function(){
				_this.$refs.officeText.scrollTop = _this.$refs.officeText.scrollHeight;
			},0)
		},
		sendMsg(){
			let tojid = this.activeMessageView;
			let jid = this.user.userId;
			let msg = this.$refs.inputBox.value;
			if(msg.length == 0){
				alert('不能发送空消息');
				return false;
			}
			let msgObj = {
				to:tojid,
				from:jid,
				type:'chat',
			}
			strophe.sendMsg(msgObj,this.$refs.inputBox);
		}
    },
    async created(){
		strophe.setVM(this);
		this.user = readLocal('user');
		let uid = this.user.userId;
		if(!this.user){
			this.$router.push({name:'login'})
		}
		this.friendsJson = readLocal('FRIENDS_LIST_'+uid)||{};
		this.messageJson = readLocal('MESSAGE_JSON_'+uid)||{};
		this.talkList = readLocal('TALK_LIST_'+uid)||[];
		this.talkListJson = readLocal('TALK_LIST_JSON'+uid)||{};
		this.talkListKey = readLocal('TALK_LIST_KEY_'+uid)||[];
		if(this.talkList.length){
			if(this.talkList[0].sender_uid==this.user.userId){
				this.activeMessageView = this.talkList[0].msg.data.to
			}else{
				this.activeMessageView = this.talkList[0].sender_uid
			}
			this.activeObject = this.friendsJson[this.activeMessageView];
		}
		let userInfo = {
			userId: uid,
			imPassword:this.user.imPassword
		}
		strophe.loginIm(userInfo);
		let friendsData = await API.getFriendsList({
			uid:uid
		});
		friendsData.data.forEach(item=>{
			this.friendsJson[item.userId] = item;
		})
		saveLocal('FRIENDS_LIST_'+uid,this.friendsJson);
		for (let item in this.friendsJson){
			this.friendsList.push(this.friendsJson[item])
		}

    }
}
</script>

<style lang="stylus">
.middle
    display block
.own_head
    width 40px
    height 40px
    border-radius 3px
    overflow hidden
    margin-left 10px
    img
        width 100%
        height 100%

.sidestrip_icon
    padding 0
    text-align center
    a
        display inline-block
        width 60px
        height 40px
        margin-bottom 10px
        cursor pointer
        &#si_1
            background url(/static/images/icon/head_2.png) no-repeat center
            &.on
                background url(/static/images/icon/head_2_1.png) no-repeat center
        &#si_2
            background url(/static/images/icon/head_3.png) no-repeat center
            &.on
                background url(/static/images/icon/head_3_1.png) no-repeat center
        &#si_3
            background url(/static/images/icon/head_4.png) no-repeat center
            &.on
                background url(/static/images/icon/head_4_1.png) no-repeat center
.friends_list li
	border none
	padding-top 0
.friends_list li:hover .item-box
	background #dedbdb
.friends_list .item-box
	display flex
	text-align left
	padding 12px
	overflow hidden
	border-bottom 1px solid #dddbdb
	cursor pointer
	img 
		width 40px
		height 40px
	p
		flex 1
		padding-left 8px
		font-size 14px
		color #333
		line-height 40px
		overflow hidden
		text-overflow ellipsis
		white-space nowrap
.office_text
	overflow-y auto
.message_view
	display flex
	flex-flow column
	align-items flex-start
	ul
		display flex
		overflow-y auto
		flex-flow column-reverse
		li
			overflow visible
			padding-top 10px
.user_head
	background none
</style>

