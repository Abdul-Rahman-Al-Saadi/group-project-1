class CharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterScene' });
    }

    preload() {

        this.load.image('player1', 'assets/menu/player1.png'); 
        this.load.image('player2', 'assets/menu/player2.png'); 
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

        // Character 1 (Mason)
        const character1 = this.add.image(centerX - 100, centerY, 'player1').setOrigin(0.5);
        character1.displayWidth = 80; 
        character1.displayHeight = 80; 
        this.add.text(centerX - 100, centerY + 50, 'Mason', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Character 2
        const character2 = this.add.image(centerX + 100, centerY, 'player2').setOrigin(0.5);
        character2.displayWidth = 80; 
        character2.displayHeight = 80; 
        this.add.text(centerX + 100, centerY + 50, 'Character 2', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Username input field
        this.add.text(centerX, centerY + 90, 'Enter Username:', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Create HTML input element
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.value = 'YourName';
        this.inputField.style.position = 'absolute';
        this.inputField.style.left = `${centerX + 190}px`; 
        this.inputField.style.top = `${centerY + 190}px`; 
        this.inputField.style.fontFamily = '"Press Start 2P"';
        this.inputField.style.fontSize = '20px';
        this.inputField.style.color = '#ffffff';
        this.inputField.style.backgroundColor = '#333333';
        this.inputField.style.border = 'none';
        this.inputField.style.padding = '5px';
        this.inputField.style.width = '250px'; 
        this.inputField.style.textAlign = 'center';
        document.body.appendChild(this.inputField); 

        // Play button
        const playButton = this.add.rectangle(centerX, centerY + 200, 120, 40, 0x00ff00);
        this.add.text(centerX, centerY + 200, 'Play', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '24px',
            fill: '#000000'
        }).setOrigin(0.5);

        playButton.setInteractive();
        playButton.on('pointerover', () => playButton.setFillStyle(0x00cc00)); 
        playButton.on('pointerout', () => playButton.setFillStyle(0x00ff00)); 

        playButton.on('pointerdown', () => this.startGame());
    }

    startGame() {
        const username = this.inputField.value;
        console.log(`Username: ${username}`); 

        this.scene.start('MyScene');
        
        document.body.removeChild(this.inputField);
    }
}
