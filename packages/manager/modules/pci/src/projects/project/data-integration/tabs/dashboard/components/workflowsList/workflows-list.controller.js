import {
  WORKFLOW_STATUSES,
  WORKFLOW_TABLE_COLUMNS,
  MAX_THRESHOLD_MODE,
  ITEMS_PER_PAGE,
  PAGINATION_PER_PAGE,
} from './workflows-list.constants';

export default class DataIntegrationWorkflowsListCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.WORKFLOW_STATUSES = WORKFLOW_STATUSES;
    this.columns = WORKFLOW_TABLE_COLUMNS;
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.paginationPage = PAGINATION_PER_PAGE;
    this.sort = {
      column: 'lastExecutionDate',
      type: 'date',
      isAsc: false,
    };
    this.items = [...this.workflows];

    // Compute statuses when items change
    this.$scope.$watch(
      '$ctrl.workflows',
      () => {
        this.initItems();
      },
      true,
    );

    this.accessProperty = (path, object) => {
      return path.split('.').reduce((o, i) => (o?.[i] ? o[i] : null), object);
    };
  }

  /**
   * Update items on workflows changes
   */
  initItems() {
    this.items = [...this.workflows];
    const { column, type, isAsc } = this.sort;
    this.sortItems(column, type, isAsc);
    // if pagination changes to a lower number of pages, go to the last page
    if (this.paginationPage > this.totalPages) {
      this.paginationPage = this.totalPages;
    }
    // if selected workflow does not exist anymore in the list, deselect it
    if (
      this.selectedWorkflow &&
      !this.items.find((item) => item.id === this.selectedWorkflow.id)
    ) {
      this.selectedWorkflow = null;
    }
  }

  /**
   * Handle click on workflow row
   * @param {*} workflow selected workflow
   */
  handleClick(workflow) {
    this.selectedWorkflow = workflow;
    this.onChange({ selectedWorkflow: workflow });
  }

  get totalRows() {
    return this.items.length;
  }

  get totalPages() {
    return Math.ceil(this.totalRows / this.itemsPerPage);
  }

  get pages() {
    return [...Array(this.totalPages).keys()].map((page) => page + 1);
  }

  get paginationStart() {
    return (this.paginationPage - 1) * this.itemsPerPage;
  }

  get paginationEnd() {
    if (this.itemsPerPage === 0) {
      return this.totalRows;
    }
    return this.paginationPage === this.totalPages
      ? this.totalRows
      : this.paginationStart + this.itemsPerPage;
  }

  get displayedItems() {
    return this.items.slice(this.paginationStart, this.paginationEnd);
  }

  get paginationMode() {
    if (this.totalPages <= MAX_THRESHOLD_MODE.button) {
      return 'button';
    }
    if (
      this.totalPages > MAX_THRESHOLD_MODE.button &&
      this.totalPages <= MAX_THRESHOLD_MODE.select
    ) {
      return 'select';
    }
    return 'input';
  }

  previousPage = () => {
    this.paginationPage = Math.max(this.paginationPage - 1, 1);
  };

  nextPage = () => {
    this.paginationPage = Math.min(this.paginationPage + 1, this.totalPages);
  };

  getSortableIcons(column) {
    return {
      'oui-icon-sort-inactive': column !== this.sort.column,
      'oui-icon-sort-up': column === this.sort.column && this.sort.isAsc,
      'oui-icon-sort-down': column === this.sort.column && !this.sort.isAsc,
    };
  }

  setSort(column, type = 'string') {
    if (this.sort.column === column) {
      this.sort.isAsc = !this.sort.isAsc;
    } else {
      this.sort = {
        column,
        type,
        isAsc: true,
      };
    }
    this.sortItems(column, type, this.sort.isAsc);
  }

  sortItems(column, type, isAsc) {
    this.items.sort((a, b) => {
      const pA = this.accessProperty(column, isAsc ? a : b);
      const pB = this.accessProperty(column, isAsc ? b : a);
      switch (type) {
        case 'string':
          return pA ? pA.localeCompare(pB) : 1;
        case 'date':
          return new Date(pA).getTime() - new Date(pB).getTime();
        case 'boolean':
        case 'number':
          return Number(pA) - Number(pB);
        default:
          return 0;
      }
    });
  }
}
