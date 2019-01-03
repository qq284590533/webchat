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
          <button title="发起群聊" @click="createGroup">+</button>
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
                  <p class="user_message" v-html="resolvContent(judge(msg).content)"></p>
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
          <button title="发起群聊" @click="createGroup">+</button>
        </div>
        <div class="office_text">
          <ul class="friends_list">
            <div class="grouping">
              <p class="grouping-title">新的朋友</p>
              <li class="friends-item" @click="showNewFriend">
                <div class="item-box">
                  <img src="/static/images/contact.png"/>
                  <p class="user_name">新的朋友</p>
                </div>
              </li>
            </div>
            <div class="grouping" v-show="groupList.length">
              <p class="grouping-title">群聊列表</p>

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
                    <ul class="groupmembers-list">
                      <li v-for="(item, index) in groupMembers" :key="index" :title="item.nick">
                        <img
                          :src="item.avatar=='false'||item.avatar==''||!item.avatar?'/static/images/contact.png':item.avatar"
                          alt
                        >
                        <p class="nick">{{item.nick}}</p>
                      </li>
                      <li v-show="user.userId == groupCreator">
                        <span class="add-member" title="添加组员" @click="addMember">+</span>
                      </li>
                      <li v-show="user.userId == groupCreator">
                        <span class="delete-member" title="删除组员" @click="deleteMember">-</span>
                      </li>
                    </ul>
                    <button
                      v-show="user.userId == groupCreator"
                      class="delete-group"
                      @click="deleteGroupHandle"
                    >解散本群</button>
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
                    <span
                      class="content_box"
                      v-if="message.data.msgType==2001"
                      @contextmenu="showTools($event,message)"
                      v-html="resolvContent(message.data.body.content)"
                    ></span>
                    <span
                      class="img_box content_box"
                      v-else-if="message.data.msgType==2002"
                      @contextmenu="showTools($event,message)"
                    >
                      <img
                        :title="message.data.body.fileName"
                        :src="message.data.body.remotePath"
                        :alt="message.data.body.fileName"
                      >
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <ul v-show="showMenu" ref="contextmenu" class="menu-ul">
              <li
                class="menu-li"
                v-if="menuItem.show"
                v-for="(menuItem,key) in contextmenu"
                :key="key"
                @click="clickMenuEvent(menuItem)"
              >{{menuItem.eventName}}</li>
            </ul>
          </div>
          <div class="windows_input" id="talkbox">
            <div class="face-box" v-show="showFaceBox" @click.stop="(function(){return false})">
              <div class="face-content emoji-box">
                <ul class="emoji-list" unselectable="on" onmousedown="return false;">
                  <li unselectable="on" onmousedown="return false;" class="emoji-item" v-for="(faceCode,index) in faceCodeList" :key="index" @click="inputEmoji(faceCode)">
                    <img :src="'/static/images/faceEmoji0/'+faceCode+'@3x.png'" alt="" srcset="">
                  </li>
                </ul>
              </div>
            </div>
            <div class="input_icon" unselectable="on" onmousedown="return false;">
              <button ref="emoji" id="emoji" class="btn" @click.stop="showFaceBox=true"></button>
              <div ref="container" class="icon-item" id="container">
                <button ref="addImg" id="addImg" class="btn"></button>
              </div>
            </div>
            <div class="input_box">
              <!-- <textarea ref="inputBox" contenteditable="true" id="input_box"></textarea> -->
              <div ref="inputBox" class="textarea" contenteditable="true" id="input_box"></div>
              <button id="send" @click="sendMsg(2001)">发送（S）</button>
            </div>
          </div>
        </div>

        <!-- 详情窗口 -->
        <div v-if="activeBox=='info'" class="info-box">
          <div v-if="activeInfo=='user'" class="user-info">{{infoId}}</div>
          <ul v-if="activeInfo=='group'" class="group-info">{{infoId}}</ul>
        </div>

		<!-- 新的朋友 -->
        <div v-if="activeBox=='newFriend'" class="new-friend-box">
          <div class="new-friend-content">
						<ul class="new-friend-list">
							<li class="new-friend-item" v-for="(item,index) in newFriend" :key="index">
                <img :src="'/static/images/contact.png'" alt="">
                <div class="reason">
                  <p>{{item.nick}}</p>
                  <p>{{item.reason}}</p>
                </div>
                <div class="button-box"><button v-if="!item.isadded" @click="passAdd(item)">同意</button><span v-else>已添加</span></div>
							</li>
						</ul>
					</div>
        </div>
      </div>
    </div>
    <selectList
      :isShow="showSelector"
      :listData="listData"
      :checktype="checktype"
      @onensure="onensure"
      @oncancel="oncancel"
    ></selectList>
		<newFriendBox
			:isShow="showNewFriendBox"
			:friendData="friendData"
      @onensure="addFriend"
      @oncancel="addFriendCancel"
		></newFriendBox>
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
import Base64 from "@/common/base64";
import selectList from "@/components/selectList";
import newFriendBox from "@/components/newFriend";
import simulateTextarea from "../common/simulateTextarea.js"

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
      activeBox: "chat",
      activeInfo: "user",
      infoId: 0,
      showMenu: false,
      msgItem: null,
      contextmenu: {
        1: {
          eventType: 1,
          show: true,
          eventName: "复制"
        },
        2: {
          eventType: 2,
          show: true,
          eventName: "转发"
        },
        3: {
          eventType: 3,
          show: false,
          eventName: "撤回"
        }
      },
      checktype: "checkbox",
      showSelector: false,
      showNewFriendBox: false,
      groupMembers: [],
      groupCreator: null,
      listData: [],
      selectListType: 0, //1:创建群组选择联系人列表，2:转发选择联系人列表，3：删除群成员选择联系人列表，4：添加群成员选择联系人列表
      eventObj: {
        prop: null,
        handleFunc: () => null
	  	},
			newFriend: [],
      friendData: {},
      showFaceBox: false,
      faceCodeList: [],
    };
  },
  components: {
	selectList,
	newFriendBox
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
    },
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
    },

    selectListType(newval, oldval) {
      switch (newval) {
        case 1:
          this.listData = this.getSelectFriendstList();
          break;
        case 2:
          this.listData = this.getSelectContactList();
          break;
        case 3:
          this.listData = this.getSelectGroupMemberstList();
          break;
        case 4:
          this.listData = this.getSelectaddMemberstList();
          break;
        default:
          this.listData = [];
          break;
      }
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
        content:
          oMsg.data && oMsg.data.msgType == 2002
            ? "[图片]"
            : oMsg.data.body.content,
        type: oMsg.data.chatType == 1 ? "chat" : "groupchat",
        msgType: oMsg.data.msgType
      };
      // console.log(data)
      return data;
    },

    changeObject(uid, type) {
      (this.activeBox = "chat"), (this.activeMessageView = uid);
      this.activeMessageViewType = type;
    },

    async buildTalkView(uid) {
      let _this = this;
      if (this.activeMessageViewType == "groupchat") {
        let params1 = {
          groupId: this.activeMessageView,
          uid: this.user.userId
        };
        let params2 = {
          gid: this.activeMessageView,
          uid: this.user.userId
        };
        this.groupCreator = this.groupJson[uid].creator;
        try {
          let msgData = await API.getMsgByTimestamp(params1);
          let groupMembersData = await API.getmucMembers(params2);
          this.groupMembers = groupMembersData.data;
          let msgList = msgData.data;
          msgList.sort((a, b) => {
            if (a) {
              let timeA = parseInt(a.timeStamp);
              let timeB = parseInt(b.timeStamp);
              return timeA - timeB;
            } else {
              return 0;
            }
          });
          msgList.forEach(msgItem => {
            let msg = JSON.parse(base64.decode(msgItem.message));
            msg["time"] = parseInt(msgItem.timeStamp);
            // console.log(msg);
            // if(msg.data.ext.action==6001){
            //   if(this.groupList[uid].creator==this.user.userId){
            //     msg.data.body.content = '你撤回了一条消息'
            //   }else if(this.groupMembers[0].userId==this.user.userId){
            //     msg.data.body.content = '你撤回了 \"'+msg.data.ext.nick+'\" 的一条消息'
            //   }
            // }
            // console.log(msg)
            strophe.saveMsg(msg);
          });
        } catch (err) {
          console.log(err);
        }
      }
      this.activeMessageList = this.messageJson[uid]
        ? this.messageJson[uid]
        : [];
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
      // let msg = this.$refs.inputBox.innerText;
      // console.log(msg)
      // let msg_copy = msg;
      // if (msgType == 2001 && msg.replace(/^\s+|\s+$/g, "").length == 0) {
      //   alert("不能发送空消息");
      //   return false;
      // }
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

    showBox(id, type) {
      this.activeBox = "info";
      if (type === "group") {
        this.activeInfo = "group";
      } else {
        this.activeInfo = "user";
      }
      this.infoId = id;
    },

    showNewFriend(id, type) {
      this.activeBox = "newFriend";

    },

    showTools(e, msg) {
      // console.log(msg);
      if (msg.data.msgType == 2002) {
        this.contextmenu["1"].show = false;
      } else {
        this.contextmenu["1"].show = true;
      }

      if (this.activeMessageViewType == "groupchat") {
        if (
          this.groupMembers[0].userId == this.user.userId ||
          msg.data.from == this.user.userId
        ) {
          this.contextmenu["3"].show = true;
        } else {
          this.contextmenu["3"].show = false;
        }
      } else {
        if (msg.data.from == this.user.userId) {
          this.contextmenu["3"].show = true;
        } else {
          this.contextmenu["3"].show = false;
        }
      }

      e.preventDefault() ? e.preventDefault() : (e.returnValue = false);
      e.stopPropagation();
      let windowsBody = this.$refs.windowsBody;
      let contextmenu = this.$refs.contextmenu;

      let x = e.clientX - windowsBody.getBoundingClientRect().x;
      let y = e.clientY - windowsBody.getBoundingClientRect().y;
      contextmenu.style.left = x + "px";
      contextmenu.style.top = y + "px";
      this.showMenu = true;
      this.msgItem = msg;
    },

    //点击邮件菜单事件分配方法
    clickMenuEvent(menuItem) {
      switch (menuItem.eventType) {
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

    //创建群组
    createGroup() {
      //暂时未开放
      // this.initSelector(1)
      // this.eventObj.handleFunc = this.createGroupHandle;
    },

    //创建群组事件处理
    createGroupHandle(list) {
      // console.log(list);
    },

    getSelectContactList() {
      let list = [];
      this.friendsList.forEach(item => {
        let friendsItem = {
          avatar:
            item.avatar == "" || item.avatar == "false" || !item.avatar
              ? "/static/images/contact.png"
              : item.avatar,
          nick: item.nick,
          uid: item.userId,
          type: "user"
        };
        list.push(friendsItem);
      });
      this.groupList.forEach(item => {
        let groupItem = {
          avatar:
            item.imgurlde == "" || item.imgurlde == "false" || !item.imgurlde
              ? "/static/images/contact.png"
              : item.imgurlde,
          nick: item.name,
          uid: item.gid,
          type: "group"
        };
        list.push(groupItem);
      });
      // console.log(list);
      return list;
    },

    getSelectFriendstList() {
      let list = [];
      this.friendsList.forEach(item => {
        let friendsItem = {
          avatar:
            item.avatar == "" || item.avatar == "false" || !item.avatar
              ? "/static/images/contact.png"
              : item.avatar,
          nick: item.nick,
          uid: item.userId,
          type: "user"
        };
        list.push(friendsItem);
      });
      // console.log(list);
      return list;
    },

    //获取群成员选择列表
    getSelectGroupMemberstList() {
      let list = [];
      this.groupMembers.forEach(item => {
        let memberItem = {
          avatar:
            item.avatar == "" || item.avatar == "false" || !item.avatar
              ? "/static/images/contact.png"
              : item.avatar,
          nick: item.nick,
          uid: item.userId,
          type: "user"
        };
        list.push(memberItem);
      });
      // console.log(list);
      return list;
    },

    //获取添加群成员选择列表
    getSelectaddMemberstList() {
      let list = this.getSelectFriendstList();
      // console.log(list);
      list.forEach(item => {
        let isInGroup = false;
        for (let i = 0; i < this.groupMembers.length; i++) {
          let membersItem = this.groupMembers[i];
          if (membersItem.userId == item.uid) {
            item["disable"] = true;
            item["selected"] = true;
          }
        }
      });
      return list;
    },

    //复制消息方法
    copyCont() {
      // console.log("复制内容");
      let input = document.createElement("input");
      input.value = this.msgItem.data.body.content;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      input.remove();
    },

    //转发消息事件设置
    forwardMsg() {
      // console.log("转发消息");
      this.initSelector(2);
      this.eventObj.prop = this.msgItem;
      this.eventObj.handleFunc = this.forwardMsgHandle;
    },

    //转发消息处理函数
    forwardMsgHandle(msg, list) {
      // console.log(list);
      if (!list.length) {
        alert("至少选择一个联系人！");
        return;
      }
      list.forEach(item => {
        let msgcopy = JSON.parse(JSON.stringify(msg));
        let uid = item.uid;
        let chatType = item.type == "user" ? "chat" : "groupchat";
        strophe.forwardMsg(uid, msgcopy, chatType);
      });
    },

    //撤回消息
    withdrawMsg() {
      // console.log("撤回消息");
      strophe.withdrawMsg(this.msgItem);
    },

    //初始化选择列表
    initSelector(selectType) {
      this.selectListType = selectType;
      this.showSelector = true;
    },

    //事件方法执行器
    eventHandle(argument) {
      let prop = this.eventObj.prop;
      let funcName = this.eventObj.handleFunc;
      if (prop) {
        funcName(prop, argument);
      } else {
        funcName(argument);
      }
      this.eventObj = {
        prop: null,
        handleFunc: () => null
      };
    },

    //选择列表确定按钮事件处理
    onensure(list) {
      this.eventHandle(list);
      this.showSelector = false;
      this.selectListType = 0;
      this.checktype = "checkbox";
    },

    oncancel() {
      // console.log("取消");
      this.showSelector = false;
      this.selectListType = 0;
      this.checktype = "checkbox";
    },

    addMember() {
      this.initSelector(4);
      this.eventObj.handleFunc = this.addMemberHandle;
    },

    async addMemberHandle(list) {
      // console.log(list);
      let memberList = [];
      list.forEach(item => {
        memberList.push(item.uid);
      });
      let params = JSON.stringify({
        command: {
          node: "member-add",
          fields: [
            {
              var: "uid",
              value: this.user.userId
            },
            {
              var: "gid",
              value: this.activeMessageView
            },
            {
              var: "oid",
              value: memberList
            }
          ]
        }
      });
      // console.log(params)
      try {
        let res = await API.addMember({
          jsonStr: params
        });

        let groupMembersData = await API.getmucMembers({
          gid: this.activeMessageView,
          uid: this.user.userId
        });
        this.groupMembers = groupMembersData.data;
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    },

    deleteMember() {
      this.checktype = "radio";
      this.initSelector(3);
      this.eventObj.handleFunc = this.deleteMemberHandle;
    },
    async deleteMemberHandle(list) {
      // console.log(list);
      let memberList = [];
      list.forEach(item => {
        memberList.push(item.uid);
      });
      let params = JSON.stringify({
        command: {
          node: "member-del",
          fields: [
            {
              var: "uid",
              value: this.user.userId
            },
            {
              var: "gid",
              value: this.activeMessageView
            },
            {
              var: "oid",
              value: memberList
            }
          ]
        }
      });
      // console.log(params)
      try {
        let res = await API.deleteMember({
          jsonStr: params
        });
        let groupMembersData = await API.getmucMembers({
          gid: this.activeMessageView,
          uid: this.user.userId
        });
        this.groupMembers = groupMembersData.data;
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    },

    async deleteGroupHandle() {
      let doDelete = confirm("确定解散群组吗？");
      if (!doDelete) return;
      let params = JSON.stringify({
        command: {
          node: "group-del",
          fields: [
            {
              var: "uid",
              value: this.user.userId
            },
            {
              var: "gid",
              value: this.activeMessageView
            }
          ]
        }
      });
      try {
        let res = API.deleteGroup({
          jsonStr: params
        });
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async getGroupList(uid) {
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
      this.groupList = [];
      for (let item in this.groupJson) {
        this.groupList.push(this.groupJson[item]);
      }
		},

		async getFriends(uid){
					//获取好友列表
			this.friendsList = [];
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
		},

    passAdd(item){
      this.friendData = item;
      this.addFriend()
    },

		async addFriend(){
			// console.log("添加好友");
			try{
				let res = await API.addFriend({
					uid:this.user.userId,
					userId:this.friendData.userId
				});
				// console.log(res);
        this.friendData['isadded'] = true;
        saveLocal('NEW_FRIEND_'+this.user.userId,this.newFriend)
				this.getFriends(this.user.userId)
			}catch(error){
				console.log(error)
			}
			this.showNewFriendBox = false;
		},
		async addFriendCancel(){
			this.showNewFriendBox = false;
    },
    createFaceList(){
      for(var i=1; i<140; i++){
        if(i==44) continue;
        let faceCode = 'emoji_'+i;
        this.faceCodeList.push(faceCode);
      }
    },
    inputEmoji(faceCode){
      let _this = this;
      let src = '/static/images/faceEmoji0/'+faceCode+'@3x.png';
      let img = document.createElement('img');
      img.src = src;
      img.className = 'emoji'
      img.alt = '['+faceCode+']'
      if(this.$refs.inputBox!=document.activeElement){
        this.$refs.inputBox.appendChild(img);
        return;
      }
      let selectEle, range;
      if(window.getSelection){
        selectEle = window.getSelection();
        if(selectEle.getRangeAt && selectEle.rangeCount){
          range = selectEle.getRangeAt(0);
          range.deleteContents();
          let el = document.createElement("div");
          el.appendChild(img);
          let frag = document.createDocumentFragment(), node, lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            selectEle.removeAllRanges();
            selectEle.addRange(range);
          }
        }
      }else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(img);
      }
      this.showFaceBox = false;
    },
    //解析内容
    resolvContent(val){
      // console.log(val);
      if(!val)return;
      let emojiRag = /\[emoji_[1-9]\d{0,}\]/gi;
      // val.replace(emojiRag,'11')
      // console.log(val.match(emojiRag))
      let emojiCodeList = val.match(emojiRag);
      if(!emojiCodeList) return val;
      let newVal = val;
      for(let i=0; i<emojiCodeList.length; i++){
        let length = emojiCodeList[i].length;
        let imgHtml = '<img class="emoji" src="/static/images/faceEmoji0/'+emojiCodeList[i].substring(1,length-1)+'@3x.png">'
        // console.log(imgHtml)
        newVal = newVal.replace(/\[emoji_[1-9]\d{0,}\]/i,imgHtml)
      }
      // console.log(newVal)
      return newVal
    }
  },
  async created() {
    let _this = this;
    this.createFaceList();
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

		this.newFriend = readLocal("NEW_FRIEND_" + uid) || []

		this.getFriends(uid);
    this.getGroupList(uid);

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
  },
  mounted() {
    let _this = this;
    simulateTextarea();
    this.$refs.inputBox.addEventListener("keydown", function(e) {
      _this.checkEnter(e);
    });
    document.body.addEventListener('click',function(){
      _this.showFaceBox = false;
    })
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
      this.activeMessageViewType =
        activeTalkList.data.chatType == "1" ? "chat" : "groupchat";
		}
    creatUploader(this);
  }
};
</script>

<style lang="stylus">
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

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
    line-height: 20px;
    .emoji{
      width 20px;
      height:20px;
      margin-bottom -4px;
    }
  }

  .img_box {
    max-width: 80%;

    img {
      width: 100%;
    }
  }

  .tip {
    text-align: center;
  }
}

