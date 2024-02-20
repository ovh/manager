import template from './activate-project-banner.html';
import controller from './activate-project-banner.controller';

export default {
  template,
  controller,
  bindings: {
    trackingPageName: '@',
    onClick: '&',
  },
};
