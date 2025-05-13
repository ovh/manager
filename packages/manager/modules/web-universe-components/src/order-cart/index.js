import angular from 'angular';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';

import WucOrderCartService from './order-cart.service';

const moduleName = 'WucOrderCartService';

angular
  .module(moduleName, ['ovh-api-services', ngOvhPaymentMethod])
  .service('WucOrderCartService', WucOrderCartService);

export default moduleName;
