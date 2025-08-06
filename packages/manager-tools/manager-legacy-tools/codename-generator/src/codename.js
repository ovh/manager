const moment = require('moment');
const Combinator = require('./combinator');

module.exports = class Codename {
  constructor(sources, seed) {
    this.seed = seed;
    this.sources = sources;
    this.combinator = new Combinator(seed);
  }

  encode(date) {
    const message = moment(date).diff(moment().unix(0), 'weeks');
    const combinations = this.combinator.combinate(this.sources);
    return combinations[message % combinations.length];
  }
};
