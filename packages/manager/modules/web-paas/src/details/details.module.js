import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
// import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './component';
import routing from './details.routing';
import service from './service';
import userLicences from './user-licences';

const moduleName = 'ovhManagerWebPaasDetailComponent';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ui.router',
    service,
    userLicences,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('webPaasDetailComponent', component);

export default moduleName;
