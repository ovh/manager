import angular from 'angular';
import _ from 'lodash';

import template from './tabs.html';

export default /* @ngInject */ function (Navigator, $rootScope) {
  return {
    restrict: 'E',
    template,
    scope: {
      tabs: '=',
      selectedTab: '=selectedTab',
      productType: '@product',
      setSelectedTab: '=changeTab',
      tr: '=',
      content: '=',
      menu: '=',
    },

    link(scope) {
      _.set(scope, 'isActive', tab => (scope.selectedTab === tab ? 'active' : ''));

      _.set(scope, 'execMenuAction', function execMenuAction(action) {
        switch (action.type) {
          case 'SWITCH_TABS':
            scope.setSelectedTab(action.target);
            break;
          case 'ACTION':
            if (angular.isFunction(action.fn)) {
              action.fn.call(this);
            }
            break;
          case 'SELECT_PRODUCT':
            if (action.disabled) {
              return;
            }
            $rootScope.$broadcast('leftNavigation.selectProduct.fromName', {
              name: action.name,
              type: action.productType,
            });
            scope.setSelectedTab(null);
            Navigator.navigate(action.target);
            break;
          default:
            break;
        }
      });
    },
  };
}
