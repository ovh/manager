import template from './tile.html';

export default {
  bindings: {
    badgeText: '@',
    buttonText: '@',
    heading: '@',
    href: '@',
    onClick: '&?',
  },
  template,
  transclude: true,
};
