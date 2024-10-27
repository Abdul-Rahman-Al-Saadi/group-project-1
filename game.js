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

    
    create() {
    
        let background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(960, 640);

        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('mazeWallsTileset', 'tiles');
        const layer = map.createLayer("Tile Layer 1", tiles, 0, 0);
        background.setDepth(0);
        layer.setDepth(1);
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

var game = new Phaser.Game(config);

