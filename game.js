class MyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyScene' });
        this.player;
        this.cursors;
        this.coins; // To hold the coin sprites
        this.coinSound; // To hold the sound
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
        
        // Load the coin sound
        this.load.audio('coinSound', 'assets/audio/retro-coin.mp3');
    }

    getValidPositions(map, layer) {
        const positions = [];
        const tileData = layer.layer.data;
        console.log(tileData);
        for (let y = 0; y < tileData.length; y++) {
            for (let x = 0; x < tileData[y].length; x++) {
                const tile = tileData[y][x];
                console.log("Entered the loop");
                console.log("Tile index:", tile.index); 
                if (tile.index === -1) {
                    console.log("Valid position found");
                    positions.push({ x: tile.getCenterX(), y: tile.getCenterY() });
                }
            }
        }
        
        return positions;
    }

    getValidPositions(map, layer) {
        const positions = [];
        const tileData = layer.layer.data;
        console.log(tileData);
        for (let y = 0; y < tileData.length; y++) {
            for (let x = 0; x < tileData[y].length; x++) {
                const tile = tileData[y][x];
                console.log("Entered the loop");
                console.log("Tile index:", tile.index); 
                if (tile.index === -1) {
                    console.log("Valid postion found");
                    positions.push({ x: tile.getCenterX(), y: tile.getCenterY() });
                }
            }
        }
        
        return positions;
    }

    create() {
      
        let background = this.add.image(0, 0, 'background').setOrigin(0);
        background.setDisplaySize(960, 640);
    
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('mazeWallsTileset', 'tiles');
        const layer = map.createLayer("Tile Layer 1", tiles, 0, 0);
    
        background.setDepth(0);
        layer.setDepth(1);

        this.anims.create({
            key: 'flip',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });


        this.tileData = layer.layer.data;

        const validPositions = this.getValidPositions(map, layer);
        if (validPositions.length === 0) {
            console.warn("No valid positions found for coins.");
            return; 
        }


        // Initialize the coin sound
        this.coinSound = this.sound.add('coinSound');

        // Spawn coins (store them in this.coins array)
        this.coins = this.physics.add.group();
        

    // Spawn coins
    const totalCoins = 20;
    for (let i = 0; i < totalCoins; i++) {
        const randomIndex = Phaser.Math.Between(0, validPositions.length - 1);
        const { x, y } = validPositions[randomIndex];
        console.log(x,y);

        this.coin = this.add.sprite(x, y, 'coin');
        this.coin.play(('flip'));
        this.coin.setDepth(3);
    }
    

    

        // Add player at a specified location (adjust as needed)
        this.player = this.physics.add.sprite(50, 590, 'dude');
        this.player.setCollideWorldBounds(true);
    
        layer.setCollision([63, 69, 76, 82, 83, 86, 96, 102, 103, 111, 114, 119, 146]);
    
        // Add collision between player and walls
        this.physics.add.collider(this.player, layer);
    
        this.player.setSize(15, 15);
        const offsets = {
            up: { x: 15, y: 20 },
            down: { x: 20, y: 20 },
            left: { x: 5, y: 20 },
            right: { x: 25, y: 20 }
        };

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

        // Add collision detection between player and coins
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    }

    collectCoin(player, coin) {
        // Play the coin sound
        this.coinSound.play();
        // Remove the coin from the scene
        coin.destroy();
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
            this.player.anims.stop();
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

var coin;
var game = new Phaser.Game(config);
