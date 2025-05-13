import controller from './indexes.controller';
import template from './indexes.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    indexesList: '<',
    patternsList: '<',
    deleteIndex: '<',
    deletePattern: '<',
    addPattern: '<',
  },
  controller,
  template,
};
