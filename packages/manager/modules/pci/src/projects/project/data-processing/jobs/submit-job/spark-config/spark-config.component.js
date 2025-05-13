import './spark-config.scss';
import controller from './spark-config.controller';
import template from './spark-config.html';

export default {
  template,
  controller,
  bindings: {
    values: '<',
    validate: '<',
    valid: '=',
    projectId: '<',
    region: '<',
    onChangeHandler: '<',
    jobParameters: '<',
  },
};
