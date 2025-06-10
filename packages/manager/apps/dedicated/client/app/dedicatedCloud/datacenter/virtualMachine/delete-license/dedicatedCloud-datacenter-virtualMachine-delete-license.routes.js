import { TRACKING_DISPLAY_POPUP_DELETE_LICENSE_PREFIX } from '../constants';
import { TRACKING_PREFIX_DATACENTER } from '../../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.virtualMachines.deleteLicense',
    {
      url: '/delete-license?vmId&guestOsFamily&license',
      params: {
        vmId: null,
        guestOsFamily: null,
        license: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerDedicatedCloudDataCenterVirtualMachineDeleteLicense',
        },
      },
      layout: 'modal',
      atInternet: {
        rename: `${TRACKING_PREFIX_DATACENTER}${TRACKING_DISPLAY_POPUP_DELETE_LICENSE_PREFIX}`,
      },
      resolve: {
        goBack: /* @ngInject */ (goBackToVirtualMachines) =>
          goBackToVirtualMachines,
        vmId: /* @ngInject */ ($transition$) => $transition$.params().vmId,
        guestOsFamily: /* @ngInject */ ($transition$) =>
          $transition$.params().guestOsFamily,
        license: /* @ngInject */ ($transition$) =>
          $transition$.params().license,

        breadcrumb: () => null,
      },
    },
  );
};
