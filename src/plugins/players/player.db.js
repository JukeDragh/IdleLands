
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

@Dependencies(DbWrapper)
export class PlayerDb {
  constructor(dbWrapper) {
    this.dbWrapper = dbWrapper;
  }

  async getPlayer(opts) {
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;

    return new Promise((resolve, reject) => {
      players.find(opts).limit(1).next(async(err, doc) => {
        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        if(!doc) {
          return reject({ err, msg: MESSAGES.NO_PLAYER });
        }

        resolve(doc);
      });
    });
  }

  async getOffenses(ip) {
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;

    return new Promise((resolve, reject) => {
      players.find({ allIps: ip, isMuted: true }).limit(1).next(async(err, doc) => {
        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }
        resolve(doc);
      });
    });
  }

  async createPlayer(playerObject) {
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;
    
    return new Promise((resolve, reject) => {
      players.insertOne(playerObject, (err) => {
        if(err) return reject(err);
        resolve(playerObject);
      });
    });
  }

  async savePlayer(playerObject) {
    const savePlayerObject = playerObject.buildSaveObject();
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;

    return new Promise((resolve, reject) => {
      players.findOneAndUpdate({ _id: savePlayerObject._id }, savePlayerObject, { upsert: true }, (err) => {

        if(err) {
          return reject(err);
        }

        resolve(playerObject);
      }, reject);
    });
  }
}
