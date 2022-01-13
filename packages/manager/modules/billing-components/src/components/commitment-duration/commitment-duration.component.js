import controller from './commitment-duration.controller';
import template from './commitment-duration.html';

export default {
  bindings: {
    preselectDefault: '<?',
    defaultPrice: '<?',
    duration: '=',
    pricings: '<',
    fromCatalog: '<?',
    onDurationChange: '&',
  },
  controller,
  template,
};
