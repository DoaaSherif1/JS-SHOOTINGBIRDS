window.addEventListener("load", function() {
    ////////////////fetch username from query string////////////////////////////
    let queryString=new URLSearchParams(window.location.search);
    const userName=queryString.get("username");
    let spanObject=document.querySelectorAll("span")[0];
    let playerName=document.querySelectorAll("span")[2];
    spanObject.innerText=`${userName}`;
    playerName.innerText=`${userName}`;
    
    /////////////////////////////Selectors/////////////////////////////////////

    let container = document.querySelector(".container");
    let playerScore=document.querySelectorAll("span")[3];
    let startBtn=document.querySelector("button");
    let timer=document.querySelectorAll("span")[5];
    let killScore=this.document.querySelectorAll("span")[6];
    let displayMessage = document.querySelectorAll("h1")[0];
    let scoreMessage=document.querySelectorAll("h1")[1];
    let messageImg = document.querySelectorAll("img")[1];
    let messageBlock = document.querySelectorAll("div")[4];
    let playAgain=document.querySelectorAll("button")[1];
    let highScore=document.querySelectorAll("span")[4];
    let audio=document.querySelectorAll("audio")[0];
    let killSound=document.querySelectorAll("audio")[1];
    let bombSound=document.querySelectorAll("audio")[2];
    let message=document.querySelectorAll("span")[1];
    
    //////////////////////////Initializers/////////////////////////////////////////

    let birds = ["./images/white.gif", "./images/blue.gif", "./images/black.gif"];
    let allBirds=[];
    let score=0;
    let speed=7;
    
    
    /////////////////////////////Handle LocalStorage//////////////////////////////////

    let playerData =localStorage.getItem("player");
    let playerS=localStorage.getItem("score");
    let lastVisit= localStorage.getItem("date");
    let HighestScore=localStorage.getItem("HighestScore");

    ////////////////////////handle if its his/her first time or not///////////////////

    if(playerData==null && playerS==null){
        message.innerText=`Enjoy Your First Try`
    }else{
        message.innerText=`Last player is ${playerData} ,His score is ${playerS} and His last visit in ${lastVisit} `;
    }
        
///////////////////////////////start timer/////////////////////////////////////////////
function startTimer() {
    let seconds = 60;
    let timerId = setInterval(() => {
        seconds--;
        audio.play();
        if (seconds == 0) {
            clearInterval(timerId);
            audio.pause();
        }
        timer.innerHTML = "0:" + seconds;
    }, 1000);

    
}
    ////////////////////////////////////start game/////////////////////////////////////
    startBtn.onclick=function(){
        highScore.innerHTML=HighestScore;
        container.style.display="none";
        startTimer();
        fireBird();
        createBomb();
        
        let birdsTimer = setInterval(fireBird, 1000);
        setTimeout(function() {
            clearInterval(birdsTimer);
        }, 50000);
        let bombTimer = setInterval(createBomb, 5000);
        setTimeout(function() {
            clearInterval(bombTimer);
        }, 57000);
        /////////////////////////Handle the message if player win or lose/////////////////
        setTimeout(() => {
            if (score >= 50) {
                displayMessage.innerHTML = "You Win";
                messageImg.src = "./images/win.png";
            } else {
                displayMessage.innerHTML = "You Lose";
                messageImg.src = "./images/lose.png";
            }
            messageBlock.style.display = "block";
            scoreMessage.innerHTML = "Your Score is : " + score;
            ///////////////////////set player data to localStorage/////////////////////////////
            localStorage.setItem("player", userName);
            localStorage.setItem("score", score);
            console.log(userName,score);
            let d=new Date();
            localStorage.setItem("date",d.toLocaleString());
            if(score>localStorage.getItem("HighestScore")){
                localStorage.setItem("HighestScore",score);
            }
            
        }, 60000);
////////////////////////////Handle Play Again button///////////////////////////////////////////
        playAgain.onclick=function(){
            messageBlock.style.display="none";
            startBtn.onclick();
            setData();
        }
    }

    //////////////////////////Create Bird Function////////////////////////////////////////

    let fireBird = () => {
        let birdImg = document.createElement("img");
        let birdNo=Math.floor(Math.random() * birds.length);
        birdImg.src = birds[birdNo];
        if(birdNo==0){
            birdImg.classList.add("whiteBird");
        }else if(birdNo==1){
            birdImg.classList.add("blueBird");
        }else if(birdNo==2){
            birdImg.classList.add("blackBird");
        }
        
        document.body.appendChild(birdImg);
        let top = Math.random() * (innerHeight - birdImg.height);
        birdImg.style.top = top + "px";
        birdImg.style.left = "0px";
        allBirds.push(birdImg);
        moveRight(birdImg, 0, top);

        /////////////////handling the click on the bird and calculate score for each one////////////////////

        birdImg.onclick=function(){
            killSound.play();
            if(birdImg.classList.contains("whiteBird")){
                score+=5;
                playerScore.innerHTML=score;
            }else if(birdImg.classList.contains("blackBird")){
                score+=10;
                playerScore.innerHTML=score;
            }else if(birdImg.classList.contains("blueBird")){
                score-=10;
                playerScore.innerHTML=score;
            }
            //birdImg.src="./images/die.png";
            //birdImg.classList.add("died");
            //fadeOut(birdImg);
            birdImg.remove();
            killScore.innerText++;
        }
    };
    ///////////////////////////handle bird moving function/////////////////////////////////////////
let moveRight = function(bird, left, top) {
    let id = setInterval(function() {
        left += speed;
        /////////////////////// change bird speed if score >= 50//////////////////////////////////
        if(score>=50){
            speed=11;
        }else{
            speed=7;
        }

        if (left < (innerWidth - bird.width)) {
            bird.style.left = left + "px";
            bird.style.top=top+'px';
        } else {
            clearInterval(id);
            let index = allBirds.indexOf(bird);
            allBirds.splice(index, 1);
            bird.remove();
        }
    }, 100);
}

////////////////////////////////////////create bomb function///////////////////////////////
let createBomb =function(){
    let bombImg = document.createElement("img");
    bombImg.src = "./images/bomb.png";
    bombImg.classList.add("bomb");
    document.body.appendChild(bombImg);
    let left = Math.random() * (innerWidth - bombImg.width);
    bombImg.style.left = left + "px";
    bombImg.style.top = "0px";
    fallDown(bombImg, 0, left);
    
    ////////////////////////////////Handle click on the bomb////////////////////////

    bombImg.onclick=function(){
        bombSound.play();
        allBirds.forEach(function(birdImg){
            let distance = getDistanceBetweenElements(birdImg, bombImg);
            if (distance <= 300){
                if(birdImg.classList.contains("whiteBird")){
                    score+=5;
                    playerScore.innerHTML=score;
                    killScore.innerText++;
                    
                }else if(birdImg.classList.contains("blackBird")){
                    score+=10;
                    playerScore.innerHTML=score;
                    killScore.innerText++;
                    
                }else if(birdImg.classList.contains("blueBird")){
                    score-=10;
                    playerScore.innerHTML=score;
                    killScore.innerText++;
                    
                }
                birdImg.remove();
                
            }
        });
        bombImg.src="./images/fire.gif";
        fadeOut(bombImg);
        //bombImg.remove();
    }
    }    
/////////set scores when play again and get player name and highest score and set speed//////////

function setData(){
    highScore.innerHTML=localStorage.getItem("HighestScore");
    score=0;
    playerScore.innerHTML=score;
    killScore.innerHTML=0;
    speed=7;
}
});