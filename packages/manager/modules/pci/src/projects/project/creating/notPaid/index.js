import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './notPaid.component';

import './notPaid.scss';

const moduleName = 'ovhManagerPciProjectsNewCreatingNotPaid';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  // @TODO replace with ./translations path when trads OK
  // also change keys in component html file
  .run(/* @ngTranslationsInject:json ./../translations */)
  .component('pciProjectCreatingNotPaid', component);

export default moduleName;
