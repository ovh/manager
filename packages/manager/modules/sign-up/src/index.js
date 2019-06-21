import angular from 'angular';

import form from './form';
import service from './service';
import signUpComponents from './components';

const moduleName = 'ovhSignUp';

angular
  .module(moduleName, [
    form,
    signUpComponents,
  ])
  .service('signUp', service);

export default moduleName;
