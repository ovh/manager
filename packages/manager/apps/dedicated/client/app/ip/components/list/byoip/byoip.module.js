import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import service from './ip-ip-byoip.service';

import deleteController from './delete/ip-ip-byoip-delete.controller';
import deleteTemplate from './delete/ip-ip-byoip-delete.html';
import sliceController from './slice/ip-ip-byoip-slice.controller';
import sliceTemplate from './slice/ip-ip-byoip-slice.html';
import aggregateController from './aggregate/ip-ip-byoip-aggregate.controller';
import aggregateTemplate from './aggregate/ip-ip-byoip-aggregate.html';

const moduleName = 'ovhManagerIpDashboardByoip';

angular
  .module(moduleName, [ovhManagerCore])
  .controller('IpDeleteByoipCtrl', deleteController)
  .controller('IpSliceByoipCtrl', sliceController)
  .controller('IpAggregateByoipCtrl', aggregateController)
  .service('IpByoipService', service)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/byoip/slice/ip-ip-byoip-slice.html',
        sliceTemplate,
      );
      $templateCache.put(
        'ip/byoip/aggregate/ip-ip-byoip-aggregate.html',
        aggregateTemplate,
      );
      $templateCache.put(
        'ip/byoip/delete/ip-ip-byoip-delete.html',
        deleteTemplate,
      );
    },
  );

export default moduleName;
