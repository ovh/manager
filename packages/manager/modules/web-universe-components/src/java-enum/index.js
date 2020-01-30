import angular from 'angular';

import WucJavaEnum from './java-enum.service';

const moduleName = 'wucJavaEnum';

angular.module(moduleName, []).service('WucJavaEnum', WucJavaEnum);

export default moduleName;
