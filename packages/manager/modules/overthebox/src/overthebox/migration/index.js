import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './overTheBox-migration.component';
import routing from './overTheBox-migration.routing';

import offers from './offers';
import contact from './contact';
import summary from './summary';

import './overTheBox-migration.less';

const moduleName = 'ovhManagerOtbMigration';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    offers,
    contact,
    summary,
  ])
  .component('overtheboxMigration', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
