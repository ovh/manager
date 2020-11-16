import angular from 'angular';

import edit from './edit';
import routing from './dedicatedCloud-user-rights.routes';
import userRightsComponent from '../../../components/dedicated-cloud/user/rights';

const moduleName = 'dedicatedCloudUserRightsModule';

angular.module(moduleName, [edit, userRightsComponent]).config(routing);

export default moduleName;
