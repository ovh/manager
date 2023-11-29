import template from './data-sync.html';
import controller from './data-sync.controller';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    dataSyncType: '<',
    currentDataSyncType: '<',
    volumeId: '<',
    notebookId: '<',
    directory: '<',
  },
  template,
  controller,
};

export default component;
