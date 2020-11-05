import angular from 'angular';

import user from './user';
import noDefaultMeansOfPayment from './no-default-means-of-payment';

const moduleName = 'dedicatedUniverseComponents';
angular.module(moduleName, [user, noDefaultMeansOfPayment]);

export default moduleName;
