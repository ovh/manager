import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import ovhManagerOtbWarning from '../warning';

import component from './overTheBox-details.component';
import constant from './overTheBox-details.constant';
import overTheBoxDetailsService from './overTheBox-details.service';
import routing from './overTheBox-details.routing';

const moduleName = 'ovhManagerOtbDetails';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    ovhManagerOtbWarning,
  ])
  .component('overTheBoxDetails', component)
  .constant('OVERTHEBOX_DETAILS', constant)
  .config(routing)
  .service('OverTheBoxDetailsService', overTheBoxDetailsService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
