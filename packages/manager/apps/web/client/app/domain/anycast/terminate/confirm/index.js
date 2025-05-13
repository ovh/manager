import 'angular-translate';

import confirmTerminate from './confirm.component';
import routing from './confirm.state';

const moduleName = 'domainAnycastConfirmTerminate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('domainAnycastConfirmTerminate', confirmTerminate)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
