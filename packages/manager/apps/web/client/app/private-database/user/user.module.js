import routing from './user.routing';

import grants from './grants/grants.module';
import list from './list/list.module';

const moduleName = 'ovhManagerPrivateDatabaseUser';

angular
  .module(moduleName, [grants, list])
  .config(routing)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
