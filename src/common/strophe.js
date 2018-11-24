import 'strophe.js'
import Base64 from './base64'
import { readLocal, saveLocal } from './utils'

let Strophe = window.Strophe;
let BOSH_SERVICE = 'http://106.14.241.187:5280/xmpp-httpbind';
let jid;
let db;
let base64 = new Base64()
let VM;
creatDb();
let connection;
function createConnection(){
	connection = new Strophe.Connection(BOSH_SERVICE);
	connection.rawInput = rawInput;
	connection.rawOutput = rawOutput;
}

function setVM(vm){
	VM = vm;
}

function log(msg) {
	// console.log(msg);
}

function rawInput(data) {
	// log('RECV: ' + data);
}

function rawOutput(data) {
	// log('SENT: ' + data);
}

function exChangeJid(uid) {
	return uid + '@app.im/app';
};

function loginIm(param, callback) {
	let userId = param.userId;
	jid = exChangeJid(userId);
	let imPassword = param.imPassword
	connection.connect(
		jid,
		imPassword,
		callback
	);
}





// function saveMessage(msgInfo) {

// }

// /**
//  * 保存消息
//  * @param uid   发送者jid
//  * @param receiver_id   接收者jid
//  * @param msg   文本内容
//  * @param callback  null|function
//  */
// function addChat({
// 	jid: uid,
// 	sender_uid: sender_uid,
// 	tojid: receiver_uid,
// 	msg: msg,
// 	time: time,
// 	type: type
// 	}, callback = null) {
// 	let sql = "INSERT INTO chat (uid, type, sender_uid, receiver_uid, content,time) VALUES (?, ?, ?, ?, ?, ?)";
// 	db.transaction(function (tx) {
// 		tx.executeSql(sql, [uid, type, sender_uid, receiver_uid, msg, time], function (db, db_res) {
// 		callback({
// 			status: 1,
// 			data: db_res
// 		});
// 		}, function (db, err) {
// 		callback({
// 			status: 0,
// 			err: err
// 		});
// 		console.log('db:addChat()=>error');
// 		console.log(err);
// 		});
// 	});
// }

/**
 * 更新会话记录列表
 * @param jid
 * @param other_id
 */
function updateTalkList(jid, other_id) {
	let sql = "SELECT * FROM talk_list WHERE uid = ? AND other_id = ? LIMIT 0,1";
	let time = getFormatDate();
	db.transaction(function (tx) {
		tx.executeSql(sql, [jid, other_id], function (db, db_res) {
		// console.log(db_res);
		if (db_res.rows.length != 0) {
			//更新会话记录
			tx.executeSql("UPDATE talk_list SET time = ? WHERE id = ?",
			[time, db_res.rows[0].id],
			function (db, db_res) {
				// console.log(db);
				// console.log(db_res);
			});
		} else {
			//新建会话记录
			tx.executeSql("INSERT INTO talk_list (uid, other_id, time) VALUES (?, ?, ?)",
			[jid, other_id, time],
			function (db, db_res) {

			});
		}
		}, function (db, err) {
		// console.log('db:getChat()=>error');
		// console.log(err);
		});
	});
}

/**
 * 创建聊天窗体
 * @param dom
 */
window.addChatView = function (dom) {
	let div = $(dom)[0];
	let userId = $(div).data('userid');
	let other_user = {},
		data = {};
	// 会话列表容器
	let container = $("#talk_list");
	//遍历好友
	if (friends.length > 0) {
		friends.map(function (item, index) {
		if (item.userId == userId) {
			other_user = item;
		}
		});
	}
	// 判断会话框是否存在
	let exists = false;
	$("#talk_list").find('li').attr('class', '');
	container.find('li').each(function (i, item) {
		// $(item).Class('');
		if ($(item).data('other_id') == other_user.userId) {
		let li = $(item).addClass('user_active');
		$("#talk_list").prepend($(item).clone(true));
		$(item).remove();
		$("#fridesTop").text(other_user.nick);
		exists = true;
		}
	});
	//不存在则添加会话框
	if (!exists) {
		data.active = 'user_active';
		data.nick = other_user.nick;
		data.avatar = other_user.avatar;
		data.other_id = other_user.userId;
		data.chat_type = 'chat';
		data.msg = '';
		data.time = '';
		console.log(data);
		let view = template('talkListView', data);
		$("#talk_list").prepend(view);
		$("#fridesTop").text(other_user.nick);
	}

};

/**
 * 接收信息回调
 * @param msg
 * @returns {boolean}
 */
