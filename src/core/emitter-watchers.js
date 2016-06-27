
import { AdventureLog, MessageTypes } from '../shared/adventure-log';
import { GameState } from './game-state';
import { emitter as PlayerEmitter } from '../plugins/players/_emitter';
import { AllPlayers, PlayerLogin, PlayerLogout, PlayerUpdate } from '../shared/playerlist-updater';

PlayerEmitter.on('player:login', async ({ playerName }) => {
  const player = await GameState.addPlayer(playerName);
  if(!player) return;
  player.update();
  player.$statistics.incrementStat('Game.Logins');
  AllPlayers(playerName);
  PlayerLogin(playerName);
  AdventureLog({
    text: `Welcome ${player.name} back to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:register', async ({ playerName }) => {
  const player = await GameState.addPlayer(playerName);
  if(!player) return;
  player.update();
  player.$statistics.incrementStat('Game.Logins');
  AllPlayers(playerName);
  PlayerLogin(playerName);
  AdventureLog({
    text: `Welcome ${player.name} to Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:logout', ({ playerName }) => {
  PlayerLogout(playerName);
  AdventureLog({
    text: `${playerName} has departed Idliathlia!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: playerName }]
  });
  GameState.delPlayer(playerName);
});

// TODO update x,y AND title AND changeClass

PlayerEmitter.on('player:levelup', ({ player }) => {
  PlayerUpdate(player.name, ['name', 'level']);
  AdventureLog({
    text: `${player.name} has reached experience level ${player.level}!`,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });
});

PlayerEmitter.on('player:transfer', ({ player, dest }) => {
  PlayerUpdate(player.name, ['name', 'map']);

  let message = '';
  switch(dest.movementType) {
    case 'ascend':    message = `${player.name} has ascended to ${dest.destName}.`; break;
    case 'descend':   message = `${player.name} has descended to ${dest.destName}.`; break;
    case 'fall':      message = `${player.name} has fallen to ${dest.destName} from ${dest.fromName}.`; break;
    case 'teleport':  message = `${player.name} has been teleported to ${dest.destName} from ${dest.fromName}.`; break;
  }

  AdventureLog({
    text: message,
    type: MessageTypes.GLOBAL,
    highlights: [{ name: player.name }]
  });

});