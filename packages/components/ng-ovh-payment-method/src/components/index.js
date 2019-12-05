import angular from 'angular';

import choice from './choice';
import integration from './integration';
import register from './register';

const moduleName = 'ngOvhPaymentMethodComponents';

angular
  .module(moduleName, [
    choice,
    integration,
    register,
  ]);

export default moduleName;
