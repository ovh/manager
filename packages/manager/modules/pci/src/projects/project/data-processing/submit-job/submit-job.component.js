import controller from './submit-job.controller';
import template from './submit-job.html';
import './submit-job.scss';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    capabilities: '<',
    goBack: '<',
    increaseQuotaLink: '<',
    prices: '<',
    user: '<',
  },
};
