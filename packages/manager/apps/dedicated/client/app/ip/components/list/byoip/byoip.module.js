import angular from 'angular';
import service from './ip-ip-byoip.service';

import sliceController from './slice/ip-ip-byoip-slice.controller';
import sliceTemplate from './slice/ip-ip-byoip-slice.html';
import aggregateController from './aggregate/ip-ip-byoip-aggregate.controller';
import aggregateTemplate from './aggregate/ip-ip-byoip-aggregate.html';

const moduleName = 'ovhManagerIpDashboardByoip';

angular
  .module(moduleName, [])
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
    },
  );

export default moduleName;
