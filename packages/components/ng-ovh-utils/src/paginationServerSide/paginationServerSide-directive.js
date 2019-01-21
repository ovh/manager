/**
 * @type directive
 * @name ovhDirectives:paginationServerSide
 * @description
 * Allow to create a server side pagination compatible with AbstractPaginatedBean defined Java side
 *
 * Support these attributes to tune the directive :
 *      data-pagination-server-side="anId" String id
 *      data-pagination-server-side-function="loadPageFunction" Function defined in the scope
 *      data-pagination-server-side-paginated-stuff="paginatedBean" Variable defined in the scope
 *      data-pagination-server-side-table-loading="tableIsLoading" Variable defined in the scope
 *      data-pagination-server-side-page-size-available="table"    Variable defined in the scope
 *      data-pagination-server-side-datas="paginatedBean.path.to.datas"
 *
 * The supported events are :
 *     'paginationServerSide.reload'
 *     'paginationServerSide.loadPage'
 *
 * # Usage
 * - The attribute data-pagination-server-side is optionnal
 *  You can use this to identify pagination table when page that contains more than one
 * - The attribute data-pagination-server-side-function is mandatory
 *  The loadPageFunction have to take 2 arguments :
 *      $scope.loadPageFunction= function (count, offset) {};
 *      Where count is the number of lines to display in the table.
 *      Where offset is the number of lines skip in the table
 *      (to allow to display the desired page).
 * - The attribute data-pagination-server-side-paginated-stuff is mandatory
 * - The attribute data-pagination-server-side-table-loading is mandatory
 *  Basically tableIsLoading should be set to true when you will get the datas from ws
 *  (in the loadPageFunction), and reseted to false when you get the response.
 *
 * - The attribute data-pagination-server-side-page-size-available is optional
 *  You can use this to change the default list of available page size (default is [10, 20, 40])
 *  The variable have to be a table containing numbers or the string 'all'
 *
 *  - The attribute data-pagination-server-side-datas is optional
 *  If set, datas are watched to automaticaly reload or change page when emptied
 *
 * # Event
 * For you controller you can broadcast events that will be handled by the directive.
 * For example, if you want to ask the ALL the directives to load a specific page :
 *      var iWantToLoadThisPage = 42;
 *      $scope.$broadcast('paginationServerSide.loadPage', iWantToLoadThisPage);
 * For example, if you want to ask to a single directive to load a specific page :
 *      $scope.$broadcast('paginationServerSide.loadPage', iWantToLoadThisPage, anId);
 */

import isNumber from 'lodash/isNumber';
import isFinite from 'lodash/isFinite';

import template from './paginationServerSide.html';

