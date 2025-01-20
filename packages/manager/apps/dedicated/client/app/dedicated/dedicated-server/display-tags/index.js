import controller from './display-tags.controller';
import template from './template.html';

import { CONTROLLER_NAME, TEMPLATE_CACHE_KEY } from './display-tags.constants';

const moduleName = 'ovhManagerDedicatedServerDisplayTags';

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
