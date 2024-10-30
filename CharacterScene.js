class CharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterScene' });
    }

    preload() {
        this.load.image('mason', 'assets/menu/player1.png'); 
        this.load.image('lily', 'assets/menu/player2.png'); 
    }

    create() {
        
        this.cameras.main.setBackgroundColor('#000000');

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        this.selectedCharacter = null;

        // Character selection title
        this.add.text(centerX, centerY - 150, 'What Kind of Hero are You?', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Character 1 (Mason)
        const character1 = this.add.image(centerX - 100, centerY, 'mason').setOrigin(0.5);
        character1.displayWidth = 80; 
        character1.displayHeight = 80; 
        this.add.text(centerX - 100, centerY + 50, 'Mason', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        character1.setInteractive();
        character1.on('pointerdown', () => {
            this.selectedCharacter = 'mason';
            console.log('Selected Character: Mason');
            character1.setTint(0x00ff00);  
            character2.clearTint();  

            character2.input.enabled = false; 
        });

        // Character 2 (Lily)
        const character2 = this.add.image(centerX + 100, centerY, 'lily').setOrigin(0.5);
        character2.displayWidth = 80; 
        character2.displayHeight = 80; 
        this.add.text(centerX + 100, centerY + 50, 'Lily', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        character2.setInteractive();
        character2.on('pointerdown', () => {
            this.selectedCharacter = 'lily';
            console.log('Selected Character: Lily');
            character2.setTint(0x00ff00); 
            character1.clearTint();  

            character1.input.enabled = false; 
        });

        this.add.text(centerX, centerY + 90, 'Enter Username:', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const placeHolder = 'Enter your name';

        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.value = 'YourName';
        this.inputField.style.position = 'absolute';
        this.inputField.style.left = `${centerX + 80}px`; 
        this.inputField.style.top = `${centerY + 120}px`; 
        this.inputField.style.fontFamily = '"Press Start 2P"';
        this.inputField.style.fontSize = '12px';
        this.inputField.style.color = '#ffffff';
        this.inputField.style.backgroundColor = '#333333';
        this.inputField.style.border = 'none';
        this.inputField.style.padding = '5px';
        this.inputField.style.width = '250px'; 
        this.inputField.style.textAlign = 'center';
        document.body.appendChild(this.inputField); 

        this.errorMessage = this.add.text(centerX, centerY + 250, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            fill: '#ff0000'
        }).setOrigin(0.5);

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

        this.playButton = playButton;
    }

    startGame() {
        const username = this.inputField.value.trim();

        if (!this.selectedCharacter) {
            this.errorMessage.setText('Please select a character before playing.');
            return;
        }
        if (username === '' || username === 'YourName') {
            this.errorMessage.setText('Please enter a valid username before playing.');
            return;
        }

        this.errorMessage.setText('');
        console.log(`Username: ${username}`);
        console.log(`Selected Character: ${this.selectedCharacter}`);
        // this.events.emit('startGame', username);

        this.scene.start('MyScene', { selectedCharacter: this.selectedCharacter, username: username });
        document.body.removeChild(this.inputField);
    }
}
