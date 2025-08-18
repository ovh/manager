import { TRACKING_DISPLAY_POPUP_ACTIVATE_LICENSE_PREFIX } from '../constants';
import { TRACKING_PREFIX_DATACENTER } from '../../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.virtualMachines.setLicense',
    {
      url: '/set-license?vmId&guestOsFamily',
      params: {
        vmId: null,
        guestOsFamily: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerDedicatedCloudDataCenterVirtualMachineSetLicense',
        },
      },
      layout: 'modal',
      atInternet: {
        rename: `${TRACKING_PREFIX_DATACENTER}${TRACKING_DISPLAY_POPUP_ACTIVATE_LICENSE_PREFIX}`,
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToVirtualMachines) =>
          goBackToVirtualMachines,
        vmId: /* @ngInject */ ($transition$) => $transition$.params().vmId,
        guestOsFamily: /* @ngInject */ ($transition$) =>
          $transition$.params().guestOsFamily,
        breadcrumb: () => null,
      },
    },
  );
};
