import angular from 'angular';

import deleteEntity from '../../components/deleteEntity';
import routing from './delete.routing';

const moduleName = 'ovhManagerIAMApiKeysDelete';

angular.module(moduleName, [deleteEntity]).config(routing);

export default moduleName;
