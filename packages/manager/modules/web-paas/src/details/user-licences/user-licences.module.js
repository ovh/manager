import angular from 'angular';
import 'angular-translate';

import component from './user-licences.component';
import routing from './user-licences.routing';

const moduleName = 'ovhManagerWebPaasDetailsUserLicences';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .config(routing)
  .component('webPaasDetailsUserLicences', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
