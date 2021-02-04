<template>
  <div>
    <data-table :rows="dataRows"></data-table>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const productDetails = ref([]);
    const config = {
      data: { serviceType: 'aapi' },
    };
    if (route.query.productApiUrl) {
      axios.get(`/engine/apiv6${route.query.productApiUrl.toString()}`, config).then((data) => {
        console.log(data);
      });
    }

    return {
      route,
      productDetails,
    };
  },
  components: {
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
  },
  data() {
    return {
      jsonMock: [
        {
          name: 'activationfreecdn.shop',
          lastUpdate: '2020-11-26T12:55:51+01:00',
          nameServers: ['dns113.ovh.net', 'ns113.ovh.net'],
          hasDnsAnycast: false,
          dnssecSupported: true,
        },
        {
          name: 'agora3.ovh',
          lastUpdate: '2020-11-15T22:47:20+01:00',
          nameServers: ['ns200.anycast.me', 'dns200.anycast.me'],
          hasDnsAnycast: true,
          dnssecSupported: true,
        },
        {
          name: 'agora4.ovh',
          lastUpdate: '2021-01-28T14:09:14+01:00',
          nameServers: ['dns100.ovh.net', 'dns200.anycast.me', 'ns100.ovh.net', 'ns200.anycast.me'],
          hasDnsAnycast: true,
          dnssecSupported: true,
        },
        {
          name: 'agora5.ovh',
          lastUpdate: '2020-11-13T10:19:22+01:00',
          nameServers: ['dns100.ovh.net', 'dns200.anycast.me', 'ns100.ovh.net', 'ns200.anycast.me'],
          hasDnsAnycast: true,
          dnssecSupported: true,
        },
        {
          name: 'agora6.ovh',
          lastUpdate: '2020-11-14T11:16:39+01:00',
          nameServers: ['dns100.ovh.net', 'ns100.ovh.net'],
          hasDnsAnycast: false,
          dnssecSupported: true,
        },
        {
          name: 'agora-detach-start10m2.ovh',
          lastUpdate: '2021-01-05T07:10:05+01:00',
          nameServers: ['ns101.ovh.net', 'dns101.ovh.net'],
          hasDnsAnycast: false,
          dnssecSupported: true,
        },
        {
          name: 'agora-detach-start10m.ovh',
          lastUpdate: '2020-12-22T10:30:42+01:00',
          nameServers: ['ns101.ovh.net', 'dns101.ovh.net'],
          hasDnsAnycast: false,
          dnssecSupported: true,
        },
        {
          name: 'agora-domain-pour-teddy.ovh',
          lastUpdate: '2020-11-17T02:46:11+01:00',
          nameServers: ['ns102.ovh.net', 'dns102.ovh.net'],
          hasDnsAnycast: false,
          dnssecSupported: true,
        },
        {
          name: 'antacdn.site',
          lastUpdate: '2020-11-26T11:43:32+01:00',
          nameServers: ['ns113.ovh.net', 'dns113.ovh.net'],
          hasDnsAnycast: false,
          dnssecSupported: true,
        },
        {
          name: 'archis-test-nodejs.ovh',
          lastUpdate: '2020-11-25T14:12:01+01:00',
          nameServers: ['ns17.ovh.net', 'dns17.ovh.net'],
          hasDnsAnycast: false,
          dnssecSupported: true,
        },
      ],
    };
  },
  computed: {
    dataRows(): any {
      return this.jsonMock.map((object) => Object.keys(object).map((key) => key.toString()));
    },
  },
});
</script>

<style scoped></style>
