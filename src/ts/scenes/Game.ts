import Phaser from 'phaser';
import Scene = Phaser.Scene;
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

const shuffle = function (array: Image[])
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const temp = array[i];
        const x = temp.x;

        const j = Math.floor(Math.random() * (i + 1));

        array[i].x = array[j].x;
        array[j].x = x;

        array[i] = array[j];
        array[j] = temp;
    }

    return array;
};

/*const bubbleSortStep = (arr: number[], j: number): boolean =>
{
    if (arr[j] > arr[j + 1])
    {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        return true;
    }

    return false;
};

const bubbleSort = (arr: number[]): number[] =>
{
    const len = arr.length;

    for (let i = 0; i < len - 1; i++)
    {
        for (let j = 0; j < len - i - 1; j++)
        {
            bubbleSortStep(arr, j);
        }
    }

    return arr;
};

console.log(bubbleSort([5, 3, 1, 4, 6]));*/

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

        const instructions = add.image(x, 815,
            'sprites', 'instructions');
        const fadeInstructions = () =>
        {
            if (instructions.alpha < 1) { return; }

            this.tweens.add({
                targets: instructions,
                alpha: 0,
                duration: 1000,
                onComplete: () =>
                {
                    instructions.visible = false;
                }
            });
            this.tweens.add({
                targets: scoreText,
                alpha: 1,
                delay: 1000,
                duration: 1000
            });
        };

        const odd = add.image(580, 950, 'sprites', 'odd')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () =>
            {
                if (odd.alpha < 1) { return; }

                this.tweens.add({
                    targets: [odd, even],
                    alpha: 0.3,
                    duration: 200
                });

                bet = 1;

                play();
            })
            .once('pointerdown', fadeInstructions);

        const even = add.image(1340, 950, 'sprites', 'even')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () =>
            {
                if (even.alpha < 1) { return; }

                this.tweens.add({
                    targets: [odd, even],
                    alpha: 0.3,
                    duration: 200
                });

                bet = 0;

                play();
            })
            .once('pointerdown', fadeInstructions);

        const play = () =>
        {
            // shuffle(bars);

            iterations = ii = jj = 0;

            this.events.on('update', animationUpdate);
        };

        const endPlay = () =>
        {
            // console.log('completed', iterations);

            // const oldIterations = iterations;
            const oldScore = score;
            const delta = iterations % 2 === bet ?
                iterations : -iterations;

            this.tweens.addCounter({
                duration: 2000,
                ease: 'Quart.easeOut',
                onUpdate: (t) =>
                {
                    const val = t.getValue();
                    // iterations = Math.round(oldIterations - val * delta);
                    score = Math.round(oldScore + val * delta);
                    updateText();
                },
                onComplete: () =>
                {
                    // iterations = 0;
                    score = oldScore + delta;
                    updateText();

                    this.time.delayedCall(500, advance);
                }
            });

            this.events.off('update', animationUpdate);
        };

        const advance = () =>
        {
            let i = 0;
            while (bars[i].frame.name !== 'red')
            {
                i++;
            }

            const repeat = Math.min(23, bars.length - 1 - i);

            const ended = i + repeat + 1 === bars.length;

            const next = () =>
            {
                for (let j = i; j < i + repeat + 1; j++)
                {
                    this.tweens.add({
                        targets: bars[j],
                        displayHeight: 200 + 5.4 * j/* - canopy[j]*/,
                        duration: ended ? 2000 : 1000,
                        ease: /*ended ?*/ 'Quad.easeOut' /*: 'Linear'*/,
                        onComplete: () =>
                        {
                            if (j === i) // only once
                            {
                                if (ended)
                                {
                                    console.log('ENDED');

                                    return;
                                }

                                this.tweens.add({
                                    targets: bars,
                                    alpha: 0,
                                    delay: 500,
                                    duration: 500,
                                    onComplete: () =>
                                    {
                                        shuffle(bars);
                                    }
                                });

                                this.tweens.add({
                                    targets: bars,
                                    alpha: 1,
                                    delay: 500 + 550,
                                    duration: 600,
                                    onComplete: () =>
                                    {
                                        this.tweens.add({
                                            targets: [odd, even],
                                            alpha: 1,
                                            duration: 500
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            };

            if (ended)
            {
                this.tweens.add({
                    targets: [odd, even, scoreText],
                    alpha: 0,
                    duration: 2000
                });
            }

            if (repeat)
            {
                const delay = 3000 / repeat;

                for (let j = i; j < i + repeat; j++)
                {
                    this.time.addEvent({
                        delay: (j - i) * delay,
                        callback: () =>
                        {
                            const temp = bars[j];
                            const x = temp.x;

                            bars[j].x = bars[j + 1].x;
                            bars[j + 1].x = x;

                            bars[j] = bars[j + 1];
                            bars[j + 1] = temp;
                        }
                    });
                }

                this.time.addEvent({
                    delay: repeat * delay,
                    callback: next
                });
            }
            else
            {
                next();
            }
        };

        const bars: Image[] = [];

        for (let i = 0; i < 100; i++)
        {
            bars.push(add.image(
                60 + 9 + i * 18,
                800 - 30/* - canopy[i]*/,
                'sprites', i === 0 ? 'red' : 'white')
                .setOrigin(0.5, 1)
                .setDisplaySize(
                    18 - 2,
                    200 + 5.4 * i/* - canopy[i]*/)
            );

            /*add.image(
                60 + 1 + i * 18,
                800 - 30,
                'sprites', 'red')
                .setOrigin(0.5, 1)
                .setDisplaySize(
                    18 - 2,
                    canopy[i]);*/
        }

        const scoreText = add.text(x, 815, '', {
            fontFamily: 'font1',
            align: 'center',
            fontSize: 40,
            shadow: {
                blur: 10,
                fill: true,
                offsetX: 5,
                offsetY: 5
            } })
            .setOrigin(0.5)
            .setAlpha(0);

        shuffle(bars);

        const bubbleSortStepImage = (arr: Image[], j: number): boolean =>
        {
            if (arr[j].displayHeight > arr[j + 1].displayHeight)
            {
                const temp = arr[j];
                const x = temp.x;

                arr[j].x = arr[j + 1].x;
                arr[j + 1].x = x;

                arr[j] = arr[j + 1];
                arr[j + 1] = temp;

                return true;
            }

            return false;
        };

        let bet = -1;
        let score = 0;
        let iterations = 0;
        let ii = 0, jj = 0;
        const animationUpdate = () =>
        {
            let processed = 0;

            while (processed < 7)
            {
                console.log(ii, jj);

                if (ii === bars.length)
                {
                    endPlay();
                    return;
                }

                while (!bubbleSortStepImage(bars, jj))
                {
                    jj++;

                    if (jj === bars.length - 1)
                    {
                        ii++;
                        jj = 0;
                    }

                    if (ii === bars.length)
                    {
                        endPlay();
                        return;
                    }
                }

                processed++;
            }

            iterations += processed;

            updateText();
        };

        const updateText = () =>
        {
            scoreText.setText(
                `ITERATIONS: ${iterations} | ` +
                `SCORE: ${score}`);
        };
        updateText();
    }
}
