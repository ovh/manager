import angular from 'angular';
import translate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import './manager-preload.less';

const moduleName = 'publicCloudManagerPreload';

angular
  .module(moduleName, [
    translate,
    uiRouter,
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(($rootScope, $transitions) => {
    $transitions.onSuccess({}, () => {
      $rootScope.managerPreloadHide = ' manager-preload-hide'; // eslint-disable-line no-param-reassign
    });
  });

export default moduleName;
