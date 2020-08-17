import get from 'lodash/get';
import { GUIDELINK } from './cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect', {
    url: '/cloud-connect',
    component: 'cloudConnect',
    // redirectTo: 'cloud-connect.overview',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      // cloudConnectId: /* @ngInject */ ($transition$) =>
      //   $transition$.params().ovhCloudConnectId,
      // cloudConnect: /* @ngInject */ (cloudConnectService, cloudConnectId) =>
      //   cloudConnectService.getCloudConnect(cloudConnectId),
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      guideUrl: /* @ngInject */ (user) => get(GUIDELINK, user.ovhSubsidiary),
    },
  });
};
