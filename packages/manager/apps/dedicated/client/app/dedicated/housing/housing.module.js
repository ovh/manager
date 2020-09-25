import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './housing.routing';

const moduleName = 'ovhManagerDedicatedHousing';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    'ui.router',
  ])
  .config(routing)
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'dedicated-housing.**' }, () =>
        $translate.refresh(),
      );
    },
  );

export default moduleName;
