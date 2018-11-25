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


function onConnect(status) {
	switch(status){
		case Strophe.Status.CONNECTING:
			console.log('正在连接')
			break;
		case Strophe.Status.CONNFAIL:
			console.log(status)
			console.log('连接失败')
			break;
			case Strophe.Status.DISCONNECTING:
			console.log('正在断开连接')
			break;
		case Strophe.Status.DISCONNECTED:
			console.log(status)
			console.log('已断开连接')
			connected = false;
			// loginIm({
			// 	userId: VM.user.userId,
			// 	imPassword:VM.user.imPassword
			// })
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
	console.log('来新消息了！');
	console.log(msg)
	let elems = msg.getElementsByTagName('body');
	let body = Strophe.getText(elems[0]);
	let cont = JSON.parse(base64.decode(body));
	console.log(cont)
	console.log('---------------------');
	//消息回执
	// receipt(msg.getAttribute('id'))
	saveMsg(msg);
	return true;
}

function saveMsg(msg){
	let user = VM.user
	let type = msg.getAttribute('type');
	let elems = msg.getElementsByTagName('body');
	let delay = msg.getElementsByTagName('delay');
	let time;
	if (type == 'chat' && elems.length > 0) {
		if (delay.length > 0) {
			time= delay[0].getAttribute('stamp')
		}
		let body = Strophe.getText(elems[0]);
		let msg = JSON.parse(base64.decode(body));
		let msgInfo = {
			sender_uid:msg.data.from,
			sender_nick: msg.data.ext.nick,
			sender_avatar: msg.data.ext.avatar,
			msg:msg,
			content:msg.data.body.content,
			time: new Date(time).getTime(),
			type: type,
		};
		let other_jid;
		if(msg.data.from==user.userId){
			other_jid = msg.data.to
		}else{
			other_jid = msg.data.from	
		}
		if(!VM.messageJson[other_jid]){
			VM.messageJson[other_jid]=[]
			VM.messageJson[other_jid].unshift(msgInfo)
		}else{
			let thisMsg = VM.messageJson[other_jid];
			let status = false;
			for(let i=0; i<thisMsg.length; i++){
				let msgId = thisMsg[i].msg.data.msgId;
				let newMsgId = msg.data.msgId;
				if(msgId==newMsgId){
					status=true;
					break;
				}
			}
			if(!status){
				VM.messageJson[other_jid].unshift(msgInfo);
			}
		}
		saveLocal('MESSAGE_JSON_'+user.userId,VM.messageJson)
		let talkList=[];
		for(let key in VM.messageJson){
			VM.talkListJson[key] = VM.messageJson[key][0];
		}
		for(let key in VM.talkListJson){
			talkList.push(VM.talkListJson[key])
		}
		VM.talkList = talkList;
		VM.talkList.sort((a,b)=>{
			let timeA = a.time
			let timeB = b.time
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



function sendMsg(msgObj,inputBox){
	let msgId = guid();
	let time = new Date();
	let data = {
		data:{
			ext:{
				nick:VM.user.nick,
				avatar:VM.user.avatar,
				userId:VM.user.userId,
			},
			msgType:2001,
			msgId:msgId,
			from:msgObj.from,
			to:msgObj.to,
			body:{
				content:inputBox.value
			},
			chatType:1
		},
		type:2000
	};
	let bodyContent =  base64.encode(JSON.stringify(data))

	//构建消息体
	let msg = $msg({
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
	if(connected){
		// console.log(base64.decode(Strophe.getText(msg.tree().getElementsByTagName('body')[0])))
		// console.log(msg.tree());
		connection.send(msg.tree());
		if(VM.tabActive!=1){
			VM.tabActive=1
		}
		inputBox.value = ''
		saveMsg(msg.tree())
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
	sendMsg
}
