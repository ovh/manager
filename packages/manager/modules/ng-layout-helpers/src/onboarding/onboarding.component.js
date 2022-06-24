import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  controller,
  template,
  transclude: {
    title: '?onboardingTitle',
    description: '?onboardingDescription',
    footer: '?onboardingFooter',
  },
  bindings: {
    imageAlt: '<',
    imageSource: '<',
    guides: '<?',
    onGuideClick: '&?',
  },
};
