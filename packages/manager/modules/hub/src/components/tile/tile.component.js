import template from './tile.html';

export default {
  bindings: {
    badgeText: '@',
    buttonText: '@',
    heading: '@',
    href: '@',
    onClick: '&?',
    hideHeading: '<?',
  },
  template,
  transclude: true,
};
