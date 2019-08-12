import angular from 'angular';

import availableTypes from './availableTypes';
import register from './register';

const moduleName = 'ngOvhPaymentMethodComponents';

angular
  .module(moduleName, [
    availableTypes,
    register,
  ]);

export default moduleName;
