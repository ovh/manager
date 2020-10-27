import angular from 'angular';

import user from './user';
import noDefaultMeansOfPayment from './no-default-means-of-payment';
import stepper from './stepper';

const moduleName = 'dedicatedUniverseComponents';
angular.module(moduleName, [user, noDefaultMeansOfPayment, stepper]);

export default moduleName;
