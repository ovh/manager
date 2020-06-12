import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './choose-commitment-period.component';

const moduleName = 'enterpriseCloudDatabaseCreateChooseCommitmentPeriodModule';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('enterpriseCloudDatabaseCreateChooseCommitmentPeriod', component);

export default moduleName;
