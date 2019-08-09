import './manager-preload.less';

const moduleName = 'ovhManagerPreload';

angular.module(moduleName, [
  'ui.router',
]).run(/* @ngInject */($rootScope, $transitions) => {
  $transitions.onFinish({}, () => {
    if (!_.includes($rootScope.managerPreloadHide, ' manager-preload-hide')) {
      $rootScope.managerPreloadHide += ' manager-preload-hide'; // eslint-disable-line
    }
  });
});

export default moduleName;
