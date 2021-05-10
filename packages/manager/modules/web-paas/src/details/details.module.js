import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './details.component';
import routing from './details.routing';
import service from './service';
import userLicences from './user-licences';
import additionalComponent from '../components/additional-option';
import status from '../components/status';

const moduleName = 'ovhManagerWebPaasDetailComponent';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ui.router',
    additionalComponent,
    service,
    userLicences,
    status,
  ])
  .config(routing)
  .component('webPaasDetailComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
