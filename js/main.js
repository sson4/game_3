


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

var player;
var lasers;

var fireRate = 1;
var nextFire = 0;
var startBug = 1;
var bugCount = startBug;


function preload() {
    game.load.image('background', 'assets/image/background.jpg');
    game.load.image('bee', 'assets/image/bee.png');
    game.load.image('ladybug', 'assets/image/ladybug.png');
    game.load.image('mosquito', 'assets/image/mosquito.png');
    game.load.image('bugspray','assets/image/bugspray.png');
    game.load.image('laser','assets/image/laser.png');
}



function create() {
   
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.add.sprite(0,0, 'background');
    
    lasers = game.add.group();
    lasers.enableBody = true;
    lasers.physicsBodyType = Phaser.Physics.ARCADE;
    lasers.createMultiple(1, 'laser' );
    lasers.setAll('checkWorldBounds', true);
    lasers.setAll('outOfBoundsKill', true);
    
    
    
    
    bugs = game.add.group();
    bugs.enableBody = true;
    bugs.physicsBodyType = Phaser.Physics.ARCADE;
    for(var i = 0; i < startBug; i++){
        var x = Math.round(Math.random()*game.world.width);
        var y = Math.round(Math.random()*game.world.height);
        var mosquito = bugs.create(x,0,'mosquito');
        mosquito.body.velocity.x = x/5;
        mosquito.body.velocity.y = y/5;
    }
    

  
    
    player = game.add.sprite(game.world.width*0.5, game.world.height*0.5, 'bugspray');
    player.scale.setTo(-0.2);
    player.anchor.setTo(0.8,0.2);
    game.physics.enable(player);
    player.body.allowRotation = false;
  
}

function update() {
    
    player.rotation = game.physics.arcade.angleToPointer(player);
    game.physics.arcade.overlap(lasers, bugs, killBugs, null, this);
    game.physics.arcade.overlap(bugs, player, playerDied, null, this);
    
    
    if (game.input.activePointer.isDown)
    {
        fire();
    }
    bugs.forEachExists(checkBound);
    if (bugCount==0){
        startBug++;
        bugCount = startBug;
        for(var i = 0; i < startBug; i++){
            var x = Math.round(Math.random()*game.world.width);
            var y = Math.round(Math.random()*game.world.height);
            var mosquito = bugs.create(x,0,'mosquito');
            mosquito.body.velocity.x = x/5;
            mosquito.body.velocity.y = y/5;
        }
    }

}

function fire() {

    if (game.time.now > nextFire && lasers.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var laser = lasers.getFirstDead();

        laser.reset(player.x , player.y );

        game.physics.arcade.moveToPointer(laser, 700);
    }

}


function checkBound (sprite) {
    if (sprite.x < 0) 
    {
        sprite.x = game.width;
    } 
    else if (sprite.x > game.width) 
    {
        sprite.x = 0;
    } 

    if (sprite.y < 0) 
    {
        sprite.y = game.height;
        
    } 
    else if (sprite.y > game.height) 
    {
        sprite.y = 0;
    }
}


function killBugs(lasers, bugs){
    
    bugs.kill();
    bugCount--;
    
}

function playerDied(player, bugs){
    
    player.kill();
    lasers.kill();
    gameOverText.text = 'Game Over';
}