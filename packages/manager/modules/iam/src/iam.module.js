import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import managerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrapper from '@ovh-ux/ng-ovh-api-wrappers';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import dashboard from './dashboard';
import policies from './policies';
import identities from './identities';
import apiKeys from './api-keys';
import logs from './logs';

import filters from './iam.filters';
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
    ApiV2ListHelper.moduleName,
    angularTranslate,
    uiRouter,
    managerAtInternetConfiguration,
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
    ngOvhApiWrapper,
    ngOvhFeatureFlipping,
    ngOvhUtils,
    uiKit,
    dashboard,
    policies,
    identities,
    apiKeys,
    logs,
    ngUiRouterLayout,
  ])
  .config(routing)
  .config(registerTypes)
  .service('IAMService', service)
  .filter('iamResourceType', filters.resourceTypeFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
