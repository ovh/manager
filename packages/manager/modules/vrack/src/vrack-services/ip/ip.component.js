import controller from './ip.controller';
import template from './ip.html';
import './ip.less';

export default {
  controller,
  template,
  bindings: {
    openAddModal: '&',
    refreshData: '&',
    serviceName: '<',
    ip: '<',
  },
};
