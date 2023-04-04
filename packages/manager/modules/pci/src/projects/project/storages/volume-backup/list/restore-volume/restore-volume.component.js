import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectId: '<',
    volumeBackup: '<',
    volume: '<',
    startPolling: '<',
    goToVolumeBackups: '<',
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};

export default component;
