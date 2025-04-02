import kebabCase from 'lodash/kebabCase';
import 'moment';

import { EngagementConfiguration } from '@ovh-ux/manager-models';
import {
  MIGRATION_STATUS,
  NEW_RANGE_VERSION,
} from '../dashboard/vps-dashboard.constants';
import { RANGES } from '../upscale/upscale.constants';
import { FEATURE_CLOUDDATABASE, PRODUCT_NAME } from './constants';

import detailComponent from '../detail/vps-detail.component';
import headerComponent from '../header/vps-header.component';
import { VPS_GUIDES } from '../vps.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail', {
    url: '/{serviceName}',
    redirectTo: 'vps.detail.dashboard',
    resolve: {
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
        ovhPaymentMethod.getDefaultPaymentMethod().catch(() => null),
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
      serviceInfo: /* @ngInject */ (serviceName, VpsService) =>
        VpsService.getServiceInfos(serviceName).then((serviceInfo) => ({
          ...serviceInfo,
          status: serviceInfo.status,
          serviceType: PRODUCT_NAME,
        })),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      scrollToTop: () => () => {
        document.getElementById('vpsHeader').scrollIntoView();
      },
      vpsVersion: /* @ngInject */ (serviceName, coreConfig, OvhApiVps) => {
        if (coreConfig.isRegion('US')) {
          return null; // version API is not required for US VPS
        }

        return OvhApiVps.v6().version({
          serviceName,
        }).$promise;
      },
      stateVps: /* @ngInject */ (
        $q,
        serviceName,
        vpsVersion,
        coreConfig,
        OvhApiVps,
      ) =>
        OvhApiVps.v6()
          .get({
            serviceName,
          })
          .$promise.then((stateVps) => {
            const vpsState = stateVps;
            const isUsRegion = coreConfig.isRegion('US');
            const isLegacyVpsVersion = vpsVersion?.version !== 2;

            vpsState.isLegacy = isLegacyVpsVersion && !isUsRegion;

            return vpsState;
          })
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
          .get(`/vps/${serviceName}/migration2018`)
          .then(({ data }) => data)
          .catch(() => false),
      isMigrating: /* @ngInject */ (vpsMigration) =>
        vpsMigration?.status === MIGRATION_STATUS.ONGOING,

      disks: /* @ngInject */ (serviceName, VpsService) =>
        VpsService.getDisks(serviceName),

      vpsLinkedDisk: /* @ngInject */ (serviceName, disks, VpsService) =>
        VpsService.getDiskInfo(serviceName, disks[0]),

      goToUpgradeSuccess: /* @ngInject */ ($state) => (params, options) =>
        $state.go(
          'vps.detail.dashboard.configuration.upgrade',
          params,
          options,
        ),
      guides: /* @ngInject */ ($translate, coreConfig) =>
        VPS_GUIDES.map((guide) => ({
          title: $translate.instant(guide.translateKey),
          href:
            guide.url[coreConfig.getUser().ovhSubsidiary] || guide.url.DEFAULT,
        })),
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
