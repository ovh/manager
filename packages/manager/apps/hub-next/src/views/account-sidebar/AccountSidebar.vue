<template>
  <sidebar :closed="closed" class="manager-hub-user-panel">
    <div class="mb-3">
      <div class="manager-hub-user-infos">
        <a href="" class="manager-hub-user-infos_profile oui-tooltip__trigger">
          <span
            class="manager-hub-user-infos_initials manager-hub-user-infos_initials-centered ng-binding"
            >SL</span
          >
          <p class="oui-chip mb-1">
            <span class="manager-hub-user-infos_text-small"> Standard Support </span>
          </p>
          <p class="manager-hub-user-infos_profile_link mb-1">
            SYLVAIN Le-Priol
          </p>
        </a>
        <p>
          <span class="d-block manager-hub-user-infos_text-small text-break">
            tech.ux.tests@interne.ovh.net
          </span>
          <span class="d-block manager-hub-user-infos_text-small">ls148374-ovh</span>
        </p>
      </div>
    </div>
    <div class="mb-4">
      <div class="manager-hub-payment-mean">
        <a
          class="d-flex flex-row align-items-center p-2 ng-isolate-scope"
          href="https://www.ovh.com/manager/dedicated/#/billing/payment/method"
        >
          <img
            aria-hidden="true"
            class="mr-1 ng-scope"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSIzNCIgdmlld0JveD0iMCAwIDUwIDM0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMgOCkiPgogICAgICAgIDxyZWN0IHdpZHRoPSIyMyIgaGVpZ2h0PSIxNyIgeD0iLjUiIHk9Ii41IiBzdHJva2U9IiMxMjI4NDQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgcng9IjEiLz4KICAgICAgICA8cGF0aCBzdHJva2U9IiMxMjI4NDQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE0LjUgNy41aDZNMTQuNSAxMC41aDYiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMTIyODQ0IiBkPSJNMTAuNjg5IDEyLjk5N2MtLjc1NC0uMjgtMS4yODMtLjU2Ny0xLjU5Ny0uODgxLS4xNy0uMTctLjI1Ny0uMzcyLS4yMTktLjYwMy4wNDItLjI1MS41NzMtLjgyNS41ODEtLjgzNi4yNjctLjM3OC40Mi0uODc2LjQyLTEuNjM1IDAtMS4yOTUtLjQzLTEuODM0LTEuMzc0LTEuODM0LS45NDQgMC0xLjM3NS41NC0xLjM3NSAxLjgzNCAwIC43NTkuMTUzIDEuMjU3LjQyIDEuNjM1LjAwOS4wMS41NC41ODUuNTgyLjgzNi4wMzguMjMxLS4wNS40MzMtLjIyLjYwMy0uMzEzLjMxNC0uODQyLjYwMS0xLjU5Ni44ODFhNC4xMDYgNC4xMDYgMCAwIDAgMi4xODkuNjI4Yy44MDQgMCAxLjU1NC0uMjMgMi4xODktLjYyOHptLjgxNS0uNjdhNC4xMjUgNC4xMjUgMCAxIDAtNi4wMDggMCAuNDU5LjQ1OSAwIDAgMSAuMTEtLjA1M2MuNzE0LS4yMzkgMS4yMi0uNDczIDEuNTEtLjY4NWEzLjA0NSAzLjA0NSAwIDAgMS0uMzE4LS4zODJjLS4zOC0uNTM2LS41OS0xLjIyLS41OS0yLjE2NSAwLTEuNzYyLjc5MS0yLjc1IDIuMjkyLTIuNzUgMS41IDAgMi4yOTIuOTg4IDIuMjkyIDIuNzUgMCAuOTQ2LS4yMTEgMS42My0uNTkgMi4xNjVhMy4wNDUgMy4wNDUgMCAwIDEtLjMxNy4zODJjLjI4OC4yMTIuNzk1LjQ0NiAxLjUxLjY4NS4wNC4wMTMuMDc2LjAzLjExLjA1M3pNOC41IDE0LjU0MmE1LjA0MiA1LjA0MiAwIDEgMSAwLTEwLjA4NCA1LjA0MiA1LjA0MiAwIDAgMSAwIDEwLjA4NHoiLz4KICAgIDwvZz4KPC9zdmc+Cg=="
            style=""
          />
          <div class="m-auto p-1 minw-0 w-100">
            <h3 data-translate="hub_payment_mean_title">Payment method</h3>
            <div class="manager-hub-payment-mean_label">
              <p class="m-0 text-truncate">
                Internal Account
              </p>
              <badge
                level="success"
                class="manager-hub-payment-mean_status"
                text-content="Valid"
              ></badge>
            </div>
          </div>
          <span class="ml-auto oui-icon oui-icon-arrow-right" aria-hidden="true"> </span>
        </a>
      </div>
    </div>
    <div class="mb-4">
      <div>
        <h3>{{ t('hub_user_panel_shortcuts_title') }}</h3>
        <div class="d-flex flex-wrap justify-content-around">
          <div
            v-for="shortcut in shortcutList"
            :key="shortcut.id"
            class="account-sidebar-shortcuts_links"
          >
            <div class="manager-hub-shortcut-tile">
              <a :href="shortcut.url" target="_blank"
                ><span :class="`manager-hub-shortcut-tile__icon oui-icon ${shortcut.icon}`"></span
              ></a>
            </div>
            <span class="manager-hub-shortcut-tile__description">{{
              t(`hub_user_panel_shortcuts_link_${shortcut.id}`)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-5 manager-hub-user-panel_links">
      <h3>{{ t('hub_links_title') }}</h3>
      <div v-for="link in usefulLinks" :key="link.href">
        <span class="manager-hub-user-panel_divider"></span>
        <a :href="link.href" class="d-flex">
          <span :class="link.icon"></span>
          <span> {{ t(link.label) }} </span>
        </a>
      </div>
    </div>
  </sidebar>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { Environment } from '@ovh-ux/manager-config';
import { emit } from '@ovh-ux/ufrontend/communication';
import shortcuts from '@/views/account-sidebar/shortcuts';
import links from '@/views/account-sidebar/panelLinks';
import { useI18n } from 'vue-i18n';
import useLoadTranslations from '@/composables/useLoadTranslations';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const translationFolders = ['shortcuts', 'useful-links'];
    useLoadTranslations(translationFolders);

    return {
      t,
    };
  },
  props: {
    closed: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    emit({ id: 'ovh.account-sidebar.ready' });
  },
  components: {
    Sidebar: defineAsyncComponent(() => import('@/components/ui/Sidebar')),
    Badge: defineAsyncComponent(() => import('@/components/ui/Badge')),
    // Tile: defineAsyncComponent(() => import('@/components/ui/Tile')),
  },
  computed: {
    shortcutList() {
      return shortcuts({}, Environment.getRegion());
    },
    usefulLinks() {
      return links({});
    },
  },
});
</script>

