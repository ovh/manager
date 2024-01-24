import template from './activate-project-banner.html';
import controller from './activate-project-banner.controller';
import './index.scss';

export default {
  template,
  controller,
  bindings: {
    trackingPageName: '<',
    onClick: '<',
  },
};
