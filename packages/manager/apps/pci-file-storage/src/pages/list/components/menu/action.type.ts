export type TShareActionLink = {
  path: string;
  isExternal?: boolean;
  isTargetBlank?: boolean;
};

export type TShareAction = {
  label: string;
  link: TShareActionLink;
  isCritical?: boolean;
};
