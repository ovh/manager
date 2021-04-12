<template>
  <div class="manager-hub-payment-mean">
    <a
      class="d-flex flex-row align-items-center p-2 ng-isolate-scope"
      :href="buildURL('dedicated', '#/billing/payment/method')"
    >
      <img
        aria-hidden="true"
        class="mr-1 ng-scope"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSIzNCIgdmlld0JveD0iMCAwIDUwIDM0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMgOCkiPgogICAgICAgIDxyZWN0IHdpZHRoPSIyMyIgaGVpZ2h0PSIxNyIgeD0iLjUiIHk9Ii41IiBzdHJva2U9IiMxMjI4NDQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgcng9IjEiLz4KICAgICAgICA8cGF0aCBzdHJva2U9IiMxMjI4NDQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE0LjUgNy41aDZNMTQuNSAxMC41aDYiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMTIyODQ0IiBkPSJNMTAuNjg5IDEyLjk5N2MtLjc1NC0uMjgtMS4yODMtLjU2Ny0xLjU5Ny0uODgxLS4xNy0uMTctLjI1Ny0uMzcyLS4yMTktLjYwMy4wNDItLjI1MS41NzMtLjgyNS41ODEtLjgzNi4yNjctLjM3OC40Mi0uODc2LjQyLTEuNjM1IDAtMS4yOTUtLjQzLTEuODM0LTEuMzc0LTEuODM0LS45NDQgMC0xLjM3NS41NC0xLjM3NSAxLjgzNCAwIC43NTkuMTUzIDEuMjU3LjQyIDEuNjM1LjAwOS4wMS41NC41ODUuNTgyLjgzNi4wMzguMjMxLS4wNS40MzMtLjIyLjYwMy0uMzEzLjMxNC0uODQyLjYwMS0xLjU5Ni44ODFhNC4xMDYgNC4xMDYgMCAwIDAgMi4xODkuNjI4Yy44MDQgMCAxLjU1NC0uMjMgMi4xODktLjYyOHptLjgxNS0uNjdhNC4xMjUgNC4xMjUgMCAxIDAtNi4wMDggMCAuNDU5LjQ1OSAwIDAgMSAuMTEtLjA1M2MuNzE0LS4yMzkgMS4yMi0uNDczIDEuNTEtLjY4NWEzLjA0NSAzLjA0NSAwIDAgMS0uMzE4LS4zODJjLS4zOC0uNTM2LS41OS0xLjIyLS41OS0yLjE2NSAwLTEuNzYyLjc5MS0yLjc1IDIuMjkyLTIuNzUgMS41IDAgMi4yOTIuOTg4IDIuMjkyIDIuNzUgMCAuOTQ2LS4yMTEgMS42My0uNTkgMi4xNjVhMy4wNDUgMy4wNDUgMCAwIDEtLjMxNy4zODJjLjI4OC4yMTIuNzk1LjQ0NiAxLjUxLjY4NS4wNC4wMTMuMDc2LjAzLjExLjA1M3pNOC41IDE0LjU0MmE1LjA0MiA1LjA0MiAwIDEgMSAwLTEwLjA4NCA1LjA0MiA1LjA0MiAwIDAgMSAwIDEwLjA4NHoiLz4KICAgIDwvZz4KPC9zdmc+Cg=="
        style=""
      />
      <div class="m-auto p-1 minw-0 w-100">
        <h3 data-translate="hub_payment_mean_title">{{ t('hub_payment_mean_title') }}</h3>
        <div class="manager-hub-payment-mean_label">
          <p class="m-0 text-truncate">
            Internal Account
          </p>
          <badge
            level="success"
            class="manager-hub-payment-mean_status"
            :text-content="t('hub_payment_mean_status_VALID')"
          ></badge>
        </div>
      </div>
      <span class="ml-auto oui-icon oui-icon-arrow-right" aria-hidden="true"> </span>
    </a>
  </div>
</template>

<script lang="ts">
import useLoadTranslations from '@/composables/useLoadTranslations';
import { defineAsyncComponent, defineComponent } from 'vue';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const translationFolders = ['payment-mean'];

    useLoadTranslations(translationFolders);
    return { t };
  },
  components: {
    Badge: defineAsyncComponent(() => import('@/components/ui/Badge')),
  },
  methods: {
    buildURL,
  },
});
</script>

<style lang="scss" scoped>
.manager-hub-payment-mean {
  @import '~@ovh-ux/ui-kit/dist/scss/_tokens';
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  > a {
    background: $p-100;
    border-radius: 0.5rem;
    color: inherit;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    width: 100%;
    text-decoration: none;
    transition: background-color 250ms;
  }

  > a:hover {
    background-color: $p-200;
    text-decoration: none;
  }

  img {
    width: 2.5rem;
  }

  h3 {
    font-size: 0.85rem;
    margin: 0;
    padding: 0;
    line-height: 1.5rem;
  }

  &_label {
    font-size: 0.75rem;

    > p {
      color: inherit;
    }
  }

  &_status {
    font-size: 0.8rem;
    font-weight: bold;
    max-width: none;
    line-height: 0.85rem;
  }

  .oui-badge {
    &_error {
      color: $ae-500;
    }

    &_warning {
      color: $aw-500;
    }

    &_success {
      color: $as-500;
    }
  }

  .oui-icon {
    color: $p-800;
  }

  .oui-icon-arrow-right {
    color: $p-500;
  }
}
</style>
