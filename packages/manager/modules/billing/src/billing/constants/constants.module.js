import autorenewEvent from './autorenewEvent.constants';
import fedelityEvent from './fidelityEvent.constants';
import ovhAccountEvent from './ovhAccountEvent.constants';
import paymentEvent from './paymentEvent.constants';

const moduleName = 'ovhManagerBillingConstants';

angular.module(moduleName, [
  autorenewEvent,
  fedelityEvent,
  ovhAccountEvent,
  paymentEvent,
]);

export default moduleName;
