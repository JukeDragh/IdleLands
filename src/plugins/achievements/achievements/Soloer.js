
import { Achievement, AchievementTypes } from '../achievement';

export class Soloer extends Achievement {
  static achievementData(player) {

    const totalSoloCombats = player.$statistics.getStat('Combat.TimesSolo');

    if(totalSoloCombats < 5000) return [];

    return [{
      tier: 1,
      name: 'Soloer',
      desc: `Gain a special title (and +10% max item score) for ${(5000).toLocaleString()} solo battles.`,
      type: AchievementTypes.COMBAT,
      rewards: [{
        type: 'title',
        title: 'Soloer',
        deathMessage: '%player didn\'t have anyone to watch %hisher back and got stabbed in the back by a backstabbing backstabber.'
      }, {
        type: 'petattr',
        petattr: 'a shield that you probably need by now'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.1
      }]
    }];
  }
}
