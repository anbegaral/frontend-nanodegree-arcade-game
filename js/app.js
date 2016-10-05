// Enemies our player must avoid
var Enemy = function(height) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101; //101 is the width of the png
    this.y = 132 + height; // the height is given to match on the path
    this.jumpX = Math.random() * 200; // a random number for the speed
    this.width = 90;
    this.height = 75;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.jumpX * dt;
    if(this.x > ctx.canvas.width){
        this.x = -101;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.sprite = 'images/char-horn-girl.png';
    this.x = 205;
    this.y = 460;
    this.width = 90;
    this.height = 85;
    this.jumpX = 100;
    this.jumpY = 83;
}

// Manages the cases that the player collides against the enemies
// and the water reached
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
        document.querySelector('p').innerText = "You did it in "+ count +" jumps!!!! \nPress F5 to refresh the page and play again.";
        document.removeEventListener('keyup', addingListener);
    }
}

// Resets the player at the start point and the count of jumps
Player.prototype.startPoint = function(){
    this.x = 205;
    this.y = 460;
    count = 0;
}

// Renders the player on the game
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Receives the pressed keys and handles the player's movements on the board
// taking into account the limits
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
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(0), new Enemy(85), new Enemy(167)];
var player = new Player();
var count = 0;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
var addingListener = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};

// Using a named function to be able to remove the listener when the user wins the game
document.addEventListener('keyup', addingListener);
