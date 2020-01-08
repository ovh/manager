import get from 'lodash/get';

import component from './dedicatedCloud-datacenter-drp.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp', {
    url: '/drp',
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter': component.name,
    },
    params: {
      selectedDrpType: null,
    },
    resolve: {
      datacenterHosts: /* @ngInject */ ($stateParams, DedicatedCloud) =>
        DedicatedCloud.getHosts(
          $stateParams.productId,
          $stateParams.datacenterId,
        ),
      datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) =>
        DedicatedCloud.getDatacenters($stateParams.productId).then(
          ({ results }) => results,
        ),
      disableForUS: /* @ngInject */ ($q, isDrpAvailable) =>
        !isDrpAvailable ? $q.reject() : $q.when(),
      getIpOrderLink: /* @ngInject */ ($state) => (
        drpType,
        isLegacyOrder,
        pccStep,
      ) =>
        $state.href(
          `app.dedicatedClouds.datacenter.drp.${drpType}.${pccStep}.${
            isLegacyOrder ? 'legacyOrderIp' : 'orderIp'
          }`,
        ),
      setDisableSuccessAlertPreference: /* @ngInject */ (dedicatedCloudDrp) => (
        pccId,
        value,
      ) => dedicatedCloudDrp.setDisableSuccessAlertPreference(pccId, value),
      selectedDrpType: /* @ngInject */ ($transition$) => ({
        id: get($transition$.params().selectedDrpType, 'id', null),
      }),
      setupConfiguration: /* @ngInject */ (
        $q,
        $translate,
        $timeout,
        $window,
        dedicatedCloudDrp,
        displayErrorMessage,
        displayInfoMessage,
        displaySuccessMessage,
        goToPccDashboard,
        setDisableSuccessAlertPreference,
        storeZertoOptionOrderInUserPref,
        DEDICATED_CLOUD_CONSTANTS,
      ) => (drpInformations) =>
        dedicatedCloudDrp
          .enableDrp(
            drpInformations,
            drpInformations.primaryPcc.generation !==
              DEDICATED_CLOUD_CONSTANTS.pccNewGeneration,
          )
          .then((enableDrp) => {
            const storeOptionPromise = enableDrp.url
              ? storeZertoOptionOrderInUserPref(drpInformations, enableDrp)
              : $q.when();

            return $q
              .all([
                storeOptionPromise,
                setDisableSuccessAlertPreference(
                  drpInformations.primaryPcc.serviceName,
                  false,
                ),
              ])
              .then(() => goToPccDashboard(true))
              .then(() => {
                if (!enableDrp.hasAutoPay) {
                  displaySuccessMessage(
                    `${$translate.instant(
                      'dedicatedCloud_datacenter_drp_confirm_order',
                      { billUrl: enableDrp.url },
                    )}`,
                  );
                  $window.open(enableDrp.url, '_blank');
                } else {
                  displayInfoMessage(`
                    ${$translate.instant(
                      'dedicatedCloud_datacenter_drp_confirm_creation_pending',
                    )} ${$translate.instant(
                    'dedicatedCloud_datacenter_drp_confirm_creation_pending_task',
                  )}
                `);
                }
              });
          })
          .catch((error) => {
            displayErrorMessage(
              `${$translate.instant(
                'dedicatedCloud_datacenter_drp_confirm_create_error',
              )} ${get(error, 'data.message', error.message)}`,
            );
          }),
      storedDrpInformations: /* @ngInject */ (
        currentService,
        dedicatedCloudDrp,
      ) =>
        dedicatedCloudDrp.checkForZertoOptionOrder(currentService.serviceName),

      storeZertoOptionOrderInUserPref: /* @ngInject */ (dedicatedCloudDrp) => (
        drpInformations,
        enableDrp,
      ) =>
        dedicatedCloudDrp.storeZertoOptionOrderInUserPref(
          drpInformations,
          enableDrp,
        ),

      displayErrorMessage: /* @ngInject */ (Alerter) => (errorMessage) =>
        Alerter.error(errorMessage, 'dedicatedCloudDatacenterDrpAlert'),
      displayInfoMessage: /* @ngInject */ (Alerter) => (message) =>
        Alerter.set('alert-info', message, null, 'dedicatedCloud_alert'),
      displaySuccessMessage: /* @ngInject */ (Alerter) => (successMessage) =>
        Alerter.success(successMessage, 'dedicatedCloud_alert'),

      goToConfiguration: /* @ngInject */ ($state) => (
        drpInformations,
        stateToGo,
      ) =>
        $state.go(`app.dedicatedClouds.datacenter.drp.${stateToGo}`, {
          drpInformations,
        }),
      goToSummary: /* @ngInject */ ($state) => (drpInformations) =>
        $state.go('app.dedicatedClouds.datacenter.drp.summary', {
          drpInformations,
        }),
    },
  });
};
