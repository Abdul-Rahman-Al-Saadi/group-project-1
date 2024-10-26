var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

var game = new Phaser.Game(config);

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Load the tilemap
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/maze-map.json');

        // Load the tileset image
        this.load.tilemapTiledJSON("map", "maze-map.json");
    }

    create() {
        // After loading, switch to the GameScene
        this.scene.start('GameScene');
    }
}
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Get the tilemap
        const map = this.make.tilemap({ key: 'map' });

        // Add the tileset to the map
        const tileset = map.addTilesetImage('tileset-img', './assets/tilemaps/tileset-img'); // Replace 'tilesetName' with the name you used in Tiled

        // Create layers (replace 'layerName' with the actual name of your layer in Tiled)
        const layer = map.createLayer('layerName', tileset, 0, 0);
        
        // If you have multiple layers, you can create them like this:
        // const backgroundLayer = map.createLayer('BackgroundLayer', tileset, 0, 0);
        // const foregroundLayer = map.createLayer('ForegroundLayer', tileset, 0, 0);
    }
}



function preload() {
    this.load.image("background-img", "assets/images/background-img.jpg");
    this.load.tilemapTiledJSON("map", "maze-map.json");
    // this.load.spritesheet("dude", "assets/dude.png", {
    //     frameWidth: 32,
    //     frameHeight: 48,
    // });
}

function create() {
    this.add.image(400, 300, "background-img");

}

function update() {

}
