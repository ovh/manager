import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectId: '<',
    buildTaskResponse: '<',
    volumeBackup: '<',
    volume: '<',
    goToVolumeBlockStorage: '<',
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};

export default component;
