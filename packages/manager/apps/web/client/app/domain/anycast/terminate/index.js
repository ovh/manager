import angular from 'angular';
import 'angular-translate';

import component from './terminate.component';

const moduleName = 'domainAnycastTerminate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('domainAnycastTerminate', component);

export default moduleName;
