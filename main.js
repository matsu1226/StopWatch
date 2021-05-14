
const timer = document.getElementById('timer');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const lap = document.getElementById('lap');


let startTime;  //開始時刻
let elapsedTime = 0;    //経過時間
let timerId;    //タイマーを止めるためにはclearTimeOutが必要。その引数にするための変数
let timeToAdd = 0;  //タイマーをstopし、再度startすると0になってしまう。それを避けるための変数。




//---(1)timerの処理
//timerの表記方法を定義
function updateTimeText() {
    //Math.floor(~) => ~のうち最大の整数を返す 
    let m = Math.floor(elapsedTime / 60000);
    //60s=>1mの繰り上がりを表現するには、elapsedTimeをmの一単位(1m = 60*1000ms)で割り、余りを処理。
    let s = Math.floor(elapsedTime % 60000 / 1000);
    //ms => elapsedTimeを1000で割った数の余り
    let ms = Math.floor(elapsedTime % 1000 / 10);

    //(文字列の足し算).slice(-n) => 足し算の内容から要素の末尾2文字を表示
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
    ms = ('0' + ms).slice(-2);

    timer.textContent = m + ':' + s + ':' + ms;
};


//回帰的に処理するための関数
//function fn(){~~~; fn(),time} => time(ms)毎に~~~の処理を実行
function countUp() {
    timerId = setTimeout(function () {
        //経過時間 = 現在時刻 - 開始時刻
        elapsedTime = Date.now() - startTime + timeToAdd;
        //countUp関数を呼び出すことで、10ms毎に処理をループ
        countUp();
        //updateTimeText関数を呼び出すことで、10ms毎にtimerを記述
        updateTimeText();
    }, 20)

};




//---(2)LAP ＴIME記述方法
let laps = [];    //lap timeを格納するための配列
let lapCountNum = 1;    //lap timeの記述用

function clearLapTime(){
    while(lap.firstChild){
        lap.removeChild(lap.firstChild);
    }
}

function createLapTime(){
    //laps配列にobject追加
    laps.push({
        lapCount: lapCountNum,
        lapTime: timer.textContent,
    });                 //lapをlaps配列に格納
    lapCountNum++

    //laps配列のobject数が5を超えないようにする
    if(laps.length > 5){
        laps.shift();
    }

    //laps配列の全要素を記述するための処理
    laps.forEach(lapsElm => {
        const p = document.createElement('p');  //p要素の追加のための定数を定義
        p.innerText = `lap ${lapsElm.lapCount} : ` + `${lapsElm.lapTime}`;  //pの記述内容を定義
        lap.appendChild(p);     //pをdiv(id='lap')の子要素として追加
    })
}




//---(3)クリックイベント
//startボタンをクリックしたときのイベントハンドラを定義
start.addEventListener('click', function () {
    //startボタンをクリックしたときの時刻をstartTimeと定義
    startTime = Date.now();
    countUp();

    start.setAttribute('hidden', "");
    stop.removeAttribute('hidden');
    reset.setAttribute('hidden', "");

})

stop.addEventListener('click', function () {
    //elapsedTime = Date.now() - startTimeであると、
    //startのclickイベント毎にstartTimeが更新されるために、タイマーを再開させるとelapseTimeが0となってしまう。

    //それを回避するためには、過去のstartからstopの経過時間を足してあげる必要がある。
    //elapseTime = Date.now() - startTime + timeToAdd 
    //(timeToAdd = ストップを推した時間(Date.now)から直近のstartTimeを引く)
    timeToAdd += Date.now() - startTime;
    clearTimeout(timerId);

    start.removeAttribute('hidden');
    stop.setAttribute('hidden', "");
    reset.removeAttribute('hidden');

    clearLapTime();
    createLapTime();

})

reset.addEventListener('click', function () {
    elapsedTime = 0;    // 経過時間リセット
    timeToAdd = 0;  //timeToAddリセット
    updateTimeText();   //isoした時点で、タイマー記述。

    reset.setAttribute('hidden', "");

    laps = [];
    lapCountNum = 1;
    clearLapTime();

})

