import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-at-internet';

import component from './siret.component';
import service from './siret.service';

import './siret.scss';

const moduleName = 'siretModule';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('siretComponent', component)
  .service('SiretService', service);

export default moduleName;
