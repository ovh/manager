import template from './cdn-dedicated-domain-statistics.html';
import controller from './cdn-dedicated-domain-statistics.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.networks.cdn.dedicated.manage.domain.dashboard.statistics',
    {
      url: '/statistics',
      views: {
        cdnDomainView: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
