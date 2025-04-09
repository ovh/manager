import {
  TAGS_BLOB,
  FLOATINGIP_ADDON_FAMILY,
  FLOATINGIP_PLANCODE,
} from '../../../constants';
import { WINDOWS_GEN_3_ADDON_PLANCODE } from './instances.constants';
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
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_instances_title'),
      help: /* @ngInject */ ($transition$) => $transition$.params().help,
      catalog: /* @ngInject */ (CucPriceHelper, coreConfig) => {
        return CucPriceHelper.getCatalog(
          '/order/catalog/public/cloud',
          coreConfig.getUser(),
          true,
        );
      },
      instanceId: /* @ngInject */ ($transition$) => $transition$.params().id,

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
        return $http
          .get(`/cloud/project/${projectId}/capabilities/productAvailability`, {
            params: {
              addonFamily: FLOATINGIP_ADDON_FAMILY,
              ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
            },
          })
          .then(({ data: { plans } }) => {
            return plans.find(
              (plan) =>
                plan.code.includes(FLOATINGIP_PLANCODE) &&
                plan.regions.some(({ name }) => name === region),
            );
          });
      },
      assignFloatingIp: /* @ngInject */ (
        $state,
        projectId,
        trackGridAction,
        checkFloatingIpAvailability,
        ovhShell,
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
              ? ovhShell.navigation.navigateTo(
                  'public-cloud',
                  `/pci/projects/${projectId}/public-ips/order?ipType=floating_ip&region=${instance.region}&instance=${instance.id}`,
                )
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
      vrackLink: /* @ngInject */ (getUAppUrl, projectId) =>
        getUAppUrl(
          'public-cloud',
          `#/pci/projects/${projectId}/private-networks/onboarding/new`,
        ),
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
      vrack: /* @ngInject */ (OvhApiCloudProject, projectId) =>
        OvhApiCloudProject.v6()
          .vrack({
            serviceName: projectId,
          })
          .$promise.catch((error) =>
            error.status === 404 ? {} : Promise.reject(error),
          ),
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
        return $state.reload($state.current.name);
      },
      killTasks: /* @ngInject */ (Poller) => (pattern) => Poller.kill(pattern),

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
      windowsGen3: /* @ngInject */ (catalog) => ({
        price:
          catalog.addons.find(
            ({ planCode }) => planCode === WINDOWS_GEN_3_ADDON_PLANCODE,
          )?.pricings[0]?.price || null,
      }),
      snapshotAvailability: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        catalogEndpoint,
      ) =>
        PciProjectsProjectInstanceService.getSnapshotAvailability(
          projectId,
          catalogEndpoint,
        ),
    },
  });
};
