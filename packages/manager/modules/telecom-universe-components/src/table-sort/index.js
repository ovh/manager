import angular from 'angular';
import 'angular-ui-bootstrap';

import tucColSort from './colSort.component';
import tucTableSortDirective from './table-sort.directive';

const moduleName = 'tucTableSort';

angular
  .module(moduleName, ['ui.bootstrap'])
  .component('tucColSort', tucColSort)
  .directive('tucTableSort', tucTableSortDirective);

export default moduleName;
