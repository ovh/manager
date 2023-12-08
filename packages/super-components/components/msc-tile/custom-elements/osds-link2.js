import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { b as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';
import { O as OdsLogger, a as OdsWarnComponentAttribute, b as OdsHTMLAnchorElementTarget } from './ods-html-anchor-element-target.js';

const DEFAULT_ATTRIBUTE = Object.freeze({
  color: ODS_THEME_COLOR_INTENT.default,
  contrasted: false,
  disabled: false,
  download: undefined,
  href: undefined,
  referrerpolicy: undefined,
  rel: undefined,
  target: undefined,
  type: undefined,
});

/**
 * common controller logic for link component used by the different implementations.
 * it contains all the glue between framework implementation and the third party service.
 */
class OdsLinkController {
  constructor(component) {
    this.logger = new OdsLogger('OdsLinkController');
    this.component = component;
  }
  /**
   * validating that the color and the target have correct values
   * and warn the user if not
   */
  validateAttributes() {
    const logger = this.logger;
    OdsWarnComponentAttribute({
      logger,
      attributeValues: ODS_THEME_COLOR_INTENT,
      attributeName: 'color',
      attribute: this.component.color
    });
    if (this.component.href && !this.component.target) {
      this.component.target = OdsHTMLAnchorElementTarget._self;
    }
    this.component.href && OdsWarnComponentAttribute({
      logger,
      attributeValues: OdsHTMLAnchorElementTarget,
      attributeName: 'target',
      attribute: this.component.target,
    });
  }
}

const osdsLinkCss = ":host{display:inline-flex}:host .link{cursor:pointer;text-decoration:none;outline:none;-webkit-user-select:auto;-moz-user-select:auto;user-select:auto}:host .link__centered-text{background-position:0 100%;background-repeat:no-repeat;background-size:0 var(--ods-size-02);transition:background-size 0.2s ease-in, color ease-in-out 0.1s}::slotted([slot=start]),::slotted([slot=end]){display:inline-flex;align-self:center}:host(:not([href])) .link,:host([href=\"\"]) .link{-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;padding:0;text-align:inherit}:host(:not([disabled]):hover) .link__centered-text,:host(:not([disabled]):focus) .link__centered-text{background-size:100% var(--ods-size-02);transition:background-size 0.2s ease-out}:host(:not([disabled]):focus){outline-style:dotted;outline-width:var(--ods-size-inset-02);outline-offset:var(--ods-size-inset-03)}:host(:not([disabled]):focus) .link__centered-text{outline:none}:active .link__centered-text{transition:color ease-in-out 0s}:host([disabled]){cursor:not-allowed;opacity:0.5}:host([disabled]) .link{pointer-events:none}:host .link__centered-text{background-image:linear-gradient(currentColor, currentColor)}:host(:not([href])) .link,:host([href=\"\"]) .link{background-color:transparent}:host(:not([color])) .link{color:var(--ods-color-default-500)}:host([color^=default]) .link{color:var(--ods-color-default-500)}:host([color^=primary]) .link{color:var(--ods-color-primary-500)}:host([color^=text]) .link{color:var(--ods-color-text-500)}:host([color^=accent]) .link{color:var(--ods-color-accent-500)}:host([color^=error]) .link{color:var(--ods-color-error-500)}:host([color^=warning]) .link{color:var(--ods-color-warning-500)}:host([color^=success]) .link{color:var(--ods-color-success-500)}:host([color^=info]) .link{color:var(--ods-color-info-500)}:host([color^=promotion]) .link{color:var(--ods-color-promotion-500)}:host(:not([color]):hover) .link,:host(:not([color]):focus) .link{color:var(--ods-color-default-700)}:host([color^=default]:hover) .link,:host([color^=default]:focus) .link{color:var(--ods-color-default-700)}:host([color^=primary]:hover) .link,:host([color^=primary]:focus) .link{color:var(--ods-color-primary-700)}:host([color^=text]:hover) .link,:host([color^=text]:focus) .link{color:var(--ods-color-text-700)}:host([color^=accent]:hover) .link,:host([color^=accent]:focus) .link{color:var(--ods-color-accent-700)}:host([color^=error]:hover) .link,:host([color^=error]:focus) .link{color:var(--ods-color-error-700)}:host([color^=warning]:hover) .link,:host([color^=warning]:focus) .link{color:var(--ods-color-warning-700)}:host([color^=success]:hover) .link,:host([color^=success]:focus) .link{color:var(--ods-color-success-700)}:host([color^=info]:hover) .link,:host([color^=info]:focus) .link{color:var(--ods-color-info-700)}:host([color^=promotion]:hover) .link,:host([color^=promotion]:focus) .link{color:var(--ods-color-promotion-700)}:host(:not([color]):active) .link{color:var(--ods-color-default-800)}:host([color^=default]:active) .link{color:var(--ods-color-default-800)}:host([color^=primary]:active) .link{color:var(--ods-color-primary-800)}:host([color^=text]:active) .link{color:var(--ods-color-text-800)}:host([color^=accent]:active) .link{color:var(--ods-color-accent-800)}:host([color^=error]:active) .link{color:var(--ods-color-error-800)}:host([color^=warning]:active) .link{color:var(--ods-color-warning-800)}:host([color^=success]:active) .link{color:var(--ods-color-success-800)}:host([color^=info]:active) .link{color:var(--ods-color-info-800)}:host([color^=promotion]:active) .link{color:var(--ods-color-promotion-800)}:host([contrasted]:not([color])) .link{color:var(--ods-color-default-500-contrasted)}:host([contrasted][color^=default]) .link{color:var(--ods-color-default-500-contrasted)}:host([contrasted][color^=primary]) .link{color:var(--ods-color-primary-500-contrasted)}:host([contrasted][color^=text]) .link{color:var(--ods-color-text-500-contrasted)}:host([contrasted][color^=accent]) .link{color:var(--ods-color-accent-500-contrasted)}:host([contrasted][color^=error]) .link{color:var(--ods-color-error-500-contrasted)}:host([contrasted][color^=warning]) .link{color:var(--ods-color-warning-500-contrasted)}:host([contrasted][color^=success]) .link{color:var(--ods-color-success-500-contrasted)}:host([contrasted][color^=info]) .link{color:var(--ods-color-info-500-contrasted)}:host([contrasted][color^=promotion]) .link{color:var(--ods-color-promotion-500-contrasted)}:host .link__text-container{font-family:var(--ods-typography-body-500-font-family);font-size:var(--ods-typography-body-500-font-size);font-style:var(--ods-typography-body-500-font-style);font-weight:var(--ods-typography-body-500-font-weight);letter-spacing:var(--ods-typography-body-500-letter-spacing);line-height:var(--ods-typography-body-500-line-height)}:host .link__text-container{display:inline-flex;align-items:baseline}";

const OsdsLink = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.controller = new OdsLinkController(this);
    /** @see OdsLinkAttributes.color */
    this.color = DEFAULT_ATTRIBUTE.color;
    /** @see OdsLinkAttributes.contrasted */
    this.contrasted = DEFAULT_ATTRIBUTE.contrasted;
    /** @see OdsLinkAttributes.disabled */
    this.disabled = DEFAULT_ATTRIBUTE.disabled;
    /** @see OdsLinkAttributes.download */
    this.download = DEFAULT_ATTRIBUTE.download;
    /** @see OdsLinkAttributes.href */
    this.href = DEFAULT_ATTRIBUTE.href;
    /** @see OdsLinkAttributes.referrerpolicy */
    this.referrerpolicy = DEFAULT_ATTRIBUTE.referrerpolicy;
    /** @see OdsLinkAttributes.rel */
    this.rel = DEFAULT_ATTRIBUTE.rel;
    /** @see OdsLinkAttributes.target */
    this.target = DEFAULT_ATTRIBUTE.target;
    /** @see OdsLinkAttributes.type */
    this.type = DEFAULT_ATTRIBUTE.type;
  }
  /**
   * @see OdsLinkBehavior.beforeRender
   */
  beforeRender() {
    this.controller.validateAttributes();
  }
  componentWillRender() {
    this.beforeRender();
  }
  render() {
    const { download, href, referrerpolicy, rel, target, type } = this;
    const content = (h("span", { class: 'link__text-container' }, h("slot", { name: 'start' }), h("span", { class: 'link__centered-text' }, h("slot", null)), h("slot", { name: 'end' })));
    let template;
    if (href) {
      template = (h("a", Object.assign({}, {
        class: 'link',
        part: 'link',
        download,
        href,
        referrerpolicy,
        rel,
        tabindex: this.disabled ? -1 : 0,
        target,
        type,
      }), content));
    }
    else {
      template = (h("button", Object.assign({}, {
        class: 'link',
        disabled: this.disabled,
        part: 'link',
        tabindex: this.disabled ? -1 : 0,
      }), content));
    }
    return (h(Host, null, template));
  }
  get host() { return this; }
  static get style() { return osdsLinkCss; }
}, [1, "osds-link", {
    "color": [513],
    "contrasted": [516],
    "disabled": [516],
    "download": [1],
    "href": [513],
    "referrerpolicy": [513],
    "rel": [513],
    "target": [1537],
    "type": [513]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["osds-link"];
  components.forEach(tagName => { switch (tagName) {
    case "osds-link":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, OsdsLink);
      }
      break;
  } });
}

export { OsdsLink as O, defineCustomElement as d };
