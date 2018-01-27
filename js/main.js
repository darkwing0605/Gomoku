/*
 * 初始化棋盘
 */
const chessBoard = [];
for (let i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (let j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}

/*
 * 赢法数组
 */
let wins = [];
for (let i = 0; i < 15; i++) {
	wins[i] = [];
	for (let j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
let count = 0;
/*
 * 所有竖线的赢法
 */
for (let i = 0; i < 15; i++) {
	for (let j = 0; j < 11; j++) {
		for (let k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
/*
 * 所有横线的赢法
 */
for (let i = 0; i < 15; i++) {
	for (let j = 0; j < 11; j++) {
		for (let k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}
/*
 * 所有斜线的赢法
 */
for (let i = 0; i < 11; i++) {
	for (let j = 0; j < 11; j++) {
		for (let k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
/*
 * 所有反斜线的赢法
 */
for (let i = 0; i < 11; i++) {
	for (let j = 14; j > 3; j--) {
		for (let k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}

/*
 * 赢法统计数组
 */
let myWin = [];
let computerWin = [];
for (let i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}

// 默认第一颗棋子黑色
let me = true;
// 棋局是否结束
let over = false;

const context = document.getElementById('chess').getContext('2d');
context.strokeStyle = '#BFBFBF';
/*
 * 水印
 */
const logo = new Image();
logo.src = 'image/favicon.png';
logo.onload = () => {
	// 先加载水印
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
}
/*
 * 棋盘
 */
const drawChessBoard = () => {
	for (let i = 0; i < 15; i++) {
		// 纵线
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		// 横线
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}
/*
 * 棋子
 * @param {Number} i 横坐标
 * @param {Number} j 纵坐标
 * @param {Boolean} me true黑false白
 */
const oneStep = (i, j, me) => {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	let gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if (me) {
		gradient.addColorStop(0, '#0A0A0A');
		gradient.addColorStop(1, '#636766');
	} else {
		gradient.addColorStop(0, '#D1D1D1');
		gradient.addColorStop(1, '#F9F9F9');
	}

	context.fillStyle = gradient;
	context.fill();
}
/*
 * 落子
 */
chess.onclick = (e) => {
	if (over) {
		return;
	}
	if (!me) {
		return;
	}
	let x = e.offsetX;
	let y = e.offsetY;
	let i = Math.floor(x / 30);
	let j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;
		for (let k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;
				if (myWin[k] == 5) {
					window.alert("你赢了");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAI();
		}
	}
}

const computerAI = () => {
	let myScore = [];
	let computerScore = [];
	// 保存最高分数
	let max = 0;
	// 保存最高分数坐标
	let u = 0;
	let v = 0;
	for (let i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (let j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (let i = 0; i < 15; i++) {
		for (let j = 0; j < 15; j++) {
			if (chessBoard[i][j] == 0) {
				for (let k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}
						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if (computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if (computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						} else if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] == max) {
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] == max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for (let k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if (computerWin[k] == 5) {
				window.alert('计算机赢了');
				over = true;
			}
		}
	}
	if (!over) {
		me = !me;
	}
}