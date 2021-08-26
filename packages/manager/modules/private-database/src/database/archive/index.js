import angular from 'angular';
import routing from './archive.routing';

import dump from './dump';
import list from './list';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseArchive';

angular.module(moduleName, [dump, list]).config(routing);

export default moduleName;
