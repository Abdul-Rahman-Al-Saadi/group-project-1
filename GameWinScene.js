class GameWinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene' });
    }

    init(data) {
        // Access the username and score from the passed data
        this.username = data.username; 
        this.score = data.score; // Assuming score is passed as well
        console.log("Username in GameWinScene:", this.username); // Check if username is logged correctly
    }

    preload() {
        // Load the background image
        this.load.image('winBackground', 'assets/menu/win.avif');
        this.load.audio('winMusic', 'assets/audio/win.mp3'); // Adjust the path as necessary

    }

    create() {

        const winMusic = this.sound.add('winMusic');
        winMusic.play({ loop: true }); // Loop the music

        // Set the background color
        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // Set the background image and make it slightly darker
        const background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'winBackground')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        // Create a dark overlay to increase contrast
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.5); // 50% opacity
        overlay.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        // Display win message
        this.add.text(centerX, centerY - 100, 'YOU WON!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '64px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        // Display username
        this.add.text(centerX, centerY + 30, `Congratulations, ${this.username}!`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Display score
        this.add.text(centerX, centerY + 100, `Score: ${this.score}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Try again text with interactivity
        const tryAgainText = this.add.text(centerX, centerY + 150, 'TRY AGAIN', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        tryAgainText.setInteractive();

        // Add hover effects for the retry button
        tryAgainText.on('pointerover', () => {
            tryAgainText.setStyle({ fill: '#ff0000' }); // Change color on hover
            const background = this.add.graphics();
            background.fillStyle(0xffffff, 0.5); // Light background for hover effect
        });

        tryAgainText.on('pointerout', () => {
            tryAgainText.setStyle({ fill: '#ffffff' }); // Reset color on hover out
            // Clear the hover background
            this.children.each((child) => {
                if (child.type === 'Graphics' && child.fillColor === 0xffffff) {
                    child.clear();
                }
            });
        });

        tryAgainText.on('pointerdown', () => this.retry());

        this.input.keyboard.on('keydown-ENTER', () => this.retry());
    }

    retry() {
        console.log("Retrying game...");
        this.scene.start('MenuScene');
    }

    
}
