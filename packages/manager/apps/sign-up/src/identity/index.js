import angular from 'angular';
import '@ovh-ux/sign-up';

import { registerState } from './routing';

const moduleName = 'ovhSignUpIdentityState';

angular.module(moduleName, ['ovhSignUp']).config(registerState);

export default moduleName;
