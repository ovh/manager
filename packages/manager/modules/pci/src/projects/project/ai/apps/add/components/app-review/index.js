import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './app-review.component';

const moduleName = 'ovhManagerPciProjectAppsAppReview';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('appReview', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
