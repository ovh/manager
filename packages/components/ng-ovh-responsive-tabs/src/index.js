import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-ui-bootstrap';

import directive from './directive';
import moreDirective from './more/directive';
import tabDirective from './tab/directive';

const moduleName = 'ngOvhResponsiveTabs';

angular
  .module(moduleName, [
    'ui.bootstrap',
    'ui.router',
  ])
  .directive('responsiveTabs', directive)
  .directive('responsiveTab', tabDirective)
  .directive('responsiveTabMore', moreDirective);

export default moduleName;
