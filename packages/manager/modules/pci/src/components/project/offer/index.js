import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './offer.component';
import badge from './badge';
import notice from './notice';

import './offer.scss';

const moduleName = 'ovhManagerPciComponentsProjectOffer';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    badge,
    notice,
  ])
  .component('pciProjectOffer', component);

export default moduleName;
