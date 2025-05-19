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
        $translate,
        displayErrorMessage,
        displaySuccessMessage,
        serviceName,
        serviceInfo,
        vpsTerminate,
        coreConfig,
      ) => () => {
        vpsTerminate
          .confirm({ ...serviceInfo, serviceName },
            !coreConfig.isRegion('US')
          )
          .then(() =>
            displaySuccessMessage($translate.instant('vps_terminate_success')),
          )
          .catch(() =>
            displayErrorMessage($translate.instant('vps_terminate_error')),
          )
      },
      degressivityInformation: /* @ngInject */ (availableUpgrades) =>
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
      isActionAvailable: /* @ngInject */ (degressivityInformation) =>
        degressivityInformation === undefined,
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
      terminateOptions: ($translate, serviceInfo) =>
        (serviceInfo.renew.deleteAtExpiration
          ? [TERMINATE_OPTIONS.TERMINATE_NOW]
          : [
            TERMINATE_OPTIONS.TERMINATE_AT_EXPIRATION,
            TERMINATE_OPTIONS.TERMINATE_NOW,
          ]
        ).map((option) => ({
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
