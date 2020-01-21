import angular from 'angular';

import routing from './upgrade.routing';

const moduleName = 'webEmailDomainUpgrade';

angular.module(moduleName, []).config(routing);

export default moduleName;
