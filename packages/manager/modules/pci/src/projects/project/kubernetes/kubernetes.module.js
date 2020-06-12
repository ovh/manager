import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add';
import details from './details/details.module';

import component from './kubernetes.component';
import onboarding from './onboarding';
import routing from './kubernetes.routing';

import './index.scss';

const moduleName = 'ovhManagerPciProjectKubernetes';

angular
  .module(moduleName, [
    add,
    details,
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectKubernetes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
