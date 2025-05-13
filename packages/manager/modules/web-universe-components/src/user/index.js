import angular from 'angular';

import WucUser from './user.service';

const moduleName = 'wucUser';

angular.module(moduleName, []).service('WucUser', WucUser);

export default moduleName;
