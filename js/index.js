//sound start as false
let soundInGame = false;

//all screens
let gameIntro = document.querySelector(".game-intro");
let gameBoard = document.querySelector(".game-board");
let gameOver = document.querySelector(".game-over");

//Screen Text am Ende
let gameOverText = document.querySelector("#endOfGame");

// ScoreElements
let bricksDeleted = document.querySelector('#bricksDeleted');
let levelReached = document.querySelector("#levelReached");

//buttons
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let soundBtn = document.querySelector("#music-Btn");


//setting up all variables:
let wallWidth, wallHeight;
let brickWidth = 40;
let brickHeight = 20;
let brickImages = [];
let board = [];
let bricks = [];
let lockedBricks = [];
let startSpeed = 1.8;
let brickScore = 0;
let switchStartCell = 120;
let level = 0;

//SOUNDS & MUSIC
let song;
let stoneSound;
let rubbleSound;
let cry;
let squelch;


//load all images & sounds upfront:
function preload() {
    brickImages[0] = loadImage("assets/Brick1-resized.jpg");
    brickImages[1] = loadImage("assets/Brick2-resized.jpg");
    brickImages[2] = loadImage("assets/Brick3-resized.jpg");
    brickImages[3] = loadImage("assets/Brick4-resized.jpg");
    bg = loadImage("assets/GameOver_2.png");
    song = loadSound("sounds/POL-miracle-park-short.mp3");
    stoneSound =loadSound("sounds/stone-on-stone.mp3");
    rubbleSound = loadSound("sounds/Rubble-sound.mp3");
    cry = loadSound("sounds/let-me-out-of-here-1.mp3");
    squelch = loadSound("sounds/Squelch-Sound.mp3");
}

function setup() {
    noLoop();
    let wall = createCanvas(240, 200);
    wall.parent('canvasContainer');

    // Width of Canvas divided by length of bricks = width
    wallWidth = floor(width/brickWidth);
    // height of canvas divided by heigth of bricks = height
    wallHeight = floor(height/brickHeight);

    //init the wall
    for(let j = 0; j < wallHeight; j++) {
        for (let i = 0; i < wallWidth; i++) {
            let cell = new Cell(i,j);
            board.push(cell);
        }
    }
    //init the first "last" Brick
    newBrick(); 
}

function draw() {
    background(142, 126, 108);

    //  Grid on Canvas
    for (let i = 0; i < board.length; i++) {
        board[i].show();
    }

    // Display all Bricks on Canvas:
    bricks.forEach( (brick) => brick.draw() );

    // a new brick starts to fall
    const brick = bricks[bricks.length - 1];
    brick.move();

    // All bricks except the one which is moving
    lockedBricks = bricks.slice(0, bricks.length - 1);
    const collision = brick.collidesWith(lockedBricks);

    // reset height of stones to baseline or check for collision on top of other bricks:
    if ( brick.onGround() || collision.booleanResult ) { 
        if (collision.booleanResult && (brick.x === collision.brick.x)) {
            brick.y = collision.brick.y - brickHeight;  
        } else {
            brick.y = height - brickHeight;
        }

        //Sound for brick on brick:
        if (soundInGame) {
            stoneSound.play();
            stoneSound.setVolume(0.3);
        }
        //create new brick, once the previous one is on Ground or on top of another one:
        newBrick();
    };
    
    //Delete full row:
    deleteFullBaseline();

    // GAME OVER CHECK:
    if (lockedBricks.length > 10 && lockedBricks[lockedBricks.length - 1].y === 0) {
        endingTheGame();
        if (soundInGame) {
            cry.play();
            cry.setVolume(0.3);
        }
    }
}

class Cell {
    constructor (i, j) {
        this.i = i;
        this.j = j;

        this.show = function () {
            let x = this.i*brickWidth;
            let y = this.j*brickHeight;
            stroke(255);
            noFill();
            //creates for Each cell a rectangle
            rect(x, y, brickWidth, brickHeight);
        }; 
    };
}

class Brick {
    constructor(img, switchStartCell) {
        this.w = brickWidth;
        this.h = brickHeight;
        this.x = switchStartCell;
        this.y = 0;
        this.image = img;
    }
    
    move() {
        //move the active brick:
        this.y += startSpeed;
    }
    
    draw() {
        image(this.image, this.x, this.y, this.w, this.h);
    }

    onGround() {
        // Check if brick touches ground:
        const brickBottom = this.y + this.h;
        return brickBottom >= height;
    }
 
