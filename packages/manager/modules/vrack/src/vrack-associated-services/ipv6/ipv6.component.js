import controller from './ipv6.controller';
import template from './ipv6.html';
import './ipv6.less';

export default {
  controller,
  template,
  bindings: {
    loader: '=',
    isPending: '<',
    serviceName: '<',
    addSubnetModalContext: '=',
    deleteSubnetModalContext: '=',
    ip: '<',
  },
};
