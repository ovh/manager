import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import rebootCtrl from './reboot/dedicated-housing-reboot.controller';
import rebootTpl from './reboot/dedicated-housing-reboot.html';

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
  .controller('HousingRebootCtrl', rebootCtrl)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'housing/reboot/dedicated-housing-reboot.html',
        rebootTpl,
      );
    },
  )
  .run(
    /* @ngInject */ ($translate, $transitions) => {
      $transitions.onBefore({ to: 'dedicated-housing.**' }, () =>
        $translate.refresh(),
      );
    },
  );

export default moduleName;