let cont = 0;
function onMessage(msg) {
	cont++
	let user = VM.user
	// console.log(user)
	// console.log(msg)
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
				VM.messageJson[other_jid].unshift(msgInfo);
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
		// addChat(msgInfo, function (res) {
		// updateTalkList(exChangeJid(VM.user.userId), from);
		// if (res.status) {
		// 	let other_jid = from.substring(0, from.indexOf('@'));
		// 	// let set_top = $("#talk_list").find("li[data-other_id='"+other_jid+"']");
		// 	let friends = readLocal(user.userId).friends
		// 	if (friends.length > 0) {
		// 	friends.map(function (item, index) {
		// 		if (item.userId == other_jid) {
		// 			// $("#fridesTop").text(item.nick);

		// 			// if(set_top.length == 0){
		// 			let talkData = {
		// 				active: 'user_active',
		// 				jid: exChangeJid(item.userId),
		// 				other_id: item.userId,
		// 				chat_type: 'chat',
		// 				nick: item.nick,
		// 				avatar: item.avatar,
		// 				msg: '',
		// 				time: '',
		// 			};
		// 			// console.log(talkData)
		// 			// let talkView = template('talkListView',talkData);
		// 			// $("#talk_list").prepend(talkView);
		// 			// }
		// 			let chatData = {
		// 				identity: 'other',
		// 				avatar: item.avatar,
		// 				nick: item.nick,
		// 				msg: base64.decode(body)
		// 			};
		// 			// console.log(chatData)
		// 			// let chatView  = template('chatView',chatData);
		// 			// $("#chatbox").append(chatView);
		// 		}
		// 	})
		// 	}

		// }
		// });
	}
	console.log('---------------------');
	return true;
}


/**
 * 构建会话列表
 * @param jid
 */
function buildTalkList(jid) {
	let sql = "SELECT * FROM  talk_list WHERE uid = ? ORDER BY time DESC";
	let view;
	db.transaction(function (tx) {
		tx.executeSql(sql, [jid], function (db, db_res) {
		let list = db_res.rows;
		//遍历消息
		$.each(db_res.rows, function (index, item) {
			let active = index == 0 ? 'user_active' : '';
			let data = {
			active: active
			};
			//遍历好友
			let other = {};
			for (let friend_i = 0; friends.length > friend_i; friend_i++) {
			if (friend_i == 0) {
				$("#fridesTop").text(friends[0].nick);
				getChat(exChangeJid(friends[friend_i].userId), function (res) {
				buildUniqueUserView(friends[friend_i], res.data);
				});
			}
			if (item.other_id == exChangeJid(friends[friend_i].userId)) {
				//获取首个好友消息历史记录
				data.jid = exChangeJid(friends[friend_i].userId);
				data.avatar = friends[friend_i].avatar;
				data.other_id = friends[friend_i].userId;
				data.nick = friends[friend_i].nick;
				// data.time = friends[friend_i].time;
				data.chat_type = 'chat';
				view = template('talkListView', data);
				$("#talk_list").html('');
				$("#talk_list").append(view);
				break;
			}
			}
		});
		}, function (db, err) {
		console.log('db:getChat()=>error');
		console.log(err);
		});
	});

}

/**
 * 创建webdb && 创建表
 */
function creatDb() {
	db = openDatabase('webchat', '1.0', 'chat_log', 2 * 1024 * 1024);
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS chat (id integer primary key, uid, type, sender_uid, receiver_uid, content, time datetime)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS talk_list (id integer primary key, uid, other_id, time datetime)');
	});
}

function getFormatDate() {
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
	var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
	var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
	var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
	var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}


export {
	Strophe,
	createConnection,
	setVM,
	loginIm,
	connection,
	onMessage
}



// require(["strophe","template"], function (wrapper,template) {
//     Strophe = wrapper.Strophe;
//     var BOSH_SERVICE = 'http://106.14.241.187:5280/xmpp-httpbind';
//     var connection = null;
//     // var load = false;

//     function log(msg) {
//         console.log(msg);
//         // $('#log').append('<div></div>').append(document.createTextNode(msg));
//     }

//     function rawInput(data) {
//         // log('RECV: ' + data);
//     }

//     function rawOutput(data) {
//         // log('SENT: ' + data);
//     }

