import template from './ip-ip-agoraOrder.html';
import controller from './ip-ip-agoraOrder.controller';
import { TRACKING_PREFIX } from './ip-ip-agoraOrder.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.agora-order', {
    url: '/agoraOrder?{catalogName:string}',
    views: {
      ipview: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    params: {
      service: null,
      user: {},
      catalogName: {
        type: 'string',
        value: 'ip',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('license_dashboard_title'),
      ipCatalog: /* @ngInject */ (coreConfig, IpAgoraOrder) =>
        IpAgoraOrder.getIpCatalog(coreConfig.getUser().ovhSubsidiary),
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}ip::funnel::add_additional_ip`,
      level2: 57,
    },
  });
};
