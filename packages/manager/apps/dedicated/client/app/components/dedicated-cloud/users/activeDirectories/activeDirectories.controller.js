import set from 'lodash/set';

import {
  DEFAULT_FILTER_COLUMN,
  ENUM_ACTIVE_DIRECTORY_STATUS,
  SORT_ORDER,
} from './activeDirectories.constant';

export default class DedicatedCloudActiveDirectoriesCtrl {
  /* @ngInject */
  constructor($translate, DedicatedCloud, ouiDatagridService) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.loading = true;

    return this.DedicatedCloud.securityOptionsCompatibility(this.productId)
      .then((data) => {
        this.hasAdvancedSecurity = !!data.find(
          (elm) => elm.name === 'advancedSecurity' && elm.state !== 'disabled',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadActiveDirectories({ offset, pageSize, sort, criteria }) {
    const defaultFilterColumn = DEFAULT_FILTER_COLUMN;
    const filters = DedicatedCloudActiveDirectoriesCtrl.criteriaMap(
      criteria,
      defaultFilterColumn,
    );

    const params = {
      offset,
      pageSize,
      sort: sort.property,
      sortOrder: SORT_ORDER[sort.dir],
      filters,
      defaultFilterColumn,
    };

    return this.DedicatedCloud.getActiveDirectories(
      this.productId,
      params,
    ).then(({ data, meta }) => ({ data, meta }));
  }

  refreshActiveDirectoriesGrid() {
    return this.ouiDatagridService.refresh(
      'pcc-active-directories-datagrid',
      true,
    );
  }

  static criteriaMap(criteria, defaultFilterColumn) {
    return criteria.map((filter) => ({
      field: filter.property || defaultFilterColumn,
      comparator: filter.operator,
      reference: [filter.value],
    }));
  }

  getActiveDirectoryStateEnumFilter() {
    const states = ENUM_ACTIVE_DIRECTORY_STATUS;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      set(
        filter.values,
        state,
        this.$translate.instant(`dedicatedCloud_USER_AD_status_${state}`),
      );
    });

    return filter;
  }
}
