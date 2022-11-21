import angular from 'angular';

import routing from './vsphere-user-rights-edit.routes';
import userRightsEditComponent from '../../../../../components/dedicated-cloud/users/vsphere-users/rights/edit';

const moduleName = 'dedicatedCloudVsphereUserRightsEditModule';

angular.module(moduleName, [userRightsEditComponent]).config(routing);

export default moduleName;