//     /**
//      * 连接状态
//      * @param status
//      */
//     function onConnect(status) {
//         console.log(status);
//         if (status == Strophe.Status.CONNECTING) {
//             log('Strophe是连接');
//         } else if (status == Strophe.Status.CONNFAIL) {
//             log('Strophe无法连接。');
//             // window.imConnect(exChangeJid(user.userId),);
//         } else if (status == Strophe.Status.DISCONNECTING) {
//             log('Strophe正在断开连接');
//         } else if (status == Strophe.Status.DISCONNECTED) {
//             alert('已断开连接');
//             log('Strophe已断开连接');
//             // connection.connect(connection.jid, connection.pass, onConnect);
//         } else if (status == Strophe.Status.CONNECTED) {
//             log('Strophe已连接');

//             $('.own_head_top').attr('src',user.avatar);
//             $('.own_head').css('background','url(\''+user.avatar+'\')');
//             window.jid = exChangeJid(user.userId);

//             connection.addHandler(onMessage, null, 'message', null, null, null);
//             connection.send(wrapper.$pres().tree());

//             // loadMsg(friends[0]);
//             buildTalkList(exChangeJid(user.userId));
//             make_friend();

//         }
//     }



//     /**
//      * 构建消息历史记录
//      * @param other_user 目标用户信息
//      * @param msgArr
//      */
//     function buildUniqueUserView(other_user,msgArr = []) {
//         console.log(msgArr);
//         if(msgArr.length > 0){
//             let view,data;
//             // 遍历消息
//             $("#chatbox").html('');
//             $.each(msgArr,function (index,item) {
//                 data = { };
//                 // 判断是否为本人
//                 // console.log(item);
//                 // console.log(jid);
//                 if(item.sender_uid == jid){
//                         data.identity='me';
//                         data.avatar = user.avatar;
//                         data.nick = user.usernick;
//                 }else{
//                     data.identity='other';
//                     data.avatar = other_user.avatar;
//                     data.nick = item.nick;
//                 }
//                 // console.log(data);
//                 // console.log('---------');
//                 data.msg = item.content;
//                 //渲染消息模板
//                 view = template('chatView',data);
//                 $("#chatbox").append(view);
//             });
//         }
//     }

//     /**
//      * 接收信息回调
//      * @param msg
//      * @returns {boolean}
//      */
//     function onMessage(msg) {
//         // console.log('--------------------');
//         // console.log(msg);
//         // console.log('--------------------');
//         let from = msg.getAttribute('from');
//         let type = msg.getAttribute('type');
//         let elems = msg.getElementsByTagName('body');
//         if(type == 'chat' && elems.length > 0){
//             let body = Strophe.getText(elems[0]);
//             let save = { jid:jid,sender_uid:from,tojid:jid,msg:body };
//             addChat(save,function (res) {
//                 updateTalkList(exChangeJid(user.userId),from);
//                 if(res.status){
//                     let other_jid = from.substring(0,from.indexOf('@'));
//                     let set_top = $("#talk_list").find("li[data-other_id='"+other_jid+"']");
//                     if(friends.length > 0){
//                         friends.map(function (item,index) {
//                             if(item.userId == other_jid){
//                                 $("#fridesTop").text(item.nick);

//                                 if(set_top.length == 0){
//                                     let talkData = {
//                                         active:'user_active',
//                                         jid:exChangeJid(item.userId),
//                                         other_id:item.userId,
//                                         chat_type:'chat',
//                                         nick:item.nick,
//                                         avatar:item.avatar,
//                                         msg:'',
//                                         time:'',
//                                     };
//                                     let talkView = template('talkListView',talkData);
//                                     $("#talk_list").prepend(talkView);
//                                 }
//                                 let chatData = {
//                                     identity: 'other',
//                                     avatar:item.avatar,
//                                     nick:item.avatar,
//                                     msg:body
//                                 };
//                                 let chatView  = template('chatView',chatData);
//                                 $("#chatbox").append(chatView);
//                             }
//                         })
//                     }

//                 }
//             });
//         }
//         // console.log('---------------------');
//         return true;
//     }


//     /**
//      * 查询用户消息(所有信息)
//      * @param other_jid 目标jid
//      * @param callback null|function
//      */
//     function getChat(other_jid,callback = null){
//         let sql = "SELECT * FROM  chat WHERE uid = ? AND (sender_uid = ? OR receiver_uid = ?) ORDER BY time DESC";
//         db.transaction(function (tx) {
//             tx.executeSql(sql,[jid,jid,jid],function (db,db_res) {
//                 callback({status:1,data:db_res.rows});
//             },function (db,err) {
//                 callback({status:0,err:err});
//                 console.log('db:getChat()=>error');
//                 console.log(err);
//             });
//         });
//     }

