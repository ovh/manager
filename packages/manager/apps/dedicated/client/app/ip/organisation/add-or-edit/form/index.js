import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './form.component';

const moduleName = 'ovhManagerDedicatedIpOrganisationAddOrEditForm';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipOrganisationAddOrEditForm', component)
  .run(/* @ngTranslationsInject:json ../../../translations */);

export default moduleName;
