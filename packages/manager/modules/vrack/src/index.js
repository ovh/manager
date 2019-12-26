import angular from 'angular';
import 'angular-ui-bootstrap';
import '@uirouter/angularjs';

import '@ovh-ux/manager-cloud-styles';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-toaster';
import 'ovh-api-services';

import 'font-awesome/css/font-awesome.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import './vrack.less';
import './vrack-mapper.less';

import actionsPartials from './partials/actions.html';
import availablePartials from './partials/available.html';
import controller from './vrack.controller';
import mappedPartials from './partials/mapped.html';
import routing from './vrack.routing';
import vrackAdd from './add';

const moduleName = 'ovhManagerVrack';

angular
  .module(moduleName, [
    'ui.router',
    'ui.bootstrap',
    'ovh-api-services',
    'ovhManagerCore',
    'ngOvhCloudUniverseComponents',
    'ngOvhToaster',
    'ui.router',
    vrackAdd,
  ])
  .config(routing)
  .controller('VrackCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('vrack/partials/actions.html', actionsPartials);
      $templateCache.put('vrack/partials/available.html', availablePartials);
      $templateCache.put('vrack/partials/mapped.html', mappedPartials);
    },
  );

export default moduleName;
