/**
 * Game entry point
 */

import '../css/style.css'; // loading css

import Phaser from 'phaser';
import PhaserGame = Phaser.Game;
import GameConfig = Phaser.Types.Core.GameConfig;
import FIT = Phaser.Scale.ScaleModes.FIT;
import CENTER_BOTH = Phaser.Scale.CENTER_BOTH;

import { size, stats } from './game.config';

import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Game } from './scenes/Game';
import { End } from './scenes/End';

const config: GameConfig = {
    parent: 'container', // parent id - '' means  no container
    scale: {
        width: size.w,
        height: size.h,
        mode: FIT,
        autoCenter: CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        Game,
        End
    ],
    loader: {
        maxRetries: 10
    }
};

// Choosing implementation based on 'stats' app config setting
if (process.env.NODE_ENV !== 'production' && stats)
{
    const { PhaserStatsGame } = require('./classes/PhaserStatsGame');
    new PhaserStatsGame(config);
}
else
{
    new PhaserGame(config);
}
