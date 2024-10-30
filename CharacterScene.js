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

        // Character selection title
        this.add.text(centerX, centerY - 150, 'What Kind of Hero are You?', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Character 1
        const character1 = this.add.rectangle(centerX - 100, centerY, 80, 80, 0x0077ff);
        this.add.text(centerX - 100, centerY, 'Character 1', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Character 2
        const character2 = this.add.rectangle(centerX + 100, centerY, 80, 80, 0xff0000);
        this.add.text(centerX + 100, centerY, 'Character 2', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Username input field
        const usernameLabel = this.add.text(centerX, centerY + 100, 'Enter Username:', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        const inputStyle = {
            fontFamily: '"Press Start 2P"', 
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#333333'
        };
        
        const usernameInput = this.add.text(centerX, centerY + 140, 'YourName', inputStyle).setOrigin(0.5);
        
        const playButton = this.add.rectangle(centerX, centerY + 200, 120, 40, 0x00ff00);
        this.add.text(centerX, centerY + 200, 'Play', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '24px',
            fill: '#000000'
        }).setOrigin(0.5);

        playButton.setInteractive();
        playButton.on('pointerover', () => playButton.setFillStyle(0x00cc00)); // Change color on hover
        playButton.on('pointerout', () => playButton.setFillStyle(0x00ff00)); // Reset color on hover out

        this.input.on('pointerdown', (pointer, gameObject) => {
            if (gameObject.includes(playButton)) {
                this.startGame()
            }
        });
    }

    startGame() {
        this.scene.start('MyScene');
    }
}
