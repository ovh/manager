import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-feature-flipping';

import kubernetesComponent from './component';
import routing from './details.routing';

import nodePools from './node-pool';
import serviceComponent from './service/index';
import restrictions from './restrictions';
import auditLogs from './audit-logs';

import './index.scss';

const moduleName = 'ovhManagerPciProjectKubernetesDetailComponent';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ui.router',
    nodePools,
    serviceComponent,
    restrictions,
    auditLogs,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectKubernetesDetailComponent',
    kubernetesComponent,
  );

export default moduleName;
