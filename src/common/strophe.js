import 'strophe.js'
import dayjs from 'dayjs'
import Base64 from './base64'
import { readLocal, saveLocal } from './utils'

let Strophe = window.Strophe;
let BOSH_SERVICE = 'http://106.14.241.187:5280/xmpp-httpbind';
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
	window.localStorage.removeItem("user");
	VM.$router.replace({name:'login'});
}

function onConnect(status) {
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
	// console.log(msg)
	let elems = msg.getElementsByTagName('body');
	if(elems.length){
		console.log('来新消息了！');
		let body = Strophe.getText(elems[0]);
		let cont = JSON.parse(base64.decode(body));
		// console.log(cont)
		// console.log('---------------------');
		//消息回执
		receipt(msg.getAttribute('id'))
		saveMsg(msg);
	}
	return true;
}

function saveMsg(msg){
	let user = VM.user
	let type = msg.getAttribute('type');
	let elems = msg.getElementsByTagName('body');
	let delay = msg.getElementsByTagName('delay');
	let time;
	if (type=='chat'||type=='groupchat'&elems.length > 0) {
		if (delay.length > 0) {
			time= delay[0].getAttribute('stamp')
			// console.log(time)
			// console.log(dayjs(time))
			// console.log(new Date())
			// console.log(dayjs(time).valueOf())
			// console.log(new Date(time).getTime())
		}
		let body = Strophe.getText(elems[0]);
		let msg = JSON.parse(base64.decode(body));
		let msgInfo = {
			sender_uid: msg.data.from,
			sender_nick: msg.data.ext.nick,
			sender_avatar: msg.data.ext.avatar,
			msgData: msg,
			content: msg.data.body.content||msg.data.body.remotePath,
			time: dayjs(time).valueOf(),
			type: type,
			msgType: msg.data.msgType     //2001文字消息，2002图片消息
		};
		let other_jid;
		if(msg.data.from==user.userId){
			other_jid = msg.data.to
		}else{
			if(type=='chat'){
				other_jid = msg.data.from	
			}
			if(type=='groupchat'){
				other_jid = msg.data.to
			}
		}
		if(!VM.messageJson[other_jid]){
			VM.messageJson[other_jid]={
				type:type,
				msgs:[]
			}
			VM.messageJson[other_jid].msgs.unshift(msgInfo)
		}else{
			let thisMsg = VM.messageJson[other_jid].msgs;
			let status = false;
			for(let i=0; i<thisMsg.length; i++){
				let msgId = thisMsg[i].msgData.data.msgId;
				let newMsgId = msg.data.msgId;
				if(msgId==newMsgId){
					status=true;
					break;
				}
			}
			if(!status){
				VM.messageJson[other_jid].msgs.unshift(msgInfo);
			}
		}
		saveLocal('MESSAGE_JSON_'+user.userId,VM.messageJson)
		let talkList=[];
		for(let key in VM.messageJson){
			VM.talkListJson[key] = {
				type: VM.messageJson[key].type,
				msg:VM.messageJson[key].msgs[0]
			}
			// VM.talkListJson[key] = VM.messageJson[key][0];
		}
		for(let key in VM.talkListJson){
			talkList.push(VM.talkListJson[key])
		}
		VM.talkList = talkList;
		VM.talkList.sort((a,b)=>{
			let timeA = a.msg.time
			let timeB = b.msg.time
			return timeB-timeA
		})
		saveLocal('TALK_LIST_'+ user.userId,VM.talkList)
		saveLocal('TALK_LIST_JSON_'+ user.userId,VM.talkList)
		setTimeout(function(){
			VM.$refs.officeText.scrollTop = VM.$refs.officeText.scrollHeight;
		},0)
	}
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
		saveMsg(msg.tree())
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
	logOutIm
}
