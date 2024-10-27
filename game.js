class MyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyScene' });
        this.player;
        this.cursors;
    }

    preload() {
        this.load.image('background', 'assets/images/background-img.jpg');
        this.load.image('tiles', 'assets/tileset/dirtWall.png');
        this.load.tilemapTiledJSON('map', 'assets/tileset/map.json');
        
        this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 15, frameHeight: 16 });
        this.load.spritesheet('dude', 'assets/sprites/characters/player.png', {
            frameWidth: 48,
            frameHeight: 50
        });
    }

    create() {
        let background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(960, 640);
    
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('mazeWallsTileset', 'tiles');
        const layer = map.createLayer("Tile Layer 1", tiles, 0, 0);
    
        background.setDepth(0);
        layer.setDepth(1);
    
        // Add player at a specified location (adjust as needed)
        this.player = this.physics.add.sprite(50, 590, 'dude');
        this.player.setCollideWorldBounds(true);
    
        layer.setCollision([63, 69, 76, 82, 83, 86, 96, 102, 103, 111, 114, 119, 146]);
    
        // Add collision between player and walls
        this.physics.add.collider(this.player, layer);
    
        this.player.setSize(15, 15); // Set a new size (width, height)
        const offsets = {
            up: { x: 15, y: 20 },    // Offset when moving up
            down: { x: 20, y: 20 },  // Offset when moving down
            left: { x: 5, y: 20 },   // Offset when moving left
            right: { x: 25, y: 20 }  // Offset when moving right
        };

        // Function to set the offset based on direction
        function setPlayerOffset(direction) {
            const offset = offsets[direction];
            if (offset) {
                this.player.setOffset(offset.x, offset.y);
            }
        }

        // Define animations for walking
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }), 
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dude', { start: 15, end: 15 }), 
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 5 }), 
            frameRate: 10,
            repeat: -1
        });
    
        // Set up cursor keys for input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.setVelocity(0);
    
        // Check input and move player accordingly
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('down', true);
        } else {
            this.player.anims.stop(); // Stop animation when not moving
        }
    }
    
}    

var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: MyScene
};


var game = new Phaser.Game(config);
