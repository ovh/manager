import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import { ApiV2ListHelper } from '../../ng-apiv2-helper/src';

import dashboard from './dashboard';
import onboarding from './onboarding';
import routing from './routing';

const moduleName = 'ovhManagerVrackServices';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ngOvhUtils,
    onboarding,
    dashboard,
    ApiV2ListHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'app.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
