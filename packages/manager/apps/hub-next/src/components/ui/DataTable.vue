<script>
import { defineComponent, h } from 'vue';
import { startCase } from 'lodash-es';

export default defineComponent({
  props: {
    rows: Array,
    columnNames: [],
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

    const dataElementPerRow = (row) => row.map((data) => {
      if (!data) return null;

      return (<td class="oui-table__cell"> { formatData(data) }</td>);
    });


    const rowElements = this.rows.map((row) => (
      <tr class="oui-table__row"> { dataElementPerRow(row) } </tr>
    ));

    const headerColumns = this.columnNames?.map((name) => (
      <th class="oui-table__header">{ startCase(name) }</th>
    ));
    const header = (columns) => (<tr>{ columns }</tr>);

    return (
      <div class="oui-table-responsive">
        <table class="oui-table">
          { header(headerColumns) }
          { rowElements }
        </table>
      </div>
    );
  },
});
</script>
