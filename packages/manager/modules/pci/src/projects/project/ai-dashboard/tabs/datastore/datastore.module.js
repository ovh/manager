import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './datastore.component';
import routing from './datastore.routing';
import aiGuideComponent from '../../components/ai-guide';
import createDatastore from './create-datastore';
import deleteDatastore from './delete-datastore';

const moduleName = 'ovhManagerPciAiDashboardDatastore';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'oui',
    aiGuideComponent,
    createDatastore,
    deleteDatastore,
  ])
  .config(routing)
  .component('pciProjectAiDashboardDatastore', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
