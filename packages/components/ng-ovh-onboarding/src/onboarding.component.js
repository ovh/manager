import controller from './onboarding.controller';
import template from './onboarding.html';

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
