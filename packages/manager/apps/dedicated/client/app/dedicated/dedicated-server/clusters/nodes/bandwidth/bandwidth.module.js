import publicOrder from './public-order/public-order.module';
import privateOrder from './private-order/private-order.module';

const moduleName = 'dedicatedClusterNodeBandwidth';

angular.module(moduleName, [publicOrder, privateOrder]);

export default moduleName;
