import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    cluster: '<',
    containersLink: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    nodePoolsLink: '<',
    serviceLink: '<',
    restrictionsLink: '<',
    restrictions: '<',
    auditLogsLink: '<',
  },
  template,
  controller,
};

export default component;
