import angular from 'angular';

import pollService from './poll-service';

const moduleName = 'ua.poll';

angular.module(moduleName, []).service('Poll', pollService);

export default moduleName;
