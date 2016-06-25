
import _ from 'lodash';
import { World } from './world/world';
import { Logger } from '../shared/logger';

import { loadPlayer } from '../plugins/players/player.load';

// TODO store player hash in broker for maximum webscale
class GameStateInternal {
  constructor() {
    this.players = [];

    Logger.info('GameState', 'Creating world.');
    this.world = new World();
  }

  getPlayer(playerName) {
    return _.find(this.players, { name: playerName });
  }

  addPlayer(playerName) {
    return new Promise(async resolve => {
      if(this.getPlayer(playerName)) return resolve(false);
      const player = await this.retrievePlayer(playerName);

      // double check because async takes time
      if(this.getPlayer(playerName)) return resolve(false);

      this.players.push(player);
      resolve(player);
    })
  }

  delPlayer(playerName) {
    this.players = _.reject(this.players, player => player.name === playerName);
  }

  getPlayers() {
    return this.players;
  }

  retrievePlayer(playerName) {
    const playerObject = _.find(this.players, { name: playerName });
    if(playerObject) return playerObject;

    return loadPlayer(playerName);
  }
}

export const GameState = new GameStateInternal();