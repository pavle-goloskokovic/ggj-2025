import Phaser from 'phaser';
import Scene = Phaser.Scene;

const canopy: number[] = [];
for (let i = 0; i < 100; i++)
{
    const segment = 100 / 16;

    const progress = i / segment;
    const segmentIndex = Math.floor(progress);
    const isUp = segmentIndex % 2 === 0;

    const elevation = progress - segmentIndex;

    canopy.push(20 + (isUp ? elevation : 1 - elevation) * 70);
}

/**
 * Game Phaser scene.
 *
 * This is where all the logic for your game goes.
 */
export class Game extends Scene {

    constructor () { super('game'); }

    create (): void
    {
        console.info('Game enter');

        const scale = this.scale;
        const x = scale.width / 2;
        // const y = scale.height / 2;

        const add = this.add;

        add.image(x, 815, 'sprites', 'instructions');
        add.image(580, 950, 'sprites', 'odd');
        add.image(1340, 950, 'sprites', 'even');

        for (let i = 0; i < 100; i++)
        {
            add.image(
                60 + 1 + i * 18,
                800 - 30 - canopy[i],
                'sprites', i === 0 ? 'red' : 'white')
                .setOrigin(0.5, 1)
                .setDisplaySize(
                    18 - 2,
                    200 + 5.4 * i - canopy[i]);

            /*add.image(
                60 + 1 + i * 18,
                800 - 30,
                'sprites', 'red')
                .setOrigin(0.5, 1)
                .setDisplaySize(
                    18 - 2,
                    canopy[i]);*/
        }
    }
}
