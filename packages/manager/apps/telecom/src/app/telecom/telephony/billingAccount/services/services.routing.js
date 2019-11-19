import get from 'lodash/get';
import { ListPagination } from '@ovh-ux/ng-ovh-telecom-universe-components';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.services', {
    url: `/services?${ListPagination.urlQueryParams}`,
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        component: 'telecomTelephonyBillingAccountServices',
      },
    },
    params: ListPagination.stateParams,
    resolve: {
      ...ListPagination.stateResolves,
      apiPath: /* @ngInject */ billingAccountId => `/telephony/${billingAccountId}/service`,
      schema: /* @ngInject */ OvhApiTelephony => OvhApiTelephony
        .v6()
        .schema()
        .$promise,
      telephonyFeatureTypes: /* @ngInject */ schema => get(schema.models, 'telephony.TypeEnum').enum,
      telephonyServiceTypes: /* @ngInject */ schema => get(schema.models, 'telephony.TypeServiceEnum').enum,

      getServiceLink: /* @ngInject */ $state => (service) => {
        if (['alias'].includes(service.serviceType)) {
          return $state.href('telecom.telephony.billingAccount.alias', { serviceName: service.serviceName });
        }

        if (['fax', 'voicefax'].includes(service.featureType)) {
          return $state.href('telecom.telephony.billingAccount.fax', { serviceName: service.serviceName });
        }

        if (['carrierSip'].includes(service.featureType)) {
          return $state.href('telecom.telephony.billingAccount.carrierSip', { serviceName: service.serviceName });
        }

        return $state.href('telecom.telephony.billingAccount.line', { serviceName: service.serviceName });
      },
    },
  });
};