<style lang="scss" scoped>
.manager-hub-user-panel {
  @import '~@ovh-ux/ui-kit/dist/scss/_tokens.scss';
  @import '~bootstrap4/scss/_functions.scss';
  @import '~bootstrap4/scss/_variables.scss';
  @import '~bootstrap4/scss/_mixins.scss';
  @import '~bootstrap4/scss/_utilities.scss';
  @import '~bootstrap4/scss/_grid.scss';
  @import '~bootstrap4/scss/_buttons.scss';
  @import '~bootstrap4/scss/_button-group.scss';
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  width: 18.75rem;
  padding-left: 2.75rem;
  background-color: $p-075;
  height: 100%;
  padding: 2rem;
  padding-top: 3rem;
  overflow: auto;
  margin-bottom: 3rem !important;

  .minw-0 {
    min-width: 0;
  }

  h3 {
    font-size: 1rem;
    font-weight: $jupiter-font-weight;
    color: $p-800;

    * {
      color: inherit;
    }
  }

  p {
    line-height: inherit;
  }

  &_divider {
    display: block;
    border-top: 1px solid darken($p-075, 10%);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &_links {
    padding-bottom: 3rem !important;
    a,
    .btn-link {
      font-weight: bold;
      color: $p-500;
      padding: 0;
      text-decoration: none;
      white-space: initial;
      text-align: left;
      letter-spacing: normal;

      .oui-icon {
        line-height: 1;
        color: $p-500;
        font-size: 1.5rem;
        vertical-align: middle;
        margin-right: 1rem;
      }

      &:hover {
        text-decoration: none;
      }
    }
  }
}

.manager-hub-user-infos {
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  $circle-radius: 2.5rem;

  background-color: $p-000-white;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.075);
  text-align: center;
  border-radius: $hub-border-radius-default;
  padding: 0.25rem;
  color: $hub-text-color;

  hr {
    height: 1px;
    border: 0;
    color: #eee;
    background-color: #eee;
    margin-top: 2rem;
  }

  &_text-small {
    font-size: 0.9rem;
  }

  & &_initials {
    width: $circle-radius * 2;
    height: $circle-radius * 2;
    display: block;
    font-size: $circle-radius;
    padding-top: $circle-radius * 0.2;
    background-color: $p-300;
    color: $p-000-white !important;
    border-radius: $circle-radius;
    text-align: center;
    font-weight: normal;
  }

  & &_profile {
    &_link {
      color: $p-500;
      font-weight: 600;
    }

    &:hover,
    &:focus {
      text-decoration: none;

      .manager-hub-user-infos_initials {
        background-color: $p-400;
      }

      .manager-hub-user-infos_profile_link {
        color: $p-700;
      }
    }
  }

  p.oui-chip {
    color: $p-700;
    line-height: 1.875rem;
  }

  &_initials-centered {
    position: relative;
    top: -$circle-radius;
    margin: auto;
    margin-bottom: $circle-radius * -1.25;
  }

  &_user-name {
    button.btn.btn-link {
      text-decoration: none;
      width: 100%;

      span {
        color: $p-500;
        font-weight: 600;
      }

      .oui-icon {
        font-size: 1rem;
        vertical-align: middle;
        margin-left: 0.2rem;
        font-weight: 600;
      }
    }

    &__login {
      white-space: initial;
    }
  }

  &_role {
    white-space: initial;
  }

  &_links {
    clear: both;
    text-decoration: none;

    .btn.btn-link {
      color: $p-500;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        color: $p-700;
        text-decoration: none;
      }
    }
  }

  .oui-badge {
    font-size: 0.8rem;
    font-weight: bold;
  }
}

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

.manager-hub-shortcut-tile {
  @import '~@ovh-ux/ui-kit/dist/scss/_tokens';
  @import '~@ovh-ux/manager-hub/src/variables.scss';

  $notification-pill-font-color: $p-000-white;
  $notification-pill-bg-color: #b91a1a;
  $notification-pill-size: 1.2rem;

  text-align: center;

  > a {
    display: block;
    color: $p-800;
    font-weight: 600;

    &:hover {
      text-decoration: none;
    }
  }

  &__icon {
    display: flex;
    width: 4rem;
    height: 4rem;
    margin: auto;
    background-color: $p-000-white;
    border-radius: 0.4rem;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: $p-200;
    }
  }

  &__description {
    display: block;
    margin-top: 0.25rem;
    line-height: 1.25;
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    max-width: 4rem;
  }

  .oui-icon {
    font-size: 2rem;
    margin-top: 1rem;
    color: $p-800;
  }
}
</style>
