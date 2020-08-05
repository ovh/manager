import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import upperFirst from 'lodash/upperFirst';

import { RENEW_URL } from '@ovh-ux/manager-billing';
import {
  ALIGNMENT_URLS,
  COLUMNS_CONFIG,
  NIC_ALL,
  URL_PARAMETER_SEPARATOR,
} from './autorenew.constants';

export default class AutorenewCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $translate,
    atInternet,
    BillingAutoRenew,
    billingRenewHelper,
    coreConfig,
    ouiDatagridService,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingAutoRenew = BillingAutoRenew;
    this.renewHelper = billingRenewHelper;
    this.coreConfig = coreConfig;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.ALIGNMENT_URL = this.coreConfig.isRegion('EU')
      ? ALIGNMENT_URLS[this.currentUser.ovhSubsidiary] || ALIGNMENT_URLS.FR
      : null;

    this.selectedServices = [];

    this.nicBillingFilter = this.nicBilling || this.$translate.instant(NIC_ALL);

    this.filtersOptions = {
      serviceType: {
        hideOperators: true,
        values: this.serviceTypes,
      },
      status: {
        hideOperators: true,
        values: this.BillingAutoRenew.getStatusTypes(),
      },
      state: {
        hideOperators: true,
        values: this.BillingAutoRenew.getStatesTypes(),
      },
      expiration: {
        hideOperators: true,
        values: this.BillingAutoRenew.getExpirationFilterTypes(),
      },
    };

    this.criteria = map(this.filters, (value, property) => ({
      property,
      value,
      operator: 'is',
      title: this.getCriterionTitle(
        property,
        get(this.filtersOptions, `${property}.values.${value}`),
      ),
    }));

    this.parseExtraCriteria();

    if (this.sort.predicate) {
      this.columnsConfig = map(COLUMNS_CONFIG, (column) =>
        column.property === this.sort.predicate
          ? {
              ...this.columnsConfig,
              sortable: this.sort.reverse ? 'desc' : 'asc',
            }
          : column,
      );
    }
  }

  getCriterionTitle(type, value) {
    return `${this.$translate.instant(
      `billing_autorenew_criterion_${type}`,
    )} ${this.$translate.instant(
      'common_criteria_adder_operator_options_is',
    )} ${value}`;
  }

  parseExtraCriteria() {
    if (this.selectedType) {
      this.criteria.push({
        property: 'serviceType',
        operator: 'is',
        value: this.selectedType,
        title: this.getCriterionTitle(
          'serviceType',
          this.serviceTypes[this.selectedType],
        ),
      });
    }

    if (this.searchText) {
      this.criteria.push({
        title: this.searchText,
        property: null,
        operator: 'contains',
        value: this.searchText,
      });
    }
  }

  getDatasToExport() {
    const servicesToExport =
      this.selectedServices.length === 0
        ? this.services
        : this.selectedServices;
    const datasToReturn = [
      [
        this.$translate.instant('billing_autorenew_service_name'),
        this.$translate.instant('billing_autorenew_service'),
        this.$translate.instant('billing_autorenew_service_status'),
        this.$translate.instant('billing_autorenew_service_date'),
      ],
    ];

    servicesToExport.forEach((service) => {
      datasToReturn.push([
        service.serviceId,
        this.$translate.instant(
          `billing_autorenew_service_type_${service.serviceType}`,
        ),
        service.renewLabel,
        `${this.renewHelper.getRenewDateFormated(service)} ${this.$filter(
          'date',
        )(service.expiration, 'mediumDate')}`,
      ]);
    });

    return datasToReturn;
  }

  onRowSelection($rows) {
    this.selectedServices = $rows;
    this.manualRenewUrl = this.getManualRenewUrl();
  }

  trackCSVExport() {
    this.atInternet.trackClick({
      name: 'export_csv',
      type: 'action',
      chapter1: 'services',
      chapter2: 'export',
    });
  }

  static getCriterion(criteria, property) {
    return get(find(criteria, { property }), 'value');
  }

  loadServices() {
    if (get(this.ouiDatagridService, 'datagrids.services')) {
      set(
        this.ouiDatagridService,
        'datagrids.services.paging.offset',
        this.offset + 1,
      );
    }

    return this.$q.resolve({
      meta: {
        totalCount: this.services.count,
      },
      data: this.billingServices,
    });
  }

  onPageChange({ pageSize, offset }) {
    return this.onListParamChanges({
      pageNumber: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    });
  }

  onCriteriaChange($criteria) {
    const selectedType = find($criteria, { property: 'serviceType' });
    const searchText = find($criteria, { property: null });
    const filters = reduce(
      $criteria,
      (criteria, { property, value }) => {
        if (![null, 'serviceType'].includes(property)) {
          return {
            ...criteria,
            [property]: value,
          };
        }

        return criteria;
      },
      {},
    );

    this.onListParamChanges({
      filters: JSON.stringify(filters),
      selectedType: get(selectedType, 'value'),
      searchText: get(searchText, 'value'),
      pageNumber: 1,
    });
  }

  onSortChange({ name, order }) {
    this.onListParamChanges({
      sort: JSON.stringify({ predicate: name, reverse: order === 'DESC' }),
    });
  }

  onNicBillingChange(nicBilling) {
    this.onListParamChanges({
      nicBilling:
        nicBilling === this.$translate.instant(NIC_ALL) ? null : nicBilling,
    });
  }

  onAutoRenewChange(nicRenew) {
    this.nicRenewLoading = true;

    this.BillingAutoRenew.setNicRenew(nicRenew)
      .catch(({ message }) => {
        this.goToAutorenew(message, 'danger');
      })
      .finally(() => {
        this.nicRenewLoading = false;
      });
  }

  getManualRenewUrl() {
    const urlParameterDomains = this.selectedServices
      .map(({ domain }) => domain)
      .join(URL_PARAMETER_SEPARATOR);

    return `${RENEW_URL[this.currentUser.ovhSubsidiary]}${urlParameterDomains}`;
  }

  getAutomaticExpirationDate(service) {
    return upperFirst(
      new Intl.DateTimeFormat(this.$translate.use().replace('_', '-'), {
        year: 'numeric',
        month: 'long',
      }).format(new Date(service.expiration)),
    );
  }
}
