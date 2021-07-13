import template from './cdn-dedicated-domain-rule.html';
import controller from './cdn-dedicated-domain-rule.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.networks.cdn.dedicated.manage.domain.dashboard.rule',
    {
      url: '/rule',
      views: {
        cdnDomainView: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('cdn_domains_rule'),
      },
    },
  );
};