//     /**
//      * 构建会话列表
//      * @param jid
//      */
//     function buildTalkList(jid) {
//         let sql = "SELECT * FROM  talk_list WHERE uid = ? ORDER BY time DESC";
//         let view;
//         db.transaction(function (tx) {
//             tx.executeSql(sql,[jid],function (db,db_res) {
//                 let list = db_res.rows;
//                 //遍历消息
//                 $.each(db_res.rows,function (index,item) {
//                     var active = index == 0 ? 'user_active':'';
//                     var data = { active:active };
//                     //遍历好友
//                     let other = {};
//                     for(var friend_i = 0; friends.length > friend_i;friend_i++){
//                         if(friend_i == 0){
//                             $("#fridesTop").text(friends[0].nick);
//                             getChat(exChangeJid(friends[friend_i].userId), function (res) {
//                                 buildUniqueUserView(friends[friend_i],res.data);
//                             });
//                         }
//                         if(item.other_id == exChangeJid(friends[friend_i].userId)){
//                             //获取首个好友消息历史记录
//                             data.jid = exChangeJid(friends[friend_i].userId);
//                             data.avatar = friends[friend_i].avatar;
//                             data.other_id = friends[friend_i].userId;
//                             data.nick = friends[friend_i].nick;
//                             // data.time = friends[friend_i].time;
//                             data.chat_type = 'chat';
//                             view  = template('talkListView',data);
//                             $("#talk_list").html('');
//                             $("#talk_list").append(view);
//                             break;
//                         }
//                     }
//                 });
//             },function (db,err) {
//                 console.log('db:getChat()=>error');
//                 console.log(err);
//             });
//         });

//     }

//     /**
//      * 更新会话记录列表
//      * @param jid
//      * @param other_id
//      */
//     function updateTalkList(jid,other_id) {
//         let sql = "SELECT * FROM talk_list WHERE uid = ? AND other_id = ? LIMIT 0,1";
//         let time = getFormatDate();
//         db.transaction(function (tx) {
//             tx.executeSql(sql,[jid,other_id],function (db,db_res) {
//                 // console.log(db_res);
//                 if(db_res.rows.length != 0){
//                     //更新会话记录
//                     tx.executeSql("UPDATE talk_list SET time = ? WHERE id = ?",
//                         [time,db_res.rows[0].id],
//                         function (db,db_res) {
//                         console.log(db);
//                         console.log(db_res);
//                     });
//                     }else{
//                     //新建会话记录
//                     tx.executeSql("INSERT INTO talk_list (uid, other_id, time) VALUES (?, ?, ?)",
//                         [jid,other_id,time],
//                         function (db,db_res) {

//                     });
//                 }
//             },function (db,err) {
//                 console.log('db:getChat()=>error');
//                 console.log(err);
//             });
//         });
//     }

//     /**
//      * 保存消息
//      * @param uid   发送者jid
//      * @param receiver_id   接收者jid
//      * @param msg   文本内容
//      * @param callback  null|function
//      */
//     function addChat({jid:uid,sender_uid:sender_uid,tojid:receiver_uid,msg:msg},callback = null){
//         let type = 'chat',
//             time = '';
//         let sql = "INSERT INTO chat (uid, type, sender_uid, receiver_uid, content,time) VALUES (?, ?, ?, ?, ?, ?)";
//         db.transaction(function (tx) {
//             tx.executeSql(sql,[uid, type, sender_uid, receiver_uid, msg,time],function (db,db_res) {
//                 callback({status:1,data:db_res});
//             },function (db,err){
//                 callback({status:0,err:err});
//                 console.log('db:addChat()=>error');
//                 console.log(err);
//             });
//         });
//     }

//     /**
//      * 创建webdb && 创建表
//      */
//     function creatDb(){
//         db = openDatabase('webchat', '1.0', 'chat_log', 2 * 1024 * 1024);
//         db.transaction(function (tx) {
//             tx.executeSql('CREATE TABLE IF NOT EXISTS chat (id integer primary key, uid, type, sender_uid, receiver_uid, content, time datetime)');
//             tx.executeSql('CREATE TABLE IF NOT EXISTS talk_list (id integer primary key, uid, other_id, time datetime)');
//         });
//     }


//     function getFormatDate() {
//         var nowDate = new Date();
//         var year = nowDate.getFullYear();
//         var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
//         var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
//         var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
//         var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
//         var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
//         return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
//     }

