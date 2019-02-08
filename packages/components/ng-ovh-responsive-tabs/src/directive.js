import angular from 'angular';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import has from 'lodash/has';
import includes from 'lodash/includes';
import map from 'lodash/map';

import controller from './controller';
import template from './template.html';

export default /* @ngInject */ (
  $window,
  $state,
  $transitions,
) => ({
  restrict: 'AE',
  replace: true,
  transclude: true,
  template,
  controller,
  scope: {
    immovable: '@',
    justified: '@',
    vertical: '@',
  },
  link($scope, elm, attrs, tabsetCtrl) {
    const $wdw = $($window);
    const $root = $(elm);

    // Get (array) the size of the tabs, without the "more" tab
    const getTabsSize = () => {
      tabsetCtrl.setTabs(
        map(tabsetCtrl.tabs, (tab) => {
          tab.$tab.removeClass('hidden');
          return {
            ...tab,
            hidden: false,
          };
        }),
      );

      return filter(
        map(tabsetCtrl.tabs, tab => tab.$tab.width()),
        size => size > 0,
      );
    };

    // Get the size of the "more" tab
    const getMoreTabSize = () => {
      if (has(tabsetCtrl.tabMore, '$tab')) {
        tabsetCtrl.tabMore.$tab.removeClass('hidden'); // Well..., an other one: <(^.^)>
        return tabsetCtrl.tabMore.$tab.width();
      }
      return 0;
    };

    // Return an array of the visible elements
    const getVisibleTabs = (maxWidth, activeTabIndex) => {
      const visibleTabs = [];
      const tabsSize = getTabsSize();

      // Sum of visibles elements
      let sum = getMoreTabSize() + 40; // 40px: scrollbar tolerance

      // If not immovable, always make the active element visible
      if (!$scope.immovable) {
        sum += tabsSize[activeTabIndex];
        visibleTabs.push(activeTabIndex);
      }

      forEach(tabsetCtrl.tabs, (tab, index) => {
        if ($scope.immovable || index !== activeTabIndex) {
          sum += tabsSize[index];
          if (sum > maxWidth) {
            return visibleTabs; // Stop here
          }
          visibleTabs.push(index); // OK, continue
        }
        return tab;
      });
      return visibleTabs;
    };

    const refreshMenu = () => {
      if (!tabsetCtrl.tabMore) {
        return;
      }

      const maxWidth = $root.width();
      const activeTabIndex = findIndex(tabsetCtrl.tabs, { active: true });
      const visibleTabs = getVisibleTabs(maxWidth, activeTabIndex);

      // Important: Here, all the tabs are visible (see above)!
      // Now, we need to hide elements:

      if (visibleTabs.length < tabsetCtrl.tabs.length) {
        // Hide all not eligibles elements
        tabsetCtrl.setTabs(map(tabsetCtrl.tabs, (tab, index) => {
          if (!includes(visibleTabs, index) && has(tab, '$tab')) {
            tab.$tab.addClass('hidden').attr('aria-hidden', 'true');
            return {
              ...tab,
              hidden: true,
            };
          }
          return tab;
        }));
      } else if (has(tabsetCtrl.tabMore, '$tab')) {
        // All elements are visible; hide "more" tab.
        tabsetCtrl.tabMore.$tab.addClass('hidden').attr('aria-hidden', 'true');
      }
    };

    // ---

    $scope.$watch('tabs.length', refreshMenu);

    $scope.$on('responsive-tabs-refresh', refreshMenu);

    $transitions.onSuccess({}, () => {
      // At init, select the tab associated with the state.
      // ...or, if user manually modify the url, we need to select it.
      angular.forEach(tabsetCtrl.tabs, (tab) => {
        if (!tab.active && $state.includes(tab.state, tab.stateParams, tab.stateOptions)) {
          tabsetCtrl.select(tab);
        }
      });

      refreshMenu();
    });

    const onResize = debounce(refreshMenu, 99);
    $wdw.bind('resize', onResize);

    $scope.$on('$destroy', () => {
      $wdw.unbind('resize', onResize);
    });
  },
});
