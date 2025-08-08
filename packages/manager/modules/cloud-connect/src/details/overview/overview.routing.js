export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview', {
    url: '/overview',
    component: 'cloudConnectDetailsOverview',
    resolve: {
      datacenters: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.loadDatacenters(cloudConnect),
      goToAssociateVrackPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.details.overview.associate-vrack'),
      goToRemoveVrackPage: /* @ngInject */ ($state) => (vRackId) =>
        $state.go('cloud-connect.details.overview.remove-vrack', { vRackId }),
      goToChangeBandwidthPage: /* @ngInject */ ($state) => (serviceId) =>
        $state.go('cloud-connect.details.overview.change-bandwidth', {
          serviceId,
        }),
      goToUpdateDescriptionPage: /* @ngInject */ ($state) => (description) =>
        $state.go('cloud-connect.details.overview.edit-description', {
          description,
        }),
      goToAddPopConfigurationPage: /* @ngInject */ ($state, cloudConnect) => (
        interfaceId,
      ) =>
        $state.go('cloud-connect.details.overview.add-pop', {
          interfaceId,
          isDirectService: cloudConnect.isDirectService(),
          allowedPopType: cloudConnect.getAllowedPopType(),
        }),
      diagnosticPageUrl: /* @ngInject */ ($state, cloudConnect) => () =>
        $state.href('cloud-connect.details.diagnostics', {
          cloudConnect,
        }),
      goToRemovePopConfigurationPage: /* @ngInject */ (
        $state,
        cloudConnect,
      ) => (interfaceId) =>
        $state.go('cloud-connect.details.overview.remove-pop', {
          interfaceId,
          popId: cloudConnect.getPopConfiguration(interfaceId).id,
        }),
      goToLockPortPage: /* @ngInject */ ($state) => (interfaceId) =>
        $state.go('cloud-connect.details.overview.lock-port', { interfaceId }),
      goToUnlockPortPage: /* @ngInject */ ($state) => (interfaceId) =>
        $state.go('cloud-connect.details.overview.unlock-port', {
          interfaceId,
        }),
      goToSendServiceKeyPage: /* @ngInject */ ($state, cloudConnect) => () =>
        $state.go('cloud-connect.details.overview.send-service-key', {
          serviceKeyId: cloudConnect.getActiveServiceKey().id,
        }),
      goToDatacenterAddPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.details.overview.datacenter-add'),
      goToDatacenterAddExtraPage: /* @ngInject */ ($state) => (datacenterId) =>
        $state.go('cloud-connect.details.overview.datacenter-add-extra', {
          datacenterId,
        }),
      goToRemoveDatacenterConfigurationPage: /* @ngInject */ ($state) => (
        datacenterId,
      ) =>
        $state.go(
          'cloud-connect.details.overview.remove-datacenter-configuration',
          {
            datacenterId,
          },
        ),
      goToCheckBGPPeeringPage: /* @ngInject */ ($state) => ({
        popConfigId,
        dcConfigId,
        isExtra,
        extraConfigId,
      }) => {
        $state.go('cloud-connect.details.overview.check-bgp-peering', {
          popConfigId,
          dcConfigId,
          isExtra,
          extraConfigId,
        });
      },
      goToRemoveExtraPage: /* @ngInject */ ($state) => (
        datacenterId,
        extraId,
      ) =>
        $state.go('cloud-connect.details.overview.remove-extra', {
          datacenterId,
          extraId,
        }),
      getCancelTerminationUrl: /* @ngInject */ (
        $injector,
        $q,
        coreConfig,
        coreURLBuilder,
      ) => (serviceName) => {
        if (coreConfig.isRegion('US')) {
          return $q.when('');
        }
        if ($injector.has('shellClient')) {
          return $injector
            .get('shellClient')
            .navigation.getURL('dedicated', '#/billing/autorenew', {
              searchText: serviceName,
            });
        }
        return $q.when(
          coreURLBuilder.buildURL('dedicated', '#/billing/autorenew', {
            searchText: serviceName,
          }),
        );
      },
      goToManageServiceKeysPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.details.service-keys'),
      tasksHref: /* @ngInject */ ($state, cloudConnect) =>
        $state.href('cloud-connect.details.tasks', {
          ovhCloudConnectId: cloudConnect.id,
        }),
      goToCloudConnectPage: /* @ngInject */ (
        $q,
        $state,
        $translate,
        CucCloudMessage,
        CucControllerHelper,
        cloudConnectId,
        cloudConnectService,
      ) => (message = false, type = 'success', reload = false, vrackId) => {
        CucCloudMessage.flushChildMessage();
        const state = 'cloud-connect.details.overview';

        return $state
          .go(
            state,
            {
              ovhCloudConnectId: cloudConnectId,
            },
            {
              reload,
            },
          )
          .then(() => {
            if (message) {
              CucCloudMessage[type]({ textHtml: message }, state);
              CucControllerHelper.scrollPageToTop();
            }
            if (vrackId) {
              return cloudConnectService
                .getVrackAssociatedCloudConnect(vrackId)
                .then((res) => {
                  if (res) {
                    CucCloudMessage.warning(
                      $translate.instant(
                        'cloud_connect_vrack_associate_cloud_connect',
                      ),
                      state,
                    );
                  }
                });
            }
            return $q.resolve();
          });
      },
      breadcrumb: () => null,
      goToMigrateOffer: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.details.overview.migrate-offer'),
    },
    atInternet: {
      ignore: true,
    },
  });
};
