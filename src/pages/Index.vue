<template>
  <div class="wrapper">
    <div class="wechat" @click="showMenu=false">
      <div class="sidestrip">
        <div class="am-dropdown" data-am-dropdown>
          <!--头像插件-->
          <div class="own_head am-dropdown-toggle">
            <img
              :src="user.avatar=='false'||user.avatar==''||!user.avatar?'/static/images/contact.png':user.avatar"
              alt
            >
          </div>
          <div class="am-dropdown-content">
            <div class="own_head_top">
              <div class="own_head_top_text">
                <p class="own_name">
                  {{user.nick}}
                  <img src="/static/images/icon/head.png" alt>
                </p>
                <p class="own_numb">手机号：{{user.tel}}</p>
              </div>
              <img
                :src="user.avatar=='false'||user.avatar==''||!user.avatar?'/static/images/contact.png':user.avatar"
                alt
              >
            </div>
            <div class="own_head_bottom">
              <p>
                <span>地区</span>江西 九江
              </p>
              <!-- <div class="own_head_bottom_img">
                <a href=""><img src="/static/images/icon/head_1.png"/></a>
                <a href=""><img src="/static/images/icon/head_2.png"/></a>
              </div>-->
            </div>
          </div>
        </div>
        <!--三图标-->
        <div class="sidestrip_icon">
          <a id="si_1" :class="{on:tabActive==1}" @click="tabActive=1"></a>
          <a id="si_2" :class="{on:tabActive==2}" @click="tabActive=2"></a>
          <!-- <a id="si_3" :class="{on:tabActive==3}" @click="tabActive=3"></a> -->
          <a class="logout" @click="logOutIm"></a>
        </div>

        <!--底部扩展键-->
        <div id="doc-dropdown-justify-js">
          <div class="am-dropdown" id="doc-dropdown-js" style="position: initial;">
            <!-- <div class="sidestrip_bc am-dropdown-toggle"></div> -->
            <ul class="am-dropdown-content" style>
              <li>
                <a
                  href="#"
                  data-am-modal="{target: '#doc-modal-1', closeViaDimmer: 0, width: 400, height: 225}"
                >意见反馈</a>
                <div class="am-modal am-modal-no-btn" tabindex="-1" id="doc-modal-1">
                  <div class="am-modal-dialog">
                    <div class="am-modal-hd">
                      Modal 标题
                      <a
                        href="javascript: void(0)"
                        class="am-close am-close-spin"
                        data-am-modal-close
                      >&times;</a>
                    </div>
                    <div class="am-modal-bd">Modal 内容。本 Modal 无法通过遮罩层关闭。</div>
                  </div>
                </div>
              </li>

              <li>
                <a href="#">备份与恢复</a>
              </li>
              <li>
                <a href="#">设置</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!--聊天列表-->
      <div v-show="tabActive==1" class="middle">
        <div class="wx_search">
          <input type="text" placeholder="搜索">
          <button title="发起群聊">+</button>
        </div>
        <div class="office_text">
          <ul class="user_list" id="talk_list">
            <li
              :class="{'user_active':judge(msg).active}"
              v-for="(msg,index) in talkList"
              :key="index"
              @click="changeObject(judge(msg).uid,judge(msg).type)"
            >
              <div>
                <div class="user_head">
                  <img :src="judge(msg).avatar">
                </div>
                <div class="user_text">
                  <p class="user_name">{{ judge(msg).nick }}</p>
                  <p class="user_message">{{ judge(msg).content }}</p>
                </div>
                <div class="user_time">{{ judge(msg).time | formatDate }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!--好友列表-->
      <div v-show="tabActive==2" class="middle">
        <div class="wx_search">
          <input type="text" placeholder="搜索">
          <button title="发起群聊">+</button>
        </div>
        <div class="office_text">
          <ul class="friends_list">
            <!-- <div class="grouping">
              <p class="grouping-title">新的朋友</p>
              <li class="friends-item">
                <div class="item-box">
                  <img src="/static/images/head/1.jpg"/>
                  <p class="user_name">新的朋友</p>
                </div>
              </li>
            </div>-->
            <div class="grouping" v-show="groupList.length">
              <p class="grouping-title">群聊列表</p>
              <!-- <li
                class="friends-item"
                v-for="(group, index) in groupList"
                :key="index"
                @click="showBox(group.gid,'group')"
              > -->
              <li
                class="friends-item"
                v-for="(group, index) in groupList"
                :key="index"
                @click="changeObject(group.gid,'groupchat')"
              >
                <div class="item-box">
                  <img
                    :src="group.imgurlde=='avatar'||group.imgurlde==null?'/static/images/contact.png':group.imgurlde"
                    alt
                  >
                  <p>{{group.name}}</p>
                </div>
              </li>
            </div>
            <div class="grouping">
              <p class="grouping-title">好友列表</p>
              <!-- <li
                class="friends-item"
                v-for="(friend, index) in friendsList"
                :key="index"
                @click="showBox(friend.userId,'user')"
              > -->
              <li
                class="friends-item"
                v-for="(friend, index) in friendsList"
                :key="index"
                @click="changeObject(friend.userId,'chat')"
              >
                <div class="item-box">
                  <img
                    :src="friend.avatar=='false'||friend.avatar==''||!friend.avatar?'/static/images/contact.png':friend.avatar"
                    alt
                  >
                  <p>{{friend.nick}}</p>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>

      <!--程序列表-->
      <div v-show="tabActive==3" class="middle">
        <div class="wx_search">
          <input type="text" placeholder="搜索收藏内容">
          <button>+</button>
        </div>
        <div class="office_text">
          <ul class="icon_list">
            <li class="icon_active">
              <div class="icon">
                <img src="/static/images/icon/icon.png" alt>
              </div>
              <span>全部收藏</span>
            </li>
            <li>
              <div class="icon">
                <img src="/static/images/icon/icon1.png" alt>
              </div>
              <span>链接</span>
            </li>
            <li>
              <div class="icon">
                <img src="/static/images/icon/icon2.png" alt>
              </div>
              <span>相册</span>
            </li>
            <li>
              <div class="icon">
                <img src="/static/images/icon/icon3.png" alt>
              </div>
              <span>笔记</span>
            </li>
            <li>
              <div class="icon">
                <img src="/static/images/icon/icon4.png" alt>
              </div>
              <span>文件</span>
            </li>
            <li>
              <div class="icon">
                <img src="/static/images/icon/icon5.png" alt>
              </div>
              <span>音乐</span>
            </li>
            <li>
              <div class="icon">
                <img src="/static/images/icon/icon6.png" alt>
              </div>
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
              <li>
                <a href>
                  <img src="/static/images/icon/icon7.png">
                </a>
              </li>
              <li>
                <a href>
                  <img src="/static/images/icon/icon8.png">
                </a>
              </li>
              <li>
                <a href>
                  <img src="/static/images/icon/icon9.png">
                </a>
              </li>
              <li>
                <a href>
                  <img src="/static/images/icon/icon10.png">
                </a>
              </li>
            </ul>
            <div class="extend" data-am-offcanvas="{target: '#doc-oc-demo3'}"></div>
            <!-- 侧边栏内容 -->
            <div id="doc-oc-demo3" class="am-offcanvas">
              <div class="am-offcanvas-bar am-offcanvas-bar-flip">
                <div class="am-offcanvas-content">
                  <div class="info-box" v-if="activeMessageViewType=='groupchat'">
                    本群详情
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--聊天内容-->
        <div v-if="activeBox=='chat'" class="chat-box">
          <div class="windows_body" ref="windowsBody">
            <div class="office_text message_view" style="height: 100%;">
              <ul ref="officeText" class="content" id="chatbox">
                <li
                  :class="[message.data.from==user.userId?'me':'other']"
                  v-for="(message,index) in activeMessageList"
                  :key="index"
                >
                <div v-if="message.data.ext.action==6001">
                  <p class="tip">{{message.data.body.content}}</p>
                </div>
                <div v-else>
                  <img
                    :src="message.data.ext.avatar=='false'||message.data.ext.avatar==''||!message.data.ext.avatar?'/static/images/contact.png':message.data.ext.avatar"
                    :title="message.data.ext.nick"
                  >
                  <span class="content_box" v-if="message.data.msgType==2001" @contextmenu="showTools($event,message)">{{message.data.body.content}}</span>
                  <span class="img_box content_box" v-else-if="message.data.msgType==2002" @contextmenu="showTools($event,message)">
                    <img :title="message.data.body.fileName" :src="message.data.body.remotePath" :alt='message.data.body.fileName'>
                  </span>
                </div>
                </li>
              </ul>
            </div>
            <ul v-show="showMenu" ref="contextmenu" class="menu-ul">
              <li class="menu-li" v-if="menuItem.show" v-for="(menuItem,key) in contextmenu" :key="key" @click="clickMenuEvent(menuItem)">
                {{menuItem.eventName}}
              </li>
            </ul>
          </div>
          <div class="windows_input" id="talkbox">
            <div class="input_icon">
              <div ref="container" class="icon-item" id="container">
                <button ref="addImg" id="addImg" class="btn"></button>
              </div>
            </div>
            <div class="input_box">
              <textarea ref="inputBox" contenteditable="true" name rows cols id="input_box"></textarea>
              <button id="send" @click="sendMsg(2001)">发送（S）</button>
            </div>
          </div>
        </div>

        <!-- 详情窗口 -->
        <div v-if="activeBox=='info'" class="info-box">
          <div v-if="activeInfo=='user'" class="user-info">
            {{infoId}}
          </div>
          <ul v-if="activeInfo=='group'" class="group-info">
            {{infoId}}
          </ul>
      </div>
      </div>
    </div>
    <selectList v-show="true"></selectList>
  </div>
</template>

<script>
import "jquery";
import "amazeui";
import dayjs from "dayjs";
import ajax from "../common/ajax";
import { readLocal, sortChinese, objSortFun, saveLocal } from "../common/utils";
import * as strophe from "../common/strophe.js";
import { creatUploader } from "../common/upload.js";
import * as API from "../api/index.js";
import Base64 from '@/common/base64';
import selectList from '@/components/selectList';

let base64 = new Base64();

export default {
  data() {
    return {
      user: null,
      userInfo: null,
      status: null,
      tabActive: 1,
      talkList: [],
      talkListKey: [],
      talkListJson: {},
      chatFriend: "",
      friendsJson: {},
      groupJson: {},
      friendsList: [],
      groupList: [],
      messageJson: {},
      activeMessageList: [],
      activeMessageView: "",
      activeMessageViewType: "",
      activeObject: {},
      isLogOut: false,
			multi: false,
			activeBox:'chat',
			activeInfo:'user',
			infoId:0,
			showMenu:false,
			msgItem: null,
			contextmenu:{
				1:{
					eventType:1,
					show:true,
					eventName:'复制'
				},
				2:{
					eventType:2,
					show:true,
					eventName:'转发'
				},
				3:{
					eventType:3,
					show:false,
					eventName:'撤回'
				}
			},
			groupMembers:[],
    };
  },
  components:{
    selectList,
  },
  filters: {
    formatDate(val) {
      if (!dayjs(val).isValid()) return;
      let now = dayjs();
      let n_m = now.month();
      let n_d = now.date();
      let M = dayjs(val).month();
      let D = dayjs(val).date();
      let H = dayjs(val).hour();
      let m = dayjs(val).minute();
      if (M == n_m) {
        if (D == n_d) {
          return H + ":" + m;
        } else if (n_d - D == 1) {
          return "昨天";
        }
      } else {
        return M + "月" + D + "日 ";
      }
    }
  },
  watch: {
    activeMessageView(newval, oldval) {
      if (this.activeMessageViewType == "groupchat") {
        if (this.groupJson[newval]) {
          this.activeObject = this.groupJson[newval];
					this.activeObject.nick = this.groupJson[newval].name;
        }
      } else if (this.activeMessageViewType == "chat") {
        this.activeObject = this.friendsJson[newval];
      }
      if (this.messageJson[newval]) {
        this.activeMessageList = this.messageJson[newval].msgs;
      }
			this.buildTalkView(newval);
    }
  },
  methods: {
    judge(oMsg) {
      let suid, avatar, nick;
      if (oMsg.data.chatType == 2) {
        suid = oMsg.data.to;
        let thisGroupJson = this.groupJson[suid];
        if (thisGroupJson) {
          if (!thisGroupJson.imgurlde || thisGroupJson.imgurlde == "false") {
            avatar = "/static/images/contact.png";
          } else {
            avatar = thisGroupJson.imgurlde;
          }
          nick = thisGroupJson.name;
        }
      } else if (oMsg.data.chatType == 1) {
        if (oMsg.data.from == this.user.userId) {
          suid = oMsg.data.to;
          if (
            this.friendsJson[suid].avatar == "" ||
            this.friendsJson[suid].avatar == "false" ||
            !this.friendsJson[suid].avatar
          ) {
            avatar = "/static/images/contact.png";
          } else {
            avatar = this.friendsJson[suid].avatar;
          }
          nick = this.friendsJson[suid].nick;
        } else {
          suid = oMsg.data.from;
          if (
            oMsg.data.ext.avatar == "" ||
            oMsg.data.ext.avatar == "false" ||
            !oMsg.data.ext.avatar
          ) {
            avatar = "/static/images/contact.png";
          } else {
            avatar = oMsg.data.ext.avatar;
          }
          nick = oMsg.data.ext.nick;
        }
      }


      let active = suid == this.activeMessageView;
      let data = {
        active: active,
        uid: suid,
        avatar: avatar,
        nick: nick,
        time: oMsg.time,
        content: oMsg.data&&oMsg.data.msgType == 2002 ? "[图片]" : oMsg.data.body.content,
        type: oMsg.data.chatType == 1?'chat':'groupchat',
        msgType: oMsg.data.msgType
      };
      // console.log(data)
      return data;
		},

    changeObject(uid, type) {
		  this.activeBox = 'chat',
      this.activeMessageView = uid;
      this.activeMessageViewType = type;
		},

    async buildTalkView(uid) {
      let _this = this;
			if(this.activeMessageViewType=='groupchat'){
				let params1 = {
					groupId:this.activeMessageView,
					uid:this.user.userId
				}
				let params2 = {
					gid:this.activeMessageView,
					uid:this.user.userId
				}
				try{
					let msgData = await API.getMsgByTimestamp(params1);
					let groupMembersData = await API.getmucMembers(params2);
					this.groupMembers = groupMembersData.data;
					let msgList = msgData.data;
					msgList.sort((a,b)=>{
						if(a){
							let timeA = parseInt(a.timeStamp)
							let timeB = parseInt(b.timeStamp)
							return timeA-timeB
						}else{
							return 0
						}
          })
					msgList.forEach(msgItem=>{
						let msg = JSON.parse(base64.decode(msgItem.message));
            msg['time'] = parseInt(msgItem.timeStamp);
            if(msg.data.ext.action==6001){
              if(msg.data.from==this.user.userId){
                msg.data.body.content = '你撤回了一条消息'
              }else if(this.groupMembers[0].userId==this.user.userId){
                msg.data.body.content = '你撤回了 \"'+msg.data.ext.nick+'\" 的一条消息'
              }
            }
            console.log(msg)
						strophe.saveMsg(msg);
					})
				}catch(err){
					console.log(err)
				}
      }
      this.activeMessageList = this.messageJson[uid]?this.messageJson[uid]:[];
      setTimeout(function() {
        _this.$refs.officeText.scrollTop = _this.$refs.officeText.scrollHeight;
      }, 0);
		},

    checkEnter(e) {
      var et = e || window.event;
      var keycode = et.charCode || et.keyCode;
      if (keycode == 13) {
        if (window.event) {
          window.event.returnValue = false;
        } else {
          e.preventDefault(); //for firefox
        }
        this.sendMsg(2001);
      }
		},

    sendMsg(msgType, imgFile) {
      if (!this.activeMessageView) {
        alert("请先选择聊天对象");
        return false;
      }
      let tojid = this.activeMessageView;
      let jid = this.user.userId;
      let msg = this.$refs.inputBox.value;
      let msg_copy = msg;
      if (msgType == 2001 && msg.replace(/^\s+|\s+$/g, "").length == 0) {
        alert("不能发送空消息");
        return false;
      }
      let msgObj = {
        to: tojid,
        from: jid,
        type: "chat"
      };
      if (msgType == 2001) {
        strophe.sendMsg(msgObj, msgType, this.$refs.inputBox);
      } else if (msgType == 2002) {
        strophe.sendMsg(msgObj, msgType, imgFile);
      }
		},

    logOutIm() {
      this.isLogOut = true;
      strophe.logOutIm("主动登出");
		},

		showBox(id,type){
			this.activeBox = 'info'
			if(type==='group'){
				this.activeInfo = 'group';
			}else{
				this.activeInfo = 'user';
			}
			this.infoId = id
		},

		showTools(e,msg){
      console.log(msg)
      if(msg.data.msgType==2002){
        this.contextmenu['1'].show = false;
      }else{
        this.contextmenu['1'].show = true;
      }

			if(this.activeMessageViewType == "groupchat"){
				if(this.groupMembers[0].userId==this.user.userId||msg.data.from==this.user.userId) {
					this.contextmenu['3'].show = true;
				}else{
					this.contextmenu['3'].show = false;
        }
			}else{
				if(msg.data.from==this.user.userId){
					this.contextmenu['3'].show = true;
				}else{
					this.contextmenu['3'].show = false;
				}
			}

			e.preventDefault() ? e.preventDefault() : (e.returnValue = false);;
			e.stopPropagation();
			let windowsBody = this.$refs.windowsBody
			let contextmenu = this.$refs.contextmenu

			let x = e.clientX - windowsBody.getBoundingClientRect().x
			let y = e.clientY - windowsBody.getBoundingClientRect().y
			contextmenu.style.left = x+'px'
			contextmenu.style.top = y+'px'
			this.showMenu = true;
			this.msgItem = msg;
		},

		clickMenuEvent(menuItem){
			switch(menuItem.eventType){
				case 1:
					this.copyCont();
					break;
				case 2:
					this.forwardMsg();
					break;
				case 3:
					this.withdrawMsg();
					break;
			}
    },

		copyCont(){
      console.log('复制内容');
      let input = document.createElement('input');
      input.value = this.msgItem.data.body.content;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      input.remove()
		},

		forwardMsg(){
			console.log('转发消息');
		},

		withdrawMsg(){
			console.log('撤回消息');
      strophe.withdrawMsg(this.msgItem)
		},


  },
  async created() {
    let _this = this;
    strophe.setVM(this);
    let routeParams = this.$route.params;
    if (routeParams && routeParams.userId) {
      this.user = readLocal("user_" + routeParams.userId);
      this.multi = true;
    } else {
      this.multi = false;
      this.user = readLocal("user");
    }
    if (!this.user) {
      this.$router.replace({ name: "login" });
    }
    let uid = this.user.userId;
    let userInfo = {
      userId: uid,
      imPassword: this.user.imPassword
    };

    //登录聊天服务器
    strophe.loginIm(userInfo);

    //获取好友列表
    let friendsData = await API.getFriendsList({
      uid: uid
    });
    friendsData.data.forEach(item => {
      item.isGroup = false;
      this.friendsJson[item.userId] = item;
    });

    //存储好友列表到本地
    saveLocal("FRIENDS_LIST_" + uid, this.friendsJson);
    for (let item in this.friendsJson) {
      this.friendsList.push(this.friendsJson[item]);
    }

    //获取群列表
    let groupData = await API.getGroupList({
      jsonStr: JSON.stringify({
        command: {
          node: "group-get",
          fields: [
            {
              var: "uid",
              value: this.user.userId
            }
          ]
        }
      })
    });
    groupData.data.command.fields.forEach(item => {
      let groupId = item.gid;
      item.isGroup = true;
      this.groupJson[groupId] = item;
    });
    //存储群列表到本地
    saveLocal("GROUP_LIST_" + uid, this.groupJson);
    for (let item in this.groupJson) {
      this.groupList.push(this.groupJson[item]);
    }
    let activeTime = new Date().getTime();
    this.friendsJson = readLocal("FRIENDS_LIST_" + uid) || {};
    this.messageJson = readLocal("MESSAGE_JSON_" + uid) || {};

    for (let key in this.messageJson) {
      var msgItem = this.messageJson[key];
      let msgsList = [];
      msgItem.forEach(function(item, index) {
        if (activeTime - item.time < 24 * 60 * 60 * 1000) {
          msgsList.push(item);
        }
      });
      if (msgsList.length == 0) {
        delete this.messageJson[key];
      }
    }
    this.talkList = readLocal("TALK_LIST_" + uid) || [];

    var copyTalkList = [];
    this.talkList.forEach(function(item, index) {
      if (activeTime - item.time < 24 * 60 * 60 * 1000) {
        copyTalkList.push(item);
      }
    });

    this.talkList = copyTalkList;

    this.talkListJson = readLocal("TALK_LIST_JSON" + uid) || {};

    if (this.talkList.length) {
      let activeTalkList = this.talkList[0];
      if (activeTalkList.data.chatType == "1") {
        if (activeTalkList.data.from == this.user.userId) {
          this.activeMessageView = activeTalkList.data.to;
        } else {
          this.activeMessageView = activeTalkList.data.from;
        }
      } else if (activeTalkList.data.chatType == "2") {
        this.activeMessageView = activeTalkList.data.to;
      }
      this.activeMessageViewType = activeTalkList.data.chatType == "1"?'chat':'groupchat';
    }
    this.$refs.inputBox.addEventListener("keydown", function(e) {
      _this.checkEnter(e);
    });
  },
  mounted() {
    creatUploader(this);
  }
};
</script>

<style lang="stylus">

.wrapper
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center

.middle {
  display: block;
}

.own_head {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  overflow: hidden;
  margin-left: 10px;

  img {
    width: 100%;
    height: 100%;
  }
}

.sidestrip_icon {
  padding: 0;
  text-align: center;

  a {
    display: inline-block;
    width: 60px;
    height: 40px;
    margin-bottom: 10px;
    cursor: pointer;

    &#si_1 {
      background: url('/static/images/icon/head_2.png') no-repeat center;

      &.on {
        background: url('/static/images/icon/head_2_1.png') no-repeat center;
      }
    }

    &#si_2 {
      background: url('/static/images/icon/head_3.png') no-repeat center;

      &.on {
        background: url('/static/images/icon/head_3_1.png') no-repeat center;
      }
    }

    &#si_3 {
      background: url('/static/images/icon/head_4.png') no-repeat center;

      &.on {
        background: url('/static/images/icon/head_4_1.png') no-repeat center;
      }
    }
  }
}

