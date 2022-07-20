import Button from './components/Button';
import Tag from './components/Tag';

export default {
  styles: {
    global: {
      '*': {
        fontFamily: 'Source Sans Pro',
      },
    },
  },
  colors: {
    uikit: {
      50: '#F5FEFF',
      75: '#DEF8FF',
      100: '#bef1ff',
      200: '#85D9FD',
      300: '#4BB2F6',
      400: '#157EEA',
      500: '#0050D7',
      600: '#002DBE',
      700: '#000E9C',
      800: '#00185E',
      900: '#000D1F',
      '800-text': '#4d5592',
    },
    gray: {
      50: '#f2f2f2',
      100: '#e6e6e6',
      200: '#ccc',
      300: '#b3b3b3',
      400: '#999',
      500: '#808080',
      600: '#666',
      700: '#4d4d4d',
      800: '#333',
      900: '#1a1a1a',
    },
    error: {
      100: '#faefef',
      300: '#ffd2dd',
      400: '#e0777c',
      500: '#c11b1b',
    },
    warning: {
      100: '#faf6ef',
      300: '#feea86',
      400: '#fa9b3e',
      500: '#8b6111',
    },
    success: {
      100: '#f3faef',
      300: '#dbf2bb',
      400: '#88c169',
      500: '#268403',
    },
    promotion: {
      300: '#ffd1f3',
      500: '#ac246f',
      700: '#770040',
      900: '#420023',
      '500-text': '#fbe155',
    },
    product: {
      alpha: '#fbff47',
      beta: '#47ff78',
      new: '#47fffa',
      soon: 'white',
      'price-drop': '#ffc800',
      'sold-out': '#d4d5de',
      'limited-edition': '#f40',
    },
    delivery: {
      '120s': '#268403',
      '24h': '#268403',
      '72h': '#b6c511',
      '10d': '#ffc800',
    },
  },
  components: {
    Button,
    Tag,
  },
};
