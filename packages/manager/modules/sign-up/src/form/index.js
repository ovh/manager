import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import activity from './activity';
import component from './component';
import details from './details';
import identity from './identity';
import './sign-up.scss';

const moduleName = 'ovhSignUpForm';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    activity,
    details,
    identity,
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
