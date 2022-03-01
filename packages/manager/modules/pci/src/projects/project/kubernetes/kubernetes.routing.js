import get from 'lodash/get';
import map from 'lodash/map';
import max from 'lodash/max';

import {
  ANTI_AFFINITY_MAX_NODES,
  SCALE_DEFAULT_VALUES,
  VERSION_ENUM_KEY,
} from './kubernetes.constants';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes', {
    url: '/kubernetes?id',
    component: 'ovhManagerPciProjectKubernetes',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.KUBERNETES);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('kubernetes')
        .then((kubernetes) =>
          kubernetes.length === 0
            ? { state: 'pci.projects.project.kubernetes.onboarding' }
            : false,
        ),
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      addCluster: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.kubernetes.add', { projectId }),
      goToKubernetes: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.kubernetes',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'kubernetes'));
        }

        return promise;
      },

      getKubeApiErrorId: /* @ngInject */ () => (error) => {
        try {
          const errorMessage = error.data?.message;
          const errorStatus = error.status;
          if (errorStatus === 412) {
            return errorMessage.slice(
              errorMessage.indexOf('[') + 1,
              errorMessage.indexOf(']'),
            );
          }
          return null;
        } catch (e) {
          return null;
        }
      },

      getQuotaBuildUrl: /* @ngInject */ (coreURLBuilder, projectId) => () => {
        return coreURLBuilder.buildURL(
          'public-cloud',
          `#/pci/projects/${projectId}/quota`,
        );
      },

      clusterId: /* @ngInject */ ($transition$) => $transition$.params().id,
      kubernetes: /* @ngInject */ (OvhApiCloudProjectKube, projectId) =>
        OvhApiCloudProjectKube.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then((kubernetes) => map(kubernetes, (id) => ({ id }))),

      autoscaling: () => ({
        autoscale: false,
        isValidScale: false,
        nodes: {
          lowest: {
            min: SCALE_DEFAULT_VALUES.LOWEST_MIN_VALUE,
            value: SCALE_DEFAULT_VALUES.LOWEST_VALUE,
            max: null,
          },
          desired: {
            min: null,
            value: SCALE_DEFAULT_VALUES.DESIRED_VALUE,
            max: null,
          },
          highest: {
            min: null,
            value: SCALE_DEFAULT_VALUES.HIGHEST_VALUE,
            max: SCALE_DEFAULT_VALUES.HIGHEST_MAX_VALUE,
          },
        },
      }),

      /* @ngInject */
      versions: (OvhApiCloud) =>
        OvhApiCloud.v6()
          .schema()
          .$promise.then((schema) => get(schema, VERSION_ENUM_KEY)),

      /* @ngInject */
      highestVersion: (versions) =>
        max(versions, (version) => parseFloat(`${version}`)),

      regions: /* @ngInject */ (projectId, coreConfig, Kubernetes) =>
        Kubernetes.getRegions(projectId, coreConfig.getUser().ovhSubsidiary),

      antiAffinityMaxNodes: /* @ngInject */ () => ANTI_AFFINITY_MAX_NODES,
      addPrivateNetworksLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.privateNetwork', {
          projectId,
        }),
      privateNetworks: /* @ngInject */ (Kubernetes, projectId) =>
        Kubernetes.getPrivateNetworks(projectId),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kube_list_title'),

      kubeTrackPrefix: () => 'PublicCloud::pci::projects::project::kubernetes',

      sendKubeTrack: /* @ngInject */ (kubeTrackPrefix, trackClick) => (
        complement,
      ) => {
        trackClick(`${kubeTrackPrefix}::${complement}`);
      },

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
