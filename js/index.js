//gameover starts as false
let gameIsOver = false;

//all screens
let gameIntro = document.querySelector(".game-intro");
let gameBoard = document.querySelector(".game-board");
let gameOver = document.querySelector(".game-over");

//buttons
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let gameOverBtn = document.querySelector("#gameover-btn");  //nur zumTest

//setting up all variables:
let wallWidth;
let wallHeight;
let brickWidth = 40;
let brickHeight = 20;
let brick;
let board = [];
let bricks = [];
let startVelocity = 20; //FramRate

//load all images upfront:
function preload() {
    brickImg = loadImage("/assets/Brick1.jpg"); //later: random array of pictures
 }

// Wall Canvas:
function setup() {  
    frameRate(startVelocity);  
    let wall = createCanvas(400,200);
    wall.parent('canvasContainer');
    // Width of Canvas divided by length of bricks = width
    wallWidth = floor(width/brickWidth);
    // height of canvas divided by heigth of bricks = height
    wallHeight = floor(height/brickHeight);

    //init the wall BRAUCHT ZEIT _ HIER MIT SYNCHRONIZE ARBEITEN:::!!!! Dauert zu lange....
    for(let j = 0; j < wallHeight; j++) {
        for (let i = 0; i < wallWidth; i++) {
            let cell = new Cell(i,j);
            board.push(cell); //array of all cells
            // bspw.->  0: Cell {i: 0, j:0, show: f}
            // 100 cells in total...
        }
    }

    //init the bricks
    bricks.push(new Brick(brickImg));
}

function draw() {
    background(142, 126, 108);
     //to see the board - not necessary in the end!!! (transparent background maybe instead of colour?)
    for (let i = 0; i < board.length; i++) {
        board[i].show();                            
    }

    //all bricks already passed to the bricks array need to be drawn
    bricks.forEach((brick)=> {
        brick.draw();
        //brick.update();
    });

    const brick = bricks[bricks.length - 1];
    if (brick.onGround()) {                         //HIER ZWEITER CHECK//oder brick on other brick
        //pass it to the array of all bricks
        bricks.push(new Brick(brickImg)); //to create new one at the end of array
        //hier vllt randomisierte Bilder einbauen...
    };
}

function keyPressed() {
    // moving brick without moving it offboard:
    const brick = bricks[bricks.length - 1]; //always last element of array (hence, the active brick!)

    //Left Arrow
    if (keyCode === 37) {
        if (brick.x > 0) {
            brick.x -= brickWidth;
        }
    }

    // Right Arrow
    if (keyCode === 39) {
        if (brick.x < width - brickWidth) {
            brick.x += brickWidth;
        }
    }
}

class Brick {
    constructor(img) {
        this.w = brickWidth;
        this.h = brickHeight;
        this.x = 200;                        //at beginning -> randomize later on!
        this.y = 0;                           
        this.image = img;
        //later I can add velocity!!!
        // geschwindigkeit ( nimmt nach 2 min zu....oder nach soundsoviel gefallenen steinen
        // wenn gedrückt halten auch schneller hin und her bewegeb???
    }

    draw() {
        this.y += 1;                //  alternativley: move it down inside the update function
        if (this.onGround())  {         //hier ebenfalls zweiter check!
            this.y = height - brickHeight;
        }
        //only if this.y is above ground this gets picutred on canvas           
        image(this.image, this.x, this.y, this.w, this.h);   
    }

    // update() {
    //     //const every300Frames = frameCount % (60 * 5) === 0;
    // }

    onGround() {
        // Check if brick touches the ground:
        const brickBottom = this.y + this.h;
        return brickBottom >= height
    }
 
    collidesWith() { //mit anderem brick...


         //.find returns either found element or undefined, to do a boolean conversion::
         // return !!bricks.array.find((brick)=> collision(ground, bricks));


    }

// function collision(brick1, brick2) {
//     it's the idea of an AABB - axis aligned bounding box collision for non-rotated rectangles
//   return (
//     rect1.x < rect2.x + rect2.w &&
//     rect1.x + rect1.w > rect2.x &&
//     rect1.y < rect2.y + rect2.h &&
//     rect1.h + rect1.y > rect2.y
//   );
// }


}

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


// function increaseVelocity() {

// }

/* function toggleGameOver() {          //siehe Spiel von Joshua
    // stop the draw loop
    noLoop();
  
    // change the CSS so that the game over screen shows and the board hides
    const gameOverElement = document.querySelector(".game-over");
    gameOverElement.style.display = "flex";
    const gameBoardElement = document.getElementById("game-board");
    gameBoardElement.style.display = "none";
    // also update the game score element on the game over screen with the final score
    const scoreElement = document.querySelector(".game-over span");
    scoreElement.innerText = obstacles.score;
  
    // reset the game state to start from fresh again
    car = new Car(img);
    obstacles = new Obstacles();
  }
 */

//loading the window and showing the first screen and hiding the other two to start
window.addEventListener("load", () => {
    gameBoard.style.display = "none";
    gameOver.style.display = "none";
  
    //listener on the START button to hide the first screen and show the game canvas
    startBtn.addEventListener("click", () => {
        gameIntro.style.display = "none";
        gameBoard.style.display = "flex";
        gameOver.style.display = "none";
    });
  
    //listener on the RE-START button to hide the GAME OVER screen and show the game canvas
    restartBtn.addEventListener("click", () => {
        gameIntro.style.display = "none";
        gameBoard.style.display = "flex";
        gameOver.style.display = "none";
        gameIsOver = false;
    
        //loop is used to start the game again after the gameover screen stops it

        
        /* objectArray = [
        { x: sharkX, y: sharkY },
        { x: sharkX + 800, y: sharkY + 200 },
        { x: sharkX + 1400, y: sharkY + 400 },
        ];
        loop(); */
    });

    //just a button to simulate that the game is over
  /*   gameOverBtn.addEventListener("click", () => {
        gameIsOver = true;

        //hide p5js
    }); */
})
