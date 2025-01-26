import Phaser from 'phaser';
import Scene = Phaser.Scene;
import type { OcsSoundManager } from './Game';
import Image = Phaser.GameObjects.Image;

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
                duration: (27000 + 20000 * Math.random())
                    * displayHeight / 740,
                ease: 'Sine.easeOut'
            });
        }

        const delay = 9000;
        const loopDur = 3900;

        this.time.delayedCall(delay, () =>
        {
            let lightLoops = 0;
            const light = sound.add('light', {
                loop: true,
            });
            light.on('looped', () =>
            {
                lightLoops++;

                if (lightLoops === 4)
                {
                    light.stop();

                    sound.play('future');

                    this.time.delayedCall(11600, () =>
                    {
                        // this.cameras.main.setPosition(x, y);
                        this.cameras.main.panEffect.reset();
                        this.cameras.main.pan(x, y, 0);

                        this.children.removeAll();

                        const caci = add.image(x,y, 'sprites', 'caci');

                        this.time.delayedCall(400, () =>
                        {
                            caci.destroy();
                        });
                    });
                }
            });
            light.play();

            this.tweens.addCounter({
                duration: 2200,
                onUpdate: (t) =>
                {
                    sound.oscVolume.gain.setValueAtTime(
                        0.8 * (1 - t.getValue()), 0);
                }
            });
        });

        const people: Image[] = [];

        this.time.delayedCall(delay, () =>
        {
            const p = add
                .image(x, scale.height * 1.4, 'sprites', 'white')
                .setDisplaySize(16, 100);

            this.tweens.add({
                targets: p,
                y: scale.height * 0.85,
                duration: 2500,
                ease: 'Back.easeOut'
            });

            people.push(p);
        });

        this.time.delayedCall(delay + loopDur, () =>
        {
            const p = add
                .image(scale.width * 0.65, scale.height * 1.4, 'sprites', 'white')
                .setDisplaySize(16, 100);

            this.tweens.add({
                targets: p,
                y: scale.height * 0.87,
                duration: 2500,
                ease: 'Back.easeOut'
            });

            people.push(p);
        });

        this.time.delayedCall(delay + loopDur, () =>
        {
            this.cameras.main.pan(x, scale.height * 5,
                80000,
                'Sine.easeInOut'
            );
        });

        this.time.delayedCall(delay + loopDur * 1.7, () =>
        {
            for (let i = 0; i < 200; i++)
            {
                const p = add
                    .image(scale.width * Math.random(),
                        scale.height * (1.2 + 0.3 * Math.random()),
                        'sprites', 'white')
                    .setDisplaySize(16, 100);

                this.tweens.add({
                    targets: p,
                    y: scale.height * (0.85 + 0.2 * Math.random()),
                    delay: 400 * Math.random(),
                    duration: 4000,
                    ease: 'Sine.easeOut'
                });

                people.push(p);
            }
        });

        this.time.delayedCall(delay + loopDur * 1.7, () =>
        {
            for (let i = 0; i < 1000; i++)
            {
                const p = add
                    .image(scale.width * Math.random(),
                        scale.height * (2 + Math.random()),
                        'sprites', 'white')
                    .setDisplaySize(16, 100);

                this.tweens.add({
                    targets: p,
                    y: scale.height * (1 + 1 * Math.random()),
                    delay: 500 * Math.random(),
                    duration: 8000,
                    ease: 'Sine.easeOut'
                });

                people.push(p);
            }
        });
    }
}
