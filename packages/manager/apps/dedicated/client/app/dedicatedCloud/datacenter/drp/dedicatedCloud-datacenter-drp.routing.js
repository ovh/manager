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
      setDisableSuccessAlertPreference: /* @ngInject */ (dedicatedCloudDrp) => (
        pccId,
        value,
      ) => dedicatedCloudDrp.setDisableSuccessAlertPreference(pccId, value),
      selectedDrpType: /* @ngInject */ ($transition$) => ({
        id: get($transition$.params().selectedDrpType, 'id', null),
      }),
      storedDrpInformations: /* @ngInject */ (
        currentService,
        dedicatedCloudDrp,
      ) =>
        dedicatedCloudDrp.checkForZertoOptionOrder(currentService.serviceName),
      /* @ngInject */
      storeZertoOptionOrderInUserPref: (dedicatedCloudDrp) => (
        drpInformations,
        enableDrp,
      ) =>
        dedicatedCloudDrp.storeZertoOptionOrderInUserPref(
          drpInformations,
          enableDrp,
        ),

      /* @ngInject */
      displayErrorMessage: (Alerter) => (errorMessage) =>
        Alerter.error(errorMessage, 'dedicatedCloudDatacenterDrpAlert'),
      /* @ngInject */
      displayInfoMessage: (Alerter) => (message) =>
        Alerter.set('alert-info', message, null, 'dedicatedCloud_alert'),
      /* @ngInject */
      displaySuccessMessage: (Alerter) => (successMessage) =>
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
