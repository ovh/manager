import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-at-internet';

import component from './siret.component';
import service from './siret.service';
import { COMPONENT_MODES } from './siret.constants';

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
  .constant('SIRET_COMPONENT_MODES', COMPONENT_MODES)
  .service('SiretService', service);

export default moduleName;
