<template>
  <div class="tile" :style="`color:${textColor}`">
    <div :class="isShadowed ? 'oui-tile' : ''">
      <div class="ovh-manager-hub-tile__header" v-if="title">
        <h3 class="oui-tile__title" :class="link ? 'space-between' : ''">
          <span>
            {{ title }}
            <span v-if="count" class="oui-badge oui-badge_info">
              {{ count }}
            </span>
          </span>

          <button
            v-if="link"
            class="oui-button oui-button__icon-right hub-button oui-button_ghost"
            @click="goTo(link)"
          >
            <span class="hub-button__text">
              {{ t('manager_hub_products_see_all') }}
            </span>
          </button>
        </h3>
      </div>
      <div class="oui-tile__body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteRecordRaw, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    const router = useRouter();

    return {
      t,
      router,
    };
  },
  props: {
    title: String,
    count: Number,
    isShadowed: {
      type: Boolean,
      default: true,
    },
    textColor: String,
    link: {} as PropType<string | RouteRecordRaw>,
  },
  methods: {
    goTo(link: string | RouteRecordRaw): void {
      if (typeof link === 'string') {
        window.open(link, '_blank');
        return;
      }

      this.router.push(link);
    },
  },
});
</script>

<style lang="scss" scoped>
.space-between {
  display: flex;
  justify-content: space-between;
}
</style>
