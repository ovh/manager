import template from './table-sort.html';

export default {
  bindings: {
    fieldName: '@',
    title: '@',
    callback: '&',
  },
  controller($scope) {
    'ngInject';

    this.getSort = function getSort() {
      $scope.$parent.sort = $scope.$parent.sort
        ? $scope.$parent.sort
        : {
            fieldName: null,
            descending: null,
          };
      return $scope.$parent.sort;
    };
    this.sortElement = function sortElement() {
      const sort = this.getSort();
      sort.descending =
        sort.fieldName !== this.fieldName ? false : !sort.descending;
      sort.fieldName = this.fieldName;
      if ($scope.$parent.tucTableSort) {
        $scope.$parent.tucTableSort({ SORT: sort });
      }
      this.callback({ SORT: sort });
    };
  },
  controllerAs: 'sortableCtrl',
  template,
  transclude: true,
};
