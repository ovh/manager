import angular from 'angular';

import routing from './edit.routes';
import userEditComponent from '../../../../components/dedicated-cloud/users/vsphere-users/edit';

const moduleName = 'managedBaremetalUserEditModule';

angular.module(moduleName, [userEditComponent]).config(routing);

export default moduleName;
