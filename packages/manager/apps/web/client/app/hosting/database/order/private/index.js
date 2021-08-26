import ovhManagerPrivateDatabase from '@ovh-ux/manager-private-database';

import component from './hosting-database-order-private.component';
import routing from './hosting-database-order-private.routing';

const moduleName = 'ovhManagerHostingDatabaseOrderPrivate';

angular
  .module(moduleName, [ovhManagerPrivateDatabase])
  .config(routing)
  .component('hostingDatabaseOrderPrivate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
