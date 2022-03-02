//gameover starts as false
let gameIsOver = false;

//all screens
let gameIntro = document.querySelector(".game-intro");
let gameBoard = document.querySelector(".game-board");
let gameOver = document.querySelector(".game-over");

//buttons
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");
let gameOverBtn = document.querySelector("#gameover-btn");       // nur zumTest

//setting up all variables:
let wallWidth, wallHeight;
let brickWidth = 40;
let brickHeight = 20;
let brickImg1, brickImg2, brickImg3, brickImg4;

let board = [];             // nötig am Ende?
let bricks = [];
let lockedBricks = [];
let startVelocity = 50;  //frameRate -> to increase later on


//load all images upfront:
function preload() {
    brickImg1 = loadImage("/assets/Brick1-resized.jpg");
    brickImg2 = loadImage("/assets/Brick2-resized.jpg");
    brickImg3 = loadImage("/assets/Brick3-resized.jpg");
    brickImg4 = loadImage("/assets/Brick4-resized.jpg");
}

function setup() {
    noLoop(); 
    frameRate(startVelocity);  //nach Zeit oder gelöschten Reihen oder ANzahl Steine insgesamt...steigt Tempo...!
    let wall = createCanvas(320, 200);
    //wall.position(300, 159, 'fixed');  fix canvas inside gap, aber nicht responsive..ändert sich mit größe browser
    //https://p5js.org/reference/#/p5.Element/position
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
    //init the first "last" Brick inside Brick array
    bricks.push(new Brick(brickImg1));                          //same as = newBrick ()??
}

function draw() {
    background(142, 126, 108);                          // if empty, background(), Canvas is transparent!!!, dann nur den Rand zeigen with stroke and strokeweight...
    //for-loop to see the board - NOT necessary -> delete in the end!!
    for (let i = 0; i < board.length; i++) {
        board[i].show();                            
    }

    //Display all Bricks on Canvas:
    bricks.forEach( (brick) => brick.draw() );

    //a new brick starts to fall, once the previous one is on Ground or on top of another one:
    const brick = bricks[bricks.length - 1];
    brick.move();

    lockedBricks = bricks.slice(0, bricks.length - 1); //wird in jedem Drasloop geupdated
    const collision = brick.collidesWith(lockedBricks);
    if ( brick.onGround() || collision.booleanResult ) { 
        if (collision.booleanResult && (brick.x === collision.brick.x)) {
            brick.y = collision.brick.y - brickHeight;       
        }
        //create new brick at the end of array:
        newBrick();
    };
       
    deleteFullBaseline();

    if (lockedBricks.length > 10 && lockedBricks[lockedBricks.length - 1].y === 0) {
        endingTheGame(); // oder gameIsOver = true;
    }
   
    // dann am ende nochmal check: // brauch ich das?? brauch ich gameIs true??:::
    if (gameIsOver) {
        endingTheGame();
    };
}

function deleteFullBaseline() {
    //ab hier eine function, die selbstständig stehen kann:
    //check for baseline row filled: (Game is for now constructed in a way that only the bottom can be filled)
    let bricksOnBaseline = 0;
    lockedBricks.forEach( brick => {
        if (brick.y === 180) bricksOnBaseline++;
    });
    //es muss auch bricks geändert werden weil diese gezeigt werden, siehe oben
    //Take out all of these bricks out of bricks array and --> automatically also lockedbricks.array:
    //ich darf nicht letzten stein aus bricks nehmen,,,,!!! aber beide arrays ändern??
    //Workaround: bricks = last one of bricks und geänderterfallenbricks?
    if (bricksOnBaseline === 8) {
        bricks = bricks.filter( brick => brick.y !== 180);
        
        bricks.slice(0, bricks.length - 1).forEach(remainingBrick => remainingBrick.y += brickHeight); // gibt nichts zurück!!!

        // später hier noch SOUND einfügen: "FREEDOM" & the hoff erscheint (< 3 sec snippit)?? oder aufleuchten...
    } 
}


function newBrick () {
    let imageArray = [brickImg1, brickImg2, brickImg3, brickImg4];
    let randomImg = imageArray[Math.floor(Math.random() * imageArray.length)];
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
        this.x = 200;                                                      //at beginning -> randomize later on!
        this.y = 0;                           
        this.image = img;

        //later I can add velocity!!!( nimmt nach 2 min zu....oder nach soundsoviel gefallenen steinen
        // if bricks.length > 20...> 40 > 60...wird alle 20 steine immer schneller)
        // wenn Tasten gedrückt halten auch schneller hin und her bewegen???
    }

    
    move() {
        //to be able to call movement only for the active brick:
        this.y += 1;     
    }
    
    draw() {        
        image(this.image, this.x, this.y, this.w, this.h);   //this should happens for all bricks
    }

    onGround() {
        // Check if brick touches the ground:
        const brickBottom = this.y + this.h;
        return brickBottom >= height;
    }
 

    //check for collision with all other fallen bricks:
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
        loop();
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
        // and start the draw() loop from p5
        loop();
    });

    //just a button to simulate that the game is over
    gameOverBtn.addEventListener("click", () => {
        gameIsOver = true;
    });
})
