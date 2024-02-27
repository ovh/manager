import get from 'lodash/get';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

import { DC_2_ISO, MONITORING_STATUSES } from './servers.constants';

export default class ServersCtrl {
  /* @ngInject */
  constructor($q, $translate, ouiDatagridService) {
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }
  // comment to use staging

  $onInit() {
    this.dedicatedServers.data = this.dedicatedServers.data.map(
      this.transformDedicatedServers,
      this,
    );

    this.criteria = JSON.parse(this.filter).map((criteria) => ({
      property: get(criteria, 'field') || 'name',
      operator: get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));

    this.stateEnumFilter = this.getEnumFilter(
      this.serverStateEnum,
      'server_configuration_state_',
    );

    this.datacenterEnumFilter = this.getEnumFilterFromCustomerData(
      this.dedicatedServers.data,
      'datacenter',
    );

    this.modelEnumFilter = this.getEnumFilterFromCustomerData(
      this.dedicatedServers.data,
      'commercialRange',
    );
  }

  static toUpperSnakeCase(str) {
    return snakeCase(str).toUpperCase();
  }

  static getMonitoringStatus(monitored, noIntervention) {
    let monitoring = MONITORING_STATUSES.DISABLED;
    // proactive intervention
    if (monitored && !noIntervention) {
      monitoring = MONITORING_STATUSES.PROACTIVE;
    }
    // no proactive intervention
    if (monitored && noIntervention) {
      monitoring = MONITORING_STATUSES.NOPROACTIVE;
    }
    return monitoring;
  }

  transformDedicatedServers(param) {
    const server = { ...param };
    server.monitoringStatus = this.constructor.getMonitoringStatus(
      server.monitoring,
      server.noIntervention,
    );
    server.city = this.$translate.instant(
      `server_datacenter_${
        this.constructor.toUpperSnakeCase(server.datacenter).split('_')[0]
      }`,
    );
    server.country = (
      DC_2_ISO[
        this.constructor
          .toUpperSnakeCase(server.datacenter)
          .split('_')[0]
          .toUpperCase()
      ] || 'none'
    ).toLowerCase();
    return server;
  }

  getEnumFilterFromCustomerData(data, attribute, prefix = null) {
    return this.getEnumFilter(
      data
        .map((server) => server[attribute])
        .filter((value, index, self) => self.indexOf(value) === index),
      prefix,
      false,
    );
  }

  getEnumFilter(list, translationPrefix, toUpperSnakeCaseFlag = true) {
    if (translationPrefix === null) {
      return {
        values: reduce(
          list,
          (result, item) => ({
            ...result,
            [item]: toUpperSnakeCaseFlag
              ? this.constructor.toUpperSnakeCase(item)
              : item,
          }),
          {},
        ),
      };
    }
    return {
      values: reduce(
        list,
        (result, item) => ({
          ...result,
          [item]: this.$translate.instant(
            `${translationPrefix}${
              toUpperSnakeCaseFlag
                ? this.constructor.toUpperSnakeCase(item)
                : item
            }`,
          ),
        }),
        {},
      ),
    };
  }

  loadServers() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    set(
      this.ouiDatagridService,
      'datagrids.dg-servers.paging.offset',
      currentOffset < this.paginationTotalCount
        ? currentOffset
        : this.paginationTotalCount,
    );

    return this.$q.resolve({
      data: get(this.dedicatedServers, 'data'),
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
    const filter = $criteria.map((criteria) => ({
      field: get(criteria, 'property') || 'name',
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
}
