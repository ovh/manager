import './spark-sizing.scss';
import controller from './spark-sizing.controller';
import template from './spark-sizing.html';

export default {
  template,
  controller,
  bindings: {
    values: '<',
    validate: '<',
    templates: '<',
    jobParameters: '<',
    projectId: '<',
    prices: '<',
    user: '<',
  },
};
