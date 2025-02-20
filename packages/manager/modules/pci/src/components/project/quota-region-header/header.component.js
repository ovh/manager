import template from './header.html';
import controller from './header.controller';

export default {
  template,
  bindings: {
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    projectId: '<',
  },
  controller,
};
