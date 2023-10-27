import controller from './history.controller';
import template from './history.html';

const commonResolves = {
  breadcrumb: /* @ngInject */ ($translate) =>
    $translate.instant('zone_history'),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.history', {
    views: {
      'dnsZoneView@app.zone.details': {
        controller,
        controllerAs: 'ctrlDomainHistoryOfZoneDns',
        template,
      },
    },
    resolve: commonResolves,
    params: {
      productId: null,
    },
  });
};
