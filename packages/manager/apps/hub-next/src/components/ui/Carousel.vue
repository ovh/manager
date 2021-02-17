<template>
  <div class="carousel w-100">
    <div class="oui-message oui-message_error">
      <span :class="`oui-message__icon oui-icon oui-icon-${level}`"> </span>
      <transition name="fade" appear mode="out-in">
        <span
          v-html="messages[activeMessageIndex]"
          :key="activeMessageIndex"
          class="oui-message__body"
        ></span>
      </transition>
      <div class="oui-message__bullets" v-if="messages.length > 1">
        <button
          type="button"
          v-for="(el, index) in messages"
          :key="el"
          class="circular-tile"
          :class="index === activeMessageIndex ? 'circular-tile_active' : ''"
          @click="goToMessage(index)"
        ></button>
      </div>
      <button
        v-if="messages.length > 1"
        class="oui-message__next oui-button oui-button_s"
        type="button"
        @click="nextMessage"
      >
        <span class="oui-icon oui-icon-arrow-right" aria-hidden="true"></span>
        <span class="sr-only"> {{ t('manager_hub_carousel_see_next') }} </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'carousel',
  setup() {
    const { t } = useI18n();

    return {
      t,
    };
  },
  props: {
    messages: {
      type: Array as PropType<Array<string>>,
      default: [],
    },
    level: {
      type: String,
      default: 'warning',
    },
  },
  data() {
    return {
      activeMessageIndex: 0,
    };
  },
  methods: {
    nextMessage(): void {
      if (this.activeMessageIndex === this.messages.length - 1) {
        this.activeMessageIndex = 0;
      } else {
        this.activeMessageIndex += 1;
      }
    },
    goToMessage(indexTo: number): void {
      this.activeMessageIndex = indexTo;
    },
  },
});
</script>

<style lang="scss" scoped>
.carousel {
  @import '@ovh-ux/ui-kit/dist/scss/_tokens';

  .oui-message {
    padding: 1rem 3rem;
    transition: all 0.5 linear;

    &__next {
      position: absolute;
      top: 50%;
      right: 0.5rem;
      margin-top: -1rem;

      .oui-icon {
        font-size: 1.5rem;
      }
    }

    &__bullets {
      text-align: center;
    }

    &__body {
      font-weight: 600;
    }
  }

  a.oui-message__body {
    &:hover,
    &:focus,
    &:active {
      text-decoration-color: $ae-500;
      color: $ae-500;
    }
  }

  .circular-tile {
    display: inline-block;
    margin: 0.25rem;
    border-radius: 0.625rem;
    background-color: $p-000-white;
    padding: 0.1875rem;
    border: $ae-500;
    cursor: pointer;

    &_active {
      background-color: $ae-500;
    }
  }
}

.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
