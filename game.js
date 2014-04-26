//LD28 by Krzysztof 'RocketDuke' Myjak
//13->14.12.2013 r.
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

document.onkeydown = keydown;
document.onkeyup = keyup;

function keydown(event){
    if(event.keyCode === 38)ARR_UP = true;
    if(event.keyCode === 40)ARR_DOWN = true;
    if(event.keyCode === 49)KEY_ONE = true;
    if(event.keyCode === 50)KEY_TWO = true;
    if(event.keyCode === 51)KEY_THRE = true;
    
    //console.log(event.keyCode);
}
function keyup(event){
    if(event.keyCode === 38)ARR_UP = false;
    if(event.keyCode === 40)ARR_DOWN = false;
    if(event.keyCode === 49)KEY_ONE = false;
    if(event.keyCode === 50)KEY_TWO = false;
    if(event.keyCode === 51)KEY_THRE = false;
    //console.log(event.keyCode);
}

var ARR_UP = false;
var ARR_DOWN = false;
var KEY_ONE = false;
var KEY_TWO = false;
var KEY_THRE = false;
var GAMESTATE = 1;
var PLANET_HP = 20;
var PLAYER = new PlayerObject('img',200,100,20,80);
var TIMER = new Time();
var ENEMY_ARRAY = new Array;
var ANIM_ARRAY = new Array;
//Sounds
var EXPLOSION_SOUND = new Audio('explosion_1.wav');
var PLAYER_SOUND = new Audio('explosion_2.wav');

function PlayerObject(color,x,y,w,h){
    this.COLOR = color;
    this.X = x;
    this.Y = y;
    this.W = w;
    this.H = h;
    this.SPEED = 5;
    
    this.Draw = function(){
        ctx.fillStyle="#FFFFFF";
        //ctx.fillStyle = this.COLOR;
        ctx.fillRect(this.X,this.Y,this.W,this.H);
    }
}

function Enemy(x,y){
    this.X = x;
    this.Y = y;
    this.W = 20;
    this.H = 20;
    this.ANIM = 60;
    this.SPEED = 2;
    
    this.Draw = function(){
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect(this.X,this.Y,this.W,this.H);
    }
}


function gameplay(){
    //PLAYERMOVEMENT
    if(ARR_UP&&PLAYER.Y>PLAYER.SPEED+5)PLAYER.Y-=PLAYER.SPEED;
    if(ARR_DOWN&&PLAYER.Y+PLAYER.H+PLAYER.SPEED<canvas.height-5)PLAYER.Y+=PLAYER.SPEED;
    //Enemy AddSpawn
    if(Math.floor((Math.random()*60)+1)==5){ENEMY_ARRAY.push(new Enemy(canvas.width+20,Math.floor((Math.random()*(canvas.height-200)+100))))
                                       
        }
    
    //ENEMY BEHAVIOR
    for(var i=1; i<ENEMY_ARRAY.length;i++){
        if(ENEMY_ARRAY[i].X<PLAYER.X+PLAYER.W&&ENEMY_ARRAY[i].X>PLAYER.X){
            if(ENEMY_ARRAY[i].Y+ENEMY_ARRAY[i].H>PLAYER.Y&&ENEMY_ARRAY[i].Y<PLAYER.Y+PLAYER.H){
                PLAYER_SOUND.play();
                ENEMY_ARRAY.splice(i,1);
            }
        }    
        if(ENEMY_ARRAY[i].X<Math.floor((Math.random()*30)+2)){
            PLANET_HP--;
            //console.log(PLANET_HP);
            //ADD BLOW WHILE ENEMY HITS PLANET!!
            EXPLOSION_SOUND.play();
            ANIM_ARRAY.push(ENEMY_ARRAY[i]);
            ENEMY_ARRAY.splice(i,1);
            
        }
    }
    
   if(PLANET_HP<1){
       GAMESTATE = 4;
   }
    if(TIMER.displayTime<1){
        GAMESTATE = 3;
    }
    //Animation array
    if(ANIM_ARRAY.length>0){
    for(var i=0;i<ANIM_ARRAY.length;i++){
        if(ANIM_ARRAY[i].ANIM>0){
            //Display ANim
            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.arc(ANIM_ARRAY[i].X,ANIM_ARRAY[i].Y,20,0,2*Math.PI);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ANIM_ARRAY[i].ANIM--;
        }else{
            //destroy
            ANIM_ARRAY.splice(i,1);
        }
    }
}
}//gameplay ends here
function Time(){
    this.startTime = 0;
    this.displayTime;
    this.Start = function(){
        var d = new Date();
        this.startTime = d.getTime();
    }
    this.Draw = function(){
        var d = new Date();
        var n = d.getTime();
        this.displayTime = Math.floor((60000-(n-this.startTime))/1000);
        //console.log(this.displayTime);
        ctx.strokeStyle="#FFFFFF";
        ctx.textAlign = 'center';
        ctx.font="25px Arial";
        ctx.strokeText('Seconds Left: '+this.displayTime+'   Planet HP: '+PLANET_HP,canvas.width/2,(canvas.height/2)-200);    
    }
    this.Reset = function(){
        this.startTime = 0;
    }
}

