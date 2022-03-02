//gameover & sound start as false
let gameIsOver = false;                         //brauch ich das am Ende?
let soundInGame = false;

//all screens
let gameIntro = document.querySelector(".game-intro");
let gameBoard = document.querySelector(".game-board");
let gameOver = document.querySelector(".game-over");
//Screen Text am Ende
let gameOverText = document.querySelector("#endOfGame")

//buttons
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let gameOverBtn = document.querySelector("#gameover-btn");       // nur zumTest
let soundBtn = document.querySelector("#music-Btn");

//setting up all variables:
let wallWidth, wallHeight;
let brickWidth = 40;
let brickHeight = 20;
let brickImages = [];

let board = [];             // nötig am Ende?
let bricks = [];
let lockedBricks = [];
let startSpeed = 1.5;  //frameRate -> to increase later on

//SOUNDS & Music
let song;
let stoneSound;
let rubbleSound;
let cry;
let squelch;


//load all images & sounds upfront:
function preload() {
    brickImages[0] = loadImage("/assets/Brick1-resized.jpg");
    brickImages[1] = loadImage("/assets/Brick2-resized.jpg");
    brickImages[2] = loadImage("/assets/Brick3-resized.jpg");
    brickImages[3] = loadImage("/assets/Brick4-resized.jpg");
    bg = loadImage("/assets/GameOver_2.png");
    song = loadSound("/sounds/POL-miracle-park-short.mp3");
    stoneSound =loadSound("/sounds/stone-on-stone.mp3");
    rubbleSound = loadSound("/sounds/Rubble-sound.mp3");
    cry = loadSound("/sounds/let-me-out-of-here-1.mp3");
    squelch = loadSound("/sounds/Squelch-Sound.mp3");
}

function setup() {
    noLoop();
    let wall = createCanvas(240, 200);
    //wall.position(300, 159, 'fixed');  fix canvas inside gap, aber nicht responsive..ändert sich mit größe browser
    wall.parent('canvasContainer');

    // Width of Canvas divided by length of bricks = width
    wallWidth = floor(width/brickWidth);
    // height of canvas divided by heigth of bricks = height
    wallHeight = floor(height/brickHeight);

    //init the wall ->                                    ....brauche ich grid mit cells am ende???
    for(let j = 0; j < wallHeight; j++) {
        for (let i = 0; i < wallWidth; i++) {
            let cell = new Cell(i,j);
            board.push(cell); 
            // //array of all cells ->  0: Cell {i: 0, j:0, show: f}
            
        }
    }
    
    //init the first "last" Brick
    newBrick();                          
}

function draw() {
    background(142, 126, 108);                              // FARBE ÄNDERN

    //for-loop to see the board - NOT necessary -> delete in the end!!
    //  RASTER
    for (let i = 0; i < board.length; i++) {
        board[i].show();                            
    }

    //Display all Bricks on Canvas:
    bricks.forEach( (brick) => brick.draw() );

    //a new brick starts to fall, once the previous one is on Ground or on top of another one:
    const brick = bricks[bricks.length - 1];
    brick.move();

    lockedBricks = bricks.slice(0, bricks.length - 1); //wird in jedem Drawloop geupdated
    const collision = brick.collidesWith(lockedBricks);

    if ( brick.onGround() || collision.booleanResult ) { 
        if (collision.booleanResult && (brick.x === collision.brick.x)) {
            brick.y = collision.brick.y - brickHeight;       
        } else {                            // same as brick.onGround()
            brick.y = height - brickHeight;
        }
        if (soundInGame) {
            stoneSound.play();
            stoneSound.setVolume(0.3);
        }
        
        //create new brick at the end of array:
        newBrick();
    };
       
    deleteFullBaseline();

    // GAME OVER CHECK:
    if (lockedBricks.length > 10 && lockedBricks[lockedBricks.length - 1].y === 0) {
        endingTheGame(); // oder gameIsOver = true;
        if (soundInGame) {
            cry.play();
            cry.setVolume(0.3);
        }
    }
   
    // dann am ende nochmal check: // brauch ich das?? brauch ich gameIs true??:::
    if (gameIsOver) {
        endingTheGame();
        
    };
}

function deleteFullBaseline() {
    //check for baseline row filled: (Game is for now constructed in a way that only the bottom can be filled)
    let bricksOnBaseline = 0;
    lockedBricks.forEach( brick => {
        if (brick.y + brickHeight === 200) bricksOnBaseline++;
        console.log(bricksOnBaseline);
    });
    
    if (bricksOnBaseline === wallWidth) {
        bricks = bricks.filter( brick => brick.y !== 180);
        
        bricks.slice(0, bricks.length - 1).forEach(remainingBrick => remainingBrick.y += brickHeight); // forEach gibt nichts zurück!!!
        //Höhe falsch - order andersrum
        if (soundInGame) {
            rubbleSound.play();  // + the hoff erscheint oder aufleuchten der reihe...
        }
        startSpeed += 0.2;
        bricksOnBaseline = 0;
    } 
}


