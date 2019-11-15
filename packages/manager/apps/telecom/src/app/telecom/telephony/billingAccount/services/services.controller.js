import get from 'lodash/get';
import set from 'lodash/set';
import startCase from 'lodash/startCase';
import snakeCase from 'lodash/snakeCase';
import reduce from 'lodash/reduce';

export default class TelecomTelephonyBillingAccountServicesController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ouiDatagridService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.defaultFilterColumn = 'serviceName';

    this.criteria = JSON.parse(this.filter).map(criteria => ({
      property: get(criteria, 'field') || this.defaultFilterColumn,
      operator: get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));

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

    // this.stateEnumFilter = this.getEnumFilter(this.serverStateEnum,
    // 'server_configuration_state_');
    // this.datacenterEnumFilter = this.getEnumFilter(this.datacenterEnum, 'server_datacenter_');

    this.columnsConfig = [
      { name: 'serviceName', sortable: this.getSorting('serviceName') },
      { name: 'description', sortable: this.getSorting('description') },
      { name: 'serviceType', sortable: this.getSorting('serviceType') },
      { name: 'featureType', sortable: this.getSorting('featureType') },
    ];
  }

  static toUpperSnakeCase(str) {
    return snakeCase(str).toUpperCase();
  }

  getEnumFilter(list, translationPrefix) {
    return {
      values: reduce(
        list,
        (result, item) => ({
          ...result,
          [item]: this.$translate.instant(`${translationPrefix}${this.constructor.toUpperSnakeCase(item)}`),
        }),
        {},
      ),
    };
  }

  getSorting(property) {
    return this.sort === property ? this.sortOrder.toLowerCase() : '';
  }

  loadPage() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    set(this.ouiDatagridService, 'datagrids.dg-telephony-billingAccounts-services.paging.offset', currentOffset < this.paginationTotalCount ? currentOffset : this.paginationTotalCount);

    return this.$q.resolve({
      data: get(this.resources, 'data'),
      meta: {
        totalCount: this.paginationTotalCount,
      },
    });
  }

  onPageChange({ pageSize, offset }) {
    this.onListParamsChange({
      page: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    });
  }

  onCriteriaChange($criteria) {
    const filter = $criteria.map(criteria => ({
      field: get(criteria, 'property') || this.defaultFilterColumn,
      comparator: criteria.operator,
      reference: [criteria.value],
    }));

    this.onListParamsChange({
      filter: JSON.stringify(filter),
    });
  }

  onSortChange({ name, order }) {
    this.onListParamsChange({
      sort: name,
      sortOrder: order,
    });
  }

  formatFeatureType(featureType) {
    return ['empty'].includes(featureType) ? this.$translate.instant('telephony_billing_account_line_feature_no_configuration') : startCase(featureType);
  }
}