export default /* @ngInject */ function ($translate) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      paginationServerSideFunction: '=',
      paginationServerSidePaginatedStuff: '=',
      paginationServerSideTableLoading: '=',
      paginationServerSidePageSizeAvailable: '=',
      paginationServerSideDatas: '=',
    },
    template,
    link($scope, $elem, $attr) {
      function checkForGlobalOrId(id) {
        return !id || ($attr.paginationServerSide && id === $attr.paginationServerSide);
      }

      // watch datas and reload or change page if empty
      $scope.$watch('paginationServerSideDatas.length', (newValue, oldValue) => {
        if (oldValue && !newValue) {
          if ($scope.paginationServerSidePaginatedStuff.pagination.length > 1) {
            if ($scope.currentPage > 1) {
              $scope.loadPage($scope.currentPage - 1, true);
            } else {
              $scope.loadPage($scope.currentPage, true);
            }
          }
        }
      });

      $elem.bind('change', '.pagination-page-input', () => {
        $elem.find('.pagination-page-goto').click();
        $elem.find('.pagination-page-input').blur();
      });

      $scope.goToPage = null;
      $scope.currentPage = null;

      if (
        $scope.paginationServerSidePageSizeAvailable
        && Array.isArray($scope.paginationServerSidePageSizeAvailable)
      ) {
        $scope.pageSizeAvailable = $scope.paginationServerSidePageSizeAvailable;
        [$scope.pageSize] = $scope.pageSizeAvailable;
      } else {
        $scope.pageSizeAvailable = [5, 10, 20, 40, 80, 100];
        [, $scope.pageSize] = $scope.pageSizeAvailable;
      }

      $scope.getSizeLabel = function getSizeLabel(size) {
        return size === 'all' ? $translate.instant('pagination_display_all') : size;
      };

      // events
      $scope.$on('paginationServerSide.loadPage', (event, pageToLoad, id) => {
        if (checkForGlobalOrId(id)) {
          $scope.loadPage(pageToLoad, true);
        }
      });

      $scope.$on('paginationServerSide.reload', (event, id) => {
        if (checkForGlobalOrId(id)) {
          $scope.loadPage($scope.currentPage, true);
        }
      });
      // /events

      if (localStorage != null) {
        let itemsPerPage = localStorage.getItem('pagination_front_items_per_page');

        if (!isNumber(itemsPerPage)) {
          itemsPerPage = parseInt(itemsPerPage, 10);
        }

        $scope.pageSize = itemsPerPage;
      }

      if (!isFinite($scope.pageSize)) {
        $scope.pageSize = 10;
      }

      $scope.$watch('pageSize', (newValue, oldValue) => {
        if (newValue && newValue !== oldValue && !$scope.paginationServerSideTableLoading) {
          if (newValue === 'all') {
            $scope.pageSize = $scope.paginationServerSidePaginatedStuff.count;
          } else {
            if ($scope.currentPage > $scope.getLastPageNumber()) {
              $scope.currentPage = $scope.getLastPageNumber();
            }
            $scope.loadPage($scope.currentPage, true);
          }
          if (localStorage) {
            localStorage.setItem('pagination_front_items_per_page', newValue);
          }
        }
      });

      $scope.getLastPageNumber = function getLastPageNumber() {
        if ($scope.paginationServerSidePaginatedStuff) {
          return Math.ceil($scope.paginationServerSidePaginatedStuff.count / $scope.pageSize);
        }

        return null;
      };

      $scope.getPaginationNumbersClasses = (page) => {
        if ($scope.currentPage === page) {
          return 'active ';
        }
        return null;
      };

      $scope.getPaginationPreviousClasses = () => {
        if ($scope.paginationServerSideTableLoading || $scope.currentPage === 1) {
          return 'disabled ';
        }
        return null;
      };

      $scope.getPaginationNextClasses = () => {
        if (
          $scope.paginationServerSideTableLoading
          || ($scope.paginationServerSidePaginatedStuff
            && Math.ceil($scope.paginationServerSidePaginatedStuff.count / $scope.pageSize)
              === $scope.currentPage)
        ) {
          return 'disabled ';
        }
        return null;
      };

      $scope.getGoToPageClasses = () => {
        if ($scope.paginationServerSideTableLoading) {
          return 'disabled ';
        }
        return null;
      };

      $scope.loadPage = (page, forceReload) => {
        if (page) {
          $scope.goToPage = null;
          const pageToLoad = Math.ceil(page);
          const currentPageIsLastPage = $scope.paginationServerSidePaginatedStuff
            && Math.ceil($scope.paginationServerSidePaginatedStuff.count / $scope.pageSize)
              === $scope.currentPage;
          const nextPageIsAfterCurrentPage = pageToLoad > $scope.currentPage;

          if (currentPageIsLastPage && nextPageIsAfterCurrentPage) {
            return null;
          }

          const pageIsLoading = $scope.paginationServerSideTableLoading;

          const pageToLoadIsCurrentPage = $scope.currentPage === pageToLoad;
          const tableShouldLoad = forceReload || !pageToLoadIsCurrentPage;

          const askedPageParameterIsCorrect = pageToLoad >= 1;

          const thereArePaginatedElements = $scope.paginationServerSidePaginatedStuff != null;
          const thereIsEnoughElementsToDisplay = thereArePaginatedElements
            && (pageToLoad - 1) * $scope.pageSize
            <= $scope.paginationServerSidePaginatedStuff.count;

          if (
            !pageIsLoading
            && tableShouldLoad
            && askedPageParameterIsCorrect
            && (!thereArePaginatedElements || thereIsEnoughElementsToDisplay)
          ) {
            $scope.currentPage = pageToLoad;
            $scope.paginationServerSideFunction(
              $scope.pageSize,
              (pageToLoad - 1) * $scope.pageSize,
            );
          }

          return false;
        }

        return false;
      };

      $scope.loadPage(1);
    },
  };
}
