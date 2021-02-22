<template>
  <tile
    :title="t('hub_support_title')"
    :count="support.data.length"
    :link="support.data.length ? buildURL('dedicated', '#/ticket') : ''"
  >
    <template #body>
      <data-table v-if="support.data.length" :rows="supportCellValues"></data-table>
      <div v-else>
        <div class="manager-hub-support__illustration"></div>
        <h3 class="oui-heading_4">{{ t('hub_support_need_help') }}</h3>
        <p>{{ t('hub_support_need_help_more') }}</p>
        <a :href="`https://docs.ovh.com/${userLanguage}`" class="manager-hub-support__link">
          <span>{{ t('hub_support_help') }}</span>
          <span class="oui-icon oui-icon-arrow-right"></span>
        </a>
      </div>
    </template>
  </tile>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { SupportDemand } from '@/models/hub.d';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { Environment } from '@ovh-ux/manager-config';
import Badge from '@/components/ui/Badge.vue';

export default defineComponent({
  async setup() {
    const { t } = useI18n();
    const userLanguage = ref(Environment.getUserLanguage());
    const supportResponse = await axios.get('/engine/2api/hub/support');
    const support = ref(supportResponse.data.data.support.data);

    return {
      t,
      userLanguage,
      support,
    };
  },
  components: {
    Tile: defineAsyncComponent(() => import('@/components/ui/Tile.vue')),
    DataTable: defineAsyncComponent(() => import('@/components/ui/DataTable.vue')),
  },
  computed: {
    supportCellValues(): [] {
      return this.support.data.map((ticket: SupportDemand) => [
        [
          {
            tag: 'span',
            attrs: {
              class: 'font-weight-bold',
            },
            value: ticket?.serviceName
              ? ticket.serviceName
              : this.t('hub_support_account_management'),
          },
        ],
        ticket.subject,
        [
          {
            tag: Badge,
            attrs: {
              level: this.getStateCategory(ticket),
              textContent: this.t(`hub_support_state_${ticket.state}`),
            },
          },
        ],
        [
          {
            tag: 'a',
            attrs: {
              target: '_blank',
              href: this.buildURL('dedicated', `#/support/tickets/${ticket.ticketId}`),
            },
            value: this.t('hub_support_read'),
          },
        ],
      ]);
    },
  },
  methods: {
    getStateCategory(ticket: SupportDemand) {
      switch (ticket.state) {
        case 'open':
          return 'success';
        case 'closed':
          return 'info';
        case 'unknown':
          return 'warning';
        default:
          return 'error';
      }
    },
    buildURL,
  },
});
</script>

<style lang="scss" scoped>
.manager-hub-support {
  @import 'bootstrap4/scss/_functions.scss';
  @import 'bootstrap4/scss/_variables.scss';
  @import 'bootstrap4/scss/_mixins.scss';
  @import 'bootstrap4/scss/_utilities.scss';
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  h3 {
    display: inline-block;
  }

  &_count {
    @include hub-pill;
  }

  &_more {
    float: right;
    margin-top: 0.25rem;
  }

  &__illustration {
    background-image: url('../../assets/assistance.png');
    background-repeat: no-repeat;
    height: 10rem;
    background-position: center;
  }

  &__link .oui-icon {
    font-size: 0.75rem;
    margin-left: 0.25rem;
  }
}
</style>
