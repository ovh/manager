import controller from './empty.controller';
import template from './empty.html';

export default {
  controller,
  template,
  transclude: true,
  bindings: {
    imageAlt: '<',
    imageSource: '<',
    guides: '<?',
    onGuideClick: '&?',
  },
};
