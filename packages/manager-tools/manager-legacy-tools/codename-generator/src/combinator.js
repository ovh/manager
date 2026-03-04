const shuffleSeed = require('shuffle-seed');
const titleize = require('titleize');

module.exports = class Combinator {
  constructor(seed = false) {
    this.seed = seed;
    if (!seed) {
      this.seed = 'RockPaperScissor';
    }
  }

  combinate(sources) {
    const combinations = [];
    const numList = sources.length;

    const combine = (list, index) => {
      for (let j = 0; j < sources[index].length; j += 1) {
        const item = list.slice(0);
        item.push(titleize(sources[index][j]));

        if (index === numList - 1) {
          combinations.push(item);
        } else {
          combine(item, index + 1);
        }
      }
    };

    combine([], 0);

    return shuffleSeed.shuffle(
      combinations.map((combination) => combination.join(' ')),
      this.seed,
    );
  }
};
