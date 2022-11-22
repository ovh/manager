import angular from 'angular';

import routing from './federation-delete.routes';
import activeDirectoriesDeleteComponent from '../../../../components/dedicated-cloud/users/activeDirectories/delete';

const moduleName = 'dedicatedCloudUsersActiveDirectoriesDeleteModule';

angular.module(moduleName, [activeDirectoriesDeleteComponent]).config(routing);

export default moduleName;
