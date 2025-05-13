import controller from './empty.controller';
import template from './empty.html';

export default {
  controller,
  template,
  transclude: true,
  bindings: {
    imageSource: '<',
    guides: '<?',
    onGuideClick: '&',
  },
};
