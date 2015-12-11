
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
	timerTxt:null,
	nextBtn:null,
	titleSp:null,
	titleTxt:null,
	startNode:null,
	leveNode:null,
	answerList:null,
	randomLevel:null,
	timer:30,
	iconWidth:75,
	currLevel:1,
	realLevel:0,
    ctor:function () {
        this._super();
        var size = cc.winSize;

		this.createMainUI();
        return true;
    },
	createMainUI:function () {
		this.startNode = new cc.Node();
		var startBtn = new ccui.Button("res/ui/start.png", "res/ui/start.png");
		this.startNode.addChild(startBtn);
		startBtn.addTouchEventListener(this.eventListen, this);
		startBtn.name = "startBtn";
		
		var logo = new cc.Sprite("res/ui/logo.png");
		this.startNode.addChild(logo);
		logo.attr({
            y: 100
        });
		
		var size = cc.winSize;
		this.startNode.attr({
            x: size.width / 2,
            y: size.height / 2
        });
		this.addChild(this.startNode);
		
	},
	timeHeart:function (dt) {
		this.timer--;
		this.timerTxt.setString("倒计时：" + this.timer);
		if (this.timer <= 0) {
			//失败
			this.showResult();
		}
	},
	eventListen:function (sender, type) {
		if (type == ccui.Widget.TOUCH_ENDED){
			if (sender.name == "startBtn") {
				this.startNode.removeFromParent(true);
				this.firstStart();
			} else if (sender.name == "nextBtn") {
				this.leveNode.removeFromParent(true);
				var flag = this.checkAnswer();
				this.currLevel++;
				if (flag) {
					if (this.currLevel > 23) {
						//成功
						this.showResult();
						cc.log("购票成功");
					} else {
						this.answerList = new Array();
						this.createItems(this.currLevel);
					}
				} else {
					//失败
					this.showResult();
					cc.log("购票失败");
				}
			} else if (sender.name == "shareBtn") {
				//分享
			} else if (sender.name == "againBtn") {
				//再来一次
				this.removeAllChildren();
				this.firstStart();
			}
		}
	},
	firstStart:function () {
		var temp = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
		this.randomLevel = this.randomArray(temp);
		this.timer = 30;
		this.currLevel = 1;
		var size = cc.winSize;
		this.sprite = new cc.Sprite(res.bg_png);
		this.sprite.attr({
			x: size.width / 2,
			y: size.height / 2
		});
		this.addChild(this.sprite, 0);
		
		//title
		this.titleSp = new cc.Sprite("res/ui/title.png");
		this.titleSp.x = 200;
		this.titleSp.y = 580;
		this.addChild(this.titleSp);
		
		this.titleTxt = new cc.LabelTTF("Hello World", "Arial", 24);
		this.titleTxt.x = this.titleSp.x + this.titleSp.width + 5;
		this.titleTxt.y = 580;
		this.titleTxt.anchorX = 0;
		this.addChild(this.titleTxt);
		this.titleTxt.setColor(cc.color(128,128,128));
		
		//timer
		this.timerTxt = new cc.LabelTTF("倒计时：" + this.timer, "Arial", 24);
		this.timerTxt.x = this.titleSp.x;
		this.timerTxt.y = 650;
		this.addChild(this.timerTxt);
		
		//下一关
		this.nextBtn = new ccui.Button("res/ui/next.png", "res/ui/next.png");
		this.nextBtn.addTouchEventListener(this.eventListen, this);
		this.addChild(this.nextBtn);
		this.nextBtn.name = "nextBtn";
		this.nextBtn.x = 400;
		this.nextBtn.y = 200;
		this.answerList = new Array();
		this.createItems(this.currLevel);
		this.schedule(this.timeHeart,1, 30);
	},
	showResult:function () {
		this.unschedule(this.timeHeart);
		this.timerTxt.removeFromParent(true);
		this.nextBtn.removeFromParent(true);
		this.titleSp.removeFromParent(true);
		this.titleTxt.removeFromParent(true);
		
		var count = this.currLevel - 2;
		var size = cc.winSize;
		if (count > 0) {
			var succSp = new cc.Sprite("res/ui/succ.png");
			this.addChild(succSp);
			succSp.attr({
				x: size.width / 2,
				y: size.height / 2
			});
			
			var countTxt = new cc.LabelTTF(count, "Arial", 17);
			var percentTxt = new cc.LabelTTF("78%", "Arial", 17);
			succSp.addChild(countTxt);
			succSp.addChild(percentTxt);
			countTxt.setColor(cc.color(0,0,0));
			percentTxt.setColor(cc.color(0,0,0));
			countTxt.attr({
				x: 198,
				y: 66
			});
			percentTxt.attr({
				x: 130,
				y: 32
			});
		} else {
			var failSp = new cc.Sprite("res/ui/fail.png");
			this.addChild(failSp);
			failSp.attr({
				x: size.width / 2,
				y: size.height / 2
			});
		}
		
		var shareBtn = new ccui.Button("res/ui/share.png", "res/ui/share.png");
		var againBtn = new ccui.Button("res/ui/again.png", "res/ui/again.png");
		shareBtn.name = "shareBtn";
		againBtn.name = "againBtn";
		shareBtn.addTouchEventListener(this.eventListen, this);
		againBtn.addTouchEventListener(this.eventListen, this);
		this.addChild(shareBtn);
		this.addChild(againBtn);
		shareBtn.attr({
			x: 240,
			y: 380
		});
		againBtn.attr({
			x: 420,
			y: 380
		});
	},
	anwserListener:function (sender, type) {
		if (type == ccui.Widget.TOUCH_ENDED){
			var boo = false;
			for (var i = 0; i < this.answerList.length; i++) {
				if (this.answerList[i] == sender.name) {
					sender.removeAllChildren();
					this.answerList.splice(i, 1);
					boo = true;
					break;
				}
			}
			if (boo == false) {
				this.answerList.push(sender.name);
				var sp = new cc.Sprite("res/ui/logo.png");
				sp.x = 20;
				sp.y = 20;
				sender.addChild(sp);
			}
		}
	},
	checkAnswer:function () {
		var arr = level.all["L_" + this.realLevel].answer;
		for (var i = 0; i < this.answerList.length; i++) {
			var boo = false;
			for (var j = 0; j < arr.length; j++) { 
				if (this.answerList[i] == arr[j]) {
					boo = true;
				}
			}
			if (boo == false) {
				return false;
			}
		}
		for (var i = 0; i < arr.length; i++) {
			var boo = false;
			for (var j = 0; j < this.answerList.length; j++) { 
				if (arr[i] == this.answerList[j]) {
					boo = true;
				}
			}
			if (boo == false) {
				return false;
			}
		}
		return true;
	},
	createItems:function (le) {
		var tempLv = this.randomLevel[le - 1];
		this.realLevel = tempLv;
		this.titleTxt.setString(level.all["L_" + tempLv].title);
		this.leveNode = new cc.Node();
		var pool = [1, 2, 3, 4, 5, 6, 7, 8];
		var arr = this.randomArray(pool);

		var sp1 = this.createItem(tempLv, arr[0]);
		this.leveNode.addChild(sp1);
		
		var sp2 = this.createItem(tempLv, arr[1]);
		this.leveNode.addChild(sp2);
		sp2.x = sp1.x + this.iconWidth;
		
		var sp3 = this.createItem(tempLv, arr[2]);
		this.leveNode.addChild(sp3);
		sp3.x = sp2.x + this.iconWidth;
		
		var sp4 = this.createItem(tempLv, arr[3]);
		this.leveNode.addChild(sp4);
		sp4.x = sp3.x + this.iconWidth;
		
		var sp5 = this.createItem(tempLv, arr[4]);
		this.leveNode.addChild(sp5);
		sp5.y = sp1.y - this.iconWidth;
		
		var sp6 = this.createItem(tempLv, arr[5]);
		this.leveNode.addChild(sp6);
		sp6.x = sp5.x + this.iconWidth;
		sp6.y = sp5.y;
		
		var sp7 = this.createItem(tempLv, arr[6]);
		this.leveNode.addChild(sp7);
		sp7.x = sp6.x + this.iconWidth;
		sp7.y = sp5.y;
		
		var sp8 = this.createItem(tempLv, arr[7]);
		this.leveNode.addChild(sp8);
		sp8.x = sp7.x + this.iconWidth;
		sp8.y = sp5.y;
		
		var size = cc.winSize;
		this.leveNode.attr({
            x: 200,
            y: size.height / 2
        });
		this.addChild(this.leveNode);
	},
	createItem:function (le, ind) {
		var sp = new ccui.Button("res/level/" + le + "/" + ind + ".png", "res/level/" + le + "/" + ind + ".png");
		sp.name = ind;
		sp.addTouchEventListener(this.anwserListener, this);
		return sp;
	},
	randomArray:function (pool) {
		var arr2 = new Array();  
		var count = pool.length;  
		var cbRandCount = 0;// 索引  
		var cbPosition = 0;// 位置  
		var k = 0;  
		do {  
			var r = count - cbRandCount;  
			cbPosition = Math.floor(r * Math.random());  
			arr2.push(pool[cbPosition]);
			cbRandCount++;  
			pool[cbPosition] = pool[r - 1];
		} while (cbRandCount < count);  
		return arr2;  
	}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

