import angular from 'angular';

import poolForm from './pool-form';
import deletion from './delete';

const moduleName = 'ngOvhOctaviaPoolComponents';

angular.module(moduleName, [poolForm, deletion]);

export default moduleName;
