import kebabCase from 'lodash/kebabCase';
import 'moment';

import { EngagementConfiguration } from '@ovh-ux/manager-models';
import {
  NEW_RANGE_VERSION,
  MIGRATION_STATUS,
} from '../dashboard/vps-dashboard.constants';
import { RANGES } from '../upscale/upscale.constants';
import { FEATURE_CLOUDDATABASE, PRODUCT_NAME } from './constants';

import detailComponent from '../detail/vps-detail.component';
import headerComponent from '../header/vps-header.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail', {
    url: '/{serviceName}',
    redirectTo: 'vps.detail.dashboard',
    resolve: {
      resiliationCapability: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/incident/resiliation/${serviceName}`, {
            serviceType: 'aapi',
          })
          .then(({ data }) => data)
          .catch(() => null),
      connectedUser: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      capabilities: /* @ngInject */ ($http, serviceName, stateVps) =>
        $http
          .get(`/vps/capabilities/${serviceName}`, {
            serviceType: 'aapi',
            params: {
              modelName: stateVps.model.name,
            },
          })
          .then(({ data: capabilities }) =>
            capabilities.map((capability) => kebabCase(capability)),
          ),
      defaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),
      engagement: /* @ngInject */ (vps) =>
        vps.engagement ? new EngagementConfiguration(vps.engagement) : null,
      hasCloudDatabaseFeature: /* @ngInject */ (
        CucFeatureAvailabilityService,
      ) =>
        CucFeatureAvailabilityService.hasFeaturePromise(
          PRODUCT_NAME,
          FEATURE_CLOUDDATABASE,
        ),
      goBack: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
        data,
      ) => {
        const state = 'vps.detail.dashboard';
        const promise = $state.go(state, data);
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },
      hasBackupStorage: /* @ngInject */ (isVpsNewRange, tabSummary) => {
        return tabSummary.ftpBackup?.optionActivated || !isVpsNewRange;
      },
      isVpsNewRange: /* @ngInject */ (stateVps) =>
        stateVps.model.version === NEW_RANGE_VERSION &&
        !~stateVps.model.name.indexOf(RANGES.BESTVALUE),
      plan: /* @ngInject */ (serviceInfo) => ({
        ...serviceInfo,
        creation: moment(serviceInfo.creation).format('LL'),
        expiration: moment(serviceInfo.expiration).format('LL'),
      }),
      serviceInfo: /* @ngInject */ (
        resiliationCapability,
        serviceName,
        VpsService,
      ) =>
        VpsService.getServiceInfos(serviceName).then((serviceInfo) => ({
          ...serviceInfo,
          status: resiliationCapability?.billingInformation
            ? 'FORCED_MANUAL'
            : serviceInfo.status,
          statusHelp: resiliationCapability?.billingInformation,
        })),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      scrollToTop: () => () => {
        document.getElementById('vpsHeader').scrollIntoView();
      },
      stateVps: /* @ngInject */ ($q, serviceName, OvhApiVps) =>
        OvhApiVps.v6()
          .get({
            serviceName,
          })
          .$promise.then((stateVps) =>
            OvhApiVps.v6()
              .version({
                serviceName,
              })
              .$promise.then((response) => {
                const vpsState = stateVps;
                vpsState.isLegacy = response.version !== 2;
                return vpsState;
              }),
          )
          .catch((error) => {
            if (error.status === 404) {
              return $q.reject(error);
            }
            return true;
          }),
      tabSummary: /* @ngInject */ (serviceName, VpsService) => {
        const forceRefresh = true;
        return VpsService.getTabSummary(serviceName, forceRefresh);
      },
      vps: /* @ngInject */ (serviceName, VpsService) =>
        VpsService.getSelectedVps(serviceName),

      catalog: /* @ngInject */ (connectedUser, VpsService) =>
        VpsService.getCatalog(connectedUser.ovhSubsidiary),

      vpsMigration: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/vps/${serviceName}/migration2016`)
          .then(({ data }) => data)
          .catch(() => false),
      isMigrating: /* @ngInject */ (vpsMigration) =>
        vpsMigration?.status === MIGRATION_STATUS.ONGOING,

      goToUpgradeSuccess: /* @ngInject */ ($state) => (params, options) =>
        $state.go(
          'vps.detail.dashboard.configuration.upgrade',
          params,
          options,
        ),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
    views: {
      'vpsHeader@vps': {
        component: headerComponent.name,
      },
      'vpsContainer@vps': {
        component: detailComponent.name,
      },
    },
  });
};
