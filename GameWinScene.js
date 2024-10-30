class GameWinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene' });
        this.menuAudio = null; 
    }

    init(data) {
        this.username = data.username; 
        this.score = data.score;
        this.timeLeft = data.timeLeft;
        console.log(this.score, this.timeLeft, this.username);
    }

    preload() {
    }

    create() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        console.log("printin passed elements", this.score, this.timeLeft, this.username);

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        console.log(this.username, this.score, this.timeLeft);
        const youWinTxt = this.add.text(centerX, centerY -100 , `YOU WON ${this.username}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '50px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: youWinTxt,
            alpha: { from: 1, to: 0 }, // Fade to transparent
            duration: 500, // Duration of fade
            yoyo: true, // Reverse back to the original value
            repeat: -1 // Repeat indefinitely
        });

        const startText = this.add.text(centerX, centerY, "You've Defeated the Darkness! Freedom Awaits!", {
            fontFamily: '"Press Start 2P"', 
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const retryText = this.add.text(centerX, centerY +100, "Up for a new challenge", {
            fontFamily: '"Press Start 2P"', 
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        retryText.setInteractive();
        retryText.on('pointerdown', () => this.retry()); 

        this.input.keyboard.on('keydown-ENTER', () => this.retry()); 
    }

    
    retry() {
        console.log("game won");
        this.scene.start('MenuScene');
    }
    
}
