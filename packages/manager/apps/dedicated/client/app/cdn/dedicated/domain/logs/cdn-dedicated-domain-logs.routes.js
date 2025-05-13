import template from './cdn-dedicated-domain-logs.html';
import controller from './cdn-dedicated-domain-logs.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.networks.cdn.dedicated.manage.domain.dashboard.logs',
    {
      url: '/logs',
      views: {
        cdnDomainView: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('cdn_domains_logs'),
      },
    },
  );
};
