import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import head from 'lodash/head';
import set from 'lodash/set';

import { DedicatedCloud as DedicatedCloudInfo } from '@ovh-ux/manager-models';
import {
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('app.managedBaremetal', {
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
        managedBaremetalerviceInfos,
      ) =>
        DedicatedCloud.getSelected($stateParams.productId, true).then(
          (dedicatedCloud) => ({
            ...dedicatedCloud,
            ...dedicatedCloudDescription,
            email: currentUser.email,
            serviceInfos: managedBaremetalerviceInfos,
          }),
        ),

      dedicatedCloudDescription: /* @ngInject */ (
        $stateParams,
        DedicatedCloud,
      ) => DedicatedCloud.getDescription($stateParams.productId),

      managedBaremetalerviceInfos: /* @ngInject */ (
        $stateParams,
        OvhApiDedicatedCloud,
      ) =>
        OvhApiDedicatedCloud.v6().getServiceInfos({
          serviceName: $stateParams.productId,
        }),

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

      currentActiveLink: /* @ngInject */ ($state, productId) => () =>
        $state.href($state.current.name, { productId }),
      datacentersLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.managedBaremetal.datacenters', { productId }),
      pccDashboardLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.managedBaremetal', { productId }),
      licenseLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.managedBaremetal.license', { productId }),
      operationLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.managedBaremetal.operation', { productId }),
      securityLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.managedBaremetal.security', { productId }),
      usersLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.managedBaremetal.users', { productId }),
      goToDrp: /* @ngInject */ ($state, currentDrp) => (datacenterId) =>
        $state.go('app.managedBaremetal.datacenter.drp', {
          datacenterId,
          drpInformations: currentDrp,
        }),
      goToDrpDatacenterSelection: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.drpDatacenterSelection'),
      goToPccDashboard: /* @ngInject */ ($state) => (reload = false) =>
        $state.go('app.managedBaremetal', {}, { reload }),
      goToVpnConfiguration: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go('app.managedBaremetal.datacenter.drp.summary', {
          datacenterId: currentDrp.datacenterId,
          drpInformations: currentDrp,
        }),
      goToDatacenter: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.managedBaremetal.datacenter', {
          productId,
          datacenterId,
        }),
      goToDatastores: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.managedBaremetal.datacenter.datastores', {
          productId,
          datacenterId,
        }),
      goToHosts: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.managedBaremetal.datacenter.hosts', {
          productId,
          datacenterId,
        }),
      goToUsers: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.users'),
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
      ) => goBackToState('app.managedBaremetal', message, type),
      operationsUrl: /* @ngInject */ ($state, currentService) =>
        $state.href('app.managedBaremetal.operation', {
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
            ? 'app.managedBaremetal.datacenter.datastores.order-legacy'
            : 'app.managedBaremetal.datacenter.datastores.order',
          {
            datacenterId,
          },
        ),
      orderHost: /* @ngInject */ ($state, usesLegacyOrder) => (datacenterId) =>
        $state.go(
          usesLegacyOrder
            ? 'app.managedBaremetal.datacenter.hosts.order-legacy'
            : 'app.managedBaremetal.datacenter.hosts.order',
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
      deleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.deleteDrp'),
      isMailingListSubscriptionAvailable: /* @ngInject */ (
        ovhFeatureFlipping,
      ) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('dedicated-cloud:mailingListSubscription')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(
              'dedicated-cloud:mailingListSubscription',
            ),
          ),
      vCenterUpgradeTask: /* @ngInject */ ($http, currentService) =>
        $http
          .get(`/dedicatedCloud/${currentService.serviceName}/task`, {
            params: {
              name: 'maintenanceUpgradeVcenter',
              state: 'todo',
            },
          })
          .then((response) => {
            return map(response.data, (taskId) => {
              return $http
                .get(
                  `/dedicatedCloud/${currentService.serviceName}/task/${taskId}`,
                )
                .then((taskResponse) => taskResponse.data);
            });
          })
          .then((tasks) => {
            return set(
              currentService,
              'vcenterUpgradePendingTask',
              head(tasks),
            );
          }),
      onUpgradeVersion: /* @ngInject */ ($state, currentService) => (
        targetVersion,
      ) =>
        $state.go('app.managedBaremetal.update', {
          currentService,
          targetVersion,
        }),

      onAssociateIpBlock: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.associate-ip-bloc'),

      onExecutionDateChange: /* @ngInject */ ($state, currentService) => () =>
        $state.go('app.managedBaremetal.operation.execution-date-edit', {
          productId: currentService.serviceName,
          operationToEdit: currentService.vcenterUpgradePendingTask,
        }),

      onMlSubscribe: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.ml-subscribe'),

      onTerminate: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.terminate'),

      onBasicOptionsUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.servicePackUpgrade.basicOptions',
          stateParams,
        ),

      onCertificationUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.servicePackUpgrade.certification',
          stateParams,
        ),

      onConfigurationOnlyUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.managedBaremetal.servicePackUpgrade.configurationOnly',
          stateParams,
        ),

      orderSecurityOption: /* @ngInject */ ($state) => (optionName) =>
        $state.go('app.managedBaremetal.security-options', {
          optionName,
        }),

      disableVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.managedBaremetal.vmware-option-disable', {
          option,
        }),

      orderVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.managedBaremetal.vmware-option-order', {
          option,
        }),
    },
    url: '/configuration/managedBaremetal/:productId',
    views: {
      '': 'ovhManagerPcc',
    },
    reloadOnSearch: false,
  });

  // ensure compatibility with links sended by emails
  // like #/configuration/managedBaremetal/pcc-123456?action=confirmcancel&token=myToken
  // make a redirect to the new url of ui route
  $urlServiceProvider.rules.when(
    '/configuration/managedBaremetal/:productId?action&token',
    (match) => {
      if (match.action === 'confirmcancel') {
        return `/configuration/managedBaremetal/${match.productId}/terminate-confirm?token=${match.token}`;
      }

      return false;
    },
  );
};
