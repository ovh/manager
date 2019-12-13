import controller from './add.controller';
import template from './add.html';

import './styles.less';

export default {
  bindings: {
    serviceName: '<',
    partition: '<',
    goToPartitionAccessPage: '<',
  },
  controller,
  controllerAs: 'NashaPartitionAccessAddCtrl',
  template,
};
