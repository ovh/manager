import controller from './ai.controller';
import template from './ai.html';

export default {
  controller,
  template,
  bindings: {
    appsLink: '<',
    tokensLink: '<',
    currentActiveLink: '<',
    refreshState: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
};
