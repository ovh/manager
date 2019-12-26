import angular from 'angular';
import translate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import './manager-preload.less';

const moduleName = 'publicCloudManagerPreload';

angular
  .module(moduleName, [translate, uiRouter])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($rootScope, $transitions) =>
      $transitions.onSuccess({}, () =>
        Object.assign($rootScope, {
          managerPreloadHide: 'manager-preload-hide',
        }),
      ),
  );

export default moduleName;
