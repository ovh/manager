import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';

import onboarding from './onboarding';
import add from './add';
import component from './gateways.component';
import routing from './gateways.routing';
import pciProjectGatewayService from './service';
import deletePublicGateway from './delete';
import editGateway from './edit';

import './gateways.less';

const moduleName = 'ovhManagerPciPublicGateways';
angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    onboarding,
    deletePublicGateway,
    editGateway,
    add,
    pciProjectGatewayService,
  ])
  .config(routing)
  .component('pciProjectPublicGateways', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
