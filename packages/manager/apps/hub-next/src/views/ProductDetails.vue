<template>
  <div>
    <data-table :rows="dataRows" :column-names="dataColumnNames"></data-table>
  </div>
</template>

<script>
import {
  defineAsyncComponent,
  defineComponent,
  inject,
  ref,
} from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const productDetails = ref([]);
    const jsonArray = ref([]);
    const productRangeName = inject('productRangeName');
    productRangeName.value = route.query.productName;
    const headers = {
      'x-pagination-sort': 'name',
      'X-Pagination-Mode': 'CachedObjectList-Pages',
    };

    // TODO: this is ugly, here just to work with data, refactor into reusable
    // axios request
    const config = {
      data: { serviceType: 'aapi' },
      headers,
    };
    if (route.query.productApiUrl) {
      axios.get(`/engine/apiv6${route.query.productApiUrl.toString()}`, config).then((data) => {
        jsonArray.value = data.data;
      });
    }

    return {
      route,
      productDetails,
      jsonArray,
    };
  },
  components: {
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
  },
  computed: {
    dataRows() {
      return this.jsonArray.map((object) => Object.values(object).map((value) => {
        if (Array.isArray(value) || typeof value === 'object' || Date.parse(value)) return '';
        if (object.name === value) {
          return [
            {
              tag: 'a',
              value,
            },
          ];
        }

        return value?.toString();
      }));
    },
    dataColumnNames() {
      const noDate = this.jsonArray.map((object) => {
        const newObject = Object.keys(object).filter((key) => {
          if (!Date.parse(object[key])) return object;

          return null;
        });
        return newObject;
      });

      return noDate[0];
    },
  },
});
</script>

<style scoped></style>
