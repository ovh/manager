import angular from 'angular';
import 'angular-ui-bootstrap';

import directive from './directive';

const moduleName = 'ngPaginationFront';

angular
  .module(moduleName, ['ui.bootstrap'])
  .directive('paginationFront', directive);

export default moduleName;
