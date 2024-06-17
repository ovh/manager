import angular from 'angular';

import routing from './federation-add.routes';
import federationAddComponent from '../../../../components/dedicated-cloud/users/activeDirectories/add';

const moduleName = 'dedicatedCloudUsersFederationAddModule';

angular.module(moduleName, [federationAddComponent]).config(routing);

export default moduleName;
