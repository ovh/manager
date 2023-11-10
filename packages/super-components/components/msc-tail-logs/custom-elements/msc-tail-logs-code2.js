import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { a as ODS_THEME_TYPOGRAPHY_LEVEL, b as ODS_THEME_TYPOGRAPHY_SIZE, O as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';
import { d as defineCustomElement$1 } from './osds-text2.js';

const mscTailLogsCodeCss = ".msc-tail-logs-table-wrapper{width:100%;border-collapse:collapse;margin-top:var(--ods-size-04);table-layout:fixed}.msc-tail-logs-table-wrapper th,.msc-tail-logs-table-wrapper td{text-align:left;padding:var(--ods-size-03);width:auto;word-wrap:break-word}";

function getMessageColor(message) {
  if (/warning/i.test(message) ||
    /status\s*>=\s*300\s*&&\s*status\s*<\s*499/i.test(message)) {
    return { color: ODS_THEME_COLOR_INTENT.warning };
  }
  if (/crit|alert|emerg/i.test(message) || /status\s*> 499/i.test(message)) {
    return { color: ODS_THEME_COLOR_INTENT.error };
  }
  if (/debug/i.test(message)) {
    return { color: ODS_THEME_COLOR_INTENT.default };
  }
  return { color: ODS_THEME_COLOR_INTENT.default, contrasted: true };
}
const MscTailLogsCode = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.logs = [];
  }
  render() {
    return (h("table", { class: "msc-tail-logs-table-wrapper" }, h("thead", null, h("tr", null, this.logs[0].timestamp && h("th", null, "Timestamp"), Object.keys(this.logs[0])
      .filter((key) => key !== 'timestamp')
      .map((entryName) => (h("th", { key: entryName }, entryName))))), h("tbody", null, this.logs.map((log) => {
      const messageColor = getMessageColor(log.message);
      return (h("tr", { key: `${log.timestamp}-${log.message}` }, log.timestamp && (h("td", null, h("osds-text", Object.assign({ level: ODS_THEME_TYPOGRAPHY_LEVEL.caption, size: ODS_THEME_TYPOGRAPHY_SIZE._200 }, messageColor), new Date(log.timestamp * 1000).toISOString()))), Object.entries(log)
        .filter(([key]) => key !== 'timestamp')
        .map(([, value]) => (h("td", { key: value }, h("osds-text", Object.assign({ level: ODS_THEME_TYPOGRAPHY_LEVEL.caption, size: ODS_THEME_TYPOGRAPHY_SIZE._200 }, messageColor), value))))));
    }))));
  }
  static get style() { return mscTailLogsCodeCss; }
}, [1, "msc-tail-logs-code", {
    "logs": [16]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["msc-tail-logs-code", "osds-text"];
  components.forEach(tagName => { switch (tagName) {
    case "msc-tail-logs-code":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MscTailLogsCode);
      }
      break;
    case "osds-text":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { MscTailLogsCode as M, defineCustomElement as d };
