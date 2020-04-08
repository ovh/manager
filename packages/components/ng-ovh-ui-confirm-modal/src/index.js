import angular from 'angular';
import 'angular-ui-bootstrap';

import directive from './directive';

const moduleName = 'ngOvhUiConfirmModal';

angular
  .module(moduleName, ['ui.bootstrap'])
  .directive('ngReallyClick', directive);

export default moduleName;
