import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import template from './cdn-dedicated-backend-order.html';
import controller from './cdn-dedicated-backend-order.controller';

const moduleName = 'cdnDedicatedBackendOrder';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .controller('BackendsAddCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cdn/dedicated/backend/order/cdn-dedicated-backend-order.html',
        template,
      );
    },
  );

export default moduleName;
