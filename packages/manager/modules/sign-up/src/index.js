import angular from 'angular';
import '@ovh-ux/manager-core';

import form from './form';
import service from './service';
import signUpComponents from './components';

const moduleName = 'ovhSignUp';

angular
  .module(moduleName, [
    form,
    signUpComponents,
  ])
  .service('signUp', service)
  .filter('translateDefault', /* @ngInject */ $translate => (translationKey, fallbackKey) => {
    const translation = $translate.instant(translationKey);
    return translationKey === translation ? $translate.instant(fallbackKey) : translation;
  });

export default moduleName;
