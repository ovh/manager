import includes from 'lodash/includes';

import './manager-preload.less';

const moduleName = 'ovhManagerPreload';

angular.module(moduleName, ['ui.router']).run(
  /* @ngInject */ ($rootScope, $transitions) => {
    $transitions.onFinish({}, () => {
      if (!includes($rootScope.managerPreloadHide, ' manager-preload-hide')) {
        // eslint-disable-next-line no-param-reassign
        $rootScope.managerPreloadHide += ' manager-preload-hide';
      }
    });
  },
);

export default moduleName;
