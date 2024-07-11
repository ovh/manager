import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import contact from './overTheBox-migration-contact.component';

const moduleName = 'ovhManagerOtbMigrationContact';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('overtheboxMigrationContact', contact);

export default moduleName;
