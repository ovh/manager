import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    tile: '?rightTile',
  },
  bindings: {
    logApiUrl: '<',
    logKindApiUrl: '<',
    logKeys: '<',
  },
};
