import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import { declareRoutes, ROUTES } from '@iam/routes';
import { assignConstants } from '@iam/constants';
import revolves from '@iam/resolves';
import services from '@iam/services';
import components from '@iam/components';

import './index.scss';

const moduleName = 'ovhManagerIAM';

angular
  .module(moduleName, [
    angularTranslate,
    uiRouter,
    ngOvhFeatureFlipping,
    ngOvhUtils,
    uiKit,
    revolves,
    services,
    components,
  ])
  .config(declareRoutes)
  .run(assignConstants('IAM', { ROUTES }));

export default moduleName;
