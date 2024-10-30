
class MyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyScene' });
        this.player;
        this.cursors;
        this.coins;
        this.coinSound;
        this.score = 0;
        this.totalCoins = 20; 
    }

    preload() {
        this.load.image('background', 'assets/images/background-img.jpg');
        this.load.image('tiles', 'assets/tileset/dirtWall.png');
        this.load.tilemapTiledJSON('map', 'assets/tileset/map-refined1.json');
        this.load.image('key', 'assets/sprites/objects/key.png');
        this.load.spritesheet('door', 'assets/sprites/objects/Door.png', {frameWidth: 200, frameHeight:220});
        this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 15, frameHeight: 16 });
        this.load.spritesheet('dude', 'assets/sprites/characters/player.png', {
            frameWidth: 48,
            frameHeight: 50
        });
        this.load.audio('coinSound', 'assets/audio/retro-coin.mp3');
    }

    getValidPositions(map, layer) {
        const positions = [];
        const tileData = layer.layer.data;
        for (let y = 0; y < tileData.length; y++) {
            for (let x = 0; x < tileData[y].length; x++) {
                const tile = tileData[y][x]; 
                if (tile.index === -1) {
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

        this.cameras.main.setBackgroundColor(0x87ceeb);

        // this.spotlight = this.add.graphics();
        // this.spotlight.setDepth(2);

        this.anims.create({
            key: 'flip',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        const validPositions = this.getValidPositions(map, layer);
        if (validPositions.length === 0) {
            console.warn("No valid positions found for coins.");
            return; 
        }

        this.coinSound = this.sound.add('coinSound');
        this.coins = this.physics.add.group();
        for (let i = 0; i < this.totalCoins; i++) {
            const randomIndex = Phaser.Math.Between(0, validPositions.length - 1);
            const { x, y } = validPositions[randomIndex];

            const coin = this.coins.create(x, y, 'coin');
            coin.play('flip');
            coin.setDepth(3);
        }
        
        this.key = this.physics.add.sprite(500,593, 'key');
        this.door = this.physics.add.sprite(910, 50, 'door', 0);
        this.door.setScale(0.15);
        
        this.player = this.physics.add.sprite(50, 590, 'dude');
        this.player.setCollideWorldBounds(true);
        console.log(layer.data);
        this.physics.add.overlap(this.player, this.door, this.openDoor, null, this);

        // Make a function to automate the setCollistion array
        layer.setCollision([63, 69, 76, 82, 83, 86, 96, 102, 103,109,110, 111, 114, 119,125,126, 146]);
        // layer.setCollision(Array.from(new set(layer.data)))
        console.log(layer);
        this.physics.add.collider(this.player, layer);

        this.player.setSize(15, 15);

        this.anims.create({
            key: 'open',
            frames: [
                { key: 'door', frame: 0 }, 
                { key: 'door', frame: 1 }, 
                { key: 'door', frame: 2 }, 
                { key: 'door', frame: 3 }  
            ],
            frameRate: 10,
            repeat: 0 
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 10 }), 
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 13 }), 
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 5 }), 
            frameRate: 10,
            repeat: -1
        });

        

        // Lily Animation Creation
        /*
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dudeLeft', { start: 0, end: 7 }), 
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dudeRight', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dudeUp', { start: 0, end: 7 }), 
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dudeDown', { start: 0, end: 7 }), 
            frameRate: 10,
            repeat: -1
        });
        */

       
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        document.getElementById('scoreboard').innerText = `Score: ${this.score} / ${this.totalCoins}`;

    //     this.cameras.main.setBackgroundColor(0x87ceeb); // Set a light background color
    // this.spotlight = this.add.graphics();
    // this.spotlight.setDepth(4);
    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x000000, 0.7); // Change opacity of the overlay
    this.overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.overlay.setDepth(5);

    this.maskGraphics = this.add.graphics();
    this.maskGraphics.fillStyle(0xffffff, 0.1);
    this.maskGraphics.fillCircle(0, 0, 100); // Circle at (0, 0) with radius 200
    this.maskGraphics.setDepth(4);

    const mask = this.maskGraphics.createGeometryMask(); 
    mask.setInvertAlpha();
    this.overlay.setMask(mask); 

    this.maskGraphics.x = this.player.x; 
    this.maskGraphics.y = this.player.y;
    }

    openDoor(player, door){
        this.door.anims.play('open');
        hasGameFinished = true;
    }

    collectCoin(player, coin) {
        this.coinSound.play();
        this.score += 1;
        document.getElementById('scoreboard').innerText = `Score: ${this.score} / ${this.totalCoins}`;
        coin.destroy();
    }
    

    update() {
        this.player.setVelocity(0);

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
        this.maskGraphics.x = this.player.x; 
        this.maskGraphics.y = this.player.y;
        // this.spotlight.clear();

        // const radius = 100; 
        // this.spotlight.fillStyle(0xffffff, 0.2); // White color with 50% opacity for transparency
        // this.spotlight.beginPath();
        // this.spotlight.arc(this.player.x, this.player.y, radius, 0, Math.PI * 2, false);
        // this.spotlight.fill();

        // this.overlay.clear();
        // this.overlay.fillStyle(0x000000, 0.9);
        // this.overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    
        // // Update mask position to follow the sprite
        // this.maskGraphics.x = this.player.x;
        // this.maskGraphics.y = this.player.y;
    
        // // Clear and redraw the mask area
        // this.maskGraphics.clear();
        // this.maskGraphics.fillStyle(0xffffff);
        // this.maskGraphics.fillCircle(0, 0, 100); 
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
    scene: [MenuScene,CharacterScene,MyScene],
    scale: {
        mode: Phaser.Scale.FIT,        // Ensures the game scales to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game in the viewport
    },
    backgroundColor: '#000000' // Background color if image fails to load
};

var hasGameFinished = false;
var game = new Phaser.Game(config);
