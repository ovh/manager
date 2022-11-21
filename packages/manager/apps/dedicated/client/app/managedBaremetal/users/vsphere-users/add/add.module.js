import angular from 'angular';

import routing from './add.routes';
import userAddComponent from '../../../../components/dedicated-cloud/users/vsphere-users/add';

const moduleName = 'managedBaremetalUserAddModule';

angular.module(moduleName, [userAddComponent]).config(routing);

export default moduleName;
