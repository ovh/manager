import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import routing from './iam.routing';
import constant from './iam.constant';

const moduleName = 'ovhManagerIAM';

angular
  .module(moduleName, [angularTranslate, uiRouter, ngOvhFeatureFlipping])
  .constant('IAM', constant)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngInject */ ($rootScope, IAM) => Object.assign($rootScope, { IAM }));

export default moduleName;
