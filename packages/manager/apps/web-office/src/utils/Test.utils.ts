export type OdsEvent = {
  emit: (Record) => void;
};

export type OdsHTMLElement = HTMLElement & {
  odsBlur: OdsEvent;
  odsChange: OdsEvent;
};
