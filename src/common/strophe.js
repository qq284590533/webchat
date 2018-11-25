import 'strophe.js'
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
			loginIm({
				userId: VM.user.userId,
				imPassword:VM.user.imPassword
			})
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
	let user = VM.user
	let from = msg.getAttribute('from');
	let type = msg.getAttribute('type');
	let elems = msg.getElementsByTagName('body');
	let delay = msg.getElementsByTagName('delay');
	let time;
	if (type == 'chat' && elems.length > 0) {
		if (delay.length > 0) {
			time =	delay[0].getAttribute('stamp')
		}
		let body = Strophe.getText(elems[0]);
		let sender_uid = from.substring(0, from.indexOf('@'));
		let msg = JSON.parse(base64.decode(body));
		let msgInfo = {
			sender_uid:sender_uid,
			sender_nick: VM.friendsJson[sender_uid].nick,
			sender_avatar: VM.friendsJson[sender_uid].avatar,
			msg:msg,
			content:msg.data.body.content,
			time: time,
			type: type,
		};
		let other_jid = from.substring(0, from.indexOf('@'));
		if(!VM.messageJson[other_jid]){
			VM.messageJson[other_jid]=[]
			VM.messageJson[other_jid].unshift(msgInfo)
		}else{
			let item = VM.messageJson[other_jid];
			let status = false;
			for(let i=0; i<item.length; i++){
				let msgId = item[i].msg.data.msgId;
				let msgInfoMsgId = JSON.parse(base64.decode(body)).data.msgId;
				if(msgId==msgInfoMsgId){
					status=true;
					break;
				}
			}
			if(!status){
				VM.messageJson[other_jid].push(msgInfo);
			}
			VM.messageJson[other_jid].sort((a,b)=>{
				let timeA = new Date(a.time).getTime()
				let timeB = new Date(b.time).getTime()
				return timeB-timeA
			})
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
			let timeA = new Date(a.time).getTime()
			let timeB = new Date(b.time).getTime()
			return timeB-timeA
		})
		saveLocal('TALK_LIST_'+ user.userId,VM.talkList)
		saveLocal('TALK_LIST_JSON_'+ user.userId,VM.talkList)
	}
	console.log('---------------------');
	return true;
}

function sendMsg(msgObj,inputBox){
	msgObj.to = exChangeJid(msgObj.to)
	msgObj.from = exChangeJid(msgObj.from)
	console.log(msgObj)
	let msg = $msg(msgObj).c("body",null,inputBox.value);
	if(connected){
		connection.send(msg.tree());
	}
	inputBox.value = ''
}


export {
	Strophe,
	setVM,
	loginIm,
	connection,
	onMessage,
	sendMsg
}
