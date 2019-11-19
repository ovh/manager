import startCase from 'lodash/startCase';
import { ListPagination } from '@ovh-ux/ng-ovh-telecom-universe-components';

export default class TelecomTelephonyBillingAccountServicesController
  extends ListPagination.ListPaginationCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ouiDatagridService,
  ) {
    super();
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.datagridId = 'dg-telephony-billingAccounts-services';
    this.defaultFilterColumn = 'serviceName';

    super.$onInit();

    this.filtersOptions = {
      serviceType: {
        hideOperators: true,
        values: this.telephonyServiceTypes.reduce((serviceTypes, serviceType) => ({
          ...serviceTypes,
          [serviceType]: this.$translate.instant(`telephony_billing_account_line_service_${serviceType}`),
        }), {}),
      },
      featureType: {
        hideOperators: true,
        values: this.telephonyFeatureTypes.reduce((featureTypes, featureType) => ({
          ...featureTypes,
          [featureType]: this.formatFeatureType(featureType),
        }), {}),
      },
    };

    this.columnsConfig = [
      { name: 'serviceName', sortable: this.getSorting('serviceName') },
      { name: 'description', sortable: this.getSorting('description') },
      { name: 'serviceType', sortable: this.getSorting('serviceType') },
      { name: 'featureType', sortable: this.getSorting('featureType') },
    ];
  }

  formatFeatureType(featureType) {
    return ['empty'].includes(featureType) ? this.$translate.instant('telephony_billing_account_line_feature_no_configuration') : startCase(featureType);
  }
}
