var openIm = null;

function OpenIm() {}

var sdk = new WSDK();

//登录im帐号
OpenIm.prototype.imLogin = function(callback) {
	var member = myLocalStorage.getItem("member");
	var config = myLocalStorage.getItem("config");
	sdk.Base.login({
		uid: member.phone,
		appkey: config.taobaoAppKey,
		credential: member.phone + "abcd_123",
		timeout: 5000, //登录超时时间
		success: function(data) {
			if(callback){
				callback();
			}
		},
		error: function(error) {
			console.log('login fail', error);
		}
	});
}

//设置与某人的消息已读
OpenIm.prototype.setUserReadState = function(touid) {
	var obj = this;
	sdk.Chat.setReadState({
		touid: touid,
		hasPrefix: true,
		timestamp: Math.floor((+new Date()) / 1000),
		success: function(data) {
			console.log('设置已读成功', data);
		},
		error: function(error) {
			console.log('设置已读失败', error);
		}
	});
}

var resultMsgs = {
	data:[]	
};
//获取一个月内的最近联系人
OpenIm.prototype.imGetRecentContact = function() {
	var obj = this;
	sdk.Base.getRecentContact({
		count: 10,
		success: function(result) {
			//document.write(JSON.stringify(result));
			resultMsgs.data = [];
			var cnts = result.data.cnts;
			
			//document.write(JSON.stringify(result));
			//return false;
			for(var i = 0; i < cnts.length; i++) {
				var oneData = {};
				var cnt = cnts[i];
				var nickname = cnt.uid.substring(8);
				var date = dateUtil.dateToStr(new Date(cnt.time * 1000), "yyyy-MM-dd HH:mm:ss");
				if(nickname.indexOf("服务助手")>0) {//过滤服务助手消息
					continue;
				}
				var msgStr = "";
				var msgs = cnt.msg;
				for(var j = 0; j < msgs.length; j++) {
					var msg = msgs[j];
					if("T" == msg[0]) {
						msgStr = msg[1];
						break;
					}
				}
				oneData.nickname = nickname
				oneData.msgStr = msgStr;
				oneData.msgCount = 0;
				oneData.date = date;
				oneData.uid =cnt.uid;
				oneData.toUser = cnt.uid.substring(8);
				oneData.avator = cnt.avator;//头像
				resultMsgs.data.push(oneData);
			}
			openIm.getUsersUnreadMsgCount();
		},
		error: function(error) {
			console.log('获取最近联系人及最后一条消息内容失败', error);
		}
	});
}

//获取联系人未读消息数
OpenIm.prototype.getUsersUnreadMsgCount = function() {
	var obj = this;

	var unReadTotals = 0; //未读消息总条数
	sdk.Base.getUnreadMsgCount({
		success: function(result) {
			//document.write(JSON.stringify(data))
			var list = result.data;
			list.forEach(function(item) {
				if(item.contact.substring(0, 8) === 'chntribe') {
					//recentTribe.push(item);
				} else {
					unReadTotals += item.msgCount;
					var fromUid = item.contact;
					for(var i = 0; i < resultMsgs.data.length; i++) {
						if(resultMsgs.data[i].uid == fromUid) { //设置此人的消息
							resultMsgs.data[i].msgCount = item.msgCount;
						}
					}
				}
			});
		},
		error: function(error) {
			//document.write('获取未读消息的条数失败', error);
		}
	});
}

$(function() {
	//每10妙更新未读消息
	/*	window.setInterval(function() {
			openIm.getUsersUnreadMsgCount();
		}, 10000);*/
});