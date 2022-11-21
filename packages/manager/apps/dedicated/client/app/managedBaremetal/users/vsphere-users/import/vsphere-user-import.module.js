import angular from 'angular';

import routing from './vsphere-user-import.routes';
import userImportComponent from '../../../../components/dedicated-cloud/users/vsphere-users/import';

const moduleName = 'managedBaremetalVsphereUserImportModule';

angular.module(moduleName, [userImportComponent]).config(routing);

export default moduleName;
