import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as ODS_THEME_COLOR_INTENT, O as ODS_THEME_TYPOGRAPHY_LEVEL, a as ODS_THEME_TYPOGRAPHY_SIZE, c as ODS_THEME_COLOR_HUE } from './ods-theme-typography-size2.js';

// TODO used only by text, keep or move to text?
function odsGenerateColorVariable(intent, hue, contrasted = false) {
    return `--ods-color-${intent}-${hue}${contrasted ? '-contrasted' : ''}`;
}

const DEFAULT_ATTRIBUTE = Object.freeze({
  breakSpaces: false,
  color: ODS_THEME_COLOR_INTENT.default,
  contrasted: false,
  level: ODS_THEME_TYPOGRAPHY_LEVEL.body,
  size: ODS_THEME_TYPOGRAPHY_SIZE._100,
  hue: ODS_THEME_COLOR_HUE._500,
});

const osdsTextCss = ":host([break-spaces]){white-space:break-spaces}:host(:not([color])){color:var(--ods-color-default-500)}:host([color^=default]){color:var(--ods-color-default-500)}:host([color^=primary]){color:var(--ods-color-primary-500)}:host([color^=text]){color:var(--ods-color-text-500)}:host([color^=accent]){color:var(--ods-color-accent-500)}:host([color^=error]){color:var(--ods-color-error-500)}:host([color^=warning]){color:var(--ods-color-warning-500)}:host([color^=success]){color:var(--ods-color-success-500)}:host([color^=info]){color:var(--ods-color-info-500)}:host([color^=promotion]){color:var(--ods-color-promotion-500)}:host([hue]:not([color])){color:var(--osds-text-color-specific-hue, var(--ods-color-default-500))}:host([hue][color^=default]){color:var(--osds-text-color-specific-hue, var(--ods-color-default-500))}:host([hue][color^=primary]){color:var(--osds-text-color-specific-hue, var(--ods-color-primary-500))}:host([hue][color^=text]){color:var(--osds-text-color-specific-hue, var(--ods-color-text-500))}:host([hue][color^=accent]){color:var(--osds-text-color-specific-hue, var(--ods-color-accent-500))}:host([hue][color^=error]){color:var(--osds-text-color-specific-hue, var(--ods-color-error-500))}:host([hue][color^=warning]){color:var(--osds-text-color-specific-hue, var(--ods-color-warning-500))}:host([hue][color^=success]){color:var(--osds-text-color-specific-hue, var(--ods-color-success-500))}:host([hue][color^=info]){color:var(--osds-text-color-specific-hue, var(--ods-color-info-500))}:host([hue][color^=promotion]){color:var(--osds-text-color-specific-hue, var(--ods-color-promotion-500))}:host([contrasted]:not([color])){color:var(--ods-color-default-500-contrasted)}:host([contrasted][color^=default]){color:var(--ods-color-default-500-contrasted)}:host([contrasted][color^=primary]){color:var(--ods-color-primary-500-contrasted)}:host([contrasted][color^=text]){color:var(--ods-color-text-500-contrasted)}:host([contrasted][color^=accent]){color:var(--ods-color-accent-500-contrasted)}:host([contrasted][color^=error]){color:var(--ods-color-error-500-contrasted)}:host([contrasted][color^=warning]){color:var(--ods-color-warning-500-contrasted)}:host([contrasted][color^=success]){color:var(--ods-color-success-500-contrasted)}:host([contrasted][color^=info]){color:var(--ods-color-info-500-contrasted)}:host([contrasted][color^=promotion]){color:var(--ods-color-promotion-500-contrasted)}:host([level=heading][size=\"100\"]){font-size:var(--ods-typography-heading-100-font-size);font-weight:var(--ods-typography-heading-100-font-weight);font-family:var(--ods-typography-heading-100-font-family);font-style:var(--ods-typography-heading-100-font-style);letter-spacing:var(--ods-typography-heading-100-letter-spacing);line-height:var(--ods-typography-heading-100-line-height)}:host([level=heading][size=\"200\"]){font-size:var(--ods-typography-heading-200-font-size);font-weight:var(--ods-typography-heading-200-font-weight);font-family:var(--ods-typography-heading-200-font-family);font-style:var(--ods-typography-heading-200-font-style);letter-spacing:var(--ods-typography-heading-200-letter-spacing);line-height:var(--ods-typography-heading-200-line-height)}:host([level=heading][size=\"300\"]){font-size:var(--ods-typography-heading-300-font-size);font-weight:var(--ods-typography-heading-300-font-weight);font-family:var(--ods-typography-heading-300-font-family);font-style:var(--ods-typography-heading-300-font-style);letter-spacing:var(--ods-typography-heading-300-letter-spacing);line-height:var(--ods-typography-heading-300-line-height)}:host([level=heading][size=\"400\"]){font-size:var(--ods-typography-heading-400-font-size);font-weight:var(--ods-typography-heading-400-font-weight);font-family:var(--ods-typography-heading-400-font-family);font-style:var(--ods-typography-heading-400-font-style);letter-spacing:var(--ods-typography-heading-400-letter-spacing);line-height:var(--ods-typography-heading-400-line-height)}:host([level=heading][size=\"500\"]){font-size:var(--ods-typography-heading-500-font-size);font-weight:var(--ods-typography-heading-500-font-weight);font-family:var(--ods-typography-heading-500-font-family);font-style:var(--ods-typography-heading-500-font-style);letter-spacing:var(--ods-typography-heading-500-letter-spacing);line-height:var(--ods-typography-heading-500-line-height)}:host([level=heading][size=\"600\"]){font-size:var(--ods-typography-heading-600-font-size);font-weight:var(--ods-typography-heading-600-font-weight);font-family:var(--ods-typography-heading-600-font-family);font-style:var(--ods-typography-heading-600-font-style);letter-spacing:var(--ods-typography-heading-600-letter-spacing);line-height:var(--ods-typography-heading-600-line-height)}:host([level=heading][size=\"700\"]){font-size:var(--ods-typography-heading-700-font-size);font-weight:var(--ods-typography-heading-700-font-weight);font-family:var(--ods-typography-heading-700-font-family);font-style:var(--ods-typography-heading-700-font-style);letter-spacing:var(--ods-typography-heading-700-letter-spacing);line-height:var(--ods-typography-heading-700-line-height)}:host([level=heading][size=\"800\"]){font-size:var(--ods-typography-heading-800-font-size);font-weight:var(--ods-typography-heading-800-font-weight);font-family:var(--ods-typography-heading-800-font-family);font-style:var(--ods-typography-heading-800-font-style);letter-spacing:var(--ods-typography-heading-800-letter-spacing);line-height:var(--ods-typography-heading-800-line-height)}:host([level=subheading][size=\"100\"]){font-size:var(--ods-typography-subheading-100-font-size);font-weight:var(--ods-typography-subheading-100-font-weight);font-family:var(--ods-typography-subheading-100-font-family);font-style:var(--ods-typography-subheading-100-font-style);letter-spacing:var(--ods-typography-subheading-100-letter-spacing);line-height:var(--ods-typography-subheading-100-line-height)}:host([level=subheading][size=\"200\"]){font-size:var(--ods-typography-subheading-200-font-size);font-weight:var(--ods-typography-subheading-200-font-weight);font-family:var(--ods-typography-subheading-200-font-family);font-style:var(--ods-typography-subheading-200-font-style);letter-spacing:var(--ods-typography-subheading-200-letter-spacing);line-height:var(--ods-typography-subheading-200-line-height)}:host([level=body][size=\"100\"]){font-size:var(--ods-typography-body-100-font-size);font-weight:var(--ods-typography-body-100-font-weight);font-family:var(--ods-typography-body-100-font-family);font-style:var(--ods-typography-body-100-font-style);letter-spacing:var(--ods-typography-body-100-letter-spacing);line-height:var(--ods-typography-body-100-line-height)}:host([level=body][size=\"200\"]){font-size:var(--ods-typography-body-200-font-size);font-weight:var(--ods-typography-body-200-font-weight);font-family:var(--ods-typography-body-200-font-family);font-style:var(--ods-typography-body-200-font-style);letter-spacing:var(--ods-typography-body-200-letter-spacing);line-height:var(--ods-typography-body-200-line-height)}:host([level=body][size=\"300\"]){font-size:var(--ods-typography-body-300-font-size);font-weight:var(--ods-typography-body-300-font-weight);font-family:var(--ods-typography-body-300-font-family);font-style:var(--ods-typography-body-300-font-style);letter-spacing:var(--ods-typography-body-300-letter-spacing);line-height:var(--ods-typography-body-300-line-height)}:host([level=body][size=\"400\"]){font-size:var(--ods-typography-body-400-font-size);font-weight:var(--ods-typography-body-400-font-weight);font-family:var(--ods-typography-body-400-font-family);font-style:var(--ods-typography-body-400-font-style);letter-spacing:var(--ods-typography-body-400-letter-spacing);line-height:var(--ods-typography-body-400-line-height)}:host([level=body][size=\"500\"]){font-size:var(--ods-typography-body-500-font-size);font-weight:var(--ods-typography-body-500-font-weight);font-family:var(--ods-typography-body-500-font-family);font-style:var(--ods-typography-body-500-font-style);letter-spacing:var(--ods-typography-body-500-letter-spacing);line-height:var(--ods-typography-body-500-line-height)}:host([level=body][size=\"600\"]){font-size:var(--ods-typography-body-600-font-size);font-weight:var(--ods-typography-body-600-font-weight);font-family:var(--ods-typography-body-600-font-family);font-style:var(--ods-typography-body-600-font-style);letter-spacing:var(--ods-typography-body-600-letter-spacing);line-height:var(--ods-typography-body-600-line-height)}:host([level=button][size=\"100\"]){font-size:var(--ods-typography-button-100-font-size);font-weight:var(--ods-typography-button-100-font-weight);font-family:var(--ods-typography-button-100-font-family);font-style:var(--ods-typography-button-100-font-style);letter-spacing:var(--ods-typography-button-100-letter-spacing);line-height:var(--ods-typography-button-100-line-height)}:host([level=caption][size=\"100\"]){font-size:var(--ods-typography-caption-100-font-size);font-weight:var(--ods-typography-caption-100-font-weight);font-family:var(--ods-typography-caption-100-font-family);font-style:var(--ods-typography-caption-100-font-style);letter-spacing:var(--ods-typography-caption-100-letter-spacing);line-height:var(--ods-typography-caption-100-line-height)}";

