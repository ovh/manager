<template>
    <data-table
      :rows="dataRows"
      :column-names="dataColumnNames"
      :page="+currentPageNumber"
      :page-size="+pageSize"
      :total-count="+totalCount"
      pagination
      @page-change="loadProducts($event, pageSize)"
    ></data-table>
</template>

<script>
import {
  defineAsyncComponent, defineComponent, inject, ref,
} from 'vue';
import axios from 'axios';
import parseISO from 'date-fns/parseISO';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const pageSize = ref(10);
    const totalCount = ref(0);
    const route = useRoute();
    const productDetails = ref([]);
    const jsonArray = ref([]);
    const productRangeName = inject('productRangeName');

    productRangeName.value = route.query.productName;

    return {
      route,
      productDetails,
      jsonArray,
      pageSize,
      totalCount,
    };
  },
  data() {
    return {
      currentPageNumber: 1,
    };
  },
  created() {
    this.loadProducts(this.currentPageNumber, this.pageSize);
  },
  components: {
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
  },
  computed: {
    dataRows() {
      return this.jsonArray.map((object) => Object.values(object).map((value) => {
        if (Array.isArray(value) || typeof value === 'object' || Date.parse(value)) return null;
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
        const newObject = Object.keys(object).filter(
          (key) => {
            // Using this instead of Date.parse because Date.parse doesn't return
            // the same thing depending on navigator
            if (this.parseISO(object[key]).toString() === 'Invalid Date') return object;

            return null;
          },
        );
        return newObject;
      });

      return noDate[0];
    },
  },
  methods: {
    loadProducts(paginationNumber, paginationSize) {
      if (this.currentPageNumber !== paginationNumber) this.currentPageNumber = paginationNumber;
      const headers = {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Number': paginationNumber,
        'X-Pagination-Size': paginationSize,
      };

      // TODO: this is ugly, here just to work with data, refactor into reusable
      // axios request
      const config = {
        data: { serviceType: 'aapi' },
        headers,
      };
      if (this.route.query.productApiUrl) {
        axios.get(`/engine/apiv6${this.route.query.productApiUrl}`, config).then((data) => {
          this.totalCount = data.headers['x-pagination-elements'];
          this.jsonArray = data.data;
        });
      }
    },
    parseISO,
  },
});
</script>
