import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import dashboard from './dashboard';
import onboarding from './onboarding';
import routing from './routing';

import './index.scss';

const moduleName = 'ovhManagerNetApp';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    onboarding,
    dashboard,
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
