import Vue from 'vue';
import { StrictStore } from 'vuex';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    store?: StrictStore;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $store: StrictStore;
  }
}
