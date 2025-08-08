import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './migrate-offer.component';
import routing from './migrate-offer.routing';

const moduleName = 'ovhCloudConnectDetailsMigrateOffer';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('cloudConnectDetailsMigrateOffer', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
