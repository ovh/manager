import template from './pci-ai-data-sync.html';
import controller from './pci-ai-data-sync.controller';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    projectId: '<',
    dataSyncType: '<',
    currentDataSyncType: '<',
    volumeId: '<',
    directory: '<',
    goToDataSync: '<',
  },
};
