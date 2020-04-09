import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import form from './form';

import component from './add-or-edit.component';
import routing from './add-or-edit.routing';

const moduleName = 'ovhManagerDedicatedIpOrganisationAddOrEdit';

angular
  .module(moduleName, [form, 'oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipOrganisationAddOrEdit', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../translations */);

export default moduleName;
