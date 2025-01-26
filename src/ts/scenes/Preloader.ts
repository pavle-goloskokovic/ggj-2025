import Phaser from 'phaser';
import Scene = Phaser.Scene;
import spritesData from '../../data/sprites.json';

/**
 * Preloader Phaser scene.
 *
 * This is where we load all the assets including images,
 * sounds and all relevant data before starting the game.
 */
export class Preloader extends Scene {

    constructor () { super('preloader'); }

    preload (): void
    {
        console.info('Preloader enter');

        // TODO preload assets

        this.load
            .audio('win',
                require('../../assets/audio/win.mp3'))
            .atlas('sprites',
                require('../../assets/images/sprites.png'),
                spritesData)
            .font('font1',
                require('../../assets/fonts/PFEncoreSansPro-Bold.ttf'),
                'truetype');
    }

    create (): void
    {
        console.info('Preloader leave');

        this.scene.start('game');
    }

}
