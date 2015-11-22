var GameState = function(game){
};

GameState.prototype.preload = function(){
  this.game.load.image('moon','assets/moon.png');
  this.game.load.image('icon', 'assets/white.png');
  this.game.load.image('ground', 'assets/black.png');
  this.game.load.image('trump', 'assets/baldtrump.png');
  this.game.load.image('toupee', 'assets/toupee.png');
};

GameState.prototype.create = function(){
  // Set stage background to something sky colored
  this.game.stage.backgroundColor = 0x4488cc;

  // Define movement constants
  this.MAX_SPEED = 500; // pixels/second

  // // Create a player sprite
  this.trump = this.game.add.sprite(this.game.width/2, this.game.height - 128, 'trump');
  this.toupee = this.game.add.sprite(this.game.width/2, 0, 'toupee');


  // // Enable physics on the player
  this.game.physics.enable(this.trump, Phaser.Physics.ARCADE);
  this.game.physics.enable(this.toupee, Phaser.Physics.ARCADE);

  // // Make player collide with world boundaries so he doesn't leave the stage
  this.trump.body.collideWorldBounds = true;

  // // Capture certain keys to prevent their default actions in the browser.
  // // This is only necessary because this is an HTML5 game. Games on other
  // // platforms may not need code like this.
  this.game.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN
  ]);

  // // Create some ground for the trump to walk on
  this.ground = this.game.add.group();
  for(var x = 0; x < this.game.width; x += 32) {
    // Add the ground blocks, enable physics on each, make them immovable
    var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
    this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
    groundBlock.body.immovable = true;
    groundBlock.body.allowGravity = false;
    this.ground.add(groundBlock);
  }
};

// This function should return true when the trump activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
  var isActive = false;

  isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x < this.game.width/4);

  return isActive;
};

GameState.prototype.rightInputIsActive = function() {
  var isActive = false;

  isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

  return isActive;
};

GameState.prototype.moveTrump = function(){
  if (this.leftInputIsActive()) {
    this.trump.body.velocity.x = -this.MAX_SPEED;
  } else if (this.rightInputIsActive()) {
    this.trump.body.velocity.x = this.MAX_SPEED;
  } else {
    // Stop the trump from moving horizontally
    this.trump.body.velocity.x = 0;
  }
};

GameState.prototype.makeItRainToupees = function(){
  this.toupee.body.velocity.y = 200;
};

GameState.prototype.update = function() {
  // Collide the player with the ground
  this.game.physics.arcade.collide(this.player, this.ground);
  this.moveTrump();
  this.makeItRainToupees();
};

game = new Phaser.Game(800, 600, Phaser.AUTO, '');
game.state.add('game', GameState, true);
