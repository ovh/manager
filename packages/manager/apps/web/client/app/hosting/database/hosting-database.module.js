import detachPrivate from './detach-private';
import dump from './dump/dump.module';
import HostingDatabaseOrderPublic from './order/public/hosting-database-order-public.service';
import orderPublic from './order/public';

import routing from './hosting-database.routing';

const moduleName = 'ovhManagerHostingDatabase';

angular
  .module(moduleName, [detachPrivate, dump, orderPublic])
  .config(routing)
  .service('HostingDatabaseOrderPublicService', HostingDatabaseOrderPublic)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
