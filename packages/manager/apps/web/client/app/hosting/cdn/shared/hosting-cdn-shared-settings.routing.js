import includes from 'lodash/includes';

import template from './leave-confirm-settings/leave/hosting-shared-leave-settings.html';
import controller from './leave-confirm-settings/leave/hosting-shared-leave-settings.controller';

export default /* @ngInject */ ($stateProvider) => {
  const isLeaveSettings = { status: false };
  const openModal = ($uibModal, model, rules) => {
    return $uibModal.open({
      template,
      controller,
      backdrop: 'static',
      controllerAs: '$ctrl',
      resolve: {
        params: {
          model,
          domain: {},
          rules,
        },
      },
    });
  };
  $stateProvider.state('app.hosting.cdn.shared', {
    url: '/shared/settings/:domainName',
    params: {
      domain: null,
    },
    component: 'hostingCdnSharedSettings',
    resolve: {
      goBack: /* @ngInject */ (goToHosting) => goToHosting,

      domainName: /* @ngInject */ ($transition$) =>
        $transition$.params().domainName,

      domainOptions: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
        domainName,
      ) =>
        HostingCdnSharedService.getCDNDomainsOptions(
          serviceName,
          domainName,
        ).then(({ data }) => data),

      cdnDetails: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
        domainName,
      ) =>
        HostingCdnSharedService.getSharedCDNDomainDetails(
          serviceName,
          domainName,
        ).then(({ data }) => data),

      availableOptions: /* @ngInject */ (
        HostingCdnSharedService,
        serviceName,
      ) =>
        HostingCdnSharedService.getSharedCDNAvailableOptions(serviceName).then(
          ({ data }) => data,
        ),

      displayCreateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.cdn.shared.addCacheRule', params),

      displayUpdateCacheRuleModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.cdn.shared.editCacheRule', params),

      displayConfirmSettingsModal: /* @ngInject */ ($state) => (params) =>
        $state.go('app.hosting.cdn.shared.confirmSettings', params),

      displayLeaveSettingsModal: /* @ngInject */ (
        $uibModal,
        HostingCdnSharedService,
        goBack,
      ) => (model, { rules, changed }) => {
        if (changed) {
          openModal($uibModal, model, rules).result.catch(() => {
            isLeaveSettings.status = true;
            goBack();
          });
        } else {
          goBack();
        }
      },

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
    atInternet: {
      rename: 'web::hosting::cdn::configure',
    },
    onExit: ($transition$) => {
      const $q = $transition$.injector().get('$q');
      const $uibModal = $transition$.injector().get('$uibModal');
      const HostingCdnSharedService = $transition$
        .injector()
        .get('HostingCdnSharedService');
      const stateName = $transition$.to().name;

      const isValidState =
        includes(['app.hosting.cdn.shared.addCacheRule'], stateName) ||
        HostingCdnSharedService.isValidCase;

      if (
        !isLeaveSettings.status &&
        !isValidState &&
        HostingCdnSharedService.settingsToSave
      ) {
        return $q((resolve) => {
          openModal(
            $uibModal,
            HostingCdnSharedService.model,
            HostingCdnSharedService.model.rules,
          )
            .result.then(() => {
              resolve(false);
            })
            .catch(() => {
              resolve();
            });
        });
      }

      return true;
    },
  });
};
