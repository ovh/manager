import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import addGroup from './addGroup';
import deleteGroup from './deleteGroup';
import linesGroup from './linesGroup';
import optionsGroup from './optionsGroup';

const moduleName =
  'ovhManagerTelecomTelephonyBillingAccountAdministrationLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    addGroup,
    deleteGroup,
    linesGroup,
    optionsGroup,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'telecom.telephony.billingAccount.administration.**',
        {
          url: '/administration',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return import(
              /* webpackChunkName: "administration" */ './administration.module'
            ).then((mod) => {
              return $ocLazyLoad.inject(mod.default || mod);
            });
          },
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations ./../billing/translations */);

export default moduleName;
