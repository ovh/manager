import 'angular-translate';
import confirm from './confirm';

import component from './terminate.component';
import routing from './terminate.state';

const moduleName = 'domainAnycastTerminate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', confirm])
  .component('domainAnycastTerminate', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
