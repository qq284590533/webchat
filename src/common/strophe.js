import 'strophe.js'
import dayjs from 'dayjs'
import Base64 from './base64'
import { readLocal, saveLocal } from './utils'
import * as API from '../api/index.js'

let Strophe = window.Strophe;
let BOSH_SERVICE = 'http://47.106.34.37:5280/xmpp-httpbind';
let jid;
let base64 = new Base64()
let VM;
let connected = false;
let connection;
let reLogin = true;
connection = new Strophe.Connection(BOSH_SERVICE);
// connection = new Strophe.Connection(BOSH_SERVICE,{sync: false});
connection.rawInput = rawInput;
connection.rawOutput = rawOutput;

function setVM(vm){
	VM = vm;
}

function log(msg) {
	// console.log(msg);
}

function rawInput(data) {
	log('RECV: ' + data);
	let html = document.createElement('html');
	html.innerHTML = data;
	let body = html.querySelector('body');
	let condition = body.getAttribute('condition');
	if(condition&&condition=="remote-stream-error"){
		// alert("账号在其他地方登陆，您已被迫下线。")
		reLogin = confirm("账号在其他地方登陆，您已被迫下线，是否重新连接？");
	}
}

function rawOutput(data) {
	log('SENT: ' + data);
}

function exChangeJid(uid) {
	return uid + '@app.im/app';
};

function loginIm(param) {
	let userId = param.userId;
	jid = exChangeJid(userId);
	let imPassword = param.imPassword
	connection.connect(
		jid,
		imPassword,
		onConnect
	);
}


function logOutIm(reason) {
	connection.disconnect(reason);
	console.log('登出聊天服务器！');
	if(VM.multi){
		window.localStorage.removeItem("user_"+VM.user.userId);
		VM.$router.replace({name:'login',query:{multi:true}});
	}else{
		window.localStorage.removeItem("user");
		VM.$router.replace({name:'login'});
	}
}

function onConnect(status) {
  // console.log(status)
  // console.log(Strophe.Status)
	switch(status){
		case Strophe.Status.CONNECTING:
			console.log('正在连接')
			break;
		case Strophe.Status.CONNFAIL:
      console.log('连接失败')
			break;
    case Strophe.Status.DISCONNECTING:
      console.log('正在断开连接')
			break;
		case Strophe.Status.DISCONNECTED:
      console.log('已断开连接')
			connected = false;
			if(!VM.isLogOut){
				if(reLogin){
					loginIm({
						userId: VM.user.userId,
						imPassword:VM.user.imPassword
					})
				}else{
					VM.isLogOut = true;
					logOutIm('被迫下线');
				}
      }
			break;
		case Strophe.Status.CONNECTED:
			console.log('已连接')
			connected = true;
			connection.addHandler(onMessage, null, 'message', null, null, null);
			connection.send($pres().tree());
			break;
		default:
			break;
	}
}


/**
 * 接收消息回调
 * @param msg
 * @returns {boolean}
 */
async function onMessage(msg) {
	// console.log(msg)
	let elems = msg.getElementsByTagName('body');
	let delay = msg.getElementsByTagName('delay');
	let type = msg.getAttribute('type');
	if(elems.length){
    	console.log('来新消息了！');
		let body = Strophe.getText(elems[0]);
		// console.log('---------------------');

		//发送消息回执
		receipt(msg.getAttribute('id'))
   		console.log(JSON.parse(base64.decode(body)))
		let msgBody;
		let time;
		if (type=='chat'||type=='groupchat'&elems.length > 0) {
			if (delay.length > 0) {
				time= delay[0].getAttribute('stamp')
			}
			try{
				msgBody = JSON.parse(base64.decode(body));
				msgBody['time'] = dayjs(time).valueOf();
				// msgBody['chatType'] = type;
			}catch(err){
				console.log(err);
				return false;
			}
    	}
    	console.log(msgBody)

		switch(parseInt(msgBody.type)){
			case 1000:
				let body = JSON.parse(msgBody.data.body)
				if(body.action&&body.action==1003){
					// console.log('被删除好友')
					delete VM.friendsJson[msgBody.data.from]
					VM.getFriends(VM.user.userId)
				}else{
					if(body.data&&body.data.ADD_REASON){
						let data = JSON.parse(msgBody.data.body).data;
						// console.log('添加好友');
						let friendData = {
							userId:data.userId,
							nick:data.nick,
							reason:data.ADD_REASON
						}
						VM.showNewFriendBox = true;
						VM.friendData = friendData;
						VM.newFriend.unshift(friendData);
						saveLocal('NEW_FRIEND_'+VM.user.userId,VM.newFriend)
					}else{
						// console.log('有消息撤回了！')
						changLocalMessage(msgBody);
					}
				}
				break;
			case 2000:
				if(msgBody.data.ext.action&&msgBody.data.ext.action==2000){
					// console.log('群创建成功')
					//获取群列表
					VM.getGroupList();
				}
				saveMsg(msgBody)
				break;
			case 4000:
				console.log('群组被解散！')
				deleteGroup(msgBody)
				break;
			default:
				break;
		}

		// saveMsg(msg);
	}
	return true;
}

