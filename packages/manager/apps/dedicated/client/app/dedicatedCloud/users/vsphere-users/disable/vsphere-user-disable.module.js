import angular from 'angular';

import routing from './vsphere-user-disable.routes';
import userDisableComponent from '../../../../components/dedicated-cloud/users/vsphere-users/disable';

const moduleName = 'dedicatedCloudVsphereUserDisableModule';

angular.module(moduleName, [userDisableComponent]).config(routing);

export default moduleName;
