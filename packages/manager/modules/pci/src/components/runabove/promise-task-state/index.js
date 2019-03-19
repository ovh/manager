import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';

import component from './component';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciComponentsRunabovePromiseTastState';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .component('promiseTaskState', component);

export default moduleName;
