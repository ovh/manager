import angular from 'angular';

import routing from './edit.routes';
import userRightsEditComponent from '../../../../components/dedicated-cloud/user/rights/edit';

const moduleName = 'managedBaremetalUserRightsEditModule';

angular.module(moduleName, [userRightsEditComponent]).config(routing);

export default moduleName;
