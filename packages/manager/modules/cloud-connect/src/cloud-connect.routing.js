import get from 'lodash/get';
import { GUIDELINK } from './cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect', {
    url: '/cloud-connect',
    component: 'cloudConnect',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      guideUrl: /* @ngInject */ (user) => get(GUIDELINK, user.ovhSubsidiary),
    },
  });
};
