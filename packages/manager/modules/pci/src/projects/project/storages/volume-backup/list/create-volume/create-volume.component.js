import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectId: '<',
    catalogEndpoint: '<',
    volumeBackups: '<',
    volumeBlockStorageLink: '<',
    volumeBackup: '<',
    volume: '<',
    volumePrice: '<',
    getVolumePriceEstimation: '<',
    startPolling: '<',
    goToVolumeBackups: '<',
    goBack: '<',
  },
  controller,
  template,
};

export default component;
