import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import add from './add';
import allowedIpsComponent from './allowed-ips.component';
import deleteIp from './delete';
import routing from './allowed-ips.routing';
import update from './update';

const moduleName = 'ovhManagerPciStoragesDatabaseAllowedIps';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    add,
    deleteIp,
    update,
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseAllowedIpsComponent',
    allowedIpsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
