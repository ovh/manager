import angular from 'angular';

import create from './create';
import edit from './edit';

import routing from './policy.routing';

const moduleName = 'ovhManagerIAMPolicy';

angular.module(moduleName, [create, edit]).config(routing);

export default moduleName;
