import angular from 'angular';
import isNaN from 'lodash/isNaN';
import toArray from 'lodash/toArray';

import template from './template.html';

export default /* @ngInject */ ($q) => ({
  restrict: 'A',
  template,
  replace: false,
  transclude: true,
  scope: {
    items: '=',
    fakeCurrentPage: '=?currentPage',
    numPages: '=?nbPages',
    itemsPerPage: '=?',
    refresh: '=?',
    paginatedItems: '=',
    pagePlaceholder: '@',
    itemPerPagePlaceholder: '@',
    onPageChange: '&',
    transformItem: '&?',
    onTransformItemGetPromise: '&',
    onTransformItemDone: '&',
    onTransformItemNotify: '&',
    goToPage: '@',
    saveName: '@?',
  },
  link: ($scope) => {
    const saveName =
      typeof $scope.saveName === 'string' && $scope.saveName.length
        ? `pagination_front_items_per_page_${$scope.saveName}`
        : 'pagination_front_items_per_page';

    $scope.currentPage = 1;
    if ($scope.fakeCurrentPage) {
      $scope.currentPage = $scope.fakeCurrentPage;

      $scope.$watch('fakeCurrentPage', (page) => {
        if (page && page <= $scope.numPages) {
          $scope.currentPage = page;
        }
      });
    }

    if (localStorage && localStorage.getItem(saveName)) {
      $scope.itemsPerPage = parseInt(localStorage.getItem(saveName), 10) || 10;
    } else if (!$scope.itemsPerPage) {
      $scope.itemsPerPage = 10;
    }

    $scope.maxSize = 5;

    const doTransform = (items) => {
      const rejectedItem = {};
      const promise = $q
        .all(
          items.map((item) =>
            $q
              .when($scope.transformItem({ item }))
              .then((transformed) => {
                $scope.onTransformItemNotify({ item: transformed });
                return transformed;
              })
              .catch(() => rejectedItem),
          ),
        )
        .then((itemList) => {
          const filtredItems = itemList.filter((item) => item !== rejectedItem);
          $scope.onTransformItemDone({ items: filtredItems });
          return filtredItems;
        });

      $scope.onTransformItemGetPromise({ promise });
      return promise;
    };

    const paginates = () => {
      if ($scope.arrayItems) {
        $scope.paginatedItems = [];

        let from = ($scope.currentPage - 1) * $scope.itemsPerPage;
        let to = $scope.itemsPerPage * $scope.currentPage;
        const itemsToLoad = [];

        if (to > $scope.totalItems) {
          to = $scope.totalItems;
        }

        if (from < 0) {
          from = 0;
        }

        for (let i = from; i < to; i += 1) {
          itemsToLoad.push(angular.copy($scope.arrayItems[i]));
        }

        $scope.paginatedItems = itemsToLoad;
        if ($scope.transformItem) {
          doTransform(itemsToLoad).then((transformatedItems) => {
            $scope.paginatedItems = transformatedItems;
          });
        }

        $scope.onPageChange({ items: $scope.paginatedItems });
      }
    };

    const isInt = (value) =>
      !isNaN(value) &&
      parseInt(Number(value), 10) === value &&
      !isNaN(parseInt(value, 10));

    $scope.$watch(
      'items',
      (nv) => {
        if (nv !== undefined) {
          if (angular.isObject(nv) && !angular.isArray(nv)) {
            $scope.arrayItems = toArray($scope.items);
          } else {
            $scope.arrayItems = $scope.items;
          }
          $scope.arrayItems = $scope.arrayItems || [];
          $scope.totalItems = $scope.arrayItems.length;
          paginates();
        }
      },
      true,
    );

    // Watch change page
    $scope.$watch('currentPage', (page) => {
      if (isInt(page)) {
        paginates();
        $scope.fakeCurrentPage = page;
      }
    });

    $scope.changePage = () => {
      if (parseInt($scope.goPage, 10)) {
        if ($scope.goPage) {
          if ($scope.goPage > $scope.numPages) {
            $scope.currentPage = $scope.numPages;
          } else {
            $scope.currentPage = $scope.goPage;
          }
        } else {
          $scope.currentPage = 1;
        }
      }
    };

    $scope.changePageKeyPress = ($event) => {
      if ($event.keyCode === 13) {
        $scope.goPage = null;
      }
    };

    // Watch number of items per page
    $scope.$watch('itemsPerPage', (itemsPerPage) => {
      if (itemsPerPage !== undefined) {
        if (localStorage) {
          localStorage.setItem(saveName, itemsPerPage);
        }
        paginates();
      }
    });

    $scope.$watch('refresh', () => {
      paginates();
    });
  },
});
