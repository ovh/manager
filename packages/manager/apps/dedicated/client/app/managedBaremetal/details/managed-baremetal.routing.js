import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

import { DedicatedCloud as DedicatedCloudInfo } from '@ovh-ux/manager-models';
import {
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../../components/dedicated-cloud/datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details', {
    url: '/:productId?action&token',
    redirectTo: (transition) => {
      if (transition.params().action === 'confirmcancel') {
        return {
          state: 'app.managedBaremetal.details.terminate-confirm',
          params: {
            productId: transition.params().productId,
            token: transition.params().token,
          },
        };
      }

      return transition
        .injector()
        .getAsync('hasVCDMigration')
        .then((hasVCDMigration) =>
          hasVCDMigration
            ? 'app.managedBaremetal.details.dashboard-light'
            : 'app.managedBaremetal.details.dashboard',
        )
        .catch(() => 'app.managedBaremetal.details.dashboard');
    },
    resolve: {
      goBackToList: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.index'),
      currentService: /* @ngInject */ (DedicatedCloud, productId) =>
        DedicatedCloud.getSelected(productId, true).then(
          (dedicatedCloudData) => new DedicatedCloudInfo(dedicatedCloudData),
        ),
      currentZerto: /* @ngInject */ (dedicatedCloudZerto, productId) =>
        dedicatedCloudZerto.getPccZertoPlan(productId).then((states) => {
          const existingPlan = states.find(
            ({ state }) =>
              state !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
          );

          // If no plan with state other than disabled, let's return the first datacenter plan
          const currentZerto =
            existingPlan || sortBy(states, 'datacenterId')[0];

          const zertoVpnStatus = get(
            currentZerto,
            'remoteSiteInformation.vpnConfigState',
          );
          currentZerto.vpnStatus = zertoVpnStatus;
          currentZerto.isWaitingVpnConfiguration =
            zertoVpnStatus != null &&
            zertoVpnStatus !==
              DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configured;

          currentZerto.state = dedicatedCloudZerto.constructor.formatStatus(
            currentZerto.state,
          );

          return dedicatedCloudZerto
            .getDisableSuccessAlertPreference(productId)
            .then((alertPreferenceValue) => {
              currentZerto.isSuccessAlertDisable = alertPreferenceValue;
            })
            .catch(() => {
              currentZerto.isSuccessAlertDisable = true;
            })
            .then(() => currentZerto);
        }),
      datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) =>
        DedicatedCloud.getDatacenters($stateParams.productId),
      datacenterOfZerto: /* @ngInject */ (currentZerto, datacenterList) =>
        datacenterList.find(({ id }) => id === currentZerto.datacenterId),
      dedicatedCloud: /* @ngInject */ (
        $stateParams,
        currentUser,
        DedicatedCloud,
        dedicatedCloudDescription,
        dedicatedCloudServiceInfos,
      ) =>
        DedicatedCloud.getSelected($stateParams.productId, true).then(
          (dedicatedCloud) => ({
            ...dedicatedCloud,
            ...dedicatedCloudDescription,
            email: currentUser.email,
            serviceInfos: dedicatedCloudServiceInfos,
          }),
        ),

      dedicatedCloudDescription: /* @ngInject */ (
        $stateParams,
        DedicatedCloud,
      ) => DedicatedCloud.getDescription($stateParams.productId),

      managedVCDAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('dedicated-cloud:vcd-migration')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(
              'dedicated-cloud:vcd-migration',
            ),
          ),

      dedicatedCloudServiceInfos: /* @ngInject */ (
        $stateParams,
        OvhApiDedicatedCloud,
      ) =>
        OvhApiDedicatedCloud.v6().getServiceInfos({
          serviceName: $stateParams.productId,
        }),

      zertoAvailability: /* @ngInject */ () => true,

      zertoGlobalStatus: /* @ngInject */ (
        currentZerto,
        dedicatedCloudZerto,
      ) => ({
        error:
          dedicatedCloudZerto.constructor.isZertoNotInValidState(
            currentZerto.state,
          ) ||
          dedicatedCloudZerto.constructor.isZertoNotInValidState(
            currentZerto.vpnStatus,
          ),
        warning:
          dedicatedCloudZerto.constructor.isZertoInChangingState(
            currentZerto.state,
          ) ||
          dedicatedCloudZerto.constructor.isZertoInChangingState(
            currentZerto.vpnStatus,
          ),
        success: dedicatedCloudZerto.constructor.isZertoInValidState(
          currentZerto.state,
        ),
      }),
      editDetails: /* @ngInject */ ($uibModal, productId) => (data) =>
        $uibModal.open({
          animation: true,
          templateUrl: 'components/name-edition/name-edition.html',
          controller: 'NameEditionCtrl',
          controllerAs: '$ctrl',
          resolve: {
            data: () => ({
              ...data,
              productId,
            }),
          },
        }),
      isZertoActionPossible: /* @ngInject */ (
        currentZerto,
        dedicatedCloudZerto,
      ) => dedicatedCloudZerto.constructor.isZertoActionPossible(currentZerto),

      datacentersState: () => 'app.managedBaremetal.details.datacenters',
      pccDashboardState: () => 'app.managedBaremetal.details.dashboard',
      licenseState: () => 'app.managedBaremetal.details.license',
      operationState: () => 'app.managedBaremetal.details.operation',
      securityState: () => 'app.managedBaremetal.details.security',
      usersState: () => 'app.managedBaremetal.details.users',
      goToZerto: /* @ngInject */ ($state, currentZerto) => (datacenterId) =>
        $state.go('app.managedBaremetal.details.datacenters.datacenter.zerto', {
          datacenterId,
          zertoInformations: currentZerto,
        }),
      goToZertoDatacenterSelection: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.managedBaremetal.details.dashboard.zertoDatacenterSelection',
        ),
      goToPccDashboard: /* @ngInject */ ($state) => (reload = false) =>
        $state.go('app.managedBaremetal.details', {}, { reload }),
      goToVpnConfiguration: /* @ngInject */ ($state, currentZerto) => {
        return () => {
          if (currentZerto.drpType === 'onPremise') {
            $state.go(
              'app.managedBaremetal.details.datacenters.datacenter.zerto.listing.addSite',
              {
                datacenterId: currentZerto.datacenterId,
                zertoInformations: currentZerto,
              },
            );
          } else {
            $state.go(
              'app.managedBaremetal.details.datacenters.datacenter.zerto.summary',
              {
                datacenterId: currentZerto.datacenterId,
                zertoInformations: currentZerto,
              },
            );
          }
        };
      },
      goToDatacenter: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.managedBaremetal.details.datacenters.datacenter', {
          productId,
          datacenterId,
        }),
      goToDatastores: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go(
          'app.managedBaremetal.details.datacenters.datacenter.datastores',
          {
            productId,
            datacenterId,
          },
        ),
      goToHosts: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.managedBaremetal.details.datacenters.datacenter.hosts', {
          productId,
          datacenterId,
        }),
      goToUsers: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.users'),
      serviceName: /* @ngInject */ (productId) => productId,
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      goBackToState: /* @ngInject */ (
        $state,
        $timeout,
        currentService,
        setMessage,
      ) => (state, message = false, type = 'success', reload = undefined) => {
        const promise = $state.go(
          state,
          { productId: currentService.serviceName },
          {
            reload: isUndefined(reload)
              ? message && type === 'success'
              : reload,
          },
        );

        if (message) {
          promise.then(() => $timeout(() => setMessage(message, type)));
        }

        return promise;
      },
      goBackToDashboard: /* @ngInject */ (goBackToState, hasVCDMigration) => (
        message = false,
        type = 'success',
        reload,
      ) =>
        goBackToState(
          `app.managedBaremetal.details.dashboard${
            hasVCDMigration ? '-light' : ''
          }`,
          message,
          type,
          reload,
        ),
      operationsUrl: /* @ngInject */ ($state, currentService) =>
        $state.href('app.managedBaremetal.details.operation', {
          productId: currentService.serviceName,
        }),
      optionsAvailable: /* @ngInject */ (
        currentService,
        currentUser,
        ovhManagerPccDashboardOptionsService,
      ) =>
        ovhManagerPccDashboardOptionsService
          .getInitialData(
            currentService.name,
            currentUser.ovhSubsidiary,
            currentService.servicePackName,
          )
          .then((model) => {
            const options = uniq(
              reduce(
                model.servicePacks.all,
                (availableOptions, servicePack) => {
                  return availableOptions.concat(
                    map(servicePack.options, (option) => option.name),
                  );
                },
                [],
              ),
            );
            return options;
          }),
      orderDatastore: /* @ngInject */ ($state, usesLegacyOrder) => (
        datacenterId,
      ) =>
        $state.go(
          usesLegacyOrder
            ? 'app.managedBaremetal.details.datacenters.datacenter.datastores.order-legacy'
            : 'app.managedBaremetal.details.datacenters.datacenter.datastores.order',
          {
            datacenterId,
          },
        ),
      orderHost: /* @ngInject */ ($state, usesLegacyOrder) => (datacenterId) =>
        $state.go(
          usesLegacyOrder
            ? 'app.managedBaremetal.details.datacenters.datacenter.hosts.order-legacy'
            : 'app.managedBaremetal.details.datacenters.datacenter.hosts.order',
          {
            datacenterId,
          },
        ),
      pccType: /* @ngInject */ (dedicatedCloud) =>
        dedicatedCloud.productReference,
      setMessage: /* @ngInject */ (Alerter) => (
        message = false,
        type = 'success',
      ) => {
        Alerter.set(`alert-${type}`, message, null, 'dedicatedCloud');
      },
      trackingPrefix: () => 'dedicated::managedBaremetal',
      vcdTrackingPrefix: () => 'Baremetal::Managed_baremetal::',
      usesLegacyOrder: /* @ngInject */ (currentService) =>
        currentService.usesLegacyOrder,
      dedicatedCloudVCDMigrationState: /* @ngInject */ (
        DedicatedCloud,
        productId,
        managedVCDAvailability,
      ) =>
        managedVCDAvailability
          ? DedicatedCloud.getVCDMigrationState(productId)
          : null,
      dedicatedCloudPCCMigrationState: /* @ngInject */ (
        DedicatedCloud,
        productId,
        managedVCDAvailability,
      ) =>
        managedVCDAvailability
          ? DedicatedCloud.getPCCMigrationState(productId)
          : null,
      hasVCDMigration: /* @ngInject */ (dedicatedCloudVCDMigrationState) =>
        dedicatedCloudVCDMigrationState?.hasMigration,
      breadcrumb: /* @ngInject */ (productId) => productId,
    },
    views: {
      '': 'ovhManagerPcc',
    },
    reloadOnSearch: false,
  });
};
