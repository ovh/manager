import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import constants from '@iam/constants';
import resolves from '@iam/resolves';
import routes from '@iam/routes';
import services from '@iam/services';
import components from '@iam/components';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerIAM';

angular.module(moduleName, [
  angularTranslate,
  uiRouter,
  ngOvhFeatureFlipping,
  ngOvhUtils,
  uiKit,
  constants,
  resolves,
  routes,
  services,
  components,
]);

export default moduleName;
