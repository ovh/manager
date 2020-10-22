import angular from 'angular';

import user from './user';
import noDefaultMeansOfPayment from './no-default-means-of-payment';
import stepper from './stepper';
import OvhHttp from './ovh-angular-http/ovh-angular-http.module';

const moduleName = 'ducComponents';
angular.module(moduleName, [user, noDefaultMeansOfPayment, stepper, OvhHttp]);

export default moduleName;
