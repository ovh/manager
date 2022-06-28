export type NodeRouting = {
  application?: string;
  hash?: string;
};

export type Node = {
  children?: Node[];
  parent?: Node;
  count?: number | boolean;
  id?: string;
  path?: string;
  serviceType?: string | string[];
  translation?: string;
  features?: string[];
  separator?: boolean;
  idAttr?: string;
  hideIfEmpty?: boolean;
  forceVisibility?: boolean;
  url?: string | Record<string, string>;
  isExternal?: boolean;
  routing?: NodeRouting;
  region?: string[];
};
