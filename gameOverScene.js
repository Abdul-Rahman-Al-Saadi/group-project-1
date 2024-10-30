class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
        this.menuAudio = null; 
    }

    preload() {
        // this.load.image('gameOverBackground', 'assets/menu/background.jpg');
    }

    create() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        this.add.text(centerX, centerY - 100, 'GAME OVER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '64px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        const startText = this.add.text(centerX, centerY + 100, 'TRY AGAIN', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const userName = this.add.text(centerX, centerY - 100, `You lost`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '64px',
            fill: '#ff0000'
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
