<template>
  <div class="manager-hub-user-infos">
    <a href="" class="manager-hub-user-infos_profile oui-tooltip__trigger">
      <span
        class="manager-hub-user-infos_initials manager-hub-user-infos_initials-centered ng-binding"
        >{{ userInitials }}</span
      >
      <p class="oui-chip mb-1">
        <span class="manager-hub-user-infos_text-small">
          {{ t('hub_user_support_level_standard') }}
        </span>
      </p>
      <p class="manager-hub-user-infos_profile_link mb-1">
        {{ userFullName }}
      </p>
    </a>
    <p>
      <span class="d-block manager-hub-user-infos_text-small text-break">
        {{ user.email }}
      </span>
      <span class="d-block manager-hub-user-infos_text-small"> {{ user.nichandle }} </span>
    </p>
  </div>
</template>

<script lang="ts">
import useLoadTranslations from '@/composables/useLoadTranslations';
import { User } from '@/models/user';
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const translationFolders = ['user-infos'];
    useLoadTranslations(translationFolders);

    return {
      t,
    };
  },
  props: {
    user: {
      type: Object as PropType<User>,
      default: {},
    },
  },
  computed: {
    userFullName(): string {
      return `${this.user.firstname} ${this.user.name}`;
    },
    userInitials(): string {
      return this.user?.firstname && this.user.name
        ? `${this.user.firstname[0]}${this.user.name[0]}`
        : '';
    },
  },
});
</script>

<style lang="scss" scoped>
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
</style>
