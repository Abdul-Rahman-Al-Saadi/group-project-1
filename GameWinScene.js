class GameWinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene' });
        this.menuAudio = null; 
    }

    preload() {
        this.load.image('gameWinBackground', 'assets/menu/background.jpg');
    }

    create() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        this.add.text(centerX, centerY - 100, 'YOU WIN', {
            fontFamily: '"Press Start 2P"',
            fontSize: '64px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        const startText = this.add.text(centerX, centerY + 100, 'The Truth is Unveiled! You’ve Escaped the Dungeon!', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        startText.setInteractive();
        startText.on('pointerdown', () => this.retry()); 

        this.input.keyboard.on('keydown-ENTER', () => this.retry()); 
    }

    
    retry() {
        console.log("game finished");
        this.scene.start('MenuScene');
    }
    
}
