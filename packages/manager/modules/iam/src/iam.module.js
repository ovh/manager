import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import dashboard from './dashboard';
import identities from './identities';
import onboarding from './onboarding';
import policy from './policy';
import resourceGroup from './resourceGroup';

import paramTypes from './iam.paramTypes';
import routing from './iam.routing';
import service from './iam.service';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './iam.styles.scss';

const moduleName = 'ovhManagerIAM';

/**
 * Register each param type onto the $urlMatcherFactoryProvider
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramdeclaration.html#type
 * @see https://ui-router.github.io/ng1/docs/latest/interfaces/params.paramtypedefinition.html
 * @param {UrlMatcherFactoryProvider} $urlMatcherFactoryProvider
 */
const registerTypes = /* @ngInject */ ($urlMatcherFactoryProvider) =>
  Object.values(paramTypes).forEach(({ type, ...definition }) =>
    $urlMatcherFactoryProvider.type(type, definition),
  );

angular
  .module(moduleName, [
    OnboardingLayoutHelper,
    angularTranslate,
    uiRouter,
    ngOvhFeatureFlipping,
    ngOvhUtils,
    uiKit,
    dashboard,
    identities,
    onboarding,
    policy,
    resourceGroup,
  ])
  .config(routing)
  .config(registerTypes)
  .service('IAMService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
