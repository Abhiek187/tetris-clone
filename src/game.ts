import 'phaser';

export default class Tetris extends Phaser.Scene {
    constructor () {
        super('tetris');
    }

    preload () {
        // Load all assets
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('libs', 'assets/libs.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create () {
        // Start the game scene
        this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        this.add.image(400, 300, 'libs');

        const logo = this.add.image(400, 70, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })
    }

    update() {
        // Check properties per frame
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Tetris
};

const game = new Phaser.Game(config);
