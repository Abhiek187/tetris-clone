import 'phaser';

export default class Tetris extends Phaser.Scene {
    constructor() {
        super('tetris');
    }

    preload() {
        // Load all assets
        // Tetris board is 12x22 tiles, where each tile is 25 px, so width = 300 px & height = 550 px
        this.load.image('background', 'assets/Background.png');
        this.load.image('block1', 'assets/Block 1.png');
        this.load.image('block2', 'assets/Block 2.png');
        this.load.image('block3', 'assets/Block 3.png');
        this.load.image('block4', 'assets/Block 4.png');
        this.load.image('block5', 'assets/Block 5.png');
        this.load.image('block6', 'assets/Block 6.png');
        this.load.image('block7', 'assets/Block 7.png');
    }

    create() {
        // Start the game scene
        this.add.image(150, 275, 'background');
        this.add.image(50, 50, 'block1');
        this.add.image(50, 100, 'block2');
        this.add.image(50, 150, 'block3');
        this.add.image(50, 200, 'block4');
        this.add.image(50, 250, 'block5');
        this.add.image(50, 300, 'block6');
        this.add.image(50, 350, 'block7');
    }

    update() {
        // Check properties per frame
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 300,
    height: 550,
    scene: Tetris
};

const game = new Phaser.Game(config);
