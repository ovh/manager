export type TShareActionLink = {
  path: string;
  isExternal?: boolean;
  isTargetBlank?: boolean;
};

export type TShareAction = {
  labelTranslationKey: string;
  link: TShareActionLink;
  isCritical?: boolean;
};
