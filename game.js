class MyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyScene' });
    }
    
    preload() {
        this.load.image('background', 'assets/images/background-img.jpg');
        this.load.image('tiles', 'assets/tileset/dirtWall.png');
        this.load.tilemapTiledJSON('map', 'assets/tileset/map.json');
        this.load.spritesheet('coin', 'assets/images/coin.png', { frameWidth: 15, frameHeight: 16 });
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
    }
    
    update() {
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

