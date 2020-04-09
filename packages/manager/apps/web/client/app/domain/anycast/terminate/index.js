import 'angular-translate';
import component from './terminate.component';
import confirmTerminate from './confirm-terminate';

const moduleName = 'domainAnycastTerminate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', confirmTerminate])
  .component('domainAnycastTerminate', component);

export default moduleName;