const OsdsText = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    /** @see OdsTextAttribute.breakSpaces */
    this.breakSpaces = DEFAULT_ATTRIBUTE.breakSpaces;
    /** @see OdsTextAttribute.color */
    this.color = DEFAULT_ATTRIBUTE.color;
    /** @see OdsTextAttribute.contrasted */
    this.contrasted = DEFAULT_ATTRIBUTE.contrasted;
    /** @see OdsTextAttribute.size */
    this.size = DEFAULT_ATTRIBUTE.size;
    /** @see OdsTextAttribute.level */
    this.level = DEFAULT_ATTRIBUTE.level;
    /** @see OdsTextAttribute.hue */
    this.hue = DEFAULT_ATTRIBUTE.hue;
  }
  render() {
    return (h(Host, Object.assign({}, {
      style: {
        '--osds-text-color-specific-hue': this.color && this.hue ? `var(${odsGenerateColorVariable(this.color, this.hue)})` : '',
      }
    }), h("slot", null)));
  }
  static get style() { return osdsTextCss; }
}, [1, "osds-text", {
    "breakSpaces": [516, "break-spaces"],
    "color": [513],
    "contrasted": [516],
    "size": [513],
    "level": [513],
    "hue": [513]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["osds-text"];
  components.forEach(tagName => { switch (tagName) {
    case "osds-text":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, OsdsText);
      }
      break;
  } });
}

export { OsdsText as O, defineCustomElement as d };
