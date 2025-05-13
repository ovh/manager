export const CONFIG = {
  taxCoefficient: 1.2,

  fillType: ['gradient', 'simple', 'black'],

  numberFormat: [
    '0 8AB XXX XXX',
    '0 8AB XX XX XX',
    '0 8AB XX XXXX',
    '0 8AB XXXX XX',
    '08 AB XX XX XX',
  ],

  scale: {
    '14pt': {
      assetsPath: 'assets/images/sva/14pt/',
      fontAdvance: 32,
      fontSmallAdvance: 17,
      templateCenter: {
        gradient: [203, 48],
        simple: [203, 41],
        black: [203, 41],
      },
      templatePricePosition: {
        gradient: [538, 15],
        simple: [545, 8],
        black: [545, 8],
      },
    },
  },

  colors: {
    hex: {
      free: '#78b41e',
      common: '#91919b',
      pay: '#a50f78',
    },
    rgb: {
      free: [120, 180, 30],
      common: [145, 145, 155],
      pay: [165, 15, 120],
    },
  },
};

export default {
  CONFIG,
};
