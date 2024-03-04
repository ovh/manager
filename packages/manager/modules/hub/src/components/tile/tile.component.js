import template from './tile.html';

export default {
  bindings: {
    badgeText: '@',
    buttonText: '@',
    heading: '@',
    href: '@',
    onClick: '&?',
    onRefresh: '&?',
    hideAction: '<?',
    hideHeading: '<?',
    isHrefExternal: '<?',
  },
  template,
  transclude: true,
};
