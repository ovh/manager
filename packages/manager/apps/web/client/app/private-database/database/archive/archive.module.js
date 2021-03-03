import routing from './archive.routing';

import dump from './dump/dump.module';
import list from './list/list.module';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseArchive';

angular.module(moduleName, [dump, list]).config(routing);

export default moduleName;
