import angular from 'angular';
import 'angular-translate';

import component from './component';
import filter from './filter';
import tooltipTemplate from './tooltip.html';

import './index.less';

const moduleName = 'cucCloudSpaceMeterSpaceLeft';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('cucSpaceMeterSpaceLeft', component)
  .filter('cucSpaceMeterSpaceLeft', filter)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'cucCloudSpaceMeterSpaceLeft/tooltip.html',
        tooltipTemplate,
      );
    },
  );

export default moduleName;
