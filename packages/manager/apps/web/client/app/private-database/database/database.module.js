import routing from './database.routing';

import archive from './archive/archive.module';
import dump from './dump/dump.module';
import extension from './extension/extension.module';
import list from './list/list.module';
import user from './user/user.module';

const moduleName = 'ovhManagerPrivateDatabaseDatabase';

angular
  .module(moduleName, [archive, dump, extension, list, user])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
