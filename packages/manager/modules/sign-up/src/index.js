import angular from 'angular';
import '@ovh-ux/manager-core';

import form from './form';
import service from './service';
import signUpComponents from './components';

const moduleName = 'ovhSignUp';

angular
  .module(moduleName, [form, signUpComponents])
  .service('signUp', service)
  .filter(
    'translateDefault',
    /* @ngInject */ ($translate) => (
      translationKey,
      fallbackKey,
      interpolateParams = {},
      interpolationId = undefined,
      forceLanguage = false,
      sanitizeStrategy = undefined,
    ) => {
      const translation = $translate.instant(
        translationKey,
        interpolateParams,
        interpolationId,
        forceLanguage,
        sanitizeStrategy,
      );

      return translationKey === translation
        ? $translate.instant(
            fallbackKey,
            interpolateParams,
            interpolationId,
            forceLanguage,
            sanitizeStrategy,
          )
        : translation;
    },
  );

export default moduleName;
