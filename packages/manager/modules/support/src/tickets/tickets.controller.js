import map from 'lodash/map';

export default class SupportController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $state,
    $translate,
    OtrsPopupService,
    ouiDatagridService,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$translate = $translate;
    this.OtrsPopupService = OtrsPopupService;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.criteria = map(
      this.filters,
      (criteria) => {
        const translationId = `ovhManagerSupport_ticket_${criteria.field}_${criteria.reference[0]}`;
        const value = this.$translate.instant(translationId);

        return {
          operator: criteria.comparator,
          property: criteria.field,
          rawValue: criteria.reference[0],
          value: value === translationId
            ? criteria.reference[0]
            : value,
        };
      },
    );

    this
      .$rootScope
      .$on('ticket.otrs.reload', this
        .reload
        .bind(this,
          {
            cleanCache: true,
            filters: this.filters,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            totalNumberOfItems: this.totalNumberOfItems,
          }));
  }

  openSupport() {
    this.goToTicketCreation();
    /*
    if (!this.OtrsPopupService.isLoaded()) {
      this.OtrsPopupService.init();
    } else {
      this.OtrsPopupService.toggle();
    }
    */
  }

  getTickets() {
    const offset = (this.pageNumber - 1) * this.pageSize + 1;

    this.ouiDatagridService.datagrids.tickets.paging.offset = offset;
    this.ouiDatagridService.datagrids.tickets.paging.currentSorting = {
      columnName: this.sortBy,
      dir: this.sortOrder === 'ASC'
        ? 1
        : -1,
    };

    return this
      .$q
      .resolve({
        data: this.tickets.data,
        meta: {
          totalCount: this.totalNumberOfItems,
        },
      });
  }

  onCriteriaChange($criteria) {
    const filters = map(
      $criteria,
      criteria => ({
        comparator: criteria.operator,
        field: criteria.property,
        reference: criteria.rawValue
          ? [criteria.rawValue]
          : [criteria.value],
      }),
    );

    this.onGridParamsChange({
      pageNumber: 1,
      filters,
    });
  }

  onPageChange({ pageSize, offset }) {
    this.onGridParamsChange({
      pageNumber: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    });
  }

  onSortChange({ name, order }) {
    this.onGridParamsChange({
      sortBy: name,
      sortOrder: order,
    });
  }
}
