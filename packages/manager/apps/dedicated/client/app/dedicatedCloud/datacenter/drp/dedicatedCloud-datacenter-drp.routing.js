import get from 'lodash/get';

import { DEDICATED_CLOUD_CONSTANTS } from '../../../components/dedicated-cloud/dedicatedCloud.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.datacenter.details.drp', {
    url: '/drp',
    views: {
      'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
        'dedicatedCloudDatacenterDrp',
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
        $window,
        dedicatedCloudDrp,
        displayErrorMessage,
        displayInfoMessage,
        displaySuccessMessage,
        goToPccDashboard,
        pccType,
        setDisableSuccessAlertPreference,
        storeZertoOptionOrderInUserPref,
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
                    `dedicatedCloud_datacenter_drp_confirm_creation_pending_task_${pccType}`,
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
      displayInfoMessage: /* @ngInject */ (setMessage) => (message) =>
        setMessage(message, 'info'),
      displaySuccessMessage: /* @ngInject */ (Alerter) => (successMessage) =>
        Alerter.success(successMessage, 'dedicatedCloud_alert'),

      goToConfiguration: /* @ngInject */ ($state) => (
        drpInformations,
        stateToGo,
      ) =>
        $state.go(
          `app.dedicatedCloud.details.datacenter.details.drp.${stateToGo}`,
          {
            drpInformations,
          },
        ),
      goToSummary: /* @ngInject */ ($state) => (drpInformations) =>
        $state.go('app.dedicatedCloud.details.datacenter.details.drp.summary', {
          drpInformations,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_datacenters_datacenter_drp'),
    },
  });
};
