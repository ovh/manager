import angular from 'angular';

import form from './form';
import service from './service';

const moduleName = 'ovhSignUp';

angular
  .module(moduleName, [
    form,
  ])
  .service('signUp', service);

export default moduleName;
