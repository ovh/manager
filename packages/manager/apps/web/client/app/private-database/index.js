import controller from './private-database.controller';
import routing from './private-database.routing';
import service from './private-database.service';
import tabController from './private-database-tabs.controller';

import orderCloudDb from './order/clouddb';

const moduleName = 'ovhManagerWebPrivateDatabaseModule';

angular
  .module(moduleName, [orderCloudDb])
  .config(routing)
  .controller('PrivateDatabaseCtrl', controller)
  .controller('PrivateDatabaseTabsCtrl', tabController)
  .service('PrivateDatabase', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
