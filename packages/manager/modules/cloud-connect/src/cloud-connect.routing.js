import { GUIDELINK } from './cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect', {
    url: '/cloud-connect',
    component: 'cloudConnect',
    resolve: {
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      guideUrl: /* @ngInject */ (user) =>
        GUIDELINK[user.ovhSubsidiary] || GUIDELINK.GB,
    },
  });
};
