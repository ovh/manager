import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import allowedIps from './allowed-ips';
import backups from './backups';
import component from './dashboard.component';
import generalInformation from './general-information';
import routing from './dashboard.routing';
import users from './users';
import logs from './logs';
import metrics from './metrics';
import databases from './databases';
import acl from './acl';
import userAcl from './useracl';
import topics from './topics';
import indexes from './indexes';

const moduleName = 'ovhManagerPciStoragesDatabase';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    allowedIps,
    backups,
    generalInformation,
    users,
    logs,
    metrics,
    databases,
    acl,
    userAcl,
    topics,
    indexes,
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabase', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
