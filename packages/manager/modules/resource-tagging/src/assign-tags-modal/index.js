import angular from 'angular';

import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovhcloud/ods-themes/default';

import component from './component';

const moduleName = 'ovhManagerResourceTaggingAssignModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ngOvhUtils'])
  .component('ovhManagerResourceTaggingAssignModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
