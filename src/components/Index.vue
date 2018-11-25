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
					<li :class="{'user_active':msg.sender_uid==activeMessageView}" v-for="(msg,index) in talkList" :key="index" @click="changeObject(msg.sender_uid)">
						<div class="user_head"><img :src="msg.sender_avatar"/></div>
						<div class="user_text">
							<p class="user_name">{{ msg.sender_nick }}</p>
							<p class="user_message">{{ msg.content }}</p>
						</div>
						<div class="user_time">{{ msg.time }}</div>
					</li>
					<!-- <li onclick="chosefrides(this,'62003002@app.im')">
						<div class="user_head"><img src="/static/images/head/2.jpg"/></div>
						<div class="user_text">
							<p class="user_name">62003002@app.im</p>
							<p class="user_message">[小程序]</p>
						</div>
						<div class="user_time">11:03</div>
					</li>
					<li onclick="chosefrides(this,'')">
						<div class="user_head"><img src="/static/images/head/3.jpg"/></div>
						<div class="user_text">
							<p class="user_name">十里老街秋名山车神车队</p>
							<p class="user_message">乞讨两块交个话费</p>
						</div>
						<div class="user_time">昨天</div>
					</li>
					<li onclick="chosefrides(this,'')">
						<div class="user_head"><img src="/static/images/head/4.jpg"/></div>
						<div class="user_text">
							<p class="user_name">阿杰</p>
							<p class="user_message">[动画表情]</p>
						</div>
						<div class="user_time">昨天</div>
					</li>
					<li onclick="chosefrides(this,'')">
						<div class="user_head"><img src="/static/images/head/5.jpg"/></div>
						<div class="user_text">
							<p class="user_name">订阅号</p>
							<p class="user_message">庐山国际水彩艺术节：</p>
						</div>
						<div class="user_time">星期三</div>
					</li> -->
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
							<img :src="friend.avatar||'/static/images/contact.png'" alt="">
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
					<div class="extend am-btn am-btn-success" data-am-offcanvas="{target: '#doc-oc-demo3'}"></div>
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
				<div ref="officeText" class="office_text message_view" style="height: 100%;">
					<ul class="content" id="chatbox">
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<!--<li class="other"><img src="images/head/15.jpg" title="张文超"><span>勇夫安知义，智者必怀仁</span></li>-->
						<li class="other" v-for="(message,index) in messageJson[activeMessageView]" :key="index"><img :src="message.sender_avatar||'/static/images/contact.png'" :title="message.nick"><span>{{message.content}}</span></li>
						<!-- <li class="me"><img src="/static/images/own_head.jpg" title="金少凯"><span>疾风知劲草，板荡识诚臣</span></li> -->
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
    watch:{
		activeMessageView(newval,oldval){
			this.buildTalkView(newval)
			this.activeObject=this.friendsJson[newval]
		}
    },
    methods:{
		changeObject(uid){
			this.activeMessageView = uid;
			// this.activeObject = this.friendsJson[uid];
		},
		buildTalkView(uid){
			let _this = this;
			this.activeMessageList = this.messageJson[uid];
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
		if(this.user==null){
			this.$router.push({name:'login'})
		}
		this.friendsJson = readLocal('FRIENDS_LIST_'+uid)||{};
		this.messageJson = readLocal('MESSAGE_JSON_'+uid)||{};
		this.talkList = readLocal('TALK_LIST_'+uid)||[];
		this.talkListJson = readLocal('TALK_LIST_JSON'+uid)||{};
		this.talkListKey = readLocal('TALK_LIST_KEY_'+uid)||[];
		if(this.talkList.length){
			this.activeMessageView = this.talkList[0].sender_uid
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
</style>

