import angular from 'angular';

import ovhManagerHub from '@ovh-ux/manager-hub';

import routing from './routing';

const moduleName = 'ovhManagerHubProductListingPage';

angular.module(moduleName, [ovhManagerHub]).config(routing);

export default moduleName;
