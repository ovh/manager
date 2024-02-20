import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    tile: '?tile',
    description: '?description',
  },
  bindings: {
    logApiUrl: '<',
    logKindApiUrl: '<',
    logKeys: '<',
  },
};
