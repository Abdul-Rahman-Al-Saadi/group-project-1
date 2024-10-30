class CharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterScene' });
    }

    preload() {
        // Load character images
        this.load.image('player1', 'assets/menu/player1.png'); // Update the path as needed
        this.load.image('player2', 'assets/characters/player2.png'); // Update the path as needed
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
        character1.displayWidth = 80; // Set desired width
        character1.displayHeight = 80; // Set desired height
        this.add.text(centerX - 100, centerY + 50, 'Mason', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Character 2
        const character2 = this.add.image(centerX + 100, centerY, 'player2').setOrigin(0.5);
        character2.displayWidth = 80; // Set desired width
        character2.displayHeight = 80; // Set desired height
        this.add.text(centerX + 100, centerY + 50, 'Character 2', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Username input field
        this.add.text(centerX, centerY + 100, 'Enter Username:', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Create HTML input element
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.value = 'YourName';
        this.inputField.style.position = 'absolute';
        this.inputField.style.left = `${centerX + 190}px`; // Center the input
        this.inputField.style.top = `${centerY + 150}px`; // Adjusted vertical position
        this.inputField.style.fontFamily = '"Press Start 2P"';
        this.inputField.style.fontSize = '20px';
        this.inputField.style.color = '#ffffff';
        this.inputField.style.backgroundColor = '#333333';
        this.inputField.style.border = 'none';
        this.inputField.style.padding = '5px';
        this.inputField.style.width = '100px'; // Set a fixed width for better alignment
        document.body.appendChild(this.inputField); // Add input to the document body

        // Play button
        const playButton = this.add.rectangle(centerX, centerY + 200, 120, 40, 0x00ff00);
        this.add.text(centerX, centerY + 200, 'Play', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '24px',
            fill: '#000000'
        }).setOrigin(0.5);

        playButton.setInteractive();
        playButton.on('pointerover', () => playButton.setFillStyle(0x00cc00)); // Change color on hover
        playButton.on('pointerout', () => playButton.setFillStyle(0x00ff00)); // Reset color on hover out

        // Add input listener for play button click
        playButton.on('pointerdown', () => this.startGame());
    }

    startGame() {
        // Optionally, retrieve the username from the input field
        const username = this.inputField.value;
        console.log(`Username: ${username}`); 

        this.scene.start('MyScene');
        
        // Clean up input field after starting the game
        document.body.removeChild(this.inputField);
    }
}
