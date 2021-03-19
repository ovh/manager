<script>
import { defineComponent, h } from 'vue';
import startCase from 'lodash-es/startCase';

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
  render() {
    // This formats the data for the render function
    // We can either have an array with objects containing info about html tags if there are any
    // TODO: documentation
    return (
      <>
        <div class="oui-table-responsive">
          <table class="oui-table">
            {this.header(this.headerColumns)}
            {this.rowElements}
          </table>
        </div>
        {this.paginationFooter}
      </>
    );
  },
  computed: {
    rowElements() {
      return this.rows.map((row) => (
        <tr class="oui-table__row"> {this.dataElementPerRow(row)} </tr>
      ));
    },
    headerColumns() {
      return this.columnNames?.map((name) => {
        if (!name) return '';
        return <th class="oui-table__header">{startCase(name)}</th>;
      });
    },
    numberOfPages() {
      return Math.ceil(this.totalCount / this.pageSize);
    },
    pageOptions() {
      const pageOptions = [];
      for (let i = 1; i <= this.numberOfPages; i += 1) {
        pageOptions.push(
          <option label={i} value={i} selected={this.page === i}>
            {i}
          </option>,
        );
      }
      return pageOptions;
    },
    paginationSelect() {
      return (
        <select onChange={(event) => this.changePage(event.target.value)} class="oui-select__input">
          {this.pageOptions}
        </select>
      );
    },
    paginationFooter() {
      return (
        <div vShow={this.pagination} class="pagination pagination-footer">
          <button
            disabled={this.page === 1}
            onClick={() => (this.page > 1 ? this.changePage(this.page - 1) : '')}
            class="oui-pagination-nav__previous oui-button oui-button_secondary oui-button_s"
          >
            <span class="oui-icon oui-icon-chevron-left"></span>
          </button>
          <label class="oui-select oui-select_inline oui-pagination-items__control">
            {this.paginationSelect}
            <span class="oui-icon oui-icon-chevron-down"></span>
          </label>
          <button
            disabled={this.page === this.numberOfPages}
            onClick={() => (this.page < this.numberOfPages ? this.changePage(this.page + 1) : '')}
            class="oui-pagination-nav__next oui-button oui-button_secondary oui-button_s"
          >
            <span class="oui-icon oui-icon-chevron-right"></span>
          </button>
        </div>
      );
    },
  },
  methods: {
    changePage(page) {
      this.$emit('page-change', page);
    },
    changePageSize(pageSize) {
      this.$emit('page-size-change', pageSize);
    },
    formatData(data) {
      if (!data) return '';
      if (typeof data === 'string') return data;

      return data?.map((entry) => h(entry.tag, { ...entry.attrs }, this.formatData(entry.value)));
    },
    dataElementPerRow(row) {
      return row.map((data) => <td class="oui-table__cell"> {this.formatData(data)}</td>);
    },
    header(columns) {
      return <tr>{columns}</tr>;
    },
  },
});
</script>
<style lang="scss">
.pagination-footer {
  justify-content: flex-end;
}
</style>
