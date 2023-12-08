import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';

var ODS_DIVIDER_SIZE;
(function (ODS_DIVIDER_SIZE) {
  ODS_DIVIDER_SIZE["zero"] = "0";
  ODS_DIVIDER_SIZE["one"] = "1";
  ODS_DIVIDER_SIZE["two"] = "2";
  ODS_DIVIDER_SIZE["three"] = "3";
  ODS_DIVIDER_SIZE["four"] = "4";
  ODS_DIVIDER_SIZE["five"] = "5";
  ODS_DIVIDER_SIZE["six"] = "6";
  ODS_DIVIDER_SIZE["seven"] = "7";
  ODS_DIVIDER_SIZE["eight"] = "8";
  ODS_DIVIDER_SIZE["nine"] = "9";
  ODS_DIVIDER_SIZE["ten"] = "10";
})(ODS_DIVIDER_SIZE || (ODS_DIVIDER_SIZE = {}));
Object.freeze(Object.values(ODS_DIVIDER_SIZE));

const DEFAULT_ATTRIBUTE = Object.freeze({
  color: ODS_THEME_COLOR_INTENT.default,
  contrasted: false,
  separator: false,
  size: ODS_DIVIDER_SIZE.six,
});

const osdsDividerCss = "@charset \"UTF-8\";:host{padding:0;border:none;display:flex;width:100%}@media not all and (-webkit-min-device-pixel-ratio: 0), not all and (min-resolution: 0.001dpcm){@supports (-webkit-appearance: none){:host{height:-moz-fit-content;height:fit-content}}}:host hr{border:none;margin:0;width:100%}:host(:not([color])) hr{background-color:var(--ods-color-default-100)}:host([color^=default]) hr{background-color:var(--ods-color-default-100)}:host([color^=primary]) hr{background-color:var(--ods-color-primary-100)}:host([color^=text]) hr{background-color:var(--ods-color-text-100)}:host([color^=accent]) hr{background-color:var(--ods-color-accent-100)}:host([color^=error]) hr{background-color:var(--ods-color-error-100)}:host([color^=warning]) hr{background-color:var(--ods-color-warning-100)}:host([color^=success]) hr{background-color:var(--ods-color-success-100)}:host([color^=info]) hr{background-color:var(--ods-color-info-100)}:host([color^=promotion]) hr{background-color:var(--ods-color-promotion-100)}:host([contrasted]:not([color])) hr{background-color:var(--ods-color-default-100-contrasted)}:host([contrasted][color^=default]) hr{background-color:var(--ods-color-default-100-contrasted)}:host([contrasted][color^=primary]) hr{background-color:var(--ods-color-primary-100-contrasted)}:host([contrasted][color^=text]) hr{background-color:var(--ods-color-text-100-contrasted)}:host([contrasted][color^=accent]) hr{background-color:var(--ods-color-accent-100-contrasted)}:host([contrasted][color^=error]) hr{background-color:var(--ods-color-error-100-contrasted)}:host([contrasted][color^=warning]) hr{background-color:var(--ods-color-warning-100-contrasted)}:host([contrasted][color^=success]) hr{background-color:var(--ods-color-success-100-contrasted)}:host([contrasted][color^=info]) hr{background-color:var(--ods-color-info-100-contrasted)}:host([contrasted][color^=promotion]) hr{background-color:var(--ods-color-promotion-100-contrasted)}:host([size=\"0\"]){margin:calc(var(--ods-size-divider-0-margin-y) / 2) 0}:host([size=\"0\"]) hr{height:var(--ods-size-divider-0-height)}:host([size=\"1\"]){margin:calc(var(--ods-size-divider-1-margin-y) / 2) 0}:host([size=\"1\"]) hr{height:var(--ods-size-divider-1-height)}:host([size=\"2\"]){margin:calc(var(--ods-size-divider-2-margin-y) / 2) 0}:host([size=\"2\"]) hr{height:var(--ods-size-divider-2-height)}:host([size=\"3\"]){margin:calc(var(--ods-size-divider-3-margin-y) / 2) 0}:host([size=\"3\"]) hr{height:var(--ods-size-divider-3-height)}:host([size=\"4\"]){margin:calc(var(--ods-size-divider-4-margin-y) / 2) 0}:host([size=\"4\"]) hr{height:var(--ods-size-divider-4-height)}:host([size=\"5\"]){margin:calc(var(--ods-size-divider-5-margin-y) / 2) 0}:host([size=\"5\"]) hr{height:var(--ods-size-divider-5-height)}:host([size=\"6\"]){margin:calc(var(--ods-size-divider-6-margin-y) / 2) 0}:host([size=\"6\"]) hr{height:var(--ods-size-divider-6-height)}:host([size=\"7\"]){margin:calc(var(--ods-size-divider-7-margin-y) / 2) 0}:host([size=\"7\"]) hr{height:var(--ods-size-divider-7-height)}:host([size=\"8\"]){margin:calc(var(--ods-size-divider-8-margin-y) / 2) 0}:host([size=\"8\"]) hr{height:var(--ods-size-divider-8-height)}:host([size=\"9\"]){margin:calc(var(--ods-size-divider-9-margin-y) / 2) 0}:host([size=\"9\"]) hr{height:var(--ods-size-divider-9-height)}:host([size=\"10\"]){margin:calc(var(--ods-size-divider-10-margin-y) / 2) 0}:host([size=\"10\"]) hr{height:var(--ods-size-divider-10-height)}";

const OsdsDivider = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    /** @see OdsDividerAttributes.separator */
    this.separator = DEFAULT_ATTRIBUTE.separator;
    /** @see OdsDividerAttributes.color */
    this.color = DEFAULT_ATTRIBUTE.color;
    /** @see OdsDividerAttributes.size */
    this.size = DEFAULT_ATTRIBUTE.size;
    /** @see OdsDividerAttributes.contrasted */
    this.contrasted = DEFAULT_ATTRIBUTE.contrasted;
  }
  render() {
    const { separator } = this;
    return (h(Host, null, separator ? h("hr", null) : h("span", null)));
  }
  get el() { return this; }
  static get style() { return osdsDividerCss; }
}, [1, "osds-divider", {
    "separator": [516],
    "color": [513],
    "size": [513],
    "contrasted": [516]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["osds-divider"];
  components.forEach(tagName => { switch (tagName) {
    case "osds-divider":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, OsdsDivider);
      }
      break;
  } });
}

export { OsdsDivider as O, defineCustomElement as d };
