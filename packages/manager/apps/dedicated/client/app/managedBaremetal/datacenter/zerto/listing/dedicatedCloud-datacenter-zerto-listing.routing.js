import { DEDICATEDCLOUD_DATACENTER_DRP_STATUS } from '../../../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto.listing',
    {
      url: '/listing',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter': {
          component: 'dedicatedCloudDatacenterZertoListing',
        },
      },
      params: {},

      redirectTo: (transition) => {
        return transition
          .injector()
          .get('$q')
          .all({
            isZertoOnPremise: transition
              .injector()
              .getAsync('isZertoOnPremise'),
          })
          .then(({ isZertoOnPremise }) => {
            if (!isZertoOnPremise)
              return 'app.managedBaremetal.details.datacenters.datacenter.zerto';
            return false;
          });
      },
      resolve: {
        breadcrumb: () => null,
        openDeleteSiteModal: /* @ngInject */ (
          $state,
          serviceName,
          datacenterId,
        ) => (siteId) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto.listing.deleteSite',
            { serviceName, datacenterId, siteId },
          ),
        zertoMultiSites: /* @ngInject */ (
          dedicatedCloudZerto,
          serviceName,
          datacenterId,
          currentZerto,
        ) =>
          currentZerto.state === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering
            ? []
            : dedicatedCloudZerto.getZertoMultiSite({
                serviceName,
                datacenterId,
              }),
      },
    },
  );
};
