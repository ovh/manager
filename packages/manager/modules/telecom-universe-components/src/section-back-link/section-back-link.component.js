import template from './section-back-link.html';

export default {
  template,
  bindings: {
    toState: '@?tucSectionBackLinkToState',
    linkText: '@?tucSectionBackLinkTitle',
    onClick: '&?tucSectionBackLinkOnClick',
  },
};
