import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './node.component';

const moduleName = 'ovhManagerPciStoragesDatabasesNode';

angular.module(moduleName, ['oui']).component('databaseNode', component);

export default moduleName;
