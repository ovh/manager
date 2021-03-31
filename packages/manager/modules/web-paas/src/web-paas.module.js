import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import add from './add';
import component from './web-paas.component';
import details from './details';
import onboarding from './onboarding';
import projects from './projects';
import routing from './web-paas.routing';
import service from './web-paas.service';

const moduleName = 'ovhManagerWebPaas';

angular
  .module(moduleName, [
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    details,
    add,
    projects,
  ])
  .config(routing)
  .component('webPaas', component)
  .service('WebPaas', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
