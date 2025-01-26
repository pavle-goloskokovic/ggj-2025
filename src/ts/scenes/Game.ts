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

const bubbleSortStep = (arr: number[], j: number): boolean =>
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

console.log(bubbleSort([5, 3, 1, 4, 6]));

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

        const bars: Image[] = [];

        for (let i = 0; i < 100; i++)
        {
            bars.push(add.image(
                60 + 1 + i * 18,
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

        let ii = 0, jj = 0;
        const sortStepAnimated = () =>
        {
            this.time.addEvent({
                delay: 0,
                callback: () =>
                {
                    console.log(ii, jj);

                    if (ii === bars.length)
                    {
                        console.log('completed');
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
                            console.log('completed');
                            return;
                        }
                    }

                    sortStepAnimated();
                }
            });
        };
        sortStepAnimated();
    }
}
