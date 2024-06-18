export type NodeRouting = {
  application?: string;
  hash?: string;
};

export enum NodeTag {
  ALPHA = 'alpha',
  BETA = 'beta',
  NEW = 'new',
}

export type Node = {
  children?: Node[];
  parent?: Node;
  count?: number | boolean;
  id?: string;
  path?: string;
  serviceType?: string | string[];
  translation?: string;
  shortTranslation?: string;
  illustration?: string;
  features?: string[];
  separator?: boolean;
  idAttr?: string;
  hideIfEmpty?: boolean;
  forceVisibility?: boolean;
  url?: string | Record<string, string>;
  isExternal?: boolean;
  routing?: NodeRouting;
  region?: string[];
  tag?: NodeTag;
};
