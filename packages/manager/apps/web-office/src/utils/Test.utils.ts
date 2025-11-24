export type OdsEvent = {
  emit: (Record) => void;
};

export type OdsHTMLElement = HTMLElement & {
  onBlur: OdsEvent;
  onChange: OdsEvent;
};
