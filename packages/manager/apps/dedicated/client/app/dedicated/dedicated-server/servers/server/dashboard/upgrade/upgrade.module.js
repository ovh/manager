import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import { serverUpgrade } from '@ovh-ux/manager-bm-server-components';

import routing from './upgrade.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardUpgrade';

angular
  .module(moduleName, ['ui.router', serverUpgrade])
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
