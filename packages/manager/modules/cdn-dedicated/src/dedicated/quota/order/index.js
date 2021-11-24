import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import service from './cdn-dedicated-quota-order.service';
import template from './cdn-dedicated-quota-order.html';
import controller from './cdn-dedicated-quota-order.controller';

const moduleName = 'cdnDedicatedQuotaOrder';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .service('cdnDedicatedOrderQuota', service)
  .controller('OrderQuotaCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/quota/order/cdn-dedicated-quota-order.html',
        template,
      );
    },
  );

export default moduleName;
