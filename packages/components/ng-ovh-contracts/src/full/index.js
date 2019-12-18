import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';

import directive from './directive';

import './index.less';

const moduleName = 'ngOvhContractsFull';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .directive('ovhContracts', directive)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
