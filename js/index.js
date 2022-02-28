//gameover starts as false
let gameIsOver = false;

//all screens
let gameIntro = document.querySelector(".game-intro");
let gameBoard = document.querySelector(".game-board");
let gameOver = document.querySelector(".game-over");

//buttons
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let gameOverBtn = document.querySelector("#gameover-btn");                      // nur zumTest

//setting up all variables:
let wallWidth;
let wallHeight;
let brickWidth = 40;
let brickHeight = 20;
let brick;
let board = [];
let bricks = [];
let startVelocity = 20;                                                     //frameRate -> increase later on

//load all images upfront:
function preload() {
    brickImg = loadImage("/assets/Brick1.jpg");                             //later: random ARRAY of pictures?
}


function setup() {  
    frameRate(startVelocity);  
    let wall = createCanvas(400, 200);
    //wall.position(300, 159, 'fixed');   // fix canvas inside gap, aber nicht responsive..ändert sich mit größe browser
    //https://p5js.org/reference/#/p5.Element/position
    wall.parent('canvasContainer');

    // Width of Canvas divided by length of bricks = width
    wallWidth = floor(width/brickWidth);
    // height of canvas divided by heigth of bricks = height
    wallHeight = floor(height/brickHeight);

    //init the wall ->                                    BRAUCHT tuviel ZEIT _ MIT SYNCHRONIZE....brauche ich grid mit cells am ende???
    for(let j = 0; j < wallHeight; j++) {
        for (let i = 0; i < wallWidth; i++) {
            let cell = new Cell(i,j);
            board.push(cell); //array of all cells
            // bspw.->  0: Cell {i: 0, j:0, show: f}
            // 100 cells in total...bei der canvas größe 400, 200!
        }
    }

    //init the first "last" Brick
    bricks.push(new Brick(brickImg));
}

function draw() {
    background(142, 126, 108);                          // if empty,background(), Canvas is transparent!!!
    //for-loop to see the board - NOT necessary -> delete in the end!!
    for (let i = 0; i < board.length; i++) {
        board[i].show();                            
    }

    //all bricks inside the bricks array need to be displayed on canvas:
    bricks.forEach((brick)=> {
        brick.draw();
    });

    const brick = bricks[bricks.length - 1];
    if (brick.onGround() || brick.collidesWith(bricks)) {
        //create new brick at the end of array:
        bricks.push(new Brick(brickImg));
        //                                                          hier vllt randomisierte Bilder einbauen...??
    };


    // check for gameover if....-> gameIsOver = true;
    // der letzte stein oben aufliegt/ankommt...zuende!

    // dann am ende nochmal check:
    if (gameIsOver) {
        endingTheGame();
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
        this.x = 200;                                                      //at beginning -> randomize later on!
        this.y = 0;                           
        this.image = img;

        //later I can add velocity!!!( nimmt nach 2 min zu....oder nach soundsoviel gefallenen steinen
        // if bricks.length > 20...> 40 > 60...wird alle 20 steine immer schneller)
        // wenn Tasten gedrückt halten auch schneller hin und her bewegen???
    }

    draw() {
        this.y += 1;                                                 // oder doch nur brickHeight Schritte machen?
        if (this.onGround())  {
            this.y = height - brickHeight;
        } else if (this.collidesWith(bricks)) {
            this.y -= brickHeight;
        }
        //only if this.y is above ground or above other bricks this brick gets displayed on canvas           
        image(this.image, this.x, this.y, this.w, this.h);   
    }

    onGround() {
        // Check if brick touches the ground:
        const brickBottom = this.y + this.h;
        return brickBottom >= height;
    }
 
    collidesWith(bricks) {
        //check for collision with all other bricks:
        //Rico : .find returns either the found element or undefined, we need to do a boolean conversion with (!!)
        return !!bricks.find((otherBricks) => collision(otherBricks, this));
    }
}

function collision(rect1, rect2) {
    // AABB - axis aligned bounding box collision for non-rotated rectangles:
    return (
        rect1.x < rect2.x + rect2.w && 
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y
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


// function increaseVelocity() {

// }

function endingTheGame() {
    gameIntro.style.display = "none";
    gameBoard.style.display = "none";
    gameOver.style.display = "flex";
    // stop the draw loop that is running all the time
    noLoop();    
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
    });
  
    //listener on the RE-START button to hide the GAME OVER screen and show the game canvas
    restartBtn.addEventListener("click", () => {
        gameIntro.style.display = "none";
        gameBoard.style.display = "flex";
        gameOver.style.display = "none";
        gameIsOver = false;
    
        // reset the game state to start from fresh again               // ggf. auch Geschwindigkeit zurück setzen
        let bricks = [];
        bricks.push(new Brick(brickImg));
        // and start the draw() loop from p5
        loop();
    });

    //just a button to simulate that the game is over
    gameOverBtn.addEventListener("click", () => {
        gameIsOver = true;
    });
})
