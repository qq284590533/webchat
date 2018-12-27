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
				loginIm({
					userId: VM.user.userId,
					imPassword:VM.user.imPassword
				})
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
 * 接收信息回调
 * @param msg
 * @returns {boolean}
 */
function onMessage(msg) {
	console.log(msg)
	let elems = msg.getElementsByTagName('body');
	let delay = msg.getElementsByTagName('delay');
	let type = msg.getAttribute('type');
	if(elems.length){
    	console.log('来新消息了！');
		let body = Strophe.getText(elems[0]);
		// console.log('---------------------');

		//发送消息回执
		receipt(msg.getAttribute('id'))

		let msgBody;
		let time;
		if (type=='chat'||type=='groupchat'&elems.length > 0) {
			if (delay.length > 0) {
				time= delay[0].getAttribute('stamp')
			}
			let body = Strophe.getText(elems[0]);
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
				console.log('有消息撤回了！')
				break;
			case 2000:
				saveMsg(msgBody)
				break;
			case 4000:
				console.log('群组被解散！')
				break;
			default:
				break;
		}

		// saveMsg(msg);
	}
	return true;
}

function saveMsg(msg){
  console.log(msg)
  // if(msg.type!=2000) return
	let user = VM.user
	// console.log(msgInfo)

  // if(msg.type==2000){
  //   msgInfo = {
  //     sender_uid: msg.data.from,
  //     sender_nick: msg.data.ext.nick,
  //     sender_avatar: msg.data.ext.avatar,
  //     msgData: msg,
  //     content: msg.data.body.content||msg.data.body.remotePath,
  //     time: msg.time,
  //     type: msg.chatType,
  //     msgType: msg.data.msgType,     //2001文字消息，2002图片消息
  //     msgId: msg.data.msgId
  //   };
  // }

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
    console.log('msgList:',msgList)
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
			let timeA = a.msg.time
			let timeB = b.msg.time
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
	let fileId;
	let msgId = guid();
	let time = new Date();
	let body;
	if(msgType==2001){
		body = {
			content:sendContent.value
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
		console.log(data)
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
			VM.activeMessageList = VM.messageJson[VM.activeMessageView].msgs;
		}
		if(msgType==2001){
			sendContent.value = ''
		}
	}else{
		alert('与聊天服务器断开连接……')
	}
}

let uploadMessage = async (param) =>{
	try{
		let res = await API.webUploadMessage(param);
		console.log(res)
	}
	catch(error){
		console.log(error)
	}
}

//撤回消息

let withdrawMsg = async (msgItem) => {
  let message;
  let param;
  let msgId = guid();
  let time = new Date();

  let body = {
    isOwner:msgItem.type=='groupchat'&&VM.groupMembers[0].userId==VM.user.userId?'1':'0',
    action:6000,
    msgid:msgItem.msgId
  }

	let data_1 = {
		data:{
			msgId:msgId,
			from:msgItem.msgData.data.from,
			to:msgItem.msgData.data.to,
			body:JSON.stringify(body),
			chatType:msgItem.type=='chat'?1:2
		},
		type:1000
  };
  let nick;
  let msgUid = msgItem.msgData.data.from;
  let content;
  if(msgItem.type=='groupchat'){
    for(let i=0; i<VM.groupMembers.length; i++){
      let item = VM.groupMembers[i];
      if(item.userId==msgUid){
        nick = item.nick;
        break;
      }
    }
    if(msgUid==VM.user.userId){
      content = (body.isOwner==1?'群主':VM.user.nick)+' 撤回了一条信息'
    }else{
      content = (body.isOwner==1?'群主':'')+' 撤回了 '+nick+' 的一条信息'
    }
  }else{
    content = VM.user.nick+' 撤回了一条信息'
  }
  console.log(content)
  console.log('connection发送的消息体内的base64原数据：', data_1)

  let bodyContent = base64.encode(JSON.stringify(data_1))

  if(msgItem.type=='chat'){
		message = $msg({
			to:exChangeJid(msgItem.msgData.data.to),
			from:exChangeJid(msgItem.msgData.data.from),
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
			to:msgItem.msgData.data.to+'@muc.app.im',
			from:exChangeJid(msgItem.msgData.data.from),
			type:'groupchat',
			id:msgId
		})
		.c("body",null,bodyContent)
		.c('delay',{
			urn:'urn:xmpp:delay',
			stamp:time,
		},'')
	}

  msgItem.msgData.data.ext['action'] = 6001;
  let msgData = {
    data:{
      ext:{
        nick:msgItem.msgData.data.ext.nick,
        avatar:msgItem.msgData.data.ext.avatar,
        userId:msgItem.msgData.data.ext.userId,
        action:6001
      },
      msgType:msgItem.msgData.data.msgType,
      msgId:msgItem.msgData.data.msgId,
      from:msgItem.msgData.data.from,
      to:msgItem.msgData.data.to,
      body:{
        content:content
      },
      chatType:msgItem.msgData.data.chatType
    },
    type:msgItem.msgData.type
  }
  console.log('调用api接口传的数据base64原数据：',msgData)

  param = {
    mid:msgItem.msgId,
    message:base64.encode(JSON.stringify(msgData))
  }

  let res = await API.withdrawMessage(param);

  console.log(message.tree())
  connection.send(message.tree());
  console.log(res)
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
  withdrawMsg
}
