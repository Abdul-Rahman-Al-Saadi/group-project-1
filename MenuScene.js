class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menuBackground', 'assets/menu/title_bg.jpg');
    }

    create() {
        this.add.image(0, 0, 'menuBackground').setOrigin(0, 0);
        this.add.text(400, 200, 'My Game', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);
        const startText = this.add.text(400, 400, 'Start Game', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);        
        startText.setInteractive();
        startText.on('pointerdown', () => this.scene.start('MyScene'));
        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('MyScene'));
    }
}
