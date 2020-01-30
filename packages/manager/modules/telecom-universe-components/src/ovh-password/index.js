import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';
import 'angular-validation-match';
import 'ovh-ngstrap';

import tucOvhPasswordDirective from './ovh-password';
import tucOvhPasswordStrengthBarDirective from './strength/bar/ovh-password-strength-bar';
import tucOvhPasswordStrengthCheckDirective from './strength/check/ovh-password-strength-check';
import tucOvhPasswordStrengthCheckTemplate from './strength/check/ovh-password-strength-check.html';

import './ovh-password.less';

const moduleName = 'tucOvhPassword';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovh-ngStrap',
    translate,
    'validation.match',
  ])
  .directive('tucOvhPassword', tucOvhPasswordDirective)
  .directive('tucOvhPasswordStrengthBar', tucOvhPasswordStrengthBarDirective)
  .directive(
    'tucOvhPasswordStrengthCheck',
    tucOvhPasswordStrengthCheckDirective,
  )
  .config(
    /* @ngInject */ ($ovhpopoverProvider) => {
      angular.extend($ovhpopoverProvider.defaults, {
        animation: 'flat-fade',
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'telecomUniverseComponents/ovh-password/strength/check/ovh-password-strength-check.html',
        tucOvhPasswordStrengthCheckTemplate,
      );
    },
  );

export default moduleName;
