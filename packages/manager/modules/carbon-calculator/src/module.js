import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-feature-flipping';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import carbonCalculatorDashboard from './dashboard';
import routing from './routing';

const moduleName = 'ovhManagerCarbonCalculator';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    carbonCalculatorDashboard,
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'app.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
