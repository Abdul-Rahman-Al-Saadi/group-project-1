class MyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyScene' });
        this.player;
        this.cursors;
        this.coins;
        this.coinSound;
        this.isKeyPicked = false;
        this.score = 0;
        this.totalCoins = 20; 
        this.timeLeft = 180;
        this.selectedCharacter = 'mason'; 
    }

    init(data) {
        this.selectedCharacter = data.selectedCharacter || 'mason';
        this.username = data.username;
    }

    preload() {
        this.load.image('background', 'assets/images/background-img.jpg');
        this.load.image('tiles', 'assets/tileset/dirtWall.png');
        this.load.tilemapTiledJSON('map', 'assets/tileset/map-refined1.json');
        this.load.image('key', 'assets/sprites/objects/key.png');
        this.load.spritesheet('door', 'assets/sprites/objects/Door.png', {frameWidth: 200, frameHeight:220});
        this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 15, frameHeight: 16 });
        if (this.selectedCharacter === 'mason') {
        this.load.spritesheet('dude', 'assets/sprites/characters/player.png', {
            frameWidth: 48,
            frameHeight: 50
        });
        }
        else if (this.selectedCharacter === 'lily') {
            this.load.spritesheet('dude', 'assets/sprites/characters/lily/idle/idle.png', { frameWidth: 48, frameHeight: 64 });
            this.load.spritesheet('dudeLeft', 'assets/sprites/characters/lily/Walk/walk_left_down.png', { frameWidth: 48, frameHeight: 64 });
            this.load.spritesheet('dudeRight', 'assets/sprites/characters/lily/Walk/walk_right_down.png', { frameWidth: 48, frameHeight: 64 });
            this.load.spritesheet('dudeUp', 'assets/sprites/characters/lily/Walk/walk_up.png', { frameWidth: 48, frameHeight: 64 });
            this.load.spritesheet('dudeDown', 'assets/sprites/characters/lily/Walk/walk_down.png', { frameWidth: 48, frameHeight: 64 });
        }
        this.load.audio('coinSound', 'assets/audio/retro-coin.mp3');
        this.load.audio('footsteps', 'assets/audio/footsteps.mp3');
        this.load.audio('backgroundMusic', 'assets/audio/dungeon-air.mp3');
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
        background.setDepth(0);

        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.backgroundMusic.play({ loop: true }); 

        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('mazeWallsTileset', 'tiles');
        const layer = map.createLayer("Tile Layer 1", tiles, 0, 0);
        layer.setDepth(1);

        // this.key = this.physics.add.sprite(500,593, 'key');
        this.key = this.physics.add.sprite(40,200, 'key');
        // this.door = this.physics.add.sprite(910, 50, 'door', 0);
        this.door = this.physics.add.sprite(40, 100, 'door', 0);
        this.door.setScale(0.15);

        this.player = this.physics.add.sprite(50, 590, 'dude');
        this.player.setSize(15, 15);
        this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(2.5); 

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.player, this.door, this.openDoor, null, this);
        this.physics.add.overlap(this.player, this.key, this.pickKey, null, this);

        layer.setCollision([0, 65, 96, 69, 3221225515, 76, 109, 110, 111, 112, 47, 146, 114, 95, 125, 126, 63]);
        this.physics.add.collider(this.player, layer);

        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0x000000, 0.9); 
        this.overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.overlay.setDepth(5);
    
        this.maskGraphics = this.add.graphics();
        this.maskGraphics.fillStyle(0xffffff, 0.1);
        this.maskGraphics.fillCircle(0, 0, 100); 
        this.maskGraphics.setDepth(4);
    
        const mask = this.maskGraphics.createGeometryMask(); 
        mask.setInvertAlpha();
        this.overlay.setMask(mask); 
    
        this.maskGraphics.x = this.player.x; 
        this.maskGraphics.y = this.player.y;
    
        this.timer();
    
        this.footstepSound = this.sound.add('footsteps');
        this.isMoving = false;

        this.anims.create({
            key: 'flip',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        const validPositions = this.getValidPositions(map, layer);
        if (validPositions.length === 0) {
            console.log("No valid positions found for coins.");
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

        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        document.getElementById('score').innerText = `Score: ${this.score} / ${this.totalCoins}`;

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

        if (this.selectedCharacter === 'mason') {

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
    }

    else if (this.selectedCharacter === 'lily') {
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
        }
    }

    openDoor(player, door){
        const pickedKey = this.isKeyPicked
        if(pickedKey){
            this.door.anims.play('open');
            this.backgroundMusic.stop();
            this.gameWin();
        }
    }

    pickKey(player, key){
        this.isKeyPicked = true;
        key.destroy();
    }

    collectCoin(player, coin) {
        this.coinSound.play();
        this.score += 1;
        document.getElementById('score').innerText = `Score: ${this.score} / ${this.totalCoins}`;
        coin.destroy();
    }

    timer(){
        if (this.timeLeft > 0){
            var timerInterval = setInterval(() =>{
                if (this.timeLeft >0){
                    this.timeLeft -= 1;
                    document.getElementById('timer').innerText = `Time Left   ${Math.floor(this.timeLeft / 60)}:${this.timeLeft % 60}`;
                }else{
                    this.gameOver();
                    clearInterval(timerInterval);
                }
                }, 1000);
                }
    }

    gameOver(){
        this.backgroundMusic.stop();
        this.scene.start('GameOverScene', { username: this.username });
    }

    gameWin(){
        this.scene.start('GameWinScene', {score:this.score, username: this.username, timeLeft: this.timeLeft})
    }

    update() {
        this.player.setVelocity(0);
        let moving = false;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
            this.player.anims.play('up', true);
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
            this.player.anims.play('down', true);
            moving = true; 
        } else {
            this.player.anims.stop();
            moving = true;
        }
    
        this.maskGraphics.x = this.player.x; 
        this.maskGraphics.y = this.player.y;
        this.cameras.main.centerOn(this.player.x, this.player.y);
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
    scene: [MenuScene,CharacterScene,MyScene, GameOverScene, GameWinScene],
    scale: {
        mode: Phaser.Scale.FIT,        
        autoCenter: Phaser.Scale.CENTER_BOTH, 
    },
    backgroundColor: '#000000' 
};

var game = new Phaser.Game(config);
