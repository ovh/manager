import './job-details.scss';
import controller from './job-details.controller';
import template from './job-details.html';

export default {
  template,
  controller,
  bindings: {
    job: '<',
    projectId: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
};
