var start=document.getElementById('start')
var header=document.getElementById('header')
var flyBird=document.getElementById('flyBird')
var audios=document.getElementsByTagName('audio')
var box=document.getElementById('box')
var pipeBox=document.getElementById('pipeBox')
var scoreBoard=document.getElementById('scoreBoard')

var downTimer=null//bird下降的定时器
var upTimer=null
var pipeTimer=null
var crashTimer=null
var speed=0
var maxSpeed=8
var scoreNum=0
function birdDown() {
	flyBird.src='img/down_bird1.png'
	speed=speed>=maxSpeed?maxSpeed:speed+.3
	//bird top值不断增加
	flyBird.style.top=flyBird.offsetTop+speed+'px'
}
function birdUp(){
	if (speed>0) {
		speed=speed-.7
	}else{
		clearInterval(upTimer)
		downTimer=setInterval(birdDown,30)
	}
	flyBird.style.top=flyBird.offsetTop-speed+'px'
}
function createPipe() {
	var li=document.createElement('li')
	var rand=Math.random()*(240-60)+60
	//60-240
	li.lock=false//加分锁,false代表此li没加过分
	li.appearTimer=setInterval(function () {
		li.style.left=li.offsetLeft-3+'px'
		if (li.offsetLeft<-70) {
			//超出画面外的管道移除之
			pipeBox.removeChild(li)
		}
		if(!li.lock&&li.offsetLeft+li.offsetWidth<flyBird.offsetLeft){
			//add score
			scoreNum++
			// scoreNum=1234567890
			li.lock=true
			//console.log(scoreNum,String(scoreNum))
			scoreBoard.innerHTML=''
			//每次加分前,都把计分板清空
			for (var i=0;i<String(scoreNum).length;i++) {
				var img=document.createElement('img')
				img.src=`img/${String(scoreNum)[i]}.jpg`
				scoreBoard.appendChild(img)
			}
		}
	},30)
	li.innerHTML=`	
		<div class="pipeT" style="height:${rand}px">
			<img src="img/up_pipe.png">
		</div>
		<div class="pipeB" style="height:${300-rand}px">
			<img src="img/down_pipe.png">
		</div>
	`
	pipeBox.appendChild(li)

}

function isCrash(obj1,obj2) {
	// console.log(obj2.offsetTop)
	if(obj1.offsetTop>obj2.offsetTop+obj2.offsetHeight||obj1.offsetTop+obj1.offsetHeight<obj2.offsetTop
		||obj1.offsetLeft>obj2.parentNode.offsetLeft+obj2.offsetWidth||obj1.offsetLeft+obj1.offsetWidth<obj2.parentNode.offsetLeft){
		return false
	}
	return true
}
function gameOver() {
	audios[2].play()
	audios[0].pause()

	box.onclick=null
	clearInterval(downTimer)
	clearInterval(upTimer)
	clearInterval(crashTimer)
	clearInterval(pipeTimer)
	var lis=pipeBox.getElementsByTagName('li')
	for (var i = lis.length - 1; i >= 0; i--) {
		clearInterval(lis[i].appearTimer)
	}

}

start.onclick=function (e) {
	var e=e||window.event
	if(e.stopPropagition){
		e.stopPropagition()
	}else{
		e.cancelBubble=true
	}

	//start和header消失
	start.style.display='none'
	header.style.display='none'
	//flyBird出现
	flyBird.style.display='block'
	// audios[0].play()
	downTimer=setInterval(birdDown,30)
	pipeTimer=setInterval(createPipe,3000)
	crashTimer=setInterval(function () {
		//天花板和地板是否碰撞
		if(flyBird.offsetTop<=0||flyBird.offsetTop+flyBird.offsetHeight>=422){
			gameOver()
		}
		//跟管道碰撞
		var lis=pipeBox.getElementsByTagName('li')
		for (var i=0;i<lis.length;i++) {
			//lis[i]
			console.log()
			
			if (isCrash(flyBird,lis[i].children[0])||isCrash(flyBird,lis[i].children[1])) {
				gameOver()
			}

		}

	},30)
	box.onclick=function () {
		audios[1].play()
		//换鸟
		flyBird.src='img/up_bird1.png'
		//停止下降
		clearInterval(downTimer)

		//防止用户点击速度过快,上一次upTimer还未结束,下一次就开始,每次点击时候都先终止上一次的upTimer
		clearInterval(upTimer)

		//开始上升
		speed=maxSpeed
		upTimer=setInterval(birdUp,30)
	}
}



