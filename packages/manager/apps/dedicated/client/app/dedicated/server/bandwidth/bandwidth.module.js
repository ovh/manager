import dashboard from './dashboard/dashboard.module';
import publicOrder from './public-order/public-order.module';
import publicCancel from './public-cancel/public-cancel.module';
import privateOrder from './private-order/private-order.module';
import privateCancel from './private-cancel/private-cancel.module';

const moduleName = 'dedicatedServerBandwidth';

angular.module(moduleName, [
  dashboard,
  publicOrder,
  publicCancel,
  privateOrder,
  privateCancel,
]);

export default moduleName;
