import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './type.component';

const moduleName = 'ovhManagerPciWorkflowTypeModule';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectsProjectWorkflowType', component);

export default moduleName;
