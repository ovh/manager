import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectId: '<',
    volumeBackup: '<',
    startPolling: '<',
    goToVolumeBackups: '<',
    goBack: '<',
  },
  controller,
  template,
};

export default component;
