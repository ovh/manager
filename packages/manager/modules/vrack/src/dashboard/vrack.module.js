import angular from 'angular';
import 'angular-ui-bootstrap';
import '@uirouter/angularjs';

import '@ovh-ux/manager-cloud-styles';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-toaster';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import 'font-awesome/css/font-awesome.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import './vrack.less';
import './vrack-mapper.less';

import actionsPartials from '../partials/actions.html';
import availablePartials from '../partials/available.html';
import component from './vrack.component';
import service from './vrack.service';
import mappedPartials from '../partials/mapped.html';
import routing from './vrack.routing';
import vrackAdd from '../add';
import vrackAssignedIp from '../vrack-services/ip';
import vrackMoveDialog from '../move-dialog/vrack-move-dialog.module';
import vrackDeleteModal from '../delete-dialog';
import IPv6SubnetAddModal from '../vrack-services/ip/add';
import IPv6SubnetDeleteModal from '../vrack-services/ip/delete';

const moduleName = 'ovhManagerVrackDetails';

angular
  .module(moduleName, [
    'ui.router',
    'ui.bootstrap',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'ngOvhCloudUniverseComponents',
    'ngOvhToaster',
    'ui.router',
    ngOvhFeatureFlipping,
    vrackAssignedIp,
    IPv6SubnetAddModal,
    IPv6SubnetDeleteModal,
    vrackAdd,
    vrackMoveDialog,
    vrackDeleteModal,
  ])
  .component('ovhManagerVrackComponent', component)
  .service('vrackService', service)
  .config(routing)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('vrack/partials/actions.html', actionsPartials);
      $templateCache.put('vrack/partials/available.html', availablePartials);
      $templateCache.put('vrack/partials/mapped.html', mappedPartials);
    },
  );

export default moduleName;