    //check for collision with all other bricks:
    collidesWith(bricks) {
        const collidingBrick = bricks.find((otherBricks) => collisionCheck(this, otherBricks));
        return {brick : collidingBrick, booleanResult : !!collidingBrick};
    }
}

function newBrick () {
    //random brick picture
    let randomImg = brickImages[Math.floor(Math.random() * brickImages.length)];

    // switch the start position of brick
    if (switchStartCell === 120) {
        switchStartCell = 80;
    } else {
        switchStartCell = 120;
    }

    bricks.push(new Brick(randomImg, switchStartCell));

    //update Score
    brickScore += 1;
    bricksDeleted.innerText = `Bricks: ${brickScore}`;
}

function collisionCheck(rect1, rect2) {
    return (
        rect1.y < rect2.y + rect2.h && 
        rect1.h + rect1.y > rect2.y && 
        rect1.x < rect2.x + rect2.w && 
        rect1.x + rect1.w > rect2.x
    );
}

function keyPressed() {
    // moving the brick without moving it off canvas:
    const brick = bricks[bricks.length - 1];

    // check for collision while moving the brick left or right
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

function deleteFullBaseline() {
    //check if baseline row is filling up:
    let bricksOnBaseline = 0;
    lockedBricks.forEach( brick => {
        if (brick.y + brickHeight === 200) bricksOnBaseline++;
        console.log(bricksOnBaseline);
    });
    
    //if row is full - delete:
    if (bricksOnBaseline === wallWidth) {
        bricks = bricks.filter( brick => brick.y !== 180);
        bricks.slice(0, bricks.length - 1).forEach(remainingBrick => remainingBrick.y += brickHeight);
        
        // rubble sound:
        if (soundInGame) {
            rubbleSound.play();
        }

        //update level Score:
        level += 0.5;
        if (Number.isInteger(level)) {
            levelReached.innerText = `Level: ${level}`;
        }

        //for each deleted row, increase speed gradually;
        startSpeed += 0.25;
    } 
}

function endingTheGame() {
    gameIntro.style.display = "none";
    gameBoard.style.display = "none";
    gameOver.style.display = "flex";
    gameOverText.style.visibility = "hidden";
    restartBtn.style.visibility = "hidden";

    noLoop();

    bricks = [];
    startSpeed = 1.8;
    brickScore = 0;
    level = 0;
    bricksDeleted.innerText = `Bricks: ${brickScore}`;
    levelReached.innerText = `Level: ${level}`;

    //stop the music:
    if (soundInGame) {
        song.stop();
    }

    //display text a bit later:
    setTimeout(changeBg, 1000);
    setTimeout(changeText, 1500);
    setTimeout(offerRestartOption, 4600);
}

//Change Background img & add gameover Sound
function changeBg () {
    gameOver.style.backgroundImage = "url('assets/GameOver_2.png')";
    if (soundInGame) {
        squelch.play();
        squelch.setVolume(0.3);
    }
}

function changeText () {
    gameOverText.style.visibility='visible';
}

function offerRestartOption() {
    gameOver.style.backgroundImage = "url('assets/GameOver_3.jpg')";
    restartBtn.style.visibility = "visible";
}

//loading the window and showing the first screen:
window.addEventListener("load", () => {
    gameBoard.style.display = "none";
    gameOver.style.display = "none";
  
    //listener on START button to hide first screen and show canvas
    startBtn.addEventListener("click", () => {
        gameIntro.style.display = "none";
        gameBoard.style.display = "flex";
        gameOver.style.display = "none";
        loop();
    });
  
    //listener on sound button to toggle sound on or off during game:
    soundBtn.addEventListener('click', function() {
        if(soundBtn.classList.contains("stop")) {
            soundBtn.className = "start";
            soundBtn.innerHTML = '<img src="assets/outline_volume_up_black_24dp.png" alt="symbol vol on">';
            soundInGame = true;
            song.loop(); 
            song.setVolume(0.1);
        } else {
            soundBtn.className = "stop";
            soundBtn.innerHTML = '<img src="assets/outline_volume_off_black_24dp.png" alt="symbol vol off">';
            soundInGame = false;
            song.stop();
        }
    });

    //listener on restart button to hide GAME OVER screen and show canvas again
    restartBtn.addEventListener("click", () => {
        gameIntro.style.display = "none";
        gameBoard.style.display = "flex";
        gameOver.style.display = "none";
        
        if (soundInGame) {
            song.loop(); 
            song.setVolume(0.1);
        }
        newBrick();
        loop(); 
    });
});