function changLocalMessage(msg){
  let msgData = msg.data;
  let mgsBody = JSON.parse(msg.data.body);
  let withdrawnMsg;
  let content;
  let nick;

  if(msg.data.chatType=='2'){

    for(let i=0; i<VM.groupMembers.length; i++){
      let item = VM.groupMembers[i];
      if(item.userId==msg.data.from){
        nick = item.nick;
        break;
      }
    }

    if(mgsBody.isOwner==1){
      if(msg.data.from==VM.groupMembers[0].userId){
        content = '群主撤回了一条消息'
      }else{
        content = '群主撤回了'+nick+'的一条消息'
      }
    }else{
      content = nick+'撤回了一条消息'
    }
    let thisMessages = VM.messageJson[msg.data.to];
    for(let i=0; i<thisMessages.length; i++){
      if(msg.data.from==thisMessages[i].data.from){
        withdrawnMsg = thisMessages[i];
        break;
      }
    }

  }else{
    // console.log(VM.messageJson[msg.data.from]);
    let thisMessages = VM.messageJson[msg.data.from];
    for(let i=0; i<thisMessages.length; i++){
      if(msg.data.from==thisMessages[i].data.from){
        withdrawnMsg = thisMessages[i];
        content = ''+withdrawnMsg.data.ext.nick+' 撤回了一条消息'
        break;
      }
    }
  };
  withdrawnMsg.data.body['content'] = content;
  withdrawnMsg.data.ext['action'] = 6001;
  saveMsg(withdrawnMsg)
}

function saveMsg(msg){
  // console.log(msg)
	let user = VM.user
	let other_jid;
	if(msg.data.from==user.userId){
		other_jid = msg.data.to
	}else{
		if(msg.data.chatType=='1'){
			other_jid = msg.data.from
		}
		if(msg.data.chatType=='2'){
			other_jid = msg.data.to
		}
	}

	if(!VM.messageJson[other_jid]){
		VM.messageJson[other_jid]=[]
		VM.messageJson[other_jid].unshift(msg)
	}else{
    let msgList = VM.messageJson[other_jid];
		let status = false;
		for(let i=0; i<msgList.length; i++){
			let msgId = msgList[i].data.msgId;
			let newMsgId = msg.data.msgId;
			if(msgId==newMsgId){
        status=true;
        msgList[i] = msg
				break;
			}
		}
		if(!status){
			VM.messageJson[other_jid].unshift(msg);
		}
	}

	saveLocal('MESSAGE_JSON_'+user.userId,VM.messageJson)
	let talkList=[];

	for(let key in VM.messageJson){
		VM.talkListJson[key] = [
			VM.messageJson[key][0]
    ]
	}

	for(let key in VM.talkListJson){
		talkList.push(VM.talkListJson[key][0])
	}
	VM.talkList = talkList;
	// console.log(VM.talkList)
	VM.talkList.sort((a,b)=>{
		// console.log(a);
		if(a){
			let timeA = a.time
			let timeB = b.time
			return timeB-timeA
		}else{
			return 0
		}
	})
	saveLocal('TALK_LIST_'+ user.userId,VM.talkList)
	saveLocal('TALK_LIST_JSON_'+ user.userId,VM.talkListJson)

	setTimeout(function(){
		VM.$refs.officeText.scrollTop = VM.$refs.officeText.scrollHeight;
	},0)
}



//消息回执方法
function receipt(id){
	let msg = $msg({
		to:'app.im',
		id:guid(),
		type:'chat',
	}).c('received',{xmlns:'urn:xmpp:receipts',id:id})
	connection.send(msg.tree());
}

