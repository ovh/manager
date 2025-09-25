import get from 'lodash/get';

import { DEDICATED_CLOUD_CONSTANTS } from '../../../components/dedicated-cloud/dedicatedCloud.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.zerto',
    {
      url: '/zerto',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter':
          'dedicatedCloudDatacenterZerto',
      },
      params: {
        selectedZertoType: null,
      },
      redirectTo: (transition) => {
        return transition
          .injector()
          .get('$q')
          .all({
            isZertoOnPremise: transition
              .injector()
              .getAsync('isZertoOnPremise'),
          })
          .then(({ isZertoOnPremise }) => {
            return (
              isZertoOnPremise &&
              'app.managedBaremetal.details.datacenters.datacenter.zerto.listing'
            );
          });
      },
      resolve: {
        shouldBeConfigured: /* @ngInject */ (currentZerto) =>
          ['notConfigured', 'error'].includes(currentZerto.vpnStatus),
        datacenterHosts: /* @ngInject */ ($stateParams, DedicatedCloud) =>
          DedicatedCloud.getHosts(
            $stateParams.productId,
            $stateParams.datacenterId,
          ),
        datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) =>
          DedicatedCloud.getDatacenters($stateParams.productId),
        setDisableSuccessAlertPreference: /* @ngInject */ (
          dedicatedCloudZerto,
        ) => (pccId, value) =>
          dedicatedCloudZerto.setDisableSuccessAlertPreference(pccId, value),
        selectedZertoType: /* @ngInject */ ($transition$) => ({
          id: get($transition$.params().selectedZertoType, 'id', null),
        }),
        setupConfiguration: /* @ngInject */ (
          $q,
          $translate,
          $window,
          dedicatedCloudZerto,
          displayErrorMessage,
          displayInfoMessage,
          displaySuccessMessage,
          goToPccDashboard,
          pccType,
          setDisableSuccessAlertPreference,
          storeZertoOptionOrderInUserPref,
        ) => (zertoInformations) =>
          dedicatedCloudZerto
            .enableZerto(
              zertoInformations,
              zertoInformations.primaryPcc.generation !==
                DEDICATED_CLOUD_CONSTANTS.pccNewGeneration,
            )
            .then((enableZerto) => {
              const storeOptionPromise = enableZerto.url
                ? storeZertoOptionOrderInUserPref(
                    zertoInformations,
                    enableZerto,
                  )
                : $q.when();

              return $q
                .all([
                  storeOptionPromise,
                  setDisableSuccessAlertPreference(
                    zertoInformations.primaryPcc.serviceName,
                    false,
                  ),
                ])
                .then(() => goToPccDashboard(true))
                .then(() => {
                  if (!enableZerto.hasAutoPay) {
                    displaySuccessMessage(
                      `${$translate.instant(
                        'dedicatedCloud_datacenter_drp_confirm_order',
                        { billUrl: enableZerto.url },
                      )}`,
                    );
                    $window.open(enableZerto.url, '_blank');
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
        zertoInformations: /* @ngInject */ (
          dedicatedCloudZerto,
          serviceName,
          datacenterOfZerto,
          currentZerto,
          datacenterHosts,
          storedZertoInformations,
        ) =>
          dedicatedCloudZerto.constructor.buildZertoInformations(
            serviceName,
            datacenterOfZerto,
            currentZerto,
            datacenterHosts,
            storedZertoInformations,
          ),
        storedZertoInformations: /* @ngInject */ (
          currentService,
          dedicatedCloudZerto,
        ) =>
          dedicatedCloudZerto.checkForZertoOptionOrder(
            currentService.serviceName,
          ),
        storeZertoOptionOrderInUserPref: /* @ngInject */ (
          dedicatedCloudZerto,
        ) => (zertoInformations, enableZerto) =>
          dedicatedCloudZerto.storeZertoOptionOrderInUserPref(
            zertoInformations,
            enableZerto,
          ),
        displayErrorMessage: /* @ngInject */ (Alerter) => (errorMessage) =>
          Alerter.error(errorMessage, 'dedicatedCloudDatacenterZertoAlert'),
        displayInfoMessage: /* @ngInject */ (Alerter) => (infoMessage) =>
          Alerter.info(infoMessage, 'dedicatedCloudDatacenterZertoDashboard'),
        displaySuccessMessage: /* @ngInject */ (Alerter) => (successMessage) =>
          Alerter.success(
            successMessage,
            'dedicatedCloudDatacenterZertoDashboard',
          ),

        goToConfiguration: /* @ngInject */ ($state) => (
          zertoInformations,
          stateToGo,
        ) =>
          $state.go(
            `app.managedBaremetal.details.datacenters.datacenter.zerto.${stateToGo}`,
            {
              zertoInformations,
            },
          ),
        goToSummary: /* @ngInject */ ($state, zertoInformations) => () =>
          $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.zerto.summary',
            {
              zertoInformations,
            },
          ),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('managed_baremetal_datacenters_datacenter_drp'),
        zertoState: /* @ngInject */ (
          dedicatedCloudZerto,
          serviceName,
          datacenterId,
        ) => dedicatedCloudZerto.getZertoState({ serviceName, datacenterId }),
        isZertoOnPremise: /* @ngInject */ (zertoState) =>
          zertoState.drpType === 'onPremise',
        goToAddSite: /* @ngInject */ (
          $state,
          zertoInformations,
          productId,
          datacenterId,
        ) => () =>
          $state.go(
            'app.managedBaremetal.details.datacenter.details.zerto.listing.addSite',
            {
              productId,
              datacenterId,
              zertoInformations,
            },
          ),
      },
    },
  );
};
