import get from 'lodash/get';

import { PRICING_MODES } from '../../upscale/upscale.constants';
import { TERMINATE_OPTIONS } from './vps-terminate.constants';

import component from './vps-terminate.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: component.name,
      },
    },
    layout: 'modal',
    resolve: {
      cancel: /* @ngInject */ ($state) => () => $state.go('^'),
      confirm: /* @ngInject */ (
        $http,
        $translate,
        atInternet,
        displayErrorMessage,
        displaySuccessMessage,
        resiliationCapability,
        serviceInfo,
        serviceName,
        vps,
        vpsTerminate,
      ) => () => {
        atInternet.trackClick({
          name: 'vps::detail::dashboard::terminate::confirm',
          type: 'action',
        });
        return (vps.engagement && !!resiliationCapability?.message
          ? $http
              .post(`/support/service/terminateSBG`, {
                serviceId: serviceInfo.serviceId,
              })
              .then(() =>
                displaySuccessMessage(
                  $translate.instant('vps_terminate_success_engagement'),
                ),
              )
          : vpsTerminate
              .confirm(serviceName)
              .then(() =>
                displaySuccessMessage(
                  $translate.instant('vps_terminate_success'),
                ),
              )
        ).catch(() =>
          displayErrorMessage($translate.instant('vps_terminate_error')),
        );
      },
      degressivityInformation: /* @ngInject */ (
        availableUpgrades,
      ) =>
        availableUpgrades.find(({ prices }) =>
          prices[0].pricingMode.includes(PRICING_MODES.DEGRESSIVITY),
        ),
      displaySuccessMessage: ($state, CucCloudMessage) => (successMessage) =>
        $state
          .go('^', null, { reload: true })
          .then(() => CucCloudMessage.success(successMessage)),
      displayErrorMessage: ($state, CucCloudMessage) => (errorMessage) =>
        $state.go('^').then(() => CucCloudMessage.error(errorMessage)),
      hasManualRefund: /* @ngInject */ (coreConfig) =>
        coreConfig.isRegion('US'),
      isActionAvailable: /* @ngInject */ (
        degressivityInformation,
        resiliationCapability,
      ) =>
        degressivityInformation === undefined ||
        !!resiliationCapability?.message,
      setExpirationDateTermination: (
        $translate,
        displayErrorMessage,
        displaySuccessMessage,
        serviceInfo,
        VpsService,
      ) => (deleteAtExpiration) =>
        VpsService.updateServiceInfo({
          ...serviceInfo,
          renew: {
            ...serviceInfo.renew,
            automatic: !deleteAtExpiration ? true : serviceInfo.renew.automatic,
            deleteAtExpiration,
          },
        })
          .then(() =>
            displaySuccessMessage(
              $translate.instant(
                deleteAtExpiration
                  ? 'vps_terminate_activate_delete_at_expiration_success'
                  : 'vps_terminate_deactivate_delete_at_expiration_success',
              ),
            ),
          )
          .catch((error) =>
            displayErrorMessage(
              `
                ${$translate.instant(
                  deleteAtExpiration
                    ? 'vps_terminate_activate_delete_at_expiration_error'
                    : 'vps_terminate_deactivate_delete_at_expiration_error',
                )}
                ${get(error, 'data.message')}
                `,
            ),
          ),
      supportTicketLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#ticket'),
      terminateOptions: ($translate, resiliationCapability, serviceInfo, vps) =>
        Object.values(TERMINATE_OPTIONS)
          .filter((option) => {
            if (vps.engagement && !!resiliationCapability?.message) {
              return option === TERMINATE_OPTIONS.TERMINATE_NOW;
            }

            if (serviceInfo.renew.deleteAtExpiration) {
              return option !== TERMINATE_OPTIONS.TERMINATE_AT_EXPIRATION;
            }

            return option !== TERMINATE_OPTIONS.CANCEL_TERMINATE_AT_EXPIRATION;
          })
          .map((option) => ({
            label: $translate.instant(
              `vps_terminate_option_${option.toLowerCase()}`,
            ),
            value: option,
          })),

      validateTermination: (confirm, setExpirationDateTermination) => (
        terminateChoice,
      ) =>
        terminateChoice === TERMINATE_OPTIONS.TERMINATE_NOW
          ? confirm()
          : setExpirationDateTermination(
              terminateChoice === TERMINATE_OPTIONS.TERMINATE_AT_EXPIRATION,
            ),
      breadcrumb: () => null,
    },
  });
};
