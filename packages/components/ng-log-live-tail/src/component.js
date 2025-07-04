import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    tile: '?tile',
    description: '?description',
    kinds: '?kinds',
  },
  bindings: {
    logApiUrl: '<',
    logKind: '<',
    logKeys: '<',
    apiVersion: '<?',
  },
};
