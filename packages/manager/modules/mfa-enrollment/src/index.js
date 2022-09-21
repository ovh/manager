import angular from 'angular';
import 'angular-translate';

import component from './mfa-enrollment.component';
import './mfa-enrollment.less';

const moduleName = 'ovhManagerMfaEnrollment';
const alreadyShowMFA = false;
let alreadyRedirectedToMFA = false;

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('mfaEnrollment', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($q, $state, $transitions, $location, OvhApiAuth) =>
      OvhApiAuth.v6()
        .shouldDisplayMFAEnrollment()
        .$promise.then((shouldDisplayMFA) => {
          const { voucher, category, target } = $location.search();
          const isRedirectionRequired = voucher || (category && target);

          if (
            !isRedirectionRequired &&
            !alreadyShowMFA &&
            ['true', 'forced'].includes(shouldDisplayMFA.value)
          ) {
            const redirectToMFA = () => {
              if (!alreadyRedirectedToMFA) {
                alreadyRedirectedToMFA = true;
                return $state.go('app.mfaEnrollment', {
                  forced: shouldDisplayMFA.value === 'forced',
                });
              }
              return $q.resolve();
            };

            if ($state.current.name === '') {
              $transitions.onSuccess({}, () => {
                if (!$state.is('app.account.user.security.mfa')) {
                  redirectToMFA();
                }
              });
            } else {
              redirectToMFA();
            }
          }

          return shouldDisplayMFA;
        })
        .catch(() => $q.resolve()),
  );

export default moduleName;
