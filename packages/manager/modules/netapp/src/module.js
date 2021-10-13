import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';
import '@ovh-ux/ng-ovh-feature-flipping';
import 'angular-translate';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import components from './components';
import dashboard from './dashboard';
import onboarding from './onboarding';
import order from './order';
import routing from './routing';

import './index.scss';

const moduleName = 'ovhManagerNetApp';

angular
  .module(moduleName, [
    components,
    'ngOvhFeatureFlipping',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    onboarding,
    order,
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
