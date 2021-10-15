import controller from './add-edit.controller';
import template from './add-edit.html';

export default {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    isUpdate: '<',
    replication: '<',
    kafkaSource: '<',
  },
  controller,
  template,
};
