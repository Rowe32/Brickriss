# BRICKRISS
***
[https://rowe32.github.io/Brickriss/]


## Description

BRICKRISS is a game where the player has to move bricks falling down by pressing the arrow keys left or right. Whenever the bottom row fills up with bricks, the row gets deleted, score is updated and the speed increases. The game ends when 10 bricks are stacked on top of each other.


## MVP

* game has bricks endlessly falling down
* the one brick which is falling currently can be moved left and right
* if bottom row is filled, row is deleted
* 10 bricks stacking ends the game
* increase difficulty via faster falling bricks


## Backlog

* add preload image of slowly falling brick...
* make css & html mobile responsive
* add leaderboard
* add time played inside the score -> to update level not only based on deleted bricks but also on time played
* create different sized bricks and add rotation (and if so update collision js!)
* funk up the animation whenever a row gets deleted


## Data structure

index.js
* preload() {}
* setup() {}
* draw() {}
* Cell () {this.i; this.j; this.show}
* Brick () {this.w; this.h; this.x; this.y; this.image}
    * move() {}
    * draw() {}
    * onGround() {}
    * collidesWith() {}
* newBrick () {}
* collisionCheck() {}
* keyPressed() {}
* deleteFullBaseline() {}
* endingTheGame() {}
* changeBg () {}
* changeText () {}
* offerRestartOption() {}

## States y States Transitions

- splashScreen / gameIntro
- gameScreen / gameBoard
- gameoverScreen / gameOver


## Task

* buildDom
* buildSplashScreen
* buildGameScreen
* buildGameOverScreen
* addEventListener
* buildCanvas
* startLoop
* addFirstBrick
* addMovement
* addArrayFallenBricks
* addCollisionDetection
* addGameover
* addDeletionOfRowIfFilled
* addScore

## Links

### Slides
[https://docs.google.com/presentation/d/1p2frFQXVxyUVN-Lp3YFaEi38n0XIk-oIeZLOnFXgImg/edit?usp=sharing]

## Attribution

Attribution Sound:

* Bricks on Bricks: https://freesound.org/people/thanvannispen/sounds/30006/
* Rubble: https://freesound.org/people/Sheyvan/sounds/569497/
* Squelch: https://freesound.org/people/redafs/sounds/379499/
* Let-me-out-of-here-Cry: https://www.pacdv.com/sounds/voices-2.html
* Videogame-Music: https://www.playonloop.com/2014-music-loops/miracle-park/

Attribution Images & Icons:

* Brickwall Icon https://www.freepik.com/free-icon/brickwall_15529249.htm#query=brick%20wall&position=13&from_view=search (further changed by Renato Costa)
* Walter Ulbrecht: https://commons.wikimedia.org/wiki/File:Opvolger_van_Pieck,_Walter_Ulbricht,_Bestanddeelnr_911-5926.jpg (further changed by Renato Costa)
* Old Brickwall: https://www.freepik.com/free-photo/old-brick-wall-background_6087746.htm#query=brick&position=24&from_view=search 
* Wall of Berlin: https://unsplash.com/photos/oOmqLqq5tio
* Construction Worker Vector: https://www.freepik.com/free-vector/construction-illustration_5275589.htm#query=construction%20worker&position=35&from_view=search
* David Hasselhoff: https://commons.wikimedia.org/wiki/File:David_Hasselhof_at_re-publica_May_2014_(cropped).jpg (further changed by Renato Costa)
