import cloneDeep from 'lodash/cloneDeep';
import drop from 'lodash/drop';
import endsWith from 'lodash/endsWith';
import every from 'lodash/every';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isFinite from 'lodash/isFinite';
import lowerCase from 'lodash/lowerCase';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import some from 'lodash/some';
import split from 'lodash/split';
import startsWith from 'lodash/startsWith';
import take from 'lodash/take';
import toNumber from 'lodash/toNumber';
import toString from 'lodash/toString';

import moment from 'moment';

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
      (criterion) => {
        const propertyName = head(
          split(criterion.property, '.'),
        );

        const translationId = `ovhManagerSupport_ticket_${propertyName}_${criterion.value}`;
        const value = this.$translate.instant(translationId);

        return {
          ...criterion,
          rawValue: criterion.value,
          value: value === translationId
            ? criterion.value
            : value,
        };
      },
    );

    this.currentTickets = {
      data: this.tickets,
      meta: {
        totalCount: this.tickets.length,
      },
    };

    this
      .$rootScope
      .$on('ticket.otrs.reload', this
        .reload
        .bind(this,
          {
            filters: this.filters,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            totalNumberOfItems: this.totalNumberOfItems,
          }));
  }

  openSupport() {
    if (!this.OtrsPopupService.isLoaded()) {
      this.OtrsPopupService.init();
    } else {
      this.OtrsPopupService.toggle();
    }
  }

  getTickets() {
    this.page();

    return this
      .$q
      .resolve(this.currentTickets);
  }

  filter() {
    if (isEmpty(this.filters)) {
      return;
    }

    const result = filter(
      this.currentTickets.data,
      ticket => every(
        this.filters,
        (currentFilter) => {
          const targets = currentFilter.property
            ? [currentFilter.property]
            : [
              'ticketNumber',
              'serviceName.value',
              'subject',
            ];

          return some(
            targets,
            target => SupportController.match(
              get(ticket, target),
              currentFilter.operator,
              currentFilter.value,
            ),
          );
        },
      ),
    );

    this.currentTickets = {
      data: result,
      meta: {
        totalCount: result.length,
      },
    };
  }

  static match(a, operator, b) {
    const aValue = isFinite(
      toNumber(a),
    )
      ? a
      : lowerCase(toString(a));

    const bValue = isFinite(
      toNumber(b),
    )
      ? b
      : lowerCase(toString(b));

    switch (operator) {
      case 'bigger':
        return aValue > bValue;
      case 'contains':
        return includes(aValue, bValue);
      case 'containsNot':
        return !includes(aValue, bValue);
      case 'endsWith':
        return endsWith(aValue, bValue);
      case 'is':
        return isEqual(aValue, bValue);
      case 'isAfter':
        return moment(a).add(1, 'days').isAfter(moment(b));
      case 'isBefore':
        return moment(a).isBefore(moment(b));
      case 'isNot':
        return !isEqual(aValue, bValue);
      case 'smaller':
        return aValue < bValue;
      case 'startsWith':
        return startsWith(aValue, bValue);
      default:
        return null;
    }
  }

  onCriteriaChange($criteria) {
    this.onGridParamsChange({
      pageNumber: 1,
      filters: map(
        $criteria,
        (criterion) => {
          const clone = cloneDeep(criterion);
          delete clone.title;
          return {
            ...clone,
            value: criterion.rawValue || criterion.value,
          };
        },
      ),
      tickets: this.tickets,
    });
  }

  page() {
    this.sort();
    this.filter();

    const offset = (this.pageNumber - 1) * this.pageSize;

    this.ouiDatagridService.datagrids.tickets.paging.offset = offset + 1;

    this.currentTickets = {
      data: take(
        drop(
          this.currentTickets.data,
          offset,
        ),
        this.pageSize,
      ),
      meta: {
        totalCount: this.currentTickets.meta.totalCount,
      },
    };
  }

  onPageChange({ pageSize, offset }) {
    this.onGridParamsChange({
      pageNumber: parseInt(offset / pageSize, 10) + 1,
      pageSize,
      tickets: this.tickets,
    });
  }

  sort() {
    this.ouiDatagridService.datagrids.tickets.paging.currentSorting = {
      columnName: this.sortBy,
      dir: lowerCase(this.sortOrder) === 'asc'
        ? 1
        : -1,
    };

    this.currentTickets = {
      data: orderBy(
        this.tickets,
        this.sortBy,
        lowerCase(this.sortOrder),
      ),
      meta: {
        totalCount: this.tickets.length,
      },
    };
  }

  onSortChange({ name, order }) {
    this.onGridParamsChange({
      sortBy: name,
      sortOrder: order,
      tickets: this.tickets,
    });
  }
}
