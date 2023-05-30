import angular from 'angular';

import routing from './federation-edit.routes';
import federationEditComponent from '../../../../components/dedicated-cloud/users/activeDirectories/edit';

const moduleName = 'managedBaremetalUsersActiveDirectoriesEditModule';

angular.module(moduleName, [federationEditComponent]).config(routing);

export default moduleName;
