import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import informationComponent from './information.component';
import routing from './information.routing';

const moduleName = 'ovhManagerPciStoragesDatabasePoolsInformation';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabasePoolsInformationComponent',
    informationComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
