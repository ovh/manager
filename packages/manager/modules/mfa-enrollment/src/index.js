import angular from 'angular';
import 'angular-translate';

import component from './mfa-enrollment.component';
import './mfa-enrollment.less';

const moduleName = 'ovhManagerMfaEnrollment';
let alreadyShowMFA = false;

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('mfaEnrollment', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(($q, $state, OvhApiAuth) =>
    OvhApiAuth.v6()
      .shouldDisplayMFAEnrollment()
      .$promise.then((shouldDisplayMFA) => {
        if (
          (shouldDisplayMFA.value === 'true' ||
            shouldDisplayMFA.value === 'forced') &&
          !alreadyShowMFA
        ) {
          alreadyShowMFA = true;
          $state.go('app.mfaEnrollment', {
            forced: shouldDisplayMFA.value === 'forced',
          });
        }
      })
      .catch(() => $q.resolve()),
  );

export default moduleName;
