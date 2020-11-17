import angular from 'angular';

import routing from './disable.routes';
import userDisableComponent from '../../../components/dedicated-cloud/user/disable';

const moduleName = 'managedBaremetalUserDisableModule';

angular.module(moduleName, [userDisableComponent]).config(routing);

export default moduleName;
