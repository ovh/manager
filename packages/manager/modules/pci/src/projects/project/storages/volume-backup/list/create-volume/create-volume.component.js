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
  },
  controller,
  template,
};

export default component;
