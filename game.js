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
        this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 15, frameHeight: 16 });

        //Mason Preload
        
        this.load.spritesheet('dude', 'assets/sprites/characters/player.png', {
            frameWidth: 48,
            frameHeight: 50
        });
        

        // Lily Preload
        /*
        this.load.spritesheet('dude', 'assets/sprites/characters/lily/idle/idle.png', {
            frameWidth: 48,
            frameHeight: 64
        });

        this.load.spritesheet('dudeLeft', 'assets/sprites/characters/lily/Walk/walk_left_down.png', {
            frameWidth: 48,
            frameHeight: 64
        });
    
        this.load.spritesheet('dudeRight', 'assets/sprites/characters/lily/Walk/walk_right_down.png', {
            frameWidth: 48,
            frameHeight: 64
        });
    
        this.load.spritesheet('dudeUp', 'assets/sprites/characters/lily/Walk/walk_up.png', {
            frameWidth: 48,
            frameHeight: 64
        });
    
        this.load.spritesheet('dudeDown', 'assets/sprites/characters/lily/Walk/walk_down.png', {
            frameWidth: 48,
            frameHeight: 64
        });
        */

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
        

        this.player = this.physics.add.sprite(50, 590, 'dude');
        this.player.setCollideWorldBounds(true);
        console.log(layer.data);

        // Make a function to automate the setCollistion array
        layer.setCollision([63, 69, 76, 82, 83, 86, 96, 102, 103,109,110, 111, 114, 119,125,126, 146]);
        // layer.setCollision(Array.from(new set(layer.data)))
        console.log(layer);
        this.physics.add.collider(this.player, layer);

        this.player.setSize(15, 15);

        // Mason Animation Creation
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

var game = new Phaser.Game(config);
