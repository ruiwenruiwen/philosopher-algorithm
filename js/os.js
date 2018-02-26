// os.js

let dining = {};

// 定义信号量
let chopstick = [1, 1, 1, 1, 1];

// 定义哲学家
let philosopher = [0, 1, 2, 3, 4];

// 可以吃饭的哲学家
let eating = [];

// 正在等待的哲学家
let waiting = [];

let boxes = [];

let timer;

$ = function (id) {
	return document.getElementById(id);
}

// 将对话框和哲学家座位对应
created = (function() {
	boxes.push($('top-words'));
	boxes.push($('left-words'));
	boxes.push($('left-bottom-words'));
	boxes.push($('right-bottom-words'));
	boxes.push($('right-words'));
}())

let btn = document.getElementById('click-btn');

// 随机确定哲学家是否想吃饭
dining.want = function() {
	return eating = philosopher.reduce((acc, arr, i) => {
		// 想吃饭则
		if(dining.wait(i, chopstick[i], chopstick[i + 1])) {
			console.log('idx: ' + i);
			console.log(chopstick);
			return acc.concat(i);
		}
		return acc;
	}, [])
}

// 取筷子的操作
dining.wait = function(i, pre, next) {
	// 随机数判断哲学家是否想吃饭
	let wantToEat = Math.floor(Math.random() * 2);
	// 想吃饭，则每个哲学家先左手拿筷子，再右手拿筷子
	// 倘若哲学家右手拿的筷子被占用，则根据左手拿筷子的时间
	// 后拿筷子的哲学家放下左手的筷子，并等待他左手的筷子
	if(wantToEat === 1) {
		if(pre === 1 && next === 1) {
			// 去筷子，信号量 -1
			chopstick[i] -= 1;
			chopstick[(i + 1) % 5] -= 1;
			console.log('idx to eat: ' + i);
			console.log(chopstick);
			eating.push(i);
			return true;
		}
		if(pre === 0) {
			// 设置等待信号量
			chopstick[i] -= 1;
			console.log('idx to wait: ' + i);
			waiting.push(i);
		}
		if(pre === 1 && next === 0 && i === 5) {
			// 设置等待信号量
			chopstick[i] = 0;
			console.log('idx to wait: ' + i);
			waiting.push(i);
		}
	}
	console.log(chopstick);
	return false;
}

// 对话框渲染的操作
dining.eat = function(final) {
	if(final.length == 0) {
		philosopher.forEach((e) => {
			boxes[e].innerHTML = '看来我们五个人都不饿。';
		})
	}
	else {
		philosopher.forEach((e) => {
			boxes[e].innerHTML = '吃饭哪里有思考有趣呢？';
		});
		final.forEach((e) => {
			boxes[e].innerHTML = '谦让谦让，我开始吃饭了';
			boxes[e].style.backgroundColor = '#9ccfe7';

		});
		waiting.forEach((e) => {
			boxes[e].innerHTML = '谦让是美德，我稍后再吃';
			boxes[e].style.backgroundColor = '#e6e9ca';

		})
	}
}

// 放下筷子
dining.signal = function(i, pre, next, arr) {
	if(arr === eating) {
		boxes[i].innerHTML = '酒足又饭饱，我继续思考';
		boxes[i].style.backgroundColor = '#fff';
	} else if (arr === waiting){
		boxes[i].innerHTML = '我也酒足饭饱，继续思考';
		boxes[i].style.backgroundColor = '#fff';
	}
	// 将所占有的信号量释放
	chopstick[i] += 1;
	chopstick[(i + 1) % 5] += 1;
}

// 吃饭的操作
dining.finish = function(arr) {
	arr.forEach((idx) => {
		dining.signal(idx, chopstick[idx], chopstick[(idx + 1) % 5], arr);
		console.log('idx put down chopstick: ' + idx);
		console.log(chopstick);
	})
}

// 对于正在等待的哲学家等待的处理
dining.nextTern = function(eat, wait) {
	return new Promise((res, rej) => {
		// 拿了筷子的哲学家吃饭
		dining.finish(eat);
		// 等待吃饭的哲学家等拿了筷子的哲学家吃完
		// 拿起筷子，信号量 -1
		wait.forEach((e) => {
			chopstick[(e + 1) % 5] -= 1;
		})
		res();
	})
}

// 排队等待
dining.timeOut = function(eat, wait, words, ms) {
	timer = window.setTimeout(() => {
		dining.nextTern(eat, wait).then(() => {
			console.log(chopstick);
			// 等待的哲学家等拿到筷子就吃饭
			wait.forEach((e) => {
				boxes[e].innerHTML = words;
				boxes[e].style.backgroundColor = '#9ccfe7';
			})
		})
	}, ms);
}

// 初始化操作
dining.init = function() {
	eating = [];
	waiting = [];
	chopstick = [1, 1, 1, 1, 1];
	clearTimeout(timer);
	boxes.forEach((e, i) => {
		boxes[i].style.backgroundColor = '#fff';
	})
	console.log(chopstick);
}

// 主函数
dining.main = function() {
	dining.init();
	let final = dining.want();
	console.log('能吃上意大利面的是： ' + final);
	console.log('正在等待的是： ' + waiting);
	dining.eat(final);
	dining.timeOut(eating, waiting, '谢天谢地，终于轮到我了', 4000);
	console.log(waiting);
	dining.timeOut(waiting, [], '', 8000);
}

btn.addEventListener('click', dining.main);
