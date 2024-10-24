import { TAG } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.dashboard.applications', {
    url: '/applications?cursors',
    component: 'iamApplications',
    resolve: {
      breadcrumb: () => null,
      applications: /* @ngInject */ (IAMService) =>
        IAMService.getApplications(),
    },
    atInternet: {
      rename: TAG.APPLICATIONS,
    },
  });
};
