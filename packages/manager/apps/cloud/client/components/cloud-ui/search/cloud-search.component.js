function SearchController($scope, $element, $attrs) {
  this.$onInit = () => {
    let { threshold } = $attrs;
    // threshold is either blur or an integer, default to 1 (on every char)
    if (threshold !== 'blur') {
      threshold = parseInt(threshold, 10);
      threshold = Number.isNaN(threshold) ? 1 : threshold;
    }

    this.threshold = threshold;
    this.search = $attrs.value;
    this.focused = !!$scope.$eval($attrs.focused);
    this.onSearch = $scope.$ctrl.onSearch;

    if (typeof this.onSearch !== 'function') {
      // console.warn('Without a data-on-notify callback the searchbox wont do anything');
      this.onSearch = function onSearch() {
        /* do nothing */
      };
    }

    this.onClear = $scope.$ctrl.onClear;
    if (typeof this.onClear !== 'function') {
      // console.warn('Without a data-on-clear callback the searchbox wont do anything');
      this.onClear = function onClear() {
        /* do nothing */
      };
    }
  };
}

SearchController.prototype.change = function change() {
  if (
    Number.isInteger(this.threshold) &&
    this.search.length >= this.threshold
  ) {
    this.onSearch(this.search);
  }

  if (this.search.length === 0) {
    this.onClear();
  }
};

SearchController.prototype.blur = function blur() {
  this.focused = false;
  if (this.threshold === 'blur') {
    this.onSearch(this.search);
  }
};

angular.module('managerApp').component('cloudSearch', {
  templateUrl: 'components/cloud-ui/search/search.html',
  controller: SearchController,
  bindings: {
    onSearch: '<',
    onClear: '<',
    threshold: '<', // an integer or 'blur', by default with call onSearch on every char.
    value: '<',
    focused: '<',
  },
});
