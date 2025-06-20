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
  universe?: string;
  hasService?: boolean;
  id?: string;
  path?: string;
  serviceType?: string | string[];
  translation?: string;
  shortTranslation?: string;
  illustration?: string;
  svgIcon?: string;
  features?: string[];
  separator?: boolean;
  idAttr?: string;
  hideIfEmpty?: boolean;
  hideIfFeatures?: string[];
  badge?: string;
  forceVisibility?: boolean;
  forceNavigate?: boolean;
  url?: string | Record<string, string>;
  isExternal?: boolean;
  hidden?: boolean;
  routing?: NodeRouting;
  region?: string[];
  tag?: NodeTag;
  icon?: string;
  onClick?: () => void;
};
