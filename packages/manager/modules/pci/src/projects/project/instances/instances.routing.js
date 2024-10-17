import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

import { TAGS_BLOB } from '../../../constants';
import {
  POLLER_INSTANCE_NAMESPACE,
  TYPES_TO_EXCLUDE,
} from './instances.constants';
import Instance from '../../../components/project/instance/instance.class';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances', {
    url: '/instances?help&id',
    component: 'pciProjectsProjectInstances',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.INSTANCE);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('instances')
        .then((instances) =>
          instances.length === 0
            ? { state: 'pci.projects.project.instances.onboarding' }
            : false,
        ),
    onExit: /* @ngInject */ (killTasks) => {
      killTasks({ namespace: POLLER_INSTANCE_NAMESPACE.SHELVE });
      killTasks({ namespace: POLLER_INSTANCE_NAMESPACE.UNSHELVE });
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_instances_title'),
      help: /* @ngInject */ ($transition$) => $transition$.params().help,
      catalog: /* @ngInject */ ($http, coreConfig) => {
        return $http
          .get('/order/catalog/public/cloud', {
            params: {
              productName: 'cloud',
              ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
            },
          })
          .then(({ data: catalog }) => catalog);
      },
      instances: /* @ngInject */ (
        catalog,
        $q,
        PciProjectsProjectInstanceService,
        projectId,
        getFloatingIps,
        customerRegions,
      ) =>
        $q
          .all({
            instances: PciProjectsProjectInstanceService.getAll(
              projectId,
              customerRegions,
            ),
            floatingIps: getFloatingIps(),
          })
          .then(({ instances, floatingIps }) => {
            const updatedInstances = map(instances, (instance) => ({
              ...instance,
              floatingIp: floatingIps.find(
                (floatingIp) =>
                  floatingIp?.associatedEntity?.id === instance.id,
              ),
            }));
            return $q
              .all(
                updatedInstances.map((instance) => {
                  return PciProjectsProjectInstanceService.getInstanceFlavor(
                    projectId,
                    instance,
                  ).then((flavor) => {
                    return new Instance({
                      ...instance,
                      flavor,
                    });
                  });
                }),
              )
              .then((data) =>
                filter(
                  data,
                  (instance) =>
                    !find(TYPES_TO_EXCLUDE, (pattern) =>
                      pattern.test(get(instance, 'flavor.type')),
                    ),
                ),
              );
          }),
      instanceId: /* @ngInject */ ($transition$) => $transition$.params().id,

      instancesRegions: /* @ngInject */ (instances) =>
        Array.from(new Set(instances.map(({ region }) => region))),

      addInstance: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.instances.add', {
          projectId,
        }),
      trackingPrefix: /* @ngInject */ () =>
        `PublicCloud::pci::projects::project::instances`,
      trackGridAction: /* @ngInject */ (atInternet, trackingPrefix) => (
        label,
      ) =>
        atInternet.trackClick({
          name: `${trackingPrefix}::table-option-menu::${label}`,
          type: 'action',
        }),
      viewInstance: /* @ngInject */ ($state, projectId, trackGridAction) => (
        instance,
      ) => {
        trackGridAction('details');
        return $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId: instance.id,
        });
      },
      editInstance: /* @ngInject */ ($state, projectId, trackGridAction) => (
        instance,
      ) => {
        trackGridAction('edit');
        return $state.go('pci.projects.project.instances.instance.edit', {
          projectId,
          instanceId: instance.id,
        });
      },
      checkFloatingIpAvailability: /* @ngInject */ (
        $http,
        coreConfig,
        projectId,
      ) => (region) => {
        const planCode = 'floatingip.floatingip.hour.consumption';
        return $http
          .get(`/cloud/project/${projectId}/capabilities/productAvailability`, {
            params: {
              planCode,
              ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
            },
          })
          .then(({ data: { plans } }) => {
            return plans
              .find(({ code }) => code === planCode)
              ?.regions.some(({ name }) => name === region);
          });
      },
      assignFloatingIp: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
        checkFloatingIpAvailability,
      ) => (instance) => {
        trackGridAction('assign-floating-ip');
        if (instance.privateIpV4.length === 0) {
          return $state.go(
            'pci.projects.project.instances.create-private-network-warning',
            {
              projectId,
              instanceId: instance.id,
            },
          );
        }
        return checkFloatingIpAvailability(instance.region).then(
          (isFloatingIpAvailableInInstanceRegion) => {
            return isFloatingIpAvailableInInstanceRegion
              ? $state.go('pci.projects.project.additional-ips.order', {
                  projectId,
                  ipType: 'floating_ip',
                  region: instance.region,
                  instance: instance.id,
                })
              : null;
          },
        );
      },
      enableMonthlyBillingInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('active-monthly-billing');
        return $state.go(
          'pci.projects.project.instances.active-monthly-billing',
          {
            projectId,
            instanceId: instance.id,
          },
        );
      },

      hasComingSoonFlavorTag: /* @ngInject */ () => (flavor) =>
        flavor?.tags?.includes(TAGS_BLOB.COMING_SOON),

      createBackupInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('create-backup');
        return $state.go('pci.projects.project.instances.backup', {
          projectId,
          instanceId: instance.id,
        });
      },
      startRescueInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('reboot');
        return $state.go('pci.projects.project.instances.rescue', {
          projectId,
          instanceId: instance.id,
        });
      },
      endRescueInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('exit-rescue');
        return $state.go('pci.projects.project.instances.unrescue', {
          projectId,
          instanceId: instance.id,
        });
      },
      softRebootInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('hot-reboot');
        return $state.go('pci.projects.project.instances.soft-reboot', {
          projectId,
          instanceId: instance.id,
        });
      },
      hardRebootInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('cold-reboot');
        return $state.go('pci.projects.project.instances.hard-reboot', {
          projectId,
          instanceId: instance.id,
        });
      },
      startInstance: /* @ngInject */ ($state, projectId, trackGridAction) => (
        instance,
      ) => {
        trackGridAction('boot');
        return $state.go('pci.projects.project.instances.start', {
          projectId,
          instanceId: instance.id,
        });
      },
      shelveInstance: /* @ngInject */ ($state, projectId, trackGridAction) => (
        instance,
      ) => {
        trackGridAction('suspend');
        return $state.go('pci.projects.project.instances.shelve', {
          projectId,
          instanceId: instance.id,
        });
      },
      stopInstance: /* @ngInject */ ($state, projectId, trackGridAction) => (
        instance,
      ) => {
        trackGridAction('stop');
        return $state.go('pci.projects.project.instances.stop', {
          projectId,
          instanceId: instance.id,
        });
      },
      unshelveInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('reactivate');
        return $state.go('pci.projects.project.instances.unshelve', {
          projectId,
          instanceId: instance.id,
        });
      },
      reinstallInstance: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('reinstall');
        return $state.go('pci.projects.project.instances.reinstall', {
          projectId,
          instanceId: instance.id,
        });
      },
      resumeInstance: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.go('pci.projects.project.instances.resume', {
          projectId,
          instanceId: instance.id,
        }),
      deleteInstance: /* @ngInject */ ($state, projectId, trackGridAction) => (
        instance,
      ) => {
        trackGridAction('delete');
        return $state.go('pci.projects.project.instances.delete', {
          projectId,
          instanceId: instance.id,
        });
      },
      instanceLink: /* @ngInject */ ($state, projectId) => (instance) =>
        $state.href('pci.projects.project.instances.instance', {
          projectId,
          instanceId: instance.id,
        }),
      vrackLink: /* @ngInject */ ($state, projectId) => () =>
        $state.href('pci.projects.project.privateNetwork.vrack.new', {
          projectId,
        }),
      scheduleAutoBackup: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
      ) => (instance) => {
        trackGridAction('create-automatic-backup');
        return $state.go('pci.projects.project.workflow.new', {
          projectId,
          selectedInstance: instance,
        });
      },
      vrack: /* @ngInject */ (PciPrivateNetworks, projectId) =>
        PciPrivateNetworks.getVrack(projectId),
      goToInstances: /* @ngInject */ (CucCloudMessage, $state, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.instances',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](message, 'pci.projects.project.instances'),
          );
        }

        return promise;
      },
      refreshInstances: /* @ngInject */ (
        $state,
        OvhApiCloudProjectInstance,
      ) => () => {
        OvhApiCloudProjectInstance.v6().resetAllCache();
        return $state.reload();
      },
      killTasks: /* @ngInject */ (Poller) => (pattern) => Poller.kill(pattern),

      /** If one/some instances is still in shelving we run a sub task until the instance is shelved
       * Also, the sub tasks are killed if changed state is different from instances.*
       */
      pollShelvingInstances: /* @ngInject */ (
        $translate,
        CucCloudMessage,
        Poller,
        instances,
        projectId,
        refreshInstances,
      ) => {
        instances.forEach((instance) => {
          if (instance.isShelving()) {
            const endPointUrl = `/cloud/project/${projectId}/instance/${instance.id}`;
            Poller.poll(endPointUrl, null, {
              interval: 5000,
              successRule(i) {
                return new Instance(i).isShelved();
              },
              namespace: POLLER_INSTANCE_NAMESPACE.SHELVE,
              notifyOnError: false,
            })
              .then(() => refreshInstances())
              .then(() =>
                CucCloudMessage.success(
                  $translate.instant(
                    'pci_projects_project_instances_instance_shelve_success_message',
                    {
                      instance: instance.name,
                    },
                  ),
                ),
              );
          }
        });
      },

      /** If one/some instances is still in unshelving we run a sub task until the instance is active
       * Also, the sub tasks are killed if changed state is different from instances.*
       */
      pollUnshelvingInstances: /* @ngInject */ (
        $translate,
        CucCloudMessage,
        Poller,
        instances,
        projectId,
        refreshInstances,
      ) => {
        instances.forEach((instance) => {
          if (instance.isUnshelving()) {
            const endPointUrl = `/cloud/project/${projectId}/instance/${instance.id}`;
            Poller.poll(endPointUrl, null, {
              interval: 5000,
              successRule(i) {
                return new Instance(i).isStarted();
              },
              namespace: POLLER_INSTANCE_NAMESPACE.UNSHELVE,
              notifyOnError: false,
            })
              .then(() => refreshInstances())
              .then(() =>
                CucCloudMessage.success(
                  $translate.instant(
                    'pci_projects_project_instances_instance_unshelve_success_message',
                    {
                      instance: instance.name,
                    },
                  ),
                ),
              );
          }
        });
      },
      isAdditionalIpsAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        return ovhFeatureFlipping
          .checkFeatureAvailability(PCI_FEATURES.PRODUCTS.ADDITIONAL_IP)
          .then((feature) =>
            feature.isFeatureAvailable(PCI_FEATURES.PRODUCTS.ADDITIONAL_IP),
          );
      },
      getFloatingIps: /* @ngInject */ ($http, projectId) => () =>
        $http
          .get(`/cloud/project/${projectId}/aggregated/floatingip`)
          .then(({ data }) => data.resources),
      floatingIpsLink: /* @ngInject */ (getUAppUrl, projectId) =>
        getUAppUrl(
          'public-cloud',
          `#/pci/projects/${projectId}/public-ips/floating-ips`,
        ),
      isInstanceLocalZoneBackupAvailable: /* @ngInject */ (pciFeatures) => {
        return pciFeatures.isFeatureAvailable(
          PCI_FEATURES.ACTIONS.INSTANCE_LOCALZONE_BACKUP,
        );
      },
    },
  });
};
