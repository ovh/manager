import get from 'lodash/get';

import { DEDICATED_CLOUD_CONSTANTS } from '../../../components/dedicated-cloud/dedicatedCloud.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp',
    {
      url: '/drp',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'dedicatedCloudDatacenterDrp',
      },
      params: {
        selectedDrpType: null,
      },
      redirectTo: (transition) => {
        return transition
          .injector()
          .getAsync('isZertoOnPremise')
          .then((isZertoOnPremise) => {
            return (
              isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.drp.listing'
            );
          });
      },
      resolve: {
        datacenterHosts: /* @ngInject */ ($stateParams, DedicatedCloud) =>
          DedicatedCloud.getHosts(
            $stateParams.productId,
            $stateParams.datacenterId,
          ),
        datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) =>
          DedicatedCloud.getDatacenters($stateParams.productId),
        setDisableSuccessAlertPreference: /* @ngInject */ (
          dedicatedCloudDrp,
        ) => (pccId, value) =>
          dedicatedCloudDrp.setDisableSuccessAlertPreference(pccId, value),
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
          dedicatedCloudDrp.checkForZertoOptionOrder(
            currentService.serviceName,
          ),

        storeZertoOptionOrderInUserPref: /* @ngInject */ (
          dedicatedCloudDrp,
        ) => (drpInformations, enableDrp) =>
          dedicatedCloudDrp.storeZertoOptionOrderInUserPref(
            drpInformations,
            enableDrp,
          ),

        displayErrorMessage: /* @ngInject */ (Alerter) => (errorMessage) =>
          Alerter.error(errorMessage, 'dedicatedCloudDatacenterDrpAlert'),
        displayInfoMessage: /* @ngInject */ (Alerter) => (infoMessage) =>
          Alerter.info(infoMessage, 'dedicatedCloudDatacenterDrpDashboard'),
        displaySuccessMessage: /* @ngInject */ (Alerter) => (successMessage) =>
          Alerter.success(
            successMessage,
            'dedicatedCloudDatacenterDrpDashboard',
          ),

        goToConfiguration: /* @ngInject */ ($state) => (
          drpInformations,
          stateToGo,
        ) =>
          $state.go(
            `app.managedBaremetal.details.datacenters.datacenter.drp.${stateToGo}`,
            {
              drpInformations,
            },
          ),
        goToSummary: /* @ngInject */ ($state) => (drpInformations) =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.drp.summary',
            {
              drpInformations,
            },
          ),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('managed_baremetal_datacenters_datacenter_drp'),
        zertoState: /* @ngInject */ (
          dedicatedCloudDrp,
          serviceName,
          datacenterId,
        ) => dedicatedCloudDrp.getDrpState({ serviceName, datacenterId }),
        isZertoOnPremise: /* @ngInject */ (zertoState) =>
          zertoState.drpType === 'onPremise',
        goToAddSite: /* @ngInject */ ($state, productId, datacenterId) => () =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.drp.addSite',
            {
              productId,
              datacenterId,
            },
          ),
      },
    },
  );
};
