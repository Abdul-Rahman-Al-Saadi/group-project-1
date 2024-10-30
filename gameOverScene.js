class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    init(data) {
        // Access the username from the passed data
        this.username = data.username; 
        console.log("Username in GameOverScene:", this.username); // Check if username is logged correctly
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

        console.log(this.username);
        this.add.text(centerX, centerY +30, `You lost, ${this.username}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
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
