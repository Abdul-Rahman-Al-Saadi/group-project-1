class CharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterScene' });
    }

    preload() {
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;
        this.add.text(centerX, centerY, 'Character Scene', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    }
}
