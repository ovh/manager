export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview', {
    url: '/overview',
    component: 'cloudConnectOverview',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      datacenters: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.loadDatacenters(cloudConnect),
      goToAssociateVrackPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.details.overview.associate-vrack'),
      goToRemoveVrackPage: /* @ngInject */ ($state) => (vRackId) =>
        $state.go('cloud-connect.details.overview.remove-vrack', { vRackId }),
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
      goToRemoveExtraPage: /* @ngInject */ ($state) => (
        datacenterId,
        extraId,
      ) =>
        $state.go('cloud-connect.details.overview.remove-extra', {
          datacenterId,
          extraId,
        }),
      goToManageServiceKeysPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.service-keys'),
      tasksHref: /* @ngInject */ ($state, cloudConnect) =>
        $state.href('cloud-connect.tasks', {
          ovhCloudConnectId: cloudConnect.id,
        }),
      goToCloudConnectPage: /* @ngInject */ (
        $state,
        $translate,
        CucCloudMessage,
        CucControllerHelper,
        cloudConnectId,
        cloudConnectService,
      ) => (message = false, type = 'success', reload = false, vrackId) => {
        const state = 'cloud-connect.details.overview';
        const promise = $state.go(
          state,
          {
            ovhCloudConnectId: cloudConnectId,
          },
          {
            reload,
          },
        );
        promise.then(() => {
          if (vrackId) {
            cloudConnectService
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
          if (message) {
            CucCloudMessage[type](message, state);
            CucControllerHelper.scrollPageToTop();
          }
        });
        return promise;
      },
    },
  });
};
