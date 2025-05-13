import angular from 'angular';

import routing from './iam-toggle.routes';
import iamToggleComponent from '../../../../components/dedicated-cloud/users/iam/toggle';

const moduleName = 'dedicatedCloudUsersIamToggleModule';

angular.module(moduleName, [iamToggleComponent]).config(routing);

export default moduleName;
