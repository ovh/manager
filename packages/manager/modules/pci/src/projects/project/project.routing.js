import {
  GUIDES_LIST,
  GUIDE_TRACKING_TAG,
} from '../../components/project/guides-header/guides-header.constants';
import {
  ACTIONS,
  LEGACY_PLAN_CODES,
  DOCUMENTATION_LINKS,
  LOCAL_ZONE_REGION,
  DISCOVERY_PROJECT_PLANCODE,
  DISCOVERY_PROMOTION_VOUCHER,
} from './project.constants';
import { PCI_FEATURES } from '../projects.constant';

const isLegacy = (planCode) => LEGACY_PLAN_CODES.includes(planCode);

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project', {
    url: '/{projectId:[0-9a-zA-Z]{32}}?activateDiscovery',
    params: {
      activateDiscovery: {
        type: 'bool',
        value: false,
        squash: true,
      },
    },
    views: {
      '@pci': 'pciProject',
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.SETTINGS.PROJECT);
    },
    redirectTo: (transition) => {
      const injector = transition.injector();
      const $q = injector.get('$q');
      const projectPromise = injector.getAsync('project');
      const orderStatusPromise = injector.getAsync('orderStatus');
      return $q
        .all({
          project: projectPromise,
          orderStatus: orderStatusPromise,
        })
        .then(({ project, orderStatus }) => {
          const { orderId, isActivating, voucher: voucherCode } = orderStatus;
          if (isActivating) {
            return {
              state: 'pci.projects.updating',
              params: { orderId, voucherCode },
            };
          }
          if (project.status === 'creating') {
            // for specifying options of redirectTo attribute
            // we need to return a TargetState which is accessible
            // through router.stateService.target of transition object
            return transition.router.stateService.target(
              'pci.projects.project.creating',
              transition.params(),
              {
                location: false,
              },
            );
          }

          return null;
        });
    },
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      sendPageTracking: /* @ngInject */ (
        atInternet,
        isDiscoveryProject,
        projectId,
      ) => {
        atInternet.setPciProjectMode({
          isDiscoveryProject,
          projectId,
        });
      },
      activateDiscovery: /* @ngInject */ (
        $transition$,
        isDiscoveryProject,
        trackPage,
      ) => {
        const isActivateModalDisplayed =
          isDiscoveryProject && $transition$.params().activateDiscovery;

        if (isActivateModalDisplayed) {
          trackPage(
            'PublicCloud::pci::projects::project::activate-project-modal',
          );
        }

        return isActivateModalDisplayed;
      },
      orderStatus: /* @ngInject */ (PciProject, projectId) =>
        PciProject.getProjectOrderStatus(projectId),
      project: /* @ngInject */ (OvhApiCloudProject, projectId) => {
        OvhApiCloudProject.v6().resetCache();
        return OvhApiCloudProject.v6().get({
          serviceName: projectId,
        }).$promise;
      },
      setPciProjectModeTrackingProperty: /* @ngInject */ (
        atInternet,
        isDiscoveryProject,
        projectId,
      ) =>
        atInternet.setPciProjectMode({
          isDiscoveryProject,
          projectId,
        }),

      serviceId: /* @ngInject */ (service) => service?.serviceId,

      quotas: /* @ngInject */ (loadQuotas) => loadQuotas(),

      loadQuotas: /* @ngInject */ (PciProjectsService, projectId) => () =>
        PciProjectsService.getQuotas(projectId),

      serviceInfos: /* @ngInject */ (PciProject, projectId) =>
        PciProject.getServiceInfo(projectId),

      service: /* @ngInject */ ($http, serviceInfos) =>
        $http
          .get(`/services/${serviceInfos.serviceId}`)
          .then(({ data }) => data)
          .catch(() => null),

      isLegacyProject: /* @ngInject */ (service) =>
        isLegacy(service?.billing?.plan?.code),

      isMenuSidebarVisible: /* @ngInject */ ($injector) => {
        if ($injector.has('ovhShell')) {
          const ovhShell = $injector.get('ovhShell');
          return ovhShell.ux.isMenuSidebarVisible();
        }
        return false;
      },

      breadcrumb: /* @ngInject */ (project) =>
        project.status !== 'creating' ? project.description : null,

      getQuotaUrl: /* @ngInject */ ($state) => () =>
        $state.href('pci.projects.project.quota'),

      isDiscoveryProject: /* @ngInject */ (project) =>
        project.planCode === DISCOVERY_PROJECT_PLANCODE,

      discoveryPromotionVoucherAmount: /* @ngInject */ (
        pciProjectNew,
        project,
      ) =>
        project.planCode === DISCOVERY_PROJECT_PLANCODE
          ? pciProjectNew
              .checkEligibility(DISCOVERY_PROMOTION_VOUCHER)
              .then((response) => response.voucher?.credit?.text)
              .catch(() => '')
          : '',

      guideUrl: /* @ngInject */ (user) => {
        Object.keys(GUIDES_LIST).forEach((key) => {
          Object.entries(GUIDES_LIST[key]).forEach(([subKey, value]) => {
            GUIDES_LIST[key][subKey].url =
              typeof value.url === 'object'
                ? value.url[user.ovhSubsidiary] || value.url.DEFAULT
                : value.url;
          });
        });
        return GUIDES_LIST;
      },

      guideTrackingSectionTags: /* @ngInject */ () => GUIDE_TRACKING_TAG,

      onListParamChange: /* @ngInject */ ($state, $transition$) => () => {
        return $state.go(
          '.',
          {
            projectId: $transition$.params().projectId,
          },
          { inherit: false },
        );
      },

      getStateName: /* @ngInject */ ($state) => () => {
        return $state.current.name;
      },

      /**
       * contains all planed Pci Maintenance
       */
      steins: /* @ngInject */ ($http) =>
        $http
          .get('/cloud/migrationStein')
          .then(({ data: steins }) =>
            steins.sort(
              (stein1, stein2) => new Date(stein1.date) - new Date(stein2.date),
            ),
          ),

      /**
       * Available links
       */
      links: /* @ngInject */ (pciFeatures) =>
        DOCUMENTATION_LINKS.filter(({ feature }) =>
          pciFeatures.isFeatureAvailable(feature),
        ),

      /**
       * Available actions
       */
      actions: /* @ngInject */ (pciFeatures) =>
        ACTIONS.filter(({ feature }) =>
          pciFeatures.isFeatureAvailable(feature),
        ),

      customerRegions: /* @ngInject */ (PciProject, projectId) =>
        PciProject.getCustomerRegions(projectId, true),

      hasGridscaleLocalzoneRegion: /* @ngInject */ (customerRegions) =>
        customerRegions.some(({ type }) => type === LOCAL_ZONE_REGION),

      trackClick: /* @ngInject */ (atInternet) => (name) => {
        return atInternet.trackClick({
          name,
          type: 'action',
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (name) => {
        return atInternet.trackPage({
          name,
          type: 'action',
        });
      },

      onCreateProjectClick: /* @ngInject */ (trackClick, goToCreateProject) => (
        hit,
      ) => {
        trackClick(hit);

        return goToCreateProject();
      },

      goToCreateProject: /* @ngInject */ ($state) => () => {
        return $state.go('pci.projects.new');
      },

      goToProjectInactive: /* @ngInject */ ($state, projectId) => (project) =>
        $state.go('pci.projects.project.inactive', {
          project,
          projectId,
        }),

      goToRegion: /* @ngInject */ ($state, projectId) => () => {
        return $state.go('pci.projects.project.regions', {
          projectId,
        });
      },

      goToDiscoveryProjectActivationPage: /* @ngInject */ (
        $state,
        projectId,
      ) => (tagName) => {
        if (tagName) {
          this.trackClick(tagName);
        }
        return $state.go('pci.projects.project.activate', {
          projectId,
        });
      },

      vouchersCreditDetails: /* @ngInject */ (PciProject, projectId) =>
        PciProject.getVouchersCreditDetails(projectId).then(
          (vouchersCreditDetails) =>
            vouchersCreditDetails.map((voucherCreditDetails) => {
              return {
                voucher: voucherCreditDetails.voucher,
                description: voucherCreditDetails.description,
                balance: voucherCreditDetails.available_credit.text,
                expirationDate: voucherCreditDetails.validity
                  ? moment(voucherCreditDetails.validity.to).format('LLL')
                  : null,
              };
            }),
        ),

      iamLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/iam/policy'),

      getUAppUrl: /* @ngInject */ ($injector) => (...args) => {
        const ovhShell = $injector.get('ovhShell');
        return ovhShell.navigation.getURL(...args).then((url) => url);
      },
    },
  });

  // ensure compatibility with project ACTIONS ui-sref links
  // redirection to theu µapp is handled on container side
  // will be removed once project section is migrated to react
  $stateProvider.state('pci.projects.project.privateNetwork', {
    url: '/private-networks',
    template: '',
  });
};
