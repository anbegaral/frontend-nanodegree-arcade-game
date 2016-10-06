/*
 * Enemies our player must avoid
*/
var Enemy = function(height) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101; //101 is the width of the png
    this.y = 132 + height; // the height is given to match on the path
    this.jumpX = Math.random() * 200; // a random number for the speed

    //values to calculate the collisions
    this.width = 90;
    this.height = 75;
};

/*
 * Update the enemy's position, required method for game
 * @param dt, a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.jumpX * dt;
    //return the enemy to the start point
    if(this.x > ctx.canvas.width){
        this.x = -101;
    }
};

/*
 * Draw the enemy on the screen, required method for game
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * Player object
 * @param {string} character create the player with the selected picture
*/
var Player = function(character){
    this.sprite = character;
    this.x = 205;
    this.y = 460;
    this.width = 90;
    this.height = 85;
    this.jumpX = 100;
    this.jumpY = 83;
};

/*
 * Manages the cases that the player collides against the enemies and the water reached
*/
Player.prototype.update = function(){
    for(var i = 0; i < allEnemies.length; i++){
        if(this.x < allEnemies[i].x + allEnemies[i].width &&
            this.x + this.width > allEnemies[i].x &&
            this.y < allEnemies[i].y + allEnemies[i].height &&
            this.height + this.y > allEnemies[i].y){
                this.startPoint();
        }
    }

    // if the position is over the water the divOver is displayed and the keyup eventListener removed
    if(this.y === 45){
        document.querySelector(".over").style.display = "block";
        document.querySelector("h1").textContent = "Congratulations!";
        document.querySelector('p').innerText = "You did it in "+ count +" jumps and got "+ countGems +" gems! \nPress F5 to refresh the page and play again.";
        document.removeEventListener('keyup', addingListener);
    }
};

/*
 * Resets the player at the start point and the count of jumps and reset the gems
*/
Player.prototype.startPoint = function(){
    this.x = 205;
    this.y = 460;
    count = 0;
    resetGems();
    //The lifes are handled when the player is reset
    lifes--;
    document.querySelector("#life" + lifes).remove();
    if (lifes === 0) {
        document.querySelector(".over").style.display = "block";
        document.querySelector("h1").textContent = "Sorry!";
        document.querySelector('p').innerText = "Game over\nPress F5 to refresh the page and play again.";
    }
};

/*
 *  Renders the player on the game
*/
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * Receives the pressed keys and handles the player's movements on the board
 * taking into account the limits
*/
Player.prototype.handleInput = function(key){
    if(key === "right" && this.x < 405){ //405 is the most right position on the board
        this.x += this.jumpX;
        count++;
    }else if(key === "left" && this.x > 5){//5 is the most left position on the board
        this.x -= this.jumpX;
        count++;
    }else if(key === "up" && this.y > 45){//45 is the highest position on the board
        this.y -= this.jumpY;
        count++;
    }else if(key === "down" && this.y < 460){//460 is the lowest position on the board
        this.y += this.jumpY;
        count++;
    }
};

/*
 * Gem object
 * @param {string} color
 * @param {number} x
 * @param {number} y
*/
var Gem = function(color, x, y){
    this.sprite = "images/Gem "+ color + ".png";
    this.x = 25 + (100 * x); // 25 to center the gem horizontally, 100*x gives the number of column
    this.y = 140 +(83 * y);// 140 to avoid the water and center the gem vertically, 83*y gives the number of row
    this.width = 50;
    this.height = 60;
};

/*
 * Gives a random number between the given values
 * Used to give the random position of the gems on the board, x=columns, y=rows
 * @param {number} min
 * @param {number} max
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * Render the Gem objects
*/
Gem.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * Checks if the player collides the gems, if so, deletes the gem and refreshes the gems count and writes it on screen
*/
Gem.prototype.update = function(){
    //if the player collides the gems
    for(var z = 0; z < gemList.length; z++){
        if(player.x < gemList[z].x + gemList[z].width &&
            player.x + player.width > gemList[z].x &&
            player.y < gemList[z].y + gemList[z].height &&
            player.height + player.y > gemList[z].y){
                //delete the gem from the board and the array
                ctx.clearRect(gemList[z].x, gemList[z].y, gemList[z].width, gemList[z].height);
                gemList.splice(z, 1);
                countGems++;
        }
    }
    document.querySelector('#gems').textContent = "Gems: " + countGems;
};

/*
 * Resets the gems count and objects
*/
var resetGems = function(){
    countGems = 0;
    gemList = [new Gem("Blue", getRandomInt(0, 4), getRandomInt(0, 2)),
        new Gem("Green", getRandomInt(0, 4), getRandomInt(0, 2)),
        new Gem("Orange", getRandomInt(0, 4), getRandomInt(0, 2)),
        new Gem("Blue", getRandomInt(0, 4), getRandomInt(0, 2)),
        new Gem("Green", getRandomInt(0, 4), getRandomInt(0, 2))];
};

/*
 * Instantiate the objects.
 * Place all enemy objects in an array called allEnemies
 * Place the player object in a variable called player
 * Declare the count of jumps
 * Declare the number of lifes
 * Declare the number of gems
*/
var allEnemies = [new Enemy(0), new Enemy(85), new Enemy(167)];//, new Enemy(0), new Enemy(85), new Enemy(167)];
var player = new Player("images/char-boy.png");
var gemList = [new Gem("Blue", getRandomInt(0, 4), getRandomInt(0, 2)),
    new Gem("Green", getRandomInt(0, 4), getRandomInt(0, 2)),
    new Gem("Orange", getRandomInt(0, 4), getRandomInt(0, 2)),
    new Gem("Blue", getRandomInt(0, 4), getRandomInt(0, 2)),
    new Gem("Green", getRandomInt(0, 4), getRandomInt(0, 2))];
var count = 0;
var lifes = 3;
var countGems = 0;

/*
 * Create the player with the selected character
 * @param {string} character
*/
var creatingPlayer = function(character){
    player = new Player(character);
};

/*
 * This listens for key presses and sends the keys to Player.handleInput() method.
*/
var addingListener = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};

/*
 * Using a named function to be able to remove the listener when the user wins the game
*/
document.addEventListener('keyup', addingListener);
