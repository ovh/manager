import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import { declareRoutes, ROUTES } from '@iam/routes';
import { assignConstants } from '@iam/constants';
import { registerTypes } from '@iam/resolves';
import services from '@iam/services';
import components from '@iam/components';

// TODO remove the relative paths once the feat/datagrid-pagination-mode branch
// of @ovh-ux/ui-kit has been merged / published
import '../../../apps/iam/node_modules/@ovh-ux/ui-kit/dist/js/oui';
import '../../../apps/iam/node_modules/@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerIAM';
const componentModuleNames = Object.values(components).map(
  ({ moduleName: componentModuleName }) => componentModuleName,
);

angular
  .module(moduleName, [
    angularTranslate,
    uiRouter,
    ngOvhFeatureFlipping,
    ngOvhUtils,
    // TODO use the default export of @ovh-ux/ui-kit once the fix/build-export-default-library-name
    //  branch of @ovh-ux/ui-kit has been merged / published
    'oui',
    ...componentModuleNames,
  ])
  .config(registerTypes)
  .config(declareRoutes)
  .run(assignConstants('IAM', { ROUTES }))
  .run(/* @ngTranslationsInject:json ./services/translations */)
  .run(/* @ngTranslationsInject:json ./resolves/translations */);

Object.entries(services).forEach(([serviceName, Service]) => {
  angular.module(moduleName).service(serviceName, Service);
});

export default moduleName;
