import angular from 'angular';

import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerResourceTaggingUnassignModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ngOvhUtils'])
  .component('ovhManagerResourceTaggingUnassignModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
