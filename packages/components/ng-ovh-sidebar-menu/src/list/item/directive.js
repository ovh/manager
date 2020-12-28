/**
 *  @ngdoc directive
 *  @name sidebarMenu.directive:sidebarMenuListItem
 *
 *  @restrict A
 *
 *  @description
 *  <p>This directive fill manager sidebar item ```<li></li>``` html element with given item.</p>
 *  <p>This shouln't be used outside the sidebarMenu module scope.</p>
 *
 *  @param {SidebarMenuListItem} sidebar-menu-list-item The menu item instance to display.
 */

import angular from 'angular';
import { filter } from 'lodash-es';

import template from './template.html';

export default /* @ngInject */ function($compile) {
  return {
    template,
    restrict: 'A',
    scope: {
      item: '=sidebarMenuListItem',
      namespace: '=sidebarMenuListItemNamespace',
    },
    require: ['sidebarMenuListItem', '^sidebarMenuList'],
    link($scope, $element, attribute, controllers) {
      let navElement;
      const sidebarMenuListItemCtrl = controllers[0];

      if (sidebarMenuListItemCtrl.item.allowSubItems) {
        // get nav element - where to append sub menu element
        navElement = $element.find('nav.menu-sub-items');

        if (!navElement.find('> .sub-menu').length) {
          $compile(`<sidebar-menu-list
                      data-sidebar-menu-list-items='ItemMenuCtrl.item.subItems'
                      data-sidebar-menu-list-level='ItemMenuCtrl.item.level + 1'
                      data-sidebar-menu-list-namespace='ItemMenuCtrl.namespace'
                      class='sub-menu'>
                  </sidebar-menu-list>`)($scope, (cloned) => {
            navElement.append(cloned);
          });
        }
        sidebarMenuListItemCtrl.groupScrollElement = $element.find(
          '.group-scroll-content',
        );
        // sidebarMenuListItemCtrl.groupScrollElement = $element.find(".oui-sidebar-list");

        if (sidebarMenuListItemCtrl.item.infiniteScroll) {
          sidebarMenuListItemCtrl.groupScrollElement.on('scroll', () => {
            sidebarMenuListItemCtrl.addMoreItems();
          });
          $scope.$on('$destroy', () => {
            sidebarMenuListItemCtrl.groupScrollElement.off('scroll');
          });
        }
      } else {
        // no children allowed so free up the dom
        $element.find('.group-content-wrapper').empty();
      }
    },
    bindToController: true,
    controllerAs: 'ItemMenuCtrl',
    controller: /* @ngInject */ function controller(
      $scope,
      $timeout,
      $sce,
      SidebarMenu,
    ) {
      const self = this;

      self.model = {
        search: null,
      };

      self.loading = {
        search: false,
      };

      /*= ==============================
      =            HELPERS            =
      =============================== */

      self.getInnerTemplate = function getInnerTemplate() {
        return $sce.trustAsHtml(SidebarMenu.getInnerMenuItemTemplate());
      };

      self.getMinItemsForEnablingSearch = function getMinItemsForEnablingSearch() {
        return SidebarMenu.getMinItemsForEnablingSearch();
      };

      self.isSearchEnabled = function isSearchEnabled() {
        if (self.item.allowSearch) {
          if (
            self.item.subItemsAdded.length >
              self.getMinItemsForEnablingSearch() ||
            self.item.forceDisplaySearch
          ) {
            return true;
          }

          // if there is less than 10 (by default) items of level 2, there is maybe more than 10
          // items of level 3
          let searchableItemCount = 0;

          // use of every to be abble to break loop
          self.item.subItemsAdded.every((subItem) => {
            searchableItemCount += filter(subItem.subItemsAdded, {
              searchable: true,
            }).length;

            return searchableItemCount <= self.getMinItemsForEnablingSearch();
          });

          return searchableItemCount > self.getMinItemsForEnablingSearch();
        }

        return false;
      };

      /**
       * Returns scrollBar state :
       * {
       *     visible: is scrollbar visible?
       *     bottom: is scrollbar is close to the bottom?
       * }
       */
      $scope.$watch('item', () => {
        self.item.getScrollbar = function getScrollbar() {
          const height = self.groupScrollElement.height();
          const { scrollHeight, scrollTop } = self.groupScrollElement.get(0);
          const result = {
            visible: scrollHeight > height,
            bottom: scrollTop + height >= scrollHeight * 0.9,
          };
          return result;
        };
      });

      self.addMoreItems = function addMoreItems() {
        self.item.appendPendingListItemsAsync();
      };

      /* -----  End of HELPERS  ------*/

      /*= ==============================
            =            ACTIONS            =
            =============================== */

      self.toggleItemOpenState = function toggleItemOpenState() {
        self.errorVisible = false;

        // load sub items
        self.item
          .loadSubItems()
          .then(() => {
            // let SidebarMenu manage toggle states
            SidebarMenu.toggleMenuItemOpenState(self.item);
          })
          .catch(() => {
            self.errorVisible = true;
          });
        return true;
      };

      self.launchSearch = function launchSearch() {
        self.item.filterSubItems(self.model.search);
      };

      self.viewMore = function viewMore() {
        if (
          !self.item.viewMore ||
          !angular.isFunction(self.item.viewMore.action)
        ) {
          return;
        }

        // call view more action
        const result = self.item.viewMore.action();
        let promiseResult = null;

        // check if action returned a promise
        if (result && result.$promise) {
          promiseResult = result.$promise;
        } else if (result && angular.isFunction(result.then)) {
          promiseResult = result;
        }

        // scroll to bottom when action is complete
        if (promiseResult) {
          promiseResult.then(() =>
            $timeout(() => {
              self.groupScrollElement.animate({
                scrollTop: self.groupScrollElement[0].scrollHeight,
              });
            }, 250),
          ); // adding some delay helps to smooth the transition
        }
      };

      /* -----  End of ACTIONS  ------*/
    },
  };
}
