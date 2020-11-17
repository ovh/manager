import angular from 'angular';

import routing from './delete.routes';
import userDeleteComponent from '../../../components/dedicated-cloud/user/delete';

const moduleName = 'managedBaremetalUserDeleteModule';

angular.module(moduleName, [userDeleteComponent]).config(routing);

export default moduleName;
