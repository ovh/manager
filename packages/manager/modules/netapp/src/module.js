import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';
import 'angular-translate';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import dashboard from './dashboard';
import onboarding from './onboarding';
import routing from './routing';

import './index.scss';

const moduleName = 'ovhManagerNetApp';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    onboarding,
    dashboard,
    'ngUiRouterLayout',
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'netapp.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