function menu(){
    TIMER.Reset();
    PLANET_HP = 20;
    ENEMY_ARRAY = new Array;
    ANIM_ARRAY = new Array;
        
    
    if(GAMESTATE==1){
        menuScreen();
    }
    if(GAMESTATE==2){
        helpScreen();
    }
    if(GAMESTATE==3){
        wonScreen();
    }
    if(GAMESTATE==4){
        gameoverScreen();
    }
    
}
function menuScreen(){
    if(KEY_ONE){
        GAMESTATE = 0;
        TIMER.Start();
    }
    if(KEY_TWO)GAMESTATE = 2;
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#FFFFFF";
    ctx.textAlign = 'center';
    ctx.font="50px Arial";
    ctx.strokeText('ONE MINUTE LEFT',canvas.width/2,canvas.height/2);
    ctx.font="30px Arial";
    ctx.strokeText('Press "1" to start',canvas.width/2,(canvas.height/2)+60);
    ctx.strokeText('...Good Luck...',canvas.width/2,(canvas.height/2)+100);
    ctx.font="25px Arial";
    ctx.strokeText('Need some help? Press "2"',canvas.width/2,(canvas.height/2)+200);
    ctx.fillStyle="#FFFFFF ";
    ctx.font="20px Arial";
    ctx.fillText('Made by Krzysztof "RocketDuke" Myjak For LD28',canvas.width/2,(canvas.height/2)-200);        
}

function helpScreen(){
    if(KEY_THRE)GAMESTATE = 1;
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#FFFFFF";
    ctx.textAlign = 'center';
    ctx.font="30px Arial";
    ctx.strokeText('Why?',canvas.width/2,(canvas.height/2)-200);
    ctx.strokeText('Towards your planet is flying',canvas.width/2,(canvas.height/2)-140);
    ctx.strokeText('minute long asteroid wave.',canvas.width/2,(canvas.height/2)-80);
    ctx.strokeText('You are the only one who can defend it!',canvas.width/2,(canvas.height/2)-20);
    ctx.strokeText('How?',canvas.width/2,(canvas.height/2)+50);
    ctx.strokeText('Use Up/Down Arrows to move shield.',canvas.width/2,(canvas.height/2)+100);
    ctx.strokeText('Press "3" to get back to menu',canvas.width/2,(canvas.height/2)+140);
    ctx.strokeText('...Its only one minute... i hope..',canvas.width/2,(canvas.height/2)+200);
}

function gameoverScreen(){    
    if(KEY_THRE)GAMESTATE = 1;
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#FFFFFF";
    ctx.textAlign = 'center';
    ctx.font="30px Arial";
    ctx.strokeText('Your Planet has been destroyed..',canvas.width/2,(canvas.height/2));
    ctx.strokeText('Press "3" to get back to menu',canvas.width/2,(canvas.height/2)+40);
    }
function wonScreen(){
    if(KEY_THRE)GAMESTATE = 1;
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#FFFFFF";
    ctx.textAlign = 'center';
    ctx.font="30px Arial";
    ctx.strokeText('YOU WON..or smth',canvas.width/2,(canvas.height/2));
    ctx.strokeText('Press "3" to get back to menu',canvas.width/2,(canvas.height/2)+40);
}

     

function main(){
    if(GAMESTATE==0){
        ctx.fillStyle="#000000";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        //Drawing planet
        ctx.strokeStyle="#FFFFFF";
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.arc(-180,canvas.height/2,canvas.height/2,1.5*Math.PI,0.5*Math.PI,false);
        ctx.stroke();
        ctx.lineWidth = 1;
        //
        gameplay();
        PLAYER.Draw();
        TIMER.Draw();
        for(var i=1;i<ENEMY_ARRAY.length;i++){
            ENEMY_ARRAY[i].X-=ENEMY_ARRAY[i].SPEED;
            ENEMY_ARRAY[i].Draw();
        }
    }else{
        menu();
        }   
    }

setInterval(main,1000/60);
    