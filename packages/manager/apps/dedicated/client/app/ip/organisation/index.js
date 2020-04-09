import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import addOrEdit from './add-or-edit';

import component from './organisation.component';
import routing from './organisation.routing';
import service from './organisation.service';

const moduleName = 'ovhManagerDedicatedIpOrganisation';

angular
  .module(moduleName, [addOrEdit, 'oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipOrganisation', component)
  .service('IpOrganisation', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
