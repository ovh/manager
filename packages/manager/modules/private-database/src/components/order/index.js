import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-product-offers';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-http';
import '@ovh-ux/ng-ovh-cloud-universe-components';

import component from './private-database.component';
import service from './private-database.service';

const moduleName = 'ovhManagerPrivateDatabaseComponentOrder';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovhManagerProductOffers',
    'ngOvhWebUniverseComponents',
    'ngOvhCloudUniverseComponents',
    'ngOvhHttp',
    'oui',
  ])
  .component('orderPrivateDatabase', component)
  .service('OrderPrivateDatabaseService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
