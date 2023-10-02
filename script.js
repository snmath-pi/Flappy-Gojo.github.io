// board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;


// gojo 
let gojoWidth = 50; // width / height ratioi = 408/228->17/12
let gojoHeight = 50; 
let gojoX = boardwidth/8;
let gojoY = boardheight/2;
let gojoimage;
let gojo = {
    x: gojoX,
    y: gojoY,
    width: gojoWidth,
    height: gojoHeight
}

// pipes
let pipeArray = [];
let pipeWidth=64;
let pipeHeight=512;
// 64/512->1/8
let pipeX = boardwidth;
let pipeY = 0;

let toppipeimg;
let bottompipeimg;

// physics
let velocityX = -2; // pipe moving left speed
let velocityY = 0; // gojo jump speed

let gravity = 0.4;
let gameover = false;
let score=0;
window.onload = function(){
    // a function that works when page loads
    board=document.getElementById("board"); 
    board.height=boardheight;
    board.width=boardwidth;
    // drawing on the board
    context=board.getContext("2d");

    // draw the gojo

    // context.fillStyle = "green";
    // context.fillRect(gojo.x,gojo.y,gojo.width,gojo.height);


    // load the image
    gojoimage=new Image();
    gojoimage.src="./flappygojo-removebg-preview.png";
    gojoimage.onload = function() {
        
        context.drawImage(gojoimage, gojo.x,gojo.y,gojo.width,gojo.height);
    }

    toppipeimg=new Image();
    toppipeimg.src="./toppipe.png";
    bottompipeimg=new Image();
    bottompipeimg.src="./bottompipe.png";
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", movegojo);
}

function update() {
    requestAnimationFrame(update);
    if(gameover) {
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    // gojo
    velocityY+=gravity;
    // gojo.y+=velocityY;
    gojo.y = Math.max(gojo.y+velocityY, 0);
    context.drawImage(gojoimage, gojo.x,gojo.y,gojo.width,gojo.height);
    if(gojo.y > board.height) {
        gameover=true;
    }


    // pipes

    for (let i=0; i<pipeArray.length; i++) {
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img, pipe.x,pipe.y,pipe.width,pipe.height);
        if(!pipe.passed&&gojo.x>pipe.x+pipe.width) {
            score+=0.5;
            pipe.passed=true;
        }
        if(detectCollision(gojo,pipe)) {
            gameover=true;
        }
    }

    // clear pipes
    while(pipeArray.length>0&&pipeArray[0].x<-pipeWidth) {
        pipeArray.shift();// removes first element from the array
    }


    // score
    context.fillStyle = "white";
    context.font="30px sans-serif";
    context.fillText(score, 4, 35);

    if(gameover) {
        // context.fillText("GAME OVER", 5, 90)
        
    }
    if(gameover) {
        context.fillText("ゲームオーバー", 5, 90)
    }
}

function placePipes() {
    if(gameover) {
        return;
    }
    let randompipeY = pipeY - pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingspace=board.height/4;

    let toppipe={
        img: toppipeimg,
        x: pipeX,
        y: randompipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(toppipe);

    let bottomPipe = {
        img: bottompipeimg,
        x: pipeX,
        y: randompipeY + pipeHeight + openingspace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function movegojo(e) {
    if(e.code == "Space" || e.code=="ArrowUp" || e.code=="KeyX" || e.code=="onmousedown"||e.code=="onclick") {
        // jump
        velocityY=-6;


        // reset 
        if(gameover) {
            gojo.y=gojoY;
            pipeArray=[];
            score=0;
            gameover=false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y
}

setTimeout(function(){
    document.getElementById("my_audio").play();
}, 8000)
