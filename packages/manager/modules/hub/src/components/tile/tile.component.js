import template from './tile.html';

export default {
  bindings: {
    badgeText: '@',
    buttonText: '@',
    heading: '@',
    href: '@',
    onClick: '&?',
    hideAction: '<?',
    hideHeading: '<?',
    isHrefExternal: '<?',
  },
  template,
  transclude: true,
};