//     function make_friend(){
//         if(window.friends.length > 0){
//             var html = "<li>";
//             friends.map(function (item,index) {
//                 html +=
//                     `<div class='friends_box' ondblclick="addChatView(this);" data-userId="${item.userId}">
//                         <div class='user_head'><img src="${item.avatar}"/></div>
//                         <div class='friends_text'>
//                         <p class='user_name'>${item.nick}</p>
//                         </div>
//                     </div>`;
//             });
//             html += "</li>";
//             $(".friends_list").append(html);
//         }
//     }

//     /**
//      * 发送消息
//      * @param jid
//      * @param tojid
//      * @param msg
//      * @returns {boolean}
//      */
//     window.sendMsg = function (jid,tojid,msg){
//         // log('jid:'+user+',tojid:'+tojid+',msg:'+msg);
//         if(msg.length == 0){
//             alert('不能发送空消息');
//             return false;
//         }else if(jid == tojid){
//             alert('不能给自己发送消息');
//             return false;
//         }
//         console.log(wrapper)
//         let reply = wrapper.$msg({ to:tojid,from:jid,type:'chat',avatar:''}).c("body",null,msg);
//         connection.send(reply.tree());
//         addChat({ jid:jid,sender_uid:jid,tojid:tojid, msg},function (res) {
//             let data = {
//                 identity: 'me',
//                 avatar:user.avatar,
//                 nick:user.avatar,
//                 msg:msg
//             };
//             let view  = template('chatView',data);
//             $("#chatbox").append(view);
//             updateTalkList(jid,tojid);
//             console.log(res);
//         });
//     };

//     /**
//      * 查询好友消息
//      * @param other_user
//      */
//     window.loadMsg = function(other_user){
//         getChat(exChangeJid(other_user.userId), function (res) {
//             buildUniqueUserView(other_user,res.data);
//         })
//     };

//     /**
//      * 创建聊天窗体
//      * @param dom
//      */
//     window.addChatView = function(dom) {
//         let div = $(dom)[0];
//         let userId = $(div).data('userid');
//         let other_user = { },data = { };
//         // 会话列表容器
//         let container = $("#talk_list");
//         //遍历好友
//         if(friends.length > 0){
//             friends.map(function (item,index) {
//                 if(item.userId == userId){
//                     other_user = item;
//                 }
//             });
//         }
//         // 判断会话框是否存在
//         let exists = false;
//         $("#talk_list").find('li').attr('class','');
//         container.find('li').each(function (i,item) {
//             // $(item).Class('');
//             if($(item).data('other_id') == other_user.userId){
//                 let li = $(item).addClass('user_active');
//                 $("#talk_list").prepend($(item).clone(true));
//                 $(item).remove();
//                 $("#fridesTop").text(other_user.nick);
//                 exists = true;
//             }
//         });
//         //不存在则添加会话框
//         if(!exists){
//             data.active = 'user_active';
//             data.nick = other_user.nick;
//             data.avatar = other_user.avatar;
//             data.other_id = other_user.userId;
//             data.chat_type = 'chat';
//             data.msg = '';
//             data.time = '';
//             console.log(data);
//             let view  = template('talkListView',data);
//             $("#talk_list").prepend(view);
//             $("#fridesTop").text(other_user.nick);
//         }

//     };


//     window.login_user1 = function (){
//         window.user = {
//             avatar:'images/head/15.jpg',
//             tel: "13003004110",
//             userId: "62003001",
//             usernick:'62003001',
//         };
//         connection.connect(
//             '62003001@app.im',
//             '322677',
//             onConnect
//         );
//     };

//     window.login_user2 = function (){
//         window.user = {
//             avatar:'images/head/2.jpg',
//             tel: "13003004110",
//             userId: "62003002",
//             usernick:'62003002',
//         };
//         connection.connect(
//             '62003002@app.im',
//             '997954',
//             onConnect
//         );
//     };
//     window.login_user4 = function (){
//         window.user = {
//             avatar:'images/head/4.jpg',
//             tel: "13003004110",
//             userId: "62003004",
//             usernick:'62003004',
//         };
//         connection.connect(
//             '62003004@app.im',
//             '239897',
//             onConnect
//         );
//     };

//     window.exChangeJid = function(uid){
//         return uid + '@app.im/app';
//     };

//     window.user_logout =function () {
//         connection.disconnect();
//     };


//     $(document).ready(function () {
//         let db;
//         creatDb();
//         connection = new Strophe.Connection(BOSH_SERVICE, {sync: false});
//         connection.rawInput = rawInput;
//         connection.rawOutput = rawOutput;


//     });
// });
