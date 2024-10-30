class BaseScene extends Phaser.Scene{
    constructor(key) {
        super({ key: key });
    }

    createBackground(imageKey) {
        const background = this.add.image(0, 0, imageKey).setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }

    createCenteredText(text, yOffset, fontSize) {
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;
        
        return this.add.text(centerX, centerY + yOffset, text, {
            fontFamily: '"Press Start 2P"',
            fontSize: fontSize,
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    setInteractiveText(textObject, callback) {
        textObject.setInteractive();
        textObject.on('pointerdown', callback);
        this.input.keyboard.on('keydown-ENTER', callback);
    }
}

class MenuScene extends BaseScene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuBackground', 'assets/menu/background.jpg');
        // this.load.audio('menuAudio', 'assets/audio/menu-audio.mp3');
    }

    create() {
        this.createBackground('menuBackground');
        this.createCenteredText('Dungeon Crawler', -100, '64px');

        const startText = this.createCenteredText('Start Game', 100, '32px');
        this.setInteractiveText(startText, () => this.startGame());
    }

    startGame() {
        this.scene.start('CharacterScene'); 
    }
}

class GameOverScene extends BaseScene {
    constructor() {
        super('GameOverScene');
    }

    preload() {
        this.load.image('gameOverBackground', 'assets/menu/background.jpg');
        // this.load.audio('gameOverAudio', 'assets/audio/gameover-audio.mp3');
    }

    create() {
        this.createBackground('gameOverBackground');
        this.createCenteredText('Game Over', -100, '64px');

        const retryText = this.createCenteredText('Retry', 100, '32px');
        this.setInteractiveText(retryText, () => this.retryGame());
    }

    retryGame() {
        this.scene.start('MenuScene'); 
    }
}