.friends_list li {
  border: none;
  padding-top: 0;
}

.friends_list li:hover .item-box {
  background: #dedbdb;
}

.friends_list .item-box {
  display: flex;
  text-align: left;
  padding: 12px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
  }

  p {
    flex: 1;
    padding-left: 8px;
    font-size: 14px;
    color: #333;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.office_text {
  overflow-y: auto;

  .content_box {
    word-wrap: break-word;
    word-break: normal;
    font-size: 14px;
    line-height: 18px;
  }

  .img_box {
    max-width: 80%;

    img {
      width: 100%;
    }
  }
  .tip {
    text-align center
  }
}

.am-offcanvas-bar{
  background #f1f1f1
  &:after{
    display none
  }
  box-shadow 0 -2px 10px #666
}

.message_view {
  display: flex;
  flex-flow: column;
  align-items: flex-start;

  ul {
    display: flex;
    overflow-y: auto;
    flex-flow: column-reverse;

    li {
      overflow: visible;
      padding-top: 10px;
    }
  }
}

.user_head {
  background: none;
}

.grouping {
  border-bottom: 1px solid #dddbdb;

  .grouping-title {
    font-size: 12px;
    padding: 12px;
    color: #999999;
  }
}

.input_icon {
  line-height: 42px;
}

.icon-item {
  display: inline-block;
}

#addImg {
  width: 30px;
  height: 30px;
  border: none;
  background: url('/static/images/icon/icon14.png') no-repeat center;

  &:hover {
    background: url('/static/images/icon/icon14_1.png') no-repeat center;
  }
}

.logout {
  position: absolute;
  bottom: 0;
  left: 0;
  background: url('/static/images/logout.png') no-repeat center;

  &:hover {
    background: url('/static/images/logout_1.png') no-repeat center;
  }
}

.menu-ul{
	position absolute
	width 60px
	border-radius 5px;
	background #ddd;
	font-size 12px
	color #666
	line-height 24px
	text-align center
	box-shadow 2px 2px 4px #999
	overflow hidden
	.menu-li{
		border-top 1px dotted #fff
		cursor pointer
		&:hover{
			background #c9c9c9
			color #333
		}
		&:first-child{
			border-top none
		}
	}
}

</style>
