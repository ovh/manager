import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import dashboard from './dashboard';
import routing from './routing';

const moduleName = 'ovhManagerKycDocuments';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    dashboard,
    OnboardingLayoutHelper,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore(
        { to: 'account.kyc-documents.kyc-documents.**' },
        () => $translate.refresh(),
      );
    },
  );

export default moduleName;
