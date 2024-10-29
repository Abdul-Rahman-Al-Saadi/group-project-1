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

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        document.getElementById('scoreboard').innerText = `Score: ${this.score} / ${this.totalCoins}`;
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

var hasGameFinished = false;
var game = new Phaser.Game(config);
