import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { O as ODS_THEME_TYPOGRAPHY_LEVEL$1, a as ODS_THEME_TYPOGRAPHY_SIZE$1 } from './ods-theme-typography-size.js';
import { d as defineCustomElement$1 } from './osds-text2.js';

var ODS_THEME_COLOR_HUE;
(function (ODS_THEME_COLOR_HUE) {
    ODS_THEME_COLOR_HUE["_000"] = "000";
    ODS_THEME_COLOR_HUE["_050"] = "050";
    ODS_THEME_COLOR_HUE["_075"] = "075";
    ODS_THEME_COLOR_HUE["_100"] = "100";
    ODS_THEME_COLOR_HUE["_200"] = "200";
    ODS_THEME_COLOR_HUE["_300"] = "300";
    ODS_THEME_COLOR_HUE["_400"] = "400";
    ODS_THEME_COLOR_HUE["_500"] = "500";
    ODS_THEME_COLOR_HUE["_600"] = "600";
    ODS_THEME_COLOR_HUE["_700"] = "700";
    ODS_THEME_COLOR_HUE["_800"] = "800";
    ODS_THEME_COLOR_HUE["_900"] = "900";
    ODS_THEME_COLOR_HUE["_1000"] = "1000";
})(ODS_THEME_COLOR_HUE || (ODS_THEME_COLOR_HUE = {}));
Object.freeze(Object.values(ODS_THEME_COLOR_HUE));

var ODS_THEME_COLOR_INTENT;
(function (ODS_THEME_COLOR_INTENT) {
    ODS_THEME_COLOR_INTENT["accent"] = "accent";
    ODS_THEME_COLOR_INTENT["default"] = "default";
    ODS_THEME_COLOR_INTENT["error"] = "error";
    ODS_THEME_COLOR_INTENT["info"] = "info";
    ODS_THEME_COLOR_INTENT["primary"] = "primary";
    ODS_THEME_COLOR_INTENT["promotion"] = "promotion";
    ODS_THEME_COLOR_INTENT["success"] = "success";
    ODS_THEME_COLOR_INTENT["text"] = "text";
    ODS_THEME_COLOR_INTENT["warning"] = "warning";
})(ODS_THEME_COLOR_INTENT || (ODS_THEME_COLOR_INTENT = {}));
Object.freeze(Object.values(ODS_THEME_COLOR_INTENT));

// TODO not used, remove?
var ODS_THEME_SIZE;
(function (ODS_THEME_SIZE) {
    ODS_THEME_SIZE["_100"] = "100";
    ODS_THEME_SIZE["_200"] = "200";
    ODS_THEME_SIZE["_300"] = "300";
    ODS_THEME_SIZE["_400"] = "400";
    ODS_THEME_SIZE["_500"] = "500";
    ODS_THEME_SIZE["_600"] = "600";
    ODS_THEME_SIZE["_700"] = "700";
    ODS_THEME_SIZE["_800"] = "800";
    ODS_THEME_SIZE["_900"] = "900";
})(ODS_THEME_SIZE || (ODS_THEME_SIZE = {}));
Object.freeze(Object.values(ODS_THEME_SIZE));

var ODS_THEME_TYPOGRAPHY_LEVEL;
(function (ODS_THEME_TYPOGRAPHY_LEVEL) {
    ODS_THEME_TYPOGRAPHY_LEVEL["body"] = "body";
    ODS_THEME_TYPOGRAPHY_LEVEL["button"] = "button";
    ODS_THEME_TYPOGRAPHY_LEVEL["caption"] = "caption";
    ODS_THEME_TYPOGRAPHY_LEVEL["heading"] = "heading";
    ODS_THEME_TYPOGRAPHY_LEVEL["subheading"] = "subheading";
})(ODS_THEME_TYPOGRAPHY_LEVEL || (ODS_THEME_TYPOGRAPHY_LEVEL = {}));
Object.freeze(Object.values(ODS_THEME_TYPOGRAPHY_LEVEL));

var ODS_THEME_TYPOGRAPHY_SIZE;
(function (ODS_THEME_TYPOGRAPHY_SIZE) {
    ODS_THEME_TYPOGRAPHY_SIZE["_100"] = "100";
    ODS_THEME_TYPOGRAPHY_SIZE["_200"] = "200";
    ODS_THEME_TYPOGRAPHY_SIZE["_300"] = "300";
    ODS_THEME_TYPOGRAPHY_SIZE["_400"] = "400";
    ODS_THEME_TYPOGRAPHY_SIZE["_500"] = "500";
    ODS_THEME_TYPOGRAPHY_SIZE["_600"] = "600";
    ODS_THEME_TYPOGRAPHY_SIZE["_700"] = "700";
    ODS_THEME_TYPOGRAPHY_SIZE["_800"] = "800";
})(ODS_THEME_TYPOGRAPHY_SIZE || (ODS_THEME_TYPOGRAPHY_SIZE = {}));
Object.freeze(Object.values(ODS_THEME_TYPOGRAPHY_SIZE));

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
      return (h("tr", { key: `${log.timestamp}-${log.message}` }, log.timestamp && (h("td", null, h("osds-text", Object.assign({ level: ODS_THEME_TYPOGRAPHY_LEVEL$1.caption, size: ODS_THEME_TYPOGRAPHY_SIZE$1._200 }, messageColor), new Date(log.timestamp * 1000).toISOString()))), Object.entries(log)
        .filter(([key]) => key !== 'timestamp')
        .map(([, value]) => (h("td", { key: value }, h("osds-text", Object.assign({ level: ODS_THEME_TYPOGRAPHY_LEVEL$1.caption, size: ODS_THEME_TYPOGRAPHY_SIZE$1._200 }, messageColor), value))))));
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

export { MscTailLogsCode as M, ODS_THEME_COLOR_INTENT as O, defineCustomElement as d };
