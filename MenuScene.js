// class MenuScene extends Phaser.Scene {
//     constructor() {
//         super({ key: 'MenuScene' });
//         this.menuAudio = null; 
//     }

//     preload() {
//         this.load.image('menuBackground', 'assets/menu/background.jpg');

//         // this.load.audio('menuAudio', 'assets/audio/menu-audio.mp3');
//     }

//     create() {
//         const background = this.add.image(0, 0, 'menuBackground').setOrigin(0, 0);
//         background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

//         // Centering constants for a retro 90s look
//         const centerX = this.sys.game.config.width / 2;
//         const centerY = this.sys.game.config.height / 2;

//         // Title text
//         this.add.text(centerX, centerY - 100, 'Dungeon Crawler', {
//             fontFamily: '"Press Start 2P"',
//             fontSize: '64px',
//             fill: '#ffffff'
//         }).setOrigin(0.5);

//         // Start game text with interaction
//         const startText = this.add.text(centerX, centerY + 100, 'Start Game', {
//             fontFamily: '"Press Start 2P"', 
//             fontSize: '32px',
//             fill: '#ffffff'
//         }).setOrigin(0.5);

//         startText.setInteractive();
//         startText.on('pointerdown', () => this.startGame()); // Call startGame method

//         // Allow Enter key to start the game
//         this.input.keyboard.on('keydown-ENTER', () => this.startGame()); // Call startGame method

//         // Play the menu audio
//         /*
//         this.menuAudio = this.sound.add('menuAudio', { loop: true }); 
//         this.menuAudio.play();
//         */
//     }

    
//     startGame() {
//         this.scene.start('CharacterScene'); 
//     }
    
// }
