import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    accessPath: '<',
    currentActiveLink: '<',
    volumeDashboardLink: '<',
    volumeDashboardAclLink: '<',
    volume: '<',
    updateVolume: '<',
    goToVolumeDashboard: '<',
  },
  controller,
  template,
};
