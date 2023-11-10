import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

var ODS_SKELETON_SIZE;
(function (ODS_SKELETON_SIZE) {
  ODS_SKELETON_SIZE["lg"] = "lg";
  ODS_SKELETON_SIZE["md"] = "md";
  ODS_SKELETON_SIZE["sm"] = "sm";
  ODS_SKELETON_SIZE["xl"] = "xl";
  ODS_SKELETON_SIZE["xs"] = "xs";
})(ODS_SKELETON_SIZE || (ODS_SKELETON_SIZE = {}));
Object.freeze(Object.values(ODS_SKELETON_SIZE));

const DEFAULT_ATTRIBUTE = Object.freeze({
  inline: false,
  randomized: false,
  size: ODS_SKELETON_SIZE.md,
});

const osdsSkeletonCss = "@charset \"UTF-8\";:host{position:relative;display:flex;min-height:0.5rem}:host::before{content:\" \";font-size:inherit}:host .loader{animation:skeleton linear 2s infinite;background-color:#f2f2f2;background-image:linear-gradient(-90deg, #f2f2f2, #e6e6e6 46%, #e6e6e6 61%, #f2f2f2);background-position:-200% 0;background-repeat:repeat-y;background-size:50% 12.5rem;border-radius:0.5rem;display:block;height:0.5rem;left:0;min-height:10px;position:absolute;right:0;top:50%;transform:translateY(-50%)}@keyframes skeleton{to{background-position:200% 0}}:host(:host([inline])){display:inline-block}:host([size=xs]){width:var(--ods-size-skeleton-xs-width)}:host([size=sm]){width:var(--ods-size-skeleton-sm-width)}:host([size=md]){width:var(--ods-size-skeleton-md-width)}:host([size=lg]){width:var(--ods-size-skeleton-lg-width)}:host([size=xl]){width:var(--ods-size-skeleton-xl-width)}";

const OsdsSkeleton = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    /** @see OdsSkeletonAttributes.inline */
    this.inline = DEFAULT_ATTRIBUTE.inline;
    /** @see OdsSkeletonAttributes.randomized */
    this.randomized = DEFAULT_ATTRIBUTE.randomized;
    /** @see OdsSkeletonAttributes.size */
    this.size = DEFAULT_ATTRIBUTE.size;
  }
  getRandomValue() {
    // between 30 and 100
    return Math.floor(Math.random() * (100 - 30)) + 30;
  }
  render() {
    const { inline, randomized } = this;
    return (h(Host, Object.assign({}, {
      'style': {
        width: !inline ? '100%' : randomized ? `${this.getRandomValue()}%` : '',
      }
    }), h("div", { class: "loader" })));
  }
  static get style() { return osdsSkeletonCss; }
}, [1, "osds-skeleton", {
    "inline": [516],
    "randomized": [516],
    "size": [513]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["osds-skeleton"];
  components.forEach(tagName => { switch (tagName) {
    case "osds-skeleton":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, OsdsSkeleton);
      }
      break;
  } });
}

export { OsdsSkeleton as O, defineCustomElement as d };
