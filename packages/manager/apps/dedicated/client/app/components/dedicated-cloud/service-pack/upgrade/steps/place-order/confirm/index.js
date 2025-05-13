import controller from './confirm.controller';
import template from './confirm.html';

import { CONTROLLER_NAME, TEMPLATE_CACHE_KEY } from './confirm.constants';

const moduleName = 'ovhManagerPccUpgradeServicePackPlaceOrderConfirm';

angular
  .module(moduleName, [])
  .controller(CONTROLLER_NAME, controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(TEMPLATE_CACHE_KEY, template);
    },
  );

export default moduleName;
