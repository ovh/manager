import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    cloudConnect: '<',
    guideUrl: '<',
    clearCache: '<',
    notifications: '<',
    isLogsAvailable: '<',
  },
  template,
  controller,
};
