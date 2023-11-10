import { O as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';

var ODS_BUTTON_SIZE;
(function (ODS_BUTTON_SIZE) {
  ODS_BUTTON_SIZE["sm"] = "sm";
  ODS_BUTTON_SIZE["md"] = "md";
})(ODS_BUTTON_SIZE || (ODS_BUTTON_SIZE = {}));
Object.freeze(Object.values(ODS_BUTTON_SIZE));

var ODS_BUTTON_TYPE;
(function (ODS_BUTTON_TYPE) {
  ODS_BUTTON_TYPE["button"] = "button";
  ODS_BUTTON_TYPE["submit"] = "submit";
  ODS_BUTTON_TYPE["reset"] = "reset";
})(ODS_BUTTON_TYPE || (ODS_BUTTON_TYPE = {}));
Object.freeze(Object.values(ODS_BUTTON_TYPE));

var ODS_BUTTON_VARIANT;
(function (ODS_BUTTON_VARIANT) {
  ODS_BUTTON_VARIANT["flat"] = "flat";
  ODS_BUTTON_VARIANT["stroked"] = "stroked";
  ODS_BUTTON_VARIANT["ghost"] = "ghost";
})(ODS_BUTTON_VARIANT || (ODS_BUTTON_VARIANT = {}));
Object.freeze(Object.values(ODS_BUTTON_VARIANT));

var ODS_BUTTON_TEXT_ALIGN;
(function (ODS_BUTTON_TEXT_ALIGN) {
  ODS_BUTTON_TEXT_ALIGN["center"] = "center";
  ODS_BUTTON_TEXT_ALIGN["start"] = "start";
  ODS_BUTTON_TEXT_ALIGN["end"] = "end";
})(ODS_BUTTON_TEXT_ALIGN || (ODS_BUTTON_TEXT_ALIGN = {}));
Object.freeze(Object.values(ODS_BUTTON_TEXT_ALIGN));

const DEFAULT_ATTRIBUTE = Object.freeze({
  circle: false,
  color: ODS_THEME_COLOR_INTENT.default,
  contrasted: false,
  disabled: false,
  download: undefined,
  href: undefined,
  inline: false,
  rel: undefined,
  size: ODS_BUTTON_SIZE.md,
  target: undefined,
  textAlign: ODS_BUTTON_TEXT_ALIGN.center,
  type: ODS_BUTTON_TYPE.button,
  variant: ODS_BUTTON_VARIANT.flat,
});

export { DEFAULT_ATTRIBUTE as D, ODS_BUTTON_VARIANT as O, ODS_BUTTON_SIZE as a, ODS_BUTTON_TEXT_ALIGN as b };
