import angular from 'angular';

import integration from './integration';
import register from './register';

const moduleName = 'ngOvhPaymentMethodComponents';

angular
  .module(moduleName, [
    integration,
    register,
  ]);

export default moduleName;
