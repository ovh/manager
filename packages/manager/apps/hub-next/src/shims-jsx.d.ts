import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface ElementAttributesProperty {
      $props: {};
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
