import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectId: '<',
    catalogEndpoint: '<',
    volumeBackups: '<',
    buildTaskResponse: '<',
    volumeBackup: '<',
    volume: '<',
    volumePrice: '<',
    getVolumePriceEstimation: '<',
    goToVolumeBlockStorage: '<',
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};

export default component;
