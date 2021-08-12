import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    accessPath: '<',
    currentActiveLink: '<',
    volumeDashboardLink: '<',
    volume: '<',
    updateVolume: '<',
    goToVolumeDashboard: '<',
  },
  controller,
  template,
};