function sendMsg(msgObj,msgType,sendContent){
	let msgId = guid();
	let time = new Date();
	let body;
	if(msgType==2001){
    let html = sendContent.innerHTML;
    let imgReg = /<img.*?(?:>|\/>)/i;
    let div = document.createElement('div');
    div.innerHTML = sendContent.innerHTML;
    let emojis = sendContent.querySelectorAll('img');
    for(let i=0; i<emojis.length; i++){
      let alt = emojis[i].alt;
      div.innerHTML = div.innerHTML.replace(imgReg,alt);
    }

		body = {
			content:div.innerText
		}
	}else if(msgType==2002){
		// console.log(sendContent)
		body = {
			fileName:sendContent.fileName,
			remotePath:sendContent.remotePath,
			size: ''
		}
	}
	let data = {
		data:{
			ext:{
				nick:VM.user.nick,
				avatar:VM.user.avatar,
				userId:VM.user.userId,
			},
			msgType:msgType,
			msgId:msgId,
			from:msgObj.from,
			to:msgObj.to,
			body:body,
			chatType:VM.activeMessageViewType=='chat'?1:2
    },
    time: dayjs(time).valueOf(),
		type:2000
	};
	let bodyContent =  base64.encode(JSON.stringify(data))
	// console.log(data)
	//构建消息体
	let msg;
	if(VM.activeMessageViewType=='chat'){
		msg = $msg({
			to:exChangeJid(msgObj.to),
			from:exChangeJid(msgObj.from),
			type:'chat',
			id:msgId
		})
		.c("body",null,bodyContent)
		.c('request',{xmlns:'urn:xmpp:receipts'},'')
		.c('stamp',null,time)
		.c('delay',{
			urn:'urn:xmpp:delay',
			stamp:time,
			from:'app.im',
		},'')
	}else if(VM.activeMessageViewType=='groupchat'){
		msg = $msg({
			to:msgObj.to+'@muc.app.im',
			from:exChangeJid(msgObj.from),
			type:'groupchat',
			id:msgId
		})
		.c("body",null,bodyContent)
		.c('delay',{
			urn:'urn:xmpp:delay',
			stamp:time,
			from:'app.im',
		},'')
	}

	if(connected){
		// console.log(data)
    saveMsg(data)

		//上传消息记录
		let param = {
			fromId:msgObj.from,
			toId:msgObj.to,
			chattype:VM.activeMessageViewType=='chat'?'1':'2',
			message:bodyContent,
			mid:VM.activeMessageViewType=='chat'?'':msgId,
		}
		uploadMessage(param);
		// console.log(msg.tree());
		// let elems = msg.tree().getElementsByTagName('body');
		// let body = Strophe.getText(elems[0]);
		// let cont = JSON.parse(base64.decode(body));
		// console.log(cont)
		connection.send(msg.tree());
		if(VM.tabActive!=1){
			VM.tabActive=1
			VM.activeMessageList = VM.messageJson[VM.activeMessageView];
		}
		if(msgType==2001){
			sendContent.innerText = ''
		}
	}else{
		alert('与聊天服务器断开连接……')
	}
}

let uploadMessage = async (param) =>{
	try{
		let res = await API.webUploadMessage(param);
		// console.log(res)
	}
	catch(error){
		console.log(error)
	}
}

//撤回消息

let withdrawMsg = async (msgItem) => {
  // console.log(msgItem)
  let message;
  let param;
  let msgId = guid();
  let time = new Date();

  let body = {
    isOwner:msgItem.data.chatType=='2'&&VM.groupMembers[0].userId==VM.user.userId?'1':'0',
    action:6000,
    msgId:msgItem.data.msgId
  }

	let data_1 = {
		data:{
			msgId:msgId,
			from:msgItem.data.from,
			to:msgItem.data.to,
			body:JSON.stringify(body),
			chatType:msgItem.data.chatType
		},
		type:1000
  };
  let nick;
  let msgUid = msgItem.data.from;
  let content;

  // console.log('connection发送的消息体内的base64原数据：', data_1)

  let bodyContent = base64.encode(JSON.stringify(data_1))

  if(VM.activeMessageViewType=='chat'){
		message = $msg({
			to:exChangeJid(msgItem.data.to),
			from:exChangeJid(msgItem.data.from),
			type:'chat',
			id:msgId
		})
		.c("body",null,bodyContent)
		.c('delay',{
			urn:'urn:xmpp:delay',
			stamp:time,
		},'')
	}else if(VM.activeMessageViewType=='groupchat'){
		message = $msg({
			to:msgItem.data.to+'@muc.app.im',
			from:exChangeJid(msgItem.data.from),
			type:'groupchat',
			id:msgId
		})
		.c("body",null,bodyContent)
		.c('delay',{
			urn:'urn:xmpp:delay',
			stamp:time,
		},'')
	}

  if(msgItem.data.chatType=='2'){
    for(let i=0; i<VM.groupMembers.length; i++){
      let item = VM.groupMembers[i];
      if(item.userId==msgUid){
        nick = item.nick;
        break;
      }
    }
    if(msgUid==VM.user.userId){
      content = (body.isOwner==1?'群主':VM.user.nick)+'撤回了一条消息'
    }else{
      content = (body.isOwner==1?'群主':'')+'撤回了'+nick+'的一条消息'
    }
  }else{
    content = VM.user.nick+'撤回了一条消息'
  }
  // console.log(content)

  msgItem.data.body['content'] = content;
  msgItem.data.ext['action'] = 6001;
  // console.log('调用api接口传的数据base64原数据：',msgItem)
  let msgItemCopy = JSON.parse(JSON.stringify(msgItem));
  delete msgItemCopy['time']
  // console.log('msgItemCopy:',msgItemCopy)
  param = {
    mid:msgItem.data.msgId,
    message:base64.encode(JSON.stringify(msgItemCopy))
  }

  if(msgItem.data.from==VM.user.userId){
    msgItem.data.body['content'] = '你撤回了一条消息';
  }else{
    msgItem.data.body['content'] = '你撤回了'+msgItem.data.ext.nick+'一条消息';
  }

  let res = await API.withdrawMessage(param);
  // console.log(message.tree())
  connection.send(message.tree());
  // console.log(res)
  if(res.res=="succ"){
    saveMsg(msgItem)
  }
}