function newBrick () {
    let randomImg = brickImages[Math.floor(Math.random() * brickImages.length)];
    bricks.push(new Brick(randomImg));                                              // oder lenkt das zu sehr ab?!
}

function keyPressed() {
    // moving brick without moving it off canvas:
    const brick = bricks[bricks.length - 1]; //always last element of array (hence, the active brick!)

    // check for collision with other bricks left or right:
    
    //Left Arrow
    if (keyCode === 37) {
        if ((brick.x > 0)) {
            brick.x -= brickWidth;
            const possibleCollisionAfterMovingLeft = brick.collidesWith(lockedBricks);
            if (possibleCollisionAfterMovingLeft.booleanResult) {
                brick.x += brickWidth;
            };
        };
    }

    // Right Arrow
    if (keyCode === 39) {
        if (brick.x < width - brickWidth) { 
            brick.x += brickWidth;
            const possibleCollisionAfterMovingRight = brick.collidesWith(lockedBricks);
            if (possibleCollisionAfterMovingRight.booleanResult) {
                brick.x -= brickWidth;
            };
        };
    };
}

class Brick {
    constructor(img) {
        this.w = brickWidth;
        this.h = brickHeight;
        this.x = 120;                  //Mitte at beginning -> randomize later on!
        this.y = 0;                           
        this.image = img;
    }
    
    move() {
        //to be able to call movement only for the active brick:
        this.y += startSpeed;     
    }
    
    draw() {        
        image(this.image, this.x, this.y, this.w, this.h);
    }

    onGround() {
        // Check if brick touches the ground:
        const brickBottom = this.y + this.h;
        return brickBottom >= height;
    }
 
    //check for collision with all other bricks:
    collidesWith(bricks) {
        const collidingBrick = bricks.find((otherBricks) => collisionCheck(this, otherBricks));
        return {brick : collidingBrick, booleanResult : !!collidingBrick};
    }
}

function collisionCheck(rect1, rect2) {
    return (
        rect1.y < rect2.y + rect2.h && 
        rect1.h + rect1.y > rect2.y && 
        rect1.x < rect2.x + rect2.w && 
        rect1.x + rect1.w > rect2.x
    );
}

//brauch ich das am Ende??
class Cell {
    constructor (i, j) {
        this.i = i;
        this.j = j;

        this.show = function () {
            let x = this.i*brickWidth; //x-koordinate for this cell
            let y = this.j*brickHeight;
            stroke(255);
            noFill();
            rect(x, y, brickWidth, brickHeight); //for Each cell a rectangle
        }; 
    };
}


function endingTheGame() {
    gameIntro.style.display = "none";
    gameBoard.style.display = "none";
    gameOver.style.display = "flex";
    
    gameOverText.style.visibility='hidden';
    noLoop();
    if (soundInGame) {
        song.stop();
    }

    setTimeout(changeBg, 1000);
    setTimeout(changeText, 1500);
    // +++ the HOFF

}

function changeBg () {
    gameOver.style.backgroundImage = "url('/assets/GameOver_2.png')";
    if (soundInGame) {
        squelch.play();
        squelch.setVolume(0.3);
    }
}
function changeText () {
    gameOverText.style.visibility='visible';
}

//loading the window and showing the first screen and hiding the other two to start
window.addEventListener("load", () => {
    gameBoard.style.display = "none";
    gameOver.style.display = "none";
  
    //listener on the START button to hide the first screen and show the game canvas
    startBtn.addEventListener("click", () => {
        gameIntro.style.display = "none";
        gameBoard.style.display = "flex";
        gameOver.style.display = "none";
        loop();
    });
  
    soundBtn.addEventListener('click', function() {
        if(soundBtn.classList.contains("stop")) {
            soundBtn.className = "start";
            soundBtn.innerHTML = '<img src="/assets/outline_volume_up_black_24dp.png" alt="symbol vol on">';
            soundInGame = true;
            song.loop(); 
            song.setVolume(0.1);
        } else {
            soundBtn.className = "stop";
            soundBtn.innerHTML = '<img src="/assets/outline_volume_off_black_24dp.png" alt="symbol vol off">';
            soundInGame = false;
            song.stop();
        }
    });

    //listener on the RE-START button to hide the GAME OVER screen and show the game canvas
    restartBtn.addEventListener("click", () => {
        gameIntro.style.display = "none";
        gameBoard.style.display = "flex";
        gameOver.style.display = "none";
        gameIsOver = false;
    
        // reset the game state to start from fresh again   and all important variables.           // ggf. auch Geschwindigkeit zurück setzen
        bricks = [];
        newBrick();
        startSpeed = 1.5;
        loop();
    });

    //just a button to simulate that the game is over
    gameOverBtn.addEventListener("click", () => {
        gameIsOver = true;
    });
})
