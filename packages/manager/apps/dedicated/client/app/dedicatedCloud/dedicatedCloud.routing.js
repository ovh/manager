import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import head from 'lodash/head';
import set from 'lodash/set';

import { DedicatedCloud as DedicatedCloudInfo } from '@ovh-ux/manager-models';
import { Environment } from '@ovh-ux/manager-config';
import { SURVEY } from './dedicatedCloud.constants';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../components/dedicated-cloud/datacenter/drp/dedicatedCloud-datacenter-drp.constants';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('app.dedicatedClouds', {
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
        $state.href('app.dedicatedClouds.datacenters', { productId }),
      pccDashboardLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.dedicatedClouds', { productId }),
      licenseLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.dedicatedClouds.license', { productId }),
      operationLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.dedicatedClouds.operation', { productId }),
      securityLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.dedicatedClouds.security', { productId }),
      usersLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.dedicatedClouds.users', { productId }),
      goToDrp: /* @ngInject */ ($state, currentDrp) => (datacenterId) =>
        $state.go('app.dedicatedClouds.datacenter.drp', {
          datacenterId,
          drpInformations: currentDrp,
        }),
      goToDrpDatacenterSelection: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.drpDatacenterSelection'),
      goToPccDashboard: /* @ngInject */ ($state) => (reload = false) =>
        $state.go('app.dedicatedClouds', {}, { reload }),
      goToVpnConfiguration: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go('app.dedicatedClouds.datacenter.drp.summary', {
          datacenterId: currentDrp.datacenterId,
          drpInformations: currentDrp,
        }),
      goToDatacenter: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.dedicatedClouds.datacenter', {
          productId,
          datacenterId,
        }),
      goToDatastores: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.dedicatedClouds.datacenter.datastores', {
          productId,
          datacenterId,
        }),
      goToHosts: /* @ngInject */ ($state, productId) => (datacenterId) =>
        $state.go('app.dedicatedClouds.datacenter.hosts', {
          productId,
          datacenterId,
        }),
      goToUsers: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.users'),
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
      ) => goBackToState('app.dedicatedClouds', message, type),
      operationsUrl: /* @ngInject */ ($state, currentService) =>
        $state.href('app.dedicatedClouds.operation', {
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
            ? 'app.dedicatedClouds.datacenter.datastores.order-legacy'
            : 'app.dedicatedClouds.datacenter.datastores.order',
          {
            datacenterId,
          },
        ),
      orderHost: /* @ngInject */ ($state, usesLegacyOrder) => (datacenterId) =>
        $state.go(
          usesLegacyOrder
            ? 'app.dedicatedClouds.datacenter.hosts.order-legacy'
            : 'app.dedicatedClouds.datacenter.hosts.order',
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
      trackingPrefix: () => 'dedicated::dedicatedClouds',
      usesLegacyOrder: /* @ngInject */ (currentService) =>
        currentService.usesLegacyOrder,
      surveyUrl: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability('dedicated-cloud:survey')
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable('dedicated-cloud:survey')
              ? SURVEY[Environment.getUserLanguage().toUpperCase()] ||
                SURVEY.default
              : null,
          ),
      deleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.deleteDrp'),
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
          .then((response) =>
            map(response.data, (taskId) =>
              $http
                .get(
                  `/dedicatedCloud/${currentService.serviceName}/task/${taskId}`,
                )
                .then(({ data }) => data),
            ),
          )
          .then((tasks) =>
            set(currentService, 'vcenterUpgradePendingTask', head(tasks)),
          ),
      onUpgradeVersion: /* @ngInject */ ($state, currentService) => (
        targetVersion,
      ) =>
        $state.go('app.dedicatedClouds.update', {
          currentService,
          targetVersion,
        }),

      onAssociateIpBlock: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.associate-ip-bloc'),

      onExecutionDateChange: /* @ngInject */ ($state, currentService) => () =>
        $state.go('app.dedicatedClouds.operation.execution-date-edit', {
          productId: currentService.serviceName,
          operationToEdit: currentService.vcenterUpgradePendingTask,
        }),

      onMlSubscribe: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.ml-subscribe'),

      onTerminate: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.terminate'),

      onBasicOptionsUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedClouds.servicePackUpgrade.basicOptions',
          stateParams,
        ),

      onCertificationUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedClouds.servicePackUpgrade.certification',
          stateParams,
        ),

      onConfigurationOnlyUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedClouds.servicePackUpgrade.configurationOnly',
          stateParams,
        ),

      orderSecurityOption: /* @ngInject */ ($state) => (optionName) =>
        $state.go('app.dedicatedClouds.security-options', {
          optionName,
        }),

      disableVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.dedicatedClouds.vmware-option-disable', {
          option,
        }),

      orderVmwareOption: /* @ngInject */ ($state) => (option) =>
        $state.go('app.dedicatedClouds.vmware-option-order', {
          option,
        }),
    },
    url: '/configuration/dedicated_cloud/:productId',
    views: {
      '': 'ovhManagerPcc',
    },
    reloadOnSearch: false,
  });

  // ensure compatibility with links sended by emails
  // like #/configuration/dedicated_cloud/pcc-123456?action=confirmcancel&token=myToken
  // make a redirect to the new url of ui route
  $urlServiceProvider.rules.when(
    '/configuration/dedicated_cloud/:productId?action&token',
    (match) => {
      if (match.action === 'confirmcancel') {
        return `/configuration/dedicated_cloud/${match.productId}/terminate-confirm?token=${match.token}`;
      }

      return false;
    },
  );
};
