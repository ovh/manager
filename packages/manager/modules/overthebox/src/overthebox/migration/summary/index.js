import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import summary from './overTheBox-migration-summary.component';
import service from './overTheBox-migration-summary.service';

const moduleName = 'ovhManagerOtbMigrationSummary';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('overtheboxMigrationSummary', summary)
  .service('OverTheBoxMigrationSummaryService', service);

export default moduleName;
