import publicOrder from './public-order';
import privateOrder from './private-order/private-order.module';

const moduleName = 'dedicatedClusterNodeBandwidth';

angular.module(moduleName, [publicOrder, privateOrder]);

export default moduleName;
