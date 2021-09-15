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
} from '../../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

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
      return 'app.managedBaremetal.details.dashboard';
    },
    resolve: {
      currentService: /* @ngInject */ (DedicatedCloud, productId) =>
        DedicatedCloud.getSelected(productId, true).then(
          (dedicatedCloudData) => new DedicatedCloudInfo(dedicatedCloudData),
        ),
      currentDrp: /* @ngInject */ (dedicatedCloudDrp, productId) =>
        dedicatedCloudDrp.getPccDrpPlan(productId).then((states) => {
          const existingPlan = states.find(
            ({ state }) =>
              state !== DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
          );

          // If no plan with state other than disabled, let's return the first datacenter plan
          const currentDrp = existingPlan || sortBy(states, 'datacenterId')[0];

          const drpVpnStatus = get(
            currentDrp,
            'remoteSiteInformation.vpnConfigState',
          );
          currentDrp.vpnStatus = drpVpnStatus;
          currentDrp.isWaitingVpnConfiguration =
            drpVpnStatus != null &&
            drpVpnStatus !==
              DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configured;

          currentDrp.state = dedicatedCloudDrp.constructor.formatStatus(
            currentDrp.state,
          );

          return dedicatedCloudDrp
            .getDisableSuccessAlertPreference(productId)
            .then((alertPreferenceValue) => {
              currentDrp.isSuccessAlertDisable = alertPreferenceValue;
            })
            .catch(() => {
              currentDrp.isSuccessAlertDisable = true;
            })
            .then(() => currentDrp);
        }),
      datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) =>
        DedicatedCloud.getDatacenters($stateParams.productId).then(
          ({ results }) => results,
        ),

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

      dedicatedCloudServiceInfos: /* @ngInject */ (
        $stateParams,
        OvhApiDedicatedCloud,
      ) =>
        OvhApiDedicatedCloud.v6().getServiceInfos({
          serviceName: $stateParams.productId,
        }),

      drpAvailability: /* @ngInject */ () => true,

      drpGlobalStatus: /* @ngInject */ (currentDrp, dedicatedCloudDrp) => ({
        error:
          dedicatedCloudDrp.constructor.isDrpNotInValidState(
            currentDrp.state,
          ) ||
          dedicatedCloudDrp.constructor.isDrpNotInValidState(
            currentDrp.vpnStatus,
          ),
        warning:
          dedicatedCloudDrp.constructor.isDrpInChangingState(
            currentDrp.state,
          ) ||
          dedicatedCloudDrp.constructor.isDrpInChangingState(
            currentDrp.vpnStatus,
          ),
        success: dedicatedCloudDrp.constructor.isDrpInValidState(
          currentDrp.state,
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
      isDrpActionPossible: /* @ngInject */ (currentDrp, dedicatedCloudDrp) =>
        dedicatedCloudDrp.constructor.isDrpActionPossible(currentDrp),

      datacentersState: () => 'app.managedBaremetal.details.datacenters',
      pccDashboardState: () => 'app.managedBaremetal.details.dashboard',
      licenseState: () => 'app.managedBaremetal.details.license',
      operationState: () => 'app.managedBaremetal.details.operation',
      securityState: () => 'app.managedBaremetal.details.security',
      usersState: () => 'app.managedBaremetal.details.users',
      goToDrp: /* @ngInject */ ($state, currentDrp) => (datacenterId) =>
        $state.go('app.managedBaremetal.details.datacenters.datacenter.drp', {
          datacenterId,
          drpInformations: currentDrp,
        }),
      goToDrpDatacenterSelection: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.managedBaremetal.details.dashboard.drpDatacenterSelection',
        ),
      goToPccDashboard: /* @ngInject */ ($state) => (reload = false) =>
        $state.go('app.managedBaremetal.details', {}, { reload }),
      goToVpnConfiguration: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go(
          'app.managedBaremetal.details.datacenters.datacenter.drp.summary',
          {
            datacenterId: currentDrp.datacenterId,
            drpInformations: currentDrp,
          },
        ),
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
      goBackToDashboard: /* @ngInject */ (goBackToState) => (
        message = false,
        type = 'success',
      ) =>
        goBackToState('app.managedBaremetal.details.dashboard', message, type),
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
      usesLegacyOrder: /* @ngInject */ (currentService) =>
        currentService.usesLegacyOrder,
      breadcrumb: /* @ngInject */ (productId) => productId,
    },
    views: {
      '': 'ovhManagerPcc',
    },
    reloadOnSearch: false,
  });
};
