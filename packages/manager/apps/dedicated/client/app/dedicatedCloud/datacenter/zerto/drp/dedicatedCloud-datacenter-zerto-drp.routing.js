export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedCloud.details.datacenter.details.zerto.drp', {
      url: '/drp',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details': {
          component: 'dedicatedCloudDatacenterZertoDrp',
        },
      },
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration',
      resolve: {
        breadcrumb: () => null,
        configurationState: () =>
          'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration',
        vraState: () =>
          'app.dedicatedCloud.details.datacenter.details.zerto.drp.vra',
        ltrState: () =>
          'app.dedicatedCloud.details.datacenter.details.zerto.drp.ltr',
      },
    })
    .state(
      'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration',
      {
        url: '/configuration',
        views: {
          'drpInnerView@app.dedicatedCloud.details.datacenter.details.zerto.drp': {
            component: 'dedicatedCloudDatacenterZertoDrpConfiguration',
          },
        },
        resolve: {
          breadcrumb: () => null,
          formattedState: /* @ngInject */ (zertoState, dedicatedCloudZerto) =>
            dedicatedCloudZerto.constructor.formatStatus(zertoState.state),
          primaryDatacenter: /* @ngInject */ (datacenter) => datacenter,
          secondaryDatacenter: /* @ngInject */ (zertoState, DedicatedCloud) => {
            if (!zertoState.remoteSiteInformation) return null;
            return DedicatedCloud.getDatacenterInformations(
              zertoState.remoteSiteInformation.serviceName,
              zertoState.remoteSiteInformation.datacenterId,
            )
              .then((datacenter) => ({
                model: {
                  ...datacenter,
                  id: zertoState.remoteSiteInformation.datacenterId,
                },
              }))
              .catch(() => ({}));
          },
          serviceInfos: /* @ngInject */ (dedicatedCloudServiceInfos) =>
            dedicatedCloudServiceInfos,
          openDeleteModal: /* @ngInject */ ($state) => () =>
            $state.go(
              'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration.deleteDrp',
            ),
          goToAddSite: /* @ngInject */ ($state) => () =>
            $state.go(
              'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration.addSite',
            ),
          openDeleteSiteModal: /* @ngInject */ ($state) => (siteId) =>
            $state.go(
              'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration.deleteSite',
              { siteId },
            ),
        },
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration.deleteDrp',
      {
        url: '/delete',
        views: {
          modal: {
            component: 'dedicatedCloudDatacenterZertoDrpConfigurationDelete',
          },
        },
        layout: 'modal',
        resolve: {
          breadcrumb: () => null,
          zertoInformations: /* @ngInject */ (currentZerto, dedicatedCloudZerto) =>
            dedicatedCloudZerto.constructor.getPlanServiceInformations(currentZerto),
          goBack: /* @ngInject */ ($state) => () => $state.go('^'),
          goBackAfterDelete: /* @ngInject */ ($state, Alerter) => (message) =>
            $state
              .go(
                'app.dedicatedCloud.details.datacenter.details.zerto',
                undefined,
                { reload: true },
              )
              .then(() =>
                Alerter.success(message, 'dedicatedCloud_dashboard_alert'),
              ),
        },
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration.addSite',
      {
        url: '/add-site',
        views: {
          'pccDatacenterView@app.dedicatedCloud.details.datacenter.details': {
            component: 'dedicatedCloudDatacenterZertoAddSite',
          },
        },
        resolve: {
          breadcrumb: () => null,
          zertoInformations: /* @ngInject */ (currentZerto, dedicatedCloudZerto) =>
            dedicatedCloudZerto.constructor.getPlanServiceInformations(currentZerto),
          zertoSiteId: /* @ngInject */ ($transition$) =>
            $transition$.params().zertoSiteId,
          zertoSite: /* @ngInject */ (zertoSiteId, zertoMultiSites) =>
            zertoMultiSites.find(({ id }) => id === Number(zertoSiteId)),
          goToDeleteZertoModal: /* @ngInject */ ($state) => () =>
            $state.go(
              'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration.deleteDrp',
            ),
          goBackToListing: /* @ngInject */ ($state) => (reload = false) =>
            $state.go(
              'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration',
              undefined,
              { reload },
            ),
          handleSuccess: /* @ngInject */ (Alerter, goBackToListing) => (
            message,
          ) =>
            goBackToListing(true).then(() =>
              Alerter.success(message, 'dedicatedCloud_dashboard_alert'),
            ),
        },
      },
    )
    .state(
      'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration.deleteSite',
      {
        url: '/delete-site/:siteId',
        views: {
          modal: {
            component: 'dedicatedCloudDatacenterZertoDeleteSiteModal',
          },
        },
        layout: 'modal',
        resolve: {
          breadcrumb: () => null,
          siteId: /* @ngInject */ ($transition$) =>
            $transition$.params().siteId,
          goBack: /* @ngInject */ ($state) => (reload = false) =>
            $state.go('^', undefined, { reload }),
          handleSuccess: /* @ngInject */ (Alerter, goBack) => (message) =>
            goBack(true).then(() =>
              Alerter.success(message, 'dedicatedCloud_dashboard_alert'),
            ),
          handleError: /* @ngInject */ (Alerter, goBack) => (message) => {
            Alerter.error(message, 'dedicatedCloud_dashboard_alert');
            goBack();
          },
          deleteSite: /* @ngInject */ (
            dedicatedCloudZerto,
            serviceName,
            datacenterId,
            siteId,
          ) => () =>
            dedicatedCloudZerto.deleteZertoRemoteSite({
              serviceName,
              datacenterId,
              siteId,
            }),
          zertoSite: /* @ngInject */ (zertoMultiSites, siteId) =>
            zertoMultiSites.find((site) => site.id === Number(siteId)),
        },
      },
    )
    .state('app.dedicatedCloud.details.datacenter.details.zerto.drp.vra', {
      url: '/vra',
      resolve: {
        breadcrumb: () => null,
      },
    })
    .state('app.dedicatedCloud.details.datacenter.details.zerto.drp.ltr', {
      url: '/ltr',
      resolve: {
        breadcrumb: () => null,
      },
    });
};
