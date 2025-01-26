import Phaser from 'phaser';
import Scene = Phaser.Scene;
import type { OcsSoundManager } from './Game';

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

export class End extends Scene {

    constructor () { super('end'); }

    create (): void
    {
        const add = this.add;
        const sound = this.sound as OcsSoundManager;

        const scale = this.scale;
        const x = scale.width / 2;
        const y = scale.height / 2;

        sound.osc.frequency.setValueAtTime(50, 0);

        const flash = add.image(x, y, 'sprites', 'white')
            .setDisplaySize(scale.width, scale.height);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });

        for (let i = 0; i < 100; i++)
        {
            const displayHeight = 200 + 5.4 * i - canopy[i];

            /*const bar =*/ add.image(
                60 + 9 + i * 18,
                800 - 30
                - (200 + 5.4 * i),
                'sprites', i === 99 ? 'red' : 'white')
                .setOrigin(0.5, 0)
                .setDisplaySize(
                    18 - 2,
                    // 200 + 5.4 * i/* - canopy[i]*/);
                    displayHeight);
            /*this.tweens.add({
                targets: bar,
                displayHeight,
                duration: 1500,
                ease: 'Sine.easeOut'
            });*/

            if (i === 99) { continue; }

            const blood = add.image(
                60 + 9 + i * 18,
                800 - 30
                - (200 + 5.4 * i),
                'sprites', 'red')
                .setOrigin(0.5, 0)
                .setDisplaySize(
                    18 - 2,
                    0);
            this.tweens.add({
                targets: blood,
                displayHeight,
                delay: 300 + Math.random() * 2000,
                duration: (25000 + 20000 * Math.random())
                    * displayHeight / 740,
                ease: 'Sine.easeOut'
            });
        }

        this.time.delayedCall(10000, () =>
        {
            sound.add('light', {
                loop: true,
            }).play();

            this.tweens.addCounter({
                duration: 2200,
                onUpdate: (t) =>
                {
                    sound.oscVolume.gain.setValueAtTime(
                        0.8 * (1 - t.getValue()), 0);
                }
            });
        });
    }
}
