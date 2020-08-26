<template>
  <a
    class="oui-button oui-button_l oui-button_primary oui-button_icon-right"
    :href="discoverUrl"
  >
    <span class="oui-button__text">{{ $t('sidebar_discover') }}</span>
    <span class="oui-icon oui-icon-chevron-right" aria-hidden="true"></span>
  </a>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useUFrontendBuildURL } from '../../composables/ufrontend'

export default defineComponent({
  name: 'Order',
  setup() {
    const discoverUrl = useUFrontendBuildURL('hub', '#/catalog')
    return {
      discoverUrl
    }
  },
});
</script>
