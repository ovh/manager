<script>
import { defineComponent, h } from 'vue';

export default defineComponent({
  props: {
    rows: Array,
  },
  render() {
    // This formats the data for the render function
    // We can either have an array with objects containing info about html tags if there are any
    // TODO: documentation
    const formatData = (data) => {
      if (typeof data === 'string') return data;

      return data?.map((entry) => h(entry.tag, { ...entry.attrs }, formatData(entry.value)));
    };
    const dataElementPerRow = (row) => row.map((data) => <td class="oui-table__cell"> {formatData(data)}</td>);
    const rowElements = this.rows.map((row) => (
      <tr class="oui-table__row"> {dataElementPerRow(row)} </tr>
    ));

    return (
      <div class="oui-table-responsive">
        <table class="oui-table">{rowElements}</table>
      </div>
    );
  },
});
</script>
