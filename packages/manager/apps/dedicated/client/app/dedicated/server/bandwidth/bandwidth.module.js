import dashboard from './dashboard/dashboard.module';
import publicOrder from './public-order/public-order.module';
import privateOrder from './private-order/private-order.module';

const moduleName = 'dedicatedServerBandwidth';

angular.module(moduleName, [dashboard, publicOrder, privateOrder]);

export default moduleName;
