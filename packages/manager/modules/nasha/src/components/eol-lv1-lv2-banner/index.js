import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerNashaComponentsEolLv1Lv2ServicesBanner';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('eolLv1Lv2ServicesBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
