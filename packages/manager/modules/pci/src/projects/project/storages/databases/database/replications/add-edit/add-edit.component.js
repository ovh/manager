import controller from './add-edit.controller';
import template from './add-edit.html';
import './add-edit.scss';

export default {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    isUpdate: '<',
    replication: '<',
    kafkaSource: '<',
    policies: '<',
  },
  controller,
  template,
};
