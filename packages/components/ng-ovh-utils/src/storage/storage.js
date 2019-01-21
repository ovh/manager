import angular from 'angular';

import storageService from './storage-service';

const moduleName = 'ua.storage';

angular.module(moduleName, []).service('storage', storageService);

export default moduleName;
