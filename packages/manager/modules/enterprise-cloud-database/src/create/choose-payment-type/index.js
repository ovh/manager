import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './choose-payment-type.component';

const moduleName = 'enterpriseCloudDatabaseCreateChoosePaymentTypeModule';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('enterpriseCloudDatabaseCreateChoosePaymentType', component);

export default moduleName;
