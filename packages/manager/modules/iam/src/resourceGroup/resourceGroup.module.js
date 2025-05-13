import angular from 'angular';

import create from './create';
import edit from './edit';

import routing from './resourceGroup.routing';

const moduleName = 'ovhManagerIAMRsourceGroup';

angular.module(moduleName, [create, edit]).config(routing);

export default moduleName;
