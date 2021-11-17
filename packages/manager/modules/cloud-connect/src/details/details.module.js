import angular from 'angular';
import 'angular-ui-bootstrap';
import '@ovh-ux/ng-ui-router-layout';

import component from './details.component';
import overview from './overview';
import routing from './details.routing';
import serviceKeys from './service-keys';
import tasks from './tasks';
import statistics from './statistics';

const moduleName = 'ovhCloudConnectDetails';

angular
  .module(moduleName, [
    'ngUiRouterLayout',
    'ui.bootstrap',
    overview,
    serviceKeys,
    tasks,
    statistics,
  ])
  .config(routing)
  .component('cloudConnectDetails', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
