const MAX_THRESHOLD_MODE = {
  button: 10,
  select: 100,
};

export default class EtlWorkflowsListCtrl {
  $onInit() {
    this.sort = {
      column: '',
      isAsc: true,
    };
    this.items = this.workflows;
    this.accessProperty = (path, object) => {
      return path
        .split('.')
        .reduce((o, i) => (o && o[i] ? o[i] : null), object);
    };

    this.paginationPage = 1;
    this.itemsPerPage = 5;
  }

  get totalRows() {
    return this.items.length;
  }

  get totalPages() {
    return Math.ceil(this.totalRows / this.itemsPerPage);
  }

  get pages() {
    return [...Array(this.totalPages).keys()];
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

  handleClick(workflow) {
    this.selectedWorkflow = workflow;
    this.onChange({ selectedWorkflow: workflow });
  }

  getSortableIcons(column) {
    return {
      'oui-icon-sort-inactive': column !== this.sort.column,
      'oui-icon-sort-up': column === this.sort.column && this.sort.isAsc,
      'oui-icon-sort-down': column === this.sort.column && !this.sort.isAsc,
    };
  }

  sortItems(column, type = 'string') {
    if (this.sort.column === column) {
      this.sort.isAsc = !this.sort.isAsc;
      this.items = this.items.reverse();
    } else {
      this.sort = {
        column,
        isAsc: true,
      };
      switch (type) {
        case 'string':
          this.items = this.workflows.sort((a, b) =>
            this.accessProperty(column, a).localeCompare(
              this.accessProperty(column, b),
            ),
          );
          break;
        case 'date':
          this.items = this.workflows.sort(
            (a, b) =>
              new Date(this.accessProperty(column, a)).getTime() -
              new Date(this.accessProperty(column, b)).getTime(),
          );
          break;
        case 'boolean':
        case 'number':
          this.items = this.workflows.sort(
            (a, b) =>
              Number(this.accessProperty(column, a)) -
              Number(this.accessProperty(column, b)),
          );
          break;
        default:
          break;
      }
    }
  }
}
