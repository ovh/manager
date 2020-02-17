import angular from 'angular';
import translate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import './manager-preload.less';

const moduleName = 'ovhManagerHubPreload';

angular
  .module(moduleName, [translate, uiRouter])
  .run(
    /* @ngInject */ ($rootScope, $transitions) =>
      $transitions.onSuccess({}, () =>
        Object.assign($rootScope, {
          managerPreloadHide: 'manager-preload-hide',
        }),
      ),
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
