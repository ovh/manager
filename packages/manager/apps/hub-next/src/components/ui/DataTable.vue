<script>
import { defineComponent, h } from 'vue';
import { startCase } from 'lodash-es';

export default defineComponent({
  props: {
    rows: Array,
    columnNames: Array,
    page: Number,
    pageSize: Number,
    pagination: {
      type: Boolean,
      default: false,
    },
    totalCount: Number,
  },
  emits: ['page-change', 'page-size-change'],
  methods: {
    changePage(page) {
      this.$emit('page-change', page);
    },
    changePageSize(pageSize) {
      this.$emit('page-size-change', pageSize);
    },
  },
  render() {
    // This formats the data for the render function
    // We can either have an array with objects containing info about html tags if there are any
    // TODO: documentation
    const formatData = (data) => {
      if (!data) return '';
      if (typeof data === 'string') return data;

      return data?.map((entry) => h(entry.tag, { ...entry.attrs }, formatData(entry.value)));
    };

    const dataElementPerRow = (row) => row.map((data) => <td class="oui-table__cell"> {formatData(data)}</td>);

    const rowElements = this.rows.map((row) => (
      <tr class="oui-table__row"> {dataElementPerRow(row)} </tr>
    ));

    const headerColumns = this.columnNames?.map((name) => (
      <th class="oui-table__header">{startCase(name)}</th>
    ));
    const header = (columns) => <tr>{columns}</tr>;
    let paginationFooter;

    if (this.pagination) {
      const numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      const pageOptions = [];
      for (let i = 1; i <= numberOfPages; i += 1) {
        pageOptions.push(
          <option label={i} value={i} selected={this.page === i}>
            {i}
          </option>,
        );
      }
      const select = (
        <select onChange={(event) => this.changePage(event.target.value)} class="oui-select__input">
          {pageOptions}
        </select>
      );
      paginationFooter = (
        <div class="pagination pagination-footer">
          <button
            disabled={this.page === 1}
            onClick={() => (this.page > 1 ? this.changePage(this.page - 1) : '')}
            class="oui-pagination-nav__previous oui-button oui-button_secondary oui-button_s">
            <span class="oui-icon oui-icon-chevron-left"></span>
          </button>
          <label class="oui-select oui-select_inline oui-pagination-items__control">
            {select}
            <span class="oui-icon oui-icon-chevron-down"></span>
          </label>
          <button
            disabled={this.page === numberOfPages}
            onClick={() => (this.page < numberOfPages ? this.changePage(this.page + 1) : '')}
            class="oui-pagination-nav__next oui-button oui-button_secondary oui-button_s">
            <span class="oui-icon oui-icon-chevron-right"></span>
          </button>
        </div>
      );
    }

    return (
      <div>
        <div class="oui-table-responsive">
          <table class="oui-table">
            {header(headerColumns)}
            {rowElements}
          </table>
        </div>
        {paginationFooter}
      </div>
    );
  },
});
</script>
<style lang="scss">
.pagination-footer {
  justify-content: flex-end;
}
</style>
