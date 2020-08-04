export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.overview', {
    url: '/overview',
    component: 'cloudConnectOverview',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      dataCenters: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.loadDatacenters(cloudConnect),
      goToAssociateVrackPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.overview.associate-vrack'),
      goToRemoveVrackPage: /* @ngInject */ ($state) => (vRackId) =>
        $state.go('cloud-connect.overview.remove-vrack', { vRackId }),
      goToUpdateDescriptionPage: /* @ngInject */ ($state) => (description) =>
        $state.go('cloud-connect.overview.edit-description', { description }),
      goToAddPopConfigurationPage: /* @ngInject */ ($state, cloudConnect) => (
        interfaceId,
      ) =>
        $state.go('cloud-connect.overview.add-pop', {
          interfaceId,
          isDirectService: cloudConnect.isDirectService(),
          allowedPopType: cloudConnect.getAllowedPopType(),
        }),
      goToRemovePopConfigurationPage: /* @ngInject */ (
        $state,
        cloudConnect,
      ) => (interfaceId) =>
        $state.go('cloud-connect.overview.remove-pop', {
          interfaceId,
          popId: cloudConnect.getPopConfiguration(interfaceId).id,
        }),
      goToLockPortPage: /* @ngInject */ ($state) => (interfaceId) =>
        $state.go('cloud-connect.overview.lock-port', { interfaceId }),
      goToUnlockPortPage: /* @ngInject */ ($state) => (interfaceId) =>
        $state.go('cloud-connect.overview.unlock-port', { interfaceId }),
      goToSendServiceKeyPage: /* @ngInject */ ($state, cloudConnect) => () =>
        $state.go('cloud-connect.overview.send-service-key', {
          serviceKeyId: cloudConnect.getActiveServiceKey().id,
        }),
      goToDatacenterAddPage: /* @ngInject */ ($state) => () =>
        $state.go('cloud-connect.overview.datacenter-add'),
      goToDatacenterAddExtraPage: /* @ngInject */ ($state) => (datacenterId) =>
        $state.go('cloud-connect.overview.datacenter-add-extra', {
          datacenterId,
        }),
      goToRemoveDatacenterConfigurationPage: /* @ngInject */ ($state) => (
        datacenterId,
      ) =>
        $state.go('cloud-connect.overview.remove-datacenter-configuration', {
          datacenterId,
        }),
      goToRemoveExtraPage: /* @ngInject */ ($state) => (
        datacenterId,
        extraId,
      ) =>
        $state.go('cloud-connect.overview.remove-extra', {
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
        const state = 'cloud-connect.overview';
        const promise = $state.go(
          state,
          {
            ovhCloudConnectId: cloudConnectId,
          },
          {
            reload,
          },
        );
        if (message) {
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
            CucCloudMessage[type](message, state);
            CucControllerHelper.scrollPageToTop();
          });
        }
        return promise;
      },
    },
  });
};