.am-offcanvas-bar {
  background: #f1f1f1;

  &:after {
    display: none;
  }

  box-shadow: 0 -2px 10px #666;
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

#emoji {
  width: 30px;
  height: 30px;
  border: none;
  background: url('/static/images/icon/icon13.png') no-repeat center;

  &:hover {
    background: url('/static/images/icon/icon13_1.png') no-repeat center;
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

.menu-ul {
  position: absolute;
  width: 60px;
  border-radius: 5px;
  background: #ddd;
  font-size: 12px;
  color: #666;
  line-height: 24px;
  text-align: center;
  box-shadow: 2px 2px 4px #999;
  z-index 10;
  overflow: hidden;

  .menu-li {
    border-top: 1px dotted #fff;
    cursor: pointer;

    &:hover {
      background: #c9c9c9;
      color: #333;
    }

    &:first-child {
      border-top: none;
    }
  }
}

.am-offcanvas-content {
  .groupmembers-list {
    max-height: 400px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;

    li {
      width: 60px;
      height: 60px;
      display: flex;
      text-align: center;
      flex-flow: wrap;
      justify-content: center;
      margin-bottom: 10px;

      img {
        display: inline-block;
        width: 40px;
        height: 40px;
      }

      p {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 20px;
        font-size: 12px;
        color: #666;
      }

      span {
        width: 40px;
        height: 40px;
        border: 1px solid #bbb;
        cursor: pointer;
        font-size: 30px;
        line-height: 32px;
        font-weight: 100;
        color: #bbb;

        &:hover {
          border-color: #999;
          color: #999;
        }
      }
    }
  }

  .delete-group {
    border: none;
    height: 38px;
    width: 100%;
    color: #fff;
    background: #ff8e8e;
    border-radius: 4px;
    font-size: 14px;
    margin-top: 20px;

    &:hover {
      background: #ff7272;
    }
  }
}
.new-friend-list{
  width: 100%;
  box-sizing: border-box;
  padding: 0 15%;
  .new-friend-item{
    display: flex;
    padding: 10px 0;
    border-bottom 1px solid #ddd
    img{
      width:40px;
      height:40px;
    }
  }
  .reason{
    font-size 12px;
    margin 0 20px;
    flex auto;
    p:first-child{
      font-size 14px;
      line-height 24px;
    }
  }
  .button-box{
    width 40px;
    button{
      border none;
      border-radius 3px;
      width 40px;
      line-height 22px;
      background #0bbb07;
      color #fff;
      margin-top 8px;
    }
    span{
      display block;
      width 100%;
      line-height 40px;
      color #999;
      text-align center;
    }
  }
}
#talkbox{
  position relative;
  .face-box{
    position absolute;
    bottom 135px;
    left -50px;
    width 400px;
    background #fff;
    max-height 240px;
    border-radius 5px;
    box-shadow 2px 2px 6px #bbb;
    padding 0 10px;
    overflow auto;
    .face-content{
      padding 0 4px
      margin 20px 0
    }
    .emoji-box{
      .emoji-list{
        display flex;
        flex-wrap: wrap;
        align-items: flex-start;
        .emoji-item{
          width 36px;
          height 36px;
          padding 6px;
          box-sizing border-box;
          cursor pointer
          &:hover{
            background #ddd
          }
          img{
            width 100%
            height 100%
          }
        }
      }
    }
  }
}

#input_box{
  .emoji{
    width 20px;
    height 20px;
  }
}

.user_text p{
  img{
    width 18px;
    height 18px;
  }
}

</style>