function forwardMsg(uid,msgData,chatType){
  // console.log(uid,msgData);
  let msgId = guid();
	let time = new Date();
	let body;
  let data = {
		data:{
			ext:{
				nick:VM.user.nick,
				avatar:VM.user.avatar,
				userId:VM.user.userId,
			},
			msgType:msgData.data.msgType,
			msgId:msgId,
			from:VM.user.userId,
			to:uid,
			body:msgData.data.body,
			chatType:chatType=='chat'?'1':'2'
    },
    time: dayjs(time).valueOf(),
		type:2000
	};
  let bodyContent =  base64.encode(JSON.stringify(data));
  let msg;
	if(chatType=='chat'){
		msg = $msg({
			to:exChangeJid(uid),
			from:exChangeJid(VM.user.userId),
			type:'chat',
			id:msgId
		})
		.c("body",null,bodyContent)
		.c('request',{xmlns:'urn:xmpp:receipts'},'')
		.c('stamp',null,time)
		.c('delay',{
			urn:'urn:xmpp:delay',
			stamp:time,
			from:'app.im',
		},'')
	}else if(chatType=='groupchat'){
		msg = $msg({
			to:uid+'@muc.app.im',
			from:exChangeJid(VM.user.userId),
			type:'groupchat',
			id:msgId
		})
		.c("body",null,bodyContent)
		.c('delay',{
			urn:'urn:xmpp:delay',
			stamp:time,
			from:'app.im',
		},'')
	}

	if(connected){
		// console.log(data)
    saveMsg(data)

		//上传消息记录
		let param = {
			fromId:VM.user.userId,
			toId:uid,
			chattype:chatType=='chat'?'1':'2',
			message:bodyContent,
			mid:chatType=='chat'?'':msgId,
		}
		uploadMessage(param);
		connection.send(msg.tree());
	}else{
		alert('与聊天服务器断开连接……')
	}
}

function deleteGroup(msg){
	// console.log(msg)
	let gid = msg.data.gid;
	let groupNick = JSON.parse(JSON.stringify(VM.groupJson[gid])).name
	for(let i=0; i<VM.groupList.length; i++){
		if(VM.groupList[i].gid==gid){
			VM.groupList.splice(i,1);
		}
	}
	delete VM.groupJson[gid];
	delete VM.messageJson[gid]
	delete VM.talkListJson[gid]
	if(VM.activeMessageView==gid){
		VM.activeMessageView=""
		VM.activeMessageViewType = ""
		VM.activeMessageList = [];
		VM.activeObject = {};
	}
	if(VM.talkList.length){
		for(let i=0; i<VM.talkList.length; i++){
			if(VM.talkList[i].data.to==gid){
				VM.talkList.splice(i,1)
				break;
			}
		}
	}
	VM.groupMembers = [];
	saveLocal('MESSAGE_JSON_'+VM.user.userId,VM.messageJson)
	saveLocal('TALK_LIST_JSON_'+VM.user.userId,VM.talkListJson)
	saveLocal('TALK_LIST_'+VM.user.userId,VM.talkList)
	VM.getGroupList(VM.user.userId);
	alert(groupNick+' 已解散！')
}

//创建唯一表示 uuid
function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export {
	Strophe,
	setVM,
	loginIm,
	connection,
	onMessage,
	sendMsg,
	saveMsg,
  logOutIm,
  withdrawMsg,
  forwardMsg
}
